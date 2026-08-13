/**
 * Statutory personal protections.
 *
 * `pregnancyNightExclusion` implements Directive 92/85/EEC Art 7: a pregnant
 * worker or new mother who produces a medical certificate must not be obliged
 * to perform night work. The remedy the Directive mandates is a *transfer to
 * daytime work*, or leave where that is not feasible — not simply an absence.
 * So the engine bars night assignment and records what is owed instead, rather
 * than quietly marking the person unavailable and shrinking the roster.
 *
 * `minor` and `hazardousNight` mostly select stricter values, which belong in
 * `Employee.rules` where they compose with every other rule. What lives here is
 * only what a rule override cannot express: the categorical night bar, and the
 * fallback obligation it creates.
 */

import type { ConstraintViolation, LedgerEntry, RuleVerdict, SchedulingConstraint, SearchState } from '../types';
import { fail, fromVerdict, instanceOf, pass } from './support';

export const PREGNANCY_CITATION = 'Directive 92/85/EEC Art 7';

export function protections(): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'protections',
        hardness: 'hard',
        weight: 1,
        citation: PREGNANCY_CITATION,
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const employee = ctx.employeeById.get(employeeId);
                if (!employee?.protections?.some((p) => p.kind === 'pregnancyNightExclusion')) continue;
                for (const instanceId of [...instances]) {
                    if (ctx.instanceById.get(instanceId)?.isNightShift) instances.delete(instanceId);
                }
            }
        },
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            const employee = state.ctx.employeeById.get(pair.employeeId);
            if (!inst || !employee?.protections?.length) return pass('protections', 'no protections registered');

            if (inst.isNightShift && employee.protections.some((p) => p.kind === 'pregnancyNightExclusion')) {
                return fail(
                    'protections',
                    'hard',
                    `employee "${pair.employeeId}" is excluded from night work on a medical certificate and cannot take "${inst.id}"`,
                    { citation: PREGNANCY_CITATION },
                );
            }

            return pass('protections', 'no protection bars this shift', { citation: PREGNANCY_CITATION });
        },
    });

    // Surface the mandated alternative. A protected worker left with no daytime
    // work has not been accommodated — they have been sidelined, which is the
    // outcome Art 7 exists to prevent.
    constraint.evaluate = (state) => {
        const out: ConstraintViolation[] = [];
        for (const employee of state.ctx.employees) {
            const protection = employee.protections?.find((p) => p.kind === 'pregnancyNightExclusion');
            if (!protection || protection.fallback !== 'dayShift') continue;
            if ((state.byEmployee.get(employee.id)?.size ?? 0) > 0) continue;
            out.push({
                constraintId: 'protections',
                severity: 'medium',
                employeeId: employee.id,
                message: `employee "${employee.id}" is excluded from night work and was given no daytime alternative; Art 7 requires a transfer to day work or leave`,
                citation: PREGNANCY_CITATION,
            });
        }
        return out;
    };

    return constraint;
}

/** Obligations owed to protected workers the roster could not accommodate. */
export function protectionLedger(state: SearchState): LedgerEntry[] {
    const out: LedgerEntry[] = [];
    for (const employee of state.ctx.employees) {
        const protection = employee.protections?.find((p) => p.kind === 'pregnancyNightExclusion');
        if (!protection) continue;
        if ((state.byEmployee.get(employee.id)?.size ?? 0) > 0) continue;
        out.push({
            kind: 'compensatoryRest',
            employeeId: employee.id,
            reason:
                protection.fallback === 'leave'
                    ? 'night-work exclusion with no daytime work available: leave or extended maternity leave is owed'
                    : 'night-work exclusion with no daytime work assigned: a transfer to day work is owed',
            citation: PREGNANCY_CITATION,
        });
    }
    return out;
}
