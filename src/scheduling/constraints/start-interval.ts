/**
 * Minimum interval between shift *starts* — Poland's *doba pracownicza*.
 *
 * Polish law defines a "worker's day" as the 24 consecutive hours from the
 * start of work. Beginning work again inside that window counts as overtime
 * regardless of how much rest was taken in between, so a person who finishes at
 * 14:00 and starts again at 06:00 the next morning has had 16 hours off — well
 * clear of any rest rule — and is still inside the previous *doba*.
 *
 * That makes it a distinct shape from `daily-rest`: it is keyed on the distance
 * between two *starts*, not on the gap between an end and the next start. No
 * rest-based rule can express it, which is why it gets its own constraint
 * rather than a parameter on another.
 */

import type { RuleVerdict, SchedulingConstraint } from '../types';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor } from './support';

export const START_INTERVAL_CITATION = 'PL Kodeks pracy art. 128 §3 (doba pracownicza)';

export function startInterval(rule: { minMinutes: number }): SchedulingConstraint {
    return fromVerdict({
        id: 'start-interval',
        hardness: 'hard',
        weight: 1,
        citation: START_INTERVAL_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('start-interval', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            const ownId = entryIdOf(pair);

            let closest = Infinity;
            for (const entry of timeline.all()) {
                if (entry.id === ownId) continue;
                const distance = Math.abs(entry.start - range.start);
                if (distance < closest) closest = distance;
            }

            if (closest < rule.minMinutes) {
                return fail(
                    'start-interval',
                    'hard',
                    `employee "${pair.employeeId}" would start "${inst.id}" only ${h(closest)} after another shift's start, inside the ${h(rule.minMinutes)} working day`,
                    { actual: closest, required: rule.minMinutes, unit: 'minutes', citation: START_INTERVAL_CITATION },
                );
            }

            return pass('start-interval', `starts are at least ${h(rule.minMinutes)} apart`, {
                actual: closest === Infinity ? undefined : closest,
                required: rule.minMinutes,
                unit: 'minutes',
                citation: START_INTERVAL_CITATION,
            });
        },
    });
}
