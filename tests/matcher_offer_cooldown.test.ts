import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLifecycleEvent, MatchDecisionTrace } from '../src/types/matcher';
import { workflow } from '../src/workflow-builder';

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

        it('a shorter cooldown written later never cuts a longer one short', async function () {
            // Two rests on one key: a long one, then a short one. A per-key TTL
            // set from the second write would expire the whole key — and with
            // it the first, still-running rest — the moment the short one was
            // due, ending a 10-minute cooldown after one.
            //
            // Asserted on the key's TTL rather than by waiting it out: Redis
            // expiry runs on the real clock, which the suite's fake timers do
            // not move, so time-travelling past it proves nothing.
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({
                id: 'long',
                tags: ['t'],
                escalation: { respondWithinMs: 100, offerCooldownMs: 600_000 },
            });
            await matcher.matchUsersAssignments();
            clock.tick(160);
            await matcher.processResponseDeadlines();

            await matcher.addAssignment({
                id: 'short',
                tags: ['t'],
                escalation: { respondWithinMs: 100, offerCooldownMs: 1_000 },
            });
            await matcher.matchUsersAssignments();
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal(['short']);
            clock.tick(160);
            await matcher.processResponseDeadlines();

            // Both rests are on the key, and nothing on it expires before the
            // longer one is served out. -1 is "no TTL", which is the contract:
            // the scores are the expiry, pruned on every read and write.
            expect(await matcher.redisClient.zScore(cooldownKey('u1'), 'long')).to.not.equal(null);
            expect(await matcher.redisClient.zScore(cooldownKey('u1'), 'short')).to.not.equal(null);
            const ttl = await matcher.redisClient.pTTL(cooldownKey('u1'));
            expect(ttl, 'a TTL from the short cooldown would strand the long one').to.satisfy(
                (v: number) => v === -1 || v >= 600_000,
            );
        });

        it('prunes elapsed rests instead of letting the key grow forever', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();
            clock.tick(60_001);
            await matcher.processResponseDeadlines();
            expect(await matcher.redisClient.zCard(cooldownKey('u1'))).to.equal(1);

            // Second unanswered offer, long after the first rest elapsed: the
            // stale entry goes rather than accumulating.
            clock.tick(5_001);
            await matcher.matchUsersAssignments();
            clock.tick(60_001);
            await matcher.processResponseDeadlines();
            expect(await matcher.redisClient.zCard(cooldownKey('u1'))).to.equal(1);
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

    describe('workflow-targeted work', function () {
        it('is re-granted to its target regardless of a cooldown', async function () {
            // Targeting names one person; a rest period that barred them would
            // deadlock the step, since nobody else can ever hold it. The
            // targeted lookup never touches tag discovery, so the cooldown —
            // which is written like any other — has nothing to bite on.
            const targeted = new Matcher(redisClient, {
                redisPrefix: `${prefix}wf:`,
                enableWorkflows: true,
                matchExpirationMs: 60_000,
                offerCooldownMs: 5_000,
            });
            await targeted.waitUntilReady();
            try {
                await targeted.addUser({ id: 'solo', tags: ['ops'] });
                await targeted.registerWorkflow(
                    workflow('direct', 'Direct handoff')
                        .step('do-it')
                        .name('Do it')
                        .assignment({ tags: ['ops'] })
                        .targetUser('solo')
                        .defaultNext(null)
                        .done()
                        .initialStep('do-it')
                        .build(),
                );
                const instance = await targeted.startWorkflow('direct', 'ines');
                await targeted.processWorkflowEvents(50);
                await targeted.matchUsersAssignments();
                const assignmentId = (await targeted.getWorkflowInstance(instance.id))!.currentAssignmentId!;
                expect(await targeted.getCurrentAssignmentsForUser('solo')).to.deep.equal([assignmentId]);

                clock.tick(60_001);
                await targeted.processResponseDeadlines();
                expect(await targeted.getCurrentAssignmentsForUser('solo')).to.have.length(0);

                // Still inside the 5s rest — an ordinary assignment would wait.
                await targeted.matchUsersAssignments();
                expect(await targeted.getCurrentAssignmentsForUser('solo')).to.deep.equal([assignmentId]);
            } finally {
                targeted.stopMaintenance();
            }
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
