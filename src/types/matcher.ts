import { createClient } from 'redis';

export type RedisClientType = ReturnType<typeof createClient>;

export interface User {
    id: string;
    tags: string[];
    // Optional routing weights per tag; if present, matching will use these weights.
    // Example: { english: 100, dutch: 30, brazil: 100, german: 0 }
    routingWeights?: Record<string, number>;
    // Optional IP address for network-based matching (IPv4 or IPv6)
    // Example: '192.168.1.100' or '2001:db8::1'
    ip?: string;
    // Optional geographic coordinates for distance-based matching
    latitude?: number;
    longitude?: number;
    // Optional user-side travel cap in kilometers
    maxTravelDistanceKm?: number;
    // Optional per-user backlog cap overriding the matcher-wide
    // maxUserBacklogSize (0 = receive nothing; invalid/negative values are
    // ignored). The fairness rolling-window auto-cap derivation stays
    // team-level and keeps using the global value.
    maxBacklogSize?: number;
    [key: string]: any;
}

export type Assignment = {
    id: string;
    tags: string[];
    priority?: number;
    // Optional CIDR ranges that restrict which users can receive this assignment
    // If specified, only users with IPs within these ranges will be matched
    // Supports both IPv4 (e.g., '192.168.1.0/24') and IPv6 (e.g., '2001:db8::/32')
    allowedCidrs?: string[];
    // Optional minimum skill thresholds for matchmaking
    // If specified, user's routingWeights must meet or exceed these values for each tag
    // Example: { english: 50, support: 30 } requires user to have at least 50 for english and 30 for support
    skillThresholds?: Record<string, number>;
    // Optional list of user IDs that must never receive this assignment,
    // regardless of any other matching criteria (hard veto)
    vetoedUsers?: string[];
    // Optional assignment-side geographic coordinates
    latitude?: number;
    longitude?: number;
    // Optional assignment-side service radius in kilometers
    maxDistanceKm?: number;
    // When true, users without valid coordinates are not eligible
    requireGeo?: boolean;
    [key: string]: any;
};

export type GeoMatchResult = {
    eligible: boolean;
    distanceKm?: number;
    effectiveMaxDistanceKm?: number;
};

export type GeoMatchingFunction = (args: {
    user: User;
    assignment: Assignment;
    defaultMaxDistanceKm?: number;
}) => Promise<GeoMatchResult>;

export type Stats = {
    users?: number;
    usersWithoutAssignment?: string[];
    remainingAssignments?: number;
};

/** One user's live load snapshot inside `QueueStats`. */
export type UserLoadInfo = {
    userId: string;
    /** Current pending-backlog depth */
    backlog: number;
    /** Effective cap (per-user `maxBacklogSize` or the matcher-wide default) */
    maxBacklogSize: number;
    paused: boolean;
};

/**
 * Live operational snapshot from `getQueueStats()`: state counts, the age of
 * the longest-waiting unaccepted assignment (queued or pending — the clock
 * starts at first enqueue and survives requeues, stopping only on accept or
 * removal), and per-user load.
 */
export type QueueStats = {
    queued: number;
    pending: number;
    /** Age in ms of the oldest not-yet-accepted assignment; null when none */
    oldestWaitingMs: number | null;
    perUser: UserLoadInfo[];
};

export type PendingAssignmentInfo = {
    assignment: Assignment;
    ownerId: string | null;
    pendingForMs: number | null;
    pendingSince: number | null;
    expiresAt: number | null;
};

/**
 * Bulk-matching fairness policy. See `MatcherOptions.fairness` for what each
 * value does.
 */
export type FairnessMode = 'first-come' | 'best-match' | 'balanced' | 'spread-work';

/**
 * Runtime-mutable subset of the bulk-matching fairness knobs. Pass any subset
 * to `AssignmentMatcher.setFairnessConfig()` to retune fairness without
 * reconstructing the matcher; each field carries the same semantics as the
 * identically-named `MatcherOptions` field and is picked up on the next
 * `matchUsersAssignments()` call. Absent fields are left unchanged; pass
 * `fairness` or `fairnessMaxPerWindow` as `undefined` explicitly to clear them
 * back to their auto-derived behavior.
 */
export interface FairnessConfig {
    fairness?: FairnessMode;
    enableFairTiebreaker?: boolean;
    fairnessLoadPenalty?: number;
    fairnessTieBand?: number;
    fairnessMaxPerWindow?: number;
    fairnessWindowMs?: number;
}

