import { createClient } from 'redis';
import { expect } from 'chai';
import { LearningManager } from '../src/managers/LearningManager';
import { extractMatchFeatures, cosineSimilarity } from '../src/learning/features';
import { createKeyBuilders } from '../src/utils/keys';
import type { User } from '../src/types/matcher';

function createRng(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0xffffffff;
    };
}

describe('Learning Features - Unit Tests', function () {
    it('should always include a bias feature', function () {
        const user: User = { id: 'u1', tags: [] };
        const features = extractMatchFeatures(user, { id: 'a1', tags: [] });
        expect(features.bias).to.equal(1);
    });

    it('should emit tag features for overlapping tags', function () {
        const user: User = { id: 'u1', tags: ['english', 'support'] };
        const features = extractMatchFeatures(user, { id: 'a1', tags: ['english', 'billing'] });
        expect(features['tag:english']).to.equal(1);
        expect(features['tag:billing']).to.be.undefined;
    });

    it('should emit normalized skill features from routingWeights', function () {
        const user: User = { id: 'u1', tags: [], routingWeights: { english: 80 } };
        const features = extractMatchFeatures(user, { id: 'a1', tags: ['english'] });
        expect(features['skill:english']).to.be.closeTo(0.8, 1e-9);
    });

    it('should emit overlap ratio feature', function () {
        const user: User = { id: 'u1', tags: ['a', 'b'] };
        const features = extractMatchFeatures(user, { id: 'a1', tags: ['a', 'c'] });
        expect(features.overlap).to.be.closeTo(0.5, 1e-9);
    });

    it('should emit embedding similarity when both sides have embeddings', function () {
        const user: User = { id: 'u1', tags: [], embedding: [1, 0] };
        const features = extractMatchFeatures(user, { id: 'a1', tags: [], embedding: [1, 0] });
        expect(features['emb:sim']).to.be.closeTo(1, 1e-9);
    });

    it('cosineSimilarity should handle orthogonal and zero vectors', function () {
        expect(cosineSimilarity([1, 0], [0, 1])).to.equal(0);
        expect(cosineSimilarity([0, 0], [1, 1])).to.equal(0);
    });
});

