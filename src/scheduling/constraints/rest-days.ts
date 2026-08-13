/**
 * Sunday, public-holiday and free-Sunday rules.
 *
 * Three distinct shapes live here because national law mixes them freely:
 *
 *   - **Outright bars.** Germany prohibits Sunday and holiday work altogether
 *     (ArbZG §9) subject to a long exception list; Belgium, Austria, Poland and
 *     Portugal work the same way. Whether an exception applies is the caller's
 *     call, expressed by leaving `sundayAllowed` unset.
 *   - **Free-Sunday quotas.** Germany guarantees at least 15 work-free Sundays a
 *     year, the Netherlands 13 per 52 weeks, Poland one in every four. These are
 *     counting rules over a calendar predicate, and they can only be judged
 *     across the whole roster — a single assignment never breaches them.
 *   - **Compensatory rest days.** Sunday or holiday work creates a *dated debt*:
 *     a substitute rest day within two weeks in Germany, eight for a holiday;
 *     six days either side in Poland. The obligation outlives the roster, so it
 *     is reported to the caller as a ledger entry rather than solved for.
 */

import type {
    ConstraintViolation,
    LedgerEntry,
    RestDayRule,
    RuleVerdict,
    SchedulingConstraint,
    SearchState,
} from '../types';
import { addDays } from '../time';
import { fail, fromVerdict, instanceOf, pass } from './support';

export const SUNDAY_CITATION = 'National Sunday/holiday rest law';

export function restDays(rule: RestDayRule): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'rest-days',
        hardness: 'hard',
        weight: 1,
        citation: SUNDAY_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('rest-days', 'unknown shift');

            if (rule.sundayAllowed === false && inst.isSunday) {
                return fail('rest-days', 'hard', `Sunday work is not permitted, and "${inst.id}" falls on a Sunday`, {
                    citation: SUNDAY_CITATION,
                });
            }
            if (rule.holidayAllowed === false && inst.isPublicHoliday) {
                return fail(
                    'rest-days',
                    'hard',
                    `public-holiday work is not permitted, and "${inst.id}" falls on ${inst.date}`,
                    { citation: SUNDAY_CITATION },
                );
            }
            return pass('rest-days', 'permitted on this calendar day', { citation: SUNDAY_CITATION });
        },
    });

    // Free-Sunday quotas are team-wide counting rules over the finished roster.
    constraint.evaluate = (state) => {
        const out: ConstraintViolation[] = [];
        if (!rule.minFreeSundaysPerYear && !rule.minFreeSundaysPer) return out;

        const sundays = sundaysInPeriod(state);
        if (sundays.length === 0) return out;

        for (const employee of state.ctx.employees) {
            const worked = new Set(
                [...(state.byEmployee.get(employee.id) ?? [])]
                    .map((id) => state.ctx.instanceById.get(id))
                    .filter((inst) => inst?.isSunday)
                    .map((inst) => inst!.date),
            );
            const free = sundays.filter((date) => !worked.has(date)).length;

            if (rule.minFreeSundaysPer) {
                // Pro-rate the rolling quota to the period actually being solved,
                // so a 4-week roster is judged against its share, not a year's.
                const windows = sundays.length / rule.minFreeSundaysPer.weeks;
                const required = Math.floor(rule.minFreeSundaysPer.count * windows);
                if (required > 0 && free < required) {
                    out.push(quotaViolation(employee.id, free, required, 'rolling'));
                }
            }
            if (rule.minFreeSundaysPerYear !== undefined) {
                const required = Math.floor((rule.minFreeSundaysPerYear * sundays.length) / 52);
                if (required > 0 && free < required) {
                    out.push(quotaViolation(employee.id, free, required, 'annual'));
                }
            }
        }
        return out;
    };

    return constraint;
}

function quotaViolation(employeeId: string, free: number, required: number, kind: string): ConstraintViolation {
    return {
        constraintId: 'rest-days',
        severity: 'medium',
        employeeId,
        message: `employee "${employeeId}" gets ${free} free Sunday(s) in this period, below the ${required} implied by the ${kind} quota`,
        actual: free,
        required,
        unit: 'count',
        citation: SUNDAY_CITATION,
    };
}

function sundaysInPeriod(state: SearchState): string[] {
    const out: string[] = [];
    for (let day = 0; day < state.ctx.periodDays; day++) {
        const date = state.ctx.clock.dateAt(day);
        if (state.ctx.clock.weekdayOfMinute(state.ctx.clock.dayStartMinutes(day)) === 7) out.push(date);
    }
    return out;
}

/**
 * Substitute rest days owed for Sunday and public-holiday work.
 *
 * Returned to the caller rather than enforced: the obligation is discharged by
 * granting a day off, often in a period this solve does not cover, so the
 * honest output is a dated debt the operator can act on.
 */
export function compensatoryRestLedger(state: SearchState, rule: RestDayRule | undefined): LedgerEntry[] {
    const within = rule?.compensatoryRestWithinDays;
    if (!within) return [];

    const out: LedgerEntry[] = [];
    for (const [instanceId, employees] of state.assignments) {
        const inst = state.ctx.instanceById.get(instanceId);
        if (!inst || employees.size === 0) continue;

        const deadlineDays = inst.isPublicHoliday ? within.holiday : inst.isSunday ? within.sunday : undefined;
        if (deadlineDays === undefined) continue;

        for (const employeeId of employees) {
            out.push({
                kind: 'substituteRestDay',
                employeeId,
                dueBy: addDays(inst.date, deadlineDays),
                reason: `worked "${inst.id}" on ${inst.isPublicHoliday ? 'a public holiday' : 'a Sunday'} (${inst.date})`,
                citation: SUNDAY_CITATION,
            });
        }
    }
    return out;
}
