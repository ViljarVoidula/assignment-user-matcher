/**
 * Cross-site travel gap.
 *
 * When a person works two assignments at different sites, the gap between them
 * must be at least the travel time between those sites. The rule only enforces
 * the gap; it does **not** count travel time as working time (CJEU C-266/14
 * would require that, but it is out of scope here — the caller models working
 * time through `duty` and break rules).
 *
 * Because the default `min-rest` rule requires 11h between any two assignments,
 * this rule mainly matters in split-shift setups where the caller has relaxed
 * `minRestMinutes` or configured a `dailyRest` rule with a shorter window.
 */

import type { AssignmentPair, RuleVerdict, SchedulingConstraint, SearchState } from '../types';
import type { TimelineEntry } from '../engine/timeline';
import { travelMinutesBetween } from '../sites';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor } from './support';

export function siteTravelGap(): SchedulingConstraint {
    return fromVerdict({
        id: 'site-travel-gap',
        hardness: 'hard',
        verdict(state: SearchState, pair: AssignmentPair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst?.siteId) return pass('site-travel-gap', 'shift has no site');

            const timeline = timelineFor(state, pair.employeeId);
            const candidate: TimelineEntry = {
                id: entryIdOf(pair),
                ...rangeOf(inst),
                workingMinutes: inst.workingMinutes,
                tag: inst.shiftTypeTag,
                siteId: inst.siteId,
            };

            const siteId = inst.siteId;
            const employeeId = pair.employeeId;
            return timeline.withEntry(candidate, (t) => judge(t, candidate, siteId, employeeId, state));
        },
        magnitude(v) {
            // `actual` holds the gap, `required` the needed travel time;
            // the shortfall drives the local-search gradient.
            if (v.actual === undefined || v.required === undefined) return 1;
            return Math.max(1, v.required - v.actual);
        },
    });
}

function judge(
    timeline: import('../engine/timeline').PersonTimeline,
    candidate: TimelineEntry,
    siteId: string,
    employeeId: string,
    state: SearchState,
): RuleVerdict {
    let worstActual = Infinity;
    let worstRequired = 0;
    let worstMessage = '';

    for (const entry of timeline.all()) {
        if (entry.id === candidate.id) continue;
        if (!entry.siteId || entry.siteId === siteId) continue;

        // Predecessor: the earlier assignment ends before the candidate starts.
        if (entry.end <= candidate.start) {
            const needed = travelMinutesBetween(state.ctx.siteIndex, entry.siteId, siteId);
            if (needed !== undefined) {
                const gap = candidate.start - entry.end;
                if (gap < needed && needed - gap > worstRequired - worstActual) {
                    worstActual = gap;
                    worstRequired = needed;
                    worstMessage = `only ${h(gap)} gap after a shift at "${entry.siteId}", need ${h(
                        needed,
                    )} to reach "${siteId}"`;
                }
            }
        }

        // Successor: the later assignment starts after the candidate ends.
        if (entry.start >= candidate.end) {
            const needed = travelMinutesBetween(state.ctx.siteIndex, siteId, entry.siteId);
            if (needed !== undefined) {
                const gap = entry.start - candidate.end;
                if (gap < needed && needed - gap > worstRequired - worstActual) {
                    worstActual = gap;
                    worstRequired = needed;
                    worstMessage = `only ${h(gap)} gap before a shift at "${entry.siteId}", need ${h(
                        needed,
                    )} to reach it from "${siteId}"`;
                }
            }
        }
    }

    if (worstRequired > worstActual) {
        return fail('site-travel-gap', 'hard', `site travel: ${worstMessage}`, {
            actual: worstActual,
            required: worstRequired,
            unit: 'minutes',
        });
    }

    return pass('site-travel-gap', `travel gap to "${siteId}" is sufficient`);
}
