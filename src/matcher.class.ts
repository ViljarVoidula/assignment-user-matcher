import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import { join } from 'path';
import { checkCidrMatch } from './utils/cidr';
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
import { ReliabilityManager } from './managers/ReliabilityManager';
import { TelemetryManager } from './managers/TelemetryManager';
import { WorkflowManager, type WorkflowHost } from './managers/WorkflowManager';
import type {
    RedisClientType,
    User,
    Assignment,
    Stats,
    MatcherOptions,
    options,
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowEvent,
    AssignmentResult,
    DeadLetterEntry,
    AuditEntry,
    WorkflowInstanceWithSnapshot,
} from './types/matcher';

// Re-export types for backwards compatibility
export type { RedisClientType, User, Assignment, Stats, MatcherOptions, options } from './types/matcher';
// Export workflow types
export type {
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowStep,
    WorkflowEvent,
    WorkflowEventType,
    AssignmentResult,
    ParallelBranchState,
    DeadLetterEntry,
    AuditEntry,
    CircuitBreakerState,
    WorkflowInstanceWithSnapshot,
} from './types/matcher';

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
        this.pendingAssignmentsKey = this.keys.pendingAssignmentsData();
        this.pendingAssignmentsExpiryKey = this.keys.pendingAssignmentsExpiry();
        this.assignmentOwnerKey = this.keys.assignmentOwner();
        this.allTagsKey = this.keys.allTags();
        this.acceptedAssignmentsKey = this.keys.acceptedAssignments();
        this.completedAssignmentsKey = this.keys.completedAssignments();
        this.calculatePriority = options?.prioritizationFunction ?? this.calculatePriority;
        this.matchScore = options?.matchingFunction ?? this.defaultMatchScore.bind(this);

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
        });
        this.telemetry = new TelemetryManager(options?.enableOpenTelemetry ?? false);
        
        this.workflow = new WorkflowManager(
            this.redisClient,
            this.keys,
            this.reliability,
            this.telemetry,
            this,
            {
                enableWorkflows: this.enableWorkflows,
                streamConsumerGroup: this.streamConsumerGroup,
                streamConsumerName: this.streamConsumerName,
                reclaimIntervalMs: options?.workflowOrphanReclaimMs ?? 60000,
            }
        );

        this.initRedis();
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

        // Initialize workflow stream consumer group if workflows are enabled
        if (this.enableWorkflows) {
            await this.workflow.init();
            // Load Lua script for atomic transitions
            await this.loadLuaScripts();
        }

        return this;
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
        return this.workflow.reclaimOrphanedMessages();
    }

    /**
     * Get events from the Dead Letter Queue.
     */
    async getDeadLetterEvents(
        limit: number = 100,
        offset: number = 0,
    ): Promise<DeadLetterEntry[]> {
        return this.reliability.getDeadLetterEvents(limit, offset);
    }

    /**
     * Get Dead Letter Queue size.
     */
    async getDeadLetterQueueSize(): Promise<number> {
        return this.reliability.getDeadLetterQueueSize();
    }

    /**
     * Replay a Dead Letter Queue event.
     */
    async replayDeadLetterEvent(eventJson: string): Promise<boolean> {
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
        return this.reliability.clearDeadLetterQueue();
    }

    /**
     * Get audit events from the audit stream.
     */
    async getAuditEvents(count: number = 100): Promise<AuditEntry[]> {
        return this.reliability.getAuditEvents(count);
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
        await this.redisClient.hSet(
            this.usersKey,
            user.id,
            JSON.stringify({
                ...user,
                tags: [...user.tags, ...(this.enableDefaultMatching ? ['default'] : [])],
            }),
        );

        return user;
    }

    async addAssignment(assignment: Assignment) {
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

        if (latitude && longitude) {
            multi.geoAdd(assignmentGeoKey, {
                longitude,
                latitude,
                member: id,
            });
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
        const assignmentPriorityKey = this.keys.assignmentPriority(id);
        const assignmentTagsKey = this.keys.assignmentTags(id);
        const assignmentGeoKey = this.keys.assignmentsGeo();

        // Fetch tags and owner in case it's pending
        const [tagsCsv, owner] = await Promise.all([
            this.redisClient.hGet(assignmentTagsKey, 'tags'),
            this.redisClient.hGet(this.assignmentOwnerKey, id)
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
        const multi = this.redisClient
            .multi()
            .del(this.keys.userAssignments(userId))
            .del(this.keys.userRejected(userId))
            .hDel(this.usersKey, userId);
        await multi.exec();

        return userId;
    }

    /**
     * Get all assignments (queued, pending, and accepted).
     * For large datasets, prefer using getAssignmentsPaginated() instead.
     */
    async getAllAssignments(): Promise<Assignment[]> {
        return getAllAssignmentsFromStores(this.redisClient, this.assignmentStoreKeys);
    }

    /**
     * Get assignments with pagination support for efficient querying of large datasets.
     * Uses cursor-based pagination across statuses.
     * 
     * @param options.cursor - Cursor for pagination (null/undefined for first page)
     * @param options.limit - Maximum number of assignments to return per page (default: 100)
     * @param options.status - Filter by status: 'queued' | 'pending' | 'accepted' | 'all' (default: 'all')
     * @param options.includeTotal - Whether to include total count (slower for large datasets)
     */
    async getAssignmentsPaginated(options?: PaginationOptions): Promise<PaginationResult> {
        return getAssignmentsPaginatedFromStores(this.redisClient, this.assignmentStoreKeys, options);
    }

    /**
     * Get assignment counts by status without fetching the data.
     * Efficient for dashboards and monitoring.
     */
    async getAssignmentCounts(): Promise<AssignmentCounts> {
        return getAssignmentCountsFromStores(this.redisClient, this.assignmentStoreKeys);
    }

    /**
     * Get a single assignment by ID from any status.
     */
    async getAssignment(id: string): Promise<(Assignment & { _status?: string }) | null> {
        return getAssignmentById(this.redisClient, this.assignmentStoreKeys, id);
    }

    /**
     * Get multiple assignments by IDs efficiently.
     */
    async getAssignmentsByIds(ids: string[]): Promise<Assignment[]> {
        return getAssignmentsByIdsBatch(this.redisClient, this.assignmentStoreKeys, ids);
    }

    /** Default match score implementation using extracted scoring module */
    private defaultMatchScore(
        user: User,
        assignmentTags: string,
        assignmentPriority: string | number,
        _assignmentId?: string,
    ): Promise<[number, number]> {
        return Promise.resolve(calculateMatchScore(user, assignmentTags, assignmentPriority, this.enableDefaultMatching));
    }

    private matchScore: (
        user: User,
        assignmentTags: string,
        assignmentPriority: string | number,
        assignmentId?: string,
    ) => Promise<[number, number]>;

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
        const [existsRef, tagsCsv] = await this.redisClient
            .multi()
            .hExists(this.assignmentsRefKey, id)
            .hGet(assignmentTagsKey, 'tags')
            .exec() as unknown as [boolean, string | null];
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

        // Priority 2: Build candidate assignments using per-tag zset union with user weights for scalability.
        const positiveWeights: Array<{ tag: string; weight: number }> = [];
        const zeroWeightTags: string[] = [];

        if (user.routingWeights && Object.keys(user.routingWeights).length > 0) {
            for (const [tag, w] of Object.entries(user.routingWeights)) {
                if (typeof w === 'number' && w > 0) positiveWeights.push({ tag, weight: w });
                else if (w === 0) zeroWeightTags.push(tag);
            }
        } else {
            // Fallback: use unweighted tags (weight 1)
            for (const tag of user.tags || []) {
                positiveWeights.push({ tag, weight: 1 });
            }
        }

        // Ensure default tag is included if enabled and not explicitly weighted to zero
        if (this.enableDefaultMatching) {
            const defaultInPos = positiveWeights.find((t) => t.tag === 'default');
            const defaultZero = zeroWeightTags.includes('default');
            if (!defaultInPos && !defaultZero) positiveWeights.push({ tag: 'default', weight: 1 });
        }

        if (positiveWeights.length === 0) return userAssignments;

        // Expand wildcards
        const expandedPositive = await this.expandTagWildcards(positiveWeights);
        const expandedZero = await this.expandTagWildcards(zeroWeightTags.map((t) => ({ tag: t, weight: 0 })));
        const finalZeroTags = expandedZero.map((t) => t.tag);

        if (expandedPositive.length === 0) return userAssignments;

        const tempKey = this.keys.tempUserCandidates(user.id);
        const tempZeroKey = this.keys.tempUserExclude(user.id);
        const tempFinalKey = this.keys.tempUserFinal(user.id);
        const rejectedKey = this.keys.userRejected(user.id);

        const unionKeysWithWeights = expandedPositive.map((pw) => ({
            key: this.keys.tagAssignments(pw.tag),
            weight: pw.weight
        }));

        const multi = this.redisClient.multi();
        // Weighted union of positive tag assignment zsets
        if (unionKeysWithWeights.length > 0) {
            multi.zUnionStore(tempKey, unionKeysWithWeights as [typeof unionKeysWithWeights[0], ...typeof unionKeysWithWeights]);
        }
        
        const excludeKeys: string[] = [];
        // Optional exclude set for zero-weight tags
        if (finalZeroTags.length > 0) {
            const zeroKeys = finalZeroTags.map((t) => this.keys.tagAssignments(t));
            multi.zUnionStore(tempZeroKey, zeroKeys as [string, ...string[]]);
            multi.expire(tempZeroKey, 5);
            excludeKeys.push(tempZeroKey);
        }
        
        // Always exclude rejected assignments
        excludeKeys.push(rejectedKey);

        // Final = candidates - exclude (zero weights + rejected)
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
        const flat = await batched.exec() as unknown as (string | null)[];
        const details = [] as Array<{ id: string; basePriority: number; tags: string; allowedCidrs?: string[] }>;
        for (let i = 0; i < top.length; i++) {
            const assignmentId = (top[i] as any).value;
            const priority = Number(flat[i * 3]) || 0;
            const tags = String(flat[i * 3 + 1] || '');
            const assignmentJson = flat[i * 3 + 2];
            let allowedCidrs: string[] | undefined;
            if (assignmentJson) {
                try {
                    const parsed = JSON.parse(assignmentJson);
                    allowedCidrs = parsed.allowedCidrs;
                } catch {
                    // Ignore JSON parse errors
                }
            }
            details.push({ id: assignmentId, basePriority: priority, tags, allowedCidrs });
        }
        // Prefer higher base priority first to satisfy tests and practical expectations
        details.sort((a, b) => b.basePriority - a.basePriority);

        const selected: Array<{ id: string; tags: string }> = [];
        for (const d of details) {
            if (userAssignments.length >= this.maxUserBacklogSize) break;
            
            // Check CIDR restrictions: if assignment has allowedCidrs, user must have matching IP
            if (!checkCidrMatch(user.ip, d.allowedCidrs)) {
                continue; // Skip this assignment - user IP doesn't match allowed CIDRs
            }
            
            // Use custom matchScore (supports weights) for a final check and tie-break
            const [score, combinedPriority] = await this.matchScore(user, d.tags, d.basePriority, d.id);
            if (score && combinedPriority) {
                userAssignments.push({ id: d.id, priority: combinedPriority });
                selected.push({ id: d.id, tags: d.tags });
            }
        }

        // Batch-remove all selected assignments from indexes and references to reduce round trips
        if (selected.length > 0) {
            // Fetch JSONs first to store in pending
            const jsonPromises = selected.map((s) => this.redisClient.hGet(this.assignmentsRefKey, s.id));
            const jsons = await Promise.all(jsonPromises);
            const now = Date.now();

            const rm = this.redisClient.multi();
            for (let i = 0; i < selected.length; i++) {
                const s = selected[i];
                const json = jsons[i];
                
                // Remove from reference and per-assignment hashes
                rm.hDel(this.assignmentsRefKey, s.id);
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

        return userAssignments;
    }
    async matchUsersAssignments(userId?: string): Promise<void> {
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
        const userAssignments = await this.redisClient.sMembers(this.keys.userAssignments(userId));

        return userAssignments.map((el: string) => el.split(':')[1]);
    }

    async acceptAssignment(userId: string, assignmentId: string): Promise<boolean> {
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

        return true;
    }

    async rejectAssignment(userId: string, assignmentId: string): Promise<boolean> {
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
    async completeAssignment(
        userId: string,
        assignmentId: string,
        result?: AssignmentResult,
    ): Promise<boolean> {
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
    async failAssignment(
        userId: string,
        assignmentId: string,
        reason?: string,
    ): Promise<boolean> {
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
    async registerWorkflow(definition: WorkflowDefinition): Promise<WorkflowDefinition> {
        return this.workflow.registerWorkflow(definition);
    }

    /**
     * Get a workflow definition by ID.
     */
    async getWorkflowDefinition(id: string): Promise<WorkflowDefinition | null> {
        return this.workflow.getWorkflowDefinition(id);
    }

    /**
     * List all registered workflow definitions.
     */
    async listWorkflowDefinitions(): Promise<Array<{ id: string; name: string }>> {
        return this.workflow.listWorkflowDefinitions();
    }

    /**
     * Start a new workflow instance for a user.
     */
    async startWorkflow(
        workflowDefinitionId: string,
        userId: string,
        initialContext?: Record<string, any>,
    ): Promise<WorkflowInstance> {
        return this.workflow.startWorkflow(workflowDefinitionId, userId, initialContext);
    }

    /**
     * Get a workflow instance by ID.
     */
    async getWorkflowInstance(instanceId: string): Promise<WorkflowInstance | null> {
        return this.workflow.getWorkflowInstance(instanceId);
    }

    /**
     * Get a workflow instance with its snapshot definition.
     */
    async getWorkflowInstanceWithSnapshot(instanceId: string): Promise<WorkflowInstanceWithSnapshot | null> {
        return this.workflow.getWorkflowInstanceWithSnapshot(instanceId);
    }

    /**
     * Get all active workflow instances for a user.
     */
    async getActiveWorkflowsForUser(userId: string): Promise<WorkflowInstance[]> {
        return this.workflow.getActiveWorkflowsForUser(userId);
    }

    /**
     * Cancel a workflow instance.
     */
    async cancelWorkflow(instanceId: string): Promise<boolean> {
        return this.workflow.cancelWorkflow(instanceId);
    }



    /**
     * Check and process expired workflow steps.
     * Should be called periodically.
     */
    async processExpiredWorkflowSteps(): Promise<number> {
        return this.workflow.processExpiredWorkflowSteps();
    }


    /**
     * Publish a workflow event to the Redis Stream.
     */
    async publishWorkflowEvent(event: WorkflowEvent): Promise<string> {
        return this.workflow.publishWorkflowEvent(event);
    }

    /**
     * Start the workflow orchestrator.
     * This listens to the event stream and processes workflow transitions.
     */
    async startOrchestrator(): Promise<void> {
        return this.workflow.startOrchestrator();
    }

    /**
     * Stop the workflow orchestrator.
     */
    async stopOrchestrator(): Promise<void> {
        return this.workflow.stopOrchestrator();
    }




    async processExpiredMatches(): Promise<number> {
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

    /**
     * Get assignments specifically targeted at a user through active workflows.
     * These take priority over general pool assignments for deterministic matching.
     */
    private async getWorkflowTargetedAssignments(
        userId: string,
    ): Promise<Array<{ id: string; priority: number }>> {
        const targeted: Array<{ id: string; priority: number }> = [];

        // Scan queued assignments for those with _targetUserId matching this user
        const queuedAssignments = await this.redisClient.hGetAll(this.assignmentsRefKey);
        
        for (const [assignmentId, json] of Object.entries(queuedAssignments)) {
            try {
                const assignment = JSON.parse(json);
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
