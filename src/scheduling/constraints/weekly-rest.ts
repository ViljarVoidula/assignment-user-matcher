/**
 * Weekly rest — Directive 2003/88/EC Art 5, with the Art 16(a) averaging option.
 *
 * Art 5 is "24 uninterrupted hours plus the 11 hours' daily rest per each
 * seven-day period" — 35h — dropping to 24h where objective, technical or work
 * organisation conditions justify it. National floors range from 24h (IT, IE)
 * through 35h (FR, PL, DK, FI, CZ, PT) and 36h (NL, SE, AT) to 48h (RO, EE).
 *
 * Two shapes matter beyond the number:
 *
 *   - **Rolling, not calendar.** "Per each seven-day period" is any seven days,
 *     so a person can satisfy every Monday-to-Sunday week and still go eleven
 *     days without a proper break across a week boundary.
 *   - **Two-level.** Estonia requires 36h every week *and* 48h averaged over the
 *     reference period; Poland 24h with a 35h two-week average. A single
 *     threshold cannot express that, so `absoluteFloorMinutes` sits underneath
 *     `minMinutes` and both are checked.
 */

import type { RuleVerdict, SchedulingConstraint, WeeklyRestRule } from '../types';
import type { PersonTimeline } from '../engine/timeline';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor, MINUTES_PER_DAY } from './support';

export const WEEKLY_REST_CITATION = 'Directive 2003/88/EC Art 5';

export function weeklyRest(rule: WeeklyRestRule): SchedulingConstraint {
    const windowMinutes = rule.windowDays * MINUTES_PER_DAY;
    const averagingMinutes = rule.averageOverDays ? rule.averageOverDays * MINUTES_PER_DAY : undefined;

    return fromVerdict({
        id: 'weekly-rest',
        hardness: 'hard',
        weight: 1,
        citation: WEEKLY_REST_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('weekly-rest', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            // Only windows the new shift could have worsened are worth testing.
            const bounds = { start: range.start - windowMinutes, end: range.end + windowMinutes };
            const probeEntry = { ...range, id: entryIdOf(pair), workingMinutes: inst.workingMinutes };

            return timeline.withEntry(probeEntry, (t) => {
                // The floor that must hold in *every* window. Without averaging
                // the headline figure is itself the per-window requirement.
                const floor = averagingMinutes ? (rule.absoluteFloorMinutes ?? 0) : rule.minMinutes;
                if (floor > 0) {
                    const worst = t.minLongestRestInAnyWindow(windowMinutes, bounds);
                    if (worst < floor) {
                        return fail(
                            'weekly-rest',
                            'hard',
                            `employee "${pair.employeeId}" would have only ${h(worst)} continuous rest in some ${rule.windowDays}-day window, below the ${h(floor)} floor`,
                            { actual: worst, required: floor, unit: 'minutes', citation: WEEKLY_REST_CITATION },
                        );
                    }
                }

                if (averagingMinutes) {
                    // Over the longer window the person must accumulate the rest
                    // they would have had from each short window.
                    const windows = averagingMinutes / windowMinutes;
                    const required = rule.minMinutes * windows;
                    // Every averaging window that contains the shift, exactly.
                    // Probing a sample of window starts let two checks see
                    // different windows: construction added a shift that broke
                    // a window it never probed, and the final judgement of an
                    // earlier shift in that window then reported a breach the
                    // solve had created itself.
                    const worstAveraged = worstQualifyingRest(
                        t,
                        averagingMinutes,
                        range.start - averagingMinutes + 1,
                        range.end - 1,
                        rule.minMinutes,
                    );
                    if (worstAveraged < required) {
                        return fail(
                            'weekly-rest',
                            'hard',
                            `employee "${pair.employeeId}" would average ${h(worstAveraged / windows)} weekly rest over ${rule.averageOverDays} days, below the ${h(rule.minMinutes)} average`,
                            { actual: worstAveraged, required, unit: 'minutes', citation: WEEKLY_REST_CITATION },
                        );
                    }
                }

                return pass('weekly-rest', `weekly rest of at least ${h(rule.minMinutes)} preserved`, {
                    required: rule.minMinutes,
                    unit: 'minutes',
                    citation: WEEKLY_REST_CITATION,
                });
            });
        },
    });
}

