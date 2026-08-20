/**
 * Automatic routing-weight synthesis from per-user tag reward statistics.
 *
 * Supports three policies:
 *
 * - 'ucb1' (default): mean reward plus an exploration bonus that shrinks as
 *   the tag is sampled more.
 * - 'confidence': upper-confidence-bound for the weight AND for the veto
 *   decision — a tag is hard-vetoed only when the whole confidence interval
 *   sits below the threshold, so vetoes are conservative: uncertainty alone
 *   never vetoes.
 * - 'thompson': sample from the per-tag posterior (Gaussian approximation)
 *   when mapping to a weight. The veto decision uses the deterministic mean,
 *   never the draw — a random sample must not flicker good tags into hard
 *   vetoes.
 *
 * Scores map onto the conventional 0-100 routing-weight scale:
 *
 * - tags with enough samples and a sufficiently bad mean/LCB get weight 0
 *   (the matcher's hard-veto semantics),
 * - under-sampled or unobserved known tags get an optimistic `priorWeight`
 *   so the matcher keeps exploring them,
 * - all other tags get a weight proportional to their score, clamped to
 *   [1, maxWeight] so eligible tags never collapse to an accidental veto.
 *
 * Pure module: no Redis access, O(number of tags) per call.
 */
import type { AutoRoutingWeightsOptions, AutoRoutingWeightsPolicy, LearningTagStat } from '../types/matcher';

export const DEFAULT_AUTO_WEIGHTS_OPTIONS: Required<
    Omit<AutoRoutingWeightsOptions, 'priorWeight' | 'maxDeltaPerSync' | 'decayHalfLifeMs' | 'rng'>
> & {
    priorWeight: number;
} = {
    minSamples: 5,
    vetoThreshold: -0.5,
    maxWeight: 100,
    explorationBonus: 0.5,
    priorWeight: 50,
    policy: 'ucb1',
    confidenceZ: 1.96,
    minTotalSamples: 0,
    minSamplesForVeto: 5, // defaults to minSamples for backward compatibility
    terminalOnlyTagStats: false,
};

function resolveOptions(options?: AutoRoutingWeightsOptions): Required<
    Omit<AutoRoutingWeightsOptions, 'priorWeight' | 'maxDeltaPerSync' | 'decayHalfLifeMs' | 'rng'>
> & {
    priorWeight: number;
    maxDeltaPerSync?: number;
    decayHalfLifeMs?: number;
    rng: () => number;
} {
    const maxWeight = options?.maxWeight ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.maxWeight;
    return {
        minSamples: options?.minSamples ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.minSamples,
        vetoThreshold: options?.vetoThreshold ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.vetoThreshold,
        maxWeight,
        explorationBonus: options?.explorationBonus ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.explorationBonus,
        policy: options?.policy ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.policy,
        confidenceZ: options?.confidenceZ ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.confidenceZ,
        minTotalSamples: options?.minTotalSamples ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.minTotalSamples,
        minSamplesForVeto: options?.minSamplesForVeto ?? options?.minSamples ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.minSamples,
        terminalOnlyTagStats: options?.terminalOnlyTagStats ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.terminalOnlyTagStats,
        priorWeight: options?.priorWeight ?? Math.round(maxWeight / 2),
        maxDeltaPerSync: options?.maxDeltaPerSync,
        decayHalfLifeMs: options?.decayHalfLifeMs,
        rng: options?.rng ?? Math.random,
    };
}

function isManualTag(tag: string, existingWeights?: Record<string, number>): boolean {
    return !!existingWeights && tag in existingWeights;
}

function canVeto(
    policy: AutoRoutingWeightsPolicy,
    stat: LearningTagStat,
    vetoScore: number,
    opts: ReturnType<typeof resolveOptions>,
    existingWeights?: Record<string, number>,
): boolean {
    const manual = isManualTag(stat.tag, existingWeights);
    const effectiveMinSamples = manual ? opts.minSamplesForVeto : opts.minSamples;
    if (stat.count < effectiveMinSamples) return false;

    return vetoScore <= opts.vetoThreshold;
}

function tagScore(
    policy: AutoRoutingWeightsPolicy,
    stat: LearningTagStat,
    totalCount: number,
    opts: ReturnType<typeof resolveOptions>,
): { ucb: number; lcb: number; sample: number } {
    const mean = stat.meanReward;
    const se = stat.standardError ?? 0;

    if (policy === 'confidence') {
        const z = opts.confidenceZ;
        return { ucb: mean + z * se, lcb: mean - z * se, sample: mean };
    }

    if (policy === 'thompson') {
        // Gaussian Thompson sample: mean + Z(rng) * se, where Z is the normal
        // inverse CDF approximated by the Acklam/Bailey approximation.
        const sample = se > 0 ? mean + acklamInverseNormal(opts.rng()) * se : mean;
        return { ucb: sample, lcb: sample, sample };
    }

    // 'ucb1'
    const ucb = mean + opts.explorationBonus * Math.sqrt(Math.log(totalCount + 1) / stat.count);
    return { ucb, lcb: mean, sample: ucb };
}

