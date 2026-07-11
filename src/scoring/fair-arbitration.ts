/**
 * Global arbitration for fair-tiebreaker bulk matching: decides which user
 * tentatively wins each contested candidate assignment. Pure logic - no Redis.
 * See MatcherOptions.enableFairTiebreaker / fairnessLoadPenalty /
 * fairnessTieBand for the behavior each knob selects.
 */

import type { FairnessMode } from '../types/matcher';

/**
 * Per-assignment load discount each fairness preset applies, as a ratio of
 * the median candidate score of the matching pass. A discount of X is itself
 * a smooth tie-band: a user loses a contested assignment to a rival carrying
 * one assignment less exactly when the score gap is under X.
 */
const PRESET_LOAD_PENALTY_RATIO: Partial<Record<FairnessMode, number>> = {
    balanced: 0.05,
    'spread-work': 0.5,
};

/**
 * Turns a fairness preset into concrete arbitration knobs, scaled to the
 * median candidate score of the current matching pass so consumers never
 * have to know their own score scale. Explicitly-set expert knobs
 * (fairnessLoadPenalty / fairnessTieBand > 0) always win over the preset.
 */
export function resolveFairnessKnobs(
    mode: FairnessMode | undefined,
    pairPriorities: number[],
    explicit: { loadPenalty: number; tieBand: number },
): { loadPenalty: number; tieBand: number } {
    let { loadPenalty, tieBand } = explicit;
    const ratio = mode ? PRESET_LOAD_PENALTY_RATIO[mode] : undefined;
    if (ratio && loadPenalty <= 0 && pairPriorities.length > 0) {
        const sorted = [...pairPriorities].sort((a, b) => a - b);
        const mid = sorted.length >> 1;
        const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        if (median > 0) loadPenalty = median * ratio;
    }
    return { loadPenalty, tieBand };
}

export interface FairArbitrationOptions {
    maxUserBacklogSize: number;
    /**
     * Per-user override of the award ceiling (compared against the same
     * `backlogUsed` counter as `maxUserBacklogSize`). Used to fold in
     * additional limits like the rolling-window grant cap, which can leave a
     * user with less headroom than their backlog alone would allow.
     */
    maxByUser?: Map<string, number>;
    /**
     * Score subtracted per assignment already on (or won this pass into) a
     * user's backlog. 0 disables load-penalized scoring.
     */
    loadPenalty?: number;
    /**
     * Width of the score bucket within which candidates count as tied; ties
     * go to the less-loaded user. 0 disables tie-band arbitration.
     */
    tieBand?: number;
}

interface ArbitrablePair {
    userId: string;
    id: string;
    priority: number;
}

/**
 * Walks the candidate pairs in best-first order and awards each assignment to
 * exactly one user, honoring per-user backlog caps. Mutates `backlogUsed`
 * (one increment per awarded pair). `settled` marks assignments no longer
 * available at all (already claimed, or lost to a concurrent process).
 *
 * Returns `winners` in award order and `deferred`: pairs skipped only because
 * their user was at cap - a cap that the caller may roll back if the user
 * loses a claim to a concurrent process, so these stay eligible for another
 * arbitration round.
 *
 * With neither knob set the order is a plain stable sort by score descending,
 * matching the pre-fairness-knob behavior exactly. With a knob set, ordering
 * is load-aware and therefore dynamic - each award changes the winner's load,
 * which can demote their remaining candidates - so a lazy max-heap re-ranks
 * entries whose user's load has grown since they were pushed.
 */
export function arbitrateFair<P extends ArbitrablePair>(
    pairs: P[],
    backlogUsed: Map<string, number>,
    settled: Set<string>,
    options: FairArbitrationOptions,
): { winners: P[]; deferred: P[] } {
    const loadPenalty = options.loadPenalty ?? 0;
    const tieBand = options.tieBand ?? 0;
    const winners: P[] = [];
    const deferred: P[] = [];
    const taken = new Set<string>();

    const load = (userId: string) => backlogUsed.get(userId) ?? 0;
    const capOf = (userId: string) => options.maxByUser?.get(userId) ?? options.maxUserBacklogSize;

    const award = (pair: P): void => {
        // Assignments already taken this pass are settled either way by the
        // caller (a failed claim means a concurrent process owns it), so
        // lower-ranked pairs for them never need re-arbitration.
        if (settled.has(pair.id) || taken.has(pair.id)) return;
        const used = load(pair.userId);
        if (used >= capOf(pair.userId)) {
            deferred.push(pair);
            return;
        }
        taken.add(pair.id);
        backlogUsed.set(pair.userId, used + 1);
        winners.push(pair);
    };

    if (loadPenalty <= 0 && tieBand <= 0) {
        for (const pair of [...pairs].sort((a, b) => b.priority - a.priority)) {
            award(pair);
        }
        return { winners, deferred };
    }

    const effective = (pair: P) => pair.priority - loadPenalty * load(pair.userId);
    const rank = (pair: P) => (tieBand > 0 ? Math.floor(effective(pair) / tieBand) : effective(pair));

    type Entry = { pair: P; rank: number; loadAtEval: number };
    // True when a orders strictly before b: higher rank bucket, then lower
    // load, then higher raw score, then ids for full determinism.
    const before = (a: Entry, b: Entry): boolean => {
        if (a.rank !== b.rank) return a.rank > b.rank;
        if (a.loadAtEval !== b.loadAtEval) return a.loadAtEval < b.loadAtEval;
        if (a.pair.priority !== b.pair.priority) return a.pair.priority > b.pair.priority;
        if (a.pair.id !== b.pair.id) return a.pair.id < b.pair.id;
        return a.pair.userId < b.pair.userId;
    };

    const heap: Entry[] = [];
    const push = (pair: P) => {
        heap.push({ pair, rank: rank(pair), loadAtEval: load(pair.userId) });
        let i = heap.length - 1;
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (!before(heap[i], heap[parent])) break;
            [heap[i], heap[parent]] = [heap[parent], heap[i]];
            i = parent;
        }
    };
    const pop = (): Entry => {
        const top = heap[0];
        const last = heap.pop()!;
        if (heap.length > 0) {
            heap[0] = last;
            let i = 0;
            for (;;) {
                const left = i * 2 + 1;
                const right = left + 1;
                let best = i;
                if (left < heap.length && before(heap[left], heap[best])) best = left;
                if (right < heap.length && before(heap[right], heap[best])) best = right;
                if (best === i) break;
                [heap[i], heap[best]] = [heap[best], heap[i]];
                i = best;
            }
        }
        return top;
    };

    for (const pair of pairs) push(pair);

    while (heap.length > 0) {
        const entry = pop();
        if (settled.has(entry.pair.id) || taken.has(entry.pair.id)) continue;
        // Lazy re-rank: a user's load only grows during this pass (one per
        // award), which can only demote their remaining entries. Terminates
        // because load is capped at maxUserBacklogSize.
        if (load(entry.pair.userId) !== entry.loadAtEval) {
            push(entry.pair);
            continue;
        }
        award(entry.pair);
    }

    return { winners, deferred };
}
