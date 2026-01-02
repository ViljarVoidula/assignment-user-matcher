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
import type { RedisClientType, User, Assignment, Stats, MatcherOptions, options } from './types/matcher';

// Re-export types for backwards compatibility
export type { RedisClientType, User, Assignment, Stats, MatcherOptions, options } from './types/matcher';

export default class AssignmentMatcher {
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

    constructor(
        public redisClient: RedisClientType,
        options?: options,
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
        this.calculatePriority = options?.prioritizationFunction ?? this.calculatePriority;
        this.matchScore = options?.matchingFunction ?? this.defaultMatchScore.bind(this);
        this.initRedis();
    }

    /** Keys for the three assignment stores (used by pagination queries) */
    private get assignmentStoreKeys() {
        return {
            queued: this.assignmentsRefKey,
            pending: this.pendingAssignmentsKey,
            accepted: this.acceptedAssignmentsKey,
        };
    }

    private async initRedis() {
        // Only attempt to connect if the client isn't already connected
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
        }
        return this;
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
        // Build candidate assignments using per-tag zset union with user weights for scalability.
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

        const userAssignments: Array<{ id: string; priority: number }> = [];

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
