/**
 * Constraint registry — pure logic.
 *
 * Built-ins are the legacy rules re-derived correctly; the registry lets
 * callers override hardness/weights or add customs without engine surgery.
 * Adding a built-in = new file here plus one line in `createDefaultConstraints`.
 *
 * `one-shift-per-day` is opt-in rather than always-on: split shifts are lawful
 * and common (Directive 2003/88/EC Art 17(4)(b) names them explicitly), as is
 * an on-call duty attached to the same day as a rostered shift. `no-overlap`
 * plus `min-rest` already prevent the physically impossible cases, so forcing
 * one shift per calendar day is a policy choice, not a safety net.
 */

import type { ObjectiveWeights, SchedulingConstraint, WorkingTimeRules } from '../types';
import { oneShiftPerDay } from './one-shift-per-day';
import { noOverlap } from './no-overlap';
import { minStaffing } from './min-staffing';
import { timeOff } from './time-off';
import { hourBudget } from './hour-budget';
import { maxShiftDuration } from './max-shift-duration';
import { minRest } from './min-rest';
import { dailyRest } from './daily-rest';
import { weeklyRest } from './weekly-rest';
import { rollingHours } from './rolling-hours';
import { nightWork } from './night-work';
import { consecutiveConstraints } from './consecutive';
import { startInterval } from './start-interval';
import { inShiftBreaks } from './in-shift-breaks';
import { restDays } from './rest-days';
import { engagementFloor } from './engagement-floor';
import { noticeRule } from './notice';
import { fairness } from './fairness';
import { availability } from './availability';
import { qualification } from './qualification';
import { groupComposition } from './group-composition';
import { protections } from './protections';
import { contractLimits } from './contract';
import { overtime } from './overtime';
import { dutyQuotas } from './duty-quota';
import { costObjective } from './cost';

export interface DefaultConstraintOptions {
    /** Minimum rest between consecutive assignments, in minutes. */
    minRestMinutes: number;
    /** Whether to enforce at most one shift per calendar day. Defaults to false. */
    oneShiftPerDay?: boolean;
    /** The labour-law layer. Each family present here registers its constraint. */
    rules?: WorkingTimeRules;
    /** Optional soft-objective terms; a positive cost weight registers the cost term. */
    objectives?: ObjectiveWeights;
}

/**
 * The built-in constraints in evaluation order.
 *
 * The always-on set is the physical/contractual core. Everything driven by
 * `WorkingTimeRules` registers only when its rule family is present, so a
 * caller who supplies no rules pays for nothing, and a sectoral regime that
 * *replaces* a Working Time Directive rule (Art 14/20/21) omits it rather than
 * widening its bounds.
 */
export function createDefaultConstraints(options: DefaultConstraintOptions): SchedulingConstraint[] {
    const constraints: SchedulingConstraint[] = [];
    const rules = options.rules ?? {};

    if (options.oneShiftPerDay) constraints.push(oneShiftPerDay());
    constraints.push(noOverlap(), minStaffing(), timeOff(), hourBudget(), maxShiftDuration());

    // Rest: the rule-driven form supersedes the simple gap check when configured.
    if (rules.dailyRest) constraints.push(dailyRest(rules.dailyRest));
    else constraints.push(minRest(options.minRestMinutes));
    if (rules.weeklyRest) constraints.push(weeklyRest(rules.weeklyRest));

    if (rules.workingTime) constraints.push(rollingHours(rules.workingTime));
    if (rules.overtime) constraints.push(overtime(rules.overtime));
    if (rules.dutyQuotas?.length) constraints.push(dutyQuotas(rules.dutyQuotas));
    if (rules.nightWork) constraints.push(nightWork(rules.nightWork));
    if (rules.consecutive) constraints.push(...consecutiveConstraints(rules.consecutive));
    if (rules.minimumStartInterval) constraints.push(startInterval(rules.minimumStartInterval));
    if (rules.breaks?.length) constraints.push(inShiftBreaks(rules.breaks));
    if (rules.restDays) constraints.push(restDays(rules.restDays));
    if (rules.engagement) constraints.push(engagementFloor(rules.engagement));
    if (rules.notice) constraints.push(noticeRule(rules.notice));
    if (rules.fairness?.length) constraints.push(fairness(rules.fairness));

    // Always-on person-scoped rules: they no-op unless the employee carries the
    // relevant data, so they cost nothing for simple rosters.
    constraints.push(availability(), qualification(), groupComposition(), protections(), contractLimits());

    // The cost term is score-only: its verdict always passes, so it steers the
    // search without ever appearing as a violation.
    const costWeight = options.objectives?.costWeightPerEuro;
    if (costWeight !== undefined && costWeight > 0) constraints.push(costObjective(costWeight));

    return constraints;
}
