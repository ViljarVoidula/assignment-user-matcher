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
    ) => Promise<[number, number]>;
};

/** @deprecated Use MatcherOptions instead */
export type options = MatcherOptions;
