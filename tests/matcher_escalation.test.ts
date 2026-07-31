import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent } from '../src/types/matcher';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Escalation policies (response deadlines)', function () {
    this.timeout(15000);
    let matcher: Matcher;
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    let clock: sinon.SinonFakeTimers;
    const prefix = 'escalation_test:';

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 5,
            relevantBatchSize: 50,
            matchExpirationMs: 60000,
            onAssignmentLifecycle: (event) => events.push(event),
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
        events = [];
        // Deadlines are Date.now()-scored zsets: faking Date lets tests
        // fast-forward past them instead of sleeping in real time. Timers
        // stay real so Redis I/O and the maintenance interval are unaffected.
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

    describe('per-assignment response deadline', function () {
        it('overrides the matcher-wide matchExpirationMs', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], escalation: { respondWithinMs: 120 } });
            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(1);

            // Would still be pending under the 60s global default.
            clock.tick(200);
            const swept = await matcher.processResponseDeadlines();
            expect(swept.expired).to.equal(1);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);
        });

        it('leaves assignments without a policy on the global deadline', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            clock.tick(200);
            const swept = await matcher.processResponseDeadlines();
            expect(swept.expired).to.equal(0);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(1);
        });
    });

    describe("onNoResponse: 'block'", function () {
        it('stops the non-responder winning the assignment straight back', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, onNoResponse: 'block' },
            });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(1);

            clock.tick(160);
            await matcher.processResponseDeadlines();

            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);
            expect(Boolean(await matcher.redisClient.sIsMember(`${prefix}user:u1:rejected`, 'a1'))).to.equal(true);
        });

        it("leaves it winnable again under the default 'allow'", async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], escalation: { respondWithinMs: 100 } });
            await matcher.matchUsersAssignments();

            clock.tick(160);
            await matcher.processResponseDeadlines();
            await matcher.matchUsersAssignments();

            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(1);
        });
    });

    describe('tier ladder', function () {
        const ladderAssignment = {
            id: 'incident-1',
            tags: ['sev:1', 'oncall-primary'],
            priority: 1000,
            escalation: {
                respondWithinMs: 100,
                onNoResponse: 'block' as const,
                priorityBoost: 500,
                tiers: [['oncall-primary'], ['oncall-secondary'], ['oncall-manager']],
            },
        };

        beforeEach(async function () {
            await matcher.addUser({ id: 'primary', tags: ['sev:1', 'oncall-primary'] });
            await matcher.addUser({ id: 'secondary', tags: ['sev:1', 'oncall-secondary'] });
            await matcher.addUser({ id: 'manager', tags: ['sev:1', 'oncall-manager'] });
        });

        it('climbs primary → secondary → manager without any workflow', async function () {
            await matcher.addAssignment({ ...ladderAssignment });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('primary')).to.deep.equal(['incident-1']);

            clock.tick(160);
            const first = await matcher.processResponseDeadlines();
            expect(first.escalations).to.equal(1);
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('secondary')).to.deep.equal(['incident-1']);
            expect(await matcher.getEscalationLevel('incident-1')).to.equal(1);

            clock.tick(160);
            await matcher.processResponseDeadlines();
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('manager')).to.deep.equal(['incident-1']);
            expect(await matcher.getEscalationLevel('incident-1')).to.equal(2);
        });

        it('boosts priority on each hop and emits an escalated event', async function () {
            await matcher.addAssignment({ ...ladderAssignment });
            await matcher.matchUsersAssignments();
            clock.tick(160);
            await matcher.processResponseDeadlines();

            const escalated = kinds('escalated');
            expect(escalated).to.have.length(1);
            expect(escalated[0]).to.include({ taskId: 'incident-1', level: 1, reason: 'no-response' });
            expect((escalated[0] as any).fromWorkerId).to.equal('primary');
            expect((escalated[0] as any).blockedPreviousOwner).to.equal(true);

            const assignment = await matcher.getAssignment('incident-1');
            expect(assignment!.priority).to.equal(1500);
        });

        it('preserves the wait clock across escalations', async function () {
            await matcher.addAssignment({ ...ladderAssignment });
            clock.tick(120);
            const before = (await matcher.getQueueStats()).oldestWaitingMs!;

            await matcher.matchUsersAssignments();
            clock.tick(160);
            await matcher.processResponseDeadlines();

            const after = (await matcher.getQueueStats()).oldestWaitingMs!;
            // The clock measures the incident, not the tier: it must have kept
            // running rather than restarted at the escalation.
            expect(after).to.be.greaterThan(before);
        });

        it('emits escalationExhausted and requeues by default at the top of the ladder', async function () {
            await matcher.addAssignment({ ...ladderAssignment });

            for (let hop = 0; hop < 4; hop++) {
                await matcher.matchUsersAssignments();
                clock.tick(160);
                await matcher.processResponseDeadlines();
            }

            const exhausted = kinds('escalationExhausted');
            expect(exhausted.length).to.be.greaterThan(0);
            expect((exhausted[0] as any).level).to.equal(2);
            expect((exhausted[0] as any).parked).to.equal(false);
            expect((await matcher.getAssignment('incident-1'))!._status).to.equal('queued');
        });
    });

    describe("onExhausted: 'park'", function () {
        it('holds the assignment out of matching once nobody answered', async function () {
            await matcher.addUser({ id: 'primary', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: {
                    respondWithinMs: 100,
                    onNoResponse: 'block',
                    maxEscalations: 0,
                    onExhausted: 'park',
                },
            });

            await matcher.matchUsersAssignments();
            clock.tick(160);
            const swept = await matcher.processResponseDeadlines();
            expect(swept.parked).to.equal(1);

            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('primary')).to.have.length(0);

            const parked = await matcher.getParkedAssignments();
            expect(parked.map((a) => a.id)).to.deep.equal(['a1']);

            // A parked assignment must never read as "not found" — that would
            // look like data loss to anything polling for it.
            const found = await matcher.getAssignment('a1');
            expect(found!._status).to.equal('parked');
            expect((await matcher.getAssignmentCounts()).parked).to.equal(1);
        });

        it('unparks back into the queue, optionally resetting the ladder', async function () {
            await matcher.addUser({ id: 'primary', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, maxEscalations: 0, onExhausted: 'park' },
            });
            await matcher.matchUsersAssignments();
            clock.tick(160);
            await matcher.processResponseDeadlines();

            expect(await matcher.unparkAssignment('a1', { resetEscalation: true })).to.equal(true);
            expect(await matcher.unparkAssignment('nope')).to.equal(false);
            expect(await matcher.getEscalationLevel('a1')).to.equal(0);
            expect((await matcher.getAssignment('a1'))!._status).to.equal('queued');
        });
    });

    describe('maintenance loop', function () {
        it('fires response deadlines without the host scheduling anything itself', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, onNoResponse: 'block' },
            });
            await matcher.matchUsersAssignments();

            // Past the deadline on the fake clock; the real maintenance
            // interval just needs to fire once to sweep it.
            clock.tick(160);
            matcher.startMaintenance({ intervalMs: 20 });
            expect(matcher.isMaintenanceRunning()).to.equal(true);

            const deadline = Date.now() + 5000;
            while (Date.now() < deadline) {
                if ((await matcher.getCurrentAssignmentsForUser('u1')).length === 0) break;
                await sleep(10);
            }
            matcher.stopMaintenance();

            expect(matcher.isMaintenanceRunning()).to.equal(false);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);
        });

        it('reports what each pass did', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, tiers: [['t'], ['t2']] },
            });
            await matcher.matchUsersAssignments();
            clock.tick(160);

            const report = await matcher.runMaintenanceOnce();
            expect(report.expiredMatches).to.equal(1);
            expect(report.escalations).to.equal(1);
            expect(report.parked).to.equal(0);
            expect(report.tookMs).to.be.a('number');
        });

        it('can disable individual sweeps', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], escalation: { respondWithinMs: 100 } });
            await matcher.matchUsersAssignments();
            clock.tick(160);

            const report = await matcher.runMaintenanceOnce({ responseDeadlines: false });
            expect(report.expiredMatches).to.equal(0);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(1);
        });
    });

    describe('backwards compatibility', function () {
        it('processExpiredMatches still returns the expired count', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'], escalation: { respondWithinMs: 100 } });
            await matcher.matchUsersAssignments();
            clock.tick(160);

            expect(await matcher.processExpiredMatches()).to.equal(1);
        });

        it('emits the expired event before the escalated one', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, onNoResponse: 'block' },
            });
            await matcher.matchUsersAssignments();
            clock.tick(160);
            await matcher.processResponseDeadlines();

            const order = events.map((e) => e.kind);
            expect(order.indexOf('expired')).to.be.lessThan(order.indexOf('escalated'));
        });
    });
});
