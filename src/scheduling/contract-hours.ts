/**
 * Contracted hours — pure arithmetic shared by the model, the contract rule,
 * the objective and the result summary.
 *
 * A person's contracted week can be stated two ways: as minutes
 * (`contract.weeklyMinutes`) or as a fraction of full time (`contract.fte`).
 * Both resolve **once**, in `buildModel`, to `ModelContext.contractedWeeklyMinutes`,
 * and every consumer — the overtime baseline, pro-rata fairness, the
 * contract-hours objective, the period cap — reads that one map. Resolving in
 * each rule separately is how a half-timer ends up with a full-time overtime
 * threshold and a half-time fairness share in the same roster.
 *
 * The full-time week the fraction is measured against is caller data
 * (`rules.contract.fullTimeWeeklyMinutes`, or the ordinary week the overtime
 * rule already states). The engine ships no figure for it: what "full time"
 * means is a contractual or statutory fact that differs by country and by
 * collective agreement, and the library's position is to carry rule shapes and
 * never a jurisdiction's values.
 */

import type { ContractHoursSummary, Employee, SearchState, WorkingTimeRules } from './types';
import { ScheduleValidationError } from './types';

/** Default `objectives.contractHoursWeight`: one soft point per hour away from contract. */
export const DEFAULT_CONTRACT_HOURS_WEIGHT = 1;

/** The full-time week the rules state, if any. */
export function fullTimeWeeklyMinutes(rules: WorkingTimeRules | undefined): number | undefined {
    return rules?.contract?.fullTimeWeeklyMinutes ?? rules?.overtime?.ordinaryPerWeekMinutes;
}

/**
 * A person's contracted week in minutes, or `undefined` when their contract
 * states none. Throws when an `fte` cannot be resolved — the engine never
 * guesses a working week.
 */
export function resolveContractedWeeklyMinutes(
    employee: Employee,
    rules: WorkingTimeRules | undefined,
): number | undefined {
    const contract = employee.contract;
    if (!contract) return undefined;
    if (contract.weeklyMinutes !== undefined) {
        if (!Number.isFinite(contract.weeklyMinutes) || contract.weeklyMinutes < 0) {
            throw new ScheduleValidationError(
                `Employee "${employee.id}" has invalid contract.weeklyMinutes: ${contract.weeklyMinutes}`,
            );
        }
        return contract.weeklyMinutes;
    }
    if (contract.fte === undefined) return undefined;
    if (!Number.isFinite(contract.fte) || contract.fte <= 0 || contract.fte > 1) {
        throw new ScheduleValidationError(
            `Employee "${employee.id}" has invalid contract.fte: ${contract.fte} (expected 0 < fte <= 1)`,
        );
    }
    const fullTime = fullTimeWeeklyMinutes(rules);
    if (fullTime === undefined) {
        throw new ScheduleValidationError(
            `Employee "${employee.id}" has contract.fte but no full-time week to measure it against: set rules.contract.fullTimeWeeklyMinutes (or rules.overtime.ordinaryPerWeekMinutes)`,
        );
    }
    return Math.round(fullTime * contract.fte);
}

/** A weekly figure pro-rated to a period of `periodDays` days. */
export function contractedPeriodMinutes(weeklyMinutes: number, periodDays: number): number {
    return Math.round((weeklyMinutes * periodDays) / 7);
}

/**
 * Summed distance from contract across the roster, in hours, weighted. Lower
 * is better; the objective adds it at the soft level. Symmetric on purpose —
 * with coverage fixed by demand, penalising both surplus and shortfall is what
 * distributes the hours pro rata instead of merely capping the busiest.
 */
export function contractHoursPenalty(state: SearchState): number {
    const weight = state.ctx.contractHoursWeight;
    if (!(weight > 0) || state.ctx.contractedPeriodMinutes.size === 0) return 0;
    let penalty = 0;
    for (const [employeeId, contracted] of state.ctx.contractedPeriodMinutes) {
        const planned = state.minutesByEmployee.get(employeeId) ?? 0;
        penalty += Math.abs(planned - contracted) / 60;
    }
    return penalty * weight;
}

/** Planned against contracted, per employee with a contract, in input order. */
export function contractHoursSummary(state: SearchState): ContractHoursSummary[] {
    const out: ContractHoursSummary[] = [];
    for (const employee of state.ctx.employees) {
        const weeklyMinutes = state.ctx.contractedWeeklyMinutes.get(employee.id);
        const contractedMinutes = state.ctx.contractedPeriodMinutes.get(employee.id);
        if (weeklyMinutes === undefined || contractedMinutes === undefined) continue;
        const plannedMinutes = state.minutesByEmployee.get(employee.id) ?? 0;
        const fullTime = fullTimeWeeklyMinutes(state.ctx.rulesByEmployee.get(employee.id) ?? state.ctx.rules);
        const fte =
            employee.contract?.fte ??
            (fullTime !== undefined && fullTime > 0 ? Math.round((weeklyMinutes / fullTime) * 1000) / 1000 : undefined);
        out.push({
            employeeId: employee.id,
            weeklyMinutes,
            ...(fte !== undefined ? { fte } : {}),
            contractedMinutes,
            plannedMinutes,
            deltaMinutes: plannedMinutes - contractedMinutes,
        });
    }
    return out;
}
