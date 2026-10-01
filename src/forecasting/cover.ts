/**
 * From people needed per hour to people per shift: the fewest heads on a
 * day's shifts that cover every hour's need. Greedy left to right — at the
 * first hour still short, add a person to the covering shift that runs
 * latest — which is optimal for covering a line with intervals of equal cost
 * when no shift has a ceiling. A shift's own minimum is a floor (never
 * proposed below it) and its maximum a ceiling; an hour no shift can cover is
 * reported, never silently dropped.
 *
 * A shift covers an hour when it overlaps it at all: a shift that starts at
 * 13:30 counts for the 13:00 hour. Need is read in whole people (a fractional
 * need rounds up).
 *
 * `counts` never exceeds a shift's `max`, so `counts` alone can read as
 * "covered" on a day that is not: whatever an hour needs beyond what its
 * overlapping shifts can hold is in `unmet` — with no shift there
 * (`'no-shift'`) or with every covering shift full (`'at-max'`). A caller that
 * shows `counts` must show `unmet` beside it.
 */

export interface CoverShift {
    id: string;
    /** Epoch ms, `[startMs, endMs)`. */
    startMs: number;
    endMs: number;
    /** Floor: the shift is never proposed with fewer people. */
    min: number;
    /**
     * Ceiling. `null` or omitted means no ceiling — the shift takes as many people as the need asks. This
     * differs from the scheduler, where an unstated `maxEmployees` is no room (`max = min`): here a caller
     * that means "exactly the minimum" must say `max: min`.
     */
    max?: number | null;
}

/** An hour (or, from `coverPersonHours`, a day) whose need the shifts could not hold. */
export interface CoverUnmet {
    /** Epoch ms of the hour (`coverPersonHours`: the first shift's start, or 0 without shifts). */
    at: number;
    /** Whole people (`coverPersonHours`: whole person-hours) missing. */
    short: number;
    /** `'no-shift'`: no shift overlaps the hour. `'at-max'`: every covering shift is at its `max`. */
    reason: 'no-shift' | 'at-max';
    /** Ids of the covering shifts that are at their `max` (empty for `'no-shift'`). */
    atMax: string[];
}

export interface CoverResult {
    /**
     * People per shift id, between each shift's `min` and `max`. Capped at `max`: need beyond it is in
     * `unmet`, never here, so `counts` must not be shown without `unmet`.
     */
    counts: Record<string, number>;
    /**
     * Every hour whose need exceeds what its overlapping shifts can hold, with how many were missing —
     * including when every covering shift is full. Empty only when every hour's need is met.
     */
    unmet: CoverUnmet[];
}

const HOUR_MS = 3_600_000;

export function coverNeed(need: ReadonlyArray<{ at: number; people: number }>, shifts: readonly CoverShift[]): CoverResult {
    const counts: Record<string, number> = {};
    for (const s of shifts) counts[s.id] = Math.max(0, s.min);
    const unmet: CoverResult['unmet'] = [];
    const hours = [...need].sort((a, b) => a.at - b.at);
    const covering = (at: number) => shifts.filter((s) => s.startMs < at + HOUR_MS && s.endMs > at);
    for (const hour of hours) {
        const want = Math.ceil(hour.people - 1e-9);
        if (want <= 0) continue;
        const options = covering(hour.at);
        let have = options.reduce((sum, s) => sum + counts[s.id], 0);
        while (have < want) {
            const open = options
                .filter((s) => s.max == null || counts[s.id] < s.max)
                .sort((a, b) => b.endMs - a.endMs || a.id.localeCompare(b.id));
            if (open.length === 0) break;
            counts[open[0].id] += 1;
            have += 1;
        }
        if (have < want)
            unmet.push({
                at: hour.at,
                short: want - have,
                reason: options.length === 0 ? 'no-shift' : 'at-max',
                atMax: options
                    .filter((s) => s.max != null && counts[s.id] >= s.max)
                    .map((s) => s.id)
                    .sort(),
            });
    }
    return { counts, unmet };
}

/**
 * Person-hours for the day (a rate conversion without an hourly pattern)
 * spread over the day's shifts: raise the longest shift first, one person at a
 * time and in turn, until their hours cover it. What no shift can take (every
 * one at its ceiling, or no shifts at all) is reported as one shortfall in
 * whole person-hours at the first shift's start.
 */
export function coverPersonHours(personHours: number, shifts: readonly CoverShift[]): CoverResult {
    const counts: Record<string, number> = {};
    for (const s of shifts) counts[s.id] = Math.max(0, s.min);
    const hoursOf = (s: CoverShift) => (s.endMs - s.startMs) / HOUR_MS;
    let have = shifts.reduce((sum, s) => sum + counts[s.id] * hoursOf(s), 0);
    const byLength = [...shifts].sort((a, b) => hoursOf(b) - hoursOf(a) || a.id.localeCompare(b.id));
    let i = 0;
    let stuck = 0;
    while (have < personHours - 1e-9 && byLength.length > 0 && stuck < byLength.length) {
        const s = byLength[i % byLength.length];
        i += 1;
        if (s.max != null && counts[s.id] >= s.max) {
            stuck += 1;
            continue;
        }
        stuck = 0;
        counts[s.id] += 1;
        have += hoursOf(s);
    }
    const short = Math.max(0, Math.ceil(personHours - have - 1e-9));
    if (short <= 0) return { counts, unmet: [] };
    const atMax = shifts.filter((s) => s.max != null && counts[s.id] >= s.max).map((s) => s.id);
    return {
        counts,
        unmet: [
            {
                at: shifts[0]?.startMs ?? 0,
                short,
                reason: shifts.length === 0 ? 'no-shift' : 'at-max',
                atMax: atMax.sort(),
            },
        ],
    };
}
