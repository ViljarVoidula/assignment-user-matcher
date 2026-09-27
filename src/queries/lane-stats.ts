/**
 * Pure assembly for `getLaneStats()`: per-tag queue depth and age, and the
 * wait-clock distribution. The matcher does the Redis reads; everything that
 * decides what the numbers mean lives here.
 */
import type { LaneStat, WaitDistribution } from '../types/matcher';

export interface LaneSampleEntry {
    /** The assignment's tag CSV; null when the record has no tag index (claimed or gone) */
    tagsCsv: string | null;
    /** First-enqueue time (ms epoch), the wait clock's score */
    queuedAt: number;
}

export interface SummarizeLanesInput {
    counts: { tag: string; queued: number }[];
    /** Oldest waiting assignments, oldest first */
    sample: LaneSampleEntry[];
    /** True when `sample` holds every waiting assignment */
    sampleComplete: boolean;
    now: number;
    /** Tags that are not routing lanes (the injected `default`) */
    ignore?: ReadonlySet<string>;
    /**
     * Tag CSVs of a few queued assignments from lanes the sample missed, so
     * every lane's `alsoTagged` is read off real work, not only the oldest.
     */
    extraTagSets?: string[];
}

/**
 * One lane per tag with queued work, deepest first.
 *
 * A lane's oldest age is exact when one of its assignments appears in the
 * sample (the sample is read oldest-first, so the first hit is the oldest).
 * A lane with no sampled assignment is younger than everything sampled, so
 * the last sampled age is an honest upper bound — flagged, never presented
 * as exact.
 */
export function summarizeLanes(input: SummarizeLanesInput): LaneStat[] {
    const firstSeen = new Map<string, number>();
    const together = new Map<string, Map<string, number>>();
    const note = (tags: string[]) => {
        for (const tag of tags) {
            let seen = together.get(tag);
            if (!seen) together.set(tag, (seen = new Map()));
            for (const other of tags) if (other !== tag) seen.set(other, (seen.get(other) ?? 0) + 1);
        }
    };
    for (const entry of input.sample) {
        // No tag index means the assignment left the queue (claimed, so it is
        // pending) — its wait clock still runs but it is not in any lane.
        if (!entry.tagsCsv) continue;
        const tags = entry.tagsCsv.split(',').filter((tag) => tag && !input.ignore?.has(tag));
        for (const tag of tags) {
            if (!firstSeen.has(tag)) firstSeen.set(tag, entry.queuedAt);
        }
        note(tags);
    }
    for (const csv of input.extraTagSets ?? []) {
        note(csv.split(',').filter((tag) => tag && !input.ignore?.has(tag)));
    }
    const last = input.sample.length > 0 ? input.sample[input.sample.length - 1].queuedAt : input.now;
    const lanes: LaneStat[] = [];
    for (const { tag, queued } of input.counts) {
        if (queued <= 0 || input.ignore?.has(tag)) continue;
        const seen = firstSeen.get(tag);
        const exact = seen !== undefined || input.sampleComplete;
        const at = seen ?? (input.sampleComplete ? input.now : last);
        const also = [...(together.get(tag) ?? new Map<string, number>()).entries()]
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .slice(0, 5)
            .map(([other]) => other);
        lanes.push({ tag, queued, oldestWaitingMs: Math.max(0, input.now - at), oldestExact: exact, alsoTagged: also });
    }
    lanes.sort((a, b) => b.queued - a.queued || a.tag.localeCompare(b.tag));
    return lanes;
}

/**
 * Nearest-rank position (0-based, oldest first) of the entry whose wait is
 * exceeded by `share` of the population: `share` 0.05 → the p95 age.
 */
export function waitRank(count: number, share: number): number {
    if (count <= 0) return 0;
    return Math.min(count - 1, Math.max(0, Math.floor(share * (count - 1))));
}

export function waitDistribution(
    count: number,
    scores: { p50: number | null; p95: number | null; oldest: number | null },
    now: number,
): WaitDistribution {
    const age = (score: number | null) => (score === null ? null : Math.max(0, now - score));
    return {
        waiting: count,
        p50Ms: count > 0 ? age(scores.p50) : null,
        p95Ms: count > 0 ? age(scores.p95) : null,
        oldestMs: count > 0 ? age(scores.oldest) : null,
    };
}
