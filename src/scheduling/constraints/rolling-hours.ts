/**
 * Working-time volume — Directive 2003/88/EC Art 6 and Art 16(b).
 *
 * The headline EU rule is "average working time for each seven-day period,
 * including overtime, not exceeding 48 hours", averaged over a reference period
 * of up to four months — extensible to six by derogation and twelve by
 * collective agreement.
 *
 * The part that defeats a per-week hour budget: **any** seven-day period, and
 * **any** four-month window. A person can sit under 48h in every calendar week
 * and still average over it across week boundaries, and a fixed quarterly
 * reference period hides an overrun that straddles two quarters. So every limit
 * here is evaluated over rolling windows anchored on the person's own
 * assignment boundaries.
 *
 * Art 16(b) also requires paid annual leave and sick leave to be "not included
 * or neutral" in the average. Counting an absent week as zero hours would drag
 * a person's average down and licence a heavier following week, so neutralised
 * absence shortens the window's divisor instead.
 */

import type { RuleVerdict, SchedulingConstraint, SearchState, WorkingTimeLimits } from '../types';
import type { MinuteRange } from '../time';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor, MINUTES_PER_DAY } from './support';

export const WEEKLY_LIMIT_CITATION = 'Directive 2003/88/EC Art 6(b), Art 16(b)';

export function rollingHours(limits: WorkingTimeLimits): SchedulingConstraint {
    return fromVerdict({
        id: 'rolling-hours',
        hardness: 'hard',
        weight: 1,
        citation: WEEKLY_LIMIT_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('rolling-hours', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            const probe = { ...range, id: entryIdOf(pair), workingMinutes: inst.workingMinutes };

            return timeline.withEntry(probe, (t) => {
                if (limits.maxPerShiftMinutes !== undefined && inst.workingMinutes > limits.maxPerShiftMinutes) {
                    return over('shift', inst.workingMinutes, limits.maxPerShiftMinutes, pair.employeeId, inst.id);
                }

                // Daily cap: the ordinary limit, or the extended one when an
                // averaging window is configured and still holds.
                if (limits.maxPerDayMinutes !== undefined) {
                    const dayTotal = t.maxWorkingMinutesInAnyWindow(MINUTES_PER_DAY, windowFor(range, MINUTES_PER_DAY));
                    const cap =
                        limits.maxPerDayExtendedMinutes !== undefined && dayAverageHolds(t, limits, range)
                            ? limits.maxPerDayExtendedMinutes
                            : limits.maxPerDayMinutes;
                    if (dayTotal > cap) return over('day', dayTotal, cap, pair.employeeId, inst.id);
                }

                if (limits.maxPerWeekAbsoluteMinutes !== undefined) {
                    const span = 7 * MINUTES_PER_DAY;
                    const weekTotal = t.maxWorkingMinutesInAnyWindow(span, windowFor(range, span));
                    if (weekTotal > limits.maxPerWeekAbsoluteMinutes) {
                        return over('week', weekTotal, limits.maxPerWeekAbsoluteMinutes, pair.employeeId, inst.id);
                    }
                }

                for (const average of limits.rollingAverages ?? []) {
                    const span = average.windowDays * MINUTES_PER_DAY;
                    const breach = worstAverageBreach(state, t, pair.employeeId, average.maxMinutes, span, range, limits);
                    if (breach !== null) {
                        const label = average.label ?? `${h(average.maxMinutes)}/${average.windowDays}d`;
                        return fail(
                            'rolling-hours',
                            'hard',
                            `employee "${pair.employeeId}" would work ${h(breach.worked)} in some ${average.windowDays}-day window, over the ${label} limit of ${h(breach.allowance)}`,
                            {
                                actual: breach.worked,
                                required: breach.allowance,
                                unit: 'minutes',
                                citation: WEEKLY_LIMIT_CITATION,
                            },
                        );
                    }
                }

                if (limits.maxPerPeriodMinutes !== undefined) {
                    const total = t.workingMinutesIn({ start: 0, end: state.ctx.periodDays * MINUTES_PER_DAY });
                    if (total > limits.maxPerPeriodMinutes) {
                        return over('period', total, limits.maxPerPeriodMinutes, pair.employeeId, inst.id);
                    }
                }

                return pass('rolling-hours', 'within every configured working-time limit', {
                    unit: 'minutes',
                    citation: WEEKLY_LIMIT_CITATION,
                });
            });
        },
    });
}

