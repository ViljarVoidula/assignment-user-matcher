import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';

/**
 * Phase 1: a learning decision must exist for exactly the worker who
 * actually received the assignment, and every outcome event must apply once.
 */
describe('Learning - decision attribution and idempotent ingestion', function () {
    this.timeout(30000);
    let redisClient: any;
    const PREFIX = 'test-attr:';

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();
        await redisClient.flushDb();
    });

    afterEach(async function () {
        await redisClient.flushDb();
    });

    after(async function () {
        await redisClient.quit();
    });

    function createMatcher(options: Record<string, any> = {}) {
        return new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 50,
            redisPrefix: PREFIX,
            enableLearning: true,
            learningExplorationRate: 0,
            ...options,
        });
    }

    /** Every decision key currently in Redis, with its parsed record. */
    async function liveDecisions(): Promise<any[]> {
        const keys: string[] = [];
        for await (const key of redisClient.scanIterator({ MATCH: `${PREFIX}learning:decision:*`, COUNT: 500 })) {
            const list = Array.isArray(key) ? key : [key];
            for (const k of list) if (!String(k).includes(':current:')) keys.push(String(k));
        }
        const out: any[] = [];
        for (const key of keys) {
            const json = await redisClient.get(key);
            if (json) out.push(JSON.parse(json));
        }
        return out;
    }

    describe('one decision per committed attempt', function () {
        it('records a decision only for the worker who won the contested assignment', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addUser({ id: 'bo', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await matcher.matchUsersAssignments();

            const decisions = await liveDecisions();
            expect(decisions).to.have.length(1);

            const owner = await redisClient.hGet(`${PREFIX}assignments:pending:owner`, 'a1');
            expect(decisions[0].userId).to.equal(owner);
            expect(decisions[0].assignmentId).to.equal('a1');

            const stats = await matcher.getLearningStats();
            expect(stats.decisions).to.equal(1);
        });

        it('records one decision per assignment under fair arbitration too', async function () {
            const matcher = createMatcher({ fairness: 'best-match' });
            await matcher.addUser({ id: 'ada', tags: ['english'], routingWeights: { english: 90 } });
            await matcher.addUser({ id: 'bo', tags: ['english'], routingWeights: { english: 10 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await matcher.matchUsersAssignments();

            const decisions = await liveDecisions();
            expect(decisions).to.have.length(1);
            const owner = await redisClient.hGet(`${PREFIX}assignments:pending:owner`, 'a1');
            expect(decisions[0].userId).to.equal(owner);
        });

        it('records one decision per assignment across two matcher instances sharing Redis', async function () {
            const a = createMatcher();
            const b = createMatcher();
            await a.addUser({ id: 'ada', tags: ['english'] });
            await a.addUser({ id: 'bo', tags: ['english'] });
            await a.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await Promise.all([a.matchUsersAssignments(), b.matchUsersAssignments()]);

            const decisions = await liveDecisions();
            expect(decisions).to.have.length(1);
            const owner = await redisClient.hGet(`${PREFIX}assignments:pending:owner`, 'a1');
            expect(decisions[0].userId).to.equal(owner);
        });

        it('records nothing for candidates evaluated by a read-only preview', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await matcher.explainMatch('a1');

            expect(await liveDecisions()).to.have.length(0);
            expect((await matcher.getLearningStats()).decisions).to.equal(0);
        });

        it('records a decision for every assignment a worker actually wins', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            for (let i = 0; i < 4; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['english'], priority: 10 - i });
            }
            await matcher.matchUsersAssignments('ada');

            const decisions = await liveDecisions();
            expect(decisions).to.have.length(4);
            expect(decisions.every((d) => d.userId === 'ada')).to.equal(true);
        });
    });

    describe('attempts are independent across reassignment', function () {
        it('opens a new attempt after a rejection and does not reuse the first', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addUser({ id: 'bo', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await matcher.matchUsersAssignments('ada');
            const first = await matcher.getLearningDecision('a1');
            expect(first?.userId).to.equal('ada');

            await matcher.rejectAssignment('ada', 'a1');
            await matcher.matchUsersAssignments('bo');

            const second = await matcher.getLearningDecision('a1');
            expect(second?.userId).to.equal('bo');
            expect(second?.decisionId).to.not.equal(first?.decisionId);
        });

        it('rejects assignment-addressed feedback while two attempts are resolvable', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addUser({ id: 'bo', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await matcher.matchUsersAssignments('ada');
            const first = await matcher.getLearningDecision('a1');
            await matcher.rejectAssignment('ada', 'a1');
            await matcher.matchUsersAssignments('bo');

            // Ambiguous: an archived attempt (ada) and a live one (bo).
            expect(await matcher.recordLearningFeedback('a1', { quality: 0.9 })).to.equal(false);
            expect((await matcher.getLearningStats()).ambiguousFeedback).to.equal(1);

            // Naming the attempt resolves it, and it lands on ada's episode.
            expect(
                await matcher.recordLearningFeedback('a1', { quality: 0.9 }, { decisionId: first!.decisionId }),
            ).to.equal(true);
        });

        it('refuses an outcome whose attempt belongs to a different worker', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            const applied = await matcher.recordLearningReward('a1', 1, { expectedUserId: 'bo' });
            expect(applied).to.equal(false);
            expect((await matcher.getLearningStats()).orphanEvents).to.be.greaterThan(0);
        });
    });

    describe('idempotent event ingestion', function () {
        it('applies a redelivered lifecycle outcome exactly once', async function () {
            const matcher = createMatcher({ enableAutoRoutingWeights: true });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            const first = await (matcher as any).learning.applyOutcome('a1', 'accept');
            const replay = await (matcher as any).learning.applyOutcome('a1', 'accept');
            expect(first).to.equal(true);
            expect(replay).to.equal(false);

            const stats = await matcher.getLearningStats();
            expect(stats.rewards).to.equal(1);
            expect(stats.duplicateEvents).to.equal(1);

            const tagStats = await matcher.getLearnedTagStats('ada');
            expect(tagStats.find((t) => t.tag === 'english')!.count).to.equal(1);
        });

        it('deduplicates concurrent deliveries of the same event', async function () {
            const matcher = createMatcher({ enableAutoRoutingWeights: true });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            const results = await Promise.all(
                Array.from({ length: 8 }, () => matcher.recordLearningReward('a1', 1, { eventId: 'evt-1' })),
            );
            expect(results.filter(Boolean)).to.have.length(1);
            expect((await matcher.getLearningStats()).rewards).to.equal(1);
        });

        it('keeps distinct lifecycle outcomes on one attempt distinct', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            await matcher.acceptAssignment('ada', 'a1');
            await matcher.completeAssignment('ada', 'a1');

            // accept + complete, not one collapsed event and not three.
            expect((await matcher.getLearningStats()).rewards).to.equal(2);
        });
    });

    describe('lifecycle coverage', function () {
        const cases: Array<[string, (m: any) => Promise<void>]> = [
            [
                'accept then complete',
                async (m) => {
                    await m.acceptAssignment('ada', 'a1');
                    await m.completeAssignment('ada', 'a1');
                },
            ],
            ['reject', async (m) => void (await m.rejectAssignment('ada', 'a1'))],
            [
                'accept then fail',
                async (m) => {
                    await m.acceptAssignment('ada', 'a1');
                    await m.failAssignment('ada', 'a1', 'nope');
                },
            ],
        ];

        for (const [name, act] of cases) {
            it(`archives an episode after ${name}`, async function () {
                const matcher = createMatcher();
                await matcher.addUser({ id: 'ada', tags: ['english'] });
                await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
                await matcher.matchUsersAssignments('ada');
                await act(matcher);

                expect(await matcher.getLearningDecision('a1')).to.equal(null);
                const episode = await matcher.getLearningEpisode('a1');
                expect(episode?.userId).to.equal('ada');
            });
        }

        it('applies a no-response expiry to the attempt that was offered', async function () {
            const matcher = createMatcher({ matchExpirationMs: 1 });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            await new Promise((r) => setTimeout(r, 20));
            await matcher.processExpiredMatches();

            const episode = await matcher.getLearningEpisode('a1');
            expect(episode?.userId).to.equal('ada');
            expect(episode?.outcome).to.equal('expire');
        });
    });

    describe('staleness and generation boundaries', function () {
        it('rejects feedback older than the configured lateness window', async function () {
            const matcher = createMatcher({ learningMaxFeedbackAgeMs: 5 });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            await new Promise((r) => setTimeout(r, 30));
            expect(await matcher.recordLearningReward('a1', 1)).to.equal(false);
            expect((await matcher.getLearningStats()).staleEvents).to.be.greaterThan(0);
        });

        it('does not let an outstanding attempt repopulate a reset model', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            await matcher.resetLearningModel();
            expect(await matcher.recordLearningReward('a1', 1)).to.equal(false);

            const stats = await matcher.getLearningStats();
            expect(stats.supersededEvents).to.equal(1);
            expect(stats.generation).to.equal(1);
            expect(await matcher.getLearningModel()).to.deep.equal({});
        });
    });

    describe('operator overrides stay out of the learning layer', function () {
        it('records no decision for a manual assignToUser', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

            await matcher.assignToUser('a1', 'ada');

            expect(await liveDecisions()).to.have.length(0);
            expect((await matcher.getLearningStats()).decisions).to.equal(0);
        });
    });
});
