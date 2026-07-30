import { expect } from 'chai';
import { synthesizeRoutingWeights } from '../src/learning/auto-weights';
import type { LearningTagStat } from '../src/types/matcher';

describe('synthesizeRoutingWeights (v2 policies)', function () {
    function stat(
        tag: string,
        count: number,
        rewardSum: number,
        rewardSqSum?: number,
        standardError?: number,
    ): LearningTagStat {
        return {
            tag,
            count,
            rewardSum,
            meanReward: count > 0 ? rewardSum / count : 0,
            rewardSqSum,
            standardError,
        };
    }

    describe('UCB1 parity (default policy)', function () {
        it('matches the historical behavior for representative cases', function () {
            const weights = synthesizeRoutingWeights([stat('english', 20, 18), stat('billing', 20, -16)], {
                minSamples: 5,
                vetoThreshold: -0.5,
            });
            expect(weights.english).to.be.greaterThan(50);
            expect(weights.billing).to.equal(0);
        });

        it('uses raw mean for veto even when exploration bonus would lift the ucb', function () {
            // mean is bad (-0.9) but only 5 samples, so exploration bonus is large.
            // Veto must still fire because it uses raw mean.
            const weights = synthesizeRoutingWeights([stat('bad', 5, -4.5)], {
                minSamples: 5,
                vetoThreshold: -0.5,
                explorationBonus: 2,
            });
            expect(weights.bad).to.equal(0);
        });
    });

    describe('confidence policy', function () {
        it('vetoes only when the lower confidence bound is below threshold', function () {
            // Low variance, mean just above threshold: LCB stays above -0.5, no veto.
            const weights = synthesizeRoutingWeights([stat('stable', 10, -4, 1.6, 0)], {
                policy: 'confidence',
                minSamples: 5,
                vetoThreshold: -0.5,
                confidenceZ: 1.96,
            });
            expect(weights.stable).to.be.greaterThan(0);
        });

        it('vetoes a low-variance bad tag via the LCB', function () {
            const weights = synthesizeRoutingWeights([stat('bad', 50, -45, 45, 0.05)], {
                policy: 'confidence',
                minSamples: 5,
                vetoThreshold: -0.5,
                confidenceZ: 1.96,
            });
            expect(weights.bad).to.equal(0);
        });

        it('gives higher weight to tags with higher UCB', function () {
            const weights = synthesizeRoutingWeights([stat('great', 50, 48, 48, 0.02), stat('okay', 50, 30, 30, 0.1)], {
                policy: 'confidence',
                minSamples: 5,
                vetoThreshold: -0.5,
            });
            expect(weights.great).to.be.greaterThan(weights.okay);
        });
    });

    describe('Thompson policy', function () {
        it('is deterministic when a seeded rng is supplied', function () {
            const rng = seededRng(12345);
            const weights1 = synthesizeRoutingWeights([stat('t', 20, 10, 10, 0.1)], {
                policy: 'thompson',
                minSamples: 5,
                rng,
            });
            const weights2 = synthesizeRoutingWeights([stat('t', 20, 10, 10, 0.1)], {
                policy: 'thompson',
                minSamples: 5,
                rng: seededRng(12345),
            });
            expect(weights1.t).to.equal(weights2.t);
        });

        it('vetoes when the posterior sample is below threshold', function () {
            // Seeded draw that yields a sample below -0.5 for a bad mean.
            const weights = synthesizeRoutingWeights([stat('bad', 50, -45, 45, 0.01)], {
                policy: 'thompson',
                minSamples: 5,
                vetoThreshold: -0.5,
                rng: seededRng(1),
            });
            expect(weights.bad).to.equal(0);
        });
    });

    describe('strict veto gate', function () {
        it('does not veto a manual tag until the higher veto sample bar is met', function () {
            const weights = synthesizeRoutingWeights(
                [stat('manual-bad', 4, -3.6)], // count below minSamples=5, so prior is kept
                { minSamples: 5, vetoThreshold: -0.5, minSamplesForVeto: 20 },
                undefined,
                { 'manual-bad': 80 },
            );
            expect(weights['manual-bad']).to.equal(80);
        });

        it('vetoes a manual tag once the veto sample bar is met and mean is bad', function () {
            const weights = synthesizeRoutingWeights(
                [stat('manual-bad', 25, -22.5)],
                { minSamples: 5, vetoThreshold: -0.5, minSamplesForVeto: 20 },
                undefined,
                { 'manual-bad': 80 },
            );
            expect(weights['manual-bad']).to.equal(0);
        });

        it('still vetoes learned-only tags at the normal sample bar', function () {
            const weights = synthesizeRoutingWeights([stat('learned-bad', 5, -4.5)], {
                minSamples: 5,
                vetoThreshold: -0.5,
                minSamplesForVeto: 20,
            });
            expect(weights['learned-bad']).to.equal(0);
        });
    });

    describe('evidence floor', function () {
        it('returns an empty map when total samples are below minTotalSamples', function () {
            const weights = synthesizeRoutingWeights([stat('x', 2, 2)], { minSamples: 1, minTotalSamples: 10 });
            expect(weights).to.deep.equal({});
        });

        it('produces weights when total samples meet minTotalSamples', function () {
            const weights = synthesizeRoutingWeights([stat('x', 10, 10)], { minSamples: 1, minTotalSamples: 10 });
            expect(weights.x).to.be.greaterThan(0);
        });
    });

    describe('known tags / existing weights', function () {
        it('keeps unobserved known tags at the existing weight when available', function () {
            const weights = synthesizeRoutingWeights([], { priorWeight: 30 }, ['dutch'], { dutch: 60 });
            expect(weights.dutch).to.equal(60);
        });

        it('falls back to the flat prior for unknown unobserved tags', function () {
            const weights = synthesizeRoutingWeights([], { priorWeight: 30 }, ['dutch']);
            expect(weights.dutch).to.equal(30);
        });
    });
});

function seededRng(seed: number): () => number {
    let state = seed >>> 0;
    return () => {
        state = (1664525 * state + 1013904223) >>> 0;
        return state / 0xffffffff;
    };
}
