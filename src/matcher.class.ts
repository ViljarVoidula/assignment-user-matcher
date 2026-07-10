import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { checkCidrMatch } from './utils/cidr';
import { checkGeoMatch, isValidLatitude, isValidLongitude } from './utils/geo';
import { createKeyBuilders, type KeyBuilders } from './utils/keys';
import {
    getAllAssignmentsFromStores,
    getAssignmentCountsFromStores,
    getAssignmentById,
    getAssignmentsByIdsBatch,
    getAssignmentsPaginatedFromStores,
    type PaginationOptions,
    type PaginationResult,
    type AssignmentCounts,
} from './queries/pagination';
import { calculateMatchScore, calculateDefaultPriority } from './scoring/match-score';
import { extractMatchFeatures } from './learning/features';
import { LearningManager } from './managers/LearningManager';
import { ReliabilityManager } from './managers/ReliabilityManager';
import { TelemetryManager } from './managers/TelemetryManager';
import { WorkflowManager, type WorkflowHost, type MachineTaskHandler } from './managers/WorkflowManager';
import type {
    RedisClientType,
    User,
    Assignment,
    Stats,
    PendingAssignmentInfo,
    MatcherOptions,
    WorkflowDefinition,
    WorkflowDefinitionInput,
    WorkflowDefinitionSummary,
    WorkflowInstance,
    WorkflowEvent,
    AssignmentResult,
    DeadLetterEntry,
    AuditEntry,
    WorkflowInstanceWithSnapshot,
    LearningFeatureExtractor,
    LearningFeatures,
    LearningAssignmentContext,
    LearningSignals,
    LearningSample,
    LearningStats,
    LearningTagStat,
    GeoMatchResult,
    GeoMatchingFunction,
    ReliabilityMetrics,
    CircuitBreakerState,
    WorkflowEngineMetrics,
} from './types/matcher';

// Re-export types for backwards compatibility
export type {
    RedisClientType,
    User,
    Assignment,
    Stats,
    PendingAssignmentInfo,
    MatcherOptions,
    options,
    GeoMatchResult,
    GeoMatchingFunction,
    ReliabilityMetrics,
    WorkflowInstanceStatus,
    WorkflowRouting,
} from './types/matcher';
// Export workflow types
export type {
    WorkflowDefinition,
    WorkflowDefinitionInput,
    WorkflowDefinitionSummary,
    WorkflowInstance,
    WorkflowStep,
    WorkflowTargetUser,
    WorkflowMachineTask,
    WorkflowTaskType,
    WorkflowEvent,
    WorkflowEventType,
    AssignmentResult,
    ParallelBranchState,
    DeadLetterEntry,
    AuditEntry,
    CircuitBreakerState,
    WorkflowInstanceWithSnapshot,
    LearningOutcome,
    LearningRewards,
    LearningFeatures,
    LearningAssignmentContext,
    LearningFeatureExtractor,
    LearningDecisionRecord,
    LearningEpisodeRecord,
    LearningSignals,
    LearningSample,
    LearningStats,
    LearningTagStat,
    AutoRoutingWeightsOptions,
    WorkflowEngineMetrics,
} from './types/matcher';
export type { MachineTaskHandler, WorkflowHost } from './managers/WorkflowManager';
export type { AssignmentStatus, PaginationOptions, PaginationResult, AssignmentCounts } from './queries/pagination';

// Load Lua scripts from files
const LUA_SCRIPTS_DIR = join(__dirname, 'lua');

/**
 * Load a Lua script from the lua directory.
 * Falls back to empty string if file not found.
 */
function loadLuaScript(filename: string): string {
    try {
        return readFileSync(join(LUA_SCRIPTS_DIR, filename), 'utf-8');
    } catch {
        console.warn(`Lua script not found: ${filename}`);
        return '';
    }
}

// Lua script for atomic workflow transitions
const WORKFLOW_TRANSITION_LUA = loadLuaScript('workflow-transition.lua');

export default class AssignmentMatcher implements WorkflowHost {
    relevantBatchSize: number;
    redisPrefix: string;
    assignmentsKey: string;
    assignmentsRefKey: string;
    usersKey: string;
    maxUserBacklogSize: number;
    enableDefaultMatching: boolean;
    matchExpirationMs: number;
    idleUserTimeoutMs: number | null;
    pendingAssignmentsKey: string;
    pendingAssignmentsExpiryKey: string;
    assignmentOwnerKey: string;
    allTagsKey: string;
    acceptedAssignmentsKey: string;
    private keys: KeyBuilders;

    // Workflow-related properties
    private enableWorkflows: boolean;
    private streamConsumerGroup: string;
    private streamConsumerName: string;
    private workflow: WorkflowManager;
    completedAssignmentsKey: string;

    // Enterprise reliability properties
    private reliability: ReliabilityManager;
    private telemetry: TelemetryManager;
    private luaScriptSha: string | null = null;
    private usingDefaultMatchScore: boolean;
    private readonly readyPromise: Promise<this>;

    // Learning (contextual bandit) properties
    private enableLearning: boolean;
    private enableAutoRoutingWeights: boolean;
    private learning: LearningManager;
    private learningFeatureExtractor: LearningFeatureExtractor;
    private enableGeoMatching: boolean;
    private geoDefaultMaxDistanceKm?: number;
    private geoScoreWeight: number;
    private geoMatchingFunction?: GeoMatchingFunction;

    constructor(
        public redisClient: RedisClientType,
        options?: MatcherOptions,
    ) {
        this.relevantBatchSize = options?.relevantBatchSize ?? 50;
        this.enableDefaultMatching = options?.enableDefaultMatching ?? true;
        this.redisPrefix = options?.redisPrefix ?? '';

        // Initialize key builders
        this.keys = createKeyBuilders({ prefix: this.redisPrefix });

        this.usersKey = this.keys.users();
        this.assignmentsKey = this.keys.assignments();
        this.assignmentsRefKey = this.keys.assignmentsRef();
        this.maxUserBacklogSize = options?.maxUserBacklogSize ?? 9;
        this.matchExpirationMs = options?.matchExpirationMs ?? 60000;
        this.idleUserTimeoutMs = options?.idleUserTimeoutMs ?? null;
        this.pendingAssignmentsKey = this.keys.pendingAssignmentsData();
        this.pendingAssignmentsExpiryKey = this.keys.pendingAssignmentsExpiry();
        this.assignmentOwnerKey = this.keys.assignmentOwner();
        this.allTagsKey = this.keys.allTags();
        this.acceptedAssignmentsKey = this.keys.acceptedAssignments();
        this.completedAssignmentsKey = this.keys.completedAssignments();
        this.calculatePriority = options?.prioritizationFunction ?? this.calculatePriority;
        this.usingDefaultMatchScore = !options?.matchingFunction;
        this.matchScore = options?.matchingFunction ?? this.defaultMatchScore.bind(this);
        this.enableGeoMatching = options?.enableGeoMatching ?? false;
        this.geoDefaultMaxDistanceKm = options?.geoDefaultMaxDistanceKm;
        this.geoScoreWeight = options?.geoScoreWeight ?? 0;
        this.geoMatchingFunction = options?.geoMatchingFunction;

        // Workflow options
        this.enableWorkflows = options?.enableWorkflows ?? false;
        this.streamConsumerGroup = options?.streamConsumerGroup ?? 'orchestrator';
        this.streamConsumerName = options?.streamConsumerName ?? randomUUID();

        // Initialize managers
        this.reliability = new ReliabilityManager(this.redisClient, this.keys, {
            workflowMaxRetries: options?.workflowMaxRetries ?? 3,
            workflowIdempotencyTtlMs: options?.workflowIdempotencyTtlMs ?? 86400000,
            workflowCircuitBreakerThreshold: options?.workflowCircuitBreakerThreshold ?? 5,
            workflowCircuitBreakerResetMs: options?.workflowCircuitBreakerResetMs ?? 30000,
            workflowAuditEnabled: options?.workflowAuditEnabled ?? false,
            workflowSnapshotDefinitions: options?.workflowSnapshotDefinitions ?? true,
            streamConsumerName: this.streamConsumerName,
            circuitBreakerPersistState: options?.circuitBreakerPersistState ?? false,
            circuitBreakerShared: options?.circuitBreakerShared ?? false,
            enableReliabilityMetrics: options?.enableReliabilityMetrics ?? true,
            deadLetterQueueAlertThreshold: options?.deadLetterQueueAlertThreshold ?? 100,
        });
        this.telemetry = new TelemetryManager(options?.enableOpenTelemetry ?? false);

        // Learning layer (opt-in contextual bandit re-ranking)
        this.enableLearning = options?.enableLearning ?? false;
        this.enableAutoRoutingWeights = options?.enableAutoRoutingWeights ?? false;
        this.learningFeatureExtractor = options?.learningFeatureExtractor ?? extractMatchFeatures;
        this.learning = new LearningManager(this.redisClient, this.keys, {
            learningRate: options?.learningRate,
            explorationRate: options?.learningExplorationRate,
            shadowMode: options?.learningShadowMode,
            boostFactor: options?.learningBoostFactor,
            rewards: options?.learningRewards,
            decisionTtlMs: options?.learningDecisionTtlMs,
            signalWeights: options?.learningSignalWeights,
            feedbackTtlMs: options?.learningFeedbackTtlMs,
            trackTagStats: this.enableAutoRoutingWeights,
            autoWeights: options?.autoRoutingWeights,
        });

        this.workflow = new WorkflowManager(this.redisClient, this.keys, this.reliability, this.telemetry, this, {
            enableWorkflows: this.enableWorkflows,
            streamConsumerGroup: this.streamConsumerGroup,
            streamConsumerName: this.streamConsumerName,
            reclaimIntervalMs: options?.workflowReclaimPollIntervalMs ?? 5000,
            reclaimMinIdleMs: options?.workflowOrphanReclaimMs ?? 60000,
            retentionMs: options?.workflowInstanceRetentionMs,
            retryBackoffMs: options?.workflowRetryBackoffMs,
            eventBatchSize: options?.workflowEventBatchSize,
            pollBlockMs: options?.workflowPollBlockMs,
            maxEventsPerSecond: options?.workflowMaxEventsPerSecond,
        });

        this.readyPromise = this.initRedis();
    }

