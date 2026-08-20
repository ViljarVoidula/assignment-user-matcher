/**
 * No-overlap — a person's assignments must never overlap in time, including
 * across midnight for overnight shifts. Hard by default.
 *
 * Judged on the person timeline, not the employee record (CJEU C-585/19): two
 * contracts sharing a `personId` must not put the person in two places at
 * once, and a rostered shift must not overlap a history entry either.
 */

import type { SchedulingConstraint } from '../types';
import { entryIdOf, instanceOf, rangeOf, timelineFor } from './support';

export function noOverlap(): SchedulingConstraint {
    return {
        id: 'no-overlap',
        hardness: 'hard',
        delta(state, pair) {
            const inst = instanceOf(state, pair);
            if (!inst) return 0;
            const own = entryIdOf(pair);
            for (const entry of timelineFor(state, pair.employeeId).entriesIn(rangeOf(inst))) {
                if (entry.id !== own) return 1;
            }
            return 0;
        },
        explain(state, pair) {
            return this.delta(state, pair) > 0
                ? `shift "${pair.shiftInstanceId}" overlaps other work of employee "${pair.employeeId}"'s person`
                : null;
        },
    };
}
