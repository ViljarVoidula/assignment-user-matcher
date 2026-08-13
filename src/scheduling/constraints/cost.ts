/**
 * Labour cost as a soft objective term.
 *
 * Opt-in via `ScheduleInput.objectives.costWeightPerEuro`. The term contributes
 * `euros × weight` per assignment to the *soft* level, so the solver prefers
 * cheaper rosters among otherwise-equal ones — and can never buy a hard breach
 * or an unfilled slot with a cost saving, because levels are lexicographic. That
 * ordering is the legal point: "minimise cost" is a legitimate objective only
 * inside the space of lawful, covered rosters.
 *
 * This is not a rule and never fails: its verdict always passes, so it produces
 * no violations — only score. The arithmetic is `cost.ts`'s, shared with the
 * repair ranking and the result's cost summary, so the number the solver
 * minimises is the number the manager is shown.
 */

import type { AssignmentPair, SchedulingConstraint, SearchState } from '../types';
import { marginalCostCents, overtimeSurchargeCents, shiftCostCents } from '../cost';

export function costObjective(weightPerEuro: number): SchedulingConstraint {
    return {
        id: 'cost',
        hardness: 'soft',
        weight: weightPerEuro,
        delta(state, pair) {
            return pairCostCents(state, pair) / 100;
        },
        verdict(state, pair) {
            const cents = pairCostCents(state, pair);
            return {
                ruleId: 'cost',
                pass: true,
                severity: 'soft',
                actual: cents,
                unit: 'count',
                message: `costs €${(cents / 100).toFixed(2)}${cents === 0 ? ' (no cost model)' : ''}`,
            };
        },
        explain() {
            return null;
        },
    };
}

/**
 * The pair's share of its employee's labour cost.
 *
 * For an assigned pair the overtime surcharge is allocated across the person's
 * shifts pro rata by working minutes, so the shares sum exactly to the payroll;
 * for a candidate not yet assigned it is the true marginal cost of adding it.
 */
function pairCostCents(state: SearchState, pair: AssignmentPair): number {
    const employee = state.ctx.employeeById.get(pair.employeeId);
    const inst = state.ctx.instanceById.get(pair.shiftInstanceId);
    if (!employee?.cost?.hourlyRateCents || !inst) return 0;

    const worked = state.minutesByEmployee.get(pair.employeeId) ?? 0;
    if (!state.isAssigned(pair.employeeId, pair.shiftInstanceId)) {
        return marginalCostCents(inst, employee, worked, state.ctx.rules.engagement);
    }

    const base = shiftCostCents(inst, employee.cost, state.ctx.rules.engagement);
    const surcharge = overtimeSurchargeCents(worked, employee.cost);
    const share = worked > 0 ? (surcharge * inst.workingMinutes) / worked : 0;
    return base + share;
}
