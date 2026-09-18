import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { MatchDecisionTrace } from '../src/types/matcher';

/**
 * The reported defect: a task whose only eligible worker never answers is
 * re-offered to that worker on every pass, forever, and each re-offer is an
 * "Offered to …" row in the task's activity feed.
 *
 * Two guards live here. The first is that the library's *default* is unchanged
 * — the loop is the documented legacy behaviour and consumers of the published
 * package must keep getting it until they ask for something else. The second is
 * that a bounded, tier-less escalation ladder ends the loop, which is the
 * recipe the product now ships as its default.
 */
describe('Unanswered offer loop', function () {
    this.timeout(20000);
    let redisClient: any;
    let clock: sinon.SinonFakeTimers;

    before(async function () {
        redisClient = await createTestClient();
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
        clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
    });

    afterEach(function () {
        clock.restore();
    });

    after(async function () {
        await redisClient.quit();
    });

    /** Offer, let the deadline lapse, sweep, re-match — `rounds` times. */
    async function churn(matcher: Matcher, rounds: number, deadlineMs: number) {
        for (let i = 0; i < rounds; i++) {
            clock.tick(deadlineMs + 1);
            await matcher.processResponseDeadlines();
            await matcher.matchUsersAssignments();
        }
    }

    it('still recirculates to the same worker when no cooldown is configured', async function () {
        // Backward compatibility: offerCooldownMs defaults to 0, and README
        // documents that the same user may win it straight back.
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'loop_default_test:',
            matchExpirationMs: 1000,
        });
        await matcher.waitUntilReady();

        await matcher.addUser({ id: 'solo', tags: ['t'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t'] });
        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('solo')).to.deep.equal(['a1']);

        await churn(matcher, 3, 1000);
        expect(await matcher.getCurrentAssignmentsForUser('solo')).to.deep.equal(['a1']);

        matcher.stopMaintenance();
    });

    it('a tier-less maxEscalations ladder parks the task and stops producing traces', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'loop_bounded_test:',
            matchExpirationMs: 60_000,
            enableDecisionTraces: true,
        });
        await matcher.waitUntilReady();

        await matcher.addUser({ id: 'solo', tags: ['t'] });
        await matcher.addAssignment({
            id: 'a1',
            tags: ['t'],
            // No tiers: there is nobody else to climb to. The ladder exists
            // purely to give up after three unanswered offers.
            escalation: { respondWithinMs: 1000, maxEscalations: 3, onExhausted: 'park' },
        });

        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('solo')).to.deep.equal(['a1']);

        // Three unanswered offers climb the ladder; the fourth exhausts it.
        await churn(matcher, 10, 1000);

        expect(await matcher.getCurrentAssignmentsForUser('solo')).to.have.length(0);
        const parked = await matcher.getParkedAssignments();
        expect(parked.map((p: any) => p.id)).to.deep.equal(['a1']);

        // The whole point: a bounded number of "Offered to …" rows.
        const traces: MatchDecisionTrace[] = await matcher.getDecisionTraces({ assignmentId: 'a1', limit: 100 });
        expect(traces).to.have.length(4);

        matcher.stopMaintenance();
    });

    it('cooldown plus a bounded ladder is what the product ships', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'loop_shipped_test:',
            matchExpirationMs: 60_000,
            enableDecisionTraces: true,
        });
        await matcher.waitUntilReady();

        await matcher.addUser({ id: 'solo', tags: ['t'] });
        await matcher.addAssignment({
            id: 'a1',
            tags: ['t'],
            escalation: {
                respondWithinMs: 60_000,
                offerCooldownMs: 60_000,
                maxEscalations: 3,
                onExhausted: 'park',
            },
        });

        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('solo')).to.deep.equal(['a1']);

        // Each round is one unanswered offer plus its rest period.
        for (let i = 0; i < 10; i++) {
            clock.tick(60_001);
            await matcher.processResponseDeadlines();
            await matcher.matchUsersAssignments(); // resting — no grant
            clock.tick(60_001);
            await matcher.matchUsersAssignments();
        }

        const parked = await matcher.getParkedAssignments();
        expect(parked.map((p: any) => p.id)).to.deep.equal(['a1']);
        const traces: MatchDecisionTrace[] = await matcher.getDecisionTraces({ assignmentId: 'a1', limit: 100 });
        expect(traces).to.have.length(4);

        matcher.stopMaintenance();
    });
});
