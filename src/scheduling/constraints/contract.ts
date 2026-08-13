/**
 * Contract limits.
 *
 * Two shapes:
 *
 *   - **Hours contracts** carry period bounds in minutes, which sit alongside
 *     the statutory limits rather than replacing them — a contract may be
 *     stricter than the law but never looser.
 *   - **Day-count contracts** have no hours limit at all. The French
 *     *forfait jours* fixes 218 working *days* a year for autonomous staff, and
 *     the daily and weekly hour caps do not apply to them — but the 11h daily
 *     and 35h weekly rest still do. Modelling that as a very large hours budget
 *     would be wrong in both directions, so it gets its own counter.
 *
 * A contract end date also bounds eligibility: a fixed-term worker cannot be
 * rostered past their last day, which is easy to miss when the roster period
 * outruns the contract.
 */

import type { ConstraintViolation, RuleVerdict, SchedulingConstraint } from '../types';
import { fail, fromVerdict, h, instanceOf, pass, timelineFor, MINUTES_PER_DAY } from './support';

export function contractLimits(): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'contract',
        hardness: 'hard',
        weight: 1,
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const endDate = ctx.employeeById.get(employeeId)?.contract?.endDate;
                if (!endDate) continue;
                for (const instanceId of [...instances]) {
                    const inst = ctx.instanceById.get(instanceId);
                    if (inst && inst.date > endDate) instances.delete(instanceId);
                }
            }
        },
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            const contract = state.ctx.employeeById.get(pair.employeeId)?.contract;
            if (!inst || !contract) return pass('contract', 'no contract limits');

            if (contract.endDate && inst.date > contract.endDate) {
                return fail(
                    'contract',
                    'hard',
                    `employee "${pair.employeeId}"'s contract ends ${contract.endDate}, before "${inst.id}"`,
                );
            }

            const timeline = timelineFor(state, pair.employeeId);
            const probe = {
                start: inst.startMinute,
                end: inst.endMinute,
                id: `${pair.employeeId}@@${pair.shiftInstanceId}`,
                workingMinutes: inst.workingMinutes,
            };

            return timeline.withEntry(probe, (t) => {
                const periodWindow = { start: 0, end: state.ctx.periodDays * MINUTES_PER_DAY };

                if (contract.kind === 'days' && contract.maxDaysInPeriod !== undefined) {
                    const days = new Set(t.entriesIn(periodWindow).map((e) => state.ctx.clock.dayIndexOfMinute(e.start)))
                        .size;
                    if (days > contract.maxDaysInPeriod) {
                        return fail(
                            'contract',
                            'hard',
                            `employee "${pair.employeeId}" would work ${days} days, over their ${contract.maxDaysInPeriod}-day contract`,
                            { actual: days, required: contract.maxDaysInPeriod, unit: 'days' },
                        );
                    }
                    // Day-count contracts are deliberately silent on hours.
                    return pass('contract', `${days} of ${contract.maxDaysInPeriod} contract days used`, {
                        actual: days,
                        required: contract.maxDaysInPeriod,
                        unit: 'days',
                    });
                }

                if (contract.maxPeriodMinutes !== undefined) {
                    const worked = t.workingMinutesIn(periodWindow);
                    if (worked > contract.maxPeriodMinutes) {
                        return fail(
                            'contract',
                            'hard',
                            `employee "${pair.employeeId}" would work ${h(worked)}, over their ${h(contract.maxPeriodMinutes)} contract maximum`,
                            { actual: worked, required: contract.maxPeriodMinutes, unit: 'minutes' },
                        );
                    }
                }

                return pass('contract', 'within contract limits');
            });
        },
    });

    // A minimum is only judgeable on the finished roster: every partial roster
    // is below it by construction, so it cannot be a per-pair rule without
    // blocking the very assignments that would satisfy it.
    constraint.evaluate = (state): ConstraintViolation[] => {
        const out: ConstraintViolation[] = [];
        for (const employee of state.ctx.employees) {
            const contract = employee.contract;
            if (!contract || contract.kind === 'days' || contract.minPeriodMinutes === undefined) continue;
            const worked = state.minutesByEmployee.get(employee.id) ?? 0;
            if (worked >= contract.minPeriodMinutes) continue;
            out.push({
                constraintId: 'contract',
                severity: 'hard',
                employeeId: employee.id,
                message: `employee "${employee.id}" is rostered ${h(worked)}, below their ${h(contract.minPeriodMinutes)} contract minimum`,
                actual: worked,
                required: contract.minPeriodMinutes,
                unit: 'minutes',
            });
        }
        return out;
    };

    return constraint;
}