describe('LearningManager - Integration Tests', function () {
    this.timeout(10000);
    let redisClient: any;
    let manager: LearningManager;
    const keys = createKeyBuilders({ prefix: 'test-learning:' });

    before(async function () {
        redisClient = createClient({});
        await redisClient.connect();
        await redisClient.flushAll();
    });

    beforeEach(function () {
        manager = new LearningManager(redisClient, keys, {
            learningRate: 0.5,
            explorationRate: 0,
            shadowMode: false,
            boostFactor: 1,
        });
    });

    afterEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    it('should predict 0 with an empty model', async function () {
        const weights = await manager.getModel();
        expect(manager.predict({ bias: 1, 'tag:english': 1 }, weights)).to.equal(0);
    });

    it('should learn positive weights from completed outcomes', async function () {
        const features = { bias: 1, 'tag:english': 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);
        await manager.applyOutcome('assignment1', 'complete');

        const weights = await manager.getModel();
        expect(manager.predict(features, weights)).to.be.greaterThan(0);
    });

    it('should learn negative weights from rejected outcomes', async function () {
        const features = { bias: 1, 'tag:spam': 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);
        await manager.applyOutcome('assignment1', 'reject');

        const weights = await manager.getModel();
        expect(manager.predict(features, weights)).to.be.lessThan(0);
    });

    it('should keep the decision record after accept but remove it after terminal outcomes', async function () {
        const features = { bias: 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);

        await manager.applyOutcome('assignment1', 'accept');
        expect(await manager.getDecision('assignment1')).to.not.be.null;

        await manager.applyOutcome('assignment1', 'complete');
        expect(await manager.getDecision('assignment1')).to.be.null;
    });

    it('should archive an episode record after a terminal outcome', async function () {
        const features = { bias: 1, 'tag:english': 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);
        await manager.applyOutcome('assignment1', 'complete');

        const episode = await manager.getEpisode('assignment1');
        expect(episode).to.not.be.null;
        expect(episode!.features).to.deep.equal(features);
        expect(episode!.userId).to.equal('user1');
    });

    it('should apply external feedback signals against an archived episode', async function () {
        const features = { bias: 1, 'tag:english': 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);
        await manager.applyOutcome('assignment1', 'complete');

        const before = manager.predict(features, await manager.getModel());
        const applied = await manager.recordFeedback('assignment1', { accuracy: 3 });
        expect(applied).to.be.true;

        const after = manager.predict(features, await manager.getModel());
        expect(after).to.be.greaterThan(before);
    });

    it('should weight feedback signals via signalWeights', async function () {
        const negManager = new LearningManager(redisClient, keys, {
            learningRate: 0.5,
            explorationRate: 0,
            signalWeights: { errorRate: -2 },
        });
        const features = { bias: 1, 'tag:risky': 1 };
        await negManager.recordDecision('user1', 'assignment1', features, 0);
        await negManager.applyOutcome('assignment1', 'accept');

        await negManager.recordFeedback('assignment1', { errorRate: 0.5 });

        const weights = await negManager.getModel();
        // reward = 0.5 * -2 = -1, prediction must move negative
        expect(negManager.predict(features, weights)).to.be.lessThan(0);
    });

    it('should return false for feedback on unknown assignments', async function () {
        const applied = await manager.recordFeedback('does-not-exist', { accuracy: 1 });
        expect(applied).to.be.false;
    });

    it('should support direct sample training without a decision record', async function () {
        const features = { 'user:u1:accuracy': 0.9, 'tag:english': 1 };
        await manager.trainSamples([
            { features, reward: 1 },
            { features, reward: 1 },
        ]);

        const weights = await manager.getModel();
        expect(manager.predict(features, weights)).to.be.greaterThan(0);

        const stats = await manager.getStats();
        expect(stats.rewards).to.equal(2);
    });

    it('should ignore outcomes for unknown assignments', async function () {
        const updated = await manager.applyOutcome('does-not-exist', 'complete');
        expect(updated).to.be.false;
    });

    describe('per-tag reward stats (trackTagStats)', function () {
        it('skips zero-valued features and blank tags, and tolerates a reward field missing from a tag stat', async function () {
            const tagManager = new LearningManager(redisClient, keys, {
                learningRate: 0.5,
                explorationRate: 0,
                trackTagStats: true,
            });

            // '' must be skipped (line 287); bias:0 must be skipped in the SGD update (line 224).
            await tagManager.recordDecision('tagged-user', 'assignment-tags', { bias: 0, 'tag:a': 1 }, 0, ['', 'a']);
            await tagManager.applyOutcome('assignment-tags', 'complete');

            const stats = await tagManager.getUserTagStats('tagged-user');
            expect(stats.map((s) => s.tag)).to.deep.equal(['a']);
            expect(stats[0].count).to.equal(1);
            expect(stats[0].meanReward).to.equal(stats[0].rewardSum);

            // Simulate a reward field missing from otherwise-valid count data.
            await redisClient.hDel(keys.learningUserTagRewards('tagged-user'), 'a');
            const afterDrop = await tagManager.getUserTagStats('tagged-user');
            expect(afterDrop[0].rewardSum).to.equal(0);
            expect(afterDrop[0].count).to.equal(1);
        });
    });

    it('should support manual reward manipulation', async function () {
        const features = { bias: 1, 'tag:vip': 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);
        await manager.recordReward('assignment1', 5);

        const weights = await manager.getModel();
        expect(manager.predict(features, weights)).to.be.greaterThan(0);
    });

    it('should toggle shadow mode at runtime without losing learned state', async function () {
        const features = { bias: 1, 'tag:english': 1 };
        await manager.recordDecision('user1', 'assignment1', features, 0);
        await manager.applyOutcome('assignment1', 'complete');

        const before = await manager.getModel();
        expect(Number(before['tag:english']) || 0).to.be.greaterThan(0);

        expect(manager.shadowMode).to.equal(false);
        manager.setShadowMode(true);
        expect(manager.shadowMode).to.equal(true);

        // Continue learning in shadow mode and ensure model still updates.
        await manager.recordDecision('user1', 'assignment2', features, 0);
        await manager.applyOutcome('assignment2', 'complete');
        const after = await manager.getModel();

        expect(Number(after['tag:english']) || 0).to.be.at.least(Number(before['tag:english']) || 0);
    });

    it('should track learning stats', async function () {
        await manager.recordDecision('user1', 'assignment1', { bias: 1 }, 0);
        await manager.applyOutcome('assignment1', 'complete');

        const stats = await manager.getStats();
        expect(stats.decisions).to.equal(1);
        expect(stats.rewards).to.equal(1);
        expect(stats.totalReward).to.be.greaterThan(0);
        expect(stats.averageReward).to.be.greaterThan(0);
    });

    it('should reset the model and stats', async function () {
        await manager.recordDecision('user1', 'assignment1', { bias: 1 }, 0);
        await manager.applyOutcome('assignment1', 'complete');

        await manager.resetModel();

        const weights = await manager.getModel();
        expect(Object.keys(weights)).to.have.length(0);
        const stats = await manager.getStats();
        expect(stats.decisions).to.equal(0);
    });

    it('should converge towards preferring consistently completed contexts', async function () {
        const goodFeatures = { bias: 1, 'tag:good': 1 };
        const badFeatures = { bias: 1, 'tag:bad': 1 };

        for (let i = 0; i < 20; i++) {
            await manager.recordDecision('user1', `good-${i}`, goodFeatures, 0);
            await manager.applyOutcome(`good-${i}`, 'complete');
            await manager.recordDecision('user1', `bad-${i}`, badFeatures, 0);
            await manager.applyOutcome(`bad-${i}`, 'reject');
        }

        const weights = await manager.getModel();
        expect(manager.predict(goodFeatures, weights)).to.be.greaterThan(manager.predict(badFeatures, weights));
    });

    it('should learn stable weight directions from a larger synthetic dataset', async function () {
        const largeManager = new LearningManager(redisClient, keys, {
            learningRate: 0.08,
            explorationRate: 0,
        });
        const rng = createRng(42);
        const samples: Array<{ features: Record<string, number>; reward: number }> = [];

        // Ground-truth reward function: y = 0.25 + 2*x1 - 1.5*x2
        for (let i = 0; i < 1500; i++) {
            const x1 = rng();
            const x2 = rng();
            samples.push({
                features: { bias: 1, x1, x2 },
                reward: 0.25 + 2 * x1 - 1.5 * x2,
            });
        }

        await largeManager.trainSamples(samples);

        const model = await largeManager.getModel();
        expect(Number(model.x1)).to.be.greaterThan(0);
        expect(Number(model.x2)).to.be.lessThan(0);

        // Evaluate on a holdout set and assert low MAE.
        let mae = 0;
        for (let i = 0; i < 200; i++) {
            const x1 = rng();
            const x2 = rng();
            const features = { bias: 1, x1, x2 };
            const target = 0.25 + 2 * x1 - 1.5 * x2;
            const pred = largeManager.predict(features, model);
            mae += Math.abs(target - pred);
        }
        mae /= 200;
        expect(mae).to.be.lessThan(0.25);
    });

    it('should handle high-volume episode feedback imports', async function () {
        const feedbackManager = new LearningManager(redisClient, keys, {
            learningRate: 0.2,
            explorationRate: 0,
            signalWeights: { accuracy: 2, errorRate: -1.5 },
        });

        for (let i = 0; i < 120; i++) {
            const assignmentId = `bulk-${i}`;
            const features = { bias: 1, 'tag:english': 1, 'bucket:bulk': 1 };
            await feedbackManager.recordDecision('user1', assignmentId, features, 0);
            await feedbackManager.applyOutcome(assignmentId, 'complete');
            await feedbackManager.recordFeedback(assignmentId, {
                accuracy: 0.9,
                errorRate: 0.1,
            });
        }

        const model = await feedbackManager.getModel();
        const score = feedbackManager.predict({ bias: 1, 'tag:english': 1, 'bucket:bulk': 1 }, model);
        expect(score).to.be.greaterThan(0.5);
    });
});
