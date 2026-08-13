/**
 * Hour-budget — per-period worked-minutes bounds. Max is hard by default,
 * min is soft by default (warn, don't block): an under-worked employee is a
 * report, not a breach that should stall staffing.
 *
 * Durations are always true elapsed minutes — overnight shifts count forward
 * into the next day, never `abs()`-wrapped like the legacy solver.
 */

import type { ConstraintViolation, ModelContext, SchedulingConstraint, SearchState } from '../types';

export function hourBudget(): SchedulingConstraint {
    return {
        id: 'hour-budget',
        hardness: 'hard',
        delta(state, pair) {
            const employee = state.ctx.employeeById.get(pair.employeeId);
            const inst = state.ctx.instanceById.get(pair.shiftInstanceId);
            if (!employee || !inst) return 0;
            if (employee.maxHoursForPeriod === undefined) return 0;
            const current = state.minutesByEmployee.get(pair.employeeId) ?? 0;
            return current + inst.durationMinutes > employee.maxHoursForPeriod * 60 ? 1 : 0;
        },
        explain(state, pair) {
            const employee = state.ctx.employeeById.get(pair.employeeId);
            if (this.delta(state, pair) > 0 && employee) {
                return `assigning "${pair.shiftInstanceId}" pushes employee "${pair.employeeId}" past ${employee.maxHoursForPeriod}h for the period`;
            }
            return null;
        },
    };
}

/** Soft min-hours shortfalls of the current state. */
export function minHourViolations(ctx: ModelContext, state: SearchState, weight: number): ConstraintViolation[] {
    const out: ConstraintViolation[] = [];
    for (const employee of ctx.employees) {
        if (employee.minHoursForPeriod === undefined) continue;
        const worked = state.minutesByEmployee.get(employee.id) ?? 0;
        const needed = employee.minHoursForPeriod * 60;
        if (worked < needed) {
            out.push({
                constraintId: 'hour-budget',
                severity: 'soft',
                employeeId: employee.id,
                message: `employee "${employee.id}" worked ${(worked / 60).toFixed(1)}h, below the ${employee.minHoursForPeriod}h minimum (weight ${weight})`,
            });
        }
    }
    return out;
}
