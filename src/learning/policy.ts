/**
 * Explicit selection policies for the learning layer.
 *
 * The point of a *named* policy is the propensity: off-policy evaluation
 * (IPS, doubly-robust) needs the probability with which the logged action was
 * actually taken. Adding independent random jitter to a score — the pre-1.16
 * behaviour — perturbs the ranking without any recoverable probability, so
 * the logs it produces cannot be evaluated offline at all.
 *
 * Selection of `k` items is modelled as `k` sequential conditional choices,
 * each over the admissible set that remains. That is the only construction
 * whose per-step probabilities multiply out to the joint probability of the
 * chosen set, which is what a constrained top-k choice actually is.
 *
 * Pure module: no Redis, no clock, no global RNG.
 */

/** One selected item together with the probability the policy chose it. */
export interface PolicyChoice<T> {
    item: T;
    /** Probability of this item being chosen at the step it was chosen */
    propensity: number;
    /** Size of the admissible set at that step */
    candidateCount: number;
    /** True when the step took the exploratory branch */
    explored: boolean;
}

export interface EpsilonGreedyOptions {
    /** Probability of the exploratory branch, in [0, 1] */
    epsilon: number;
    /** Random source returning values in [0, 1) */
    rng: () => number;
    /**
     * Scores within this distance of the leader count as tied for greedy
     * purposes, so a tie is shared rather than resolved by list order.
     */
    tieEpsilon?: number;
}

/**
 * Epsilon-greedy selection of up to `k` items.
 *
 * At each step, with probability `1 - epsilon` the choice is uniform over the
 * leaders (the best remaining score, plus anything within `tieEpsilon` of
 * it), and otherwise uniform over the whole admissible set. So for a unique
 * leader among `K` admissible items the leader's probability is
 * `1 - epsilon + epsilon/K` and every other item's is `epsilon/K` — the
 * identity the propensity logs are checked against.
 *
 * `epsilon: 0` degenerates to greedy, with a propensity of `1/G` over the
 * tied leaders.
 */
export function epsilonGreedySelect<T>(
    candidates: T[],
    scoreOf: (item: T) => number,
    k: number,
    options: EpsilonGreedyOptions,
): Array<PolicyChoice<T>> {
    const epsilon = Math.max(0, Math.min(1, options.epsilon));
    const tieEpsilon = options.tieEpsilon ?? 0;
    const rng = options.rng;

    const remaining = [...candidates];
    const chosen: Array<PolicyChoice<T>> = [];

    while (chosen.length < k && remaining.length > 0) {
        const K = remaining.length;
        let best = -Infinity;
        for (const item of remaining) {
            const score = scoreOf(item);
            if (score > best) best = score;
        }
        const leaders: number[] = [];
        for (let i = 0; i < K; i++) {
            if (best - scoreOf(remaining[i]) <= tieEpsilon) leaders.push(i);
        }
        const G = leaders.length;

        const explored = epsilon > 0 && rng() < epsilon;
        const index = explored ? Math.min(K - 1, Math.floor(rng() * K)) : leaders[Math.min(G - 1, Math.floor(rng() * G))];

        const isLeader = leaders.includes(index);
        // p(a) = (1 - eps) * [a is a leader] / G + eps / K
        const propensity = (isLeader ? (1 - epsilon) / G : 0) + epsilon / K || 1 / K;

        chosen.push({ item: remaining[index], propensity, candidateCount: K, explored });
        remaining.splice(index, 1);
    }

    return chosen;
}

/**
 * Greedy selection with tie sharing — epsilon-greedy at `epsilon = 0`, kept
 * separate so callers can express "no exploration" without a magic number.
 */
export function greedySelect<T>(
    candidates: T[],
    scoreOf: (item: T) => number,
    k: number,
    rng: () => number,
    tieEpsilon = 0,
): Array<PolicyChoice<T>> {
    return epsilonGreedySelect(candidates, scoreOf, k, { epsilon: 0, rng, tieEpsilon });
}