    /** Keys for the three assignment stores (used by pagination queries) */
    private get assignmentStoreKeys() {
        return {
            queued: this.assignmentsRefKey,
            pending: this.pendingAssignmentsKey,
            accepted: this.acceptedAssignmentsKey,
            completed: this.completedAssignmentsKey,
        };
    }

    private async initRedis() {
        // Only attempt to connect if the client isn't already connected
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
        }

        // Initialize reliability manager (load persisted circuit breaker state if enabled)
        await this.reliability.init();

        // Initialize workflow stream consumer group if workflows are enabled
        if (this.enableWorkflows) {
            await this.workflow.init();
            // Load Lua script for atomic transitions
            await this.loadLuaScripts();
        }

        return this;
    }

    /**
     * Wait until the matcher has connected and initialized workflow internals.
     */
    async waitUntilReady(): Promise<this> {
        return this.readyPromise;
    }

    /**
     * Load Lua scripts into Redis for atomic operations.
     */
    private async loadLuaScripts(): Promise<void> {
        try {
            this.luaScriptSha = await this.redisClient.scriptLoad(WORKFLOW_TRANSITION_LUA);
            this.workflow.setLuaScriptSha(this.luaScriptSha);
        } catch (err) {
            console.error('Failed to load Lua scripts:', err);
            // Fallback to non-atomic mode
            this.luaScriptSha = null;
        }
    }

    async atomicWorkflowTransition(
        instanceId: string,
        expectedVersion: number,
        newStatus: WorkflowInstance['status'],
        newStepId: string | null,
        updatedContext: Record<string, any>,
        historyEntry?: WorkflowInstance['history'][0],
    ): Promise<{ ok: boolean; instance?: WorkflowInstance; error?: string }> {
        await this.readyPromise;

        return this.workflow.atomicWorkflowTransition(
            instanceId,
            expectedVersion,
            newStatus,
            newStepId,
            updatedContext,
            historyEntry,
        );
    }

    async reclaimOrphanedMessages(): Promise<number> {
        await this.readyPromise;
        return this.workflow.reclaimOrphanedMessages();
    }

    /**
     * Get events from the Dead Letter Queue.
     */
    async getDeadLetterEvents(limit: number = 100, offset: number = 0): Promise<DeadLetterEntry[]> {
        await this.readyPromise;
        return this.reliability.getDeadLetterEvents(limit, offset);
    }

    /**
     * Get Dead Letter Queue size.
     */
    async getDeadLetterQueueSize(): Promise<number> {
        await this.readyPromise;
        return this.reliability.getDeadLetterQueueSize();
    }

    /**
     * Replay a Dead Letter Queue event.
     */
    async replayDeadLetterEvent(eventJson: string): Promise<boolean> {
        await this.readyPromise;

        const entry: DeadLetterEntry = JSON.parse(eventJson);
        // Reset retry count
        await this.redisClient.del(this.keys.eventRetryCount(entry.event.eventId));
        // Re-publish the event
        await this.publishWorkflowEvent(entry.event);
        // Remove from DLQ
        await this.redisClient.zRem(this.keys.deadLetterQueue(), eventJson);
        return true;
    }

    /**
     * Clear all events from the Dead Letter Queue.
     */
    async clearDeadLetterQueue(): Promise<number> {
        await this.readyPromise;
        return this.reliability.clearDeadLetterQueue();
    }

    /**
     * Get audit events from the audit stream.
     */
    async getAuditEvents(count: number = 100): Promise<AuditEntry[]> {
        await this.readyPromise;
        return this.reliability.getAuditEvents(count);
    }

    // ============================================================================
    // Reliability & Health Check Methods
    // ============================================================================

    /**
     * Get comprehensive reliability metrics including circuit breaker state,
     * Dead Letter Queue size, and Redis health status.
     */
    async getReliabilityMetrics(): Promise<ReliabilityMetrics> {
        await this.readyPromise;
        return this.reliability.getMetrics();
    }

    /**
     * Get current circuit breaker state
     */
    async getCircuitBreakerState(): Promise<CircuitBreakerState> {
        await this.readyPromise;
        return this.reliability.getCircuitBreakerState();
    }

    /**
     * Check if Dead Letter Queue size exceeds alert threshold
     */
    async checkDeadLetterQueueAlert(): Promise<boolean> {
        await this.readyPromise;
        return this.reliability.checkDeadLetterQueueAlert();
    }

    /**
     * Perform a health check on Redis connection
     * Returns true if Redis is healthy, false otherwise
     */
    async healthCheck(): Promise<{ healthy: boolean; details: Record<string, any> }> {
        await this.readyPromise;

        const details: Record<string, any> = {
            timestamp: Date.now(),
        };

        try {
            // Check if Redis client is connected
            details.redisConnected = this.redisClient.isOpen;

            // Try to ping Redis
            const pingResult = await this.redisClient.ping();
            details.redisPing = pingResult;

            // Get reliability metrics
            const metrics = await this.getReliabilityMetrics();
            details.circuitBreakerState = metrics.circuitBreakerState;
            details.deadLetterQueueSize = metrics.deadLetterQueueSize;
            details.circuitBreakerAllowingRequests = metrics.circuitBreakerAllowingRequests;

            // Check if circuit breaker is allowing requests
            const healthy = details.redisConnected && pingResult === 'PONG' && details.circuitBreakerAllowingRequests;

            return {
                healthy,
                details,
            };
        } catch (err) {
            details.error = err instanceof Error ? err.message : String(err);
            return {
                healthy: false,
                details,
            };
        }
    }

    // ============================================================================
    // Learning (Contextual Bandit) Methods
    // ============================================================================

    /**
     * Get the learned model weights (feature -> weight).
     */
    async getLearningModel(): Promise<Record<string, string>> {
        await this.readyPromise;
        return this.learning.getModel();
    }

    /**
     * Get aggregate learning statistics (decisions, rewards, average reward).
     */
    async getLearningStats(): Promise<LearningStats> {
        await this.readyPromise;
        return this.learning.getStats();
    }

    /**
     * Apply a manual reward to a matched assignment's decision context.
     * Enables custom reward shaping beyond the built-in lifecycle outcomes.
     * Returns false when no decision context exists for the assignment.
     */
    async recordLearningReward(assignmentId: string, reward: number): Promise<boolean> {
        await this.readyPromise;
        return this.learning.recordReward(assignmentId, reward);
    }

    /**
     * Feed external post-processing signals into the model for an assignment
     * (e.g. { accuracy: 0.95, csat: 0.8 }). Works for live decisions and for
     * archived episodes of already-completed assignments (within the feedback TTL).
     * Signal values are weighted via the `learningSignalWeights` option (default 1).
     * Returns false when no learning context exists for the assignment.
     */
    async recordLearningFeedback(assignmentId: string, signals: LearningSignals): Promise<boolean> {
        await this.readyPromise;
        return this.learning.recordFeedback(assignmentId, signals);
    }

    /**
     * Train the model directly with raw (features, reward) samples from an
     * external pipeline (offline evaluation jobs, historical data imports).
     * Returns the number of samples applied.
     */
    async trainLearningSamples(samples: LearningSample[]): Promise<number> {
        await this.readyPromise;
        return this.learning.trainSamples(samples);
    }

    /**
     * Reset the learned model weights and statistics.
     */
    async resetLearningModel(): Promise<void> {
        await this.readyPromise;
        return this.learning.resetModel();
    }

    /**
     * Toggle learning shadow mode at runtime without losing model/state.
     *
     * `true`: learn-only, ranking unaffected.
     * `false`: learning predictions can influence ranking.
     */
    async setLearningShadowMode(enabled: boolean): Promise<void> {
        await this.readyPromise;
        this.learning.setShadowMode(enabled);
    }

    /** Current runtime shadow mode state. */
    async getLearningShadowMode(): Promise<boolean> {
        await this.readyPromise;
        return this.learning.shadowMode;
    }

    // ============================================================================
    // Auto Routing Weights (RL-generated tags/weights)
    // ============================================================================

    /**
     * Per-user, per-tag reward statistics aggregated from learned outcomes.
     * Requires `enableLearning` and `enableAutoRoutingWeights`.
     */
    async getLearnedTagStats(userId: string): Promise<LearningTagStat[]> {
        await this.readyPromise;
        return this.learning.getUserTagStats(userId);
    }

    /**
     * Synthesize a routingWeights map for a user from learned tag statistics
     * using a UCB1 bandit policy: high weights for rewarding tags, weight 0
     * (hard veto) for consistently bad tags, and optimistic priors for
     * under-explored tags. Does not persist anything.
     *
     * @param opts.includeUnexploredTags also assign the exploration prior to
     *        every known tag in the system the user has no data for yet
     */
    async getLearnedRoutingWeights(
        userId: string,
        opts?: { includeUnexploredTags?: boolean },
    ): Promise<Record<string, number>> {
        await this.readyPromise;
        const knownTags = opts?.includeUnexploredTags ? await this.getKnownTagsForAutoWeights() : undefined;
        const userJson = await this.redisClient.hGet(this.usersKey, userId);
        const existingWeights = userJson ? (JSON.parse(userJson) as User).routingWeights : undefined;
        return this.learning.getLearnedRoutingWeights(userId, knownTags, existingWeights);
    }

    /**
     * Apply learned routing weights to one user (or every tracked user when
     * no id is given), automating tags/weights generation from RL outcomes.
     *
     * Merge semantics: learned tags always take their learned value; manual
     * routingWeights entries for tags the learner has no data on are
     * preserved (set `opts.overrideManual` to replace the map entirely).
     * The applied learned map is stored on the user as `learnedRoutingWeights`
     * for observability.
     *
     * Returns the applied weights per user id.
     */
    async syncLearnedRoutingWeights(
        userId?: string,
        opts?: { overrideManual?: boolean; includeUnexploredTags?: boolean },
    ): Promise<Record<string, Record<string, number>>> {
        await this.readyPromise;

        const targets = userId ? [userId] : await this.learning.listTrackedUsers();
        const knownTags = opts?.includeUnexploredTags ? await this.getKnownTagsForAutoWeights() : undefined;
        const applied: Record<string, Record<string, number>> = {};

        for (const id of targets) {
            const userJson = await this.redisClient.hGet(this.usersKey, id);
            if (!userJson) continue;
            const user = JSON.parse(userJson) as User;

            // Pass the user's current routingWeights as warm per-tag priors
            // so under-sampled tags start from the existing value rather than
            // the flat priorWeight.
            const previousLearned: Record<string, number> = user.learnedRoutingWeights ?? {};
            const existingForSynthesis = user.routingWeights
                ? Object.fromEntries(Object.entries(user.routingWeights).filter(([tag]) => !(tag in previousLearned)))
                : undefined;

            const learned = await this.learning.getLearnedRoutingWeights(id, knownTags, existingForSynthesis);
            if (Object.keys(learned).length === 0) continue;

            let routingWeights: Record<string, number>;
            if (opts?.overrideManual) {
                routingWeights = learned;
            } else {
                const manualEntries: Record<string, number> = {};
                for (const [tag, weight] of Object.entries(user.routingWeights ?? {})) {
                    if (!(tag in previousLearned) && !(tag in learned)) manualEntries[tag] = weight;
                }
                routingWeights = { ...manualEntries, ...learned };
            }

            await this.redisClient.hSet(
                this.usersKey,
                id,
                JSON.stringify({ ...user, routingWeights, learnedRoutingWeights: learned }),
            );
            applied[id] = routingWeights;
        }

        return applied;
    }

    /** All known tags except the internal 'default' tag (for exploration priors) */
    private async getKnownTagsForAutoWeights(): Promise<string[]> {
        const tags: string[] = await this.redisClient.sMembers(this.allTagsKey);
        return tags.filter((t) => t !== 'default');
    }

    // ============================================================================
    // OpenTelemetry Tracing Hooks
    // ============================================================================

    /**
     * Set the OpenTelemetry tracer instance.
     */
    setTracer(tracer: any): void {
        this.telemetry.setTracer(tracer);
    }

    /**
     * Initialize the Redis Stream consumer group for workflow events.
     * Creates the stream and consumer group if they don't exist.
     */
    private async initStreamConsumerGroup(): Promise<void> {
        const streamKey = this.keys.eventStream();
        try {
            // Try to create the consumer group (and stream if needed)
            await this.redisClient.xGroupCreate(streamKey, this.streamConsumerGroup, '0', {
                MKSTREAM: true,
            });
        } catch (err: any) {
            // Ignore "BUSYGROUP" error - group already exists
            if (!err.message?.includes('BUSYGROUP')) {
                throw err;
            }
        }
    }

    async addUser(user: User): Promise<User> {
        await this.readyPromise;

        await this.redisClient.hSet(
            this.usersKey,
            user.id,
            JSON.stringify({
                ...user,
                tags: [...user.tags, ...(this.enableDefaultMatching ? ['default'] : [])],
            }),
        );

        await this.touchUser(user.id);

        return user;
    }

    async addAssignment(assignment: Assignment) {
        await this.readyPromise;

        let { id, tags, priority, latitude, longitude } = assignment;
        if (!priority) priority = await this.calculatePriority(assignment);

        const assignmentPriorityKey = this.keys.assignmentPriority(id);
        const assignmentTagsKey = this.keys.assignmentTags(id);
        const assignmentGeoKey = this.keys.assignmentsGeo();

        const multi = this.redisClient
            .multi()
            .hSet(this.assignmentsRefKey, id, JSON.stringify(assignment))
            .hSet(assignmentPriorityKey, 'priority', priority)
            // Ensure 'default' tag is persisted consistently when enabled
            .hSet(assignmentTagsKey, 'tags', tags.join(',') + (this.enableDefaultMatching ? ',default' : ''))
            .zAdd(this.assignmentsKey, {
                score: priority,
                value: id,
            });

        if (isValidLatitude(latitude) && isValidLongitude(longitude)) {
            multi.geoAdd(assignmentGeoKey, {
                longitude,
                latitude,
                member: id,
            });
        }

        // Index hard vetoes both ways: assignment -> users for cleanup,
        // user -> assignments for exclusion via ZDIFFSTORE during matching.
        if (assignment.vetoedUsers && assignment.vetoedUsers.length > 0) {
            multi.sAdd(this.keys.assignmentVetoed(id), assignment.vetoedUsers);
            for (const vetoedUserId of assignment.vetoedUsers) {
                multi.sAdd(this.keys.userVetoed(vetoedUserId), id);
            }
        }

        // Also index assignment into per-tag sorted sets (by priority)
        // This enables efficient weighted matching via ZUNIONSTORE.
        const indexTags = [...tags, ...(this.enableDefaultMatching ? ['default'] : [])];
        for (const tag of indexTags) {
            multi.zAdd(this.keys.tagAssignments(tag), {
                score: Number(priority),
                value: id,
            });
            multi.zAdd(this.allTagsKey, { score: 0, value: tag });
        }

        await multi.exec();

        return assignment;
    }

    async removeAssignment(id: string) {
        await this.readyPromise;

        const assignmentPriorityKey = this.keys.assignmentPriority(id);
        const assignmentTagsKey = this.keys.assignmentTags(id);
        const assignmentGeoKey = this.keys.assignmentsGeo();

        // Fetch tags, owner (in case it's pending), and vetoed users for index cleanup
        const [tagsCsv, owner, vetoedUsers] = await Promise.all([
            this.redisClient.hGet(assignmentTagsKey, 'tags'),
            this.redisClient.hGet(this.assignmentOwnerKey, id),
            this.redisClient.sMembers(this.keys.assignmentVetoed(id)),
        ]);

        let tags: string[] = [];
        if (tagsCsv && tagsCsv.length > 0) {
            tags = tagsCsv.split(',');
        }

        const multi = this.redisClient.multi();

        // 1. Remove from Queued state
        multi.hDel(this.assignmentsRefKey, id);
        multi.del(assignmentPriorityKey);
        multi.del(assignmentTagsKey);
        multi.zRem(this.assignmentsKey, id.toString());
        for (const tag of tags) {
            multi.zRem(this.keys.tagAssignments(tag), id.toString());
        }
        multi.zRem(assignmentGeoKey, id.toString());
        multi.del(this.keys.assignmentVetoed(id));
        for (const vetoedUserId of vetoedUsers) {
            multi.sRem(this.keys.userVetoed(vetoedUserId), id);
        }

        // 2. Remove from Pending state
        multi.hDel(this.pendingAssignmentsKey, id);
        multi.zRem(this.pendingAssignmentsExpiryKey, id);
        multi.hDel(this.assignmentOwnerKey, id);
        if (owner) {
            multi.sRem(this.keys.userAssignments(owner), `assignment:${id}`);
        }

        // 3. Remove from Accepted state
        multi.hDel(this.acceptedAssignmentsKey, id);

        await multi.exec();
        return id;
    }

    async removeUser(userId: string): Promise<string> {
        await this.readyPromise;

        const multi = this.redisClient
            .multi()
            .del(this.keys.userAssignments(userId))
            .del(this.keys.userRejected(userId))
            .del(this.keys.userVetoed(userId))
            .zRem(this.keys.userActivity(), userId)
            .hDel(this.usersKey, userId);
        await multi.exec();

        return userId;
    }

    /**
     * Get all assignments (queued, pending, and accepted).
     * For large datasets, prefer using getAssignmentsPaginated() instead.
     */
    async getAllAssignments(): Promise<Assignment[]> {
        await this.readyPromise;
        return getAllAssignmentsFromStores(this.redisClient, this.assignmentStoreKeys);
    }

    /**
     * Get assignments with pagination support for efficient querying of large datasets.
     * Uses cursor-based pagination across statuses.
     *
     * @param options - Pagination options.
     */
    async getAssignmentsPaginated(options?: PaginationOptions): Promise<PaginationResult> {
        await this.readyPromise;
        return getAssignmentsPaginatedFromStores(this.redisClient, this.assignmentStoreKeys, options);
    }

    /**
     * Get assignment counts by status without fetching the data.
     * Efficient for dashboards and monitoring.
     */
    async getAssignmentCounts(): Promise<AssignmentCounts> {
        await this.readyPromise;
        return getAssignmentCountsFromStores(this.redisClient, this.assignmentStoreKeys);
    }

    /**
     * Get a single assignment by ID from any status.
     */
    async getAssignment(id: string): Promise<(Assignment & { _status?: string }) | null> {
        await this.readyPromise;
        return getAssignmentById(this.redisClient, this.assignmentStoreKeys, id);
    }

    /**
     * Get multiple assignments by IDs efficiently.
     */
    async getAssignmentsByIds(ids: string[]): Promise<Assignment[]> {
        await this.readyPromise;
        return getAssignmentsByIdsBatch(this.redisClient, this.assignmentStoreKeys, ids);
    }

    /**
     * Get all pending assignments with owner and pending duration metadata.
     */
    async getPendingAssignmentsWithAge(): Promise<PendingAssignmentInfo[]> {
        await this.readyPromise;

        const now = Date.now();
        const pendingEntries = await this.redisClient.hGetAll(this.pendingAssignmentsKey);
        const assignmentIds = Object.keys(pendingEntries);

        if (assignmentIds.length === 0) {
            return [];
        }

        const [owners, expiryScores] = await Promise.all([
            this.redisClient.hmGet(this.assignmentOwnerKey, assignmentIds),
            Promise.all(assignmentIds.map((id) => this.redisClient.zScore(this.pendingAssignmentsExpiryKey, id))),
        ]);

        const results: PendingAssignmentInfo[] = [];
        for (let i = 0; i < assignmentIds.length; i++) {
            const id = assignmentIds[i];
            const json = pendingEntries[id];
            if (!json) continue;

            let assignment: Assignment;
            try {
                assignment = JSON.parse(json);
            } catch {
                continue;
            }

            const score = expiryScores[i];
            const expiresAt = score === null ? null : Number(score);
            const pendingSince = expiresAt === null ? null : expiresAt - this.matchExpirationMs;
            const pendingForMs = pendingSince === null ? null : Math.max(0, now - pendingSince);

            results.push({
                assignment,
                ownerId: owners[i] ?? null,
                pendingForMs,
                pendingSince,
                expiresAt,
            });
        }

        results.sort((a, b) => (b.pendingForMs ?? -1) - (a.pendingForMs ?? -1));
        return results;
    }

    /** Default match score implementation using extracted scoring module */
    private defaultMatchScore(
        user: User,
        assignmentTags: string,
        assignmentPriority: string | number,
        _assignmentId?: string,
        skillThresholds?: Record<string, number>,
    ): Promise<[number, number]> {
        return Promise.resolve(
            calculateMatchScore(user, assignmentTags, assignmentPriority, this.enableDefaultMatching, skillThresholds),
        );
    }

    private matchScore: (
        user: User,
        assignmentTags: string,
        assignmentPriority: string | number,
        assignmentId?: string,
        skillThresholds?: Record<string, number>,
    ) => Promise<[number, number]>;

    private async evaluateGeoMatch(user: User, assignment: Assignment): Promise<GeoMatchResult> {
        if (this.geoMatchingFunction) {
            return this.geoMatchingFunction({
                user,
                assignment,
                defaultMaxDistanceKm: this.geoDefaultMaxDistanceKm,
            });
        }

        return checkGeoMatch(user, assignment, {
            enabled: this.enableGeoMatching,
            defaultMaxDistanceKm: this.geoDefaultMaxDistanceKm,
        });
    }

    private calculateGeoBoost(geoMatch: GeoMatchResult): number {
        if (!this.enableGeoMatching || this.geoScoreWeight <= 0) return 0;
        if (typeof geoMatch.distanceKm !== 'number' || typeof geoMatch.effectiveMaxDistanceKm !== 'number') return 0;
        if (geoMatch.effectiveMaxDistanceKm <= 0) return 0;

        const ratio = 1 - geoMatch.distanceKm / geoMatch.effectiveMaxDistanceKm;
        return this.geoScoreWeight * Math.max(0, ratio);
    }

    private async calculatePriority(...args: (Assignment | undefined)[]) {
        const [assignment] = args;
        return calculateDefaultPriority(assignment?.createdAt);
    }

    get stats(): Promise<Stats> {
        return (async () => {
            const users = await this.redisClient.hGetAll(this.usersKey);
            const usersWithoutAssignment = await this.usersWithoutAssignment;
            const remainingAssignments = await this.redisClient.zCount(this.assignmentsKey, '-inf', '+inf');

            return {
                users: Object.keys(users).length,
                usersWithoutAssignment,
                remainingAssignments,
            };
        })();
    }

    get usersWithoutAssignment() {
        return (async () => {
            const users = await this.redisClient.hGetAll(this.usersKey);
            const usersWithoutAssignment: string[] = [];
            for (const user of Object.values(users)) {
                const { id } = JSON.parse(user);
                const userAssignments = await this.getCurrentAssignmentsForUser(id);
                if (userAssignments.length === 0) usersWithoutAssignment.push(id);
            }
            return usersWithoutAssignment;
        })();
    }

    async setAssignmentPriority(id: string, priority: number) {
        const assignmentPriorityKey = this.keys.assignmentPriority(id);
        // Fetch tags to update per-tag indices
        const assignmentTagsKey = this.keys.assignmentTags(id);
        const [existsRef, tagsCsv] = (await this.redisClient
            .multi()
            .hExists(this.assignmentsRefKey, id)
            .hGet(assignmentTagsKey, 'tags')
            .exec()) as unknown as [boolean, string | null];
        const tags = (tagsCsv && tagsCsv.length > 0 ? tagsCsv.split(',') : []) as string[];

        const multi = this.redisClient.multi();
        multi.hSet(assignmentPriorityKey, 'priority', priority);
        if (existsRef) {
            // Update global zset score and per-tag zset scores only if assignment still exists
            multi.zAdd(this.assignmentsKey, { score: Number(priority), value: id });
            for (const tag of tags) {
                multi.zAdd(this.keys.tagAssignments(tag), { score: Number(priority), value: id });
            }
        }
        await multi.exec();

        return { id, priority };
    }

    async setAssignmentPriorityByTags(tags: string[], priority: number) {
        // Update priorities for all assignments that include any of the specified tags.
        const assignments = await this.getAllAssignments();
        const relevantAssignments = assignments.filter((assignment) => {
            const assignmentTagSet = new Set(assignment.tags);
            return tags.some((tag) => assignmentTagSet.has(tag));
        });

        if (relevantAssignments.length > 0) {
            const multi = this.redisClient.multi();
            for (const assignment of relevantAssignments) {
                const id = assignment.id;
                const assignmentPriorityKey = this.keys.assignmentPriority(id);
                // Update the stored priority
                multi.hSet(assignmentPriorityKey, 'priority', priority);
                // Update global zset score
                multi.zAdd(this.assignmentsKey, { score: Number(priority), value: id });
                // Update per-tag zset scores
                const idxTags = [...assignment.tags, ...(this.enableDefaultMatching ? ['default'] : [])];
                for (const tag of idxTags) {
                    multi.zAdd(this.keys.tagAssignments(tag), { score: Number(priority), value: id });
                }
            }
            await multi.exec();
        }

        return relevantAssignments.map((assignment) => ({ id: assignment.id, priority }));
    }

    private async getUserRelatedAssignments(user: User) {
        const userAssignments: Array<{ id: string; priority: number }> = [];
        const routingWeights = user.routingWeights;
        const hasRoutingWeights = Boolean(routingWeights && Object.keys(routingWeights).length > 0);

        // Priority 1: Check for workflow-targeted assignments (deterministic matching)
        if (this.enableWorkflows) {
            const workflowAssignments = await this.getWorkflowTargetedAssignments(user.id);
            if (workflowAssignments.length > 0) {
                // Workflow assignments take precedence - add them first with highest priority
                userAssignments.push(...workflowAssignments);
                if (userAssignments.length >= this.maxUserBacklogSize) {
                    return userAssignments;
                }
            }
        }
        // Workflow-targeted assignments above are deterministically targeted at this
        // user (not drawn from the shared tag pool below), so the claim-race filtering
        // at the end of this function must never strip them out.
        const workflowTargetedCount = userAssignments.length;

        // Priority 2: Build candidate assignments using per-tag zset union with user weights for scalability.
        const positiveWeights: Array<{ tag: string; weight: number }> = [];
        const zeroWeightTags: string[] = [];

        if (hasRoutingWeights) {
            for (const [tag, w] of Object.entries(routingWeights!)) {
                if (typeof w === 'number' && w > 0) positiveWeights.push({ tag, weight: w });
                else if (w === 0) zeroWeightTags.push(tag);
            }
        } else {
            // Fallback: use unweighted tags (weight 1)
            for (const tag of user.tags || []) {
                positiveWeights.push({ tag, weight: 1 });
            }
        }

        // Ensure default tag is included for unweighted users.
        // In weighted + default scoring path, only explicit positive weights may match.
        if (this.enableDefaultMatching && !hasRoutingWeights) {
            const defaultInPos = positiveWeights.find((t) => t.tag === 'default');
            const defaultZero = zeroWeightTags.some(
                (tag) => tag === 'default' || (tag.endsWith('*') && 'default'.startsWith(tag.slice(0, -1))),
            );
            if (!defaultInPos && !defaultZero) positiveWeights.push({ tag: 'default', weight: 1 });
        }

        // In weighted default matching, users must define at least one positive weight.
        // If they don't, nothing should be assigned and queue remains intact.
        if (hasRoutingWeights && this.usingDefaultMatchScore && positiveWeights.length === 0) {
            return userAssignments;
        }

        if (positiveWeights.length === 0) return userAssignments;

        // Expand wildcards
        const expandedPositive = await this.expandTagWildcards(positiveWeights);
        const expandedZero = this.usingDefaultMatchScore
            ? await this.expandTagWildcards(zeroWeightTags.map((t) => ({ tag: t, weight: 0 })))
            : [];
        const finalZeroTags = expandedZero.map((t) => t.tag);

        if (expandedPositive.length === 0) return userAssignments;

        const tempKey = this.keys.tempUserCandidates(user.id);
        const tempZeroKey = this.keys.tempUserExclude(user.id);
        const tempFinalKey = this.keys.tempUserFinal(user.id);
        const rejectedKey = this.keys.userRejected(user.id);

        const unionKeysWithWeights = expandedPositive.map((pw) => ({
            key: this.keys.tagAssignments(pw.tag),
            weight: pw.weight,
        }));

        const multi = this.redisClient.multi();
        // Weighted union of positive tag assignment zsets
        if (unionKeysWithWeights.length > 0) {
            multi.zUnionStore(
                tempKey,
                unionKeysWithWeights as [(typeof unionKeysWithWeights)[0], ...typeof unionKeysWithWeights],
            );
        }

        const excludeKeys: string[] = [];
        // Optional exclude set for zero-weight tags
        if (finalZeroTags.length > 0) {
            const zeroKeys = finalZeroTags.map((t) => this.keys.tagAssignments(t));
            multi.zUnionStore(tempZeroKey, zeroKeys as [string, ...string[]]);
            multi.expire(tempZeroKey, 5);
            excludeKeys.push(tempZeroKey);
        }

        // Always exclude rejected and vetoed assignments
        excludeKeys.push(rejectedKey);
        excludeKeys.push(this.keys.userVetoed(user.id));

        // Final = candidates - exclude (zero weights + rejected + vetoed)
        multi.zDiffStore(tempFinalKey, [tempKey, ...excludeKeys]);

        // Set short TTLs to clean up
        multi.expire(tempKey, 5);
        multi.expire(tempFinalKey, 5);

        await multi.exec();

        // Pull top-N in ascending score to preserve previous behavior on ties (lex ascending)
        const top = await this.redisClient.zRangeWithScores(tempFinalKey, 0, this.relevantBatchSize - 1);

        if (top.length === 0) return userAssignments;

        // Fetch per-assignment stored (base) priority and tags in a single pipeline (fewer round trips)
        const batched = this.redisClient.multi();
        for (const entry of top) {
            const assignmentId = (entry as any).value;
            batched.hGet(this.keys.assignmentPriority(assignmentId), 'priority');
            batched.hGet(this.keys.assignmentTags(assignmentId), 'tags');
            // Also fetch assignment JSON to access allowedCidrs for network matching
            batched.hGet(this.assignmentsRefKey, assignmentId);
        }
        const flat = (await batched.exec()) as unknown as (string | null)[];
        const details = [] as Array<{
            id: string;
            basePriority: number;
            tags: string;
            allowedCidrs?: string[];
            skillThresholds?: Record<string, number>;
            raw?: Assignment;
        }>;
        for (let i = 0; i < top.length; i++) {
            const assignmentId = (top[i] as any).value;
            const priority = Number(flat[i * 3]) || 0;
            const tags = String(flat[i * 3 + 1] || '');
            const assignmentJson = flat[i * 3 + 2];
            let allowedCidrs: string[] | undefined;
            let skillThresholds: Record<string, number> | undefined;
            let raw: Assignment | undefined;
            if (assignmentJson) {
                try {
                    const parsed = JSON.parse(assignmentJson) as Assignment;
                    allowedCidrs = parsed.allowedCidrs;
                    skillThresholds = parsed.skillThresholds;
                    raw = parsed;
                } catch {
                    // Ignore JSON parse errors
                }
            }
            details.push({ id: assignmentId, basePriority: priority, tags, allowedCidrs, skillThresholds, raw });
        }
        // Prefer higher base priority first to satisfy tests and practical expectations
        details.sort((a, b) => b.basePriority - a.basePriority);

        const selected: Array<{ id: string; tags: string }> = [];
        if (this.enableLearning) {
            // Learning path: evaluate all eligible candidates, then re-rank by
            // base priority + predicted reward (hard filters still apply first).
            const modelWeights = await this.learning.getModel();
            const eligible: Array<{
                detail: (typeof details)[0];
                combinedPriority: number;
                features: LearningFeatures;
                predicted: number;
                effectivePriority: number;
            }> = [];

            for (const d of details) {
                if (!checkCidrMatch(user.ip, d.allowedCidrs)) continue;

                const geoMatch = await this.evaluateGeoMatch(user, d.raw ?? { id: d.id, tags: [] });
                if (!geoMatch.eligible) continue;

                const [score, combinedPriority] = await this.matchScore(
                    user,
                    d.tags,
                    d.basePriority,
                    d.id,
                    d.skillThresholds,
                );
                if (!score || !combinedPriority) continue;
                const geoAdjustedPriority = combinedPriority + this.calculateGeoBoost(geoMatch);

                const context: LearningAssignmentContext = {
                    ...(d.raw ?? {}),
                    id: d.id,
                    tags: d.tags ? d.tags.split(',').filter(Boolean) : [],
                };
                const features = this.learningFeatureExtractor(user, context);
                const predicted = this.learning.predict(features, modelWeights);
                // Shadow mode observes without influencing ranking.
                // Epsilon-greedy exploration adds random jitter to gather data on under-served candidates.
                const exploration =
                    !this.learning.shadowMode && this.learning.shouldExplore()
                        ? Math.random() * this.learning.boostFactor
                        : 0;
                const effectivePriority = this.learning.shadowMode
                    ? geoAdjustedPriority
                    : geoAdjustedPriority + this.learning.boostFactor * predicted + exploration;
                eligible.push({ detail: d, combinedPriority, features, predicted, effectivePriority });
            }

            eligible.sort((a, b) => b.effectivePriority - a.effectivePriority);

            for (const c of eligible) {
                if (userAssignments.length >= this.maxUserBacklogSize) break;
                userAssignments.push({ id: c.detail.id, priority: c.effectivePriority });
                selected.push({ id: c.detail.id, tags: c.detail.tags });
                await this.learning.recordDecision(
                    user.id,
                    c.detail.id,
                    c.features,
                    c.predicted,
                    c.detail.tags ? c.detail.tags.split(',').filter(Boolean) : undefined,
                );
            }
        } else {
            for (const d of details) {
                if (userAssignments.length >= this.maxUserBacklogSize) break;

                // Check CIDR restrictions: if assignment has allowedCidrs, user must have matching IP
                if (!checkCidrMatch(user.ip, d.allowedCidrs)) {
                    continue; // Skip this assignment - user IP doesn't match allowed CIDRs
                }

                const geoMatch = await this.evaluateGeoMatch(user, d.raw ?? { id: d.id, tags: [] });
                if (!geoMatch.eligible) {
                    continue;
                }

                // Use custom matchScore (supports weights and thresholds) for a final check and tie-break
                const [score, combinedPriority] = await this.matchScore(
                    user,
                    d.tags,
                    d.basePriority,
                    d.id,
                    d.skillThresholds,
                );
                if (score && combinedPriority) {
                    userAssignments.push({ id: d.id, priority: combinedPriority + this.calculateGeoBoost(geoMatch) });
                    selected.push({ id: d.id, tags: d.tags });
                }
            }
        }

        // Claim, then clean up. The candidate read above (zDiffStore/zRangeWithScores)
        // is a snapshot taken before this point, and getUserRelatedAssignments runs
        // concurrently across users - matchUsersAssignments() Promise.all's the bulk
        // path, and a per-user matchUsersAssignments(userId) call can race a bulk
        // pass too. Without a single atomic gate, two concurrent callers can both
        // still see the same assignment as available and both hand it to their user.
        // HDEL on assignmentsRefKey is atomic and idempotent (returns 1 only for
        // whichever caller actually deletes the field), so it's used here as that
        // gate: only assignments this call actually wins are kept: anything already
        // claimed by a concurrent caller since the snapshot read is dropped instead
        // of being double-assigned.
        const claimedIds = new Set<string>();
        if (selected.length > 0) {
            const jsonPromises = selected.map((s) => this.redisClient.hGet(this.assignmentsRefKey, s.id));
            const jsons = await Promise.all(jsonPromises);
            const now = Date.now();

            const claimMulti = this.redisClient.multi();
            for (const s of selected) {
                claimMulti.hDel(this.assignmentsRefKey, s.id);
            }
            const claimResults = (await claimMulti.exec()) as unknown as number[];
            for (let i = 0; i < selected.length; i++) {
                if (Number(claimResults[i]) > 0) claimedIds.add(selected[i].id);
            }

            if (claimedIds.size > 0) {
                const rm = this.redisClient.multi();
                for (let i = 0; i < selected.length; i++) {
                    const s = selected[i];
                    if (!claimedIds.has(s.id)) continue; // lost the race - already claimed elsewhere
                    const json = jsons[i];

                    rm.del(this.keys.assignmentPriority(s.id));
                    rm.del(this.keys.assignmentTags(s.id));
                    // Remove from global zset
                    rm.zRem(this.assignmentsKey, s.id);
                    // Remove from per-tag zsets
                    const tags = (s.tags ? s.tags.split(',').filter(Boolean) : []) as string[];
                    for (const tag of tags) {
                        rm.zRem(this.keys.tagAssignments(tag), s.id);
                    }

                    // Add to pending structures
                    if (json) {
                        rm.hSet(this.pendingAssignmentsKey, s.id, json);
                        rm.zAdd(this.pendingAssignmentsExpiryKey, { score: now + this.matchExpirationMs, value: s.id });
                        rm.hSet(this.assignmentOwnerKey, s.id, user.id);
                    }
                }
                await rm.exec();
            }
        }

        const workflowTargeted = userAssignments.slice(0, workflowTargetedCount);
        const tagScored = userAssignments.slice(workflowTargetedCount).filter((ua) => claimedIds.has(ua.id));
        return [...workflowTargeted, ...tagScored];
    }
    async matchUsersAssignments(userId?: string): Promise<void> {
        await this.readyPromise;

        // If a specific userId is provided, process only that user for precise per-user matching.
        if (userId) {
            const userJson = await this.redisClient.hGet(this.usersKey, userId);
            if (!userJson) return;
            const user = JSON.parse(userJson);
            const userMatchesCount = await this.redisClient.sCard(this.keys.userAssignments(user.id));
            if (userMatchesCount >= this.maxUserBacklogSize) return;

            const relevantAssignments = await this.getUserRelatedAssignments(user);
            const relevantAssignmentKeys = relevantAssignments
                .sort((a, b) => b.priority - a.priority)
                .map((a) => `assignment:${a.id}`);

            if (relevantAssignmentKeys.length > 0) {
                await this.redisClient.sAdd(this.keys.userAssignments(user.id), relevantAssignmentKeys);
            }
            return;
        }

        // Otherwise, process all users in parallel as before.
        let users: any[] = [];
        let cursor = '0';

        // Fetch all users in a single loop
        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.usersKey, cursor);
            users.push(...entries.map((t: { field: string; value: string }) => JSON.parse(t.value)));
            cursor = nextCursor;
        } while (cursor !== '0');

        // Process users in parallel
        await Promise.all(
            users.map(async (user) => {
                const userMatchesCount = await this.redisClient.sCard(this.keys.userAssignments(user.id));
                if (userMatchesCount >= this.maxUserBacklogSize) {
                    return;
                }

                const relevantAssignments = await this.getUserRelatedAssignments(user);
                const relevantAssignmentKeys = relevantAssignments
                    .sort((a, b) => b.priority - a.priority)
                    .map((a) => `assignment:${a.id}`);

                if (relevantAssignmentKeys.length > 0) {
                    await this.redisClient.sAdd(this.keys.userAssignments(user.id), relevantAssignmentKeys);
                }
            }),
        );
    }

    async getCurrentAssignmentsForUser(userId: string): Promise<string[]> {
        await this.readyPromise;

        const userAssignments = await this.redisClient.sMembers(this.keys.userAssignments(userId));

        return userAssignments.map((el: string) => el.split(':')[1]);
    }

    async acceptAssignment(userId: string, assignmentId: string): Promise<boolean> {
        await this.readyPromise;

        const isAssigned = await this.redisClient.sIsMember(
            this.keys.userAssignments(userId),
            `assignment:${assignmentId}`,
        );
        if (!isAssigned) throw new Error('Assignment not found for user');

        // Get the assignment JSON before removing from pending
        const json = await this.redisClient.hGet(this.pendingAssignmentsKey, assignmentId);

        const multi = this.redisClient.multi();
        multi.sRem(this.keys.userAssignments(userId), `assignment:${assignmentId}`);
        multi.hDel(this.pendingAssignmentsKey, assignmentId);
        multi.zRem(this.pendingAssignmentsExpiryKey, assignmentId);
        multi.hDel(this.assignmentOwnerKey, assignmentId);

        // Store in accepted assignments
        if (json) {
            multi.hSet(this.acceptedAssignmentsKey, assignmentId, json);
        }
        await multi.exec();

        if (this.enableLearning) {
            await this.learning.applyOutcome(assignmentId, 'accept');
        }

        await this.touchUser(userId);

        return true;
    }

    async rejectAssignment(userId: string, assignmentId: string): Promise<boolean> {
        await this.readyPromise;

        const isAssigned = await this.redisClient.sIsMember(
            this.keys.userAssignments(userId),
            `assignment:${assignmentId}`,
        );
        if (!isAssigned) throw new Error('Assignment not found for user');

        const json = await this.redisClient.hGet(this.pendingAssignmentsKey, assignmentId);

        const multi = this.redisClient.multi();
        multi.sRem(this.keys.userAssignments(userId), `assignment:${assignmentId}`);
        multi.hDel(this.pendingAssignmentsKey, assignmentId);
        multi.zRem(this.pendingAssignmentsExpiryKey, assignmentId);
        multi.hDel(this.assignmentOwnerKey, assignmentId);

        // Add to rejected list to prevent immediate re-assignment
        multi.sAdd(this.keys.userRejected(userId), assignmentId);

        await multi.exec();

        if (this.enableLearning) {
            await this.learning.applyOutcome(assignmentId, 'reject');
        }

        await this.touchUser(userId);

        if (json) {
            await this.addAssignment(JSON.parse(json));
        }

        return true;
    }

    /**
     * Complete an assignment with a result payload.
     * Moves the assignment from 'accepted' to 'completed' state and publishes an event
     * for workflow orchestration.
     *
     * @param userId - The user completing the assignment
     * @param assignmentId - The assignment being completed
     * @param result - Optional result payload for routing decisions
     */
    async completeAssignment(userId: string, assignmentId: string, result?: AssignmentResult): Promise<boolean> {
        await this.readyPromise;

        // Verify assignment is in accepted state
        const json = await this.redisClient.hGet(this.acceptedAssignmentsKey, assignmentId);
        if (!json) {
            throw new Error('Assignment not found in accepted state');
        }

        const assignment = JSON.parse(json);
        const now = Date.now();

        // Move from accepted to completed
        const multi = this.redisClient.multi();
        multi.hDel(this.acceptedAssignmentsKey, assignmentId);

        // Store in completed with result metadata
        const completedData = {
            ...assignment,
            _completedBy: userId,
            _completedAt: now,
            _result: result,
        };
        multi.hSet(this.completedAssignmentsKey, assignmentId, JSON.stringify(completedData));

        await multi.exec();

        if (this.enableLearning) {
            await this.learning.applyOutcome(assignmentId, 'complete');
        }

        // Publish workflow event if workflows are enabled
        if (this.enableWorkflows) {
            await this.publishWorkflowEvent({
                eventId: randomUUID(),
                type: 'COMPLETED',
                userId,
                assignmentId,
                timestamp: now,
                payload: result?.data,
            });
        }

        return true;
    }

    /**
     * Fail an assignment explicitly (e.g., user reports inability to complete).
     *
     * @param userId - The user failing the assignment
     * @param assignmentId - The assignment being failed
     * @param reason - Optional reason for failure
     */
    async failAssignment(userId: string, assignmentId: string, reason?: string): Promise<boolean> {
        await this.readyPromise;

        const json = await this.redisClient.hGet(this.acceptedAssignmentsKey, assignmentId);
        if (!json) {
            throw new Error('Assignment not found in accepted state');
        }

        const assignment = JSON.parse(json);
        const now = Date.now();

        // Move from accepted to completed (with failed status)
        const multi = this.redisClient.multi();
        multi.hDel(this.acceptedAssignmentsKey, assignmentId);

        const failedData = {
            ...assignment,
            _failedBy: userId,
            _failedAt: now,
            _failureReason: reason,
        };
        multi.hSet(this.completedAssignmentsKey, assignmentId, JSON.stringify(failedData));

        await multi.exec();

        if (this.enableLearning) {
            await this.learning.applyOutcome(assignmentId, 'fail');
        }

        // Publish workflow event if workflows are enabled
        if (this.enableWorkflows) {
            await this.publishWorkflowEvent({
                eventId: randomUUID(),
                type: 'FAILED',
                userId,
                assignmentId,
                timestamp: now,
                payload: { reason },
            });
        }

        return true;
    }

    // ============================================================================
    // Workflow Management Methods
    // ============================================================================

    /**
     * Register a workflow definition.
     *
     * @param definition - The workflow definition to register
     */
    /**
     * Register a new workflow definition.
     */
    async registerWorkflow(definition: WorkflowDefinitionInput | WorkflowDefinition): Promise<WorkflowDefinition> {
        await this.readyPromise;
        return this.workflow.registerWorkflow(definition);
    }

    /**
     * Get a workflow definition by ID.
     */
    async getWorkflowDefinition(id: string): Promise<WorkflowDefinition | null> {
        await this.readyPromise;
        return this.workflow.getWorkflowDefinition(id);
    }

    /**
     * List all registered workflow definitions.
     */
    async listWorkflowDefinitions(): Promise<WorkflowDefinitionSummary[]> {
        await this.readyPromise;
        return this.workflow.listWorkflowDefinitions();
    }

    /**
     * Register and start a workflow in one call, or start an already-registered workflow by ID.
     */
    async executeWorkflow(
        workflowOrId: WorkflowDefinitionInput | WorkflowDefinition | string,
        userId: string,
        initialContext?: Record<string, any>,
    ): Promise<WorkflowInstance> {
        await this.readyPromise;

        if (typeof workflowOrId === 'string') {
            return this.workflow.startWorkflow(workflowOrId, userId, initialContext);
        }

        const definition = await this.workflow.registerWorkflow(workflowOrId);
        return this.workflow.startWorkflow(definition.id, userId, initialContext);
    }

    /**
     * Start a new workflow instance for a user.
     */
    async startWorkflow(
        workflowDefinitionId: string,
        userId: string,
        initialContext?: Record<string, any>,
    ): Promise<WorkflowInstance> {
        await this.readyPromise;
        return this.workflow.startWorkflow(workflowDefinitionId, userId, initialContext);
    }

    /**
     * Get a workflow instance by ID.
     */
    async getWorkflowInstance(instanceId: string): Promise<WorkflowInstance | null> {
        await this.readyPromise;
        return this.workflow.getWorkflowInstance(instanceId);
    }

    /**
     * Get a workflow instance with its snapshot definition.
     */
    async getWorkflowInstanceWithSnapshot(instanceId: string): Promise<WorkflowInstanceWithSnapshot | null> {
        await this.readyPromise;
        return this.workflow.getWorkflowInstanceWithSnapshot(instanceId);
    }

    /**
     * Get all active workflow instances for a user.
     */
    async getActiveWorkflowsForUser(userId: string): Promise<WorkflowInstance[]> {
        await this.readyPromise;
        return this.workflow.getActiveWorkflowsForUser(userId);
    }

    /**
     * Cancel a workflow instance.
     */
    async cancelWorkflow(instanceId: string): Promise<boolean> {
        await this.readyPromise;
        return this.workflow.cancelWorkflow(instanceId);
    }

    /**
     * Check and process expired workflow steps.
     * Should be called periodically.
     */
    async processExpiredWorkflowSteps(): Promise<number> {
        await this.readyPromise;
        return this.workflow.processExpiredWorkflowSteps();
    }

    /**
     * Publish a workflow event to the Redis Stream.
     */
    async publishWorkflowEvent(event: WorkflowEvent): Promise<string> {
        await this.readyPromise;
        return this.workflow.publishWorkflowEvent(event);
    }

    /**
     * Start the workflow orchestrator.
     * This listens to the event stream and processes workflow transitions.
     */
    async startOrchestrator(): Promise<void> {
        await this.readyPromise;
        return this.workflow.startOrchestrator();
    }

    /**
     * Stop the workflow orchestrator.
     */
    async stopOrchestrator(): Promise<void> {
        await this.readyPromise;
        return this.workflow.stopOrchestrator();
    }

    /**
     * Register a machine task handler by name. Machine steps with a matching
     * machineTask.handler run through this handler; unmatched handlers fall
     * back to the executeMachineTask host hook.
     */
    registerMachineHandler(name: string, handler: MachineTaskHandler): void {
        this.workflow.registerMachineHandler(name, handler);
    }

    /**
     * Process due delayed event retries. Called automatically by the
     * orchestrator; exposed for deployments that run their own schedulers.
     */
    async drainScheduledRetries(): Promise<number> {
        await this.readyPromise;
        return this.workflow.drainScheduledRetries();
    }

    /**
     * Backfill workflow indexes (active-instance index) from records created
     * before these indexes existed. Safe to run multiple times.
     */
    async backfillWorkflowIndexes(): Promise<number> {
        await this.readyPromise;
        return this.workflow.backfillWorkflowIndexes();
    }

    /**
     * Remove terminal workflow instances last updated more than olderThanMs
     * ago, including registry, per-user, and index entries.
     */
    async pruneWorkflowInstances(olderThanMs: number): Promise<number> {
        await this.readyPromise;
        return this.workflow.pruneWorkflowInstances(olderThanMs);
    }

    /**
     * Operational metrics for the workflow engine: active instances, retry
     * queue depth, DLQ size, and event stream statistics.
     */
    async getWorkflowMetrics(): Promise<WorkflowEngineMetrics> {
        await this.readyPromise;
        return this.workflow.getWorkflowMetrics();
    }

    async processExpiredMatches(): Promise<number> {
        await this.readyPromise;

        const now = Date.now();
        const expiredIds = await this.redisClient.zRangeByScore(this.pendingAssignmentsExpiryKey, '-inf', now);

        for (const id of expiredIds) {
            const owner = await this.redisClient.hGet(this.assignmentOwnerKey, id);
            const json = await this.redisClient.hGet(this.pendingAssignmentsKey, id);

            const multi = this.redisClient.multi();
            if (owner) {
                multi.sRem(this.keys.userAssignments(owner), `assignment:${id}`);
            }
            multi.hDel(this.pendingAssignmentsKey, id);
            multi.zRem(this.pendingAssignmentsExpiryKey, id);
            multi.hDel(this.assignmentOwnerKey, id);
            await multi.exec();

            if (this.enableLearning) {
                await this.learning.applyOutcome(id, 'expire');
            }

            // Publish workflow expired event if workflows are enabled
            if (this.enableWorkflows && owner) {
                await this.workflow.publishWorkflowEvent({
                    eventId: randomUUID(),
                    type: 'EXPIRED',
                    userId: owner,
                    assignmentId: id,
                    timestamp: now,
                });
            }

            if (json) {
                await this.addAssignment(JSON.parse(json));
            }
        }
        return expiredIds.length;
    }

    private autoReleaseInterval: NodeJS.Timeout | null = null;

    startAutoReleaseInterval(intervalMs: number = 10000) {
        if (this.autoReleaseInterval) return;
        this.autoReleaseInterval = setInterval(() => {
            this.processExpiredMatches().catch(console.error);
        }, intervalMs);
    }

    stopAutoReleaseInterval() {
        if (this.autoReleaseInterval) {
            clearInterval(this.autoReleaseInterval);
            this.autoReleaseInterval = null;
        }
    }

    // ============================================================================
    // Idle User Auto-Rejection (opt-in via idleUserTimeoutMs)
    // ============================================================================

    /**
     * Record activity for a user (heartbeat). Resets the idle clock used by
     * processIdleUsers(). Called automatically on addUser, acceptAssignment,
     * and rejectAssignment; consumers can also call it directly as a heartbeat.
     */
    async touchUser(userId: string): Promise<void> {
        await this.readyPromise;
        await this.redisClient.zAdd(this.keys.userActivity(), { score: Date.now(), value: userId });
    }

    /**
     * Detect users that have been idle longer than idleUserTimeoutMs while
     * holding pending (unactioned) assignments. Idle users are removed from
     * the matching pool and their pending assignments are requeued for
     * distribution to other users.
     *
     * No-op (returns []) when idleUserTimeoutMs is not configured.
     *
     * @returns IDs of users that were removed
     */
    async processIdleUsers(): Promise<string[]> {
        await this.readyPromise;

        if (this.idleUserTimeoutMs === null) return [];

        const cutoff = Date.now() - this.idleUserTimeoutMs;
        const idleCandidates = await this.redisClient.zRangeByScore(this.keys.userActivity(), '-inf', cutoff);

        const removed: string[] = [];
        for (const userId of idleCandidates) {
            // Skip users no longer in the pool (clean up stale activity entry)
            const exists = await this.redisClient.hExists(this.usersKey, userId);
            if (!exists) {
                await this.redisClient.zRem(this.keys.userActivity(), userId);
                continue;
            }

            // Only consider a user idle if they are sitting on unactioned assignments
            const pendingCount = await this.redisClient.sCard(this.keys.userAssignments(userId));
            if (pendingCount === 0) continue;

            await this.releaseUserPendingAssignments(userId);
            await this.removeUser(userId);
            removed.push(userId);
        }

        return removed;
    }

    /**
     * Requeue all pending assignments currently held by a user.
     */
    private async releaseUserPendingAssignments(userId: string): Promise<void> {
        const members = await this.redisClient.sMembers(this.keys.userAssignments(userId));
        const now = Date.now();

        for (const member of members) {
            const id = member.split(':')[1];
            const json = await this.redisClient.hGet(this.pendingAssignmentsKey, id);

            const multi = this.redisClient.multi();
            multi.sRem(this.keys.userAssignments(userId), member);
            multi.hDel(this.pendingAssignmentsKey, id);
            multi.zRem(this.pendingAssignmentsExpiryKey, id);
            multi.hDel(this.assignmentOwnerKey, id);
            await multi.exec();

            if (this.enableLearning) {
                await this.learning.applyOutcome(id, 'expire');
            }

            if (this.enableWorkflows) {
                await this.workflow.publishWorkflowEvent({
                    eventId: randomUUID(),
                    type: 'EXPIRED',
                    userId,
                    assignmentId: id,
                    timestamp: now,
                });
            }

            if (json) {
                await this.addAssignment(JSON.parse(json));
            }
        }
    }

    private idleUserInterval: NodeJS.Timeout | null = null;

    startIdleUserInterval(intervalMs: number = 10000) {
        if (this.idleUserInterval) return;
        this.idleUserInterval = setInterval(() => {
            this.processIdleUsers().catch(console.error);
        }, intervalMs);
    }

    stopIdleUserInterval() {
        if (this.idleUserInterval) {
            clearInterval(this.idleUserInterval);
            this.idleUserInterval = null;
        }
    }

    /**
     * Get assignments specifically targeted at a user through active workflows.
     * These take priority over general pool assignments for deterministic matching.
     */
    private async getWorkflowTargetedAssignments(userId: string): Promise<Array<{ id: string; priority: number }>> {
        const targeted: Array<{ id: string; priority: number }> = [];

        // Scan queued assignments for those with _targetUserId matching this user
        const queuedAssignments = await this.redisClient.hGetAll(this.assignmentsRefKey);

        for (const [assignmentId, json] of Object.entries(queuedAssignments)) {
            try {
                const assignment = JSON.parse(json);
                // Hard veto applies even to deterministic workflow targeting
                if (assignment.vetoedUsers?.includes(userId)) continue;
                if (assignment._targetUserId === userId && assignment._workflowInstanceId) {
                    // This is a workflow assignment targeted at this user
                    targeted.push({
                        id: assignmentId,
                        priority: assignment.priority ?? 1000,
                    });
                }
            } catch {
                // Ignore parse errors
            }
        }

        // Sort by priority (higher first)
        targeted.sort((a, b) => b.priority - a.priority);

        return targeted;
    }

    private async expandTagWildcards(tags: { tag: string; weight: number }[]): Promise<{ tag: string; weight: number }[]> {
        const expanded: { tag: string; weight: number }[] = [];
        const wildcards = tags.filter((t) => t.tag.endsWith('*'));
        const literals = tags.filter((t) => !t.tag.endsWith('*'));

        expanded.push(...literals);

        if (wildcards.length > 0) {
            const promises = wildcards.map((w) => {
                const prefix = w.tag.slice(0, -1);
                return this.redisClient.zRangeByLex(this.allTagsKey, `[${prefix}`, `[${prefix}\xff`);
            });
            const results = await Promise.all(promises);

            for (let i = 0; i < wildcards.length; i++) {
                const w = wildcards[i];
                const matchedTags = results[i];
                for (const tag of matchedTags) {
                    expanded.push({ tag, weight: w.weight });
                }
            }
        }
        return expanded;
    }
}
