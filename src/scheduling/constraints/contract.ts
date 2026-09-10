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
import { fail, fromVerdict, h, instanceOf, pass, rulesFor, timelineFor, MINUTES_PER_DAY } from './support';

export const CONTRACT_HOURS_CITATION = 'Contract of employment; Directive 97/81/EC cl. 4 (pro rata temporis)';

export function contractLimits(): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'contract',
        hardness: 'hard',
        weight: 1,
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const contract = ctx.employeeById.get(employeeId)?.contract;
                if (!contract?.startDate && !contract?.endDate) continue;
                for (const instanceId of [...instances]) {
                    const inst = ctx.instanceById.get(instanceId);
                    if (!inst) continue;
                    // Both ends, one rule: a shift before somebody joins is as
                    // unworkable as one after they leave.
                    if (contract.endDate && inst.date > contract.endDate) instances.delete(instanceId);
                    else if (contract.startDate && inst.date < contract.startDate) instances.delete(instanceId);
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
            if (contract.startDate && inst.date < contract.startDate) {
                return fail(
                    'contract',
                    'hard',
                    `employee "${pair.employeeId}"'s contract starts ${contract.startDate}, after "${inst.id}"`,
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

                // A contract bounds the employee *record*, not the person (the
                // same per-record reading as the minimum aggregate below and the
                // timeOffInLieu ledger): the person timeline also carries
                // sibling contracts' entries, which must not eat this
                // contract's budget. Roster entries are attributable by their
                // `${employeeId}@@` prefix; history entries are not
                // attributable to either record, so they count conservatively.
                const ownPrefix = `${pair.employeeId}@@`;
                const attributable = t
                    .entriesIn(periodWindow)
                    .filter((e) => !e.id.includes('@@') || e.id.startsWith(ownPrefix));

                if (contract.kind === 'days' && contract.maxDaysInPeriod !== undefined) {
                    const days = new Set(attributable.map((e) => state.ctx.clock.dayIndexOfMinute(e.start))).size;
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

                const contracted = state.ctx.contractedPeriodMinutes.get(pair.employeeId);
                const maxOver = rulesFor(state.ctx, pair.employeeId).contract?.maxOverMinutes;
                if (contract.maxPeriodMinutes === undefined && contracted === undefined) {
                    return pass('contract', 'within contract limits');
                }

                const worked = attributable.reduce((sum, e) => {
                    const overlap = Math.min(e.end, periodWindow.end) - Math.max(e.start, periodWindow.start);
                    const span = e.end - e.start;
                    return sum + (span > 0 ? Math.round((e.workingMinutes * Math.max(0, overlap)) / span) : 0);
                }, 0);
                if (contract.maxPeriodMinutes !== undefined && worked > contract.maxPeriodMinutes) {
                    return fail(
                        'contract',
                        'hard',
                        `employee "${pair.employeeId}" would work ${h(worked)}, over their ${h(contract.maxPeriodMinutes)} contract maximum`,
                        { actual: worked, required: contract.maxPeriodMinutes, unit: 'minutes' },
                    );
                }
                // The contracted week pro-rated to the period, plus whatever
                // surplus the rules allow. Whether the surplus is a breach or
                // merely overtime is the caller's regime, which is why the cap
                // is opt-in.
                if (contracted !== undefined && maxOver !== undefined && worked > contracted + maxOver) {
                    return fail(
                        'contract',
                        'hard',
                        `employee "${pair.employeeId}" would work ${h(worked)}, over their ${h(contracted)} contracted for the period` +
                            (maxOver > 0 ? ` (${h(maxOver)} over allowed)` : ''),
                        {
                            actual: worked,
                            required: contracted + maxOver,
                            unit: 'minutes',
                            citation: rulesFor(state.ctx, pair.employeeId).contract?.citation ?? CONTRACT_HOURS_CITATION,
                        },
                    );
                }

                return contracted === undefined
                    ? pass('contract', 'within contract limits')
                    : pass('contract', `${h(worked)} of ${h(contracted)} contracted for the period`, {
                          actual: worked,
                          required: contracted,
                          unit: 'minutes',
                      });
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
            if (!contract) continue;
            const worked = state.minutesByEmployee.get(employee.id) ?? 0;
            if (contract.kind !== 'days' && contract.minPeriodMinutes !== undefined && worked < contract.minPeriodMinutes) {
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
            // A shortfall against the contracted week is a report, not a
            // breach: the roster is short of what the person is owed, which
            // the manager needs to see, but blocking on it would stall the
            // very assignments that close it.
            const rule = rulesFor(state.ctx, employee.id).contract;
            const contracted = state.ctx.contractedPeriodMinutes.get(employee.id);
            if (rule?.maxUnderMinutes === undefined || contracted === undefined) continue;
            const shortfall = contracted - worked;
            if (shortfall <= rule.maxUnderMinutes) continue;
            const fte = contract.fte !== undefined ? ` (${contract.fte} FTE)` : '';
            out.push({
                constraintId: 'contract',
                severity: 'soft',
                employeeId: employee.id,
                message: `employee "${employee.id}" is planned ${h(worked)} against ${h(contracted)} contracted for the period${fte}, ${h(shortfall)} short`,
                actual: worked,
                required: contracted - rule.maxUnderMinutes,
                unit: 'minutes',
                citation: rule.citation ?? CONTRACT_HOURS_CITATION,
            });
        }
        return out;
    };

    return constraint;
}
