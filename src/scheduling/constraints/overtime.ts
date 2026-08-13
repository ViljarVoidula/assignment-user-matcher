/**
 * Overtime — the ordinary-vs-overtime split.
 *
 * `rolling-hours` caps *total* working time; this rule regulates the overtime
 * portion by itself, which several member states do separately: Estonia's TLS
 * §44 makes overtime conditional on the employee's agreement and compensates it
 * primarily in equal time off, Germany builds the 10-hour day out of 8 ordinary
 * plus averaged surplus, Austria caps overtime hours in their own right.
 *
 * Overtime is defined against an *ordinary baseline*, never inferred: the
 * caller supplies `ordinaryPerDayMinutes` / `ordinaryPerWeekMinutes`, and a
 * person's `contract.weeklyMinutes` overrides the weekly figure — a part-timer
 * on 20 agreed hours starts earning overtime at 20, not at full time. Both
 * measures run over rolling windows anchored on the person's own assignment
 * boundaries, like every other window rule in this module.
 *
 * Three checks, all hard:
 *   - consent: with `requiresConsent`, any overtime at all needs the employee's
 *     recorded `overtimeConsent`;
 *   - a cap on overtime in any rolling 24h;
 *   - caps on overtime over longer rolling windows, against the weekly baseline
 *     pro-rated to the window.
 *
 * Compensation in time off is not a constraint but a debt: `overtimeLedger`
 * turns each employee's period overtime into a `timeOffInLieu` ledger entry.
 */

import type { Employee, LedgerEntry, OvertimeRule, RuleVerdict, SchedulingConstraint, SearchState } from '../types';
import { ScheduleValidationError } from '../types';
import type { MinuteRange } from '../time';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, rulesFor, timelineFor, MINUTES_PER_DAY } from './support';

export const OVERTIME_CITATION = 'National overtime law (e.g. EE Töölepingu seadus §44, DE ArbZG §3)';

/**
 * Assert an overtime rule can actually be evaluated. Applied to the global rule
 * at registration and to each per-person override in `buildModel` — an override
 * replaces the whole family, so it must stand on its own.
 */
export function assertValidOvertimeRule(rule: OvertimeRule, owner = 'rules'): void {
    if (rule.ordinaryPerDayMinutes === undefined && rule.ordinaryPerWeekMinutes === undefined) {
        throw new ScheduleValidationError(
            `${owner}: overtime rule needs an ordinary baseline: set ordinaryPerDayMinutes and/or ordinaryPerWeekMinutes`,
        );
    }
    if (rule.maxOvertimePerDayMinutes !== undefined && rule.ordinaryPerDayMinutes === undefined) {
        throw new ScheduleValidationError(`${owner}: overtime.maxOvertimePerDayMinutes requires ordinaryPerDayMinutes`);
    }
    if (rule.maxOvertimeInWindow?.length && rule.ordinaryPerWeekMinutes === undefined) {
        throw new ScheduleValidationError(`${owner}: overtime.maxOvertimeInWindow requires ordinaryPerWeekMinutes`);
    }
}

