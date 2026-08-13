/**
 * Greedy construction — pure logic.
 *
 * Fills most-constrained shift instances first (fewest eligible employees),
 * picking the best employee by objective delta with seeded tie-breaking. A
 * pair is only ever assigned when every hard constraint's `delta` is 0, so a
 * constructed state is always hard-compliant; shortfalls surface as unfilled
 * slots, not breaches.
 */

import type { ModelContext } from '../types';
import type { PropagationResult } from './propagation';
import { assign, type InternalState } from './state';

/** Whether assigning the pair keeps every hard constraint satisfied. */
export function hardCompliant(ctx: ModelContext, state: InternalState, employeeId: string, instanceId: string): boolean {
    for (const c of ctx.constraints) {
        if (c.hardness === 'hard' && c.delta(state, { employeeId, shiftInstanceId: instanceId }) > 0) return false;
    }
    return true;
}

interface RankedCandidate {
    employeeId: string;
    rank: number;
    reasons: string[];
}

function rankCandidate(
    ctx: ModelContext,
    state: InternalState,
    instanceId: string,
    employeeId: string,
    objective: 'standard' | 'balanced',
    rand: () => number,
): RankedCandidate {
    const reasons: string[] = [];
    let rank = 0;

    // Prefer candidates that close an unmet tag requirement.
    const inst = ctx.instanceById.get(instanceId);
    if (inst) {
        const assigned = state.assignments.get(instanceId);
        for (const [tag, needed] of Object.entries(inst.tagRequirements)) {
            let have = 0;
            if (assigned) for (const e of assigned) if (ctx.employeeTags.get(e)?.has(tag)) have++;
            if (have < needed && ctx.employeeTags.get(employeeId)?.has(tag)) {
                rank -= 1_000;
                reasons.push(`fills tag requirement "${tag}"`);
            }
        }
    }

    if (objective === 'balanced') {
        // Less-loaded employees first so hours equalize.
        rank += (state.minutesByEmployee.get(employeeId) ?? 0) / 60;
        reasons.push('selected to balance hours');
    } else {
        reasons.push('eligible under all constraints');
    }

    // Seeded jitter for deterministic tie-breaking.
    rank += rand();
    return { employeeId, rank, reasons };
}

/** Instances ordered most-constrained-first: fewest eligible employees, then earliest start. */
export function constructionOrder(ctx: ModelContext, propagation: PropagationResult): string[] {
    return ctx.instances
        .map((i) => i.id)
        .sort((a, b) => {
            const ea = propagation.eligibleByInstance.get(a)?.length ?? 0;
            const eb = propagation.eligibleByInstance.get(b)?.length ?? 0;
            if (ea !== eb) return ea - eb;
            return ctx.instanceById.get(a)!.startMinute - ctx.instanceById.get(b)!.startMinute;
        });
}

/**
 * Greedily staff `instanceIds` (default: everything, most-constrained first).
 * Shared by initial construction and LNS repair.
 */
export function greedyFill(
    ctx: ModelContext,
    state: InternalState,
    propagation: PropagationResult,
    objective: 'standard' | 'balanced',
    rand: () => number,
    instanceIds?: string[],
): void {
    const order = instanceIds ?? constructionOrder(ctx, propagation);
    for (const instanceId of order) {
        const inst = ctx.instanceById.get(instanceId);
        if (!inst) continue;
        let need = inst.minEmployees - (state.assignments.get(instanceId)?.size ?? 0);
        if (need <= 0) continue;

        const candidates: RankedCandidate[] = [];
        for (const employeeId of propagation.eligibleByInstance.get(instanceId) ?? []) {
            if (state.isAssigned(employeeId, instanceId)) continue;
            if (!hardCompliant(ctx, state, employeeId, instanceId)) continue;
            candidates.push(rankCandidate(ctx, state, instanceId, employeeId, objective, rand));
        }
        candidates.sort((a, b) => a.rank - b.rank || (a.employeeId < b.employeeId ? -1 : 1));

        for (const c of candidates) {
            if (need <= 0) break;
            assign(state, c.employeeId, instanceId, c.reasons);
            need--;
        }
    }
}
