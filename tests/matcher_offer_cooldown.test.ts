import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent, MatchDecisionTrace } from '../src/types/matcher';

/**
 * Offer cooldown: an offer nobody answers should rest before the same worker is
 * asked again.
 *
 * Without it, a task whose only eligible worker never responds is re-offered to
 * that worker on the very next matching pass — forever — and every re-offer is
 * a fresh decision trace. The two pre-existing options were both wrong for that
 * shape: the default lets them win it straight back, and `onNoResponse: 'block'`
 * bars them permanently, which with a single candidate means the work is never
 * assigned at all.
 */
describe('Offer cooldown (offerCooldownMs)', function () {
    this.timeout(15000);
    let matcher: Matcher;
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];
    let clock: sinon.SinonFakeTimers;
    const prefix = 'offer_cooldown_test:';
    const cooldownKey = (userId: string) => `${prefix}user:${userId}:offer-cooldown`;

    before(async function () {
        redisClient = await createTestClient();
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 5,
            relevantBatchSize: 50,
            matchExpirationMs: 60000,
            offerCooldownMs: 5000,
            enableDecisionTraces: true,
            onAssignmentLifecycle: (event) => events.push(event),
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await matcher.redisClient.flushDb();
        events = [];
        clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
    });

    afterEach(function () {
        clock.restore();
    });

    after(async function () {
        matcher.stopMaintenance();
        await redisClient.quit();
    });

    describe('the matcher-wide default', function () {
        it('keeps the non-responder out until the cooldown elapses, then lets them back', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);

            // Deadline lapses: requeued, and u1 goes on cooldown.
            clock.tick(60_001);
            expect((await matcher.processResponseDeadlines()).expired).to.equal(1);

            // The very next pass must NOT hand it straight back.
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);

            // Still resting halfway through.
            clock.tick(2_500);
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);

            // Cooldown over: the work is theirs to take again.
            clock.tick(3_000);
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });

        it('records the cooldown as a zset scored by its end', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            const at = Date.now() + 60_001;
            clock.tick(60_001);
            await matcher.processResponseDeadlines();

            const score = await matcher.redisClient.zScore(cooldownKey('u1'), 'a1');
            expect(Number(score)).to.equal(at + 5000);
        });

        it('never bars a different eligible worker', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);

            clock.tick(60_001);
            await matcher.processResponseDeadlines();

            // u2 arrives while u1 is resting — the work must flow to them.
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u2')).to.deep.equal(['a1']);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);
        });
    });

    describe('per-assignment override', function () {
        it('escalation.offerCooldownMs overrides the matcher-wide value', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, offerCooldownMs: 30_000 },
            });
            await matcher.matchUsersAssignments();

            clock.tick(160);
            await matcher.processResponseDeadlines();

            // Past the 5s matcher-wide default, still inside the 30s override.
            clock.tick(10_000);
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.have.length(0);

            clock.tick(21_000);
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
        });

        it("a blocking policy outranks the cooldown and writes no cooldown entry", async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['t'],
                escalation: { respondWithinMs: 100, onNoResponse: 'block' },
            });
            await matcher.matchUsersAssignments();

            clock.tick(160);
            await matcher.processResponseDeadlines();

            // A block is the stronger statement; both would be redundant.
            expect(await matcher.redisClient.zScore(cooldownKey('u1'), 'a1')).to.equal(null);
            expect(Boolean(await matcher.redisClient.sIsMember(`${prefix}user:u1:rejected`, 'a1'))).to.equal(true);
        });
    });

    describe('exemptions', function () {
        it('assignToUser ignores the cooldown and clears it', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            clock.tick(60_001);
            await matcher.processResponseDeadlines();
            expect(await matcher.redisClient.zScore(cooldownKey('u1'), 'a1')).to.not.equal(null);

            // An operator override is a human decision; a rest period is not a
            // reason to refuse it.
            await matcher.assignToUser('a1', 'u1');
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['a1']);
            expect(await matcher.redisClient.zScore(cooldownKey('u1'), 'a1')).to.equal(null);
        });

        it('accepting clears the cooldown entry', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            clock.tick(60_001);
            await matcher.processResponseDeadlines();
            clock.tick(5_001);
            await matcher.matchUsersAssignments();

            await matcher.acceptAssignment('u1', 'a1');
            expect(await matcher.redisClient.zScore(cooldownKey('u1'), 'a1')).to.equal(null);
        });

        it('removeUser drops the cooldown key', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            clock.tick(60_001);
            await matcher.processResponseDeadlines();

            await matcher.removeUser('u1');
            expect(await matcher.redisClient.exists(cooldownKey('u1'))).to.equal(0);
        });
    });

    describe('observability', function () {
        it('explainMatch strikes the resting worker out with a reason and an end time', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            const at = Date.now() + 60_001;
            clock.tick(60_001);
            await matcher.processResponseDeadlines();

            const explained = await matcher.explainMatch('a1');
            const u1 = explained.candidates.find((c) => c.userId === 'u1');
            expect(u1?.eligible).to.equal(false);
            expect(u1?.reasons).to.deep.include({ kind: 'offerCooldown', until: at + 5000 });
        });

        it('a decision trace shows the resting worker struck out', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addUser({ id: 'u2', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();

            const owner = (await matcher.getCurrentAssignmentsForUser('u1')).length > 0 ? 'u1' : 'u2';
            const other = owner === 'u1' ? 'u2' : 'u1';

            clock.tick(60_001);
            await matcher.processResponseDeadlines();
            await matcher.matchUsersAssignments();

            const traces: MatchDecisionTrace[] = await matcher.getDecisionTraces({ assignmentId: 'a1', limit: 10 });
            const latest = traces[0];
            expect(latest.chosenUserId).to.equal(other);
            const rested = latest.candidates.find((c) => c.userId === owner);
            expect(rested?.eligible).to.equal(false);
            expect(rested?.reasons.some((r) => r.kind === 'offerCooldown')).to.equal(true);
        });
    });
});
