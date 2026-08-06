import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent } from '../src/types/matcher';

describe('Schedule policies', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    let clock: sinon.SinonFakeTimers;
    const prefix = 'schedule_test:';

    before(async function () {
        redisClient = createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 10,
            relevantBatchSize: 50,
            matchExpirationMs: 60000,
            onAssignmentLifecycle: (event) => events.push(event),
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        events = [];
        // Schedule clocks are Date.now()-scored zsets: fake Date lets tests
        // fast-forward past deadlines instead of sleeping in real time.
        // Seeded with the real time so timestamps stay positive.
        clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
    });

    afterEach(function () {
        clock.restore();
    });

    after(async function () {
        matcher.stopMaintenance();
        await redisClient.quit();
    });

    const kinds = (kind: AssignmentLifecycleEvent['kind']) => events.filter((e) => e.kind === kind);
    const refKey = `${prefix}assignments:ref`;
    const scheduledKey = `${prefix}assignments:scheduled`;
    const activateAtKey = `${prefix}assignments:scheduled:activateAt`;
    const notAfterKey = `${prefix}assignments:schedule:notAfter`;
    const queuedAtKey = `${prefix}assignments:queuedAt`;
    const slaExpiryKey = `${prefix}assignments:sla:expiry`;
    const parkedKey = `${prefix}assignments:parked`;

    describe('notBefore (hold + activation)', function () {
        it('holds a future assignment out of every matching structure', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 60000 },
            });

            await matcher.matchUsersAssignments();
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(0);

            // Held: only the scheduled store and activation index know it
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.a('string');
            expect(await redisClient.zScore(activateAtKey, 'a1')).to.not.be.null;
            expect(await redisClient.hGet(refKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(`${prefix}assignments`, 'a1')).to.be.null;
            expect(await redisClient.zScore(`${prefix}tag:t:assignments`, 'a1')).to.be.null;
            expect(await redisClient.zScore(queuedAtKey, 'a1')).to.be.null;
        });

        it('keeps a held workflow-targeted assignment away from its target user', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'wf-a1',
                tags: ['t'],
                _targetUserId: 'u1',
                _workflowInstanceId: 'wf-1',
                schedule: { notBefore: Date.now() + 60000 },
            });

            await matcher.matchUsersAssignments('u1');
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(0);
        });

        it('activates once the time arrives and becomes matchable', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 5000 },
            });

            // Not due yet
            let swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 0, missed: 0 });

            clock.tick(5001);
            swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 1, missed: 0 });

            const activatedEvents = kinds('scheduleActivated');
            expect(activatedEvents).to.have.length(1);
            expect(activatedEvents[0]).to.include({ kind: 'scheduleActivated', taskId: 'a1' });

            // Hand-off is complete: scheduled store empty, queued store live
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(activateAtKey, 'a1')).to.be.null;
            expect(await redisClient.hGet(refKey, 'a1')).to.be.a('string');

            // Fire-once: a second sweep does nothing
            swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 0, missed: 0 });
            expect(kinds('scheduleActivated')).to.have.length(1);

            await matcher.matchUsersAssignments();
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(1);
        });

        it('anchors the wait clock at activation, not creation', async function () {
            const createdAt = Date.now();
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: createdAt + 60000 },
            });

            clock.tick(60001);
            await matcher.processScheduledAssignments();

            const queuedAt = Number(await redisClient.zScore(queuedAtKey, 'a1'));
            expect(queuedAt).to.be.at.least(createdAt + 60000);
        });

        it('anchors the SLA freshness TTL at activation, not creation', async function () {
            const createdAt = Date.now();
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: createdAt + 60000 },
                sla: { expireAfterMs: 10000 },
            });

            // While held: no first-enqueue stamp, no TTL index entry
            const heldJson = await redisClient.hGet(scheduledKey, 'a1');
            expect(heldJson.indexOf('_enqueuedAt')).to.equal(-1);
            expect(await redisClient.zScore(slaExpiryKey, 'a1')).to.be.null;

            clock.tick(60001);
            await matcher.processScheduledAssignments();

            const activatedAt = createdAt + 60001;
            const stored = JSON.parse(await redisClient.hGet(refKey, 'a1'));
            expect(stored._enqueuedAt).to.be.at.least(activatedAt);
            const ttlScore = Number(await redisClient.zScore(slaExpiryKey, 'a1'));
            expect(ttlScore).to.equal(stored._enqueuedAt + 10000);
        });

        it('enqueues directly when notBefore is absent or already past', async function () {
            await matcher.addAssignment({ id: 'past', tags: ['t'], schedule: { notBefore: Date.now() - 1000 } });
            await matcher.addAssignment({ id: 'plain', tags: ['t'] });

            for (const id of ['past', 'plain']) {
                expect(await redisClient.hGet(refKey, id)).to.be.a('string');
                expect(await redisClient.hGet(scheduledKey, id)).to.be.null;
                expect(await redisClient.zScore(activateAtKey, id)).to.be.null;
            }
        });

        it('stores schedule-less assignment JSON byte-identically and touches no schedule keys', async function () {
            const input = { id: 'plain', tags: ['t'], priority: 5 };
            await matcher.addAssignment({ ...input });

            expect(await redisClient.hGet(refKey, 'plain')).to.equal(JSON.stringify(input));
            expect(await redisClient.hLen(scheduledKey)).to.equal(0);
            expect(await redisClient.zCard(activateAtKey)).to.equal(0);
            expect(await redisClient.zCard(notAfterKey)).to.equal(0);
        });

        it('stores the held assignment JSON byte-identically (no internal stamps)', async function () {
            const input = {
                id: 'a1',
                tags: ['t'],
                priority: 3,
                schedule: { notBefore: Date.now() + 60000 },
                sla: { expireAfterMs: 10000 },
            };
            await matcher.addAssignment(JSON.parse(JSON.stringify(input)));
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.equal(JSON.stringify(input));
        });
    });

    describe('notAfter (offer window)', function () {
        it('parks a never-activated assignment when its window closes', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 5000, notAfter: Date.now() + 10000 },
            });

            clock.tick(10001);
            // Miss beats activation: one sweep, no queue transit
            const swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 0, missed: 1 });
            expect(kinds('scheduleActivated')).to.have.length(0);

            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.a('string');
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(activateAtKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.be.null;
            expect(await redisClient.hGet(refKey, 'a1')).to.be.null;

            const missEvents = kinds('scheduleMissed') as any[];
            expect(missEvents).to.have.length(1);
            expect(missEvents[0]).to.include({
                kind: 'scheduleMissed',
                taskId: 'a1',
                ownerId: null,
                state: 'scheduled',
                action: 'park',
            });
            expect(missEvents[0].assignment).to.deep.include({ id: 'a1' });

            // Fire-once: a second sweep does nothing
            const again = await matcher.processScheduledAssignments();
            expect(again).to.deep.equal({ activated: 0, missed: 0 });
            expect(kinds('scheduleMissed')).to.have.length(1);
        });

        it('drops instead of parking under onMiss: drop', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 5000, notAfter: Date.now() + 10000, onMiss: 'drop' },
            });

            clock.tick(10001);
            const swept = await matcher.processScheduledAssignments();
            expect(swept.missed).to.equal(1);

            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.null;
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.null;
            expect(await matcher.getAssignment('a1')).to.be.null;

            const missEvents = kinds('scheduleMissed') as any[];
            expect(missEvents[0]).to.include({ action: 'drop' });
            // The event snapshot is the last surviving copy
            expect(missEvents[0].assignment.id).to.equal('a1');
        });

        it('expires a queued assignment with full index cleanup (notAfter without notBefore)', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                sla: { expireAfterMs: 3600000 },
                schedule: { notAfter: Date.now() + 5000 },
            });

            // Enqueued directly: live in queued structures, deadline armed
            expect(await redisClient.hGet(refKey, 'a1')).to.be.a('string');
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.not.be.null;

            clock.tick(5001);
            const swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 0, missed: 1 });

            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.a('string');
            expect(await redisClient.hGet(refKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(`${prefix}assignments`, 'a1')).to.be.null;
            expect(await redisClient.zScore(`${prefix}tag:t:assignments`, 'a1')).to.be.null;
            expect(await redisClient.zScore(queuedAtKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(slaExpiryKey, 'a1')).to.be.null;

            const missEvents = kinds('scheduleMissed') as any[];
            expect(missEvents[0]).to.include({ state: 'queued', ownerId: null });
        });

        it('expires a pending (matched, un-accepted) assignment and frees the owner', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notAfter: Date.now() + 5000 },
            });
            await matcher.matchUsersAssignments();
            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(1);

            clock.tick(5001);
            const swept = await matcher.processScheduledAssignments();
            expect(swept.missed).to.equal(1);

            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(0);
            expect(await redisClient.hGet(`${prefix}assignments:pending:data`, 'a1')).to.be.null;
            expect(await redisClient.zScore(`${prefix}assignments:pending:expiry`, 'a1')).to.be.null;
            expect(await redisClient.hGet(`${prefix}assignments:pending:owner`, 'a1')).to.be.null;
            expect(await redisClient.zScore(queuedAtKey, 'a1')).to.be.null;
            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.a('string');

            const missEvents = kinds('scheduleMissed') as any[];
            expect(missEvents[0]).to.include({ state: 'pending', ownerId: 'u1' });
        });

        it('cleans up a stale index entry without firing an event', async function () {
            await redisClient.zAdd(notAfterKey, { score: Date.now() - 1000, value: 'ghost' });

            const swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 0, missed: 0 });
            expect(kinds('scheduleMissed')).to.have.length(0);
            expect(await redisClient.zScore(notAfterKey, 'ghost')).to.be.null;
        });

        it('counts misses in the SLO stats, globally and per tag', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['billing'],
                schedule: { notAfter: Date.now() + 1000 },
            });
            clock.tick(1001);
            await matcher.processScheduledAssignments();

            expect((await matcher.getSlaStats()).scheduleMisses).to.equal(1);
            expect((await matcher.getSlaStats('billing')).scheduleMisses).to.equal(1);
            expect((await matcher.getSlaStats('other')).scheduleMisses).to.equal(0);
        });

        it('feeds a pending-state miss to the learning layer as an expire outcome', async function () {
            const learningMatcher = new Matcher(redisClient, {
                redisPrefix: prefix,
                maxUserBacklogSize: 10,
                relevantBatchSize: 20,
                enableLearning: true,
                learningExplorationRate: 0,
                enableAutoRoutingWeights: true,
                enableDefaultMatching: false,
            });
            await learningMatcher.waitUntilReady();

            await learningMatcher.addUser({ id: 'u1', tags: ['t'] });
            await learningMatcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notAfter: Date.now() + 5000 },
            });
            await learningMatcher.matchUsersAssignments('u1');

            clock.tick(5001);
            await learningMatcher.processScheduledAssignments();

            const stats = await learningMatcher.getLearnedTagStats('u1');
            const tag = stats.find((s) => s.tag === 't');
            expect(tag).to.exist;
            expect(tag!.meanReward).to.be.lessThan(0);
        });
    });

    describe('acceptance ends the offer clock', function () {
        it('accept clears the notAfter index; a late window close is a non-event', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notAfter: Date.now() + 5000 },
            });
            await matcher.matchUsersAssignments();
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.not.be.null;

            await matcher.acceptAssignment('u1', 'a1');
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.be.null;

            clock.tick(5001);
            const swept = await matcher.processScheduledAssignments();
            expect(swept).to.deep.equal({ activated: 0, missed: 0 });
            expect(kinds('scheduleMissed')).to.have.length(0);

            // Late completion still works
            await matcher.completeAssignment('u1', 'a1');
            expect(await redisClient.hGet(`${prefix}assignments:completed`, 'a1')).to.be.a('string');
        });

        it('rejection requeue keeps the absolute deadline and a later miss still fires', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notAfter: Date.now() + 5000 },
            });
            await matcher.matchUsersAssignments();

            const scoreBefore = Number(await redisClient.zScore(notAfterKey, 'a1'));
            await matcher.rejectAssignment('u1', 'a1');
            expect(Number(await redisClient.zScore(notAfterKey, 'a1'))).to.equal(scoreBefore);

            clock.tick(5001);
            const swept = await matcher.processScheduledAssignments();
            expect(swept.missed).to.equal(1);
            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.a('string');
        });
    });

    describe('terminal paths clear the schedule indexes', function () {
        it('rejection-budget exhaustion leaves no notAfter entry behind', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                sla: { maxRejections: 1 },
                schedule: { notAfter: Date.now() + 60000 },
            });
            await matcher.matchUsersAssignments();
            await matcher.rejectAssignment('u1', 'a1');

            expect((await matcher.getAssignment('a1'))!._status).to.equal('parked');
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.be.null;
        });

        it('escalation-exhausted park leaves no notAfter entry behind', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, maxEscalations: 0, onExhausted: 'park' },
                schedule: { notAfter: Date.now() + 60000 },
            });
            await matcher.matchUsersAssignments();
            clock.tick(160);
            await matcher.processResponseDeadlines();

            expect((await matcher.getAssignment('a1'))!._status).to.equal('parked');
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.be.null;
        });

        it('an SLA TTL expiry of a pending assignment leaves no notAfter entry behind', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                sla: { expireAfterMs: 100 },
                schedule: { notAfter: Date.now() + 60000 },
            });
            await matcher.matchUsersAssignments();

            clock.tick(160);
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(1);
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.be.null;
        });

        it('removeAssignment clears the scheduled store and both indexes', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 5000, notAfter: Date.now() + 10000 },
            });
            await matcher.removeAssignment('a1');

            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(activateAtKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.be.null;
        });
    });

    describe('maintenance integration', function () {
        it('a bare runMaintenanceOnce sweeps schedule clocks by default', async function () {
            await matcher.addAssignment({ id: 'due', tags: ['t'], schedule: { notBefore: Date.now() + 1000 } });
            await matcher.addAssignment({ id: 'late', tags: ['t'], schedule: { notAfter: Date.now() + 1000 } });

            clock.tick(1001);
            const report = await matcher.runMaintenanceOnce();
            expect(report.scheduleActivations).to.equal(1);
            expect(report.scheduleMisses).to.equal(1);

            expect(await redisClient.hGet(refKey, 'due')).to.be.a('string');
            expect(await redisClient.hGet(parkedKey, 'late')).to.be.a('string');
        });

        it('the scheduled sweep can be disabled individually', async function () {
            await matcher.addAssignment({ id: 'due', tags: ['t'], schedule: { notBefore: Date.now() + 1000 } });

            clock.tick(1001);
            const report = await matcher.runMaintenanceOnce({ scheduled: false });
            expect(report.scheduleActivations).to.equal(0);
            expect(await redisClient.hGet(scheduledKey, 'due')).to.be.a('string');
        });
    });

    describe('query surface', function () {
        it('exposes held assignments via getScheduledAssignments and getAssignment', async function () {
            await matcher.addAssignment({
                id: 'held',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 60000 },
            });

            const scheduled = await matcher.getScheduledAssignments();
            expect(scheduled).to.have.length(1);
            expect(scheduled[0].id).to.equal('held');

            // Held items must never read as "not found"
            const found = await matcher.getAssignment('held');
            expect(found).to.exist;
            expect(found!._status).to.equal('scheduled');
        });

        it('counts scheduled separately and keeps it out of total and pagination', async function () {
            await matcher.addAssignment({ id: 'held', tags: ['t'], schedule: { notBefore: Date.now() + 60000 } });
            await matcher.addAssignment({ id: 'live', tags: ['t'] });

            const counts = await matcher.getAssignmentCounts();
            expect(counts.scheduled).to.equal(1);
            expect(counts.queued).to.equal(1);
            expect(counts.total).to.equal(1);

            const page = await matcher.getAssignmentsPaginated({ status: 'all' });
            expect(page.assignments.map((a) => a.id)).to.deep.equal(['live']);
        });

        it('reports scheduled in getQueueStats without touching oldestWaitingMs', async function () {
            await matcher.addAssignment({ id: 'held', tags: ['t'], schedule: { notBefore: Date.now() + 60000 } });

            const stats = await matcher.getQueueStats();
            expect(stats.scheduled).to.equal(1);
            expect(stats.queued).to.equal(0);
            // A held assignment has no wait clock yet
            expect(stats.oldestWaitingMs).to.be.null;
        });
    });

    describe('operator surface', function () {
        it('assignToUser refuses a held assignment unless forced', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 60000, notAfter: Date.now() + 120000 },
            });

            let error: Error | null = null;
            try {
                await matcher.assignToUser('a1', 'u1');
            } catch (err) {
                error = err as Error;
            }
            expect(error).to.exist;
            expect(error!.message).to.match(/scheduled/i);
        });

        it('assignToUser with force early-activates the assignment', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 60000, notAfter: Date.now() + 120000 },
            });

            await matcher.assignToUser('a1', 'u1', { force: true });

            expect(await redisClient.sCard(`${prefix}user:u1:assignments`)).to.equal(1);
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(activateAtKey, 'a1')).to.be.null;
            // Still un-accepted: the offer deadline is carried
            expect(await redisClient.zScore(notAfterKey, 'a1')).to.not.be.null;
        });

        it('a rejected early-assignment returns to the scheduled store', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notBefore: Date.now() + 60000 },
            });

            await matcher.assignToUser('a1', 'u1', { force: true });
            await matcher.rejectAssignment('u1', 'a1');

            // notBefore is still in the future: the requeue re-holds it
            expect(await redisClient.hGet(scheduledKey, 'a1')).to.be.a('string');
            expect(await redisClient.hGet(refKey, 'a1')).to.be.null;
        });

        it('an unparked miss re-misses unless the schedule is reset', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                schedule: { notAfter: Date.now() + 1000 },
            });
            clock.tick(1001);
            await matcher.processScheduledAssignments();
            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.a('string');

            // Unpark without reset: the dead window re-misses on the next sweep
            expect(await matcher.unparkAssignment('a1')).to.equal(true);
            let swept = await matcher.processScheduledAssignments();
            expect(swept.missed).to.equal(1);
            expect(await redisClient.hGet(parkedKey, 'a1')).to.be.a('string');

            // Unpark with resetSchedule: stays queued for good
            expect(await matcher.unparkAssignment('a1', { resetSchedule: true })).to.equal(true);
            swept = await matcher.processScheduledAssignments();
            expect(swept.missed).to.equal(0);
            expect((await matcher.getAssignment('a1'))!._status).to.equal('queued');
        });
    });
});
