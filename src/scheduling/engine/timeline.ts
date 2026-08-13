/**
 * Person timeline — the data structure the EU rule families are built on.
 *
 * Almost every working-time rule of consequence is a question about a *window*
 * of one person's timeline rather than about a single assignment:
 *
 *   - "≤48h averaged over any 4 months"        → worked minutes in a window
 *   - "11h rest in every rolling 24h"          → longest gap in a window
 *   - "35h continuous rest per 7 days"         → longest gap in a window
 *   - "≤36 shifts ending after 02:00 / 16wks"  → filtered count in a window
 *   - "max 5 consecutive nights"               → run length over entries
 *   - "max 6 consecutive working days"         → run length over day indices
 *
 * So they all reduce to a handful of primitives here, and a constraint that
 * needs one of them costs O(log n + hits) rather than a scan of the roster.
 *
 * Two design notes that matter:
 *
 * 1. **Keyed by person, not by contract.** CJEU C-585/19 holds that where a
 *    worker has several contracts with the same employer, daily rest applies to
 *    them taken as a whole. Aggregating per employee record would understate
 *    hours and overstate rest for exactly the people most at risk.
 * 2. **History is first-class.** Rest and weekly-rest windows straddle the
 *    period boundary, so a roster built without the previous period's tail is
 *    non-compliant on its first days by construction. Historical entries are
 *    seeded at negative period minutes and are immutable.
 */

import type { MinuteRange } from '../time';
import { overlapMinutes } from '../time';

/** One occupied span on a person's timeline. */
export interface TimelineEntry extends MinuteRange {
    /** Shift instance id, or a synthetic id for historical//absence spans. */
    id: string;
    /** Minutes that count as working time — may differ from the span for standby duties. */
    workingMinutes: number;
    /** Free-form classification tag used by sequence rules (e.g. a shift type). */
    tag?: string;
    /** Historical entries are immutable and never returned by the mutable views. */
    historical?: boolean;
}

/**
 * One person's ordered, non-overlapping-by-construction spans, with prefix sums
 * for O(log n) window queries.
 *
 * Entries are kept sorted by start. The prefix array is rebuilt lazily, so a
 * burst of assign/unassign calls during a search move costs one rebuild at the
 * next query rather than one per mutation.
 */
export class PersonTimeline {
    private entries: TimelineEntry[] = [];
    /** `prefix[i]` = total working minutes of entries `[0, i)`. */
    private prefix: number[] = [0];
    /** `prefixMaxEnd[i]` = latest end among entries `[0, i)`; nondecreasing. */
    private prefixMaxEnd: number[] = [-Infinity];
    private dirty = false;

    constructor(history: TimelineEntry[] = []) {
        for (const entry of history) this.entries.push({ ...entry, historical: true });
        this.entries.sort(byStart);
        this.rebuild();
    }

    /** Every entry, history first, ordered by start. */
    all(): readonly TimelineEntry[] {
        this.ensureClean();
        return this.entries;
    }

    /** Total working minutes currently on the timeline, history included. */
    totalWorkingMinutes(): number {
        this.ensureClean();
        return this.prefix[this.prefix.length - 1];
    }

    add(entry: TimelineEntry): void {
        // Insert in place; timelines are short (tens of entries per period), so a
        // splice beats re-sorting the whole array.
        const at = lowerBound(this.entries, entry.start);
        this.entries.splice(at, 0, entry);
        this.dirty = true;
    }

    remove(id: string): boolean {
        const index = this.entries.findIndex((e) => e.id === id && !e.historical);
        if (index === -1) return false;
        this.entries.splice(index, 1);
        this.dirty = true;
        return true;
    }

    has(id: string): boolean {
        return this.entries.some((e) => e.id === id);
    }

    /**
     * Working minutes falling inside `window`, counting partial overlaps
     * proportionally. This is the primitive behind every rolling average.
     *
     * Costs a binary search plus one step per overlapping entry. A person's
     * timeline holds tens of entries per period, so scanning the hits beats
     * maintaining a minute-resolution index — a Fenwick tree over period
     * minutes would be ~45k slots per person, 22M across a 500-person solve,
     * to save a walk over a few dozen items.
     */
    workingMinutesIn(window: MinuteRange): number {
        this.ensureClean();
        if (window.end <= window.start || this.entries.length === 0) return 0;

        const first = this.firstOverlapping(window.start);
        let total = 0;
        for (let i = first; i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (entry.start >= window.end) break;
            total += proratedWorkingMinutes(entry, window);
        }
        return total;
    }

    /**
     * Worst case of "working minutes in any window of `windowMinutes`" that
     * overlaps `bounds` — the quantity a rolling average such as "≤48h in any
     * 4-month window" actually limits.
     *
     * Checking windows on a fixed calendar grid is the classic way to get this
     * wrong: a person can sit under 48h in every Mon–Sun week while working 60h
     * across a Thursday-to-Wednesday stretch. The maximum is always attained by
     * a window whose left edge sits on an entry boundary, so those are the only
     * candidates worth evaluating.
     */
    maxWorkingMinutesInAnyWindow(windowMinutes: number, bounds: MinuteRange): number {
        this.ensureClean();
        if (windowMinutes <= 0) return 0;
        let worst = 0;
        for (const start of this.candidateWindowStarts(windowMinutes, bounds)) {
            const total = this.workingMinutesIn({ start, end: start + windowMinutes });
            if (total > worst) worst = total;
        }
        return worst;
    }

