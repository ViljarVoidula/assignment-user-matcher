import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import { synthesizeRoutingWeights } from '../src/learning/auto-weights';
import type { LearningTagStat } from '../src/types/matcher';

describe('Auto Routing Weights - Unit Tests (synthesizeRoutingWeights)', function () {
    function stat(tag: string, count: number, rewardSum: number): LearningTagStat {
        return { tag, count, rewardSum, meanReward: count > 0 ? rewardSum / count : 0 };
    }

    it('should map consistently rewarding tags to high weights', function () {
        const weights = synthesizeRoutingWeights([stat('english', 20, 18)], { minSamples: 5 });
        expect(weights.english).to.be.greaterThan(50);
        expect(weights.english).to.be.at.most(100);
    });

    it('should hard-veto tags with consistently negative reward', function () {
        const weights = synthesizeRoutingWeights([stat('billing', 20, -16)], {
            minSamples: 5,
            vetoThreshold: -0.5,
        });
        expect(weights.billing).to.equal(0);
    });

    it('should not veto under-sampled tags (optimistic prior instead)', function () {
        const weights = synthesizeRoutingWeights([stat('new-skill', 2, -1.2)], {
            minSamples: 5,
            priorWeight: 50,
        });
        expect(weights['new-skill']).to.equal(50);
    });

    it('should give known-but-unobserved tags the exploration prior', function () {
        const weights = synthesizeRoutingWeights([stat('english', 10, 8)], { priorWeight: 40 }, ['english', 'dutch']);
        expect(weights.dutch).to.equal(40);
        expect(weights.english).to.be.greaterThan(40);
    });

    it('should add a UCB exploration bonus favoring less-sampled tags at equal mean reward', function () {
        const weights = synthesizeRoutingWeights([stat('common', 1000, 500), stat('rare', 10, 5)], {
            minSamples: 5,
            explorationBonus: 0.5,
        });
        expect(weights.rare).to.be.greaterThan(weights.common);
    });

    it('should clamp weights into [0, maxWeight] and keep eligible tags at least 1', function () {
        const weights = synthesizeRoutingWeights([stat('great', 50, 200), stat('meh', 50, -20)], {
            minSamples: 5,
            maxWeight: 100,
            vetoThreshold: -0.6,
        });
        expect(weights.great).to.equal(100);
        expect(weights.meh).to.be.at.least(1);
    });

    it('should use existingWeights values as per-tag prior for under-sampled tags', function () {
        const weights = synthesizeRoutingWeights(
            [stat('english', 2, 1)], // under-sampled (< minSamples=5)
            { minSamples: 5, priorWeight: 30 }, // flat prior is 30
            undefined,
            { english: 80 }, // existing weight should win over flat prior
        );
        expect(weights.english).to.equal(80);
    });

    it('should use existingWeights as prior for unobserved knownTags', function () {
        const weights = synthesizeRoutingWeights(
            [stat('english', 20, 18)],
            { minSamples: 5, priorWeight: 30 },
            ['dutch'], // known but no observations
            { dutch: 65 }, // existing weight is the prior
        );
        expect(weights.dutch).to.equal(65);
    });
});

