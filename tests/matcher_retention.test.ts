import { expect } from 'chai';
import { createClient } from 'redis';
import sinon from 'sinon';
import AssignmentMatcher from '../src/matcher.class';

describe('Store retention (completed assignments, workflow event stream)', function () {
    this.timeout(30000);
    let redisClient: any;
    const prefix = 'test:retention:';

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

    /** Drive one assignment through match → accept → complete. */
    async function completeOne(matcher: AssignmentMatcher, userId: string, assignmentId: string) {
        await matcher.addUser({ id: userId, tags: ['t'] });
        await matcher.addAssignment({ id: assignmentId, tags: ['t'], priority: 10 });
        await matcher.matchUsersAssignments(userId);
        await matcher.acceptAssignment(userId, assignmentId);
        await matcher.completeAssignment(userId, assignmentId, { success: true });
    }

    describe('completedAssignmentsRetentionMs', function () {
        it('the maintenance tick purges terminal assignments past the window and keeps fresh ones', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = new AssignmentMatcher(redisClient, {
                    redisPrefix: prefix,
                    matchExpirationMs: 60000,
                    completedAssignmentsRetentionMs: 1000,
                });
                await matcher.waitUntilReady();

                await completeOne(matcher, 'u1', 'fresh');
                clock.tick(1500);
                await completeOne(matcher, 'u1', 'recent');

                // Age the first completion past the window without touching the second.
                clock.tick(0);
                const report = await matcher.runMaintenanceOnce();
                expect(report.retentionPurged).to.equal(1);
                expect(await redisClient.hLen(`${prefix}assignments:completed`)).to.equal(1);
                expect(Number(await redisClient.hExists(`${prefix}assignments:completed`, 'recent'))).to.equal(1);

                // Listing sees only the survivor.
                const page = await matcher.getCompletedAssignments();
                expect(page.hasMore).to.equal(false);
                expect(page.assignments.map((a) => a.id)).to.deep.equal(['recent']);
                expect(page.assignments[0]._status).to.equal('completed');
            } finally {
                clock.restore();
            }
        });

        it('keeps the store forever when no retention window is configured', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = new AssignmentMatcher(redisClient, { redisPrefix: prefix, matchExpirationMs: 60000 });
                await matcher.waitUntilReady();

                await completeOne(matcher, 'u1', 'a1');
                clock.tick(60_000);

                const report = await matcher.runMaintenanceOnce();
                expect(report.retentionPurged).to.equal(0);
                expect(await redisClient.hLen(`${prefix}assignments:completed`)).to.equal(1);
                expect((await matcher.processCompletedAssignmentsRetention()).purged).to.equal(0);
            } finally {
                clock.restore();
            }
        });

        it('can be disabled per maintenance pass even when the window is configured', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = new AssignmentMatcher(redisClient, {
                    redisPrefix: prefix,
                    matchExpirationMs: 60000,
                    completedAssignmentsRetentionMs: 1000,
                });
                await matcher.waitUntilReady();

                await completeOne(matcher, 'u1', 'a1');
                clock.tick(5000);

                const report = await matcher.runMaintenanceOnce({ completedRetention: false });
                expect(report.retentionPurged).to.equal(0);
                expect(await redisClient.hLen(`${prefix}assignments:completed`)).to.equal(1);
            } finally {
                clock.restore();
            }
        });

        it('never deletes entries without a terminal timestamp', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                const matcher = new AssignmentMatcher(redisClient, {
                    redisPrefix: prefix,
                    matchExpirationMs: 60000,
                    completedAssignmentsRetentionMs: 1000,
                });
                await matcher.waitUntilReady();

                // Externally injected record with no _completedAt/_failedAt.
                await redisClient.hSet(
                    `${prefix}assignments:completed`,
                    'injected',
                    JSON.stringify({ id: 'injected', tags: ['t'], priority: 1 }),
                );
                clock.tick(5000);

                expect((await matcher.processCompletedAssignmentsRetention()).purged).to.equal(0);
                expect(Number(await redisClient.hExists(`${prefix}assignments:completed`, 'injected'))).to.equal(1);
            } finally {
                clock.restore();
            }
        });

        it('backfills the index for entries written before it existed (legacy stores)', async function () {
            const clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
            try {
                // Simulate a legacy store: raw entries, no index, no marker.
                await redisClient.hSet(
                    `${prefix}assignments:completed`,
                    'legacy-old',
                    JSON.stringify({ id: 'legacy-old', _completedAt: Date.now() }),
                );
                clock.tick(5000);
                await redisClient.hSet(
                    `${prefix}assignments:completed`,
                    'legacy-new',
                    JSON.stringify({ id: 'legacy-new', _completedAt: Date.now() }),
                );

                const matcher = new AssignmentMatcher(redisClient, {
                    redisPrefix: prefix,
                    matchExpirationMs: 60000,
                    completedAssignmentsRetentionMs: 1000,
                });
                await matcher.waitUntilReady();

                const report = await matcher.runMaintenanceOnce();
                expect(report.retentionPurged).to.equal(1);
                expect(await redisClient.hLen(`${prefix}assignments:completed`)).to.equal(1);
                expect(Number(await redisClient.hExists(`${prefix}assignments:completed`, 'legacy-new'))).to.equal(1);
                // The one-shot marker is set, so later sweeps stay index-only.
                expect(Number(await redisClient.exists(`${prefix}assignments:completed:retention-indexed`))).to.equal(1);
            } finally {
                clock.restore();
            }
        });
    });

    describe('getCompletedAssignments', function () {
        it('pages through the completed store with a cursor', async function () {
            const matcher = new AssignmentMatcher(redisClient, { redisPrefix: prefix, matchExpirationMs: 60000 });
            await matcher.waitUntilReady();

            await completeOne(matcher, 'u1', 'a1');
            await completeOne(matcher, 'u1', 'a2');
            await completeOne(matcher, 'u1', 'a3');

            const first = await matcher.getCompletedAssignments({ limit: 2 });
            expect(first.assignments).to.have.length(2);
            expect(first.hasMore).to.equal(true);
            expect(first.nextCursor).to.be.a('string');

            const second = await matcher.getCompletedAssignments({ limit: 2, cursor: first.nextCursor });
            expect(second.assignments).to.have.length(1);
            expect(second.hasMore).to.equal(false);
            expect(second.nextCursor).to.equal(null);

            const ids = new Set([...first.assignments, ...second.assignments].map((a) => a.id));
            expect([...ids].sort()).to.deep.equal(['a1', 'a2', 'a3']);
            for (const assignment of first.assignments) {
                expect(assignment._status).to.equal('completed');
                expect((assignment as any)._completedBy).to.equal('u1');
            }
        });

        it('stamps failed assignments as failed, not completed', async function () {
            const matcher = new AssignmentMatcher(redisClient, { redisPrefix: prefix, matchExpirationMs: 60000 });
            await matcher.waitUntilReady();

            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'doomed', tags: ['t'], priority: 10 });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'doomed');
            await matcher.failAssignment('u1', 'doomed', 'cannot finish');

            const page = await matcher.getCompletedAssignments();
            expect(page.assignments).to.have.length(1);
            expect(page.assignments[0]._status).to.equal('failed');
            expect((page.assignments[0] as any)._failedBy).to.equal('u1');
        });

        it('returns an empty page for an empty store', async function () {
            const matcher = new AssignmentMatcher(redisClient, { redisPrefix: prefix, matchExpirationMs: 60000 });
            await matcher.waitUntilReady();

            const page = await matcher.getCompletedAssignments();
            expect(page.assignments).to.deep.equal([]);
            expect(page.hasMore).to.equal(false);
            expect(page.nextCursor).to.equal(null);
        });
    });

    describe('workflowEventStreamAutoTrim', function () {
        async function publishEvents(matcher: AssignmentMatcher, count: number) {
            for (let i = 0; i < count; i++) {
                await matcher.publishWorkflowEvent({
                    eventId: `ev-${i}`,
                    type: 'COMPLETED',
                    userId: 'u1',
                    assignmentId: `a${i}`,
                    timestamp: Date.now(),
                });
            }
        }

        it('trims only what the consumer group has acknowledged', async function () {
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: prefix,
                matchExpirationMs: 60000,
                enableWorkflows: true,
                streamConsumerGroup: 'trimtest',
                workflowEventStreamAutoTrim: true,
            });
            await matcher.waitUntilReady();

            await publishEvents(matcher, 12);
            // Consume 5 of the 12 and acknowledge them.
            const read = (await redisClient.xReadGroup(
                'trimtest',
                'testconsumer',
                [{ key: `${prefix}events:stream`, id: '>' }],
                { COUNT: 5 },
            )) as any;
            const ids = read[0].messages.map((m: any) => m.id);
            await redisClient.xAck(`${prefix}events:stream`, 'trimtest', ids);

            const trimmed = await matcher.trimWorkflowEventStream();
            expect(trimmed).to.equal(5);
            expect(Number(await redisClient.xLen(`${prefix}events:stream`))).to.equal(7);
        });

        it('keeps delivered-but-unacknowledged entries (never trims ahead of consumers)', async function () {
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: prefix,
                matchExpirationMs: 60000,
                enableWorkflows: true,
                streamConsumerGroup: 'trimtest',
                workflowEventStreamAutoTrim: true,
            });
            await matcher.waitUntilReady();

            await publishEvents(matcher, 12);
            // Read 5 without acknowledging: the oldest pending entry anchors the
            // frontier, so nothing is safe to trim.
            await redisClient.xReadGroup('trimtest', 'testconsumer', [{ key: `${prefix}events:stream`, id: '>' }], {
                COUNT: 5,
            });

            const trimmed = await matcher.trimWorkflowEventStream();
            expect(trimmed).to.equal(0);
            expect(Number(await redisClient.xLen(`${prefix}events:stream`))).to.equal(12);
        });

        it('trims nothing when nothing has been consumed', async function () {
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: prefix,
                matchExpirationMs: 60000,
                enableWorkflows: true,
                streamConsumerGroup: 'trimtest',
                workflowEventStreamAutoTrim: true,
            });
            await matcher.waitUntilReady();

            await publishEvents(matcher, 12);
            expect(await matcher.trimWorkflowEventStream()).to.equal(0);
            expect(Number(await redisClient.xLen(`${prefix}events:stream`))).to.equal(12);
        });

        it('returns 0 when no consumer group exists', async function () {
            // Workflows disabled: no group is created, so there is no safe
            // frontier and trimming must refuse rather than lose events.
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: prefix,
                matchExpirationMs: 60000,
            });
            await matcher.waitUntilReady();

            await publishEvents(matcher, 3);
            expect(await matcher.trimWorkflowEventStream()).to.equal(0);
            expect(Number(await redisClient.xLen(`${prefix}events:stream`))).to.equal(3);
        });

        it('leaves the stream unbounded when unset (publish adds no trim)', async function () {
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: prefix,
                matchExpirationMs: 60000,
                enableWorkflows: true,
                streamConsumerGroup: 'trimtest',
            });
            await matcher.waitUntilReady();

            await publishEvents(matcher, 12);
            expect(Number(await redisClient.xLen(`${prefix}events:stream`))).to.equal(12);
        });
    });
});
