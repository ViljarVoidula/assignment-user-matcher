/**
 * Min-rest — a configurable minimum rest between the end of one assignment and
 * the start of the next, across day boundaries. Hard by default.
 *
 * The default is 660 minutes (11h): the floor set by Article 3 of Directive
 * 2003/88/EC. Member states may be stricter (ES and RO require 12h) and
 * derogations may go lower (NL/DK/CZ 8h, FR 9h by collective agreement), so the
 * value is always caller-supplied — the library ships the rule, never a
 * jurisdiction's number.
 *
 * Scope note: this is a *general* inter-assignment rest rule, not a night-shift
 * rule. It was called `rest-after-night` while it was a re-derivation of the
 * legacy Python constraint, which compared `d_off > d` but then computed the
 * gap from the *same* shift's start and end (so it never modeled rest between
 * consecutive days) and hardcoded the shift name `"Night"`. Both bugs are gone;
 * the name went with them.
 */

import type { SchedulingConstraint, SearchState, AssignmentPair } from '../types';
import { entryIdOf, instanceOf, rangeOf, timelineFor } from './support';

/** EU floor: Directive 2003/88/EC Article 3 — 11 consecutive hours per 24-hour period. */
export const DEFAULT_MIN_REST_MINUTES = 660;

export function minRest(minRestMinutes: number): SchedulingConstraint {
    const breach = (state: SearchState, pair: AssignmentPair) => {
        const inst = instanceOf(state, pair);
        if (!inst) return false;
        // Person timeline, not the per-contract assignment set: rest aggregates
        // on the person (C-585/19), and history is what makes the rule correct
        // at the period boundary. Overlaps read as a zero gap, which breaches
        // here just as it did under the old pairwise arithmetic.
        const gap = timelineFor(state, pair.employeeId).minGapAround(rangeOf(inst), entryIdOf(pair));
        return gap < minRestMinutes;
    };
    return {
        id: 'min-rest',
        hardness: 'hard',
        delta(state, pair) {
            return breach(state, pair) ? 1 : 0;
        },
        explain(state, pair) {
            return breach(state, pair)
                ? `employee "${pair.employeeId}" would have less than ${(minRestMinutes / 60).toFixed(1)}h rest around "${pair.shiftInstanceId}"`
                : null;
        },
    };
}
