import { LearningManager } from '../src/managers/LearningManager';
import { createKeyBuilders } from '../src/utils/keys';
import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import type { LearningFeatures } from '../src/types/matcher';

function seededRng(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}

describe('Learning - reward targets, label accounting and validation', function () {
    this.timeout(40000);
    let redisClient: any;
    const keys = createKeyBuilders({ prefix: 'test-tgt:' });

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

    function manager(options: Record<string, any> = {}) {
        return new LearningManager(redisClient, keys, {
            learningRate: 0.5,
            targets: { targets: ['acceptance', 'successGivenAcceptance'] },
            ...options,
        });
    }

    /** Run one attempt end to end through the manager. */
    async function attempt(
        m: LearningManager,
        userId: string,
        assignmentId: string,
        features: LearningFeatures,
        outcomes: string[],
        tags: string[] = ['t'],
    ) {
        const decisionId = await m.recordDecision(userId, assignmentId, features, 0, tags);
        for (const outcome of outcomes) await m.applyOutcome(assignmentId, outcome as any);
        return decisionId;
    }

    describe('separate targets', function () {
        it('does not let a high acceptance rate hide repeated failure', async function () {
            const m = manager();
            const eager = { bias: 1, 'w:eager': 1 };
            const solid = { bias: 1, 'w:solid': 1 };

            for (let i = 0; i < 40; i++) {
                // Takes everything, finishes nothing.
                await attempt(m, 'eager', `e${i}`, eager, ['accept', 'fail']);
                // Declines half, finishes what it takes.
                await attempt(m, 'solid', `s${i}`, solid, i % 2 ? ['reject'] : ['accept', 'complete']);
            }

            const snapshot = await m.loadModels();
            const eagerPrediction = m.predictWith(snapshot, eager);
            const solidPrediction = m.predictWith(snapshot, solid);

            expect(eagerPrediction.components.acceptance!).to.be.greaterThan(solidPrediction.components.acceptance!);
            expect(eagerPrediction.components.successGivenAcceptance!).to.be.lessThan(
                solidPrediction.components.successGivenAcceptance!,
            );
            // The combined utility must follow completed work, not eagerness.
            expect(solidPrediction.utility).to.be.greaterThan(eagerPrediction.utility);
        });

        it('exposes components as probabilities and the utility separately', async function () {
            const m = manager();
            await attempt(m, 'u', 'a1', { bias: 1 }, ['accept', 'complete']);
            const prediction = m.predictWith(await m.loadModels(), { bias: 1 });
            for (const value of Object.values(prediction.components)) {
                expect(value!).to.be.within(0, 1);
            }
            expect(prediction.utility).to.be.a('number');
        });

        it('ranks on acceptance when it is the only target', async function () {
            const m = manager({ targets: { targets: ['acceptance'] } });
            const good = { bias: 1, 'w:good': 1 };
            const bad = { bias: 1, 'w:bad': 1 };
            for (let i = 0; i < 20; i++) {
                await attempt(m, 'u', `g${i}`, good, ['accept']);
                await attempt(m, 'u', `b${i}`, bad, ['reject']);
            }
            const snapshot = await m.loadModels();
            // With no conditional target the utility must follow acceptance,
            // not collapse to a constant zero.
            expect(m.predictWith(snapshot, good).utility).to.be.greaterThan(m.predictWith(snapshot, bad).utility);
            expect(m.predictWith(snapshot, good).utility).to.be.greaterThan(0);
        });

        it('trains no quality label when no quality signal arrives', async function () {
            const m = manager({ targets: { targets: ['quality'] }, signalWeights: { quality: 1 } });
            await attempt(m, 'u', 'a1', { bias: 1 }, ['accept', 'complete']);
            expect(await m.getTargetModel('quality')).to.deep.equal({});

            await m.recordDecision('u', 'a2', { bias: 1 }, 0, ['t']);
            await m.recordFeedback('a2', { quality: 0.9 });
            expect(Object.keys(await m.getTargetModel('quality')).length).to.be.greaterThan(0);
        });

        it('does not blame the worker for a system fault by default', async function () {
            const m = manager();
            await attempt(m, 'u', 'a1', { bias: 1, 'w:x': 1 }, ['accept']);
            await m.applyOutcome('a1', 'fail', { systemFault: true });
            // No successGivenAcceptance label at all.
            expect(await m.getTargetModel('successGivenAcceptance')).to.deep.equal({});

            const strict = manager({
                targets: { targets: ['successGivenAcceptance'], systemFaultCountsAsFailure: true },
            });
            await strict.recordDecision('u', 'a2', { bias: 1, 'w:x': 1 }, 0, ['t']);
            await strict.applyOutcome('a2', 'accept');
            await strict.applyOutcome('a2', 'fail', { systemFault: true });
            expect(Object.keys(await strict.getTargetModel('successGivenAcceptance')).length).to.be.greaterThan(0);
        });

        it('reads an expiry as non-response before acceptance and as failure after', async function () {
            const m = manager();
            await attempt(m, 'u', 'noresponse', { bias: 1 }, ['expire']);
            expect(Object.keys(await m.getTargetModel('acceptance')).length).to.be.greaterThan(0);
            expect(await m.getTargetModel('successGivenAcceptance')).to.deep.equal({});

            const m2 = manager();
            await m2.recordDecision('u', 'dropped', { bias: 1 }, 0, ['t']);
            await m2.applyOutcome('dropped', 'accept');
            await m2.applyOutcome('dropped', 'expire');
            expect(Object.keys(await m2.getTargetModel('successGivenAcceptance')).length).to.be.greaterThan(0);
        });
    });

    describe('calibration', function () {
        it('produces calibrated acceptance probabilities on held-out outcomes', async function () {
            const m = manager({ learningRate: 0.1, targets: { targets: ['acceptance'] } });
            const rng = seededRng(20260905);
            // Three worker types with genuinely different acceptance rates.
            const arms = [
                { key: 'low', p: 0.2 },
                { key: 'mid', p: 0.5 },
                { key: 'high', p: 0.8 },
            ];
            const featuresFor = (key: string): LearningFeatures => ({ bias: 1, [`w:${key}`]: 1 });

            for (let i = 0; i < 1800; i++) {
                const arm = arms[i % arms.length];
                await m.recordDecision('u', `train-${i}`, featuresFor(arm.key), 0, ['t']);
                await m.applyOutcome(`train-${i}`, rng() < arm.p ? 'accept' : 'reject');
            }

            const snapshot = await m.loadModels();
            let brier = 0;
            let n = 0;
            const bins = new Map<string, { predicted: number; observed: number; n: number }>();
            for (let i = 0; i < 900; i++) {
                const arm = arms[i % arms.length];
                const p = m.predictWith(snapshot, featuresFor(arm.key)).components.acceptance!;
                const outcome = rng() < arm.p ? 1 : 0;
                brier += (p - outcome) ** 2;
                n++;
                const bin = bins.get(arm.key) ?? { predicted: 0, observed: 0, n: 0 };
                bin.predicted += p;
                bin.observed += outcome;
                bin.n++;
                bins.set(arm.key, bin);
            }

            // A constant 0.5 predictor scores 0.25; anything calibrated beats it.
            expect(brier / n).to.be.lessThan(0.22);
            for (const arm of arms) {
                const bin = bins.get(arm.key)!;
                expect(bin.predicted / bin.n, `${arm.key} reliability`).to.be.closeTo(bin.observed / bin.n, 0.15);
            }
        });
    });

    describe('per-attempt evidence accounting', function () {
        function accounting(options: Record<string, any> = {}) {
            return new LearningManager(redisClient, keys, {
                trackTagStats: true,
                rewardAccounting: 'per-attempt',
                ...options,
            });
        }

        it('writes one per-tag observation per attempt, not one per event', async function () {
            const m = accounting();
            await attempt(m, 'ada', 'a1', { bias: 1 }, ['accept', 'complete'], ['english']);
            const [stat] = await m.getUserTagStats('ada');
            expect(stat.count).to.equal(1);
            // The attempt's accrued reward (accept + complete), not just the last event.
            expect(stat.rewardSum).to.be.closeTo(1.3, 1e-9);
        });

        it('revises rather than re-counts when late feedback arrives', async function () {
            const m = accounting({ signalWeights: { csat: 1 } });
            await attempt(m, 'ada', 'a1', { bias: 1 }, ['accept', 'complete'], ['english']);
            const before = (await m.getUserTagStats('ada'))[0];

            expect(await m.recordFeedback('a1', { csat: 0.5 })).to.equal(true);
            const after = (await m.getUserTagStats('ada'))[0];

            expect(after.count).to.equal(before.count);
            expect(after.rewardSum).to.be.closeTo(before.rewardSum + 0.5, 1e-9);
        });

        it('reaches the same aggregate whichever order completion and quality arrive in', async function () {
            const forward = accounting({ signalWeights: { csat: 1 } });
            await attempt(forward, 'u1', 'f1', { bias: 1 }, ['accept', 'complete'], ['t']);
            await forward.recordFeedback('f1', { csat: 0.4 });

            const reverse = accounting({ signalWeights: { csat: 1 } });
            await reverse.recordDecision('u2', 'r1', { bias: 1 }, 0, ['t']);
            await reverse.applyOutcome('r1', 'accept');
            // Quality shaped mid-attempt, then completion closes it.
            await reverse.recordReward('r1', 0.4, { terminal: false, eventId: 'q' });
            await reverse.applyOutcome('r1', 'complete');

            const a = (await forward.getUserTagStats('u1'))[0];
            const b = (await reverse.getUserTagStats('u2'))[0];
            expect(a.count).to.equal(b.count);
            expect(a.rewardSum).to.be.closeTo(b.rewardSum, 1e-9);
        });

        it('does not let duplicate feedback inflate the evidence count', async function () {
            const m = accounting({ signalWeights: { csat: 1 } });
            await attempt(m, 'ada', 'a1', { bias: 1 }, ['accept', 'complete'], ['english']);
            for (let i = 0; i < 5; i++) await m.recordFeedback('a1', { csat: 0.5 }, { eventId: 'csat-1' });
            expect((await m.getUserTagStats('ada'))[0].count).to.equal(1);
        });
    });

    describe('feedback validation', function () {
        const invalid: Array<[string, any]> = [
            ['an empty signal map', {}],
            ['a non-numeric value', { csat: 'good' }],
            ['NaN', { csat: NaN }],
            ['Infinity', { csat: Infinity }],
            ['an out-of-range magnitude', { csat: 1e12 }],
            ['null', null],
        ];

        for (const [name, signals] of invalid) {
            it(`rejects ${name} without writing anything`, async function () {
                const m = manager({ trackTagStats: true });
                await attempt(m, 'ada', 'a1', { bias: 1 }, ['accept', 'complete'], ['english']);
                const before = await m.getStats();

                expect(await m.recordFeedback('a1', signals as any)).to.equal(false);

                const after = await m.getStats();
                expect(after.rewards).to.equal(before.rewards);
                expect(after.invalidFeedback).to.equal(before.invalidFeedback + 1);
            });
        }

        it('accepts a valid signal map', async function () {
            const m = manager({ signalWeights: { csat: 2 } });
            await attempt(m, 'ada', 'a1', { bias: 1 }, ['accept', 'complete'], ['english']);
            expect(await m.recordFeedback('a1', { csat: 0.5 })).to.equal(true);
        });

        it('rejects a non-finite manual reward', async function () {
            const m = manager();
            await attempt(m, 'ada', 'a1', { bias: 1 }, ['accept'], ['english']);
            expect(await m.recordReward('a1', NaN)).to.equal(false);
        });
    });

    describe('matcher integration', function () {
        it('models acceptance and success separately end to end', async function () {
            const matcher = new Matcher(redisClient, {
                maxUserBacklogSize: 10,
                relevantBatchSize: 50,
                redisPrefix: 'test-tgt-m:',
                enableLearning: true,
                learningExplorationRate: 0,
                learningRate: 0.5,
                learningTargets: { targets: ['acceptance', 'successGivenAcceptance'] },
            });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            for (let i = 0; i < 10; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['english'], priority: 10 });
                await matcher.matchUsersAssignments('ada');
                await matcher.acceptAssignment('ada', `a${i}`);
                await matcher.completeAssignment('ada', `a${i}`);
            }

            const acceptance = await redisClient.hGetAll('test-tgt-m:learning:model:acceptance');
            const success = await redisClient.hGetAll('test-tgt-m:learning:model:successGivenAcceptance');
            expect(Object.keys(acceptance).length).to.be.greaterThan(0);
            expect(Object.keys(success).length).to.be.greaterThan(0);
        });
    });
});
