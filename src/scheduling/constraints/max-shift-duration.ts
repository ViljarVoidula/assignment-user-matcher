/**
 * Max-shift-duration — a single shift never exceeds the employee's per-shift
 * cap. Hard by default; prunes ineligible pairs before search.
 */

import type { SchedulingConstraint } from '../types';

export function maxShiftDuration(): SchedulingConstraint {
    const exceeds = (empMax: number | undefined, durationMinutes: number) =>
        empMax !== undefined && durationMinutes > empMax;
    return {
        id: 'max-shift-duration',
        hardness: 'hard',
        prune(ctx, eligibility) {
            for (const [employeeId, instances] of eligibility) {
                const empMax = ctx.employeeById.get(employeeId)?.maxShiftDurationMinutes;
                if (empMax === undefined) continue;
                for (const instanceId of [...instances]) {
                    const inst = ctx.instanceById.get(instanceId);
                    if (inst && exceeds(empMax, inst.durationMinutes)) instances.delete(instanceId);
                }
            }
        },
        delta(state, pair) {
            const empMax = state.ctx.employeeById.get(pair.employeeId)?.maxShiftDurationMinutes;
            const inst = state.ctx.instanceById.get(pair.shiftInstanceId);
            return inst && exceeds(empMax, inst.durationMinutes) ? 1 : 0;
        },
        explain(state, pair) {
            const empMax = state.ctx.employeeById.get(pair.employeeId)?.maxShiftDurationMinutes;
            return this.delta(state, pair) > 0
                ? `shift "${pair.shiftInstanceId}" exceeds employee "${pair.employeeId}" max shift duration of ${empMax} minutes`
                : null;
        },
    };
}
