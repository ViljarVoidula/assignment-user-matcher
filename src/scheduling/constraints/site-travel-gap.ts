/**
 * Cross-site travel gap.
 *
 * When a person works two consecutive assignments at different sites, the gap
 * between them must be at least the travel time between those sites. Only the
 * immediate predecessor and successor on the person timeline are judged; a
 * non-adjacent assignment does not create a direct travel obligation.
 *
 * The rule only enforces the gap; it does **not** count travel time as working
 * time (CJEU C-266/14 would require that, but it is out of scope here — the
 * caller models working time through `duty` and break rules).
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
            const candidateRange = rangeOf(inst);
            const ownId = entryIdOf(pair);
            const siteId = inst.siteId;

            let predecessor: TimelineEntry | undefined;
            let successor: TimelineEntry | undefined;

            for (const entry of timeline.all()) {
                if (entry.id === ownId) continue;
                if (!entry.siteId || entry.siteId === siteId) continue;

                if (entry.end <= candidateRange.start) {
                    if (!predecessor || entry.end > predecessor.end) {
                        predecessor = entry;
                    }
                }
                if (entry.start >= candidateRange.end) {
                    if (!successor || entry.start < successor.start) {
                        successor = entry;
                    }
                }
            }

            let worstActual = Infinity;
            let worstRequired = 0;
            let worstMessage = '';

            if (predecessor) {
                const needed = travelMinutesBetween(state.ctx.siteIndex, predecessor.siteId, siteId);
                if (needed !== undefined) {
                    const gap = candidateRange.start - predecessor.end;
                    if (gap < needed) {
                        worstActual = gap;
                        worstRequired = needed;
                        worstMessage = `only ${h(gap)} gap after a shift at "${predecessor.siteId}", need ${h(
                            needed,
                        )} to reach "${siteId}"`;
                    }
                }
            }

            if (successor) {
                const needed = travelMinutesBetween(state.ctx.siteIndex, siteId, successor.siteId);
                if (needed !== undefined) {
                    const gap = successor.start - candidateRange.end;
                    if (gap < needed && needed - gap > worstRequired - worstActual) {
                        worstActual = gap;
                        worstRequired = needed;
                        worstMessage = `only ${h(gap)} gap before a shift at "${successor.siteId}", need ${h(
                            needed,
                        )} to reach it from "${siteId}"`;
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
        },
    });
}
