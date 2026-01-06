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

export type MatcherOptions = {
    relevantBatchSize?: number;
    redisPrefix?: string;
    maxUserBacklogSize?: number;
    enableDefaultMatching?: boolean;
    matchExpirationMs?: number;
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
};

/** @deprecated Use MatcherOptions instead */
export type options = MatcherOptions;

// ============================================================================
// Workflow Types
// ============================================================================

/** Event types for workflow lifecycle */
export type WorkflowEventType = 'STARTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED' | 'FAILED';

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
    /** Assignment template - merged with workflow context when creating the assignment */
    assignmentTemplate: Partial<Assignment>;
    /** Target user selector: 'initiator' | 'previous' | specific userId | tag-based selector */
    targetUser: 'initiator' | 'previous' | string | { tag: string };
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
// Workflow DSL/Builder Types
// ============================================================================

/** Fluent builder for creating workflow steps */
export interface WorkflowStepBuilder {
    /** Set the step name */
    name(name: string): WorkflowStepBuilder;
    /** Set the assignment template */
    assignment(template: Partial<Assignment>): WorkflowStepBuilder;
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
