import { expect } from 'chai';
import { createClient } from 'redis';
import sinon from 'sinon';
import AssignmentMatcher from '../src/matcher.class';
import type { UserQueryResult } from '../src/types/matcher';

describe('User status & workload query APIs', function () {
    this.timeout(30000);
    let redisClient: any;
    const prefix = 'test:userq:';
    const acceptedIndexKey = (userId: string) => `${prefix}user:${userId}:accepted`;

    before(async function () {
        redisClient = createClient({ url: 'redis://localhost:6379' });
        await redisClient.connect();
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.flushAll();
        await redisClient.quit();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
    });

    function createMatcher(options: Record<string, unknown> = {}) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: prefix,
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            matchExpirationMs: 60000,
            enableDefaultMatching: true,
            ...options,
        });
    }

    /** Match one assignment into a user's pending backlog. */
    async function pendOne(
        matcher: AssignmentMatcher,
        userId: string,
        assignmentId: string,
        extra: Record<string, unknown> = {},
    ) {
        await matcher.addAssignment({ id: assignmentId, tags: ['t'], priority: 10, ...extra });
        await matcher.matchUsersAssignments(userId);
    }

    describe('getActiveAssignmentsForUser', function () {
        it('lists accepted work newest-first with accept timestamps', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = createMatcher();
                await matcher.addUser({ id: 'u1', tags: ['t'] });
                await pendOne(matcher, 'u1', 'a1');
                const t1 = Date.now();
                await matcher.acceptAssignment('u1', 'a1');

                clock.tick(10);
                await pendOne(matcher, 'u1', 'a2');
                const t2 = Date.now();
                await matcher.acceptAssignment('u1', 'a2');

                const active = await matcher.getActiveAssignmentsForUser('u1');
                expect(active).to.deep.equal([
                    { assignmentId: 'a2', acceptedAt: t2 },
                    { assignmentId: 'a1', acceptedAt: t1 },
                ]);
            } finally {
                clock.restore();
            }
        });

        it('returns an empty list for a user with no accepted work', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await matcher.getActiveAssignmentsForUser('ghost')).to.deep.equal([]);
        });

        it('never lists pending-only work', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'a1');

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.include('a1');
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
        });

        it('drops entries on complete and fail', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'a1');
            await pendOne(matcher, 'u1', 'a2');
            await matcher.acceptAssignment('u1', 'a1');
            await matcher.acceptAssignment('u1', 'a2');

            await matcher.completeAssignment('u1', 'a1');
            expect((await matcher.getActiveAssignmentsForUser('u1')).map((a) => a.assignmentId)).to.deep.equal(['a2']);

            await matcher.failAssignment('u1', 'a2');
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
        });

        it('drops the entry when removeAssignment removes an SLA accepted assignment', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'a1', { sla: { completeWithinMs: 60000 } });
            await matcher.acceptAssignment('u1', 'a1');

            await matcher.removeAssignment('a1');
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await redisClient.zCard(acceptedIndexKey('u1'))).to.equal(0);
        });

        it('filters and self-heals the stale member left by removeAssignment on a non-SLA accepted assignment', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'a1');
            await matcher.acceptAssignment('u1', 'a1');

            // Non-SLA records carry no _acceptedBy, so the index member survives
            await matcher.removeAssignment('a1');
            expect(await redisClient.zCard(acceptedIndexKey('u1'))).to.equal(1);

            // The read filters it against the accepted store and self-heals
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await redisClient.zCard(acceptedIndexKey('u1'))).to.equal(0);
        });

        it('drops the entry when the SLA expiry sweep removes an accepted assignment', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = createMatcher();
                await matcher.addUser({ id: 'u1', tags: ['t'] });
                await pendOne(matcher, 'u1', 'a1', { sla: { expireAfterMs: 100 } });
                await matcher.acceptAssignment('u1', 'a1');

                clock.tick(150);
                const swept = await matcher.processSlaExpiries();
                expect(swept.expired).to.equal(1);
                expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
            } finally {
                clock.restore();
            }
        });

        for (const action of ['requeue', 'fail', 'park'] as const) {
            it(`drops the entry when a completion breach applies '${action}'`, async function () {
                const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
                try {
                    const matcher = createMatcher();
                    await matcher.addUser({ id: 'u1', tags: ['t'] });
                    await pendOne(matcher, 'u1', 'a1', {
                        sla: { completeWithinMs: 100, onCompletionBreach: action },
                    });
                    await matcher.acceptAssignment('u1', 'a1');
                    expect(await matcher.getActiveAssignmentsForUser('u1')).to.have.length(1);

                    clock.tick(150);
                    const swept = await matcher.processCompletionDeadlines();
                    expect(swept.breached).to.equal(1);
                    expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
                } finally {
                    clock.restore();
                }
            });
        }

        it('keeps the entry when a completion breach only notifies', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = createMatcher();
                await matcher.addUser({ id: 'u1', tags: ['t'] });
                await pendOne(matcher, 'u1', 'a1', {
                    sla: { completeWithinMs: 100, onCompletionBreach: 'notify' },
                });
                await matcher.acceptAssignment('u1', 'a1');

                clock.tick(150);
                await matcher.processCompletionDeadlines();
                expect(await matcher.getActiveAssignmentsForUser('u1')).to.have.length(1);
            } finally {
                clock.restore();
            }
        });

        it('leaves accepted work untouched by releaseUserAssignments', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'accepted1');
            await matcher.acceptAssignment('u1', 'accepted1');
            await pendOne(matcher, 'u1', 'pending1');

            const released = await matcher.releaseUserAssignments('u1');
            expect(released).to.deep.equal(['pending1']);
            expect((await matcher.getActiveAssignmentsForUser('u1')).map((a) => a.assignmentId)).to.deep.equal([
                'accepted1',
            ]);
        });

        it('does not index an accept whose pending record is missing', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            // Simulate a half-written pending state: a backlog member whose
            // JSON never landed in the pending hash. The accept proceeds, but
            // nothing enters the accepted store — so nothing may enter the
            // per-user index either.
            await redisClient.sAdd(`${prefix}user:u1:assignments`, 'assignment:ghost');
            await matcher.acceptAssignment('u1', 'ghost');
            expect(await redisClient.zCard(acceptedIndexKey('u1'))).to.equal(0);
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
        });

        it('drops everything when the user is removed', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'a1');
            await matcher.acceptAssignment('u1', 'a1');

            await matcher.removeUser('u1');
            expect(await matcher.getActiveAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await redisClient.exists(acceptedIndexKey('u1'))).to.equal(0);
        });
    });

    describe('getUsersPaginated', function () {
        it('returns summaries with status and workload fields', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'a1');
            await pendOne(matcher, 'u1', 'a2');
            await matcher.acceptAssignment('u1', 'a1');

            const result = await matcher.getUsersPaginated();
            expect(result.hasMore).to.equal(false);
            expect(result.nextCursor).to.equal(null);
            expect(result.users).to.have.length(1);
            const summary = result.users[0];
            expect(summary.userId).to.equal('u1');
            expect(summary.user.tags).to.deep.equal(['t', 'default']);
            expect(summary.paused).to.equal(false);
            expect(summary.lastActiveAt).to.be.a('number');
            expect(summary.backlog).to.equal(1);
            expect(summary.acceptedCount).to.equal(1);
            expect(summary.maxBacklogSize).to.equal(5);
            expect(summary.atCapacity).to.equal(false);
            expect(summary.pendingAssignmentIds).to.equal(undefined);
            expect(summary.acceptedAssignmentIds).to.equal(undefined);
        });

        it('filters by status paused/active', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'active1', tags: ['t'] });
            await matcher.addUser({ id: 'paused1', tags: ['t'] });
            await matcher.pauseUser('paused1');

            const paused = await matcher.getUsersPaginated({ status: 'paused' });
            expect(paused.users.map((u) => u.userId)).to.deep.equal(['paused1']);

            const active = await matcher.getUsersPaginated({ status: 'active' });
            expect(active.users.map((u) => u.userId)).to.deep.equal(['active1']);
        });

        it('filters by idleForMs', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'fresh', tags: ['t'] });
            await matcher.addUser({ id: 'stale', tags: ['t'] });
            // Backdate the stale user's activity record directly
            await redisClient.zAdd(`${prefix}users:activity`, { score: Date.now() - 120000, value: 'stale' });

            const idle = await matcher.getUsersPaginated({ idleForMs: 60000 });
            expect(idle.users.map((u) => u.userId)).to.deep.equal(['stale']);

            const none = await matcher.getUsersPaginated({ status: 'idle' });
            expect(none.users).to.deep.equal([]);
        });

        it("falls back to the matcher's idleUserTimeoutMs for status 'idle'", async function () {
            const matcher = createMatcher({ idleUserTimeoutMs: 60000 });
            await matcher.addUser({ id: 'fresh', tags: ['t'] });
            await matcher.addUser({ id: 'stale', tags: ['t'] });
            await redisClient.zAdd(`${prefix}users:activity`, { score: Date.now() - 120000, value: 'stale' });

            const idle = await matcher.getUsersPaginated({ status: 'idle' });
            expect(idle.users.map((u) => u.userId)).to.deep.equal(['stale']);
        });

        it('filters by hasBacklog', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'busy', tags: ['t'] });
            await matcher.addUser({ id: 'free', tags: ['t'] });
            await pendOne(matcher, 'busy', 'a1');

            const result = await matcher.getUsersPaginated({ hasBacklog: true });
            expect(result.users.map((u) => u.userId)).to.deep.equal(['busy']);
        });

        it('filters by atCapacity, honoring per-user maxBacklogSize overrides', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'capped', tags: ['t'], maxBacklogSize: 1 });
            await matcher.addUser({ id: 'roomy', tags: ['t'] });
            // One pending assignment each: at the per-user cap for 'capped' (1/1),
            // below the global cap for 'roomy' (1/5)
            await matcher.addAssignment({ id: 'a1', tags: ['t'], priority: 10 });
            await matcher.matchUsersAssignments('capped');
            await matcher.addAssignment({ id: 'a2', tags: ['t'], priority: 10 });
            await matcher.matchUsersAssignments('roomy');

            const result = await matcher.getUsersPaginated({ atCapacity: true });
            expect(result.users.map((u) => u.userId)).to.deep.equal(['capped']);
            expect(result.users[0].maxBacklogSize).to.equal(1);
            expect(result.users[0].atCapacity).to.equal(true);
        });

        it('walks a large pool across pages without gaps or duplicates', async function () {
            const matcher = createMatcher();
            // Beyond the listpack threshold of any supported Redis, so HSCAN
            // honors COUNT and the walk really spans multiple pages
            for (let i = 0; i < 600; i++) {
                await matcher.addUser({ id: `u${String(i).padStart(4, '0')}`, tags: ['t'] });
            }

            const seen = new Set<string>();
            let cursor: string | null = null;
            let pages = 0;
            do {
                // Explicit annotation: assigning page.nextCursor back to cursor
                // would otherwise create a control-flow narrowing cycle (TS7022)
                const page: UserQueryResult = await matcher.getUsersPaginated({ cursor, limit: 50 });
                pages++;
                for (const user of page.users) {
                    expect(seen.has(user.userId), `duplicate ${user.userId}`).to.equal(false);
                    seen.add(user.userId);
                }
                cursor = page.nextCursor;
                if (!page.hasMore) break;
            } while (cursor !== null && pages < 100);

            expect(seen.size).to.equal(600);
            expect(pages).to.be.greaterThan(1);
        });

        it('includeAssignments adds raw pending and accepted ids for the returned page', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await pendOne(matcher, 'u1', 'accepted1');
            await matcher.acceptAssignment('u1', 'accepted1');
            await pendOne(matcher, 'u1', 'pending1');

            const result = await matcher.getUsersPaginated({ includeAssignments: true });
            expect(result.users).to.have.length(1);
            expect(result.users[0].pendingAssignmentIds).to.deep.equal(['pending1']);
            expect(result.users[0].acceptedAssignmentIds).to.deep.equal(['accepted1']);
        });

        it('includeTotal reports the unfiltered pool size', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.pauseUser('u2');

            const result = await matcher.getUsersPaginated({ status: 'paused', includeTotal: true });
            expect(result.users).to.have.length(1);
            expect(result.total).to.equal(2);

            const plain = await matcher.getUsersPaginated();
            expect(plain.total).to.equal(undefined);
        });

        it('skips corrupt user records instead of throwing', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await redisClient.hSet(`${prefix}users`, 'corrupt', '{not json');

            const result = await matcher.getUsersPaginated({ includeTotal: true });
            expect(result.users.map((u) => u.userId)).to.deep.equal(['u1']);
            expect(result.total).to.equal(2);
        });
    });

    describe('getUserSummaries', function () {
        it('returns order-preserving summaries and omits missing users', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'], maxBacklogSize: 1 });
            await matcher.pauseUser('u2');
            await pendOne(matcher, 'u1', 'a1');
            await pendOne(matcher, 'u1', 'a2');
            await matcher.acceptAssignment('u1', 'a1');

            const summaries = await matcher.getUserSummaries(['u2', 'ghost', 'u1']);
            expect(summaries.map((s) => s.userId)).to.deep.equal(['u2', 'u1']);

            const [s2, s1] = summaries;
            expect(s2.paused).to.equal(true);
            expect(s2.backlog).to.equal(0);
            expect(s2.acceptedCount).to.equal(0);
            expect(s2.maxBacklogSize).to.equal(1);
            expect(s2.atCapacity).to.equal(false); // backlog 0 below the cap of 1
            expect(s1.backlog).to.equal(1);
            expect(s1.acceptedCount).to.equal(1);
            expect(s1.maxBacklogSize).to.equal(5);
            expect(s1.atCapacity).to.equal(false);
            expect(s1.lastActiveAt).to.be.a('number');
        });

        it('returns an empty array for empty input', async function () {
            const matcher = createMatcher();
            expect(await matcher.getUserSummaries([])).to.deep.equal([]);
        });

        it('omits corrupt user records', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await redisClient.hSet(`${prefix}users`, 'corrupt', '{not json');

            const summaries = await matcher.getUserSummaries(['corrupt', 'u1']);
            expect(summaries.map((s) => s.userId)).to.deep.equal(['u1']);
        });
    });

    describe('read hardening (backward compatible)', function () {
        it('getQueueStats keeps its shape and ordering, and skips corrupt user records', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'busy', tags: ['t'], maxBacklogSize: 2 });
            await matcher.addUser({ id: 'free', tags: ['t'] });
            await matcher.addUser({ id: 'away', tags: ['t'] });
            await pendOne(matcher, 'busy', 'a1');
            await matcher.pauseUser('away');
            await redisClient.hSet(`${prefix}users`, 'corrupt', '{not json');

            const stats = await matcher.getQueueStats();
            expect(stats.queued).to.equal(0);
            expect(stats.pending).to.equal(1);
            expect(stats.perUser).to.deep.equal([
                { userId: 'away', backlog: 0, maxBacklogSize: 5, paused: true },
                { userId: 'busy', backlog: 1, maxBacklogSize: 2, paused: false },
                { userId: 'free', backlog: 0, maxBacklogSize: 5, paused: false },
            ]);
        });

        it('getPendingAssignmentsWithAge without options returns everything sorted by age desc, nulls last', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = createMatcher();
                await matcher.addUser({ id: 'u1', tags: ['t'], maxBacklogSize: 10 });
                await pendOne(matcher, 'u1', 'old');
                clock.tick(200);
                await pendOne(matcher, 'u1', 'new');
                // A pending entry with no expiry score (externally injected) sorts last
                await redisClient.hSet(
                    `${prefix}assignments:pending:data`,
                    'orphan',
                    JSON.stringify({ id: 'orphan', tags: ['t'], priority: 1 }),
                );
                // Corrupt entries are skipped
                await redisClient.hSet(`${prefix}assignments:pending:data`, 'corrupt', '{not json');

                const results = await matcher.getPendingAssignmentsWithAge();
                expect(results.map((r) => r.assignment.id)).to.deep.equal(['old', 'new', 'orphan']);
                expect(results[0].ownerId).to.equal('u1');
                expect(results[0].pendingForMs!).to.be.at.least(200);
                expect(results[1].pendingForMs!).to.be.lessThan(results[0].pendingForMs!);
                expect(results[2].pendingForMs).to.equal(null);
                expect(results[2].pendingSince).to.equal(null);
                expect(results[2].expiresAt).to.equal(null);
                expect(results[2].ownerId).to.equal(null);
            } finally {
                clock.restore();
            }
        });

        it('getPendingAssignmentsWithAge with limit returns only the top-N longest pending', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = createMatcher();
                await matcher.addUser({ id: 'u1', tags: ['t'], maxBacklogSize: 10 });
                await pendOne(matcher, 'u1', 'old');
                clock.tick(200);
                await pendOne(matcher, 'u1', 'mid');
                clock.tick(200);
                await pendOne(matcher, 'u1', 'new');

                const top1 = await matcher.getPendingAssignmentsWithAge({ limit: 1 });
                expect(top1.map((r) => r.assignment.id)).to.deep.equal(['old']);

                const top2 = await matcher.getPendingAssignmentsWithAge({ limit: 2 });
                expect(top2.map((r) => r.assignment.id)).to.deep.equal(['old', 'mid']);
            } finally {
                clock.restore();
            }
        });

        it('getUsers skips corrupt entries instead of throwing', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await redisClient.hSet(`${prefix}users`, 'corrupt', '{not json');

            const users = await matcher.getUsers();
            expect(users.map((u) => u.id)).to.deep.equal(['u1']);
        });
    });
});
