/**
 * Availability-rule matching and preference weights.
 *
 * A leaf module: `model.ts` resolves effective weights through it at build
 * time, and every scorer and the preference report match rules through it, so
 * the question "does this rule touch this shift" has exactly one answer.
 */

import type { AvailabilityRule, Employee, PreferenceObjective, ShiftInstance } from './types';
import { ScheduleValidationError } from './types';
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

/** Throws on a malformed preference objective. */
export function validatePreferenceObjectives(objective: PreferenceObjective | undefined): void {
    if (!objective) return;
    const { budget, importantWeight } = objective;
    if (budget !== undefined && (!Number.isFinite(budget) || budget <= 0)) {
        throw new ScheduleValidationError('objectives.preferences.budget must be a positive number');
    }
    if (importantWeight !== undefined && (!Number.isFinite(importantWeight) || importantWeight <= 0)) {
        throw new ScheduleValidationError('objectives.preferences.importantWeight must be a positive number');
    }
}

/**
 * Resolve every employee's soft preference rules to their effective weights,
 * once, at model build. Priority multiplies first. The budget then scales
 * the in-budget rules that touch at least one occurrence, so a wish about a
 * day nothing runs on neither costs budget nor dilutes the rest (such a rule
 * resolves to 0).
 */
export function resolvePreferenceRules(
    employees: Employee[],
    instances: ShiftInstance[],
    clock: ClockLike,
    objective: PreferenceObjective | undefined,
): Map<string, AvailabilityRule[]> {
    const importantWeight = objective?.importantWeight ?? 1;
    const out = new Map<string, AvailabilityRule[]>();
    for (const employee of employees) {
        const soft = (employee.availability ?? []).filter((r) => r.kind === 'preferred' || r.kind === 'avoid');
        if (soft.length === 0) continue;
        const resolved = soft.map((rule) => ({
            ...rule,
            weight: (rule.weight ?? 1) * (rule.priority === 'important' ? importantWeight : 1),
        }));
        if (objective?.budget !== undefined) {
            const live = resolved.map(
                (rule) => !rule.outsideBudget && instances.some((inst) => ruleMatchesInstance(clock, rule, inst)),
            );
            const sum = resolved.reduce((acc, rule, i) => acc + (live[i] ? Math.abs(rule.weight) : 0), 0);
            const scale = sum > 0 ? objective.budget / sum : 0;
            resolved.forEach((rule, i) => {
                if (rule.outsideBudget) return;
                rule.weight = live[i] ? rule.weight * scale : 0;
            });
        }
        out.set(employee.id, resolved);
    }
    return out;
}