// ============================================================================
// Decision traces & explainability
// ============================================================================

/**
 * One factor that contributed to (or excluded) a candidate in a routing
 * decision. Discriminated on `kind` so consumers can render/aggregate without
 * string parsing. Positive factors carry their contribution; exclusions carry
 * the rule that fired and the values it compared.
 */
export type MatchTraceReason =
    /** A positive routing weight matched an assignment tag (pattern set when matched via wildcard) */
    | { kind: 'tagWeight'; tag: string; weight: number; pattern?: string }
    /** The internal 'default' tag matched with its implicit weight (enableDefaultMatching) */
    | { kind: 'defaultTag'; weight: number }
    /** Unweighted tag-intersection scoring (users without routingWeights) */
    | { kind: 'tagOverlap'; matchedTags: string[]; overlapRatio: number }
    /** A custom `matchingFunction` produced the score; no further breakdown is available */
    | { kind: 'customScore'; score: number }
    /** A zero-weight routing entry hard-vetoed an assignment tag */
    | { kind: 'veto'; tag: string; pattern: string }
    /** The user is in the assignment's `vetoedUsers` list */
    | { kind: 'assignmentVeto' }
    /** The user previously rejected this assignment */
    | { kind: 'rejectedPreviously' }
    /** The user has routingWeights but no positive entries, so nothing is eligible */
    | { kind: 'noPositiveWeights' }
    /** A `skillThresholds` requirement was not met */
    | { kind: 'skillThreshold'; skill: string; required: number; actual: number }
    /** The user's IP is outside the assignment's `allowedCidrs` */
    | { kind: 'cidrMismatch'; ip?: string }
    /** Geo distance evaluation (exclusion when `withinRange` is false) */
    | { kind: 'geoDistance'; distanceKm?: number; maxDistanceKm?: number; withinRange: boolean }
    /** Proximity boost added to the effective priority (`geoScoreWeight`) */
    | { kind: 'geoBoost'; boost: number }
    /** The user's backlog is at `maxUserBacklogSize` */
    | { kind: 'backlogFull'; backlog: number; limit: number }
    /** The user is paused (`pauseUser()`) and receives no new assignments */
    | { kind: 'paused' }
    /** Learning-layer re-ranking contribution (zero influence when `shadowMode`) */
    | { kind: 'learningBoost'; predicted: number; boost: number; shadowMode: boolean }
    /** Deterministic workflow-targeted handoff; tag/weight selection was bypassed */
    | { kind: 'workflowTargeted' }
    /** Operator override via assignToUser(); matching rules were bypassed */
    | { kind: 'manualAssignment'; force: boolean; previousOwnerId: string | null };

/** One user's evaluation within a routing decision or explanation. */
export interface MatchCandidateTrace {
    userId: string;
    /** Whether the user could have received the assignment under the hard rules */
    eligible: boolean;
    /** Whether this user actually received (or currently owns) the assignment */
    chosen: boolean;
    /** Pure match score (routing-weight sum or tag-overlap ratio); 0 when excluded */
    score: number;
    /** What arbitration compares: base priority + score + geo boost + learning boost */
    effectivePriority: number;
    reasons: MatchTraceReason[];
}

/** How the winning user of a decision was arbitrated. */
export type MatchDecisionMode = FairnessMode | 'direct' | 'workflow' | 'manual';

/**
 * The auditable record of one routing decision, captured while the decision
 * was made (not reconstructed after the fact). `candidates` holds every user
 * evaluated in the matching pass plus users excluded by hard rules (vetoes,
 * prior rejections); users that were never candidates for the assignment do
 * not appear.
 */
export interface MatchDecisionTrace {
    id: string;
    assignmentId: string;
    chosenUserId: string;
    matchedAt: number;
    mode: MatchDecisionMode;
    /** Chosen candidate first, then eligible candidates by effective priority */
    candidates: MatchCandidateTrace[];
}

/**
 * On-demand answer to "who could receive this assignment, and why (not)?" —
 * recomputed from live state by `explainMatch()`. For matched assignments the
 * current owner is flagged `chosen`; for the record of the decision as it
 * actually happened, use decision traces instead.
 */
export interface MatchExplanation {
    assignmentId: string;
    status: 'queued' | 'pending' | 'accepted' | 'completed' | 'not_found';
    /**
     * Current owner for pending assignments and completer for completed ones.
     * `null` while queued and for accepted assignments (ownership metadata is
     * released on acceptance — consult decision traces for the full history).
     */
    ownerId: string | null;
    evaluatedAt: number;
    candidates: MatchCandidateTrace[];
}

