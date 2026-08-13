/**
 * Time-off — an employee never works during their blocked intervals. Hard by
 * default; prunes ineligible pairs before search.
 */

import type { SchedulingConstraint } from '../types';
import { overlaps } from './intervals';

export function timeOff(): SchedulingConstraint {
    return {
        id: 'time-off',
        hardness: 'hard',
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const blocked = ctx.employeeBlockedIntervals.get(employeeId) ?? [];
                if (blocked.length === 0) continue;
                for (const instanceId of [...instances]) {
                    const inst = ctx.instanceById.get(instanceId);
                    if (!inst) continue;
                    if (blocked.some((b) => overlaps(inst.startMinute, inst.endMinute, b.start, b.end))) {
                        instances.delete(instanceId);
                    }
                }
            }
        },
        delta(state, pair) {
            const inst = state.ctx.instanceById.get(pair.shiftInstanceId);
            if (!inst) return 0;
            const blocked = state.ctx.employeeBlockedIntervals.get(pair.employeeId) ?? [];
            return blocked.some((b) => overlaps(inst.startMinute, inst.endMinute, b.start, b.end)) ? 1 : 0;
        },
        explain(state, pair) {
            return this.delta(state, pair) > 0
                ? `employee "${pair.employeeId}" has time off during "${pair.shiftInstanceId}"`
                : null;
        },
    };
}