    /**
     * Worst case of "longest continuous rest in any window of `windowMinutes`"
     * overlapping `bounds` — what a weekly-rest rule requires a floor on.
     *
     * Returns `Infinity` when no candidate window applies, so an empty timeline
     * never reads as a breach.
     */
    minLongestRestInAnyWindow(windowMinutes: number, bounds: MinuteRange): number {
        this.ensureClean();
        if (windowMinutes <= 0) return Infinity;
        let worst = Infinity;
        for (const start of this.candidateWindowStarts(windowMinutes, bounds)) {
            const rest = this.longestRestIn({ start, end: start + windowMinutes });
            if (rest < worst) worst = rest;
        }
        return worst;
    }

    /**
     * Window left edges worth testing: every entry boundary that could put a
     * window over `bounds`, plus the bounds themselves. Sliding a window until
     * its edge meets a boundary never reduces the extreme being sought, so this
     * finite set contains the answer.
     */
    private candidateWindowStarts(windowMinutes: number, bounds: MinuteRange): number[] {
        const starts = new Set<number>([bounds.start, bounds.end - windowMinutes]);
        for (const entry of this.entries) {
            if (entry.end < bounds.start - windowMinutes || entry.start > bounds.end + windowMinutes) continue;
            starts.add(entry.start);
            starts.add(entry.end - windowMinutes);
        }
        return [...starts];
    }

    /** Entries intersecting `window`, in order. */
    entriesIn(window: MinuteRange): TimelineEntry[] {
        this.ensureClean();
        const out: TimelineEntry[] = [];
        for (let i = this.firstOverlapping(window.start); i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (entry.start >= window.end) break;
            if (entry.end > window.start) out.push(entry);
        }
        return out;
    }

    /**
     * Run `fn` with `entry` temporarily on the timeline, then restore it.
     *
     * Constraints are asked "what would assigning this pair cost", and the pair
     * is not on the timeline yet — so window rules have to measure a
     * hypothetical. Adding and removing around the call beats copying the
     * timeline, which would allocate on every candidate evaluation in the
     * search's hot loop.
     *
     * Idempotent: when the entry is already present (re-explaining a committed
     * roster) `fn` simply runs against the timeline as it stands.
     */
    withEntry<T>(entry: TimelineEntry, fn: (timeline: PersonTimeline) => T): T {
        if (this.has(entry.id)) return fn(this);
        this.add(entry);
        try {
            return fn(this);
        } finally {
            this.remove(entry.id);
        }
    }

    /**
     * Every free stretch inside `window`, in minutes, including the stretches at
     * the window edges. Weekly-rest averaging needs the individual gaps, not
     * just the longest one.
     */
    restGapsIn(window: MinuteRange): number[] {
        if (window.end <= window.start) return [];
        const busy = this.entriesIn(window);
        if (busy.length === 0) return [window.end - window.start];

        const gaps: number[] = [];
        let cursor = window.start;
        for (const entry of busy) {
            if (entry.start > cursor) gaps.push(entry.start - cursor);
            cursor = Math.max(cursor, entry.end);
        }
        if (window.end > cursor) gaps.push(window.end - cursor);
        return gaps;
    }

    /**
     * Longest uninterrupted free stretch inside `window`, in minutes.
     *
     * Gaps at the window edges count: a person with no assignments in a 7-day
     * window has 7 days of rest, and a weekly-rest rule must see that.
     */
    longestRestIn(window: MinuteRange): number {
        if (window.end <= window.start) return 0;
        const busy = this.entriesIn(window);
        if (busy.length === 0) return window.end - window.start;

        let longest = 0;
        let cursor = window.start;
        for (const entry of busy) {
            if (entry.start > cursor) longest = Math.max(longest, entry.start - cursor);
            cursor = Math.max(cursor, entry.end);
        }
        if (window.end > cursor) longest = Math.max(longest, window.end - cursor);
        return longest;
    }

    /**
     * Smallest gap between `range` and any existing entry, ignoring `excludeId`.
     * Returns `Infinity` when the timeline is otherwise empty, and 0 when
     * something overlaps — overlap is a different rule's business.
     */
    minGapAround(range: MinuteRange, excludeId?: string): number {
        this.ensureClean();
        let smallest = Infinity;
        for (const entry of this.entries) {
            if (entry.id === excludeId) continue;
            if (entry.end <= range.start) smallest = Math.min(smallest, range.start - entry.end);
            else if (entry.start >= range.end) smallest = Math.min(smallest, entry.start - range.end);
            else return 0;
        }
        return smallest;
    }