/** Filters for `getDecisionTraces()`. */
export interface DecisionTraceQuery {
    /** Only traces for this assignment (an assignment re-queued and re-matched has several) */
    assignmentId?: string;
    /** Only traces where this user was chosen */
    userId?: string;
    /** Maximum traces returned (default 50), newest first */
    limit?: number;
}

export type MatcherOptions = {
    relevantBatchSize?: number;
    redisPrefix?: string;
    maxUserBacklogSize?: number;
    enableDefaultMatching?: boolean;
    matchExpirationMs?: number;
    /**
     * Opt-in idle user auto-rejection. When set, users that have pending
     * (not yet accepted/rejected) assignments and show no activity for this
     * many milliseconds are removed from the matching pool by
     * processIdleUsers(), and their pending assignments are requeued.
     * Disabled when undefined (default), preserving existing behavior.
     */
    idleUserTimeoutMs?: number;
    prioritizationFunction?: (...args: (Assignment | undefined)[]) => Promise<number>;
    matchingFunction?: (
        user: User,
        assignmentTags: string,
        assignmentPriority: number | string,
        assignmentId?: string,
        skillThresholds?: Record<string, number>,
    ) => Promise<[number, number]>;
    /**
     * Opt-in global best-match arbitration for bulk matching (default: false,
     * preserving existing behavior). When `matchUsersAssignments()` is called
     * with no userId, every eligible user is normally evaluated in parallel
     * and independently claims every assignment they qualify for — when two
     * or more users are eligible for the same assignment, whichever user's
     * claim reaches Redis first wins, regardless of their relative score.
     * With this enabled, candidates are instead collected across *all* users
     * first, sorted by score descending, and claimed greedily in that order —
     * so the best-fit eligible candidate wins each assignment deterministically.
     * Uses plain weighted-tag/geo score (the same formula as the non-learning
     * path) as the fairness comparator; the contextual-bandit learning layer,
     * if enabled, still re-ranks each user's own accepted backlog ordering but
     * does not influence which user wins a contested assignment in this mode.
     */
    enableFairTiebreaker?: boolean;
    /**
     * One-word fairness policy for bulk matching — the friendly alternative
     * to tuning `enableFairTiebreaker` / `fairnessLoadPenalty` /
     * `fairnessTieBand` by hand:
     *
     * - `'first-come'` (default): whoever's claim reaches Redis first wins a
     *   contested assignment — fastest, but the winner is arbitrary.
     * - `'best-match'`: the highest-scoring eligible user wins every
     *   contested assignment, deterministically.
     * - `'balanced'`: best match wins, but near-ties (scores within ~5% of
     *   the typical candidate score) go to whoever is carrying less work.
     * - `'spread-work'`: work is spread as evenly as skills allow — each
     *   assignment already on someone's plate discounts their next bid by
     *   half the typical candidate score, so being good (and fast) doesn't
     *   mean drowning in work while capable teammates sit idle.
     *
     * The underlying numbers are derived automatically from the candidate
     * scores of each matching pass, so there is nothing to calibrate.
     * `'balanced'` and `'spread-work'` also include a rolling-window
     * guardrail by default: nobody receives at more than double the team's
     * average grant rate over `fairnessWindowMs` (one hour unless changed) —
     * see `fairnessMaxPerWindow` to set an explicit ceiling instead, or pass
     * `Infinity` there to opt out.
     * Setting `fairnessLoadPenalty` / `fairnessTieBand` explicitly overrides
     * the derived values; setting `fairness` overrides
     * `enableFairTiebreaker`. Switchable at runtime via `setFairness(mode)`;
     * every fairness knob (not just the mode) can be retuned live with
     * `setFairnessConfig(config)`.
     */
    fairness?: FairnessMode;
    /**
     * Hard cap on how many assignments a single user may be granted within a
     * rolling time window (default: undefined, disabled; applies in any
     * `fairness` mode other than `'first-come'`). The backlog cap alone can't
     * protect diligent users: someone who accepts and completes work quickly
     * keeps freeing backlog slots and keeps winning, so speed is rewarded
     * with ever more work. This cap counts *granted* assignments over
     * `fairnessWindowMs` regardless of how fast they were cleared; once a
     * user hits it, contested assignments spill to the next-best eligible
     * user (or stay queued) until the window rolls. Workflow-targeted
     * assignments are direct handoffs and bypass the cap so workflows never
     * stall.
     *
     * When left undefined, the `'balanced'` / `'spread-work'` presets supply
     * a team-relative guardrail automatically: `max(maxUserBacklogSize,
     * 2 x the team's average grants in the window)`, recomputed each pass, so
     * it adapts to any deployment's volume without configuration. Set an
     * explicit number to pin the ceiling, or `Infinity` to disable the
     * window cap entirely.
     */
    fairnessMaxPerWindow?: number;
    /**
     * Rolling window length in milliseconds for `fairnessMaxPerWindow`
     * (default: 3600000 — one hour).
     */
    fairnessWindowMs?: number;
    /**
     * Load-penalized scoring for fair-tiebreaker arbitration (default: 0,
     * disabled; requires `enableFairTiebreaker`). Each assignment already on
     * a user's backlog — including ones won earlier in the same matching
     * pass — subtracts this amount from their effective score when competing
     * for the next contested assignment. Pure best-score-wins arbitration
     * otherwise saturates the top scorer to `maxUserBacklogSize` every pass;
     * a penalty makes distribution progressive: the specialist still wins
     * their first picks, but once loaded they lose marginal contests to an
     * idle, still-capable candidate. Pick a value relative to your score
     * scale (base priority + summed routing weights).
     */
    fairnessLoadPenalty?: number;
    /**
     * Tie-band arbitration for fair-tiebreaker mode (default: 0, disabled;
     * requires `enableFairTiebreaker`). Candidate scores falling in the same
     * band-sized bucket (`floor(score / fairnessTieBand)`) are treated as
     * tied, and the tie goes to the user currently carrying the least work.
     * Scores in different buckets still resolve strictly by score, so clear
     * skill differences always dominate — only near-ties get load-balanced.
     * Note the bucket boundaries are fixed, so two scores less than a band
     * apart can still straddle a boundary and resolve by score.
     */
    fairnessTieBand?: number;
    // ========== Decision Traces & Explainability ==========
    /**
     * Persist an auditable decision trace for every routing decision
     * (default: false). Each matched assignment gets a `MatchDecisionTrace` —
     * winner, arbitration mode, and every evaluated candidate with score
     * breakdown and exclusion reasons — appended to a capped Redis stream and
     * queryable via `getDecisionTraces()`. Capture happens during the matching
     * pass itself, so the record reflects what the engine actually did rather
     * than a reconstruction. Toggleable at runtime via `setDecisionTraces()`.
     */
    enableDecisionTraces?: boolean;
    /** Maximum decision traces retained in the Redis stream (default: 1000, approximate trim) */
    decisionTraceMaxEntries?: number;
    /**
     * Maximum candidates stored per trace (default: 25). The chosen candidate
     * is always kept; remaining slots go to the highest-ranked candidates.
     */
    decisionTraceMaxCandidates?: number;
    /**
     * Real-time hook invoked with each `MatchDecisionTrace` as decisions are
     * made (e.g. to push onto a socket). Setting it activates trace capture
     * even when `enableDecisionTraces` is false — in that case traces are
     * streamed to the callback only and not persisted. Errors thrown by the
     * callback are swallowed; they never affect matching.
     */
    onMatchDecision?: (trace: MatchDecisionTrace) => void;

    /** Enable distance-based geolocation matching (default: false) */
    enableGeoMatching?: boolean;
    /** Global fallback cap in kilometers when assignment/user-specific caps are absent */
    geoDefaultMaxDistanceKm?: number;
    /** Proximity boost weight added to combined priority (default: 0) */
    geoScoreWeight?: number;
    /** Custom geolocation matcher override */
    geoMatchingFunction?: GeoMatchingFunction;
    /** Enable workflow orchestration features */
    enableWorkflows?: boolean;
    /** Consumer group name for Redis Streams (defaults to 'orchestrator') */
    streamConsumerGroup?: string;
    /** Consumer name within the group (defaults to random UUID) */
    streamConsumerName?: string;

    // ========== Redis Connection Reliability Options ==========
    /** Maximum number of reconnection attempts (default: 10) */
    redisMaxRetries?: number;
    /** Initial delay between retries in ms (default: 50) */
    redisInitialRetryDelay?: number;
    /** Maximum delay between retries in ms (default: 2000) */
    redisMaxRetryDelay?: number;
    /** Connection timeout in ms (default: 10000) */
    redisConnectTimeout?: number;
    /** Command timeout in ms (default: 3000) */
    redisCommandTimeout?: number;
    /** Enable offline queue for commands during disconnect (default: true) */
    redisEnableOfflineQueue?: boolean;
    /** Enable ready check before considering connection successful (default: true) */
    redisEnableReadyCheck?: boolean;
    /** Health check interval in ms (default: 30000) */
    redisHealthCheckInterval?: number;

    // ========== Workflow Reliability Options ==========
    /** Maximum retries for failed workflow events before moving to DLQ (default: 3) */
    workflowMaxRetries?: number;
    /** TTL for idempotency keys in milliseconds (default: 86400000 = 24h) */
    workflowIdempotencyTtlMs?: number;
    /** Minimum idle time before reclaiming orphaned messages in ms (default: 60000 = 1min) */
    workflowOrphanReclaimMs?: number;
    /** Polling interval for reclaim loop in ms (default: 5000) */
    workflowReclaimPollIntervalMs?: number;
    /** Number of failures before circuit breaker opens (default: 5) */
    workflowCircuitBreakerThreshold?: number;
    /** Time to wait before attempting to close circuit breaker in ms (default: 30000) */
    workflowCircuitBreakerResetMs?: number;
    /** Enable audit trail stream for compliance (default: false) */
    workflowAuditEnabled?: boolean;
    /** Snapshot workflow definitions at instance creation for versioning (default: true) */
    workflowSnapshotDefinitions?: boolean;
    /** Enable OpenTelemetry tracing (default: false) */
    enableOpenTelemetry?: boolean;
    /** Persist circuit breaker state to Redis for distributed awareness (default: false) */
    circuitBreakerPersistState?: boolean;
    /**
     * Share circuit breaker failure counts across replicas via Redis so
     * breakers converge in multi-orchestrator deployments (default: false).
     */
    circuitBreakerShared?: boolean;
    /**
     * TTL applied to terminal (completed/failed/cancelled) workflow instances,
     * including cleanup of registry, per-user, and active-index entries.
     * When unset (default), terminal instances are kept forever.
     */
    workflowInstanceRetentionMs?: number;
    /** Initial backoff delay for scheduled workflow event retries in ms (default: 1000) */
    workflowRetryBackoffMs?: number;
    /** Max stream entries read per orchestrator poll (XREADGROUP COUNT, default: 10) */
    workflowEventBatchSize?: number;
    /** Blocking wait per orchestrator poll in ms (XREADGROUP BLOCK, default: 5000) */
    workflowPollBlockMs?: number;
    /**
     * Per-replica throttle on workflow event processing (events per second).
     * Applies to orchestrator stream consumption and scheduled-retry draining.
     * When unset (default), events are processed as fast as possible.
     */
    workflowMaxEventsPerSecond?: number;
    /** Enable circuit breaker and reliability metrics (default: true when telemetry enabled) */
    enableReliabilityMetrics?: boolean;
    /** Enable graceful degradation mode when Redis is unavailable (default: false) */
    enableGracefulDegradation?: boolean;
    /** Alert threshold for Dead Letter Queue size (default: 100) */
    deadLetterQueueAlertThreshold?: number;

    // ========== Reinforcement Learning Options ==========
    /** Enable the contextual-bandit learning layer (default: false) */
    enableLearning?: boolean;
    /** SGD learning rate for online model updates (default: 0.1) */
    learningRate?: number;
    /** Epsilon-greedy exploration rate in [0, 1] (default: 0.05) */
    learningExplorationRate?: number;
    /** Shadow mode: record decisions and learn, but never alter ranking (default: false) */
    learningShadowMode?: boolean;
    /** Multiplier applied to predicted reward when re-ranking candidates (default: 1) */
    learningBoostFactor?: number;
    /** Override rewards per lifecycle outcome (merged with defaults) */
    learningRewards?: Partial<LearningRewards>;
    /** Custom feature extractor; defaults to tag/skill/overlap/embedding features */
    learningFeatureExtractor?: LearningFeatureExtractor;
    /** TTL for stored decision contexts in ms (default: 604800000 = 7 days) */
    learningDecisionTtlMs?: number;
    /** Weights applied to named external feedback signals when computing rewards (default weight: 1) */
    learningSignalWeights?: Record<string, number>;
    /** TTL for archived episodes awaiting external feedback in ms (default: 604800000 = 7 days) */
    learningFeedbackTtlMs?: number;
    /**
     * Track per-user, per-tag reward statistics and enable automatic
     * routingWeights generation from RL outcomes (requires enableLearning).
     * Default: false.
     */
    enableAutoRoutingWeights?: boolean;
    /** Tuning for automatic routing-weight synthesis (UCB1 policy) */
    autoRoutingWeights?: AutoRoutingWeightsOptions;
};

