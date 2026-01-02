/**
 * Pagination and querying utilities for assignments
 */
import type { RedisClientType, Assignment } from '../matcher.class';

export type AssignmentStatus = 'queued' | 'pending' | 'accepted';

export interface PaginationOptions {
    cursor?: string | null;
    limit?: number;
    status?: AssignmentStatus | 'all';
    includeTotal?: boolean;
}

export interface PaginationResult {
    assignments: Assignment[];
    nextCursor: string | null;
    hasMore: boolean;
    total?: number;
}

export interface AssignmentCounts {
    queued: number;
    pending: number;
    accepted: number;
    total: number;
}

export interface AssignmentKeys {
    queued: string;
    pending: string;
    accepted: string;
}

/**
 * Get all assignments from all stores (queued, pending, accepted)
 */
export async function getAllAssignmentsFromStores(
    redisClient: RedisClientType,
    keys: AssignmentKeys
): Promise<Assignment[]> {
    const [queuedAssignments, pendingAssignments, acceptedAssignments] = await Promise.all([
        redisClient.hGetAll(keys.queued),
        redisClient.hGetAll(keys.pending),
        redisClient.hGetAll(keys.accepted),
    ]);
    
    const allAssignments = { ...queuedAssignments, ...pendingAssignments, ...acceptedAssignments };
    return Object.values(allAssignments).map((assignment) => JSON.parse(assignment));
}

/**
 * Get assignment counts by status
 */
export async function getAssignmentCountsFromStores(
    redisClient: RedisClientType,
    keys: AssignmentKeys
): Promise<AssignmentCounts> {
    const [queued, pending, accepted] = await Promise.all([
        redisClient.hLen(keys.queued),
        redisClient.hLen(keys.pending),
        redisClient.hLen(keys.accepted),
    ]);

    return {
        queued,
        pending,
        accepted,
        total: queued + pending + accepted,
    };
}

/**
 * Get a single assignment by ID from any status
 */
export async function getAssignmentById(
    redisClient: RedisClientType,
    keys: AssignmentKeys,
    id: string
): Promise<(Assignment & { _status?: string }) | null> {
    const [queued, pending, accepted] = await Promise.all([
        redisClient.hGet(keys.queued, id),
        redisClient.hGet(keys.pending, id),
        redisClient.hGet(keys.accepted, id),
    ]);

    if (queued) {
        const assignment = JSON.parse(queued);
        assignment._status = 'queued';
        return assignment;
    }
    if (pending) {
        const assignment = JSON.parse(pending);
        assignment._status = 'pending';
        return assignment;
    }
    if (accepted) {
        const assignment = JSON.parse(accepted);
        assignment._status = 'accepted';
        return assignment;
    }

    return null;
}

/**
 * Get multiple assignments by IDs efficiently
 */
export async function getAssignmentsByIdsBatch(
    redisClient: RedisClientType,
    keys: AssignmentKeys,
    ids: string[]
): Promise<Assignment[]> {
    if (ids.length === 0) return [];

    const multi = redisClient.multi();
    for (const id of ids) {
        multi.hGet(keys.queued, id);
        multi.hGet(keys.pending, id);
        multi.hGet(keys.accepted, id);
    }

    const results = await multi.exec() as unknown as (string | null)[];
    const assignments: Assignment[] = [];

    for (let i = 0; i < ids.length; i++) {
        const queued = results[i * 3];
        const pending = results[i * 3 + 1];
        const accepted = results[i * 3 + 2];

        const json = queued || pending || accepted;
        if (json) {
            try {
                const assignment = JSON.parse(json);
                assignment._status = queued ? 'queued' : pending ? 'pending' : 'accepted';
                assignments.push(assignment);
            } catch {
                // Skip invalid JSON
            }
        }
    }

    return assignments;
}

/**
 * Get assignments with cursor-based pagination across statuses
 */
export async function getAssignmentsPaginatedFromStores(
    redisClient: RedisClientType,
    keys: AssignmentKeys,
    options?: PaginationOptions
): Promise<PaginationResult> {
    const limit = options?.limit ?? 100;
    const status = options?.status ?? 'all';
    const includeTotal = options?.includeTotal ?? false;

    const getKeyForStatus = (s: AssignmentStatus): string => {
        switch (s) {
            case 'queued': return keys.queued;
            case 'pending': return keys.pending;
            case 'accepted': return keys.accepted;
        }
    };

    const statusOrder: AssignmentStatus[] = 
        status === 'all' ? ['queued', 'pending', 'accepted'] : [status];

    // Parse cursor: "statusIndex:offset"
    let statusIndex = 0;
    let offset = 0;

    if (options?.cursor) {
        const parts = options.cursor.split(':');
        statusIndex = parseInt(parts[0], 10) || 0;
        offset = parseInt(parts[1], 10) || 0;
    }

    const assignments: Assignment[] = [];
    let nextCursor: string | null = null;
    let hasMore = false;

    while (assignments.length < limit && statusIndex < statusOrder.length) {
        const scanStatus = statusOrder[statusIndex];
        const key = getKeyForStatus(scanStatus);

        const totalInStatus = await redisClient.hLen(key);
        const remainingInStatus = totalInStatus - offset;

        if (remainingInStatus <= 0) {
            statusIndex++;
            offset = 0;
            continue;
        }

        const needed = limit - assignments.length;
        let scanned = 0;
        let cursor = '0';
        const seenIds = new Set<string>();

        do {
            const { cursor: newCursor, entries } = await redisClient.hScan(key, cursor, {
                COUNT: Math.max(needed + offset - scanned, 100),
            });

            for (const entry of entries) {
                if (seenIds.has(entry.field)) continue;
                seenIds.add(entry.field);

                if (scanned < offset) {
                    scanned++;
                    continue;
                }

                if (assignments.length >= limit) {
                    nextCursor = `${statusIndex}:${offset + (assignments.length - (assignments.filter(a => (a as any)._status === scanStatus).length - 1))}`;
                    hasMore = true;
                    break;
                }

                try {
                    const assignment = JSON.parse(entry.value);
                    assignment._status = scanStatus;
                    assignments.push(assignment);
                } catch {
                    // Skip invalid JSON
                }
                scanned++;
            }

            cursor = newCursor;
        } while (cursor !== '0' && assignments.length < limit);

        if (assignments.length >= limit) {
            const countFromCurrentStatus = assignments.filter(a => (a as any)._status === scanStatus).length;
            nextCursor = `${statusIndex}:${offset + countFromCurrentStatus}`;
            hasMore = true;
            break;
        }

        statusIndex++;
        offset = 0;
    }

    // Check for more data in remaining statuses
    if (!hasMore && statusIndex < statusOrder.length) {
        for (let i = statusIndex; i < statusOrder.length; i++) {
            const count = await redisClient.hLen(getKeyForStatus(statusOrder[i]));
            const processedInThisStatus = i === statusIndex ? offset : 0;
            if (count > processedInThisStatus) {
                nextCursor = `${i}:${processedInThisStatus}`;
                hasMore = true;
                break;
            }
        }
    }

    const result: PaginationResult = {
        assignments,
        nextCursor: hasMore ? nextCursor : null,
        hasMore,
    };

    if (includeTotal) {
        if (status === 'all') {
            const counts = await getAssignmentCountsFromStores(redisClient, keys);
            result.total = counts.total;
        } else {
            result.total = await redisClient.hLen(getKeyForStatus(status));
        }
    }

    return result;
}
