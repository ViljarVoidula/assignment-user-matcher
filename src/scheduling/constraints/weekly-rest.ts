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
                    const worstAveraged = totalQualifyingRest(t, averagingMinutes, bounds, rule.minMinutes);
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
 * Total rest, counting only stretches long enough to qualify, in the worst
 * averaging window.
 *
 * Averaging counts *rest periods*, not idle minutes: eight scattered hours are
 * not half a weekly rest. Only unbroken stretches of at least `minPer` count,
 * and each contributes at most one qualifying period's worth.
 */
function totalQualifyingRest(
    timeline: PersonTimeline,
    averagingMinutes: number,
    bounds: { start: number; end: number },
    minPer: number,
): number {
    // Window starts anchored on entry boundaries, never a day grid (a grid
    // silently misses straddling windows — see CLAUDE.md). The worst (least
    // rest) windows are the ones aligning their edges with work, so probe
    // every start where a window edge touches an entry boundary.
    const starts = new Set<number>([bounds.start, bounds.end]);
    for (const entry of timeline.entriesIn({ start: bounds.start, end: bounds.end + averagingMinutes })) {
        for (const s of [entry.start, entry.end, entry.start - averagingMinutes + 1, entry.end - averagingMinutes]) {
            if (s >= bounds.start && s <= bounds.end) starts.add(s);
        }
    }

    let worst = Infinity;
    for (const start of starts) {
        const window = { start, end: start + averagingMinutes };
        let total = 0;
        for (const gap of timeline.restGapsIn(window)) {
            if (gap >= minPer) total += minPer * Math.floor(gap / minPer);
        }
        if (total < worst) worst = total;
    }
    return worst === Infinity ? 0 : worst;
}