/** @deprecated Use MatcherOptions instead */
export type options = MatcherOptions;

/** Operational metrics for the workflow engine */
export type WorkflowEngineMetrics = {
    /** Number of active workflow instances (from the active-instance index) */
    activeInstances: number;
    /** Number of events waiting in the delayed-retry queue */
    scheduledRetries: number;
    /** Number of events in the Dead Letter Queue */
    deadLetterQueueSize: number;
    /** Total length of the workflow event stream */
    streamLength: number;
    /** Number of pending (delivered but unacknowledged) stream messages */
    streamPending: number;
};

// ============================================================================
// Workflow Types
// ============================================================================

/** Event types for workflow lifecycle */
export type WorkflowEventType = 'STARTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED' | 'FAILED';

/** Step execution mode */
export type WorkflowTaskType = 'assignment' | 'machine';

/** Target user selector for workflow assignment steps */
export type WorkflowTargetUser = 'initiator' | 'previous' | string | { tag: string };

/** Machine task metadata for code-driven workflow steps */
export interface WorkflowMachineTask {
    /** Machine handler identifier (resolver-specific) */
    handler: string;
    /** Optional static input merged with workflow context */
    input?: Record<string, any>;
}

/** Event published to Redis Streams for workflow orchestration */
export interface WorkflowEvent {
    eventId: string;
    type: WorkflowEventType;
    userId: string;
    assignmentId: string;
    workflowInstanceId?: string;
    stepId?: string;
    timestamp: number;
    payload?: Record<string, any>;
}

