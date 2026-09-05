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
import type {
    AutoRoutingWeightsOptions,
    AutoRoutingWeightsPolicy,
    AutoWeightExplanation,
    LearningTagStat,
} from '../types/matcher';

type OptionalAutoWeightsKeys =
    | 'priorWeight'
    | 'maxDeltaPerSync'
    | 'decayHalfLifeMs'
    | 'rng'
    | 'priorVariance'
    | 'vetoCooldownMs'
    | 'totalAttempts';

export const DEFAULT_AUTO_WEIGHTS_OPTIONS: Required<Omit<AutoRoutingWeightsOptions, OptionalAutoWeightsKeys>> & {
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
    rewardModel: 'gaussian',
    rewardRange: [-1, 1],
    priorStrength: 2,
};

type ResolvedAutoWeightsOptions = Required<Omit<AutoRoutingWeightsOptions, OptionalAutoWeightsKeys>> & {
    priorWeight: number;
    maxDeltaPerSync?: number;
    decayHalfLifeMs?: number;
    vetoCooldownMs?: number;
    totalAttempts?: number;
    priorVariance: number;
    rng: () => number;
};

function resolveOptions(options?: AutoRoutingWeightsOptions): ResolvedAutoWeightsOptions {
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
        vetoCooldownMs: options?.vetoCooldownMs,
        totalAttempts: options?.totalAttempts,
        rewardModel: options?.rewardModel ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.rewardModel,
        rewardRange: options?.rewardRange ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.rewardRange,
        priorStrength: options?.priorStrength ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.priorStrength,
        // Variance of a uniform draw over the reward range is (range^2)/12;
        // (range/4)^2 is the slightly wider, deliberately conservative
        // default — a prior that is too tight is a prior that vetoes.
        priorVariance:
            options?.priorVariance ??
            Math.pow(
                ((options?.rewardRange ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.rewardRange)[1] -
                    (options?.rewardRange ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.rewardRange)[0]) /
                    4,
                2,
            ),
        rng: options?.rng ?? Math.random,
    };
}

function isManualTag(tag: string, existingWeights?: Record<string, number>): boolean {
    return !!existingWeights && tag in existingWeights;
}

/**
 * Evidence backing a tag, in independent attempts.
 *
 * The decayed weight sum (`count`) is NOT a sample size: scaling every weight
 * equally leaves it looking like fewer observations than were actually seen,
 * and after a long idle period it approaches zero without anything having
 * been learned or forgotten in kind. Sample floors are therefore judged
 * against, in order of preference: the never-decayed lifetime attempt count,
 * the Kish effective sample size, and only then the raw count.
 */
function evidence(stat: LearningTagStat): number {
    if (typeof stat.attempts === 'number' && stat.attempts > 0) return stat.attempts;
    if (typeof stat.effectiveSampleSize === 'number' && stat.effectiveSampleSize > 0) return stat.effectiveSampleSize;
    return stat.count;
}

/** Posterior over a tag's mean reward, always with non-zero uncertainty. */
interface Posterior {
    mean: number;
    /** Standard error of the posterior mean */
    se: number;
    /** Beta parameters, when the reward model is Bernoulli */
    alpha?: number;
    beta?: number;
}

/**
 * Prior-backed posterior over the mean reward.
 *
 * The pre-1.16 code took `sqrt(variance / count)` straight from the observed
 * moments, so five identical observations produced variance 0 and therefore a
 * confidence interval of zero width — total certainty from five samples, and
 * the `'confidence'` policy would hard-veto on it. A prior floor is what
 * makes "I have seen the same thing five times" different from "I know".
 */
