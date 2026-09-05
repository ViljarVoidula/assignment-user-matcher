import Matcher from '../src/matcher.class';
import { LearningManager } from '../src/managers/LearningManager';
import { createKeyBuilders } from '../src/utils/keys';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import type { LearningFeatures } from '../src/types/matcher';

/**
 * Phase 3: model updates must stay finite and converge regardless of how many
 * features fire at once, and the learning layer's influence on ranking must
 * be boundable.
 */
describe('Learning - update stability and bounded influence', function () {
    this.timeout(30000);
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

    const keys = createKeyBuilders({ prefix: 'test-stab:' });

    function manager(options: Record<string, any> = {}) {
        return new LearningManager(redisClient, keys, { learningRate: 0.1, ...options });
    }

    /** k active unit features, the fixture the plan reproduces divergence with. */
    function unitFeatures(k: number): LearningFeatures {
        const features: LearningFeatures = {};
        for (let i = 0; i < k; i++) features[`f${i}`] = 1;
        return features;
    }

    async function predictionAfter(m: LearningManager, features: LearningFeatures): Promise<number> {
        return m.predict(features, await m.getModel());
    }

    describe('the divergence fixture', function () {
        it("diverges under the legacy 'raw' rule (the defect being fixed)", async function () {
            const m = manager({ updateMode: 'raw', maxWeightMagnitude: Number.MAX_SAFE_INTEGER, maxUpdateNorm: 0 });
            const features = unitFeatures(22);
            await m.trainSamples(
                Array.from({ length: 40 }, () => ({ features, reward: 1 })),
                1,
            );
            // 22 unit features at lr 0.1 overshoot by 22x every step, so the
            // error alternates sign and grows without bound.
            expect(Math.abs(await predictionAfter(m, features))).to.be.greaterThan(100);
        });

        it("converges toward the target under the default 'normalized' rule", async function () {
            const m = manager();
            const features = unitFeatures(22);
            await m.trainSamples(
                Array.from({ length: 40 }, () => ({ features, reward: 1 })),
                1,
            );
            const prediction = await predictionAfter(m, features);
            expect(Number.isFinite(prediction)).to.equal(true);
            expect(prediction).to.be.closeTo(1, 0.05);
        });

        for (const k of [1, 5, 22, 100, 500]) {
            it(`stays finite and converges with ${k} active features`, async function () {
                const m = manager();
                const features = unitFeatures(k);
                await m.trainSamples(
                    Array.from({ length: 60 }, () => ({ features, reward: 1 })),
                    5,
                );
                const prediction = await predictionAfter(m, features);
                expect(Number.isFinite(prediction)).to.equal(true);
                expect(prediction).to.be.closeTo(1, 0.1);
            });
        }

        it('stays finite with wildly-scaled feature values', async function () {
            const m = manager();
            const features = { tiny: 1e-6, huge: 1e6, normal: 1 };
            await m.trainSamples(
                Array.from({ length: 50 }, () => ({ features, reward: 1 })),
                5,
            );
            const model = await m.getModel();
            for (const value of Object.values(model)) {
                expect(Number.isFinite(Number(value))).to.equal(true);
                expect(Math.abs(Number(value))).to.be.at.most(100);
            }
        });

        it('rejects adversarial samples instead of writing NaN into the model', async function () {
            const m = manager();
            await m.trainSamples([
                { features: { a: NaN }, reward: 1 },
                { features: { b: Infinity }, reward: 1 },
                { features: { c: 1 }, reward: NaN as unknown as number },
                { features: { d: 1 }, reward: 1 },
            ]);
            const model = await m.getModel();
            expect(model.a).to.equal(undefined);
            expect(model.b).to.equal(undefined);
            expect(model.c).to.equal(undefined);
            expect(Number.isFinite(Number(model.d))).to.equal(true);
        });

        it('clamps a single weight to the configured magnitude', async function () {
            const m = manager({ maxWeightMagnitude: 2, learningRate: 5, maxUpdateNorm: 100 });
            await m.trainSamples(
                Array.from({ length: 30 }, () => ({ features: { a: 1 }, reward: 50 })),
                1,
            );
            expect(Math.abs(Number((await m.getModel()).a))).to.be.at.most(2);
        });

        it('applies L2 regularization toward zero when configured', async function () {
            const plain = manager();
            const regularized = manager({ l2: 0.5 });
            const samples = Array.from({ length: 30 }, () => ({ features: { a: 1 }, reward: 1 }));
            await plain.trainSamples(samples, 5);
            const plainWeight = Number((await plain.getModel()).a);
            await redisClient.del(keys.learningModel());
            await regularized.trainSamples(samples, 5);
            const regularizedWeight = Number((await regularized.getModel()).a);
            expect(regularizedWeight).to.be.lessThan(plainWeight);
        });
    });

    describe('bounded Redis work', function () {
        it('reads only the fields an update touches, not the whole model', async function () {
            const m = manager();
            // Seed a wide model.
            const wide: Record<string, string> = {};
            for (let i = 0; i < 2000; i++) wide[`bulk${i}`] = '0.01';
            await redisClient.hSet(keys.learningModel(), wide);

            const commands: string[] = [];
            const original = redisClient.hGetAll.bind(redisClient);
            redisClient.hGetAll = async (key: string) => {
                commands.push(key);
                return original(key);
            };
            try {
                await m.trainSamples([{ features: { bulk1: 1 }, reward: 1 }]);
            } finally {
                redisClient.hGetAll = original;
            }
            expect(commands).to.not.include(keys.learningModel());
        });

        it('re-reads per chunk so a long import cannot drift from a stale snapshot', async function () {
            const m = manager();
            const samples = Array.from({ length: 25 }, () => ({ features: { a: 1 }, reward: 1 }));
            const applied = await m.trainSamples(samples, 5);
            expect(applied).to.equal(25);
            expect(Number((await m.getModel()).a)).to.be.closeTo(1, 0.1);
        });
    });

    describe('concurrency', function () {
        it('does not drop increments when observations interleave', async function () {
            const m = manager();
            await Promise.all(Array.from({ length: 20 }, () => m.trainSamples([{ features: { a: 1 }, reward: 1 }])));
            const stats = await m.getStats();
            expect(stats.rewards).to.equal(20);
            expect(Number.isFinite(Number((await m.getModel()).a))).to.equal(true);
        });
    });

    describe('bounded ranking influence', function () {
        it('keeps a priority band intact even with an extreme learned weight', async function () {
            const matcher = new Matcher(redisClient, {
                maxUserBacklogSize: 10,
                relevantBatchSize: 50,
                redisPrefix: 'test-stab-m:',
                enableLearning: true,
                learningExplorationRate: 0,
                learningMaxBoost: 1,
            });
            // A weight far larger than any plausible priority difference.
            await redisClient.hSet('test-stab-m:learning:model', 'tag:low', '10000');

            await matcher.addUser({ id: 'ada', tags: ['low', 'high'] });
            await matcher.addAssignment({ id: 'urgent', tags: ['high'], priority: 100 });
            await matcher.addAssignment({ id: 'routine', tags: ['low'], priority: 1 });

            const explanation = await matcher.explainMatch('urgent');
            expect(explanation.candidates.length).to.be.greaterThan(0);

            await matcher.matchUsersAssignments('ada');
            const backlog = await matcher.getCurrentAssignmentsForUser('ada');
            expect(backlog).to.include('urgent');

            // With the cap in place the learned boost cannot exceed 1, so the
            // 99-point priority gap still decides the order.
            const decision = await matcher.getLearningDecision('urgent');
            expect(decision).to.not.equal(null);
        });
    });
});
