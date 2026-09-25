/**
 * Availability-rule matching and preference weights.
 *
 * A leaf module: `model.ts` resolves effective weights through it at build
 * time, and every scorer and the preference report match rules through it, so
 * the question "does this rule touch this shift" has exactly one answer.
 */

import type { AvailabilityRule, ShiftInstance } from './types';
import type { PeriodClock } from './time';

export type ClockLike = Pick<PeriodClock, 'minutesInClockRange'>;

/** Whether an availability rule's day, date and shift-type conditions apply to an occurrence. */
export function availabilityApplies(rule: AvailabilityRule, inst: ShiftInstance): boolean {
    if (rule.daysOfWeek && !rule.daysOfWeek.includes(inst.weekday)) return false;
    if (rule.fromDate && inst.date < rule.fromDate) return false;
    if (rule.toDate && inst.date > rule.toDate) return false;
    if (rule.shiftTypeTags && (inst.shiftTypeTag === undefined || !rule.shiftTypeTags.includes(inst.shiftTypeTag))) {
        return false;
    }
    return true;
}

/** Minutes of `range` inside the rule's clock window; the whole range when the rule has none. */
export function ruleOverlapMinutes(
    clock: ClockLike,
    range: { start: number; end: number },
    rule: AvailabilityRule,
): number {
    if (rule.from === undefined || rule.to === undefined) return range.end - range.start;
    return clock.minutesInClockRange(range, { from: rule.from, to: rule.to });
}

/** Whether the rule touches the occurrence at all. */
export function ruleMatchesInstance(clock: ClockLike, rule: AvailabilityRule, inst: ShiftInstance): boolean {
    if (!availabilityApplies(rule, inst)) return false;
    return ruleOverlapMinutes(clock, { start: inst.startMinute, end: inst.endMinute }, rule) > 0;
}