function posterior(stat: LearningTagStat, opts: ResolvedAutoWeightsOptions): Posterior {
    const n = Math.max(0, evidence(stat));
    const k = Math.max(0, opts.priorStrength);
    const [lo, hi] = opts.rewardRange;

    if (opts.rewardModel === 'bernoulli') {
        // Rescale rewards into [0, 1] and treat the tag as a Beta-Bernoulli
        // arm. Only sound when the reward genuinely is a success indicator —
        // applying Bernoulli formulas to arbitrary continuous rewards is the
        // error this option exists to make explicit rather than implicit.
        const span = hi - lo || 1;
        const p = Math.max(0, Math.min(1, (stat.meanReward - lo) / span));
        const alpha = 1 + p * n;
        const beta = 1 + (1 - p) * n;
        const total = alpha + beta;
        const mean = alpha / total;
        const variance = (alpha * beta) / (total * total * (total + 1));
        return { mean: lo + mean * span, se: Math.sqrt(variance) * span, alpha, beta };
    }

    const observedVariance = stat.variance ?? opts.priorVariance;
    // Normal-inverse-chi-square style shrinkage: the prior contributes k
    // pseudo-observations of variance priorVariance.
    const varPost = (n * observedVariance + k * opts.priorVariance) / (n + k);
    const priorMean = (lo + hi) / 2;
    const mean = (n * stat.meanReward + k * priorMean) / (n + k);
    return { mean, se: Math.sqrt(varPost / (n + k)) };
}

/** Marsaglia-Tsang gamma sampler (shape >= 1 via boost for shape < 1). */
function sampleGamma(shape: number, rng: () => number): number {
    if (shape < 1) return sampleGamma(shape + 1, rng) * Math.pow(Math.max(rng(), 1e-12), 1 / shape);
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    for (let i = 0; i < 1000; i++) {
        const z = acklamInverseNormal(rng());
        const v = Math.pow(1 + c * z, 3);
        if (v <= 0) continue;
        const u = Math.max(rng(), 1e-12);
        if (Math.log(u) < 0.5 * z * z + d - d * v + d * Math.log(v)) return d * v;
    }
    return d;
}

/** Beta draw as the ratio of two gamma draws. */
function sampleBeta(alpha: number, beta: number, rng: () => number): number {
    const x = sampleGamma(alpha, rng);
    const y = sampleGamma(beta, rng);
    return x + y > 0 ? x / (x + y) : 0.5;
}

/**
 * Whether a learned veto is admissible for a tag.
 *
 * `minSamplesForVeto` applies to learned and manually-weighted tags alike:
 * the floor exists because a hard veto removes eligibility outright, and that
 * consequence does not depend on where the previous weight came from. (It
 * still defaults to `minSamples`, so nothing changes for callers that never
 * set it.)
 */
function canVeto(
    stat: LearningTagStat,
    vetoScore: number,
    opts: ResolvedAutoWeightsOptions,
    now: number,
): { veto: boolean; cooldown: boolean } {
    if (evidence(stat) < opts.minSamplesForVeto) return { veto: false, cooldown: false };

    // A veto with no recovery path is permanent exclusion. When a cooldown is
    // configured and the last observation predates it, the tag is released
    // for reassessment instead of staying vetoed on stale evidence.
    if (opts.vetoCooldownMs !== undefined && stat.lastUpdatedAt && now - stat.lastUpdatedAt > opts.vetoCooldownMs) {
        return { veto: false, cooldown: true };
    }

    return { veto: vetoScore <= opts.vetoThreshold, cooldown: false };
}

function tagScore(
    policy: AutoRoutingWeightsPolicy,
    stat: LearningTagStat,
    totalCount: number,
    opts: ResolvedAutoWeightsOptions,
): { ucb: number; lcb: number; sample: number; post: Posterior } {
    const post = posterior(stat, opts);
    const mean = post.mean;
    const se = post.se;

    if (policy === 'confidence') {
        const z = opts.confidenceZ;
        return { ucb: mean + z * se, lcb: mean - z * se, sample: mean, post };
    }

    if (policy === 'thompson') {
        let sample: number;
        if (opts.rewardModel === 'bernoulli' && post.alpha !== undefined && post.beta !== undefined) {
            const [lo, hi] = opts.rewardRange;
            sample = lo + sampleBeta(post.alpha, post.beta, opts.rng) * (hi - lo);
        } else {
            // Gaussian Thompson draw: mean + Z(rng) * se, where Z is the
            // normal inverse CDF (Acklam/Bailey approximation). The posterior
            // se is prior-backed, so the draw is never degenerate.
            sample = mean + acklamInverseNormal(opts.rng()) * se;
        }
        return { ucb: sample, lcb: sample, sample, post };
    }

    // 'ucb1' — kept bit-compatible with the pre-1.16 formula (raw observed
    // mean, raw count) so existing deployments' weights do not shift.
    const ucb = stat.meanReward + opts.explorationBonus * Math.sqrt(Math.log(totalCount + 1) / Math.max(1e-9, stat.count));
    return { ucb, lcb: stat.meanReward, sample: ucb, post };
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
    const weights: Record<string, number> = {};
    for (const row of explainRoutingWeights(stats, options, knownTags, existingWeights)) {
        weights[row.tag] = row.weight;
    }
    return weights;
}