function over(scope: string, actual: number, required: number, employeeId: string, instanceId: string): RuleVerdict {
    return fail(
        'rolling-hours',
        'hard',
        `employee "${employeeId}" would work ${h(actual)} per ${scope} taking "${instanceId}", over the ${h(required)} limit`,
        { actual, required, unit: 'minutes', citation: WEEKLY_LIMIT_CITATION },
    );
}

/** Windows overlapping `range` are the only ones the new shift can worsen. */
function windowFor(range: MinuteRange, span: number): MinuteRange {
    return { start: range.start - span, end: range.end + span };
}

/** Whether the extended daily cap is earned by the averaging window still holding. */
function dayAverageHolds(timeline: ReturnType<typeof timelineFor>, limits: WorkingTimeLimits, range: MinuteRange): boolean {
    if (limits.dayAverageWindowDays === undefined || limits.maxPerDayMinutes === undefined) return false;
    const span = limits.dayAverageWindowDays * MINUTES_PER_DAY;
    const worst = timeline.maxWorkingMinutesInAnyWindow(span, windowFor(range, span));
    return worst <= limits.maxPerDayMinutes * limits.dayAverageWindowDays;
}

/**
 * Worst breach of a rolling average across the windows the new shift can worsen,
 * with the allowance reduced *per window* for neutralised absence.
 *
 * Art 16(b) makes paid leave and sick leave neutral in the average. Treating
 * them as zero-hour days would let a fortnight off buy a 96-hour week, so the
 * absent time is removed from each window's allowance — but only the absence
 * that actually falls inside that window: sick leave in March must not shrink a
 * January week's budget.
 *
 * Worked minutes and neutral minutes are both piecewise-linear in the window's
 * start, with breakpoints at entry and absence boundaries, so the extreme lies
 * on a window whose edge touches one of those boundaries (or the probe bounds).
 */
function worstAverageBreach(
    state: SearchState,
    timeline: ReturnType<typeof timelineFor>,
    employeeId: string,
    maxMinutes: number,
    span: number,
    range: MinuteRange,
    limits: WorkingTimeLimits,
): { worked: number; allowance: number } | null {
    const bounds = windowFor(range, span);
    const kinds = limits.neutraliseAbsenceKinds;
    const neutral = kinds?.length
        ? (state.ctx.absences.get(employeeId) ?? []).filter((a) => a.kind !== undefined && kinds.includes(a.kind))
        : [];

    if (neutral.length === 0) {
        const worked = timeline.maxWorkingMinutesInAnyWindow(span, bounds);
        return worked > maxMinutes ? { worked, allowance: maxMinutes } : null;
    }

    const starts = new Set<number>([bounds.start, bounds.end - span]);
    for (const entry of timeline.entriesIn({ start: bounds.start - span, end: bounds.end + span })) {
        starts.add(entry.start);
        starts.add(entry.end - span);
    }
    for (const a of neutral) {
        starts.add(a.start);
        starts.add(a.end - span);
    }

    let worst: { worked: number; allowance: number; excess: number } | null = null;
    for (const start of starts) {
        const window = { start, end: start + span };
        const worked = timeline.workingMinutesIn(window);
        const neutralMinutes = neutral.reduce(
            (sum, a) => sum + Math.max(0, Math.min(a.end, window.end) - Math.max(a.start, window.start)),
            0,
        );
        const allowance = maxMinutes * (1 - Math.min(1, neutralMinutes / span));
        const excess = worked - allowance;
        if (excess > 0 && (worst === null || excess > worst.excess)) worst = { worked, allowance, excess };
    }
    return worst === null ? null : { worked: worst.worked, allowance: worst.allowance };
}
