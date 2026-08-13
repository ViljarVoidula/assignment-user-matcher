/**
 * One-shift-per-day — an employee works at most one shift instance per calendar day.
 * Hard by default (mirrors the legacy `<= 1` rule, which was correct).
 */

import type { SchedulingConstraint } from '../types';

export function oneShiftPerDay(): SchedulingConstraint {
    return {
        id: 'one-shift-per-day',
        hardness: 'hard',
        delta(state, pair) {
            const inst = state.ctx.instanceById.get(pair.shiftInstanceId);
            if (!inst) return 0;
            const assigned = state.byEmployee.get(pair.employeeId);
            if (!assigned) return 0;
            for (const otherId of assigned) {
                if (otherId === pair.shiftInstanceId) continue;
                const other = state.ctx.instanceById.get(otherId);
                if (other && other.date === inst.date) return 1;
            }
            return 0;
        },
        explain(state, pair) {
            return this.delta(state, pair) > 0
                ? `employee "${pair.employeeId}" already has a shift on ${state.ctx.instanceById.get(pair.shiftInstanceId)?.date}`
                : null;
        },
    };
}
