import { extractMatchFeatures } from '../src/learning/features';
import { LearningManager } from '../src/managers/LearningManager';
import { createKeyBuilders } from '../src/utils/keys';
import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import type { User, LearningFeatureContext } from '../src/types/matcher';

describe('Learning - worker performance features', function () {
    this.timeout(30000);

    describe('extractMatchFeatures (pure)', function () {
        const user: User = { id: 'ada', tags: ['english'] };
        const assignment = { id: 'a1', tags: ['english'] };

        it('emits nothing new without a performance context', function () {
            const features = extractMatchFeatures(user, assignment);
            expect(Object.keys(features).some((k) => k.startsWith('perf:'))).to.equal(false);
            expect(features['load:backlog']).to.equal(undefined);
        });

        it('distinguishes two workers with identical declared tags', function () {
            const strong: LearningFeatureContext = {
                performance: { successRate: { english: 0.9 }, acceptanceRate: { english: 0.9 } },
            };
            const weak: LearningFeatureContext = {
                performance: { successRate: { english: 0.2 }, acceptanceRate: { english: 0.3 } },
            };
            const a = extractMatchFeatures(user, assignment, 3600000, strong);
            const b = extractMatchFeatures({ ...user, id: 'bo' }, assignment, 3600000, weak);
            expect(a['perf:success']).to.not.equal(b['perf:success']);
            expect(a['perf:accept']).to.not.equal(b['perf:accept']);
        });

        it('falls back to the overall rate when the tag is unobserved', function () {
            const features = extractMatchFeatures(user, assignment, 3600000, {
                performance: { successRate: {}, overallSuccessRate: 0.66 },
            });
            expect(features['perf:success']).to.be.closeTo(0.66, 1e-9);
        });

        it('emits no rate at all when nothing is known', function () {
            const features = extractMatchFeatures(user, assignment, 3600000, { performance: {} });
            expect(features['perf:success']).to.equal(undefined);
            expect(features['perf:accept']).to.equal(undefined);
        });

        it('scores speed relative to the team mean, and marks it as known', function () {
            const context: LearningFeatureContext = {
                performance: { handlingTimeMs: { english: 30_000 } },
                priors: { handlingTimeMs: 60_000 },
            };
            const features = extractMatchFeatures(user, assignment, 3600000, context);
            expect(features['perf:speed']).to.be.closeTo(0.75, 1e-9);
            expect(features['perf:speedKnown']).to.equal(1);
        });

        it('derives urgency from time actually remaining, not the configured duration', function () {
            const now = 1_000_000;
            const slaAssignment = {
                id: 'a1',
                tags: ['english'],
                sla: { completeWithinMs: 3_600_000 },
                _enqueuedAt: now - 3_300_000,
            };
            const features = extractMatchFeatures(user, slaAssignment, 3600000, { now });
            // 55 of 60 minutes gone.
            expect(features['sla:remainingFraction']).to.be.closeTo(300_000 / 3_600_000, 1e-9);
            expect(features['sla:urgency']).to.be.greaterThan(0.9);
        });

        it('interacts urgency with speed so urgent work can prefer fast workers', function () {
            const now = 1_000_000;
            const slaAssignment = {
                id: 'a1',
                tags: ['english'],
                sla: { completeWithinMs: 3_600_000 },
                _enqueuedAt: now - 3_300_000,
            };
            const fast = extractMatchFeatures(user, slaAssignment, 3600000, {
                now,
                performance: { handlingTimeMs: { english: 10_000 } },
                priors: { handlingTimeMs: 60_000 },
            });
            const slow = extractMatchFeatures(user, slaAssignment, 3600000, {
                now,
                performance: { handlingTimeMs: { english: 110_000 } },
                priors: { handlingTimeMs: 60_000 },
            });
            expect(fast['x:urgency*speed']).to.be.greaterThan(slow['x:urgency*speed']);
        });

        it('interacts difficulty with success', function () {
            const hard = extractMatchFeatures(user, { id: 'a1', tags: ['english'], difficulty: 0.9 }, 3600000, {
                performance: { successRate: { english: 0.8 } },
            });
            const easy = extractMatchFeatures(user, { id: 'a1', tags: ['english'], difficulty: 0.1 }, 3600000, {
                performance: { successRate: { english: 0.8 } },
            });
            expect(hard['x:difficulty*success']).to.be.greaterThan(easy['x:difficulty*success']);
            expect(hard.difficulty).to.equal(0.9);
        });

        it('scales workload against the worker own backlog limit', function () {
            const features = extractMatchFeatures(user, assignment, 3600000, {
                performance: { backlog: 3, backlogLimit: 6 },
            });
            expect(features['load:backlog']).to.be.closeTo(0.5, 1e-9);
            expect(features['x:load*complexity']).to.be.a('number');
        });

        it('is deterministic for identical inputs', function () {
            const context: LearningFeatureContext = {
                now: 1_000,
                performance: { successRate: { english: 0.7 }, backlog: 1, backlogLimit: 4 },
                priors: { handlingTimeMs: 1000 },
            };
            expect(extractMatchFeatures(user, assignment, 3600000, context)).to.deep.equal(
                extractMatchFeatures(user, assignment, 3600000, context),
            );
        });

        it('keeps matching wildcard skill semantics', function () {
            const weighted: User = { id: 'ada', tags: [], routingWeights: { 'lang:*': 80 } };
            const features = extractMatchFeatures(weighted, { id: 'a1', tags: ['lang:en'] });
            // Suffix-prefix wildcards resolve exactly as eligibility does.
            expect(features['skill:lang:en']).to.be.closeTo(0.8, 1e-9);
        });
    });

    describe('aggregate shrinkage', function () {
        let redisClient: any;
        const keys = createKeyBuilders({ prefix: 'test-perf:' });

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

        it('gives a brand-new worker the team prior, not zero', async function () {
            const m = new LearningManager(redisClient, keys, { trackPerformance: true });
            const shrunk = m.shrinkPerformance({}, { acceptanceRate: 0.7, successRate: 0.6 });
            expect(shrunk.overallAcceptanceRate).to.be.closeTo(0.7, 1e-9);
            expect(shrunk.overallSuccessRate).to.be.closeTo(0.6, 1e-9);
        });

        it('moves away from the prior as evidence accumulates', async function () {
            const m = new LearningManager(redisClient, keys, {
                trackPerformance: true,
                performancePriorStrength: 5,
            });
            const thin = m.shrinkPerformance({ offers: '2', accepts: '2' }, { acceptanceRate: 0.5 });
            const thick = m.shrinkPerformance({ offers: '200', accepts: '200' }, { acceptanceRate: 0.5 });
            expect(thin.overallAcceptanceRate!).to.be.lessThan(thick.overallAcceptanceRate!);
            expect(thick.overallAcceptanceRate!).to.be.greaterThan(0.95);
        });

        it('reports sample support alongside the rate', async function () {
            const m = new LearningManager(redisClient, keys, { trackPerformance: true });
            const shrunk = m.shrinkPerformance({ 'offers:english': '12', 'accepts:english': '9' }, {});
            expect(shrunk.attempts!.english).to.equal(12);
        });
    });

    describe('matcher integration', function () {
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
                redisPrefix: 'test-perfm:',
                enableLearning: true,
                enableLearningPerformanceFeatures: true,
                learningExplorationRate: 0,
                ...options,
            });
        }

        it('accumulates outcome aggregates and feeds them back as features', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });

            for (let i = 0; i < 4; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['english'], priority: 10 });
                await matcher.matchUsersAssignments('ada');
                await matcher.acceptAssignment('ada', `a${i}`);
                await matcher.completeAssignment('ada', `a${i}`);
            }

            const perf = await redisClient.hGetAll('test-perfm:learning:user:ada:perf');
            expect(Number(perf.accepts)).to.equal(4);
            expect(Number(perf.successes)).to.equal(4);
            expect(Number(perf['successes:english'])).to.equal(4);
            expect(Number(perf.handleN)).to.equal(4);

            await matcher.addAssignment({ id: 'next', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            const decision = await matcher.getLearningDecision('next');
            expect(decision!.features['perf:success']).to.be.a('number');
            expect(decision!.features['load:backlog']).to.be.a('number');
        });

        it('costs one aggregate read per worker per pass, not one per candidate', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            for (let i = 0; i < 12; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['english'], priority: 10 });
            }

            const reads: string[] = [];
            const original = redisClient.hGetAll.bind(redisClient);
            redisClient.hGetAll = async (key: string) => {
                if (String(key).endsWith(':perf')) reads.push(String(key));
                return original(key);
            };
            try {
                await matcher.matchUsersAssignments('ada');
            } finally {
                redisClient.hGetAll = original;
            }
            expect(reads).to.have.length(1);
        });

        it('does not emit performance features when the option is off', async function () {
            const matcher = createMatcher({ enableLearningPerformanceFeatures: false });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');

            const decision = await matcher.getLearningDecision('a1');
            expect(Object.keys(decision!.features).some((k) => k.startsWith('perf:'))).to.equal(false);
        });
    });
});
