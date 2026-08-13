/**
 * Group composition — cardinality rules over the *set* assigned to a shift.
 *
 * A different shape from per-employee skill matching, and the one naive engines
 * miss: "at least one senior on every shift", "at most two trainees", "no fewer
 * than 60% registered nurses". None of these are properties of an individual
 * assignment — each is satisfiable or not only once you know the whole team on
 * that shift — so they cannot be expressed as a `delta` on one pair.
 *
 * They are also the rules operational buyers ask about first. German ward
 * staffing (PpUGV) is a ratio by ward and shift; supervision limits on trainees
 * are a maximum; "never work alone" is a floor of two.
 *
 * Maximums *can* be breached by a single assignment, so those are checked per
 * pair as well as reported per instance. Minimums can only ever be reported.
 */

import type { ConstraintViolation, RuleVerdict, SchedulingConstraint, SearchState, ShiftInstance } from '../types';
import { fail, fromVerdict, instanceOf, pass } from './support';

export function groupComposition(): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'group-composition',
        hardness: 'hard',
        weight: 1,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('group-composition', 'unknown shift');

            const assigned = state.assignments.get(inst.id) ?? new Set<string>();
            const wouldBe = assigned.has(pair.employeeId) ? assigned.size : assigned.size + 1;

            if (inst.maxEmployees !== undefined && wouldBe > inst.maxEmployees) {
                return fail(
                    'group-composition',
                    'hard',
                    `"${inst.id}" already has its maximum of ${inst.maxEmployees} assignees`,
                    { actual: wouldBe, required: inst.maxEmployees, unit: 'count' },
                );
            }

            for (const [tag, max] of Object.entries(inst.tagMaximums)) {
                if (!state.ctx.employeeTags.get(pair.employeeId)?.has(tag)) continue;
                const current = countTag(state, inst, tag, pair.employeeId);
                if (current + 1 > max) {
                    return fail(
                        'group-composition',
                        'hard',
                        `"${inst.id}" already has its maximum of ${max} assignee(s) tagged "${tag}"`,
                        { actual: current + 1, required: max, unit: 'count' },
                    );
                }
            }

            return pass('group-composition', 'composition limits respected');
        },
    });

    constraint.evaluate = (state) => {
        const out: ConstraintViolation[] = [];
        for (const inst of state.ctx.instances) {
            const assigned = state.assignments.get(inst.id);
            if (!assigned || assigned.size === 0) continue;

            for (const [tag, max] of Object.entries(inst.tagMaximums)) {
                const count = countTag(state, inst, tag);
                if (count > max) {
                    out.push({
                        constraintId: 'group-composition',
                        severity: 'hard',
                        shiftInstanceId: inst.id,
                        message: `shift "${inst.id}" has ${count} assignee(s) tagged "${tag}", over the maximum of ${max}`,
                        actual: count,
                        required: max,
                        unit: 'count',
                    });
                }
            }

            if (inst.maxEmployees !== undefined && assigned.size > inst.maxEmployees) {
                out.push({
                    constraintId: 'group-composition',
                    severity: 'hard',
                    shiftInstanceId: inst.id,
                    message: `shift "${inst.id}" has ${assigned.size} assignees, over the maximum of ${inst.maxEmployees}`,
                    actual: assigned.size,
                    required: inst.maxEmployees,
                    unit: 'count',
                });
            }
        }
        return out;
    };

    return constraint;
}

function countTag(state: SearchState, inst: ShiftInstance, tag: string, exclude?: string): number {
    let count = 0;
    for (const employeeId of state.assignments.get(inst.id) ?? []) {
        if (employeeId === exclude) continue;
        if (state.ctx.employeeTags.get(employeeId)?.has(tag)) count++;
    }
    return count;
}