/**
 * The same synthesis, with the reasoning attached: estimate, uncertainty,
 * evidence, last observation, decay settings and next reassessment per tag.
 *
 * A hard veto changes who can be given work at all, so "the model said so"
 * is not an adequate account of it. `synthesizeRoutingWeights` is this
 * function with the explanations dropped.
 */
export function explainRoutingWeights(
    stats: LearningTagStat[],
    options?: AutoRoutingWeightsOptions,
    knownTags?: string[],
    existingWeights?: Record<string, number>,
    now: number = Date.now(),
): AutoWeightExplanation[] {
    const opts = resolveOptions(options);

    // Worker-level evidence floors count independent attempts. Summing
    // per-tag counts would let one assignment carrying five tags clear a
    // five-sample floor on its own — correlated evidence, counted five times.
    const totalCount = opts.totalAttempts ?? stats.reduce((sum, s) => sum + s.count, 0);
    if (opts.minTotalSamples > 0 && totalCount < opts.minTotalSamples) {
        return [];
    }
    const explorationTotal = stats.reduce((sum, s) => sum + s.count, 0);

    const rows: AutoWeightExplanation[] = [];
    const seen = new Set<string>();

    for (const stat of stats) {
        seen.add(stat.tag);
        const attempts = evidence(stat);
        const base: AutoWeightExplanation = {
            tag: stat.tag,
            weight: 0,
            decision: 'scored',
            attempts: stat.attempts,
            effectiveSampleSize: stat.effectiveSampleSize,
            lastObservedAt: stat.lastUpdatedAt,
            decayHalfLifeMs: opts.decayHalfLifeMs,
        };

        if (attempts < opts.minSamples) {
            rows.push({
                ...base,
                decision: 'insufficient-evidence',
                weight: existingWeights?.[stat.tag] ?? opts.priorWeight,
            });
            continue;
        }

        const { ucb, sample, post } = tagScore(opts.policy, stat, explorationTotal, opts);
        const weightScore = opts.policy === 'thompson' ? sample : ucb;
        // Veto decisions are deterministic and conservative: 'confidence'
        // requires the WHOLE interval below the threshold (ucb), 'thompson'
        // and 'ucb1' judge the raw mean — never a random draw, never an
        // uncertainty-widened lower bound.
        const vetoScore = opts.policy === 'confidence' ? ucb : stat.meanReward;
        const z = opts.confidenceZ;

        const detail: AutoWeightExplanation = {
            ...base,
            estimate: post.mean,
            uncertainty: post.se,
            lowerBound: post.mean - z * post.se,
            upperBound: post.mean + z * post.se,
        };

        const { veto, cooldown } = canVeto(stat, vetoScore, opts, now);
        if (veto) {
            rows.push({ ...detail, decision: 'veto', weight: 0 });
            continue;
        }
        if (cooldown) {
            rows.push({
                ...detail,
                decision: 'cooldown',
                weight: existingWeights?.[stat.tag] ?? opts.priorWeight,
                reassessAt: stat.lastUpdatedAt !== undefined ? stat.lastUpdatedAt + (opts.vetoCooldownMs ?? 0) : undefined,
            });
            continue;
        }

        rows.push({ ...detail, weight: normalizedWeight(weightScore, opts.maxWeight) });
    }

    if (knownTags) {
        for (const tag of knownTags) {
            if (seen.has(tag)) continue;
            seen.add(tag);
            rows.push({ tag, weight: existingWeights?.[tag] ?? opts.priorWeight, decision: 'unobserved' });
        }
    }

    // Tags the user already had weights for are treated as implicitly known:
    // keep the existing value until sufficient evidence overrides it.
    if (existingWeights) {
        for (const [tag, existing] of Object.entries(existingWeights)) {
            if (seen.has(tag)) continue;
            seen.add(tag);
            rows.push({ tag, weight: existing, decision: 'prior' });
        }
    }

    return rows;
}
