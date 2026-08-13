/**
 * Verdict collection — the single place a roster is judged.
 *
 * Both the solver's result assembly and `checkCompliance` run through here.
 * That is deliberate: an earlier version had the solver report only aggregate
 * violations while the compliance check evaluated every pair, so a solve could
 * announce "no hard violations" on a roster the compliance check then rejected.
 * Two judgement paths always drift, and the one that drifts is the one nobody
 * is reading at the time.
 */

import type { AssignmentPair, ConstraintViolation, RuleVerdict, SearchState } from '../types';

/** Every rule's verdict on one pair, in registry order. */
export function verdictsFor(state: SearchState, pair: AssignmentPair): RuleVerdict[] {
    const out: RuleVerdict[] = [];
    for (const constraint of state.ctx.constraints) {
        if (constraint.verdict) {
            out.push(constraint.verdict(state, pair));
            continue;
        }
        // Rules predating the structured SPI still contribute, through their
        // delta/explain pair, so no rule is silently skipped.
        const breach = constraint.delta(state, pair);
        const message = constraint.explain(state, pair);
        out.push({
            ruleId: constraint.id,
            pass: breach === 0,
            severity: constraint.hardness,
            message: message ?? `satisfies ${constraint.id}`,
            citation: constraint.citation,
        });
    }
    return out;
}

/** Breaches attributable to individual assignments in the committed roster. */
export function collectPairViolations(state: SearchState): ConstraintViolation[] {
    const out: ConstraintViolation[] = [];
    for (const [shiftInstanceId, employees] of state.assignments) {
        for (const employeeId of employees) {
            for (const v of verdictsFor(state, { employeeId, shiftInstanceId })) {
                if (v.pass) continue;
                out.push({
                    constraintId: v.ruleId,
                    severity: v.severity,
                    employeeId,
                    shiftInstanceId,
                    message: v.message,
                    citation: v.citation,
                    actual: v.actual,
                    required: v.required,
                    unit: v.unit,
                });
            }
        }
    }
    return out;
}

/** Breaches only a whole-roster view can see: coverage, quotas, team fairness. */
export function collectAggregateViolations(state: SearchState): ConstraintViolation[] {
    const out: ConstraintViolation[] = [];
    for (const constraint of state.ctx.constraints) {
        if (!constraint.evaluate) continue;
        for (const violation of constraint.evaluate(state)) {
            out.push({ citation: constraint.citation, ...violation });
        }
    }
    return out;
}
