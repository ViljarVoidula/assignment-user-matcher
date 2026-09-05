import { epsilonGreedySelect, greedySelect } from '../src/learning/policy';
import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';

function seededRng(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}

describe('Learning - explicit selection policy', function () {
    describe('epsilonGreedySelect (pure)', function () {
        const items = [
            { id: 'a', score: 10 },
            { id: 'b', score: 5 },
            { id: 'c', score: 1 },
        ];
        const scoreOf = (i: { score: number }) => i.score;

        it('logs the identity 1 - eps + eps/K for a unique leader', function () {
            const picked = epsilonGreedySelect(items, scoreOf, 1, { epsilon: 0.3, rng: () => 0.9 });
            expect(picked[0].item.id).to.equal('a');
            expect(picked[0].candidateCount).to.equal(3);
            expect(picked[0].propensity).to.be.closeTo(1 - 0.3 + 0.3 / 3, 1e-12);
        });

        it('logs eps/K for an explored non-leader', function () {
            // rng < eps takes the exploratory branch; the second draw indexes it.
            const picked = epsilonGreedySelect(items, scoreOf, 1, {
                epsilon: 0.5,
                rng: (() => {
                    const values = [0.1, 0.9];
                    let i = 0;
                    return () => values[i++];
                })(),
            });
            expect(picked[0].item.id).to.equal('c');
            expect(picked[0].explored).to.equal(true);
            expect(picked[0].propensity).to.be.closeTo(0.5 / 3, 1e-12);
        });

        it('matches configured probabilities over repeated seeded trials', function () {
            const rng = seededRng(20260905);
            const epsilon = 0.4;
            const counts: Record<string, number> = { a: 0, b: 0, c: 0 };
            const trials = 40000;
            for (let i = 0; i < trials; i++) {
                counts[epsilonGreedySelect(items, scoreOf, 1, { epsilon, rng })[0].item.id]++;
            }
            const K = items.length;
            expect(counts.a / trials).to.be.closeTo(1 - epsilon + epsilon / K, 0.01);
            expect(counts.b / trials).to.be.closeTo(epsilon / K, 0.01);
            expect(counts.c / trials).to.be.closeTo(epsilon / K, 0.01);
        });

        it('gives every admissible alternative non-zero support', function () {
            const rng = seededRng(7);
            const seen = new Set<string>();
            for (let i = 0; i < 500; i++)
                seen.add(epsilonGreedySelect(items, scoreOf, 1, { epsilon: 0.5, rng })[0].item.id);
            expect(seen.size).to.equal(3);
        });

        it('never selects outside the admissible set it was given', function () {
            const rng = seededRng(3);
            const admissible = items.slice(0, 2);
            for (let i = 0; i < 200; i++) {
                const picked = epsilonGreedySelect(admissible, scoreOf, 2, { epsilon: 0.9, rng });
                expect(picked.map((p) => p.item.id)).to.not.include('c');
            }
        });

        it('shares a tie rather than resolving it by list order', function () {
            const tied = [
                { id: 'a', score: 10 },
                { id: 'b', score: 10 },
            ];
            const rng = seededRng(11);
            const counts: Record<string, number> = { a: 0, b: 0 };
            for (let i = 0; i < 4000; i++) counts[greedySelect(tied, scoreOf, 1, rng)[0].item.id]++;
            expect(counts.a / 4000).to.be.closeTo(0.5, 0.05);
            // A tied leader's propensity is 1/G, not 1.
            expect(greedySelect(tied, scoreOf, 1, () => 0)[0].propensity).to.be.closeTo(0.5, 1e-12);
        });

        it('models k picks as k conditional choices over the shrinking set', function () {
            const picked = greedySelect(items, scoreOf, 3, () => 0);
            expect(picked.map((p) => p.item.id)).to.deep.equal(['a', 'b', 'c']);
            expect(picked.map((p) => p.candidateCount)).to.deep.equal([3, 2, 1]);
        });

        it('is reproducible for a given seed', function () {
            const run = () => {
                const rng = seededRng(99);
                return epsilonGreedySelect(items, scoreOf, 2, { epsilon: 0.5, rng }).map((p) => p.item.id);
            };
            expect(run()).to.deep.equal(run());
        });
    });

    describe('matcher integration', function () {
        this.timeout(20000);
        let redisClient: any;

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
                redisPrefix: 'test-policy:',
                enableLearning: true,
                ...options,
            });
        }

        it('logs a propensity on every committed decision under epsilon-greedy', async function () {
            const matcher = createMatcher({
                learningExplorationPolicy: 'epsilon-greedy',
                learningExplorationRate: 0.2,
                learningRng: seededRng(5),
            });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            for (let i = 0; i < 3; i++) await matcher.addAssignment({ id: `a${i}`, tags: ['english'], priority: 10 - i });
            await matcher.matchUsersAssignments('ada');

            for (let i = 0; i < 3; i++) {
                const decision = await matcher.getLearningDecision(`a${i}`);
                expect(decision, `a${i}`).to.not.equal(null);
                expect(decision!.policy).to.equal('epsilon-greedy');
                expect(decision!.propensity).to.be.a('number');
                expect(decision!.propensity!).to.be.greaterThan(0);
                expect(decision!.propensity!).to.be.at.most(1);
                expect(decision!.candidateCount).to.be.greaterThan(0);
            }
        });

        it('respects backlog limits while exploring', async function () {
            const matcher = createMatcher({
                maxUserBacklogSize: 2,
                learningExplorationPolicy: 'epsilon-greedy',
                learningExplorationRate: 0.9,
                learningRng: seededRng(17),
            });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            for (let i = 0; i < 8; i++) await matcher.addAssignment({ id: `a${i}`, tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            expect(await matcher.getCurrentAssignmentsForUser('ada')).to.have.length(2);
        });

        it('never explores in shadow mode', async function () {
            const matcher = createMatcher({
                learningShadowMode: true,
                learningExplorationPolicy: 'epsilon-greedy',
                learningExplorationRate: 1,
                learningRng: seededRng(23),
            });
            await redisClient.hSet('test-policy:learning:model', 'tag:english', '50');
            await matcher.addUser({ id: 'ada', tags: ['english', 'french'] });
            await matcher.addAssignment({ id: 'top', tags: ['english'], priority: 100 });
            await matcher.addAssignment({ id: 'low', tags: ['french'], priority: 1 });
            await matcher.matchUsersAssignments('ada');

            // Shadow mode must not reorder, and must not explore: strict
            // priority order decides, so the decision records the greedy pick.
            const decision = await matcher.getLearningDecision('top');
            expect(decision).to.not.equal(null);
            expect(decision!.policy).to.equal('epsilon-greedy');
            expect(decision!.propensity).to.equal(undefined);
        });

        it("keeps the legacy 'jitter' behaviour by default", async function () {
            const matcher = createMatcher({ learningExplorationRate: 0 });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            const decision = await matcher.getLearningDecision('a1');
            expect(decision!.policy).to.equal('jitter');
            expect(decision!.propensity).to.equal(undefined);
        });
    });
});
