/**
 * Propagation — domain pruning before search.
 *
 * Builds the eligibility matrix (employee × shift instance) and applies every
 * constraint's `prune()` hook (time-off, impossible per-shift duration, …).
 * A slot left with zero eligible employees is an early infeasibility signal
 * and is reported as a violation before any search runs.
 */

import type { ConstraintViolation, ModelContext } from '../types';

export interface PropagationResult {
    /** employeeId -> set of shift-instance ids they may legally take. */
    eligibility: Map<string, Set<string>>;
    /** instanceId -> eligible employee ids (the transposed view). */
    eligibleByInstance: Map<string, string[]>;
    /** Slots with zero eligible employees, reported before search. */
    violations: ConstraintViolation[];
}

export function propagate(ctx: ModelContext): PropagationResult {
    const eligibility = new Map<string, Set<string>>();
    for (const emp of ctx.employees) {
        eligibility.set(emp.id, new Set(ctx.instances.map((i) => i.id)));
    }

    for (const constraint of ctx.constraints) {
        constraint.prune?.(ctx, eligibility);
    }

    const eligibleByInstance = new Map<string, string[]>();
    for (const inst of ctx.instances) eligibleByInstance.set(inst.id, []);
    for (const [employeeId, instances] of eligibility) {
        for (const instanceId of instances) eligibleByInstance.get(instanceId)?.push(employeeId);
    }

    const violations: ConstraintViolation[] = [];
    for (const inst of ctx.instances) {
        if ((eligibleByInstance.get(inst.id) ?? []).length === 0 && inst.minEmployees > 0) {
            violations.push({
                constraintId: 'min-staffing',
                severity: 'hard',
                shiftInstanceId: inst.id,
                message: `shift "${inst.id}" has zero eligible employees`,
            });
        }
    }

    return { eligibility, eligibleByInstance, violations };
}
