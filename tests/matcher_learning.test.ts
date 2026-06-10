import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Matcher Learning Layer - Integration Tests', function () {
    this.timeout(20000);
    let redisClient: any;

    before(async function () {
        redisClient = createClient({});
        await redisClient.connect();
        await redisClient.flushAll();
    });

    afterEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    function createMatcher(options: Record<string, any> = {}) {
        return new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 20,
            redisPrefix: 'test-ml:',
            ...options,
        });
    }

    it('should not write learning state when learning is disabled', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        await matcher.acceptAssignment('user1', 'a1');

        const stats = await matcher.getLearningStats();
        expect(stats.decisions).to.equal(0);
    });

    it('should record decisions and learn from the assignment lifecycle', async function () {
        const matcher = createMatcher({ enableLearning: true, learningExplorationRate: 0 });
        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

        await matcher.matchUsersAssignments('user1');
        const assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.include('a1');

        await matcher.acceptAssignment('user1', 'a1');
        await matcher.completeAssignment('user1', 'a1');

        const stats = await matcher.getLearningStats();
        expect(stats.decisions).to.be.greaterThan(0);
        expect(stats.totalReward).to.be.greaterThan(0);

        const model = await matcher.getLearningModel();
        expect(Number(model['tag:english'])).to.be.greaterThan(0);
    });

    it('should learn negative signal from rejections', async function () {
        const matcher = createMatcher({ enableLearning: true, learningExplorationRate: 0 });
        await matcher.addUser({ id: 'user1', tags: ['billing'] });
        await matcher.addAssignment({ id: 'a1', tags: ['billing'], priority: 10 });

        await matcher.matchUsersAssignments('user1');
        await matcher.rejectAssignment('user1', 'a1');

        const model = await matcher.getLearningModel();
        expect(Number(model['tag:billing'])).to.be.lessThan(0);
    });

    it('should re-rank candidates using learned weights', async function () {
        const matcher = createMatcher({
            enableLearning: true,
            learningExplorationRate: 0,
            learningBoostFactor: 1000,
            maxUserBacklogSize: 1,
            enableDefaultMatching: false,
        });

        // Train the model: 'good' completes, 'bad' is rejected
        await matcher.addUser({ id: 'trainer', tags: ['good', 'bad'] });
        for (let i = 0; i < 10; i++) {
            await matcher.addAssignment({ id: `good-${i}`, tags: ['good'], priority: 1 });
            await matcher.matchUsersAssignments('trainer');
            await matcher.acceptAssignment('trainer', `good-${i}`);
            await matcher.completeAssignment('trainer', `good-${i}`);

            await matcher.addAssignment({ id: `bad-${i}`, tags: ['bad'], priority: 1 });
            await matcher.matchUsersAssignments('trainer');
            await matcher.rejectAssignment('trainer', `bad-${i}`);
        }

        // Fresh user with backlog of 1; both assignments have equal base priority.
        await matcher.addUser({ id: 'user1', tags: ['good', 'bad'] });
        await matcher.addAssignment({ id: 'bad-final', tags: ['bad'], priority: 1 });
        await matcher.addAssignment({ id: 'good-final', tags: ['good'], priority: 1 });

        await matcher.matchUsersAssignments('user1');
        const assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.deep.equal(['good-final']);
    });

    it('should not affect ranking in shadow mode but still record decisions', async function () {
        const matcher = createMatcher({
            enableLearning: true,
            learningShadowMode: true,
            learningExplorationRate: 0,
        });

        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });

        await matcher.matchUsersAssignments('user1');
        const assignments = await matcher.getCurrentAssignmentsForUser('user1');
        expect(assignments).to.include('a1');

        const stats = await matcher.getLearningStats();
        expect(stats.decisions).to.be.greaterThan(0);
    });

    it('should apply expiration penalties through processExpiredMatches', async function () {
        const matcher = createMatcher({
            enableLearning: true,
            learningExplorationRate: 0,
            matchExpirationMs: 1,
        });

        await matcher.addUser({ id: 'user1', tags: ['slow'] });
        await matcher.addAssignment({ id: 'a1', tags: ['slow'], priority: 10 });
        await matcher.matchUsersAssignments('user1');

        await new Promise((resolve) => setTimeout(resolve, 20));
        const expired = await matcher.processExpiredMatches();
        expect(expired).to.equal(1);

        const model = await matcher.getLearningModel();
        expect(Number(model['tag:slow'])).to.be.lessThan(0);
    });

    it('should support custom reward maps', async function () {
        const matcher = createMatcher({
            enableLearning: true,
            learningExplorationRate: 0,
            learningRewards: { complete: 10 },
        });

        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        await matcher.acceptAssignment('user1', 'a1');
        await matcher.completeAssignment('user1', 'a1');

        const stats = await matcher.getLearningStats();
        // accept reward + custom complete reward of 10
        expect(stats.totalReward).to.be.greaterThan(9);
    });

    it('should support a custom feature extractor', async function () {
        const matcher = createMatcher({
            enableLearning: true,
            learningExplorationRate: 0,
            learningFeatureExtractor: () => ({ custom: 1 }),
        });

        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        await matcher.acceptAssignment('user1', 'a1');
        await matcher.completeAssignment('user1', 'a1');

        const model = await matcher.getLearningModel();
        expect(Number(model['custom'])).to.be.greaterThan(0);
        expect(model['tag:english']).to.be.undefined;
    });

    it('should allow resetting the learned model', async function () {
        const matcher = createMatcher({ enableLearning: true, learningExplorationRate: 0 });
        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        await matcher.acceptAssignment('user1', 'a1');

        await matcher.resetLearningModel();
        const model = await matcher.getLearningModel();
        expect(Object.keys(model)).to.have.length(0);
    });

    it('should accept post-completion external feedback signals', async function () {
        const matcher = createMatcher({
            enableLearning: true,
            learningExplorationRate: 0,
            learningSignalWeights: { accuracy: 2, handleTimePenalty: -1 },
        });

        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        await matcher.acceptAssignment('user1', 'a1');
        await matcher.completeAssignment('user1', 'a1');

        const before = Number((await matcher.getLearningModel())['tag:english']) || 0;

        // Post-processing arrives later: high accuracy, small time penalty
        const applied = await matcher.recordLearningFeedback('a1', { accuracy: 0.95, handleTimePenalty: 0.1 });
        expect(applied).to.be.true;

        const after = Number((await matcher.getLearningModel())['tag:english']) || 0;
        expect(after).to.be.greaterThan(before);
    });

    it('should reject feedback for assignments with no learning context', async function () {
        const matcher = createMatcher({ enableLearning: true });
        const applied = await matcher.recordLearningFeedback('ghost', { accuracy: 1 });
        expect(applied).to.be.false;
    });

    it('should support offline batch training with external samples', async function () {
        const matcher = createMatcher({ enableLearning: true, learningExplorationRate: 0 });

        await matcher.trainLearningSamples([
            { features: { bias: 1, 'tag:premium': 1 }, reward: 1 },
            { features: { bias: 1, 'tag:spam': 1 }, reward: -1 },
        ]);

        const model = await matcher.getLearningModel();
        expect(Number(model['tag:premium'])).to.be.greaterThan(0);
        expect(Number(model['tag:spam'])).to.be.lessThan(0);
    });
});
