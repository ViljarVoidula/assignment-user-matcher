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
    [key: string]: any;
};

export type Stats = {
    users?: number;
    usersWithoutAssignment?: string[];
    remainingAssignments?: number;
};

export type PendingAssignmentInfo = {
    assignment: Assignment;
    ownerId: string | null;
    pendingForMs: number | null;
    pendingSince: number | null;
    expiresAt: number | null;
};

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
    /** Enable workflow orchestration features */
    enableWorkflows?: boolean;
    /** Consumer group name for Redis Streams (defaults to 'orchestrator') */
    streamConsumerGroup?: string;
    /** Consumer name within the group (defaults to random UUID) */
    streamConsumerName?: string;

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
};

/** @deprecated Use MatcherOptions instead */
export type options = MatcherOptions;

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
    timestamp: number;
}

/** Archived episode retained after a terminal outcome for late external feedback */
export interface LearningEpisodeRecord {
    userId: string;
    assignmentId: string;
    features: LearningFeatures;
    /** Terminal outcome that archived this episode */
    outcome?: LearningOutcome;
    timestamp: number;
}

/** Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 }) */
export type LearningSignals = Record<string, number>;

/** Raw training sample for offline/batch model updates */
export interface LearningSample {
    features: LearningFeatures;
    reward: number;
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
