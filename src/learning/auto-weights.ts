/**
 * Automatic routing-weight synthesis from per-user tag reward statistics.
 *
 * Implements a UCB1-style bandit policy over tags: each tag's score is its
 * mean observed reward plus an exploration bonus that shrinks as the tag is
 * sampled more. Scores map onto the conventional 0-100 routing-weight scale:
 *
 * - tags with enough samples and a mean reward at/below `vetoThreshold` get
 *   weight 0 (the matcher's hard-veto semantics),
 * - under-sampled or unobserved known tags get an optimistic `priorWeight`
 *   so the matcher keeps exploring them,
 * - all other tags get a weight proportional to their UCB score, clamped to
 *   [1, maxWeight] so eligible tags never collapse to an accidental veto.
 *
 * Pure module: no Redis access, O(number of tags) per call.
 */
import type { AutoRoutingWeightsOptions, LearningTagStat } from '../types/matcher';

export const DEFAULT_AUTO_WEIGHTS_OPTIONS: Required<Omit<AutoRoutingWeightsOptions, 'priorWeight'>> = {
    minSamples: 5,
    vetoThreshold: -0.5,
    maxWeight: 100,
    explorationBonus: 0.5,
};

/**
 * Synthesize a routingWeights map from per-tag reward statistics.
 *
 * @param stats per-user tag reward statistics (from learned outcomes)
 * @param options UCB policy tuning (merged with defaults)
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
    const minSamples = options?.minSamples ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.minSamples;
    const vetoThreshold = options?.vetoThreshold ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.vetoThreshold;
    const maxWeight = options?.maxWeight ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.maxWeight;
    const explorationBonus = options?.explorationBonus ?? DEFAULT_AUTO_WEIGHTS_OPTIONS.explorationBonus;
    const priorWeight = options?.priorWeight ?? Math.round(maxWeight / 2);

    const weights: Record<string, number> = {};
    const totalCount = stats.reduce((sum, s) => sum + s.count, 0);

    for (const stat of stats) {
        if (stat.count < minSamples) {
            // Not enough evidence yet: use the existing weight as a warm
            // prior if available, otherwise fall back to the flat prior.
            weights[stat.tag] = existingWeights?.[stat.tag] ?? priorWeight;
            continue;
        }
        // UCB1 score: mean reward + exploration bonus for under-sampled tags.
        const ucb = stat.meanReward + explorationBonus * Math.sqrt(Math.log(totalCount + 1) / stat.count);
        if (stat.meanReward <= vetoThreshold) {
            // Consistently bad on the evidence: hard veto (matcher treats
            // weight 0 as exclusion). The veto uses the raw mean so the
            // exploration bonus cannot keep a provably bad tag alive.
            weights[stat.tag] = 0;
            continue;
        }
        // Map score (clamped to [-1, 1]) onto [1, maxWeight].
        const normalized = (Math.min(Math.max(ucb, -1), 1) + 1) / 2;
        weights[stat.tag] = Math.max(1, Math.round(normalized * maxWeight));
    }

    if (knownTags) {
        for (const tag of knownTags) {
            if (!(tag in weights)) weights[tag] = existingWeights?.[tag] ?? priorWeight;
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