export function overtime(rule: OvertimeRule): SchedulingConstraint {
    assertValidOvertimeRule(rule);

    return fromVerdict({
        id: 'overtime',
        hardness: 'hard',
        weight: 1,
        citation: rule.citation ?? OVERTIME_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('overtime', 'unknown shift');

            // Per-person overrides replace the whole family, so a minor or an
            // opted-out worker can carry a stricter (or absent) split.
            const applied = rulesFor(state.ctx, pair.employeeId).overtime;
            if (!applied) return pass('overtime', 'no overtime rule applies to this employee');
            const citation = applied.citation ?? OVERTIME_CITATION;

            const employee = state.ctx.employeeById.get(pair.employeeId);
            const weeklyOrdinary = employee?.contract?.weeklyMinutes ?? applied.ordinaryPerWeekMinutes;

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            const probe = { ...range, id: entryIdOf(pair), workingMinutes: inst.workingMinutes, tag: inst.shiftTypeTag };

            return timeline.withEntry(probe, (t) => {
                const dayOvertime =
                    applied.ordinaryPerDayMinutes === undefined
                        ? 0
                        : Math.max(
                              0,
                              t.maxWorkingMinutesInAnyWindow(MINUTES_PER_DAY, pad(range, MINUTES_PER_DAY)) -
                                  applied.ordinaryPerDayMinutes,
                          );
                const weekSpan = 7 * MINUTES_PER_DAY;
                const weekOvertime =
                    weeklyOrdinary === undefined
                        ? 0
                        : Math.max(0, t.maxWorkingMinutesInAnyWindow(weekSpan, pad(range, weekSpan)) - weeklyOrdinary);

                if (applied.requiresConsent && employee?.overtimeConsent !== true) {
                    const worst = Math.max(dayOvertime, weekOvertime);
                    if (worst > 0) {
                        return fail(
                            'overtime',
                            'hard',
                            `employee "${pair.employeeId}" would work ${h(worst)} of overtime but has not agreed to overtime`,
                            { actual: worst, required: 0, unit: 'minutes', citation },
                        );
                    }
                }

                if (applied.maxOvertimePerDayMinutes !== undefined && dayOvertime > applied.maxOvertimePerDayMinutes) {
                    return fail(
                        'overtime',
                        'hard',
                        `employee "${pair.employeeId}" would work ${h(dayOvertime)} of overtime in a 24h window, over the ${h(applied.maxOvertimePerDayMinutes)} cap`,
                        { actual: dayOvertime, required: applied.maxOvertimePerDayMinutes, unit: 'minutes', citation },
                    );
                }

                for (const window of applied.maxOvertimeInWindow ?? []) {
                    if (weeklyOrdinary === undefined) break;
                    const span = window.windowDays * MINUTES_PER_DAY;
                    const worked = t.maxWorkingMinutesInAnyWindow(span, pad(range, span));
                    const ordinary = Math.round((weeklyOrdinary * window.windowDays) / 7);
                    const windowOvertime = Math.max(0, worked - ordinary);
                    if (windowOvertime > window.maxMinutes) {
                        const label = window.label ?? `${h(window.maxMinutes)} overtime / ${window.windowDays}d`;
                        return fail(
                            'overtime',
                            'hard',
                            `employee "${pair.employeeId}" would work ${h(windowOvertime)} of overtime in some ${window.windowDays}-day window, over the ${label} limit`,
                            { actual: windowOvertime, required: window.maxMinutes, unit: 'minutes', citation },
                        );
                    }
                }

                return pass('overtime', 'within every configured overtime limit', { unit: 'minutes', citation });
            });
        },
    });
}

/** Windows overlapping `range` are the only ones the new shift can worsen. */
function pad(range: MinuteRange, span: number): MinuteRange {
    return { start: range.start - span, end: range.end + span };
}

/**
 * Time-off-in-lieu accrued by the roster: each employee's working minutes past
 * their pro-rated ordinary baseline, where the applied rule compensates
 * overtime in time off.
 *
 * Accrual is per employee record, not per person — the debt is owed under a
 * contract even when working-time *limits* aggregate across contracts. It needs
 * a weekly baseline (contract minutes or `ordinaryPerWeekMinutes`); a purely
 * daily split cannot be pro-rated over a period without inventing a workweek.
 */
export function overtimeLedger(state: SearchState): LedgerEntry[] {
    const out: LedgerEntry[] = [];
    for (const employee of state.ctx.employees) {
        const applied = rulesFor(state.ctx, employee.id).overtime;
        if (!applied || applied.compensation !== 'timeOff') continue;

        const overtimeMinutes = periodOvertimeMinutes(state, employee, applied);
        if (overtimeMinutes <= 0) continue;
        out.push({
            kind: 'timeOffInLieu',
            employeeId: employee.id,
            minutes: overtimeMinutes,
            reason: `${h(overtimeMinutes)} of overtime to be compensated by equal time off`,
            citation: applied.citation ?? OVERTIME_CITATION,
        });
    }
    return out;
}

/** Working minutes past the pro-rated weekly baseline over the whole period. */
function periodOvertimeMinutes(state: SearchState, employee: Employee, rule: OvertimeRule): number {
    const weeklyOrdinary = employee.contract?.weeklyMinutes ?? rule.ordinaryPerWeekMinutes;
    if (weeklyOrdinary === undefined) return 0;
    const baseline = Math.round((weeklyOrdinary * state.ctx.periodDays) / 7);
    return Math.max(0, (state.minutesByEmployee.get(employee.id) ?? 0) - baseline);
}