/** Routing condition for workflow branching */
export interface WorkflowRouting {
    /** Condition expression evaluated against assignment result (e.g., 'result.score > 80') */
    condition: string;
    /** Target step ID if condition is true */
    targetStepId: string;
}

/** A single step in a workflow definition */
export interface WorkflowStep {
    /** Unique identifier for this step within the workflow */
    id: string;
    /** Human-readable name */
    name: string;
    /** Step execution mode (default: 'assignment') */
    taskType?: WorkflowTaskType;
    /** Assignment template - merged with workflow context when creating the assignment */
    assignmentTemplate?: Partial<Assignment>;
    /** Target user selector: 'initiator' | 'previous' | specific userId | tag-based selector */
    targetUser?: WorkflowTargetUser;
    /** Machine task metadata used for code/task worker execution */
    machineTask?: WorkflowMachineTask;
    /** Routing rules for branching (evaluated in order, first match wins) */
    routing?: WorkflowRouting[];
    /** Default next step if no routing condition matches (null = end workflow) */
    defaultNextStepId?: string | null;
    /** For parallel execution: IDs of steps to execute simultaneously */
    parallelStepIds?: string[];
    /** For parallel joins: wait for all parallel steps before continuing */
    waitForAll?: boolean;
    /** Failure policy for parallel steps: 'abort' | 'continue' | 'retry' */
    failurePolicy?: 'abort' | 'continue' | 'retry';
    /** Maximum retries for this step (default: 0) */
    maxRetries?: number;
    /** Timeout override for this step in milliseconds */
    timeoutMs?: number;
}

