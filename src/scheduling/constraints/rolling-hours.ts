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
                    const worst = t.maxWorkingMinutesInAnyWindow(span, windowFor(range, span));
                    const allowance = allowanceFor(state, pair.employeeId, average.maxMinutes, average.windowDays, limits);
                    if (worst > allowance) {
                        const label = average.label ?? `${h(average.maxMinutes)}/${average.windowDays}d`;
                        return fail(
                            'rolling-hours',
                            'hard',
                            `employee "${pair.employeeId}" would work ${h(worst)} in some ${average.windowDays}-day window, over the ${label} limit of ${h(allowance)}`,
                            { actual: worst, required: allowance, unit: 'minutes', citation: WEEKLY_LIMIT_CITATION },
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
 * The window's allowance, reduced for neutralised absence.
 *
 * Art 16(b) makes paid leave and sick leave neutral in the average. Treating
 * them as zero-hour days would let a fortnight off buy a 96-hour week, so the
 * days are removed from the window rather than counted empty.
 */
function allowanceFor(
    state: SearchState,
    employeeId: string,
    maxMinutes: number,
    windowDays: number,
    limits: WorkingTimeLimits,
): number {
    const kinds = limits.neutraliseAbsenceKinds;
    if (!kinds?.length) return maxMinutes;

    const absences = state.ctx.absences.get(employeeId) ?? [];
    const neutralMinutes = absences
        .filter((a) => a.kind !== undefined && kinds.includes(a.kind))
        .reduce((sum, a) => sum + Math.max(0, a.end - a.start), 0);
    if (neutralMinutes === 0) return maxMinutes;

    const windowMinutes = windowDays * MINUTES_PER_DAY;
    const neutralFraction = Math.min(1, neutralMinutes / windowMinutes);
    return maxMinutes * (1 - neutralFraction);
}
