import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent } from '../src/types/matcher';
import { extractMatchFeatures } from '../src/learning/features';

describe('SLA policies', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    let clock: sinon.SinonFakeTimers;
    const prefix = 'sla_test:';

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
        // SLA clocks are Date.now()-scored zsets: fake Date lets tests
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
    const acceptedExpiryKey = `${prefix}assignments:accepted:expiry`;
    const slaExpiryKey = `${prefix}assignments:sla:expiry`;
    const completedKey = `${prefix}assignments:completed`;
    const getCompleted = async (id: string) => {
        const json = await redisClient.hGet(completedKey, id);
        return json ? JSON.parse(json) : null;
    };

    describe('completeWithinMs (completion deadline)', function () {
        it('registers the deadline on accept and clears it on complete', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { completeWithinMs: 60000 } });
            await matcher.matchUsersAssignments();

            // No deadline registered while pending
            expect(await redisClient.zScore(acceptedExpiryKey, 'a1')).to.be.null;

            await matcher.acceptAssignment('u1', 'a1');
            expect(await redisClient.zScore(acceptedExpiryKey, 'a1')).to.not.be.null;

            await matcher.completeAssignment('u1', 'a1');
            expect(await redisClient.zScore(acceptedExpiryKey, 'a1')).to.be.null;
            expect(kinds('completionBreached')).to.have.length(0);
        });

        it('default action notify keeps the assignment with the worker', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { completeWithinMs: 100 } });
            await matcher.matchUsersAssignments();
            await matcher.acceptAssignment('u1', 'a1');

            clock.tick(150);
            const swept = await matcher.processCompletionDeadlines();
            expect(swept.breached).to.equal(1);

            const breachEvents = kinds('completionBreached');
            expect(breachEvents).to.have.length(1);
            expect(breachEvents[0]).to.include({
                kind: 'completionBreached',
                taskId: 'a1',
                workerId: 'u1',
                action: 'notify',
            });

            // Worker still holds the assignment; index entry is gone (fire-once)
            const held = await matcher.getAssignment('a1');
            expect(held?._status).to.equal('accepted');
            expect(await redisClient.zScore(acceptedExpiryKey, 'a1')).to.be.null;

            // A second sweep does not re-fire
            const again = await matcher.processCompletionDeadlines();
            expect(again.breached).to.equal(0);
            expect(kinds('completionBreached')).to.have.length(1);

            // Late completion still works
            await matcher.completeAssignment('u1', 'a1');
            expect(await getCompleted('a1')).to.exist;
        });

        it('action requeue takes the assignment back and blocks the breacher', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                sla: { completeWithinMs: 100, onCompletionBreach: 'requeue' },
            });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            clock.tick(150);
            const swept = await matcher.processCompletionDeadlines();
            expect(swept.breached).to.equal(1);

            const queued = await matcher.getAssignment('a1');
            expect(queued?._status).to.equal('queued');

            // The breacher is blocked: matching u1 again yields nothing
            await matcher.matchUsersAssignments('u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);

            // Another user can pick it up and gets a fresh completion clock
            await matcher.matchUsersAssignments('u2');
            expect(await matcher.getCurrentAssignmentsForUser('u2')).to.include('a1');
            await matcher.acceptAssignment('u2', 'a1');
            expect(await redisClient.zScore(acceptedExpiryKey, 'a1')).to.not.be.null;
        });

        it('action fail closes the assignment as failed in the completed store', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                sla: { completeWithinMs: 100, onCompletionBreach: 'fail' },
            });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            clock.tick(150);
            await matcher.processCompletionDeadlines();

            const done = await getCompleted('a1');
            expect(done).to.exist;
            expect(done._failureReason).to.equal('completion-sla-breach');
            expect(done._failedBy).to.equal('u1');
            expect(await matcher.getAssignment('a1')).to.be.null;
        });

        it('action park holds the assignment out of matching', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                sla: { completeWithinMs: 100, onCompletionBreach: 'park' },
            });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            clock.tick(150);
            await matcher.processCompletionDeadlines();

            const parked = await matcher.getParkedAssignments();
            expect(parked.map((a) => a.id)).to.include('a1');
            expect((await matcher.getAssignment('a1'))?._status).to.equal('parked');

            // Unpark returns it to the queue
            await matcher.unparkAssignment('a1');
            expect((await matcher.getAssignment('a1'))?._status).to.equal('queued');
        });

        it('does not touch accepted assignments without an SLA', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            const swept = await matcher.processCompletionDeadlines();
            expect(swept.breached).to.equal(0);
            expect((await matcher.getAssignment('a1'))?._status).to.equal('accepted');
        });
    });

    describe('terminal events carry the assignment', function () {
        // A dropped assignment is gone by the time the handler runs, so without
        // a snapshot on the event a host has no way to record what it lost.
        it('carries the dropped assignment on slaExpired', async function () {
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t', 'urgent'],
                priority: 42,
                meta: { customer: 'acme' },
                sla: { expireAfterMs: 100 },
            });

            clock.tick(150);
            await matcher.processSlaExpiries();

            expect(await matcher.getAssignment('a1'), 'dropped, so unreadable afterwards').to.be.null;
            const [event] = kinds('slaExpired') as any[];
            expect(event.assignment.id).to.equal('a1');
            expect(event.assignment.tags).to.deep.equal(['t', 'urgent']);
            expect(event.assignment.priority).to.equal(42);
            expect(event.assignment.meta).to.deep.equal({ customer: 'acme' });
        });

        it('carries the assignment on completionBreached', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                priority: 7,
                sla: { completeWithinMs: 100, onCompletionBreach: 'fail' },
            });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            clock.tick(150);
            await matcher.processCompletionDeadlines();

            const [event] = kinds('completionBreached') as any[];
            expect(event.assignment.id).to.equal('a1');
            expect(event.assignment.priority).to.equal(7);
        });

        it('carries the assignment on rejectionBudgetExhausted', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                priority: 3,
                sla: { maxRejections: 1, onMaxRejections: 'fail' },
            });
            await matcher.matchUsersAssignments('u1');
            await matcher.rejectAssignment('u1', 'a1');

            const [event] = kinds('rejectionBudgetExhausted') as any[];
            expect(event.assignment.id).to.equal('a1');
            expect(event.assignment.priority).to.equal(3);
        });
    });

    describe('expireAfterMs (freshness TTL)', function () {
        it('expires a queued assignment (drop by default)', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 100 } });
            expect(await redisClient.zScore(slaExpiryKey, 'a1')).to.not.be.null;

            clock.tick(150);
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(1);

            expect(await matcher.getAssignment('a1')).to.be.null;
            expect(await redisClient.zScore(slaExpiryKey, 'a1')).to.be.null;

            const expiredEvents = kinds('slaExpired');
            expect(expiredEvents).to.have.length(1);
            expect(expiredEvents[0]).to.include({ kind: 'slaExpired', taskId: 'a1', action: 'drop' });
        });

        it('expires a pending assignment and releases the owner', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 100 } });
            await matcher.matchUsersAssignments('u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.include('a1');

            clock.tick(150);
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(1);

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);
            expect(await matcher.getAssignment('a1')).to.be.null;
            // Owner metadata cleaned
            expect(await redisClient.hGet(`${prefix}assignments:pending:owner`, 'a1')).to.be.null;
        });

        it('expires an accepted assignment', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 150 } });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            clock.tick(200);
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(1);
            expect(await matcher.getAssignment('a1')).to.be.null;

            const expiredEvents = kinds('slaExpired');
            expect(expiredEvents[0]).to.include({ kind: 'slaExpired', taskId: 'a1', ownerId: 'u1', action: 'drop' });
        });

        it('onExpire park retains the assignment for inspection', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 100, onExpire: 'park' } });

            clock.tick(150);
            await matcher.processSlaExpiries();

            const parked = await matcher.getParkedAssignments();
            expect(parked.map((a) => a.id)).to.include('a1');
            expect(kinds('slaExpired')[0]).to.include({ action: 'park' });
        });

        it('TTL is not extended by rejection ping-pong', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 400 } });

            const firstScore = await redisClient.zScore(slaExpiryKey, 'a1');

            // Reject twice; each requeue must keep the original deadline
            await matcher.matchUsersAssignments('u1');
            await matcher.rejectAssignment('u1', 'a1');
            await matcher.matchUsersAssignments('u2');
            await matcher.rejectAssignment('u2', 'a1');

            const laterScore = await redisClient.zScore(slaExpiryKey, 'a1');
            expect(laterScore).to.equal(firstScore);

            // Tick past the original deadline: it expires even though it was
            // recently requeued.
            clock.tick(450);
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(1);
            expect(await matcher.getAssignment('a1')).to.be.null;
        });

        it('removeAssignment clears the TTL index', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 60000 } });
            await matcher.removeAssignment('a1');
            expect(await redisClient.zScore(slaExpiryKey, 'a1')).to.be.null;

            clock.tick(10);
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(0);
        });

        it('complete and fail clear the TTL index', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 60000 } });
            await matcher.addAssignment({ id: 'a2', tags: ['t'], sla: { expireAfterMs: 60000 } });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');
            await matcher.acceptAssignment('u1', 'a2');

            await matcher.completeAssignment('u1', 'a1');
            await matcher.failAssignment('u1', 'a2', 'nope');

            expect(await redisClient.zScore(slaExpiryKey, 'a1')).to.be.null;
            expect(await redisClient.zScore(slaExpiryKey, 'a2')).to.be.null;
        });

        it('unparked TTL-expired assignment re-expires unless resetSla is passed', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { expireAfterMs: 100, onExpire: 'park' } });
            clock.tick(150);
            await matcher.processSlaExpiries();
            expect((await matcher.getParkedAssignments()).map((a) => a.id)).to.include('a1');

            // Without reset: parked record still carries the old _enqueuedAt,
            // so re-queueing re-registers an already-elapsed TTL.
            await matcher.unparkAssignment('a1');
            const swept = await matcher.processSlaExpiries();
            expect(swept.expired).to.equal(1);
            expect((await matcher.getParkedAssignments()).map((a) => a.id)).to.include('a1');

            // With resetSla: fresh clock, assignment stays queued.
            await matcher.unparkAssignment('a1', { resetSla: true });
            const sweptAgain = await matcher.processSlaExpiries();
            expect(sweptAgain.expired).to.equal(0);
            expect((await matcher.getAssignment('a1'))?._status).to.equal('queued');
        });
    });

    describe('maxRejections (rejection budget)', function () {
        it('parks by default once the budget is exhausted', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { maxRejections: 2 } });

            await matcher.matchUsersAssignments('u1');
            await matcher.rejectAssignment('u1', 'a1');
            expect((await matcher.getAssignment('a1'))?._status).to.equal('queued');

            await matcher.matchUsersAssignments('u2');
            await matcher.rejectAssignment('u2', 'a1');

            // Second rejection exhausted the budget: parked, not requeued
            expect((await matcher.getAssignment('a1'))?._status).to.equal('parked');
            const exhaustedEvents = kinds('rejectionBudgetExhausted');
            expect(exhaustedEvents).to.have.length(1);
            expect(exhaustedEvents[0]).to.include({ taskId: 'a1', rejections: 2, action: 'park' });
        });

        it('onMaxRejections fail closes the assignment as failed', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { maxRejections: 1, onMaxRejections: 'fail' } });

            await matcher.matchUsersAssignments('u1');
            await matcher.rejectAssignment('u1', 'a1');

            const done = await getCompleted('a1');
            expect(done).to.exist;
            expect(done._failureReason).to.match(/^rejection-budget-exhausted/);
            expect(await matcher.getAssignment('a1')).to.be.null;
        });

        it('onMaxRejections keep requeues but keeps counting', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { maxRejections: 1, onMaxRejections: 'keep' } });

            await matcher.matchUsersAssignments('u1');
            await matcher.rejectAssignment('u1', 'a1');
            expect((await matcher.getAssignment('a1'))?._status).to.equal('queued');

            await matcher.matchUsersAssignments('u2');
            await matcher.rejectAssignment('u2', 'a1');
            const still = await matcher.getAssignment('a1');
            expect(still?._status).to.equal('queued');
            expect((still as any)._rejectionCount).to.equal(2);
            expect(kinds('rejectionBudgetExhausted')).to.have.length(0);
        });

        it('blocking no-response expiries count against the budget', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, onNoResponse: 'block' },
                sla: { maxRejections: 2 },
            });

            // u1 ignores it (blocking expiry = refusal #1)
            await matcher.matchUsersAssignments('u1');
            clock.tick(150);
            await matcher.processResponseDeadlines();
            expect((await matcher.getAssignment('a1'))?._status).to.equal('queued');

            // u2 ignores it (refusal #2 → budget exhausted → parked)
            await matcher.matchUsersAssignments('u2');
            expect(await matcher.getCurrentAssignmentsForUser('u2')).to.include('a1');
            clock.tick(150);
            await matcher.processResponseDeadlines();

            expect((await matcher.getAssignment('a1'))?._status).to.equal('parked');
            expect(kinds('rejectionBudgetExhausted')).to.have.length(1);
        });

        it('non-blocking expiries do not count against the budget', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, onNoResponse: 'allow' },
                sla: { maxRejections: 1 },
            });

            await matcher.matchUsersAssignments('u1');
            clock.tick(150);
            await matcher.processResponseDeadlines();

            // 'allow' expiry is not a refusal: still queued, no exhaustion
            const still = await matcher.getAssignment('a1');
            expect(still?._status).to.equal('queued');
            expect((still as any)._rejectionCount ?? 0).to.equal(0);
        });
    });

    describe('interaction with escalation ladders', function () {
        it('escalation tiers still advance for SLA-bearing assignments', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t', 'oncall-primary'] });
            await matcher.addUser({ id: 'u2', tags: ['t', 'oncall-secondary'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t', 'oncall-primary'],
                escalation: {
                    respondWithinMs: 100,
                    onNoResponse: 'block',
                    tiers: [['oncall-primary'], ['oncall-secondary']],
                },
                sla: { maxRejections: 5 },
            });

            await matcher.matchUsersAssignments('u1');
            clock.tick(150);
            const swept = await matcher.processResponseDeadlines();
            expect(swept.escalations).to.equal(1);

            const escalated = await matcher.getAssignment('a1');
            expect(escalated?.tags).to.include('oncall-secondary');
            expect((escalated as any)._rejectionCount).to.equal(1);

            // The secondary tier user can now win it
            await matcher.matchUsersAssignments('u2');
            expect(await matcher.getCurrentAssignmentsForUser('u2')).to.include('a1');
        });
    });

    describe('SLO stats (getSlaStats)', function () {
        it('counts offers, in-time accepts and accept latency', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { completeWithinMs: 60000 } });
            await matcher.matchUsersAssignments('u1');
            clock.tick(20);
            await matcher.acceptAssignment('u1', 'a1');

            const stats = await matcher.getSlaStats();
            expect(stats.offers).to.equal(1);
            expect(stats.acceptedInTime).to.equal(1);
            expect(stats.meanAcceptLatencyMs).to.be.greaterThan(0);

            const tagStats = await matcher.getSlaStats('t');
            expect(tagStats.offers).to.equal(1);
            expect(tagStats.acceptedInTime).to.equal(1);

            const otherTag = await matcher.getSlaStats('nope');
            expect(otherTag.offers).to.equal(0);
        });

        it('counts late accepts as not-in-time', async function () {
            const shortMatcher = new Matcher(redisClient, {
                redisPrefix: prefix,
                matchExpirationMs: 50,
            });
            await shortMatcher.waitUntilReady();

            await shortMatcher.addUser({ id: 'u1', tags: ['t'] });
            await shortMatcher.addAssignment({ id: 'a1', tags: ['t'], sla: { completeWithinMs: 60000 } });
            await shortMatcher.matchUsersAssignments('u1');
            clock.tick(80);
            await shortMatcher.acceptAssignment('u1', 'a1');

            const stats = await shortMatcher.getSlaStats();
            expect(stats.offers).to.equal(1);
            expect(stats.acceptedInTime).to.equal(0);
        });

        it('counts completion breaches, TTL expiries and rejection parks', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });

            // Completion breach
            await matcher.addAssignment({ id: 'cb', tags: ['t'], sla: { completeWithinMs: 80 } });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'cb');
            clock.tick(120);
            await matcher.processCompletionDeadlines();

            // TTL expiry
            await matcher.addAssignment({ id: 'ttl', tags: ['t'], sla: { expireAfterMs: 50 } });
            clock.tick(80);
            await matcher.processSlaExpiries();

            // Rejection park
            await matcher.addAssignment({ id: 'rj', tags: ['t'], sla: { maxRejections: 1 } });
            await matcher.matchUsersAssignments('u2');
            await matcher.rejectAssignment('u2', 'rj');

            const stats = await matcher.getSlaStats();
            expect(stats.completionBreaches).to.equal(1);
            expect(stats.ttlExpiries).to.equal(1);
            expect(stats.rejectionParked).to.equal(1);

            const tagStats = await matcher.getSlaStats('t');
            expect(tagStats.completionBreaches).to.equal(1);
            expect(tagStats.ttlExpiries).to.equal(1);
            expect(tagStats.rejectionParked).to.equal(1);
        });

        it('records mean completion latency from acceptedAt to completedAt', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], sla: { completeWithinMs: 60000 } });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');
            clock.tick(30);
            await matcher.completeAssignment('u1', 'a1');

            const stats = await matcher.getSlaStats();
            expect(stats.meanCompleteLatencyMs).to.be.at.least(20);
        });
    });

    describe('maintenance integration', function () {
        it('runMaintenanceOnce runs both SLA sweeps and reports counts', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'cb', tags: ['t'], sla: { completeWithinMs: 60 } });
            await matcher.addAssignment({ id: 'ttl', tags: ['t'], sla: { expireAfterMs: 60 } });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'cb');

            clock.tick(100);
            const report = await matcher.runMaintenanceOnce();
            expect(report.completionBreaches).to.equal(1);
            expect(report.slaExpiries).to.equal(1);
        });

        it('sweeps can be disabled individually', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'cb', tags: ['t'], sla: { completeWithinMs: 60 } });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'cb');
            // Added after matching so it stays queued
            await matcher.addAssignment({ id: 'ttl', tags: ['t'], sla: { expireAfterMs: 60 } });

            clock.tick(100);
            const report = await matcher.runMaintenanceOnce({ completionDeadlines: false, slaExpiries: false });
            expect(report.completionBreaches).to.equal(0);
            expect(report.slaExpiries).to.equal(0);
            // Nothing was swept
            expect((await matcher.getAssignment('cb'))?._status).to.equal('accepted');
            expect((await matcher.getAssignment('ttl'))?._status).to.equal('queued');
        });
    });

    describe('learning integration', function () {
        it('default extractor emits sla urgency features only for SLA assignments', function () {
            const user = { id: 'u', tags: ['t'] };
            const withSla = extractMatchFeatures(user, { id: 'a', tags: ['t'], sla: { completeWithinMs: 600000 } });
            expect(withSla['sla:hasDeadline']).to.equal(1);
            // 10 min vs 1h reference => tightness 1 - 1/6
            expect(withSla['sla:tightness']).to.be.closeTo(1 - 600000 / 3600000, 1e-9);

            const withoutSla = extractMatchFeatures(user, { id: 'a', tags: ['t'] });
            expect(withoutSla['sla:hasDeadline']).to.be.undefined;
            expect(withoutSla['sla:tightness']).to.be.undefined;
        });

        it('tightness respects a custom reference', function () {
            const user = { id: 'u', tags: ['t'] };
            const features = extractMatchFeatures(user, { id: 'a', tags: ['t'], sla: { completeWithinMs: 30000 } }, 60000);
            expect(features['sla:tightness']).to.be.closeTo(0.5, 1e-9);
        });

        it('breach outcomes feed tag stats and can trigger learned vetoes', async function () {
            const learningMatcher = new Matcher(redisClient, {
                redisPrefix: prefix,
                maxUserBacklogSize: 10,
                relevantBatchSize: 20,
                enableLearning: true,
                learningExplorationRate: 0,
                enableAutoRoutingWeights: true,
                autoRoutingWeights: { minSamples: 3, vetoThreshold: -0.2 },
                enableDefaultMatching: false,
            });
            await learningMatcher.waitUntilReady();

            await learningMatcher.addUser({ id: 'u1', tags: ['slowlane'] });

            // Repeatedly accept-then-breach: accept (+0.3) then completion
            // breach with action 'fail' (-0.8) drags the tag's mean reward
            // below the veto threshold.
            for (let i = 0; i < 5; i++) {
                await learningMatcher.addAssignment({
                    id: `b-${i}`,
                    tags: ['slowlane'],
                    priority: 10,
                    sla: { completeWithinMs: 50, onCompletionBreach: 'fail' },
                });
                await learningMatcher.matchUsersAssignments('u1');
                await learningMatcher.acceptAssignment('u1', `b-${i}`);
                clock.tick(80);
                await learningMatcher.processCompletionDeadlines();
            }

            const stats = await learningMatcher.getLearnedTagStats('u1');
            const slow = stats.find((s) => s.tag === 'slowlane');
            expect(slow).to.exist;
            expect(slow!.meanReward).to.be.lessThan(0);

            const weights = await learningMatcher.getLearnedRoutingWeights('u1');
            expect(weights.slowlane).to.equal(0);
        });
    });

    describe('backward compatibility', function () {
        it('stores non-SLA assignment JSON byte-identically', async function () {
            await matcher.addAssignment({ id: 'plain', tags: ['t'], priority: 5 });
            const raw = await redisClient.hGet(`${prefix}assignments:ref`, 'plain');
            const parsed = JSON.parse(raw);
            expect(parsed).to.deep.equal({ id: 'plain', tags: ['t'], priority: 5 });
        });

        it('full legacy lifecycle works with SLA fields absent', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');
            await matcher.completeAssignment('u1', 'a1');

            expect(await getCompleted('a1')).to.exist;
            const stats = await matcher.getSlaStats();
            // Legacy lifecycle records nothing in the SLO counters
            expect(stats.offers).to.equal(0);
            expect(stats.acceptedInTime).to.equal(0);
        });
    });
});
