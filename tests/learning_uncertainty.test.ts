import { explainRoutingWeights, synthesizeRoutingWeights } from '../src/learning/auto-weights';
import Matcher from '../src/matcher.class';
import { createTestClient } from './helpers/redis';
import { expect } from 'chai';
import type { LearningTagStat } from '../src/types/matcher';

function seededRng(seed: number) {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0x100000000;
    };
}

/** Build a tag stat from raw observations, exactly as the manager would. */
function statFrom(tag: string, rewards: number[], overrides: Partial<LearningTagStat> = {}): LearningTagStat {
    const count = rewards.length;
    const rewardSum = rewards.reduce((a, b) => a + b, 0);
    const rewardSqSum = rewards.reduce((a, b) => a + b * b, 0);
    const meanReward = count > 0 ? rewardSum / count : 0;
    const variance = count > 0 ? Math.max(0, rewardSqSum / count - meanReward * meanReward) : 0;
    return {
        tag,
        count,
        effectiveSampleSize: count,
        attempts: count,
        rewardSum,
        rewardSqSum,
        meanReward,
        variance,
        standardError: count > 0 ? Math.sqrt(variance / count) : 0,
        lastUpdatedAt: Date.now(),
        ...overrides,
    };
}

describe('Learning - prior-backed uncertainty and veto recovery', function () {
    describe('posterior uncertainty', function () {
        it('keeps non-zero uncertainty after five identical failures', function () {
            const [row] = explainRoutingWeights([statFrom('bad', [-1, -1, -1, -1, -1])], {
                policy: 'confidence',
                minSamples: 5,
            });
            // The raw moments give variance 0; the prior is what stops five
            // coincident observations reading as certainty.
            expect(row.uncertainty!).to.be.greaterThan(0);
            expect(row.upperBound!).to.be.greaterThan(row.estimate!);
        });

        it('does not become infinitely certain after identical successes either', function () {
            const [row] = explainRoutingWeights([statFrom('good', new Array(50).fill(1))], {
                policy: 'confidence',
                minSamples: 5,
            });
            expect(row.uncertainty!).to.be.greaterThan(0);
        });

        it('shrinks uncertainty as evidence accumulates', function () {
            const few = explainRoutingWeights([statFrom('t', [1, -1, 1, -1, 1])], { policy: 'confidence' })[0];
            const many = explainRoutingWeights(
                [
                    statFrom(
                        't',
                        Array.from({ length: 200 }, (_, i) => (i % 2 ? 1 : -1)),
                    ),
                ],
                { policy: 'confidence' },
            )[0];
            expect(many.uncertainty!).to.be.lessThan(few.uncertainty!);
        });

        it('does not veto on uncertainty alone', function () {
            // A bad mean but only two observations: below the sample floor.
            const weights = synthesizeRoutingWeights([statFrom('maybe', [-1, -1])], {
                policy: 'confidence',
                minSamples: 5,
                vetoThreshold: -0.5,
            });
            expect(weights.maybe).to.be.greaterThan(0);
        });

        it('vetoes only when the whole interval sits below the threshold', function () {
            const borderline = statFrom('b', [-1, -1, -1, -1, -1, -1, -1, -1, 0, 0]);
            const wide = synthesizeRoutingWeights([borderline], {
                policy: 'confidence',
                minSamples: 5,
                vetoThreshold: -0.5,
                confidenceZ: 1.96,
            });
            const narrow = synthesizeRoutingWeights([borderline], {
                policy: 'confidence',
                minSamples: 5,
                vetoThreshold: -0.5,
                confidenceZ: 0,
            });
            // With a wide interval the upper bound clears the threshold, so no
            // veto; collapse the interval and the same data vetoes.
            expect(wide.b).to.be.greaterThan(0);
            expect(narrow.b).to.equal(0);
        });
    });

    describe('Thompson draws', function () {
        it('an unlucky draw never causes a veto', function () {
            const good = statFrom('good', new Array(30).fill(0.8));
            let vetoes = 0;
            const rng = seededRng(4242);
            for (let i = 0; i < 3000; i++) {
                const weights = synthesizeRoutingWeights([good], {
                    policy: 'thompson',
                    minSamples: 5,
                    vetoThreshold: -0.5,
                    rng,
                });
                if (weights.good === 0) vetoes++;
            }
            expect(vetoes).to.equal(0);
        });

        it('draws vary around the posterior mean and are seed-reproducible', function () {
            const stat = statFrom('t', [1, -1, 1, -1, 0.5, -0.5, 0.2, -0.2]);
            const draw = (seed: number) =>
                synthesizeRoutingWeights([stat], { policy: 'thompson', minSamples: 5, rng: seededRng(seed) }).t;
            expect(draw(1)).to.equal(draw(1));
            const samples = Array.from({ length: 200 }, (_, i) => draw(i + 1));
            expect(new Set(samples).size).to.be.greaterThan(1);
        });

        it('covers the true mean at roughly the nominal rate (seeded Monte Carlo)', function () {
            // Bernoulli-ish arm with true mean 0.4 on a [-1, 1] reward scale.
            const rng = seededRng(20260905);
            const trueMean = 0.4;
            let covered = 0;
            const trials = 400;
            for (let t = 0; t < trials; t++) {
                const rewards = Array.from({ length: 60 }, () => (rng() < (trueMean + 1) / 2 ? 1 : -1));
                const [row] = explainRoutingWeights([statFrom('t', rewards)], {
                    policy: 'confidence',
                    minSamples: 5,
                    confidenceZ: 1.96,
                });
                if (row.lowerBound! <= trueMean && trueMean <= row.upperBound!) covered++;
            }
            // Prior-backed intervals are deliberately a little conservative.
            expect(covered / trials).to.be.greaterThan(0.9);
        });

        it('supports an explicit Beta-Bernoulli posterior for success-indicator rewards', function () {
            const [row] = explainRoutingWeights([statFrom('t', new Array(20).fill(1))], {
                policy: 'confidence',
                rewardModel: 'bernoulli',
                rewardRange: [-1, 1],
                minSamples: 5,
            });
            expect(row.uncertainty!).to.be.greaterThan(0);
            expect(row.estimate!).to.be.greaterThan(0.5);
            expect(row.estimate!).to.be.at.most(1);
        });
    });

    describe('evidence floors count independent attempts', function () {
        it('does not let one multi-tag attempt clear a worker-level floor', function () {
            // One attempt carrying five tags: five per-tag observations, but
            // only one independent attempt.
            const stats = ['a', 'b', 'c', 'd', 'e'].map((t) => statFrom(t, [1]));
            const withoutAttempts = synthesizeRoutingWeights(stats, { minSamples: 1, minTotalSamples: 5 });
            expect(Object.keys(withoutAttempts).length).to.be.greaterThan(0);

            const withAttempts = synthesizeRoutingWeights(stats, {
                minSamples: 1,
                minTotalSamples: 5,
                totalAttempts: 1,
            });
            expect(withAttempts).to.deep.equal({});
        });

        it('judges the veto floor against the never-decayed attempt count', function () {
            // Decay has shrunk the weight sum well below the floor, but the
            // worker really did have 30 attempts.
            const decayed = statFrom('t', new Array(30).fill(-1), {
                count: 1.2,
                effectiveSampleSize: 0.9,
                attempts: 30,
            });
            expect(synthesizeRoutingWeights([decayed], { minSamples: 5, vetoThreshold: -0.5 }).t).to.equal(0);
        });

        it('reports the effective sample size, not the decayed weight sum, as evidence', function () {
            const [row] = explainRoutingWeights([
                statFrom('t', new Array(10).fill(1), { count: 4, effectiveSampleSize: 2.5, attempts: 10 }),
            ]);
            expect(row.effectiveSampleSize).to.equal(2.5);
            expect(row.attempts).to.equal(10);
        });
    });

    describe('veto recovery', function () {
        it('lapses a veto once the cooldown has passed since the last observation', function () {
            const stale = statFrom('t', new Array(20).fill(-1), { lastUpdatedAt: Date.now() - 10_000 });
            const withoutCooldown = explainRoutingWeights([stale], { minSamples: 5, vetoThreshold: -0.5 })[0];
            expect(withoutCooldown.decision).to.equal('veto');
            expect(withoutCooldown.weight).to.equal(0);

            const withCooldown = explainRoutingWeights([stale], {
                minSamples: 5,
                vetoThreshold: -0.5,
                vetoCooldownMs: 5_000,
            })[0];
            expect(withCooldown.decision).to.equal('cooldown');
            expect(withCooldown.weight).to.be.greaterThan(0);
            expect(withCooldown.reassessAt).to.be.a('number');
        });

        it('keeps vetoing while the cooldown has not elapsed', function () {
            const fresh = statFrom('t', new Array(20).fill(-1), { lastUpdatedAt: Date.now() - 100 });
            const row = explainRoutingWeights([fresh], {
                minSamples: 5,
                vetoThreshold: -0.5,
                vetoCooldownMs: 60_000,
            })[0];
            expect(row.decision).to.equal('veto');
        });

        it('explains every tag it touches', function () {
            const rows = explainRoutingWeights(
                [statFrom('good', new Array(10).fill(1)), statFrom('thin', [1])],
                { minSamples: 5 },
                ['never-seen'],
                { manual: 42 },
            );
            const byTag = Object.fromEntries(rows.map((r) => [r.tag, r]));
            expect(byTag.good.decision).to.equal('scored');
            expect(byTag.thin.decision).to.equal('insufficient-evidence');
            expect(byTag['never-seen'].decision).to.equal('unobserved');
            expect(byTag.manual.decision).to.equal('prior');
            expect(byTag.manual.weight).to.equal(42);
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
                redisPrefix: 'test-unc:',
                enableLearning: true,
                enableAutoRoutingWeights: true,
                learningExplorationRate: 0,
                ...options,
            });
        }

        it('counts one attempt per assignment however many tags it carries', async function () {
            const matcher = createMatcher({ learningRewardAccounting: 'per-attempt' });
            await matcher.addUser({ id: 'ada', tags: ['a', 'b', 'c'] });
            await matcher.addAssignment({ id: 'x1', tags: ['a', 'b', 'c'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            await matcher.acceptAssignment('ada', 'x1');
            await matcher.completeAssignment('ada', 'x1');

            const total = await (matcher as any).learning.getUserAttemptTotal('ada');
            expect(total).to.equal(1);
            const stats = await matcher.getLearnedTagStats('ada');
            const byTag = Object.fromEntries(stats.map((s) => [s.tag, s.count]));
            expect(byTag.a).to.equal(1);
            expect(byTag.b).to.equal(1);
            expect(byTag.c).to.equal(1);
        });

        it('exposes the reasoning behind a synthesized weight', async function () {
            const matcher = createMatcher({ autoRoutingWeights: { policy: 'confidence', minSamples: 1 } });
            await matcher.addUser({ id: 'ada', tags: ['english'] });
            await matcher.addAssignment({ id: 'x1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            await matcher.acceptAssignment('ada', 'x1');
            await matcher.completeAssignment('ada', 'x1');

            const rows = await matcher.explainLearnedRoutingWeights('ada');
            const english = rows.find((r) => r.tag === 'english')!;
            expect(english.decision).to.equal('scored');
            expect(english.uncertainty).to.be.greaterThan(0);
            expect(english.lastObservedAt).to.be.a('number');
        });

        it('lets a recovered worker return to eligibility without touching operator vetoes', async function () {
            const matcher = createMatcher({
                autoRoutingWeights: { minSamples: 1, vetoThreshold: -0.1, vetoCooldownMs: 1 },
            });
            await matcher.addUser({ id: 'ada', tags: ['english'], routingWeights: { english: 60, banned: 0 } });
            await matcher.addAssignment({ id: 'x1', tags: ['english'], priority: 10 });
            await matcher.matchUsersAssignments('ada');
            await matcher.rejectAssignment('ada', 'x1');

            await new Promise((r) => setTimeout(r, 10));
            await matcher.syncLearnedRoutingWeights('ada');

            const user = await matcher.getUser('ada');
            // The learned veto has lapsed into reassessment...
            expect(user!.routingWeights!.english).to.be.greaterThan(0);
            // ...but the operator's own hard veto is untouched.
            expect(user!.routingWeights!.banned).to.equal(0);
        });
    });
});
