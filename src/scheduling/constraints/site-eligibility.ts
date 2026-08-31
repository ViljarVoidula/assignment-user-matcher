/**
 * Site eligibility — a hard allow-list per employee.
 *
 * When an employee carries `siteIds`, they may only be assigned to shifts whose
 * `siteId` is in that list. Shifts without a site remain open to everyone, and
 * employees without the list remain eligible everywhere, so existing inputs are
 * unaffected.
 */

import type { AssignmentPair, SchedulingConstraint, SearchState } from '../types';
import { fromVerdict, instanceOf, pass } from './support';

export function siteEligibility(): SchedulingConstraint {
    return fromVerdict({
        id: 'site-eligibility',
        hardness: 'hard',
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const allowed = ctx.employeeById.get(employeeId)?.siteIds;
                if (!allowed || allowed.length === 0) continue;
                for (const instanceId of [...instances]) {
                    const inst = ctx.instanceById.get(instanceId);
                    if (inst?.siteId && !allowed.includes(inst.siteId)) {
                        instances.delete(instanceId);
                    }
                }
            }
        },
        verdict(state: SearchState, pair: AssignmentPair) {
            const inst = instanceOf(state, pair);
            const employee = state.ctx.employeeById.get(pair.employeeId);
            const siteId = inst?.siteId;
            const allowed = employee?.siteIds;

            if (!siteId || !allowed || allowed.length === 0) {
                return pass('site-eligibility', 'no site restriction');
            }
            if (allowed.includes(siteId)) {
                return pass('site-eligibility', `eligible for site "${siteId}"`);
            }
            return {
                ruleId: 'site-eligibility',
                pass: false,
                severity: 'hard',
                message: `employee "${pair.employeeId}" is not eligible for site "${siteId}"`,
                actual: 0,
                required: 1,
            };
        },
    });
}