/** A workflow definition (template) */
export interface WorkflowDefinition {
    /** Unique identifier for this workflow definition */
    id: string;
    /** Human-readable name */
    name: string;
    /** Version for schema evolution */
    version: number;
    /** The entry point step ID */
    initialStepId: string;
    /** All steps in this workflow */
    steps: WorkflowStep[];
    /** Default timeout for steps in milliseconds */
    defaultTimeoutMs?: number;
    /** Metadata for the workflow */
    metadata?: Record<string, any>;
}

/** User-friendly input shape for registering or executing workflows */
export interface WorkflowDefinitionInput {
    /** Unique identifier for this workflow definition */
    id: string;
    /** Human-readable name */
    name: string;
    /** Version for schema evolution (defaults to 1) */
    version?: number;
    /** The entry point step ID (defaults to the first step ID) */
    initialStepId?: string;
    /** All steps in this workflow */
    steps: WorkflowStep[];
    /** Default timeout for steps in milliseconds */
    defaultTimeoutMs?: number;
    /** Metadata for the workflow */
    metadata?: Record<string, any>;
}

/** Compact workflow metadata returned by list endpoints */
export interface WorkflowDefinitionSummary {
    id: string;
    name: string;
}

/** Status of a workflow instance */
export type WorkflowInstanceStatus = 'active' | 'completed' | 'failed' | 'cancelled';

