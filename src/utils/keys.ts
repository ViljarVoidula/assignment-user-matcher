/**
 * Redis Key Builders
 * Centralized key generation for consistent Redis key naming
 */

export interface RedisKeyConfig {
    prefix: string;
}

/**
 * Creates Redis key builder functions with a given prefix
 */
export function createKeyBuilders(config: RedisKeyConfig) {
    const { prefix } = config;

    return {
        // User keys
        users: () => `${prefix}users`,
        userAssignments: (userId: string) => `${prefix}user:${userId}:assignments`,
        userRejected: (userId: string) => `${prefix}user:${userId}:rejected`,
        userActivity: () => `${prefix}users:activity`,

        // Assignment keys
        assignments: () => `${prefix}assignments`,
        assignmentsRef: () => `${prefix}assignments:ref`,
        assignmentsGeo: () => `${prefix}assignments:geo`,
        assignmentPriority: (id: string) => `${prefix}assignment:${id}:priority`,
        assignmentTags: (id: string) => `${prefix}assignment:${id}:tags`,

        // Pending/accepted state keys
        pendingAssignmentsData: () => `${prefix}assignments:pending:data`,
        pendingAssignmentsExpiry: () => `${prefix}assignments:pending:expiry`,
        assignmentOwner: () => `${prefix}assignments:pending:owner`,
        acceptedAssignments: () => `${prefix}assignments:accepted`,

        // Tag keys
        allTags: () => `${prefix}all:tags`,
        tagAssignments: (tag: string) => `${prefix}tag:${tag}:assignments`,

        // Temp keys (for computations)
        tempUserCandidates: (userId: string) => `${prefix}tmp:user:${userId}:candidates`,
        tempUserExclude: (userId: string) => `${prefix}tmp:user:${userId}:exclude`,
        tempUserFinal: (userId: string) => `${prefix}tmp:user:${userId}:final`,

        // Workflow keys
        workflowDefinitions: () => `${prefix}workflows:definitions`,
        workflowDefinition: (id: string) => `${prefix}workflow:${id}:definition`,
        workflowInstances: () => `${prefix}workflows:instances`,
        workflowInstance: (id: string) => `${prefix}workflow:instance:${id}`,
        workflowInstancesByUser: (userId: string) => `${prefix}user:${userId}:workflow:instances`,
        workflowAssignmentLink: (assignmentId: string) => `${prefix}assignment:${assignmentId}:workflow`,

        // Completed assignments store
        completedAssignments: () => `${prefix}assignments:completed`,

        // Redis Streams keys
        eventStream: () => `${prefix}events:stream`,
        eventStreamDeadLetter: () => `${prefix}events:deadletter`,

        // Learning (contextual bandit) keys
        learningModel: () => `${prefix}learning:model`,
        learningDecision: (assignmentId: string) => `${prefix}learning:decision:${assignmentId}`,
        learningEpisode: (assignmentId: string) => `${prefix}learning:episode:${assignmentId}`,
        learningStats: () => `${prefix}learning:stats`,
        // Auto routing weights (per-user tag bandit) keys
        learningUsers: () => `${prefix}learning:users`,
        learningUserTagCounts: (userId: string) => `${prefix}learning:user:${userId}:tag:counts`,
        learningUserTagRewards: (userId: string) => `${prefix}learning:user:${userId}:tag:rewards`,

        // Workflow reliability keys
        // Reliability and audit keys
        deadLetterQueue: () => `${prefix}workflow:dlq`,
        processedEvents: () => `${prefix}events:processed`,
        eventRetryCount: (eventId: string) => `${prefix}events:retries:${eventId}`,
        workflowStepExpiry: (instanceId: string, stepId: string) => `${prefix}workflow:${instanceId}:step:${stepId}:expiry`,
        workflowAuditStream: () => `${prefix}workflow:audit:stream`,
        circuitBreakerState: () => `${prefix}reliability:circuit-breaker:state`,
        reliabilityMetrics: () => `${prefix}reliability:metrics`,
    };
}

export type KeyBuilders = ReturnType<typeof createKeyBuilders>;
