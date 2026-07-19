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
import { calculateMatchScore, calculateDefaultPriority, explainMatchScore } from './scoring/match-score';
import { arbitrateFair, resolveFairnessKnobs } from './scoring/fair-arbitration';
import {
    TraceCollector,
    buildDecisionTraces,
    buildWorkflowTraces,
    sortCandidates,
    type TraceUserContext,
} from './tracing/decision-trace';
import { extractMatchFeatures } from './learning/features';
import { DecisionTraceManager } from './managers/DecisionTraceManager';
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
    QueueStats,
    UserLoadInfo,
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
    FairnessMode,
    FairnessConfig,
    MatchTraceReason,
    MatchCandidateTrace,
    MatchDecisionTrace,
    MatchDecisionMode,
    MatchExplanation,
    MatchPreview,
    MatchPreviewInput,
    DecisionTraceQuery,
} from './types/matcher';

// Re-export types for backwards compatibility
export type {
    RedisClientType,
    User,
    Assignment,
    Stats,
    PendingAssignmentInfo,
    QueueStats,
    UserLoadInfo,
    MatcherOptions,
    options,
    FairnessMode,
    FairnessConfig,
    GeoMatchResult,
    GeoMatchingFunction,
    ReliabilityMetrics,
    WorkflowInstanceStatus,
    WorkflowRouting,
    MatchTraceReason,
    MatchCandidateTrace,
    MatchDecisionTrace,
    MatchDecisionMode,
    MatchExplanation,
    MatchPreview,
    MatchPreviewInput,
    DecisionTraceQuery,
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
    private enableFairTiebreaker: boolean;
    private fairnessMode?: FairnessMode;
    private fairnessLoadPenalty: number;
    private fairnessTieBand: number;
    private fairnessMaxPerWindow?: number;
    private fairnessWindowMs: number;

    // Decision traces (explainability/audit) properties
    private enableDecisionTraces: boolean;
    private decisionTraceMaxCandidates: number;
    private decisionTraces: DecisionTraceManager;

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
        this.enableFairTiebreaker = options?.enableFairTiebreaker ?? false;
        this.fairnessMode = options?.fairness;
        if (this.fairnessMode) this.enableFairTiebreaker = this.fairnessMode !== 'first-come';
        this.fairnessLoadPenalty = options?.fairnessLoadPenalty ?? 0;
        this.fairnessTieBand = options?.fairnessTieBand ?? 0;
        this.fairnessMaxPerWindow = options?.fairnessMaxPerWindow;
        this.fairnessWindowMs = options?.fairnessWindowMs ?? 3600000;

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

        // Decision traces (opt-in explainability/audit records per routing decision)
        this.enableDecisionTraces = options?.enableDecisionTraces ?? false;
        this.decisionTraceMaxCandidates = options?.decisionTraceMaxCandidates ?? 25;
        this.decisionTraces = new DecisionTraceManager(this.redisClient, this.keys, {
            maxEntries: options?.decisionTraceMaxEntries ?? 1000,
            onDecision: options?.onMatchDecision,
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

    /**
     * Toggle fair-tiebreaker global best-match arbitration at runtime.
     * See `MatcherOptions.enableFairTiebreaker` for what this changes.
     */
    setFairTiebreaker(enabled: boolean): void {
        this.enableFairTiebreaker = !!enabled;
    }

    /** Current runtime fair-tiebreaker state. */
    isFairTiebreakerEnabled(): boolean {
        return this.enableFairTiebreaker;
    }

    /**
     * Switch the bulk-matching fairness policy at runtime — shorthand for
     * `setFairnessConfig({ fairness: mode })`. See `MatcherOptions.fairness`
     * for what each mode does.
     */
    setFairness(mode: FairnessMode): void {
        this.setFairnessConfig({ fairness: mode });
    }

    /**
     * Retune any subset of the bulk-matching fairness knobs at runtime without
     * reconstructing the matcher. Absent fields are left unchanged; the new
     * values take effect on the next `matchUsersAssignments()` call (a match
     * already in flight keeps the values it started with). Merge semantics
     * mirror the constructor exactly — in particular, an explicit `fairness`
     * overrides `enableFairTiebreaker`. See `MatcherOptions` for each field.
     */
    setFairnessConfig(config: FairnessConfig): void {
        if ('enableFairTiebreaker' in config) this.enableFairTiebreaker = !!config.enableFairTiebreaker;
        if ('fairness' in config) {
            this.fairnessMode = config.fairness;
            if (this.fairnessMode) this.enableFairTiebreaker = this.fairnessMode !== 'first-come';
        }
        if ('fairnessLoadPenalty' in config) this.fairnessLoadPenalty = config.fairnessLoadPenalty ?? 0;
        if ('fairnessTieBand' in config) this.fairnessTieBand = config.fairnessTieBand ?? 0;
        if ('fairnessMaxPerWindow' in config) this.fairnessMaxPerWindow = config.fairnessMaxPerWindow;
        if ('fairnessWindowMs' in config) this.fairnessWindowMs = config.fairnessWindowMs ?? 3600000;
    }

    /** Current runtime fairness policy. */
    getFairness(): FairnessMode {
        if (!this.enableFairTiebreaker) return 'first-come';
        return this.fairnessMode ?? 'best-match';
    }

    /** Snapshot of the live fairness configuration. */
    getFairnessConfig(): {
        fairness: FairnessMode;
        enableFairTiebreaker: boolean;
        fairnessLoadPenalty: number;
        fairnessTieBand: number;
        fairnessMaxPerWindow: number | undefined;
        fairnessWindowMs: number;
    } {
        return {
            fairness: this.getFairness(),
            enableFairTiebreaker: this.enableFairTiebreaker,
            fairnessLoadPenalty: this.fairnessLoadPenalty,
            fairnessTieBand: this.fairnessTieBand,
            fairnessMaxPerWindow: this.fairnessMaxPerWindow,
            fairnessWindowMs: this.fairnessWindowMs,
        };
    }

    // ============================================================================
    // Decision Traces & Explainability
    // ============================================================================

    /** Whether trace capture should run this pass (persistence flag or real-time hook). */
    private get tracingActive(): boolean {
        return this.enableDecisionTraces || this.decisionTraces.hasDecisionHook;
    }

    /**
     * Toggle decision-trace persistence at runtime without reconstructing the
     * matcher. Takes effect on the next matching pass (a pass already in
     * flight keeps the value it started with).
     */
    setDecisionTraces(enabled: boolean): void {
        this.enableDecisionTraces = !!enabled;
    }

    /** Current runtime decision-trace persistence state. */
    isDecisionTracesEnabled(): boolean {
        return this.enableDecisionTraces;
    }

    /**
     * Query recorded decision traces, newest first. Only decisions made while
     * `enableDecisionTraces` was active are stored — traces are captured as
     * decisions happen, never reconstructed after the fact.
     */
    async getDecisionTraces(query?: DecisionTraceQuery): Promise<MatchDecisionTrace[]> {
        await this.readyPromise;
        return this.decisionTraces.getTraces(query);
    }

    /** Delete all recorded decision traces. */
    async clearDecisionTraces(): Promise<number> {
        await this.readyPromise;
        return this.decisionTraces.clear();
    }

    /**
     * Explain, from live state, which users could receive an assignment and
     * why each one is or is not eligible: vetoes, prior rejections, skill
     * thresholds, CIDR and geo constraints, backlog, the full score breakdown,
     * and learning influence. Works for assignments in any lifecycle state;
     * for matched assignments the current owner is flagged `chosen` (accepted
     * assignments report `ownerId: null` because ownership metadata is
     * released on acceptance — decision traces retain the full history).
     *
     * This is an on-demand recomputation against current state. For the
     * auditable record of a decision as it actually happened, use
     * `getDecisionTraces()`.
     */
    async explainMatch(assignmentId: string, opts?: { userIds?: string[] }): Promise<MatchExplanation> {
        await this.readyPromise;
        const evaluatedAt = Date.now();

        let found = await getAssignmentById(this.redisClient, this.assignmentStoreKeys, assignmentId);
        let status: MatchExplanation['status'];
        if (found) {
            status = (found._status ?? 'queued') as MatchExplanation['status'];
        } else {
            // getAssignmentById only covers queued/pending/accepted
            const completedJson = await this.redisClient.hGet(this.completedAssignmentsKey, assignmentId);
            if (!completedJson) {
                return { assignmentId, status: 'not_found', ownerId: null, evaluatedAt, candidates: [] };
            }
            found = JSON.parse(completedJson);
            status = 'completed';
        }
        const assignment = found as Assignment & { _status?: string; _completedBy?: string; _failedBy?: string };

        let ownerId: string | null = null;
        if (status === 'pending') {
            ownerId = (await this.redisClient.hGet(this.assignmentOwnerKey, assignmentId)) ?? null;
        } else if (status === 'completed') {
            ownerId = assignment._completedBy ?? assignment._failedBy ?? null;
        }

        // Queued assignments may have had their priority retuned since creation
        let basePriority = Number(assignment.priority) || 0;
        if (status === 'queued') {
            const stored = await this.redisClient.hGet(this.keys.assignmentPriority(assignmentId), 'priority');
            if (stored !== null && stored !== undefined) basePriority = Number(stored) || 0;
        }

        // Mirror the tags CSV the scoring path sees (the stored tags hash appends 'default')
        const tagsCsv = [...assignment.tags, ...(this.enableDefaultMatching ? ['default'] : [])].join(',');

        let userList: User[];
        if (opts?.userIds && opts.userIds.length > 0) {
            const jsons = await this.redisClient.hmGet(this.usersKey, opts.userIds);
            userList = jsons.filter((json: string | null): json is string => Boolean(json)).map((json) => JSON.parse(json));
        } else {
            const all = await this.redisClient.hGetAll(this.usersKey);
            userList = Object.values(all).map((json) => JSON.parse(json as string));
        }

        const modelWeights = this.enableLearning ? await this.learning.getModel() : undefined;
        const candidates = await Promise.all(
            userList.map((user) =>
                this.explainCandidate(user, assignment, assignmentId, tagsCsv, basePriority, ownerId, modelWeights),
            ),
        );
        sortCandidates(candidates);

        return { assignmentId, status, ownerId, evaluatedAt, candidates };
    }

    /** One user's full eligibility/score evaluation for explainMatch(). */
    private async explainCandidate(
        user: User,
        assignment: Assignment,
        assignmentId: string,
        tagsCsv: string,
        basePriority: number,
        ownerId: string | null,
        modelWeights?: Record<string, string>,
    ): Promise<MatchCandidateTrace> {
        const [isRejected, backlog, isPaused] = await Promise.all([
            this.redisClient.sIsMember(this.keys.userRejected(user.id), assignmentId),
            this.redisClient.sCard(this.keys.userAssignments(user.id)),
            this.redisClient.sIsMember(this.keys.pausedUsers(), user.id),
        ]);
        return this.evaluateCandidateForAssignment(user, assignment, tagsCsv, basePriority, modelWeights, {
            assignmentId,
            ownerId,
            isRejected: Boolean(isRejected),
            backlog,
            isPaused: Boolean(isPaused),
        });
    }

    /**
     * Shared eligibility/scoring evaluation used by explainMatch() and
     * previewMatch(). Read-only: never claims, writes, or records decisions.
     */
    private async evaluateCandidateForAssignment(
        user: User,
        assignment: Assignment,
        tagsCsv: string,
        basePriority: number,
        modelWeights: Record<string, string> | undefined,
        opts: {
            assignmentId?: string | null;
            ownerId?: string | null;
            isRejected?: boolean;
            backlog?: number;
            isPaused?: boolean;
        },
    ): Promise<MatchCandidateTrace> {
        const reasons: MatchTraceReason[] = [];
        let eligible = true;
        const assignmentId = opts.assignmentId ?? '';
        const ownerId = opts.ownerId ?? null;
        const isRejected = opts.isRejected ?? false;
        const isPaused = opts.isPaused ?? false;
        const backlog = opts.backlog ?? 0;

        if (assignment.vetoedUsers?.includes(user.id)) {
            reasons.push({ kind: 'assignmentVeto' });
            eligible = false;
        }

        if (isRejected) {
            reasons.push({ kind: 'rejectedPreviously' });
            eligible = false;
        }
        if (isPaused) {
            reasons.push({ kind: 'paused' });
            eligible = false;
        }
        const backlogLimit = this.backlogLimitFor(user);
        if (backlog >= backlogLimit) {
            reasons.push({ kind: 'backlogFull', backlog, limit: backlogLimit });
            eligible = false;
        }

        const routingWeights = user.routingWeights;
        const hasRoutingWeights = Boolean(routingWeights && Object.keys(routingWeights).length > 0);
        if (
            hasRoutingWeights &&
            this.usingDefaultMatchScore &&
            !Object.values(routingWeights!).some((w) => typeof w === 'number' && w > 0)
        ) {
            reasons.push({ kind: 'noPositiveWeights' });
            eligible = false;
        }

        if (!checkCidrMatch(user.ip, assignment.allowedCidrs)) {
            reasons.push({ kind: 'cidrMismatch', ip: user.ip });
            eligible = false;
        }

        const geoMatch = await this.evaluateGeoMatch(user, assignment);
        let geoBoost = 0;
        if (!geoMatch.eligible) {
            reasons.push({
                kind: 'geoDistance',
                distanceKm: geoMatch.distanceKm,
                maxDistanceKm: geoMatch.effectiveMaxDistanceKm,
                withinRange: false,
            });
            eligible = false;
        } else {
            geoBoost = this.calculateGeoBoost(geoMatch);
            if (typeof geoMatch.distanceKm === 'number') {
                reasons.push({
                    kind: 'geoDistance',
                    distanceKm: geoMatch.distanceKm,
                    maxDistanceKm: geoMatch.effectiveMaxDistanceKm,
                    withinRange: true,
                });
            }
            if (geoBoost > 0) reasons.push({ kind: 'geoBoost', boost: geoBoost });
        }

        let score: number;
        let combinedPriority: number;
        if (this.usingDefaultMatchScore) {
            const explained = explainMatchScore(
                user,
                tagsCsv,
                basePriority,
                this.enableDefaultMatching,
                assignment.skillThresholds,
            );
            score = explained.score;
            combinedPriority = explained.combinedPriority;
            reasons.push(...explained.reasons);
        } else {
            [score, combinedPriority] = await this.matchScore(
                user,
                tagsCsv,
                basePriority,
                assignmentId || undefined,
                assignment.skillThresholds,
            );
            reasons.push({ kind: 'customScore', score });
        }
        if (!score) eligible = false;

        let learningBoost = 0;
        if (this.enableLearning && modelWeights) {
            const context: LearningAssignmentContext = { ...assignment, id: assignmentId, tags: assignment.tags };
            const features = this.learningFeatureExtractor(user, context);
            const predicted = this.learning.predict(features, modelWeights);
            const shadowMode = this.learning.shadowMode;
            learningBoost = shadowMode ? 0 : this.learning.boostFactor * predicted;
            reasons.push({ kind: 'learningBoost', predicted, boost: learningBoost, shadowMode });
        }

        return {
            userId: user.id,
            eligible,
            chosen: ownerId === user.id,
            score,
            effectivePriority: combinedPriority + geoBoost + learningBoost,
            reasons,
        };
    }

    /**
     * Preview which users would be candidates for a hypothetical assignment
     * without creating it or claiming anything. Uses the same scoring, hard
     * rules, and learning re-ranking as real matching, so the ranked result
     * matches what `explainMatch()` would report if the assignment were added.
     */
    async previewMatch(input: MatchPreviewInput, opts?: { userIds?: string[] }): Promise<MatchPreview> {
        await this.readyPromise;
        const evaluatedAt = Date.now();

        const assignment: Assignment = {
            id: '',
            tags: input.tags,
            priority: input.priority ?? 0,
            skillThresholds: input.skillThresholds,
            allowedCidrs: input.allowedCidrs,
            vetoedUsers: input.vetoedUsers,
            latitude: input.latitude,
            longitude: input.longitude,
            maxDistanceKm: input.maxDistanceKm,
            requireGeo: input.requireGeo,
        };

        const tagsCsv = [...input.tags, ...(this.enableDefaultMatching ? ['default'] : [])].join(',');
        const basePriority = Number(assignment.priority) || 0;

        let userList: User[];
        if (opts?.userIds && opts.userIds.length > 0) {
            const jsons = await this.redisClient.hmGet(this.usersKey, opts.userIds);
            userList = jsons
                .filter((json: string | null): json is string => Boolean(json))
                .map((json) => JSON.parse(json));
        } else {
            const all = await this.redisClient.hGetAll(this.usersKey);
            userList = Object.values(all).map((json) => JSON.parse(json as string));
        }

        const paused = new Set<string>(await this.redisClient.sMembers(this.keys.pausedUsers()));
        const modelWeights = this.enableLearning ? await this.learning.getModel() : undefined;

        const candidates = await Promise.all(
            userList.map(async (user) => {
                const backlog = await this.redisClient.sCard(this.keys.userAssignments(user.id));
                return this.evaluateCandidateForAssignment(user, assignment, tagsCsv, basePriority, modelWeights, {
                    ownerId: null,
                    isRejected: false,
                    backlog,
                    isPaused: paused.has(user.id),
                });
            }),
        );
        sortCandidates(candidates);

        return { tags: input.tags, priority: basePriority, evaluatedAt, candidates };
    }

    /** Build and record this pass's decision traces; failures never break matching. */
    private async recordPassTraces(
        collector: TraceCollector,
        winners: Map<string, string>,
        workflowGrants: Array<{ assignmentId: string; userId: string; priority: number }>,
        mode: MatchDecisionMode,
        users: User[],
    ): Promise<void> {
        if (winners.size === 0 && workflowGrants.length === 0) return;
        try {
            // A workflow-targeted assignment is also tag-indexed, so the
            // tag-scored path can claim it in the same pass. One decision,
            // one trace: the deterministic targeting is the authoritative
            // story, so the 'workflow' record wins.
            for (const grant of workflowGrants) winners.delete(grant.assignmentId);

            const matchedAt = Date.now();
            const contexts = await this.getTraceUserContexts(users);
            const traces = [
                ...buildDecisionTraces({
                    collector,
                    winners,
                    mode,
                    users: contexts,
                    maxCandidates: this.decisionTraceMaxCandidates,
                    matchedAt,
                }),
                ...buildWorkflowTraces(workflowGrants, matchedAt),
            ];
            await this.decisionTraces.record(traces, this.enableDecisionTraces);
        } catch (err) {
            console.error('Failed to record decision traces:', err);
        }
    }

    /** Exclusion sets used to enrich traces with prefiltered (vetoed/rejected/paused) users. */
    private async getTraceUserContexts(users: User[]): Promise<TraceUserContext[]> {
        const paused = new Set<string>(await this.redisClient.sMembers(this.keys.pausedUsers()));
        return Promise.all(
            users.map(async (user) => {
                const [rejected, vetoed] = await Promise.all([
                    this.redisClient.sMembers(this.keys.userRejected(user.id)),
                    this.redisClient.sMembers(this.keys.userVetoed(user.id)),
                ]);
                return {
                    user,
                    rejected: new Set<string>(rejected),
                    vetoed: new Set<string>(vetoed),
                    paused: paused.has(user.id),
                };
            }),
        );
    }

    /** One sMembers per pass: the user list minus currently paused users. */
    private async filterPausedUsers(users: User[]): Promise<User[]> {
        const paused = await this.redisClient.sMembers(this.keys.pausedUsers());
        if (paused.length === 0) return users;
        const pausedSet = new Set<string>(paused);
        return users.filter((user) => !pausedSet.has(user.id));
    }

    /**
     * Workflow-targeted assignments are re-granted idempotently on every
     * matching pass until actioned; only first-time grants deserve a decision
     * trace. Reads membership before the sAdd that follows.
     */
    private async filterNewWorkflowGrants(
        user: User,
        workflowTargeted: Array<{ id: string; priority: number }>,
    ): Promise<Array<{ assignmentId: string; userId: string; priority: number }>> {
        if (workflowTargeted.length === 0) return [];
        const memberships = await this.redisClient.smIsMember(
            this.keys.userAssignments(user.id),
            workflowTargeted.map((w) => `assignment:${w.id}`),
        );
        return workflowTargeted
            .filter((_, i) => !memberships[i])
            .map((w) => ({ assignmentId: w.id, userId: user.id, priority: w.priority }));
    }

    /** Reasons for one scored candidate evaluation (trace capture only). */
    private traceScoreReasons(
        user: User,
        detail: { tags: string; basePriority: number; skillThresholds?: Record<string, number> },
        score: number,
        geoMatch: GeoMatchResult,
        geoBoost: number,
        learning?: { predicted: number; boost: number; shadowMode: boolean },
    ): MatchTraceReason[] {
        const reasons: MatchTraceReason[] = this.usingDefaultMatchScore
            ? explainMatchScore(user, detail.tags, detail.basePriority, this.enableDefaultMatching, detail.skillThresholds)
                  .reasons
            : [{ kind: 'customScore', score }];
        if (typeof geoMatch.distanceKm === 'number') {
            reasons.push({
                kind: 'geoDistance',
                distanceKm: geoMatch.distanceKm,
                maxDistanceKm: geoMatch.effectiveMaxDistanceKm,
                withinRange: true,
            });
        }
        if (geoBoost > 0) reasons.push({ kind: 'geoBoost', boost: geoBoost });
        if (learning) {
            reasons.push({
                kind: 'learningBoost',
                predicted: learning.predicted,
                boost: learning.boost,
                shadowMode: learning.shadowMode,
            });
        }
        return reasons;
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
            // NX: a requeue (reject/expiry re-adds via this method) keeps the
            // original first-enqueue wait clock.
            .zAdd(this.keys.assignmentsQueuedAt(), { score: Date.now(), value: id }, { NX: true })
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
        multi.zRem(this.keys.assignmentsQueuedAt(), id.toString());
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
            .sRem(this.keys.pausedUsers(), userId)
            .hDel(this.usersKey, userId);
        await multi.exec();

        return userId;
    }

    /**
     * Get one stored user as last written by addUser (including the injected
     * 'default' tag when enableDefaultMatching is on), or null.
     */
    async getUser(userId: string): Promise<User | null> {
        await this.readyPromise;
        const json = await this.redisClient.hGet(this.usersKey, userId);
        return json ? JSON.parse(json) : null;
    }

    /** All stored users. The pool is small by design; for load metadata see getQueueStats(). */
    async getUsers(): Promise<User[]> {
        await this.readyPromise;
        const users: User[] = [];
        let cursor = '0';
        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.usersKey, cursor, { COUNT: 500 });
            users.push(...entries.map((t: { field: string; value: string }) => JSON.parse(t.value)));
            cursor = nextCursor;
        } while (cursor !== '0');
        return users;
    }

    // ============================================================================
    // Worker Availability (pause/resume)
    // ============================================================================

    /**
     * Pause a user: they stop receiving new assignments in every matching path
     * until resumed, but keep their pending backlog and can still accept,
     * complete, reject, or fail work they already hold. Paused users are also
     * exempt from idle auto-removal (pausing is deliberate absence, not
     * idleness). Idempotent.
     *
     * @returns false when the user is not in the pool (nothing is recorded)
     */
    async pauseUser(userId: string): Promise<boolean> {
        await this.readyPromise;
        const exists = await this.redisClient.hExists(this.usersKey, userId);
        if (!exists) return false;
        await this.redisClient.sAdd(this.keys.pausedUsers(), userId);
        return true;
    }

    /**
     * Resume a paused user so matching considers them again on the next pass.
     * Also records activity (resets the idle clock).
     *
     * @returns false when the user was not paused
     */
    async resumeUser(userId: string): Promise<boolean> {
        await this.readyPromise;
        const wasPaused = await this.redisClient.sRem(this.keys.pausedUsers(), userId);
        if (wasPaused) await this.touchUser(userId);
        return wasPaused > 0;
    }

    /**
     * Requeue every pending (matched but not yet accepted) assignment the user
     * holds so other users can pick them up — the operator's "this person is
     * gone, redistribute their work" move, typically paired with `pauseUser`
     * (which alone deliberately preserves the backlog). Accepted assignments
     * (work in progress) are never touched. Requeued assignments keep their
     * original wait clock, and a still-paused user won't win them back until
     * resumed. Returns the released assignment ids ([] when nothing was held).
     */
    async releaseUserAssignments(userId: string): Promise<string[]> {
        await this.readyPromise;
        return this.releaseUserPendingAssignments(userId);
    }

    /** Whether a user is currently paused. */
    async isUserPaused(userId: string): Promise<boolean> {
        await this.readyPromise;
        return Boolean(await this.redisClient.sIsMember(this.keys.pausedUsers(), userId));
    }

    /** IDs of all currently paused users. */
    async getPausedUsers(): Promise<string[]> {
        await this.readyPromise;
        const members = await this.redisClient.sMembers(this.keys.pausedUsers());
        return members.sort();
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
     * Live operational snapshot for dashboards: queued/pending counts, the
     * age of the longest-waiting unaccepted assignment, and every user's
     * backlog depth, effective cap, and paused state. The wait clock starts
     * at first enqueue and survives reject/expiry requeues; it stops on
     * accept or removal.
     */
    async getQueueStats(): Promise<QueueStats> {
        await this.readyPromise;

        const [counts, oldestEntries, pausedMembers] = await Promise.all([
            getAssignmentCountsFromStores(this.redisClient, this.assignmentStoreKeys),
            this.redisClient.zRangeWithScores(this.keys.assignmentsQueuedAt(), 0, 0),
            this.redisClient.sMembers(this.keys.pausedUsers()),
        ]);
        const paused = new Set<string>(pausedMembers);

        const users: User[] = [];
        let cursor = '0';
        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.usersKey, cursor, { COUNT: 500 });
            users.push(...entries.map((t: { field: string; value: string }) => JSON.parse(t.value)));
            cursor = nextCursor;
        } while (cursor !== '0');

        const perUser: UserLoadInfo[] = await Promise.all(
            users.map(async (user) => ({
                userId: user.id,
                backlog: await this.redisClient.sCard(this.keys.userAssignments(user.id)),
                maxBacklogSize: this.backlogLimitFor(user),
                paused: paused.has(user.id),
            })),
        );
        perUser.sort((a, b) => a.userId.localeCompare(b.userId));

        return {
            queued: counts.queued,
            pending: counts.pending,
            oldestWaitingMs: oldestEntries.length > 0 ? Date.now() - Number(oldestEntries[0].score) : null,
            perUser,
        };
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
        const [refJson, tagsCsv] = (await this.redisClient
            .multi()
            .hGet(this.assignmentsRefKey, id)
            .hGet(assignmentTagsKey, 'tags')
            .exec()) as unknown as [string | null, string | null];
        const tags = (tagsCsv && tagsCsv.length > 0 ? tagsCsv.split(',') : []) as string[];

        const multi = this.redisClient.multi();
        multi.hSet(assignmentPriorityKey, 'priority', priority);
        if (refJson) {
            // Update global zset score and per-tag zset scores only if assignment still exists,
            // plus the stored record itself so reads see the new priority.
            multi.hSet(this.assignmentsRefKey, id, JSON.stringify({ ...JSON.parse(refJson), priority }));
            multi.zAdd(this.assignmentsKey, { score: Number(priority), value: id });
            for (const tag of tags) {
                multi.zAdd(this.keys.tagAssignments(tag), { score: Number(priority), value: id });
            }
        }
        await multi.exec();

        if (refJson) {
            // The snapshot read above races the atomic claim gate: if a claim
            // HDELed the record between our read and write, the writes above
            // resurrected a ghost queued entry. Detect and undo.
            const owner = await this.redisClient.hGet(this.assignmentOwnerKey, id);
            if (owner) {
                const cleanup = this.redisClient.multi().hDel(this.assignmentsRefKey, id).zRem(this.assignmentsKey, id);
                for (const tag of tags) {
                    cleanup.zRem(this.keys.tagAssignments(tag), id);
                }
                await cleanup.exec();
            }
        }

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

    /**
     * Read-only candidate discovery for one user: workflow-targeted lookups,
     * the weighted per-tag zset union/diff, and per-candidate scoring
     * (learning-influenced or plain, matching the existing behavior exactly).
     * Does NOT claim anything - see claimSelected() for that. Split out so
     * matchAllUsersFair() can evaluate every user's candidates before any of
     * them claim, enabling global (cross-user) score comparison.
     *
     * `capToBacklog` (default true, matching prior inline behavior): stop
     * scoring once this user's own maxUserBacklogSize worth of candidates has
     * been found. matchAllUsersFair() passes false - capping per-user during
     * discovery would silently drop a user's lower-priority candidates before
     * global arbitration ever runs, e.g. a user whose top picks all lose to a
     * higher scorer should still be considered for their next-best options,
     * not left with nothing because discovery stopped early.
     */
    /**
     * Effective backlog cap for one user: `user.maxBacklogSize` when it is a
     * valid non-negative number, else the matcher-wide `maxUserBacklogSize`.
     * The fairness window auto-cap derivation (team-level) deliberately keeps
     * using the global value.
     */
    private backlogLimitFor(user: User): number {
        const own = user.maxBacklogSize;
        return typeof own === 'number' && Number.isFinite(own) && own >= 0 ? own : this.maxUserBacklogSize;
    }

    private async computeCandidatesForUser(
        user: User,
        capToBacklog = true,
        collector?: TraceCollector,
    ): Promise<{
        userAssignments: Array<{ id: string; priority: number }>;
        selected: Array<{ id: string; tags: string }>;
        workflowTargetedCount: number;
    }> {
        const userAssignments: Array<{ id: string; priority: number }> = [];
        const routingWeights = user.routingWeights;
        const hasRoutingWeights = Boolean(routingWeights && Object.keys(routingWeights).length > 0);

        // Priority 1: Check for workflow-targeted assignments (deterministic matching)
        if (this.enableWorkflows) {
            const workflowAssignments = await this.getWorkflowTargetedAssignments(user.id);
            if (workflowAssignments.length > 0) {
                // Workflow assignments take precedence - add them first with highest priority
                userAssignments.push(...workflowAssignments);
                if (userAssignments.length >= this.backlogLimitFor(user)) {
                    return { userAssignments, selected: [], workflowTargetedCount: userAssignments.length };
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
            return { userAssignments, selected: [], workflowTargetedCount };
        }

        if (positiveWeights.length === 0) return { userAssignments, selected: [], workflowTargetedCount };

        // Expand wildcards
        const expandedPositive = await this.expandTagWildcards(positiveWeights);
        const expandedZero = this.usingDefaultMatchScore
            ? await this.expandTagWildcards(zeroWeightTags.map((t) => ({ tag: t, weight: 0 })))
            : [];
        const finalZeroTags = expandedZero.map((t) => t.tag);

        if (expandedPositive.length === 0) return { userAssignments, selected: [], workflowTargetedCount };

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

        if (top.length === 0) return { userAssignments, selected: [], workflowTargetedCount };

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
                if (!checkCidrMatch(user.ip, d.allowedCidrs)) {
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: false,
                        score: 0,
                        effectivePriority: 0,
                        reasons: [{ kind: 'cidrMismatch', ip: user.ip }],
                    });
                    continue;
                }

                const geoMatch = await this.evaluateGeoMatch(user, d.raw ?? { id: d.id, tags: [] });
                if (!geoMatch.eligible) {
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: false,
                        score: 0,
                        effectivePriority: 0,
                        reasons: [
                            {
                                kind: 'geoDistance',
                                distanceKm: geoMatch.distanceKm,
                                maxDistanceKm: geoMatch.effectiveMaxDistanceKm,
                                withinRange: false,
                            },
                        ],
                    });
                    continue;
                }

                const [score, combinedPriority] = await this.matchScore(
                    user,
                    d.tags,
                    d.basePriority,
                    d.id,
                    d.skillThresholds,
                );
                if (!score || !combinedPriority) {
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: false,
                        score: 0,
                        effectivePriority: Number(d.basePriority) || 0,
                        reasons: this.traceScoreReasons(user, d, score, geoMatch, 0),
                    });
                    continue;
                }
                const traceGeoBoost = this.calculateGeoBoost(geoMatch);
                const geoAdjustedPriority = combinedPriority + traceGeoBoost;

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
                collector?.record(d.id, d.tags, {
                    userId: user.id,
                    eligible: true,
                    score,
                    effectivePriority,
                    reasons: this.traceScoreReasons(user, d, score, geoMatch, traceGeoBoost, {
                        predicted,
                        boost: effectivePriority - geoAdjustedPriority,
                        shadowMode: this.learning.shadowMode,
                    }),
                });
            }

            eligible.sort((a, b) => b.effectivePriority - a.effectivePriority);

            for (const c of eligible) {
                if (capToBacklog && userAssignments.length >= this.backlogLimitFor(user)) break;
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
                if (capToBacklog && userAssignments.length >= this.backlogLimitFor(user)) break;

                // Check CIDR restrictions: if assignment has allowedCidrs, user must have matching IP
                if (!checkCidrMatch(user.ip, d.allowedCidrs)) {
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: false,
                        score: 0,
                        effectivePriority: 0,
                        reasons: [{ kind: 'cidrMismatch', ip: user.ip }],
                    });
                    continue; // Skip this assignment - user IP doesn't match allowed CIDRs
                }

                const geoMatch = await this.evaluateGeoMatch(user, d.raw ?? { id: d.id, tags: [] });
                if (!geoMatch.eligible) {
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: false,
                        score: 0,
                        effectivePriority: 0,
                        reasons: [
                            {
                                kind: 'geoDistance',
                                distanceKm: geoMatch.distanceKm,
                                maxDistanceKm: geoMatch.effectiveMaxDistanceKm,
                                withinRange: false,
                            },
                        ],
                    });
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
                    const geoBoost = this.calculateGeoBoost(geoMatch);
                    userAssignments.push({ id: d.id, priority: combinedPriority + geoBoost });
                    selected.push({ id: d.id, tags: d.tags });
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: true,
                        score,
                        effectivePriority: combinedPriority + geoBoost,
                        reasons: this.traceScoreReasons(user, d, score, geoMatch, geoBoost),
                    });
                } else {
                    collector?.record(d.id, d.tags, {
                        userId: user.id,
                        eligible: false,
                        score: 0,
                        effectivePriority: Number(d.basePriority) || 0,
                        reasons: this.traceScoreReasons(user, d, score, geoMatch, 0),
                    });
                }
            }
        }

        return { userAssignments, selected, workflowTargetedCount };
    }

    /**
     * Atomically claims a set of tag-scored candidate assignments for one
     * user and returns which ones it actually won. The candidate read that
     * produces `selected` (zDiffStore/zRangeWithScores in
     * computeCandidatesForUser) is a snapshot taken before this point, and
     * candidate computation runs concurrently across users -
     * matchUsersAssignments() Promise.all's the bulk path, and a per-user
     * matchUsersAssignments(userId) call can race a bulk pass too. Without a
     * single atomic gate, two concurrent callers can both still see the same
     * assignment as available and both hand it to their user. HDEL on
     * assignmentsRefKey is atomic and idempotent (returns 1 only for
     * whichever caller actually deletes the field), so it's used here as
     * that gate: only assignments this call actually wins are kept - anything
     * already claimed by a concurrent caller since the snapshot read is
     * dropped instead of being double-assigned.
     */
    private async claimSelected(user: User, selected: Array<{ id: string; tags: string }>): Promise<Set<string>> {
        const claimedIds = new Set<string>();
        if (selected.length === 0) return claimedIds;

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

        return claimedIds;
    }

    private async getUserRelatedAssignments(user: User, collector?: TraceCollector) {
        const { userAssignments, selected, workflowTargetedCount } = await this.computeCandidatesForUser(
            user,
            true,
            collector,
        );
        const claimedIds = await this.claimSelected(user, selected);
        const workflowTargeted = userAssignments.slice(0, workflowTargetedCount);
        const tagScored = userAssignments.slice(workflowTargetedCount).filter((ua) => claimedIds.has(ua.id));
        return { assignments: [...workflowTargeted, ...tagScored], claimedIds, workflowTargeted };
    }

    /**
     * Opt-in alternative to the default parallel bulk path (see
     * MatcherOptions.enableFairTiebreaker): evaluates every user's eligible
     * candidates first (read-only, nobody claims yet), flattens them into one
     * global list sorted by score descending, then claims greedily in that
     * order. This guarantees the best-fit eligible candidate wins each
     * contested assignment, rather than whichever user's independent claim
     * happened to reach Redis first.
     *
     * Known limitation: when combined with enableLearning, computeCandidatesForUser
     * still records a bandit decision for every scored candidate at evaluation
     * time, including ones that lose the global tiebreak here - the learning
     * layer's per-user candidate ordering isn't itself part of the fairness
     * comparison in this mode. Fine for the common case (fairness without
     * learning), but a consumer combining both should be aware.
     */
    private async matchAllUsersFair(): Promise<void> {
        let users: any[] = [];
        let cursor = '0';
        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.usersKey, cursor, { COUNT: 500 });
            users.push(...entries.map((t: { field: string; value: string }) => JSON.parse(t.value)));
            cursor = nextCursor;
        } while (cursor !== '0');

        // Paused users sit out the pass entirely but stay in `users` so traces
        // can show them struck out.
        const activeUsers = await this.filterPausedUsers(users);

        const collector = this.tracingActive ? new TraceCollector() : undefined;
        const traceWinners = new Map<string, string>();
        const workflowGrants: Array<{ assignmentId: string; userId: string; priority: number }> = [];

        // Rolling-window grant cap: an explicit finite fairnessMaxPerWindow
        // always applies; the 'balanced' / 'spread-work' presets additionally
        // default a team-relative guardrail when no explicit cap is given
        // (fairnessMaxPerWindow: Infinity opts out of that too).
        const explicitCap = this.fairnessMaxPerWindow;
        const usesAutoCap =
            explicitCap === undefined && (this.fairnessMode === 'balanced' || this.fairnessMode === 'spread-work');
        const windowActive = usesAutoCap || (explicitCap !== undefined && Number.isFinite(explicitCap));
        const windowStart = Date.now() - this.fairnessWindowMs;

        // Phase 1: per-user backlog + window usage, one pipelined batch - the
        // rolling cap costs one extra command per user here, not a round trip.
        const usage = await Promise.all(
            activeUsers.map(async (user) => {
                const [backlog, grantsInWindow] = await Promise.all([
                    this.redisClient.sCard(this.keys.userAssignments(user.id)),
                    windowActive
                        ? this.redisClient.zCount(this.keys.userWindowGrants(user.id), windowStart, '+inf')
                        : Promise.resolve(0),
                ]);
                return { user, backlog, grantsInWindow };
            }),
        );

        // The preset guardrail is scale-free on purpose: no fixed number fits
        // every deployment, but "nobody receives at more than double the
        // team's average rate" is safe anywhere. The maxUserBacklogSize floor
        // keeps a cold-started (empty-window) team from throttling itself.
        let windowCap = Infinity;
        if (explicitCap !== undefined && Number.isFinite(explicitCap)) {
            windowCap = explicitCap;
        } else if (usesAutoCap) {
            const totalGrants = usage.reduce((sum, u) => sum + u.grantsInWindow, 0);
            windowCap = Math.max(this.maxUserBacklogSize, Math.ceil((2 * totalGrants) / Math.max(1, usage.length)));
        }

        // Phase 2: read-only candidate discovery for users with headroom.
        const perUser = await Promise.all(
            usage.map(async ({ user, backlog, grantsInWindow }) => {
                const windowRemaining = windowActive ? Math.max(0, windowCap - grantsInWindow) : Infinity;

                if (backlog >= this.backlogLimitFor(user)) {
                    return {
                        user,
                        backlog,
                        windowRemaining,
                        candidates: { userAssignments: [], selected: [], workflowTargetedCount: 0 },
                    };
                }
                if (windowRemaining <= 0) {
                    // No tag-scored grant can land this pass, so skip candidate
                    // scoring - but workflow-targeted assignments are direct
                    // handoffs that bypass the window cap and must still flow.
                    const workflowAssignments = this.enableWorkflows
                        ? await this.getWorkflowTargetedAssignments(user.id)
                        : [];
                    return {
                        user,
                        backlog,
                        windowRemaining,
                        candidates: {
                            userAssignments: workflowAssignments,
                            selected: [],
                            workflowTargetedCount: workflowAssignments.length,
                        },
                    };
                }
                // capToBacklog=false: this user's full candidate set is needed for
                // global arbitration below, not just as many as their own cap allows.
                const candidates = await this.computeCandidatesForUser(user, false, collector);
                return { user, backlog, windowRemaining, candidates };
            }),
        );

        // Workflow-targeted assignments are deterministically targeted at one
        // user each - not contested across users - so claim them immediately,
        // exactly like the non-fair path does.
        await Promise.all(
            perUser.map(async ({ user, candidates }) => {
                const workflowOnly = candidates.userAssignments.slice(0, candidates.workflowTargetedCount);
                if (workflowOnly.length === 0) return;
                if (collector) {
                    // Membership must be read before the sAdd below
                    workflowGrants.push(...(await this.filterNewWorkflowGrants(user, workflowOnly)));
                }
                await this.redisClient.sAdd(
                    this.keys.userAssignments(user.id),
                    workflowOnly.map((a) => `assignment:${a.id}`),
                );
            }),
        );

        // Flatten every user's tag-scored candidates into one global list of
        // {user, assignment, score} pairs for cross-user arbitration.
        const globalPairs: Array<{ user: any; userId: string; id: string; tags: string; priority: number }> = [];
        for (const { user, candidates } of perUser) {
            const priorityById = new Map(candidates.userAssignments.map((ua) => [ua.id, ua.priority]));
            for (const s of candidates.selected) {
                globalPairs.push({
                    user,
                    userId: user.id,
                    id: s.id,
                    tags: s.tags,
                    priority: priorityById.get(s.id) ?? 0,
                });
            }
        }

        const backlogUsed = new Map<string, number>(
            perUser.map(({ user, backlog, candidates }) => [user.id, backlog + candidates.workflowTargetedCount]),
        );

        // Fold the rolling-window cap into a per-user award ceiling: a user
        // may take at most min(backlog headroom, window headroom) more
        // tag-scored assignments this pass. Workflow-targeted grants above
        // are exempt from the window but still occupy backlog.
        // Always built (not only when the window is active) so per-user
        // backlog caps (user.maxBacklogSize) reach arbitration too;
        // windowRemaining is Infinity when the window is inactive.
        const maxByUser = new Map(
            perUser.map(({ user, backlog, windowRemaining, candidates }) => [
                user.id,
                backlog +
                    candidates.workflowTargetedCount +
                    Math.max(
                        0,
                        Math.min(this.backlogLimitFor(user) - backlog - candidates.workflowTargetedCount, windowRemaining),
                    ),
            ]),
        );

        // Arbitrate winners in memory (see arbitrateFair for the ordering:
        // best score wins, optionally load-penalized / tie-banded), then claim
        // in one batched claimSelected() call per user (all users in parallel)
        // rather than one claim round trip per pair - arbitration already
        // decides who wins every contested assignment within this process, so
        // per-pair claims would only re-discover that same answer at O(pairs)
        // sequential Redis round trips. The atomic HDEL gate inside
        // claimSelected() still protects against claims from OTHER processes:
        // a failed claim means the assignment is gone entirely (a concurrent
        // process won it), so the tentative winner's backlog slot is released
        // and the remaining pairs are re-arbitrated in another round. In the
        // common single-process case the first round claims everything and no
        // further rounds run.
        // A fairness preset ('balanced' / 'spread-work') derives its load
        // penalty from this pass's candidate scores; explicit expert knobs
        // always win over the preset.
        const knobs = resolveFairnessKnobs(
            this.fairnessMode,
            globalPairs.map((p) => p.priority),
            { loadPenalty: this.fairnessLoadPenalty, tieBand: this.fairnessTieBand },
        );

        const settled = new Set<string>();
        let remaining = globalPairs;
        while (remaining.length > 0) {
            const { winners, deferred } = arbitrateFair(remaining, backlogUsed, settled, {
                maxUserBacklogSize: this.maxUserBacklogSize,
                maxByUser,
                loadPenalty: knobs.loadPenalty,
                tieBand: knobs.tieBand,
            });

            const tentative = new Map<string, { user: any; pairs: Array<{ id: string; tags: string }> }>();
            for (const w of winners) {
                const bucket = tentative.get(w.userId) ?? { user: w.user, pairs: [] };
                bucket.pairs.push({ id: w.id, tags: w.tags });
                tentative.set(w.userId, bucket);
            }

            if (tentative.size === 0) break;

            let anyLost = false;
            await Promise.all(
                Array.from(tentative.values()).map(async ({ user, pairs }) => {
                    const claimedIds = await this.claimSelected(user, pairs);
                    const won = pairs.filter((p) => claimedIds.has(p.id));
                    if (collector) {
                        for (const p of won) traceWinners.set(p.id, user.id);
                    }
                    if (won.length < pairs.length) {
                        anyLost = true;
                        backlogUsed.set(user.id, (backlogUsed.get(user.id) ?? 0) - (pairs.length - won.length));
                    }
                    // Won or lost, the assignment is no longer available to anyone.
                    for (const p of pairs) settled.add(p.id);
                    if (won.length > 0) {
                        const grantMulti = this.redisClient.multi();
                        grantMulti.sAdd(
                            this.keys.userAssignments(user.id),
                            won.map((p) => `assignment:${p.id}`),
                        );
                        if (windowActive) {
                            // Rolling-window bookkeeping: trim entries that
                            // have aged out, record these grants, and let the
                            // whole set expire if the user goes idle.
                            const grantsKey = this.keys.userWindowGrants(user.id);
                            const now = Date.now();
                            grantMulti.zRemRangeByScore(grantsKey, '-inf', now - this.fairnessWindowMs);
                            grantMulti.zAdd(
                                grantsKey,
                                won.map((p) => ({ score: now, value: `${now}:${p.id}` })),
                            );
                            grantMulti.pExpire(grantsKey, this.fairnessWindowMs);
                        }
                        await grantMulti.exec();
                    }
                }),
            );

            if (!anyLost) break;
            remaining = deferred.filter((pair) => !settled.has(pair.id));
        }

        if (collector) {
            await this.recordPassTraces(collector, traceWinners, workflowGrants, this.getFairness(), users);
        }
    }

    async matchUsersAssignments(userId?: string): Promise<void> {
        await this.readyPromise;

        // If a specific userId is provided, process only that user for precise per-user matching.
        if (userId) {
            const userJson = await this.redisClient.hGet(this.usersKey, userId);
            if (!userJson) return;
            if (await this.redisClient.sIsMember(this.keys.pausedUsers(), userId)) return;
            const user = JSON.parse(userJson);
            const userMatchesCount = await this.redisClient.sCard(this.keys.userAssignments(user.id));
            if (userMatchesCount >= this.backlogLimitFor(user)) return;

            const collector = this.tracingActive ? new TraceCollector() : undefined;
            const { assignments, claimedIds, workflowTargeted } = await this.getUserRelatedAssignments(user, collector);
            // Membership must be read before the sAdd below
            const newWorkflowGrants = collector ? await this.filterNewWorkflowGrants(user, workflowTargeted) : [];
            const relevantAssignmentKeys = assignments
                .sort((a, b) => b.priority - a.priority)
                .map((a) => `assignment:${a.id}`);

            if (relevantAssignmentKeys.length > 0) {
                await this.redisClient.sAdd(this.keys.userAssignments(user.id), relevantAssignmentKeys);
            }
            if (collector) {
                const winners = new Map<string, string>();
                for (const id of claimedIds) winners.set(id, user.id);
                await this.recordPassTraces(collector, winners, newWorkflowGrants, 'direct', [user]);
            }
            return;
        }

        if (this.enableFairTiebreaker) {
            return this.matchAllUsersFair();
        }

        // Otherwise, process all users in parallel as before.
        let users: any[] = [];
        let cursor = '0';

        // Fetch all users in a single loop
        do {
            const { cursor: nextCursor, entries } = await this.redisClient.hScan(this.usersKey, cursor, { COUNT: 500 });
            users.push(...entries.map((t: { field: string; value: string }) => JSON.parse(t.value)));
            cursor = nextCursor;
        } while (cursor !== '0');

        // Paused users sit out the pass entirely but stay in `users` so traces
        // can show them struck out.
        const activeUsers = await this.filterPausedUsers(users);

        // Process users in parallel
        const collector = this.tracingActive ? new TraceCollector() : undefined;
        const winners = new Map<string, string>();
        const workflowGrants: Array<{ assignmentId: string; userId: string; priority: number }> = [];

        await Promise.all(
            activeUsers.map(async (user) => {
                const userMatchesCount = await this.redisClient.sCard(this.keys.userAssignments(user.id));
                if (userMatchesCount >= this.backlogLimitFor(user)) {
                    return;
                }

                const { assignments, claimedIds, workflowTargeted } = await this.getUserRelatedAssignments(user, collector);
                if (collector) {
                    for (const id of claimedIds) winners.set(id, user.id);
                    // Membership must be read before the sAdd below
                    workflowGrants.push(...(await this.filterNewWorkflowGrants(user, workflowTargeted)));
                }
                const relevantAssignmentKeys = assignments
                    .sort((a, b) => b.priority - a.priority)
                    .map((a) => `assignment:${a.id}`);

                if (relevantAssignmentKeys.length > 0) {
                    await this.redisClient.sAdd(this.keys.userAssignments(user.id), relevantAssignmentKeys);
                }
            }),
        );

        if (collector) {
            await this.recordPassTraces(collector, winners, workflowGrants, 'first-come', users);
        }
    }

    async getCurrentAssignmentsForUser(userId: string): Promise<string[]> {
        await this.readyPromise;

        const userAssignments = await this.redisClient.sMembers(this.keys.userAssignments(userId));

        return userAssignments.map((el: string) => el.split(':')[1]);
    }

    /**
     * Operator override: hand an assignment directly to a user, bypassing
     * tag/weight selection. Works on queued assignments and on pending ones
     * held by another user (the previous owner's backlog slot is released).
     * Idempotent when the user already owns the assignment.
     *
     * Hard rules still apply unless `force`: the user must not be paused,
     * their backlog must have headroom, they must not be vetoed on the
     * assignment, and they must not have previously rejected it. `force`
     * bypasses those checks (the user must always exist). The learning layer
     * is never fed by manual assignments.
     *
     * When tracing is active the override is recorded as a decision trace
     * with mode `'manual'`, so supervisor actions show up in the same audit
     * trail as organic matches.
     */
    async assignToUser(
        assignmentId: string,
        userId: string,
        options?: { force?: boolean },
    ): Promise<{ previousOwnerId: string | null }> {
        await this.readyPromise;
        const force = options?.force === true;

        const userJson = await this.redisClient.hGet(this.usersKey, userId);
        if (!userJson) throw new Error(`User not found: ${userId}`);
        const user: User = JSON.parse(userJson);

        const [queuedJson, previousOwnerId] = await Promise.all([
            this.redisClient.hGet(this.assignmentsRefKey, assignmentId),
            this.redisClient.hGet(this.assignmentOwnerKey, assignmentId),
        ]);
        if (previousOwnerId === userId) return { previousOwnerId: userId };
        if (!queuedJson && !previousOwnerId) {
            throw new Error(`Assignment not found in queued or pending state: ${assignmentId}`);
        }

        if (!force) {
            const [isPaused, backlog, isVetoed, hasRejected] = await Promise.all([
                this.redisClient.sIsMember(this.keys.pausedUsers(), userId),
                this.redisClient.sCard(this.keys.userAssignments(userId)),
                this.redisClient.sIsMember(this.keys.assignmentVetoed(assignmentId), userId),
                this.redisClient.sIsMember(this.keys.userRejected(userId), assignmentId),
            ]);
            if (isPaused) throw new Error(`User is paused: ${userId}`);
            if (backlog >= this.backlogLimitFor(user)) {
                throw new Error(`User backlog is full (${backlog}/${this.backlogLimitFor(user)}): ${userId}`);
            }
            if (isVetoed) throw new Error(`User is vetoed from this assignment: ${userId}`);
            if (hasRejected) throw new Error(`User previously rejected this assignment: ${userId}`);
        }

        if (queuedJson) {
            // Queued -> pending through the same atomic claim gate as organic
            // matching; losing it means a concurrent pass just took the
            // assignment.
            const tagsCsv = (await this.redisClient.hGet(this.keys.assignmentTags(assignmentId), 'tags')) ?? '';
            const claimed = await this.claimSelected(user, [{ id: assignmentId, tags: tagsCsv }]);
            if (!claimed.has(assignmentId)) {
                throw new Error(`Assignment is no longer available: ${assignmentId}`);
            }
            await this.redisClient.sAdd(this.keys.userAssignments(userId), `assignment:${assignmentId}`);
        } else {
            // Pending under another user: transfer ownership and restart the
            // expiry clock for the new owner.
            const transfer = this.redisClient
                .multi()
                .sRem(this.keys.userAssignments(previousOwnerId!), `assignment:${assignmentId}`)
                .sAdd(this.keys.userAssignments(userId), `assignment:${assignmentId}`)
                .hSet(this.assignmentOwnerKey, assignmentId, userId)
                .zAdd(this.pendingAssignmentsExpiryKey, {
                    score: Date.now() + this.matchExpirationMs,
                    value: assignmentId,
                });
            await transfer.exec();
        }

        await this.touchUser(userId);
        await this.recordManualAssignTrace(assignmentId, userId, force, previousOwnerId ?? null);
        return { previousOwnerId: previousOwnerId ?? null };
    }

    /** Audit record for an assignToUser() override; failures never break the assignment. */
    private async recordManualAssignTrace(
        assignmentId: string,
        userId: string,
        force: boolean,
        previousOwnerId: string | null,
    ): Promise<void> {
        if (!this.tracingActive) return;
        try {
            await this.decisionTraces.record(
                [
                    {
                        id: randomUUID(),
                        assignmentId,
                        chosenUserId: userId,
                        matchedAt: Date.now(),
                        mode: 'manual',
                        candidates: [
                            {
                                userId,
                                eligible: true,
                                chosen: true,
                                score: 0,
                                effectivePriority: 0,
                                reasons: [{ kind: 'manualAssignment', force, previousOwnerId }],
                            },
                        ],
                    },
                ],
                this.enableDecisionTraces,
            );
        } catch (err) {
            console.error('Failed to record manual assignment trace:', err);
        }
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
        // The wait clock stops when a user takes the work
        multi.zRem(this.keys.assignmentsQueuedAt(), assignmentId);

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
     * Delete a workflow definition by ID. Running instances are unaffected
     * (they carry their own snapshot). Returns `false` if it did not exist.
     */
    async deleteWorkflowDefinition(id: string): Promise<boolean> {
        await this.readyPromise;
        return this.workflow.deleteWorkflowDefinition(id);
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

        // Paused users are deliberately absent, not idle - never auto-remove them.
        const paused = new Set<string>(await this.redisClient.sMembers(this.keys.pausedUsers()));

        const removed: string[] = [];
        for (const userId of idleCandidates) {
            if (paused.has(userId)) continue;
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
    private async releaseUserPendingAssignments(userId: string): Promise<string[]> {
        const members = await this.redisClient.sMembers(this.keys.userAssignments(userId));
        const now = Date.now();
        const released: string[] = [];

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
            released.push(id);
        }
        return released;
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