describe('Auto Routing Weights - Matcher Integration Tests', function () {
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
            redisPrefix: 'test-aw:',
            enableLearning: true,
            learningExplorationRate: 0,
            enableAutoRoutingWeights: true,
            ...options,
        });
    }

    async function runLifecycle(
        matcher: InstanceType<typeof Matcher>,
        userId: string,
        assignmentId: string,
        tags: string[],
        outcome: 'complete' | 'reject',
    ) {
        await matcher.addAssignment({ id: assignmentId, tags, priority: 10 });
        await matcher.matchUsersAssignments(userId);
        if (outcome === 'complete') {
            await matcher.acceptAssignment(userId, assignmentId);
            await matcher.completeAssignment(userId, assignmentId);
        } else {
            await matcher.rejectAssignment(userId, assignmentId);
        }
    }

    it('should not track tag stats when auto routing weights are disabled', async function () {
        const matcher = createMatcher({ enableAutoRoutingWeights: false });
        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await runLifecycle(matcher, 'user1', 'a1', ['english'], 'complete');

        const stats = await matcher.getLearnedTagStats('user1');
        expect(stats).to.deep.equal([]);
    });

    it('should accumulate per-user tag reward stats from lifecycle outcomes', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'user1', tags: ['english', 'billing'] });

        for (let i = 0; i < 3; i++) {
            await runLifecycle(matcher, 'user1', `good-${i}`, ['english'], 'complete');
        }
        await runLifecycle(matcher, 'user1', 'bad-0', ['billing'], 'reject');

        const stats = await matcher.getLearnedTagStats('user1');
        const english = stats.find((s) => s.tag === 'english');
        const billing = stats.find((s) => s.tag === 'billing');

        expect(english).to.exist;
        // accept (0.3) + complete (1) per assignment => 2 samples each
        expect(english!.count).to.equal(6);
        expect(english!.meanReward).to.be.greaterThan(0);
        expect(billing).to.exist;
        expect(billing!.meanReward).to.be.lessThan(0);
    });

    it('should synthesize routing weights rewarding good tags and vetoing bad ones', async function () {
        const matcher = createMatcher({
            autoRoutingWeights: { minSamples: 3, vetoThreshold: -0.3 },
            enableDefaultMatching: false,
        });
        await matcher.addUser({ id: 'user1', tags: ['good', 'bad'] });

        for (let i = 0; i < 5; i++) {
            await runLifecycle(matcher, 'user1', `g-${i}`, ['good'], 'complete');
            await runLifecycle(matcher, 'user1', `b-${i}`, ['bad'], 'reject');
        }

        const weights = await matcher.getLearnedRoutingWeights('user1');
        expect(weights.good).to.be.greaterThan(0);
        expect(weights.bad).to.equal(0);
    });

    it('should apply learned weights to the user and use them in matching', async function () {
        const matcher = createMatcher({
            autoRoutingWeights: { minSamples: 3, vetoThreshold: -0.3 },
            enableDefaultMatching: false,
        });
        await matcher.addUser({ id: 'user1', tags: ['good', 'bad'] });

        for (let i = 0; i < 5; i++) {
            await runLifecycle(matcher, 'user1', `g-${i}`, ['good'], 'complete');
            await runLifecycle(matcher, 'user1', `b-${i}`, ['bad'], 'reject');
        }

        const applied = await matcher.syncLearnedRoutingWeights('user1');
        expect(applied.user1).to.exist;
        expect(applied.user1.bad).to.equal(0);

        // Bad-tag assignment must now stay queued (hard veto via weight 0)
        await matcher.addAssignment({ id: 'veto-check', tags: ['bad'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        const current = await matcher.getCurrentAssignmentsForUser('user1');
        expect(current).to.not.include('veto-check');

        // Good-tag assignment still flows
        await matcher.addAssignment({ id: 'good-check', tags: ['good'], priority: 10 });
        await matcher.matchUsersAssignments('user1');
        const after = await matcher.getCurrentAssignmentsForUser('user1');
        expect(after).to.include('good-check');
    });

    it('should preserve manual routing weights for tags the learner has not touched', async function () {
        const matcher = createMatcher({
            autoRoutingWeights: { minSamples: 3 },
            enableDefaultMatching: false,
        });
        await matcher.addUser({
            id: 'user1',
            tags: ['good'],
            routingWeights: { good: 10, manual: 77 },
        });

        for (let i = 0; i < 5; i++) {
            await runLifecycle(matcher, 'user1', `g-${i}`, ['good'], 'complete');
        }

        const applied = await matcher.syncLearnedRoutingWeights('user1');
        expect(applied.user1.manual).to.equal(77);
        expect(applied.user1.good).to.be.greaterThan(10);
    });

    it('should sync learned weights for all tracked users when no user id is given', async function () {
        const matcher = createMatcher({
            autoRoutingWeights: { minSamples: 1 },
            enableDefaultMatching: false,
        });
        await matcher.addUser({ id: 'user1', tags: ['alpha'] });
        await matcher.addUser({ id: 'user2', tags: ['beta'] });

        await runLifecycle(matcher, 'user1', 'a-1', ['alpha'], 'complete');
        await runLifecycle(matcher, 'user2', 'b-1', ['beta'], 'complete');

        const applied = await matcher.syncLearnedRoutingWeights();
        expect(Object.keys(applied)).to.have.members(['user1', 'user2']);
        expect(applied.user1.alpha).to.be.greaterThan(0);
        expect(applied.user2.beta).to.be.greaterThan(0);
    });

    it('should reset per-user tag stats when the learning model is reset', async function () {
        const matcher = createMatcher();
        await matcher.addUser({ id: 'user1', tags: ['english'] });
        await runLifecycle(matcher, 'user1', 'a1', ['english'], 'complete');

        expect(await matcher.getLearnedTagStats('user1')).to.not.deep.equal([]);
        await matcher.resetLearningModel();
        expect(await matcher.getLearnedTagStats('user1')).to.deep.equal([]);
    });

    it('should use existing routingWeights as the per-tag prior when under-sampled', async function () {
        const matcher = createMatcher({
            autoRoutingWeights: { minSamples: 10, priorWeight: 30 },
            enableDefaultMatching: false,
        });
        // User has a high existing weight for 'english' (80) and a mid weight for 'billing' (50)
        await matcher.addUser({
            id: 'user1',
            tags: ['english', 'billing'],
            routingWeights: { english: 80, billing: 50 },
        });

        // Only 3 observations — well below minSamples=10 so the prior is used
        for (let i = 0; i < 3; i++) {
            await runLifecycle(matcher, 'user1', `e-${i}`, ['english'], 'complete');
        }

        const weights = await matcher.getLearnedRoutingWeights('user1');
        // 'english' under-sampled: should use existing weight 80 (not flat prior 30)
        expect(weights.english).to.equal(80);
        // 'billing': no observations yet — still uses existing weight 50
        expect(weights.billing).to.equal(50);
    });

    it('should use existing weights as prior via syncLearnedRoutingWeights automatically', async function () {
        const matcher = createMatcher({
            autoRoutingWeights: { minSamples: 10, priorWeight: 30 },
            enableDefaultMatching: false,
        });
        await matcher.addUser({
            id: 'user1',
            tags: ['english'],
            routingWeights: { english: 75 },
        });

        // 2 observations — under minSamples so flat prior would be 30, existing is 75
        for (let i = 0; i < 2; i++) {
            await runLifecycle(matcher, 'user1', `e-${i}`, ['english'], 'complete');
        }

        const applied = await matcher.syncLearnedRoutingWeights('user1');
        expect(applied.user1.english).to.equal(75);
    });
});
