import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Auto Routing Weights v2 - Matcher Integration', function () {
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
            redisPrefix: 'test-awv2:',
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

    describe('terminal-only tag stats', function () {
        it('skips accept outcomes when terminalOnlyTagStats is enabled', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1, terminalOnlyTagStats: true },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['english'] });

            for (let i = 0; i < 3; i++) {
                await runLifecycle(matcher, 'user1', `good-${i}`, ['english'], 'complete');
            }

            const stats = await matcher.getLearnedTagStats('user1');
            const english = stats.find((s) => s.tag === 'english');
            expect(english).to.exist;
            expect(english!.count).to.equal(3); // only terminal completes counted
        });

        it('still counts reject terminal outcomes', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1, terminalOnlyTagStats: true },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['billing'] });

            for (let i = 0; i < 2; i++) {
                await runLifecycle(matcher, 'user1', `bad-${i}`, ['billing'], 'reject');
            }

            const stats = await matcher.getLearnedTagStats('user1');
            const billing = stats.find((s) => s.tag === 'billing');
            expect(billing).to.exist;
            expect(billing!.count).to.equal(2);
            expect(billing!.meanReward).to.be.lessThan(0);
        });
    });

    describe('time-decayed tag stats', function () {
        it('reduces apparent count after elapsed half-life', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1, decayHalfLifeMs: 100 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['english'] });
            await runLifecycle(matcher, 'user1', 'a1', ['english'], 'complete');

            const fresh = await matcher.getLearnedTagStats('user1');
            // accept (0.3) + complete (1) => 2 samples by default (terminalOnly off)
            expect(fresh[0].count).to.be.closeTo(2, 0.05);

            await new Promise((r) => setTimeout(r, 110));
            const decayed = await matcher.getLearnedTagStats('user1');
            expect(decayed[0].count).to.be.lessThan(1.1);
            expect(decayed[0].count).to.be.greaterThan(0.4);
        });
    });

    describe('sync guardrails', function () {
        it('clamps per-tag weight changes per sync', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1, maxDeltaPerSync: 10 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['good'] });

            for (let i = 0; i < 5; i++) {
                await runLifecycle(matcher, 'user1', `g-${i}`, ['good'], 'complete');
            }

            // First sync: good jumps from no learned weight to a high value.
            const first = await matcher.syncLearnedRoutingWeights('user1');
            const firstWeight = first.user1.good;
            expect(firstWeight).to.be.greaterThan(0);

            // Add many more positive observations so the learned value would
            // rise sharply; clamp keeps the delta within 10.
            for (let i = 0; i < 20; i++) {
                await runLifecycle(matcher, 'user1', `g2-${i}`, ['good'], 'complete');
            }

            const second = await matcher.syncLearnedRoutingWeights('user1');
            const secondWeight = second.user1.good;
            expect(Math.abs(secondWeight - firstWeight)).to.be.at.most(10);
        });

        it('dryRun computes weights without writing them', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['good'], routingWeights: { good: 10 } });
            await runLifecycle(matcher, 'user1', 'a1', ['good'], 'complete');

            const dry = await matcher.syncLearnedRoutingWeights('user1', { dryRun: true });
            expect(dry.user1.good).to.be.greaterThan(10);

            const user = JSON.parse(await redisClient.hGet('test-awv2:users', 'user1'));
            expect(user.routingWeights).to.deep.equal({ good: 10 });
            expect(user.learnedRoutingWeights).to.be.undefined;
        });

        it('respects minTotalSamples at sync time', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1, minTotalSamples: 100 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['good'] });
            await runLifecycle(matcher, 'user1', 'a1', ['good'], 'complete');

            const applied = await matcher.syncLearnedRoutingWeights('user1');
            expect(applied.user1).to.be.undefined;
        });
    });

    describe('snapshot and revert', function () {
        it('snapshots prior weights and revert restores them', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({
                id: 'user1',
                tags: ['good'],
                routingWeights: { good: 10, manual: 77 },
            });
            await runLifecycle(matcher, 'user1', 'a1', ['good'], 'complete');

            const applied = await matcher.syncLearnedRoutingWeights('user1');
            expect(applied.user1.good).to.be.greaterThan(10);

            const afterSync = JSON.parse(await redisClient.hGet('test-awv2:users', 'user1'));
            expect(afterSync.routingWeightsSnapshot).to.deep.equal({ good: 10, manual: 77 });
            expect(afterSync.learnedRoutingWeightsSyncedAt).to.be.a('number');

            const reverted = await matcher.revertLearnedRoutingWeights('user1');
            expect(reverted).to.deep.equal(['user1']);

            const afterRevert = JSON.parse(await redisClient.hGet('test-awv2:users', 'user1'));
            expect(afterRevert.routingWeights).to.deep.equal({ good: 10, manual: 77 });
            expect(afterRevert.routingWeightsSnapshot).to.be.undefined;
            expect(afterRevert.learnedRoutingWeights).to.be.undefined;
        });

        it('revert with no user id reverts all users with snapshots', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'u1', tags: ['t1'], routingWeights: { t1: 10 } });
            await matcher.addUser({ id: 'u2', tags: ['t2'], routingWeights: { t2: 10 } });
            await runLifecycle(matcher, 'u1', 'a1', ['t1'], 'complete');
            await runLifecycle(matcher, 'u2', 'a2', ['t2'], 'complete');

            await matcher.syncLearnedRoutingWeights();
            const reverted = await matcher.revertLearnedRoutingWeights();
            expect(reverted).to.have.lengthOf(2);
        });
    });

    describe('auto-sync interval', function () {
        it('starts and stops the sync tick', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1 },
                enableDefaultMatching: false,
            });
            await matcher.addUser({ id: 'user1', tags: ['good'] });
            await runLifecycle(matcher, 'user1', 'a1', ['good'], 'complete');

            try {
                matcher.startAutoRoutingWeightsSync(30);
                expect(matcher.isAutoRoutingWeightsSyncRunning()).to.be.true;

                // Poll briefly for the first tick instead of sleeping a fixed delay.
                const deadline = Date.now() + 1500;
                let user: any = null;
                while (Date.now() < deadline) {
                    user = JSON.parse(await redisClient.hGet('test-awv2:users', 'user1'));
                    if (user?.learnedRoutingWeights) break;
                    await new Promise((r) => setTimeout(r, 15));
                }
                expect(user.learnedRoutingWeights).to.exist;
            } finally {
                matcher.stopAutoRoutingWeightsSync();
                expect(matcher.isAutoRoutingWeightsSyncRunning()).to.be.false;
            }
        });

        it('uses a Redis lock so only one instance runs the tick', async function () {
            const matcher1 = createMatcher({
                autoRoutingWeights: { minSamples: 1 },
                enableDefaultMatching: false,
                redisPrefix: 'test-awv2-lock:',
            });
            const matcher2 = createMatcher({
                autoRoutingWeights: { minSamples: 1 },
                enableDefaultMatching: false,
                redisPrefix: 'test-awv2-lock:',
            });
            await matcher1.addUser({ id: 'user1', tags: ['good'] });
            await runLifecycle(matcher1, 'user1', 'a1', ['good'], 'complete');

            try {
                matcher1.startAutoRoutingWeightsSync(40);
                matcher2.startAutoRoutingWeightsSync(40);

                // Poll briefly for the lock instead of sleeping a full interval.
                const deadline = Date.now() + 1500;
                let lock: string | null = null;
                while (Date.now() < deadline) {
                    lock = await redisClient.get('test-awv2-lock:autoweights:sync:lock');
                    if (lock) break;
                    await new Promise((r) => setTimeout(r, 15));
                }
                expect(lock).to.be.a('string');
            } finally {
                matcher1.stopAutoRoutingWeightsSync();
                matcher2.stopAutoRoutingWeightsSync();
            }
        });
    });

    describe('confidence policy end-to-end', function () {
        it('learns and applies weights without prematurely vetoing manual tags', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: {
                    policy: 'confidence',
                    minSamples: 5,
                    minSamplesForVeto: 20,
                    vetoThreshold: -0.5,
                    confidenceZ: 1.96,
                },
                enableDefaultMatching: false,
            });
            await matcher.addUser({
                id: 'user1',
                tags: ['good', 'bad'],
                routingWeights: { good: 50, bad: 50 },
            });

            for (let i = 0; i < 10; i++) {
                await runLifecycle(matcher, 'user1', `g-${i}`, ['good'], 'complete');
                await runLifecycle(matcher, 'user1', `b-${i}`, ['bad'], 'reject');
            }

            const weights = await matcher.getLearnedRoutingWeights('user1');
            expect(weights.good).to.be.greaterThan(weights.bad);
            // Bad has 10 reject samples — below minSamplesForVeto=20, so a
            // previously manual weight of 50 should not be hard-vetoed yet.
            expect(weights.bad).to.be.greaterThan(0);
        });
    });
});
