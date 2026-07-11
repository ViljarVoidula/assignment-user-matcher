import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Fair Tiebreaker (enableFairTiebreaker)', function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;
    const prefix = 'fair_test:';

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();

        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            redisPrefix: prefix,
            enableFairTiebreaker: true,
        });
    });

    beforeEach(async function () {
        await matcher.redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    it('defaults to disabled and is toggleable at runtime', async function () {
        const fresh = new Matcher(redisClient, { redisPrefix: 'fair_default_test:' });
        expect(fresh.isFairTiebreakerEnabled()).to.equal(false);
        fresh.setFairTiebreaker(true);
        expect(fresh.isFairTiebreakerEnabled()).to.equal(true);
    });

    it('gives a contested assignment to the higher-scoring eligible candidate, not whoever claims first', async function () {
        // Weak candidate: a plain positive weight far below the strong candidate's.
        await matcher.addUser({
            id: 'weak-candidate',
            tags: ['plumbing'],
            routingWeights: { plumbing: 10 },
        });
        // Strong candidate: dramatically higher weight on the same tag.
        await matcher.addUser({
            id: 'strong-candidate',
            tags: ['plumbing'],
            routingWeights: { plumbing: 200 },
        });

        await matcher.addAssignment({ id: 'job-1', tags: ['plumbing'], priority: 100 });

        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('strong-candidate')).to.include('job-1');
        expect(await matcher.getCurrentAssignmentsForUser('weak-candidate')).to.not.include('job-1');
    });

    it('is consistent across repeated fresh runs (not a coin-flip that happens to pass once)', async function () {
        for (let i = 0; i < 8; i++) {
            await matcher.redisClient.flushAll();
            await matcher.addUser({ id: 'weak', tags: ['drains'], routingWeights: { drains: 15 } });
            await matcher.addUser({ id: 'strong', tags: ['drains'], routingWeights: { drains: 180 } });
            await matcher.addAssignment({ id: 'job-race', tags: ['drains'], priority: 100 });

            await matcher.matchUsersAssignments();

            expect(
                await matcher.getCurrentAssignmentsForUser('strong'),
                `iteration ${i}: strong candidate should win`,
            ).to.include('job-race');
        }
    });

    it('routes each of several contested assignments to whichever eligible user scores best for it specifically', async function () {
        // gp-specialist should win the gp job; cardio-specialist should win the cardio job,
        // even though both users are broadly eligible for both jobs via a shared weak tag.
        await matcher.addUser({
            id: 'gp-specialist',
            tags: ['gp', 'general'],
            routingWeights: { gp: 150, general: 20 },
        });
        await matcher.addUser({
            id: 'cardio-specialist',
            tags: ['cardiology', 'general'],
            routingWeights: { cardiology: 150, general: 20 },
        });

        await matcher.addAssignment({ id: 'gp-job', tags: ['gp', 'general'], priority: 100 });
        await matcher.addAssignment({ id: 'cardio-job', tags: ['cardiology', 'general'], priority: 100 });

        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('gp-specialist')).to.include('gp-job');
        expect(await matcher.getCurrentAssignmentsForUser('cardio-specialist')).to.include('cardio-job');
    });

    it('never double-assigns a contested assignment to two users', async function () {
        for (let i = 0; i < 5; i++) {
            await matcher.redisClient.flushAll();
            await matcher.addUser({ id: 'a', tags: ['support'], routingWeights: { support: 90 } });
            await matcher.addUser({ id: 'b', tags: ['support'], routingWeights: { support: 89 } });
            await matcher.addUser({ id: 'c', tags: ['support'], routingWeights: { support: 88 } });
            await matcher.addAssignment({ id: 'ticket-1', tags: ['support'], priority: 100 });

            await matcher.matchUsersAssignments();

            const [aHas, bHas, cHas] = await Promise.all([
                matcher.getCurrentAssignmentsForUser('a'),
                matcher.getCurrentAssignmentsForUser('b'),
                matcher.getCurrentAssignmentsForUser('c'),
            ]);
            const winners = [aHas, bHas, cHas].filter((list) => list.includes('ticket-1'));
            expect(winners.length, `iteration ${i}: exactly one winner`).to.equal(1);
        }
    });

    it('respects maxUserBacklogSize under global sorting (a top-scorer does not exceed their cap)', async function () {
        const capped = new Matcher(redisClient, {
            redisPrefix: 'fair_cap_test:',
            maxUserBacklogSize: 2,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
        });
        await capped.redisClient.flushAll();

        await capped.addUser({ id: 'best', tags: ['support'], routingWeights: { support: 100 } });
        await capped.addUser({ id: 'ok', tags: ['support'], routingWeights: { support: 50 } });

        for (let i = 1; i <= 4; i++) {
            await capped.addAssignment({ id: `t${i}`, tags: ['support'], priority: 100 + i });
        }

        await capped.matchUsersAssignments();

        const bestAssignments = await capped.getCurrentAssignmentsForUser('best');
        const okAssignments = await capped.getCurrentAssignmentsForUser('ok');

        expect(bestAssignments.length).to.equal(2);
        expect(okAssignments.length).to.equal(2);
    });

    it('still delivers workflow-targeted assignments (not contested across users)', async function () {
        const wf = new Matcher(redisClient, {
            redisPrefix: 'fair_wf_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableWorkflows: true,
            enableFairTiebreaker: true,
        });
        await wf.redisClient.flushAll();

        await wf.addUser({ id: 'user1', tags: ['support'] });
        await wf.addAssignment({
            id: 'wf-assignment',
            tags: ['workflow-only'],
            priority: 100,
            _targetUserId: 'user1',
            _workflowInstanceId: 'wf-instance-1',
        });

        await wf.matchUsersAssignments();

        expect(await wf.getCurrentAssignmentsForUser('user1')).to.include('wf-assignment');
        await wf.stopOrchestrator();
    });
});
