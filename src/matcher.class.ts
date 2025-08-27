import { createClient } from 'redis';
export type RedisClientType = ReturnType<typeof createClient>;

export interface User {
    id: string;
    tags: string[];
    // Optional routing weights per tag; if present, matching will use these weights.
    // Example: { english: 100, dutch: 30, brazil: 100, german: 0 }
    routingWeights?: Record<string, number>;
    [key: string]: any;
}

export type Assignment = {
    id: string;
    tags: string[];
    priority?: number;
    [key: string]: any;
};

export type Stats = {
    users?: number;
    usersWithoutAssignment?: string[];
    remainingAssignments?: number;
};

export type options = {
    relevantBatchSize?: number;
    redisPrefix?: string;
    maxUserBacklogSize?: number;
    enableDefaultMatching?: boolean;
    prioritizationFunction?: (...args: (Assignment | undefined)[]) => Promise<number>;
    matchingFunction?: (
        user: User,
        assignmentTags: string,
        assignmentPriority: number | string,
        assignmentId?: string,
    ) => Promise<[number, number]>;
};

export default class AssignmentMatcher {
    relevantBatchSize: number;
    redisPrefix: string;
    assignmentsKey: string;
    assignmentsRefKey: string;
    usersKey: string;
    maxUserBacklogSize: number;
    enableDefaultMatching: boolean;

    constructor(
        public redisClient: RedisClientType,
        options?: options,
    ) {
        this.relevantBatchSize = options?.relevantBatchSize ?? 50;
        this.enableDefaultMatching = options?.enableDefaultMatching ?? true;
        this.redisPrefix = options?.redisPrefix ?? '';
        this.usersKey = this.redisPrefix + 'users';
        this.assignmentsKey = this.redisPrefix + 'assignments';
        this.assignmentsRefKey = this.redisPrefix + 'assignments:ref';
        this.maxUserBacklogSize = options?.maxUserBacklogSize ?? 9;
        this.calculatePriority = options?.prioritizationFunction ?? this.calculatePriority;
        this.matchScore = options?.matchingFunction ?? this.matchScore;
        this.initRedis();
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

        const assignmentPriorityKey = this.redisPrefix + `assignment:${id}:priority`;
        const assignmentTagsKey = this.redisPrefix + `assignment:${id}:tags`;
        const assignmentGeoKey = this.redisPrefix + `assignments:geo`;

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
            multi.zAdd(this.redisPrefix + `tag:${tag}:assignments`, {
                score: Number(priority),
                value: id,
            });
        }

        await multi.exec();

