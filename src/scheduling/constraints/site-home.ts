/**
 * Home-site preference — a soft objective term.
 *
 * Opt-in via `ScheduleInput.objectives.homeSiteWeight`. The term contributes
 * `weight` points for every assignment where the employee has a `homeSiteId`
 * that differs from the shift's site. It never blocks an assignment; it merely
 * steers the solver toward rosters that keep people at their home site.
 *
 * Like the cost term, this is declared data, not a behavioural or predictive
 * signal, so it does not affect the `profilingFree` provenance claim.
 */

import type { AssignmentPair, SchedulingConstraint, SearchState } from '../types';
import { fromVerdict, instanceOf, pass } from './support';

export function siteHomePreference(weight: number): SchedulingConstraint {
    return fromVerdict({
        id: 'site-home',
        hardness: 'soft',
        weight,
        verdict(state: SearchState, pair: AssignmentPair) {
            const inst = instanceOf(state, pair);
            const employee = state.ctx.employeeById.get(pair.employeeId);
            const shiftSite = inst?.siteId;
            const homeSite = employee?.homeSiteId;

            if (!shiftSite || !homeSite) {
                return pass('site-home', 'no home-site preference configured');
            }
            if (shiftSite === homeSite) {
                return pass('site-home', `home site (${shiftSite})`);
            }
            return {
                ruleId: 'site-home',
                pass: false,
                severity: 'soft',
                message: `based at site "${homeSite}", shift at site "${shiftSite}"`,
                actual: 1,
                required: 0,
            };
        },
    });
}
