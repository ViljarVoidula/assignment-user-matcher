/**
 * User status & workload query helpers: paginated user scans with
 * status/backlog filters, batch summaries, and per-user accepted-work reads.
 *
 * All reads are bounded: the users hash is paged with HSCAN, per-page reads
 * are batched into a single multi(), and JSON.parse is always guarded.
 */
import type { KeyBuilders } from '../utils/keys';
import type {
    RedisClientType,
    User,
    ActiveAssignmentInfo,
    UserQueryOptions,
    UserQueryResult,
    UserSummary,
} from '../matcher.class';

/** HSCAN page hint, matching the matcher-wide convention. */
const USER_SCAN_COUNT = 500;
/** Hard ceiling for a single user-query page. */
const MAX_USER_QUERY_LIMIT = 1000;
const DEFAULT_USER_QUERY_LIMIT = 100;
/** Chunk size for batched multi() reads. */
const MULTI_CHUNK_SIZE = 500;
/** Backlog set members are stored as `assignment:{id}`. */
const BACKLOG_MEMBER_PREFIX = 'assignment:';

/**
 * Effective backlog cap for one user. Injected by the facade because the pure
 * module cannot see the matcher-wide default (`backlogLimitFor` is private).
 */
export type MaxBacklogSizeFor = (user: User) => number;

function clampLimit(limit: number | undefined): number {
    if (typeof limit !== 'number' || !Number.isFinite(limit)) return DEFAULT_USER_QUERY_LIMIT;
    return Math.max(1, Math.min(Math.floor(limit), MAX_USER_QUERY_LIMIT));
}

type UserPageEntry = {
    user: User;
    paused: boolean;
    backlog: number;
    lastActiveAt: number | null;
    acceptedCount: number;
    maxBacklogSize: number;
    atCapacity: boolean;
};

/**
 * Paginated user scan with composable filters. The cursor is an opaque HSCAN
 * cursor — pass `nextCursor` back verbatim. Because a scan page is never
 * split mid-way, a returned page may exceed `limit` by less than one scan
 * page, and filtered scans may return fewer than `limit` users while
 * `hasMore` is still true; keep consuming until `hasMore` is false.
 */
export async function getUsersPaginatedFromStore(
    redisClient: RedisClientType,
    keys: KeyBuilders,
    options: UserQueryOptions | undefined,
    maxBacklogSizeFor: MaxBacklogSizeFor,
): Promise<UserQueryResult> {
    const limit = clampLimit(options?.limit);
    const status = options?.status ?? 'all';
    const hasBacklog = options?.hasBacklog ?? false;
    const atCapacity = options?.atCapacity ?? false;
    const includeAssignments = options?.includeAssignments ?? false;

    // Idle predicate: needs a threshold. 'idle' status without one matches
    // nobody (the facade substitutes idleUserTimeoutMs when configured).
    const idleForMs = options?.idleForMs;
    const idleCutoff = typeof idleForMs === 'number' && Number.isFinite(idleForMs) ? Date.now() - idleForMs : null;
    const idleFilterActive = idleCutoff !== null;
    const idleRequired = status === 'idle';

    // The paused pool is small by design: one read per call, not per user.
    const pausedMembers = new Set<string>(await redisClient.sMembers(keys.pausedUsers()));

    const matches: UserPageEntry[] = [];
    let cursor = options?.cursor ?? '0';

    do {
        const { cursor: nextCursor, entries } = await redisClient.hScan(keys.users(), cursor, {
            // Adapt the hint to what's still needed, floored at 100 (don't
            // dribble) and capped at the scan-page convention.
            COUNT: Math.max(Math.min(limit - matches.length, USER_SCAN_COUNT), 100),
        });
        cursor = nextCursor;

        // Cheap pre-filter on fields already in hand (status), so the
        // pipelined reads below only run for survivors.
        const page: Array<{ user: User; paused: boolean }> = [];
        for (const entry of entries) {
            let user: User;
            try {
                user = JSON.parse(entry.value);
            } catch {
                // Skip corrupt entries (same precedent as getAllAssignmentsFromStores)
                continue;
            }
            const paused = pausedMembers.has(user.id);
            if (status === 'paused' && !paused) continue;
            if (status === 'active' && paused) continue;
            page.push({ user, paused });
        }
        if (page.length > 0) {
            // One multi() per page: backlog depth, activity score, accepted count.
            const multi = redisClient.multi();
            for (const { user } of page) {
                multi.sCard(keys.userAssignments(user.id));
                multi.zScore(keys.userActivity(), user.id);
                multi.zCard(keys.userAcceptedAssignments(user.id));
            }
            const results = (await multi.exec()) as unknown as Array<number | null>;

            for (let i = 0; i < page.length; i++) {
                const { user, paused } = page[i];
                const backlog = Number(results[i * 3] ?? 0);
                const activityScore = results[i * 3 + 1];
                const lastActiveAt = activityScore === null || activityScore === undefined ? null : Number(activityScore);
                const acceptedCount = Number(results[i * 3 + 2] ?? 0);
                const maxBacklogSize = maxBacklogSizeFor(user);
                const entry: UserPageEntry = {
                    user,
                    paused,
                    backlog,
                    lastActiveAt,
                    acceptedCount,
                    maxBacklogSize,
                    atCapacity: backlog >= maxBacklogSize,
                };

                // Users with no recorded activity are not idle: idleness needs
                // a reference point (addUser touches on creation, so null only
                // appears for externally-written records).
                const idle = entry.lastActiveAt !== null && idleCutoff !== null && entry.lastActiveAt <= idleCutoff;
                if ((idleRequired || idleFilterActive) && !idle) continue;
                if (hasBacklog && entry.backlog === 0) continue;
                if (atCapacity && !entry.atCapacity) continue;

                matches.push(entry);
            }
        }
        // A scan page is never split: stop only at a page boundary.
    } while (matches.length < limit && cursor !== '0');

    const hasMore = cursor !== '0';

    const users: UserSummary[] = matches.map((entry) => ({
        userId: entry.user.id,
        user: entry.user,
        paused: entry.paused,
        lastActiveAt: entry.lastActiveAt,
        backlog: entry.backlog,
        acceptedCount: entry.acceptedCount,
        maxBacklogSize: entry.maxBacklogSize,
        atCapacity: entry.atCapacity,
    }));

    if (includeAssignments && matches.length > 0) {
        // Per-user assignment ids for the returned page only, chunked.
        for (let start = 0; start < matches.length; start += MULTI_CHUNK_SIZE) {
            const chunk = matches.slice(start, start + MULTI_CHUNK_SIZE);
            const multi = redisClient.multi();
            for (const { user } of chunk) {
                multi.sMembers(keys.userAssignments(user.id));
                multi.zRange(keys.userAcceptedAssignments(user.id), 0, -1, { REV: true });
            }
            const results = (await multi.exec()) as unknown as string[][];
            for (let i = 0; i < chunk.length; i++) {
                const summary = users[start + i];
                // Backlog members are `assignment:{id}`; accepted ids are raw.
                // Accepted ids are NOT verified against the accepted hash here
                // (a stale member may appear); getActiveAssignmentsForUser is
                // the verified read.
                summary.pendingAssignmentIds = (results[i * 2] ?? []).map((m) => m.slice(BACKLOG_MEMBER_PREFIX.length));
                summary.acceptedAssignmentIds = results[i * 2 + 1] ?? [];
            }
        }
    }

    const result: UserQueryResult = {
        users,
        nextCursor: hasMore ? cursor : null,
        hasMore,
    };
    if (options?.includeTotal) {
        result.total = await redisClient.hLen(keys.users());
    }
    return result;
}