/**
 * Rest that counts towards an averaged weekly-rest requirement in the window
 * `[start, start + averagingMinutes)`: each free stretch contributes whole
 * multiples of `minPer`, so two 30h gaps are worth nothing against a 48h
 * requirement and one 100h gap is worth 96h.
 */
export function qualifyingRestAt(timeline: PersonTimeline, start: number, averagingMinutes: number, minPer: number): number {
    let total = 0;
    for (const gap of timeline.restGapsIn({ start, end: start + averagingMinutes })) {
        if (gap >= minPer) total += minPer * Math.floor(gap / minPer);
    }
    return total;
}

/**
 * The least qualifying rest in any window starting at an integer minute in
 * `[lo, hi]` — exactly, not over a sample of starts.
 *
 * The quantity is a step function of the window start, and its minima are
 * not only where an edge meets a shift boundary: they also sit where the
 * leading or trailing gap crosses a multiple of `minPer`. So the starts are
 * split into segments on which the window's structure is fixed — the same
 * shifts intersect it, and the same edges are free — using every boundary at
 * which that can change. Inside a segment the value is
 *
 *     inner + m·⌊(a − s)/m⌋ [leading gap] + m·⌊(s + A − b)/m⌋ [trailing gap]
 *
 * which is falling in `s` with only a leading gap (least at the segment's
 * end), rising with only a trailing one (least at its start), and with both
 * dips one step below `m·⌊C/m⌋` exactly where `(a − s) mod m` exceeds
 * `C mod m`, `C = a + A − b` — the first such start is the only other
 * candidate. Each candidate is then measured directly.
 */
export function worstQualifyingRest(
    timeline: PersonTimeline,
    averagingMinutes: number,
    lo: number,
    hi: number,
    minPer: number,
): number {
    if (hi < lo) return Infinity;
    const A = averagingMinutes;
    const entries = timeline.entriesIn({ start: lo, end: hi + A });

    const cuts = new Set<number>([lo, hi + 1]);
    for (const e of entries) {
        for (const at of [e.start, e.end, e.start - A + 1, e.end - A + 1]) {
            if (at > lo && at <= hi) cuts.add(at);
        }
    }
    const sorted = [...cuts].sort((x, y) => x - y);

    let worst = Infinity;
    // `qualifyingRestAt` over the entries already in hand, without building
    // the gap list: this runs for every candidate the search judges.
    const measure = (s: number) => {
        const end = s + A;
        let total = 0;
        let cursor = s;
        for (const e of entries) {
            if (e.start >= end) break;
            if (e.end <= s) continue;
            if (e.start > cursor) {
                const gap = e.start - cursor;
                if (gap >= minPer) total += minPer * Math.floor(gap / minPer);
            }
            if (e.end > cursor) cursor = e.end;
        }
        if (end > cursor) {
            const gap = end - cursor;
            if (gap >= minPer) total += minPer * Math.floor(gap / minPer);
        }
        if (total < worst) worst = total;
    };
    for (let i = 0; i + 1 < sorted.length; i++) {
        const p = sorted[i];
        const q = sorted[i + 1] - 1;
        measure(p);
        if (q !== p) measure(q);
        if (q - p < 2 || !(minPer > 0)) continue;

        // Both edges free throughout the segment? Then the dip, if any.
        let a = Infinity;
        let b = -Infinity;
        for (const e of entries) {
            if (e.start >= p + A) break;
            if (e.end <= p) continue;
            if (e.start < a) a = e.start;
            if (e.end > b) b = e.end;
        }
        if (a === Infinity) continue;
        if (!(a > q && p + A > b)) continue;
        const C = a + A - b;
        const r = ((C % minPer) + minPer) % minPer;
        if (r >= minPer - 1) continue;
        // u = a − s runs from a − q up to a − p; the first u with residue r + 1.
        const uLo = a - q;
        const target = r + 1;
        const u = uLo + ((((target - uLo) % minPer) + minPer) % minPer);
        if (u <= a - p) measure(a - u);
    }
    return worst;
}
