import { createClient } from '@redis/client';
export type RedisClientType = ReturnType<typeof createClient>;

export interface User {
    id: string;
    tags: string[];
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
        await this.redisClient.connect();
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
            .hSet(assignmentTagsKey, 'tags', tags.join(',') + this.enableDefaultMatching ? ',default' : '')
            .zAdd(this.assignmentsKey, {
                score: priority,
                value: id,
            });
        if (latitude && longitude) {
            debugger;
            multi.geoAdd(assignmentGeoKey, {
                longitude,
                latitude,
                member: id,
            });
        }

        await multi.exec();

        return assignment;
    }

    async removeAssignment(id: string) {
        const assignmentPriorityKey = this.redisPrefix + `assignment:${id}:priority`;
        const assignmentTagsKey = this.redisPrefix + `assignment:${id}:tags`;

        const multi = this.redisClient
            .multi()
            .hDel(`${this.assignmentsKey + ':ref'}+ ':ref'`, id)
            .del(assignmentPriorityKey)
            .del(assignmentTagsKey)
            .zRem(this.assignmentsKey, id.toString());

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
        const userTagSet = new Set(user.tags);
        const assignmentTagSet = new Set(assignmentTags.split(','));
        const intersection = new Set([...userTagSet].filter((tag) => assignmentTagSet.has(tag)));

        const score = intersection.size / userTagSet.size;

        return [score || 0, Number(assignmentPriority) + score || 0];
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
        await this.redisClient.hSet(assignmentPriorityKey, 'priority', priority);

        return { id, priority };
    }

    async setAssignmentPriorityByTags(tags: string[], priority: number) {
      const assignments = await this.getAllAssignments();
      const relevantAssignments = assignments.filter((assignment) => {
          const assignmentTagSet = new Set(assignment.tags);
          return tags.some((tag) => assignmentTagSet.has(tag));
      });
  
      if (relevantAssignments.length > 0) {
          const multi = this.redisClient.multi();
          relevantAssignments.forEach((assignment) => {
              multi.hSet(`assignment:${assignment.id}`, 'priority', priority);
          });
          await multi.exec();
      }
  
      return relevantAssignments.map((assignment) => ({ id: assignment.id, priority }));
  }

    private async getUserRelatedAssignments(user: User) {
        const inputAssignments = await this.redisClient.zRangeByScoreWithScores(this.assignmentsKey, 0, '+inf', {
            LIMIT: { offset: 0, count: this.relevantBatchSize },
        });
        const returnAssignments: any[] = [];
        const userAssignments: any[] = [];
        for (const assignment of inputAssignments) {
            const assignmentId = assignment.value;
            const assignmentPriorityKey = this.redisPrefix + `assignment:${assignmentId}:priority`;
            const assignmentTagsKey = this.redisPrefix + `assignment:${assignmentId}:tags`;
            const [priority, tags] = await this.redisClient
                .multi()
                .hGet(assignmentPriorityKey, 'priority')
                .hGet(assignmentTagsKey, 'tags')
                .exec();

            returnAssignments.push({
                id: assignmentId,
                priority,
                tags,
            });
        }

        for (let i = 0; i < returnAssignments.length; i++) {
            if (userAssignments.length >= this.maxUserBacklogSize) {
                return userAssignments;
            }
            const [score, priority] = await this.matchScore(
                user,
                returnAssignments[i].tags,
                returnAssignments[i].priority,
                returnAssignments[i].id,
            );

            if (score) {
                userAssignments.push({
                    id: returnAssignments[i].id,
                    priority,
                });

                await this.removeAssignment(returnAssignments[i].id);
            }
        }
        return userAssignments;
    }
    async matchUsersAssignments(userId?: string): Promise<void> {
      let users: any[] = [];
      let cursor = 0;
  
      // Fetch all users in a single loop
      do {
          // @ts-expect-error
          const { cursor: nextCursor, tuples } = await this.redisClient.hScan(this.usersKey, cursor);
          users.push(...tuples.map((t: { value: string }) => JSON.parse(t.value)));
          // @ts-expect-error
          cursor = nextCursor;
      } while (cursor !== 0);
  
      // Process users in parallel
      await Promise.all(users.map(async (user) => {
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
      }));
  }

    async getCurrentAssignmentsForUser(userId: string): Promise<string[]> {
        const userAssignments = await this.redisClient.sMembers(this.redisPrefix + `user:${userId}:assignments`);

        return userAssignments.map((el: string) => el.split(':')[1]);
    }
}