/** Tracks the state of a parallel execution branch */
export interface ParallelBranchState {
    stepId: string;
    assignmentId: string;
    status: 'pending' | 'completed' | 'failed';
    result?: Record<string, any>;
}

/** A running instance of a workflow */
export interface WorkflowInstance {
    /** Unique identifier for this instance */
    id: string;
    /** Reference to the workflow definition */
    workflowDefinitionId: string;
    /** The user who initiated this workflow */
    initiatorUserId: string;
    /** Current status */
    status: WorkflowInstanceStatus;
    /** Current step ID (null if completed or in parallel execution) */
    currentStepId: string | null;
    /** Current assignment ID being processed */
    currentAssignmentId?: string;
    /** For parallel execution: track all active branches */
    parallelBranches?: ParallelBranchState[];
    /** Persistent context passed between steps */
    context: Record<string, any>;
    /** History of completed steps with their results */
    history: Array<{
        stepId: string;
        assignmentId: string;
        userId: string;
        completedAt: number;
        result?: Record<string, any>;
    }>;
    /** Retry count for current step */
    retryCount: number;
    /** Version for optimistic locking */
    version: number;
    /** Timestamps */
    createdAt: number;
    updatedAt: number;
    /** Snapshot of the workflow definition at instance creation time (for versioning) */
    definitionSnapshot?: WorkflowDefinition;
}

/** Result payload when completing an assignment */
export interface AssignmentResult {
    /** Outcome: success or failure */
    success: boolean;
    /** Arbitrary result data for routing decisions */
    data?: Record<string, any>;
    /** Error message if failed */
    error?: string;
}

// ============================================================================
// Enterprise Reliability Types
// ============================================================================

/** Dead Letter Queue entry for failed events */
export interface DeadLetterEntry {
    /** Original event that failed */
    event: WorkflowEvent;
    /** Reason the event failed */
    reason: string;
    /** Error message if available */
    errorMessage?: string;
    /** Error stack trace if available */
    errorStack?: string;
    /** Timestamp when moved to DLQ */
    movedAt: number;
    /** Number of processing attempts before moving to DLQ */
    retryCount: number;
}

/** Audit trail entry for compliance */
export interface AuditEntry {
    /** Timestamp of the action */
    timestamp: number;
    /** Type of action */
    action: string;
    /** Resource ID (event ID, workflow instance ID, etc.) */
    resourceId: string;
    /** Type of resource */
    resourceType: string;
    /** Consumer ID that processed the event */
    consumerId: string;
    /** Additional details */
    details?: Record<string, any>;
}

/** Circuit breaker state for backpressure management */
export interface CircuitBreakerState {
    /** Current state of the circuit breaker */
    state: 'closed' | 'open' | 'half-open';
    /** Number of consecutive failures */
    failureCount: number;
    /** Timestamp of last failure */
    lastFailureTime: number;
}

/** Reliability metrics for monitoring */
export interface ReliabilityMetrics {
    /** Current circuit breaker state */
    circuitBreakerState: CircuitBreakerState;
    /** Current Dead Letter Queue size */
    deadLetterQueueSize: number;
    /** Whether Redis is considered healthy */
    redisHealthy: boolean;
    /** Number of reconnection attempts since start */
    reconnectCount: number;
    /** Last error message if any */
    lastError?: string;
    /** Timestamp of last successful connection */
    lastConnectedAt: number;
    /** Timestamp of last health check */
    lastHealthCheckAt?: number;
    /** Whether circuit breaker is currently allowing requests */
    circuitBreakerAllowingRequests: boolean;
}

/** Workflow instance with resolved definition for versioning */
export interface WorkflowInstanceWithSnapshot extends WorkflowInstance {
    /** Resolved definition (from snapshot or registry) */
    resolvedDefinition?: WorkflowDefinition;
}

// ============================================================================
// Reinforcement Learning Types
// ============================================================================

/** Assignment lifecycle outcomes that generate learning rewards */
export type LearningOutcome = 'accept' | 'complete' | 'reject' | 'expire' | 'fail';

/** Reward values per lifecycle outcome */
export type LearningRewards = Record<LearningOutcome, number>;

/** Sparse feature vector describing a user/assignment match context */
export type LearningFeatures = Record<string, number>;

/** Minimal assignment context passed to feature extractors */
export interface LearningAssignmentContext {
    id: string;
    tags: string[];
    [key: string]: any;
}

