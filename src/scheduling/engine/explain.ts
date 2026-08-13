/**
 * Explain — per-assignment reason strings from constraint evaluations.
 *
 * Reasons combine what construction/repair recorded at selection time with a
 * compliance confirmation per constraint (`explain` returning null means the
 * pair satisfies the rule). Fits the repo's decision-trace philosophy: every
 * rostered pair can say why it exists.
 */

import type { SearchState } from '../types';
import { pairKey, type InternalState } from './state';

/** Reason strings for one assigned pair; empty only for a state built outside the engine. */
export function reasonsFor(state: InternalState, employeeId: string, instanceId: string): string[] {
    const recorded = state.reasons.get(pairKey(employeeId, instanceId)) ?? [];
    const out = [...recorded];
    for (const c of state.ctx.constraints) {
        if (c.explain(state as SearchState, { employeeId, shiftInstanceId: instanceId }) === null) {
            out.push(`satisfies ${c.id}`);
        }
    }
    return out;
}
