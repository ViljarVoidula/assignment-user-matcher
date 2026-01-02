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
    };
}

export type KeyBuilders = ReturnType<typeof createKeyBuilders>;