/** Pluggable feature extractor for the learning layer */
export type LearningFeatureExtractor = (user: User, assignment: LearningAssignmentContext) => LearningFeatures;

/** Stored decision context awaiting an outcome */
export interface LearningDecisionRecord {
    userId: string;
    assignmentId: string;
    features: LearningFeatures;
    predictedReward: number;
    /** Assignment tags captured at decision time (used for auto routing weights) */
    tags?: string[];
    timestamp: number;
}

/** Archived episode retained after a terminal outcome for late external feedback */
export interface LearningEpisodeRecord {
    userId: string;
    assignmentId: string;
    features: LearningFeatures;
    /** Terminal outcome that archived this episode */
    outcome?: LearningOutcome;
    /** Assignment tags captured at decision time (used for auto routing weights) */
    tags?: string[];
    timestamp: number;
}

/** Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 }) */
export type LearningSignals = Record<string, number>;

/** Raw training sample for offline/batch model updates */
export interface LearningSample {
    features: LearningFeatures;
    reward: number;
}

/** Per-user, per-tag reward statistics aggregated from lifecycle outcomes */
export interface LearningTagStat {
    tag: string;
    /** Number of reward observations for this tag */
    count: number;
    /** Sum of observed rewards for this tag */
    rewardSum: number;
    /** rewardSum / count (0 when no observations) */
    meanReward: number;
}

/** Options controlling automatic routing-weight synthesis (UCB1 policy) */
export interface AutoRoutingWeightsOptions {
    /** Minimum observations before a tag's stats are trusted (default: 5) */
    minSamples?: number;
    /** Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5) */
    vetoThreshold?: number;
    /** Maximum synthesized weight on the conventional 0-100 scale (default: 100) */
    maxWeight?: number;
    /** UCB exploration coefficient; higher favors less-sampled tags (default: 0.5) */
    explorationBonus?: number;
    /** Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2) */
    priorWeight?: number;
}

/** Aggregate learning statistics */
export interface LearningStats {
    /** Number of recorded match decisions */
    decisions: number;
    /** Number of reward updates applied */
    rewards: number;
    /** Sum of all applied rewards */
    totalReward: number;
    /** totalReward / rewards (0 when no rewards) */
    averageReward: number;
}

// ============================================================================
// Workflow DSL/Builder Types
// ============================================================================

/** Fluent builder for creating workflow steps */
export interface WorkflowStepBuilder {
    /** Set the step name */
    name(name: string): WorkflowStepBuilder;
    /** Set the execution task type */
    taskType(type: WorkflowTaskType): WorkflowStepBuilder;
    /** Set the assignment template */
    assignment(template: Partial<Assignment>): WorkflowStepBuilder;
    /** Configure machine task metadata */
    machineTask(handler: string, input?: Record<string, any>): WorkflowStepBuilder;
    /** Set the target user */
    targetUser(target: 'initiator' | 'previous' | string | { tag: string }): WorkflowStepBuilder;
    /** Add a routing condition */
    when(condition: string, targetStepId: string): WorkflowStepBuilder;
    /** Set the default next step */
    then(stepId: string | null): WorkflowStepBuilder;
    /** Add parallel steps */
    parallel(stepIds: string[]): WorkflowStepBuilder;
    /** Set wait for all parallel steps */
    waitForAll(wait: boolean): WorkflowStepBuilder;
    /** Set failure policy */
    onFailure(policy: 'abort' | 'continue' | 'retry'): WorkflowStepBuilder;
    /** Set max retries */
    retries(count: number): WorkflowStepBuilder;
    /** Set step timeout */
    timeout(ms: number): WorkflowStepBuilder;
    /** Build the step */
    build(): WorkflowStep;
}

/** Fluent builder for creating workflow definitions */
export interface WorkflowDefinitionBuilder {
    /** Set the workflow name */
    name(name: string): WorkflowDefinitionBuilder;
    /** Set the workflow version */
    version(version: number): WorkflowDefinitionBuilder;
    /** Set the initial step ID */
    startWith(stepId: string): WorkflowDefinitionBuilder;
    /** Add a step to the workflow */
    addStep(step: WorkflowStep): WorkflowDefinitionBuilder;
    /** Set default timeout for all steps */
    defaultTimeout(ms: number): WorkflowDefinitionBuilder;
    /** Add metadata */
    metadata(data: Record<string, any>): WorkflowDefinitionBuilder;
    /** Build the workflow definition */
    build(): WorkflowDefinition;
}