        return assignment;
    }

    async removeAssignment(id: string) {
        const assignmentPriorityKey = this.redisPrefix + `assignment:${id}:priority`;
        const assignmentTagsKey = this.redisPrefix + `assignment:${id}:tags`;

        // Fetch tags to remove from per-tag indices
        const [tagsCsv] = await this.redisClient.multi().hGet(assignmentTagsKey, 'tags').exec();

        const tags = (typeof tagsCsv === 'string' && tagsCsv.length > 0 ? tagsCsv.split(',') : []) as string[];

        const multi = this.redisClient.multi();
        // Remove from reference and per-assignment hashes
        multi.hDel(this.assignmentsRefKey, id);
        multi.del(assignmentPriorityKey);
        multi.del(assignmentTagsKey);
        // Remove from global zset
        multi.zRem(this.assignmentsKey, id.toString());
        // Remove from per-tag zsets
        for (const tag of tags) {
            multi.zRem(this.redisPrefix + `tag:${tag}:assignments`, id.toString());
        }

        await multi.exec();
        return id;
    }

    async removeUser(userId: string): Promise<string> {
        const multi = this.redisClient
            .multi()
            .del(this.redisPrefix + `user:${userId}:assignments`)
            .hDel(this.usersKey, userId);
        await multi.exec();

        return userId;
    }

    async getAllAssignments(): Promise<Assignment[]> {
        const assignments = await this.redisClient.hGetAll(this.assignmentsRefKey);
        return Object.values(assignments).map((assignment) => JSON.parse(assignment));
    }

    private async matchScore(
        user: User,
        assignmentTags: string,
        assignmentPriority: string | number,
        assignmentId?: string,
    ): Promise<[number, number]> {
        // If weighted skills are present, use them for scoring
        if (user.routingWeights && Object.keys(user.routingWeights).length > 0) {
            const aTags = assignmentTags ? assignmentTags.split(',') : [];
            // If any assignment tag has explicit weight 0, treat as a hard exclude
            for (const t of aTags) {
                if (user.routingWeights[t] === 0) {
                    return [0, Number(assignmentPriority) || 0];
                }
            }
            let weightSum = 0;
            for (const t of aTags) {
                const w = user.routingWeights[t];
                if (typeof w === 'number' && w > 0) weightSum += w;
            }
            const base = Number(assignmentPriority) || 0;
            // score: total positive weight overlap; priority: base weighted slightly by weight
            return [weightSum, base + weightSum];
        }

        // Fallback to default tag-intersection scoring
        const userTagSet = new Set(user.tags);
        const assignmentTagSet = new Set((assignmentTags || '').split(',').filter(Boolean));
        const intersection = new Set([...userTagSet].filter((tag) => assignmentTagSet.has(tag)));

        const score = userTagSet.size > 0 ? intersection.size / userTagSet.size : 0;
        const base = Number(assignmentPriority) || 0;
        return [score || 0, base + (score || 0)];
    }
    private async calculatePriority(...args: (Assignment | undefined)[]) {
        const [assignment] = args;
        return new Date().getTime() - assignment?.createdAt || 0;
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
        const assignmentPriorityKey = this.redisPrefix + `assignment:${id}:priority`;
        // Fetch tags to update per-tag indices
        const assignmentTagsKey = this.redisPrefix + `assignment:${id}:tags`;
        const [existsRef, tagsCsv] = await this.redisClient
            .multi()
            .hExists(this.assignmentsRefKey, id)
            .hGet(assignmentTagsKey, 'tags')
            .exec();
        const tags = (typeof tagsCsv === 'string' && tagsCsv.length > 0 ? tagsCsv.split(',') : []) as string[];

        const multi = this.redisClient.multi();
        multi.hSet(assignmentPriorityKey, 'priority', priority);
        if (existsRef) {
            // Update global zset score and per-tag zset scores only if assignment still exists
            multi.zAdd(this.assignmentsKey, { score: Number(priority), value: id });
            for (const tag of tags) {
                multi.zAdd(this.redisPrefix + `tag:${tag}:assignments`, { score: Number(priority), value: id });
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
                const assignmentPriorityKey = this.redisPrefix + `assignment:${id}:priority`;
                // Update the stored priority
                multi.hSet(assignmentPriorityKey, 'priority', priority);
                // Update global zset score
                multi.zAdd(this.assignmentsKey, { score: Number(priority), value: id });
                // Update per-tag zset scores
                const idxTags = [...assignment.tags, ...(this.enableDefaultMatching ? ['default'] : [])];
                for (const tag of idxTags) {
                    multi.zAdd(this.redisPrefix + `tag:${tag}:assignments`, { score: Number(priority), value: id });
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

        const tempKey = this.redisPrefix + `tmp:user:${user.id}:candidates`;
        const tempZeroKey = this.redisPrefix + `tmp:user:${user.id}:exclude`;
        const tempFinalKey = this.redisPrefix + `tmp:user:${user.id}:final`;

        const unionKeys = positiveWeights.map((pw) => this.redisPrefix + `tag:${pw.tag}:assignments`);
        const unionWeights = positiveWeights.map((pw) => pw.weight);

        const multi = this.redisClient.multi();
        // Weighted union of positive tag assignment zsets
        multi.zUnionStore(tempKey, unionKeys, { WEIGHTS: unionWeights });
        // Optional exclude set for zero-weight tags
        if (zeroWeightTags.length > 0) {
            const zeroKeys = zeroWeightTags.map((t) => this.redisPrefix + `tag:${t}:assignments`);
            multi.zUnionStore(tempZeroKey, zeroKeys);
            // Final = candidates - exclude
            multi.zDiffStore(tempFinalKey, [tempKey, tempZeroKey]);
            // Set short TTLs to clean up
            multi.expire(tempKey, 5);
            multi.expire(tempZeroKey, 5);
            multi.expire(tempFinalKey, 5);
        } else {
            // No exclude; just use tempKey as final (copy into final for uniformity)
            multi.zUnionStore(tempFinalKey, [tempKey]);
            multi.expire(tempKey, 5);
            multi.expire(tempFinalKey, 5);
        }

        await multi.exec();

        // Pull top-N in ascending score to preserve previous behavior on ties (lex ascending)
        const top = await this.redisClient.zRangeWithScores(tempFinalKey, 0, this.relevantBatchSize - 1);

        if (top.length === 0) return userAssignments;

        // Fetch per-assignment stored (base) priority and tags in a single pipeline (fewer round trips)
        const batched = this.redisClient.multi();
        for (const entry of top) {
            const assignmentId = (entry as any).value;
            const assignmentPriorityKey = this.redisPrefix + `assignment:${assignmentId}:priority`;
            const assignmentTagsKey = this.redisPrefix + `assignment:${assignmentId}:tags`;
            batched.hGet(assignmentPriorityKey, 'priority');
            batched.hGet(assignmentTagsKey, 'tags');
        }
        const flat = await batched.exec();
        const details = [] as Array<{ id: string; basePriority: number; tags: string }>;
        for (let i = 0; i < top.length; i++) {
            const assignmentId = (top[i] as any).value;
            const priority = Number(flat[i * 2]) || 0;
            const tags = String(flat[i * 2 + 1] || '');
            details.push({ id: assignmentId, basePriority: priority, tags });
        }
        // Prefer higher base priority first to satisfy tests and practical expectations
        details.sort((a, b) => b.basePriority - a.basePriority);

        const selected: Array<{ id: string; tags: string }> = [];
        for (const d of details) {
            if (userAssignments.length >= this.maxUserBacklogSize) break;
            // Use custom matchScore (supports weights) for a final check and tie-break
            const [score, combinedPriority] = await this.matchScore(user, d.tags, d.basePriority, d.id);
            if (score && combinedPriority) {
                userAssignments.push({ id: d.id, priority: combinedPriority });
                selected.push({ id: d.id, tags: d.tags });
            }
        }

        // Batch-remove all selected assignments from indexes and references to reduce round trips
        if (selected.length > 0) {
            const rm = this.redisClient.multi();
            for (const s of selected) {
                const assignmentPriorityKey = this.redisPrefix + `assignment:${s.id}:priority`;
                const assignmentTagsKey = this.redisPrefix + `assignment:${s.id}:tags`;
                // Remove from reference and per-assignment hashes
                rm.hDel(this.assignmentsRefKey, s.id);
                rm.del(assignmentPriorityKey);
                rm.del(assignmentTagsKey);
                // Remove from global zset
                rm.zRem(this.assignmentsKey, s.id);
                // Remove from per-tag zsets
                const tags = (s.tags ? s.tags.split(',').filter(Boolean) : []) as string[];
                for (const tag of tags) {
                    rm.zRem(this.redisPrefix + `tag:${tag}:assignments`, s.id);
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
            const userMatchesCount = await this.redisClient.sCard(this.redisPrefix + `user:${user.id}:assignments`);
            if (userMatchesCount >= this.maxUserBacklogSize) return;

            const relevantAssignments = await this.getUserRelatedAssignments(user);
            const relevantAssignmentKeys = relevantAssignments
                .sort((a, b) => b.priority - a.priority)
                .map((a) => `assignment:${a.id}`);

            if (relevantAssignmentKeys.length > 0) {
                await this.redisClient.sAdd(this.redisPrefix + `user:${user.id}:assignments`, relevantAssignmentKeys);
            }
            return;
        }

        // Otherwise, process all users in parallel as before.
        let users: any[] = [];
        let cursor = 0;

        // Fetch all users in a single loop
        do {
            const { cursor: nextCursor, tuples } = await this.redisClient.hScan(this.usersKey, cursor);
            users.push(...tuples.map((t: { value: string }) => JSON.parse(t.value)));
            cursor = nextCursor;
        } while (cursor !== 0);

        // Process users in parallel
        await Promise.all(
            users.map(async (user) => {
                const userMatchesCount = await this.redisClient.sCard(this.redisPrefix + `user:${user.id}:assignments`);
                if (userMatchesCount >= this.maxUserBacklogSize) {
                    return;
                }

                const relevantAssignments = await this.getUserRelatedAssignments(user);
                const relevantAssignmentKeys = relevantAssignments
                    .sort((a, b) => b.priority - a.priority)
                    .map((a) => `assignment:${a.id}`);

                if (relevantAssignmentKeys.length > 0) {
                    await this.redisClient.sAdd(this.redisPrefix + `user:${user.id}:assignments`, relevantAssignmentKeys);
                }
            }),
        );
    }

    async getCurrentAssignmentsForUser(userId: string): Promise<string[]> {
        const userAssignments = await this.redisClient.sMembers(this.redisPrefix + `user:${userId}:assignments`);

        return userAssignments.map((el: string) => el.split(':')[1]);
    }
}