    /** Number of entries in `window` satisfying `predicate`. */
    countIn(window: MinuteRange, predicate?: (entry: TimelineEntry) => boolean): number {
        const hits = this.entriesIn(window);
        return predicate ? hits.filter(predicate).length : hits.length;
    }

    /**
     * Longest run of consecutive entries satisfying `predicate`, where
     * "consecutive" means adjacent in time order with no non-matching entry
     * between them. Backs `max consecutive night shifts`.
     */
    longestRun(predicate: (entry: TimelineEntry) => boolean): number {
        this.ensureClean();
        let longest = 0;
        let current = 0;
        for (const entry of this.entries) {
            if (predicate(entry)) {
                current++;
                if (current > longest) longest = current;
            } else {
                current = 0;
            }
        }
        return longest;
    }

    /**
     * Longest run of consecutive day indices on which the person has any entry.
     * Backs `max consecutive working days`. `dayIndexOf` maps a period minute to
     * a day so the caller's clock owns DST, not this structure.
     */
    longestConsecutiveDays(dayIndexOf: (minute: number) => number): number {
        this.ensureClean();
        const days = new Set<number>();
        for (const entry of this.entries) days.add(dayIndexOf(entry.start));

        const sorted = [...days].sort((a, b) => a - b);
        let longest = 0;
        let current = 0;
        let previous: number | undefined;
        for (const day of sorted) {
            current = previous !== undefined && day === previous + 1 ? current + 1 : 1;
            if (current > longest) longest = current;
            previous = day;
        }
        return longest;
    }

    /**
     * First index that may overlap a window starting at `windowStart`.
     *
     * Entries are sorted by start but may be *nested* — a long stand-by span can
     * fully contain a later-starting shift — so walking back from the lower
     * bound while only the immediately preceding entry reaches past the window
     * start misses the outer span. The running maximum of entry ends is
     * nondecreasing, so the first index whose prefix max-end exceeds the window
     * start is exactly where iteration must begin, found by binary search.
     */
    private firstOverlapping(windowStart: number): number {
        let low = 0;
        let high = this.entries.length;
        while (low < high) {
            const mid = (low + high) >> 1;
            if (this.prefixMaxEnd[mid + 1] > windowStart) high = mid;
            else low = mid + 1;
        }
        return low;
    }

    private ensureClean(): void {
        if (this.dirty) this.rebuild();
    }

    private rebuild(): void {
        this.prefix = new Array(this.entries.length + 1);
        this.prefix[0] = 0;
        this.prefixMaxEnd = new Array(this.entries.length + 1);
        this.prefixMaxEnd[0] = -Infinity;
        for (let i = 0; i < this.entries.length; i++) {
            this.prefix[i + 1] = this.prefix[i] + this.entries[i].workingMinutes;
            this.prefixMaxEnd[i + 1] = Math.max(this.prefixMaxEnd[i], this.entries[i].end);
        }
        this.dirty = false;
    }
}

/**
 * All timelines for a solve, keyed by person id.
 *
 * The engine owns mutation; constraints only read. Keeping the index here
 * rather than on `SearchState` means a constraint never has to reconstruct a
 * person's history to answer a window question.
 */
export class TimelineIndex {
    private readonly byPerson = new Map<string, PersonTimeline>();

    constructor(history: Map<string, TimelineEntry[]> = new Map()) {
        for (const [personId, entries] of history) {
            this.byPerson.set(personId, new PersonTimeline(entries));
        }
    }

    /** The person's timeline, created empty on first use. */
    for(personId: string): PersonTimeline {
        let timeline = this.byPerson.get(personId);
        if (!timeline) {
            timeline = new PersonTimeline();
            this.byPerson.set(personId, timeline);
        }
        return timeline;
    }

    add(personId: string, entry: TimelineEntry): void {
        this.for(personId).add(entry);
    }

    remove(personId: string, entryId: string): boolean {
        return this.for(personId).remove(entryId);
    }

    personIds(): string[] {
        return [...this.byPerson.keys()];
    }
}

function byStart(a: TimelineEntry, b: TimelineEntry): number {
    return a.start - b.start || a.end - b.end;
}

/** First index whose entry starts at or after `start`. */
function lowerBound(entries: TimelineEntry[], start: number): number {
    let low = 0;
    let high = entries.length;
    while (low < high) {
        const mid = (low + high) >> 1;
        if (entries[mid].start < start) low = mid + 1;
        else high = mid;
    }
    return low;
}

/**
 * Working minutes of `entry` attributable to `window`.
 *
 * Standby duties can have `workingMinutes` below their span (a duty that counts
 * at a fraction, or only for actual call-outs), so a partial overlap is scaled
 * by the same fraction rather than clipped to elapsed time.
 */
function proratedWorkingMinutes(entry: TimelineEntry, window: MinuteRange): number {
    const span = entry.end - entry.start;
    if (span <= 0) return 0;
    const inside = overlapMinutes(entry, window);
    if (inside === span) return entry.workingMinutes;
    return (entry.workingMinutes * inside) / span;
}
