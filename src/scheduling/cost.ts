/**
 * Labour-cost arithmetic — pure logic, shared by the solve objective, the
 * repair candidate ranking and the result's cost summary.
 *
 * One implementation on purpose: an objective that minimises a different cost
 * than the ranking reports would steer the roster one way and justify it
 * another. All money is minor units (cents), integral until the final rounding.
 *
 * What is priced, and what deliberately is not:
 *
 *   - The *working* portion of a span is paid at the hourly rate, uplifted by
 *     whichever premium bands apply (night / Sunday / holiday), stacked
 *     additively or by maximum as the cost model says.
 *   - The non-working remainder of a *duty-classified* span — stand-by hours
 *     that occupy the clock without counting as work — is paid flat at
 *     `standbyRateFraction` of the rate (Estonia's *valveaeg* owes ≥ 1/10 of
 *     the agreed wage). No premiums apply to it; unset means unpaid.
 *   - Overtime is a per-employee surcharge on the minutes worked past
 *     `overtimeAfterMinutes`, at `(overtimeMultiplier − 1)` on top of the base
 *     already priced per shift. Kept separate from the per-shift price because
 *     which minutes are "the overtime ones" is an accounting fiction — the
 *     surcharge belongs to the person's total, not to any one shift.
 */

import type { Employee, EmployeeCost, EngagementRule, SearchState, ShiftInstance } from './types';
import { paidMinutesFor } from './constraints/engagement-floor';

/**
 * Price of one shift for one cost model, excluding any overtime surcharge.
 *
 * Premium predicates are judged on the instance: `night` applies when any of
 * the shift falls in the configured night band, `sunday`/`holiday` on the start
 * day. Romania stacks premiums additively (overtime 75% + night 25% + holiday
 * 100%); most jurisdictions apply only the largest, so `'max'` is the default —
 * under-stating the Romanian bill rather than over-stating everyone else's.
 */
export function shiftCostCents(inst: ShiftInstance, cost: EmployeeCost | undefined, engagement?: EngagementRule): number {
    if (!cost?.hourlyRateCents) return 0;

    const paid = paidMinutesFor(inst, engagement);
    const base = (paid / 60) * cost.hourlyRateCents;

    const multipliers: number[] = [];
    for (const premium of cost.premiums ?? []) {
        const applies =
            (premium.predicate === 'night' && inst.nightMinutes > 0) ||
            (premium.predicate === 'sunday' && inst.isSunday) ||
            (premium.predicate === 'holiday' && inst.isPublicHoliday);
        if (applies) multipliers.push(premium.multiplier);
    }
    const uplift =
        multipliers.length === 0
            ? 1
            : cost.stacking === 'add'
              ? 1 + multipliers.reduce((sum, m) => sum + (m - 1), 0)
              : Math.max(...multipliers);

    return Math.round(base * uplift + standbyAllowanceCents(inst, cost));
}

/**
 * The stand-by allowance for the non-working remainder of a duty-classified
 * span. Only duty-classified instances have one — for a plain shift the
 * remainder is the unpaid break, which is unpaid by definition.
 */
function standbyAllowanceCents(inst: ShiftInstance, cost: EmployeeCost): number {
    if (!cost.standbyRateFraction || !inst.duty || inst.duty.countsAsWorkingTime === 'full') return 0;
    const standbyMinutes = Math.max(0, inst.durationMinutes - inst.workingMinutes);
    return (standbyMinutes / 60) * cost.hourlyRateCents! * cost.standbyRateFraction;
}

/**
 * Surcharge owed on `workedMinutes` of total working time — the extra above
 * base rate for the minutes past the overtime threshold. Base pay for those
 * minutes is already in the per-shift price, so only the uplift is added here.
 */
export function overtimeSurchargeCents(workedMinutes: number, cost: EmployeeCost | undefined): number {
    if (!cost?.hourlyRateCents || cost.overtimeAfterMinutes === undefined || !cost.overtimeMultiplier) return 0;
    const overtime = Math.max(0, workedMinutes - cost.overtimeAfterMinutes);
    return Math.round((overtime / 60) * cost.hourlyRateCents * (cost.overtimeMultiplier - 1));
}

/**
 * Marginal cost of adding one shift on top of `workedMinutes` already assigned:
 * the shift's own price plus the overtime surcharge it newly triggers. This is
 * the number a call-out decision needs — the same shift is dearer in the hands
 * of someone already at their threshold.
 */
export function marginalCostCents(
    inst: ShiftInstance,
    employee: Employee,
    workedMinutes: number,
    engagement?: EngagementRule,
): number {
    const cost = employee.cost;
    if (!cost?.hourlyRateCents) return 0;
    return (
        shiftCostCents(inst, cost, engagement) +
        overtimeSurchargeCents(workedMinutes + inst.workingMinutes, cost) -
        overtimeSurchargeCents(workedMinutes, cost)
    );
}

/**
 * Whole-roster cost, per employee and total, or `undefined` when nobody has a
 * cost model — so rosters without one keep a byte-identical result shape.
 */
export function rosterCost(state: SearchState): { totalCents: number; byEmployee: Record<string, number> } | undefined {
    const ctx = state.ctx;
    if (!ctx.employees.some((e) => e.cost?.hourlyRateCents)) return undefined;

    const byEmployee: Record<string, number> = {};
    let totalCents = 0;
    for (const employee of ctx.employees) {
        let cents = 0;
        for (const instanceId of state.byEmployee.get(employee.id) ?? []) {
            const inst = ctx.instanceById.get(instanceId);
            if (inst) cents += shiftCostCents(inst, employee.cost, ctx.rules.engagement);
        }
        cents += overtimeSurchargeCents(state.minutesByEmployee.get(employee.id) ?? 0, employee.cost);
        if (cents > 0) byEmployee[employee.id] = cents;
        totalCents += cents;
    }
    return { totalCents, byEmployee };
}
