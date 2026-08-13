/**
 * No-overlap — an employee's assignments must never overlap in time, including
 * across midnight for overnight shifts. Hard by default.
 */

import type { SchedulingConstraint } from '../types';
import { overlaps } from './intervals';

export function noOverlap(): SchedulingConstraint {
    return {
        id: 'no-overlap',
        hardness: 'hard',
        delta(state, pair) {
            const inst = state.ctx.instanceById.get(pair.shiftInstanceId);
            if (!inst) return 0;
            const assigned = state.byEmployee.get(pair.employeeId);
            if (!assigned) return 0;
            for (const otherId of assigned) {
                if (otherId === pair.shiftInstanceId) continue;
                const other = state.ctx.instanceById.get(otherId);
                if (other && overlaps(inst.startMinute, inst.endMinute, other.startMinute, other.endMinute)) return 1;
            }
            return 0;
        },
        explain(state, pair) {
            return this.delta(state, pair) > 0
                ? `shift "${pair.shiftInstanceId}" overlaps another assignment of employee "${pair.employeeId}"`
                : null;
        },
    };
}
