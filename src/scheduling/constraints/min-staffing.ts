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

/**
 * How many of the assigned team hold a tag on the shift's date, at or above an
 * optional grade floor.
 *
 * One helper for both the count and the ratio, so a graded minimum and a
 * proportion can never disagree about who counts — and both read the date, so a
 * lapsed certificate satisfies neither.
 */
function countTag(
    ctx: ModelContext,
    assigned: Set<string> | undefined,
    tag: string,
    date: string,
    minLevel?: number,
): number {
    if (!assigned) return 0;
    let have = 0;
    for (const employeeId of assigned) {
        if (minLevel === undefined ? ctx.holdsTagOn(employeeId, tag, date) : ctx.holdsTagAt(employeeId, tag, date, minLevel)) {
            have++;
        }
    }
    return have;
}

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
        for (const [tag, requirement] of Object.entries(inst.tagRequirements)) {
            const have = countTag(ctx, assigned, tag, inst.date, requirement.level);
            if (have < requirement.min) {
                const graded = requirement.level === undefined ? '' : ` at level ${requirement.level}`;
                out.push({
                    constraintId: 'min-staffing',
                    severity,
                    shiftInstanceId: inst.id,
                    message: `shift "${inst.id}" needs ${requirement.min} employees with tag "${tag}"${graded}, has ${have}`,
                    actual: have,
                    required: requirement.min,
                    unit: 'count',
                });
            }
        }

        /*
         * Proportions, which a headcount cannot express.
         *
         * A floor rounded up: 60% of four people is 2.4, and nobody staffs 2.4.
         * An empty shift is silent — a proportion of nobody is undefined, and
         * reporting it as a breach would bury the real finding, which is the
         * unstaffed shift already reported above.
         */
        for (const [tag, ratio] of Object.entries(inst.tagRatios)) {
            if (count === 0) continue;
            const needed = Math.ceil(ratio * count);
            const have = countTag(ctx, assigned, tag, inst.date);
            if (have < needed) {
                out.push({
                    constraintId: 'min-staffing',
                    severity,
                    shiftInstanceId: inst.id,
                    message:
                        `shift "${inst.id}" needs ${Math.round(ratio * 100)}% of its team tagged "${tag}" ` +
                        `(${needed} of ${count}), has ${have} of ${count}`,
                    actual: have,
                    required: needed,
                    unit: 'count',
                });
            }
        }
    }
    return out;
}