function normalizedWeight(score: number, maxWeight: number): number {
    const normalized = (Math.min(Math.max(score, -1), 1) + 1) / 2;
    return Math.max(1, Math.round(normalized * maxWeight));
}

/**
 * Acklam/Bailey approximation of the standard-normal quantile function.
 * Maps p in (0, 1) to a z-score. Used for Thompson sampling without pulling
 * in a statistics dependency.
 */
function acklamInverseNormal(p: number): number {
    if (p <= 0) return -6;
    if (p >= 1) return 6;

    const a1 = -39.6968302866538;
    const a2 = 220.946098424521;
    const a3 = -275.928510446969;
    const a4 = 138.357751867269;
    const a5 = -30.6647980661472;
    const a6 = 2.50662827745924;

    const b1 = -54.4760987982241;
    const b2 = 161.585836858041;
    const b3 = -155.698979859887;
    const b4 = 66.8013118877197;
    const b5 = -13.2806815528857;

    const c1 = -0.00778489400243029;
    const c2 = -0.322396458441136;
    const c3 = -2.40075827716184;
    const c4 = -2.54973253934373;
    const c5 = 4.37466414146497;
    const c6 = 2.93816398269878;

    const d1 = 0.00778469570904146;
    const d2 = 0.32246712907004;
    const d3 = 2.445134137143;
    const d4 = 3.75440866190742;

    const pLow = 0.02425;
    const pHigh = 1 - pLow;

    let q: number;
    let r: number;

    if (p < pLow) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
    }

    if (p <= pHigh) {
        q = p - 0.5;
        r = q * q;
        return (
            ((((((a1 * r + a2) * r + a3) * r + a4) * r + a5) * r + a6) * q) /
            (((((b1 * r + b2) * r + b3) * r + b4) * r + b5) * r + 1)
        );
    }

    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c1 * q + c2) * q + c3) * q + c4) * q + c5) * q + c6) / ((((d1 * q + d2) * q + d3) * q + d4) * q + 1);
}

/**
 * Synthesize a routingWeights map from per-tag reward statistics.
 *
 * @param stats per-user tag reward statistics (from learned outcomes)
 * @param options synthesis policy and tuning (merged with defaults)
 * @param knownTags optional tags to include even without observations;
 *                  unobserved known tags receive the optimistic prior weight
 * @param existingWeights optional current routingWeights of the user;
 *                  used as the per-tag prior for under-sampled or unobserved
 *                  tags instead of the flat `priorWeight` when provided
 */
export function synthesizeRoutingWeights(
    stats: LearningTagStat[],
    options?: AutoRoutingWeightsOptions,
    knownTags?: string[],
    existingWeights?: Record<string, number>,
): Record<string, number> {
    const opts = resolveOptions(options);

    const totalCount = stats.reduce((sum, s) => sum + s.count, 0);
    if (opts.minTotalSamples > 0 && totalCount < opts.minTotalSamples) {
        return {};
    }

    const weights: Record<string, number> = {};

    for (const stat of stats) {
        if (stat.count < opts.minSamples) {
            // Not enough evidence yet: use the existing weight as a warm
            // prior if available, otherwise fall back to the flat prior.
            weights[stat.tag] = existingWeights?.[stat.tag] ?? opts.priorWeight;
            continue;
        }

        const { ucb, lcb, sample } = tagScore(opts.policy, stat, totalCount, opts);
        const weightScore = opts.policy === 'thompson' ? sample : ucb;
        // Veto decisions are deterministic and conservative: 'confidence'
        // requires the WHOLE interval below the threshold (ucb), 'thompson'
        // and 'ucb1' judge the raw mean — never a random draw, never an
        // uncertainty-widened lower bound.
        const vetoScore = opts.policy === 'confidence' ? ucb : stat.meanReward;

        if (canVeto(opts.policy, stat, vetoScore, opts, existingWeights)) {
            weights[stat.tag] = 0;
            continue;
        }

        // Map score (clamped to [-1, 1]) onto [1, maxWeight].
        weights[stat.tag] = normalizedWeight(weightScore, opts.maxWeight);
    }

    if (knownTags) {
        for (const tag of knownTags) {
            if (!(tag in weights)) weights[tag] = existingWeights?.[tag] ?? opts.priorWeight;
        }
    }

    // Tags the user already had weights for are treated as implicitly known:
    // keep the existing value until sufficient evidence overrides it.
    if (existingWeights) {
        for (const [tag, existing] of Object.entries(existingWeights)) {
            if (!(tag in weights)) weights[tag] = existing;
        }
    }

    return weights;
}
