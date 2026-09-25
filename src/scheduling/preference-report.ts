/**
 * Which stated preferences a finished roster honoured, and why the others
 * were not.
 *
 * Assembled once per result, never in the search loop. Eligibility is the
 * same judgement `rankCandidates` makes: no hard verdict against the pair,
 * and `hardCompliant`. So "nobody else could work it" here and an empty
 * candidate list there are one answer. The one difference is the question
 * asked: here it is whether a person could have taken a place somebody
 * holds, so the holder is taken off the shift for the check and put back.
 */

import type { EmployeePreferenceReport, PreferenceRuleOutcome, ShiftInstance } from './types';
import { assign, pairKey, unassign, type InternalState } from './engine/state';
import { hardCompliant } from './engine/construction';
import { verdictsFor } from './engine/verdicts';
import { ruleMatchesInstance } from './preferences';

function eligible(state: InternalState, employeeId: string, instanceId: string): boolean {
    const blocked = verdictsFor(state, { employeeId, shiftInstanceId: instanceId }).some(
        (v) => !v.pass && v.severity === 'hard',
    );
    return !blocked && hardCompliant(state.ctx, state, employeeId, instanceId);
}

/**
 * Runs `check` with `holderId` taken off the instance, then puts them back
 * exactly as they were (reasons included).
 *
 * The question a missed wish raises is "could somebody have *taken this
 * place*?", not "could somebody have been added beside it?". On a shift
 * already at `maxEmployees` the second question is always no — the
 * headcount cap is a hard rule — so asking it would call every trade-off
 * on a full shift a matter of cover.
 */
function withVacated(state: InternalState, holderId: string, instanceId: string, check: () => boolean): boolean {
    const reasons = state.reasons.get(pairKey(holderId, instanceId)) ?? [];
    unassign(state, holderId, instanceId);
    try {
        return check();
    } finally {
        assign(state, holderId, instanceId, reasons);
    }
}

/** Whether two employee records belong to the same person (`ctx.personIdOf` falls back to the id itself). */
function samePerson(state: InternalState, a: string, b: string): boolean {
    return state.ctx.personIdOf.get(a) === state.ctx.personIdOf.get(b);
}

/**
 * Whether anyone else could have worked `inst` in `employeeId`'s place.
 *
 * "Someone else" means someone else's *person*, not just another employee
 * record: two contracts for the same person are not mutual cover, or a
 * person with two records would always read as available to relieve
 * themselves.
 */
function someoneElseEligible(state: InternalState, employeeId: string, inst: ShiftInstance): boolean {
    return withVacated(state, employeeId, inst.id, () =>
        state.ctx.employees.some(
            (other) =>
                !samePerson(state, other.id, employeeId) &&
                !state.isAssigned(other.id, inst.id) &&
                eligible(state, other.id, inst.id),
        ),
    );
}

/** Whether `employeeId` could have worked `inst` — beside its holders, or in place of one of them. */
function couldHaveWorked(state: InternalState, employeeId: string, inst: ShiftInstance): boolean {
    if (eligible(state, employeeId, inst.id)) return true;
    const holders = [...(state.assignments.get(inst.id) ?? [])].filter((holder) => !samePerson(state, holder, employeeId));
    return holders.some((holder) => withVacated(state, holder, inst.id, () => eligible(state, employeeId, inst.id)));
}

export function preferenceReport(state: InternalState): EmployeePreferenceReport[] {
    const { ctx } = state;
    const out: EmployeePreferenceReport[] = [];
    for (const employee of ctx.employees) {
        const rules = ctx.preferenceRules.get(employee.id);
        if (!rules?.length) continue;
        const outcomes: PreferenceRuleOutcome[] = rules.map((rule) => {
            // Safe: ctx.preferenceRules is built by resolvePreferenceRules (preferences.ts),
            // which only ever keeps 'preferred' / 'avoid' rules — hard 'unavailable' rules
            // never reach this map.
            const kind = rule.kind as 'preferred' | 'avoid';
            const matching = ctx.instances.filter((inst) => ruleMatchesInstance(ctx.clock, rule, inst));
            const assigned = matching.filter((inst) => state.isAssigned(employee.id, inst.id));
            const dated = rule.fromDate !== undefined && rule.toDate !== undefined;
            const base = {
                ...(rule.id !== undefined ? { ruleId: rule.id } : {}),
                kind,
                priority: rule.priority ?? 'normal',
                matchedInstances: matching.length,
            };
            if (matching.length === 0) {
                return { ...base, honoured: 0, outcome: 'not-applicable', missed: [] };
            }
            if (kind === 'avoid') {
                const missed = assigned.map((inst) => ({
                    instanceId: inst.id,
                    reason: someoneElseEligible(state, employee.id, inst) ? ('tradeoff' as const) : ('cover' as const),
                }));
                const outcome =
                    assigned.length === 0 ? 'met' : dated || assigned.length === matching.length ? 'missed' : 'partly';
                return { ...base, honoured: matching.length - assigned.length, outcome, missed };
            }
            if (assigned.length > 0) return { ...base, honoured: assigned.length, outcome: 'met', missed: [] };
            const missed = dated
                ? matching.map((inst) => ({
                      instanceId: inst.id,
                      reason: couldHaveWorked(state, employee.id, inst) ? ('tradeoff' as const) : ('blocked' as const),
                  }))
                : [];
            return { ...base, honoured: 0, outcome: 'missed', missed };
        });
        out.push({ employeeId: employee.id, rules: outcomes });
    }
    return out;
}
