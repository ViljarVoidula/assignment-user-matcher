/**
 * Fairness — equalising load across the team.
 *
 * Three deliberate choices:
 *
 * 1. **Per dimension, separately.** Equal total hours says nothing about who
 *    takes the nights. Two people can work identical hours while one does every
 *    weekend, so hours, nights, weekends and holidays are balanced as separate
 *    dimensions rather than rolled into one number.
 *
 * 2. **L1 deviation, not variance.** Variance is quadratic and non-decomposable:
 *    changing one person's load changes every other person's contribution
 *    through the mean, so it cannot be evaluated incrementally. Summed absolute
 *    deviation from the fair share gives the same ordering pressure and stays
 *    local.
 *
 * 3. **Realised counts only.** The fair share is computed from what people have
 *    actually been assigned, plus `carriedFairness` from previous periods. No
 *    behavioural or predictive signal enters — that boundary is what keeps this
 *    a constraint solver rather than profiling under AI Act Annex III 4(b).
 *
 * Pro-rata weighting matters legally as well as morally: the part-time,
 * fixed-term and agency directives all require equal treatment on a pro rata
 * temporis basis, so a half-time worker's fair share is half.
 */

import type { ConstraintViolation, FairnessRule, SchedulingConstraint, SearchState, ShiftInstance } from '../types';

export const FAIRNESS_CITATION = 'Directive 97/81/EC cl. 4 (pro rata temporis)';

export function fairness(rules: FairnessRule[]): SchedulingConstraint {
    return {
        id: 'fairness',
        hardness: 'soft',
        weight: 1,
        citation: FAIRNESS_CITATION,
        // Fairness is a property of the whole roster; no single assignment
        // breaches it, so the pair-scoped hooks stay silent by construction.
        delta: () => 0,
        explain: () => null,
        evaluate(state) {
            const out: ConstraintViolation[] = [];
            for (const rule of rules) {
                const loads = loadsFor(state, rule);
                if (loads.size === 0) continue;

                const values = [...loads.values()];
                const spread = Math.max(...values) - Math.min(...values);
                if (rule.hardMaxSpread === undefined || spread <= rule.hardMaxSpread) continue;

                const highest = [...loads.entries()].sort((a, b) => b[1] - a[1])[0];
                out.push({
                    constraintId: 'fairness',
                    severity: 'medium',
                    employeeId: highest[0],
                    message: `${label(rule)} spread across the team is ${round(spread)}, over the ${rule.hardMaxSpread} maximum (highest: "${highest[0]}" at ${round(highest[1])})`,
                    actual: spread,
                    required: rule.hardMaxSpread,
                    unit: 'count',
                    citation: FAIRNESS_CITATION,
                });
            }
            return out;
        },
    };
}

/**
 * Summed absolute deviation from the fair share, across every dimension.
 * Lower is fairer. The objective adds this, weighted, at the soft level.
 */
export function fairnessPenalty(state: SearchState, rules: FairnessRule[] | undefined): number {
    if (!rules?.length) return 0;
    let penalty = 0;
    for (const rule of rules) {
        const loads = loadsFor(state, rule);
        if (loads.size === 0) continue;

        const shares = shareWeights(state, rule, [...loads.keys()]);
        const total = [...loads.values()].reduce((a, b) => a + b, 0);
        const totalShare = [...shares.values()].reduce((a, b) => a + b, 0) || 1;

        for (const [employeeId, load] of loads) {
            const fair = (total * (shares.get(employeeId) ?? 1)) / totalShare;
            penalty += Math.abs(load - fair) * (rule.weight ?? 1);
        }
    }
    return penalty;
}

/** Per-employee load on one dimension, including counts carried in from prior periods. */
function loadsFor(state: SearchState, rule: FairnessRule): Map<string, number> {
    const key = rule.dimension === 'tag' ? `tag:${rule.tag}` : rule.dimension;
    const loads = new Map<string, number>();

    for (const employee of state.ctx.employees) {
        let load = employee.carriedFairness?.[key] ?? 0;
        for (const instanceId of state.byEmployee.get(employee.id) ?? []) {
            const inst = state.ctx.instanceById.get(instanceId);
            if (inst) load += contribution(state, rule, inst, employee.id);
        }
        loads.set(employee.id, load);
    }
    return loads;
}

function contribution(state: SearchState, rule: FairnessRule, inst: ShiftInstance, employeeId: string): number {
    switch (rule.dimension) {
        case 'minutes':
            return inst.workingMinutes;
        case 'shifts':
            return 1;
        case 'nights':
            return inst.isNightShift ? 1 : 0;
        case 'weekends':
            return inst.weekday === 6 || inst.weekday === 7 ? 1 : 0;
        case 'holidays':
            return inst.isPublicHoliday ? 1 : 0;
        case 'tag':
            return rule.tag && state.ctx.employeeTags.get(employeeId)?.has(rule.tag) ? 1 : 0;
        default:
            return 0;
    }
}

/**
 * Each person's entitlement weight. Equal by default; proportional to
 * contracted hours when `proRataByContract` is set, which is what the equal
 * treatment directives require for part-timers.
 */
function shareWeights(state: SearchState, rule: FairnessRule, employeeIds: string[]): Map<string, number> {
    const weights = new Map<string, number>();
    for (const id of employeeIds) {
        if (!rule.proRataByContract) {
            weights.set(id, 1);
            continue;
        }
        const weekly = state.ctx.employeeById.get(id)?.contract?.weeklyMinutes;
        weights.set(id, weekly && weekly > 0 ? weekly : 1);
    }
    return weights;
}

function label(rule: FairnessRule): string {
    return rule.dimension === 'tag' ? `"${rule.tag}" shift` : rule.dimension;
}

function round(value: number): number {
    return Math.round(value * 10) / 10;
}