/**
 * Order-preserving batch summary read. Missing users are omitted (mirrors
 * getAssignmentsByIds). Chunked multi() keeps pipelines bounded.
 */
export async function getUserSummariesBatch(
    redisClient: RedisClientType,
    keys: KeyBuilders,
    userIds: string[],
    maxBacklogSizeFor: MaxBacklogSizeFor,
): Promise<UserSummary[]> {
    if (userIds.length === 0) return [];

    const summaries: UserSummary[] = [];
    for (let start = 0; start < userIds.length; start += MULTI_CHUNK_SIZE) {
        const chunk = userIds.slice(start, start + MULTI_CHUNK_SIZE);
        const multi = redisClient.multi();
        for (const userId of chunk) {
            multi.hGet(keys.users(), userId);
            multi.sIsMember(keys.pausedUsers(), userId);
            multi.sCard(keys.userAssignments(userId));
            multi.zCard(keys.userAcceptedAssignments(userId));
            multi.zScore(keys.userActivity(), userId);
        }
        const results = (await multi.exec()) as unknown as Array<string | number | boolean | null>;

        for (let i = 0; i < chunk.length; i++) {
            const json = results[i * 5];
            if (typeof json !== 'string') continue; // missing user: omitted
            let user: User;
            try {
                user = JSON.parse(json);
            } catch {
                continue; // corrupt entry: omitted
            }
            const activityScore = results[i * 5 + 4];
            const backlog = Number(results[i * 5 + 2] ?? 0);
            const maxBacklogSize = maxBacklogSizeFor(user);
            summaries.push({
                userId: user.id,
                user,
                paused: Boolean(results[i * 5 + 1]),
                lastActiveAt: activityScore === null || activityScore === undefined ? null : Number(activityScore),
                backlog,
                acceptedCount: Number(results[i * 5 + 3] ?? 0),
                maxBacklogSize,
                atCapacity: backlog >= maxBacklogSize,
            });
        }
    }
    return summaries;
}

/**
 * A user's accepted (in-progress) assignments, newest first. Verified against
 * the accepted hash: members orphaned by a missed index removal are dropped
 * from the result and self-healed with a zRem.
 */
export async function getActiveAssignmentsFromStore(
    redisClient: RedisClientType,
    keys: KeyBuilders,
    userId: string,
): Promise<ActiveAssignmentInfo[]> {
    const entries = await redisClient.zRangeWithScores(keys.userAcceptedAssignments(userId), 0, -1, { REV: true });
    if (entries.length === 0) return [];

    const multi = redisClient.multi();
    for (const entry of entries) {
        multi.hGet(keys.acceptedAssignments(), entry.value);
    }
    const jsons = (await multi.exec()) as unknown as Array<string | null>;

    const active: ActiveAssignmentInfo[] = [];
    const stale: string[] = [];
    for (let i = 0; i < entries.length; i++) {
        if (jsons[i]) {
            active.push({ assignmentId: entries[i].value, acceptedAt: Number(entries[i].score) });
        } else {
            stale.push(entries[i].value);
        }
    }
    if (stale.length > 0) {
        await redisClient.zRem(keys.userAcceptedAssignments(userId), stale);
    }
    return active;
}
