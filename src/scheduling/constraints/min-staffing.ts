/**
 * Min-staffing — every shift instance needs `minEmployees` assignees, plus
 * per-tag minimums from `tagRequirements`. Hard by default.
 *
 * Assigning a pair can never *breach* a minimum, so `delta` is always 0; the
 * rule's teeth are the per-instance shortfall evaluation in
 * `staffingViolations` (used by the facade for the violation report) and the
 * unfilled-slot penalty in the engine's objective.
 */

import type { ConstraintViolation, ModelContext, SchedulingConstraint, SearchState, Severity } from '../types';

export function minStaffing(): SchedulingConstraint {
    return {
        id: 'min-staffing',
        hardness: 'hard',
        delta: () => 0,
        explain: () => null,
    };
}

/** Per-instance staffing shortfalls of the current state — the reportable face of the rule. */
export function staffingViolations(ctx: ModelContext, state: SearchState, severity: Severity): ConstraintViolation[] {
    const out: ConstraintViolation[] = [];
    for (const inst of ctx.instances) {
        const assigned = state.assignments.get(inst.id);
        const count = assigned ? assigned.size : 0;
        if (count < inst.minEmployees) {
            out.push({
                constraintId: 'min-staffing',
                severity,
                shiftInstanceId: inst.id,
                message: `shift "${inst.id}" needs ${inst.minEmployees} employees, has ${count}`,
                actual: count,
                required: inst.minEmployees,
                unit: 'count',
            });
        }
        for (const [tag, needed] of Object.entries(inst.tagRequirements)) {
            let have = 0;
            if (assigned) {
                for (const employeeId of assigned) {
                    if (ctx.employeeTags.get(employeeId)?.has(tag)) have++;
                }
            }
            if (have < needed) {
                out.push({
                    constraintId: 'min-staffing',
                    severity,
                    shiftInstanceId: inst.id,
                    message: `shift "${inst.id}" needs ${needed} employees with tag "${tag}", has ${have}`,
                });
            }
        }
    }
    return out;
}
