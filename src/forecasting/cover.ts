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
 */

export interface CoverShift {
    id: string;
    /** Epoch ms, `[startMs, endMs)`. */
    startMs: number;
    endMs: number;
    min: number;
    max?: number | null;
}

export interface CoverResult {
    /** People per shift id. */
    counts: Record<string, number>;
    /** Hours (epoch ms) whose need could not be met, with how many were missing. */
    unmet: Array<{ at: number; short: number }>;
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
        if (have < want) unmet.push({ at: hour.at, short: want - have });
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
    return { counts, unmet: short > 0 ? [{ at: shifts[0]?.startMs ?? 0, short }] : [] };
}
