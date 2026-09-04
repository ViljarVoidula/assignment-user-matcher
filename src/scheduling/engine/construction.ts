/**
 * Greedy construction — pure logic.
 *
 * Fills most-constrained shift instances first (fewest eligible employees),
 * picking the best employee by objective delta with seeded tie-breaking. A
 * pair is only ever assigned when every hard constraint's `delta` is 0, so a
 * constructed state is always hard-compliant; shortfalls surface as unfilled
 * slots, not breaches.
 *
 * Cover is the floor, not the ceiling. Once every slot has its `minEmployees`
 * a second pass tops people up towards the hours they are owed — the
 * contracted period total, or a `minHoursForPeriod` floor — by adding them to
 * shifts that still have room. Without it a full-timer only ever receives a
 * share of minimum cover: with more contracted hours on the payroll than the
 * demand needs, everyone lands short and the contract-hours objective has no
 * move that could close the gap, because nothing ever staffs past the minimum.
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
 * Minutes an employee is still owed against their target, or 0 when nothing
 * pulls them upward. A contracted total is symmetric — the objective penalises
 * surplus as much as shortfall — so only a shift that leaves the person
 * *closer* to it counts as progress; a bare `minHoursForPeriod` is a floor.
 */
function hoursOwed(ctx: ModelContext, state: InternalState, employeeId: string): number {
    const planned = state.minutesByEmployee.get(employeeId) ?? 0;
    const contracted = ctx.contractHoursWeight > 0 ? ctx.contractedPeriodMinutes.get(employeeId) : undefined;
    if (contracted !== undefined) return Math.max(0, contracted - planned);
    const floor = ctx.employeeById.get(employeeId)?.minHoursForPeriod;
    return floor !== undefined ? Math.max(0, floor * 60 - planned) : 0;
}

/** Whether adding `workingMinutes` leaves the employee closer to their target. */
function closesGap(ctx: ModelContext, state: InternalState, employeeId: string, workingMinutes: number): boolean {
    const planned = state.minutesByEmployee.get(employeeId) ?? 0;
    const contracted = ctx.contractHoursWeight > 0 ? ctx.contractedPeriodMinutes.get(employeeId) : undefined;
    if (contracted !== undefined) return Math.abs(planned + workingMinutes - contracted) < Math.abs(planned - contracted);
    const floor = ctx.employeeById.get(employeeId)?.minHoursForPeriod;
    return floor !== undefined && planned < floor * 60;
}

/**
 * Top people up towards their contracted hours once cover is met.
 *
 * Most-owed person first, so the biggest shortfall gets first pick of the
 * shifts with room. Each pick is the eligible, hard-compliant shift that
 * closes the most of the gap, preferring the least-staffed occurrence so the
 * extra headcount spreads rather than piles onto one day. Repeats until no
 * assignment would bring anyone closer to their target. `maxEmployees` is
 * enforced by the group-composition rule inside `hardCompliant`, and the
 * cheap size check here merely skips the constraint pass for full shifts.
 */
export function fillToContract(
    ctx: ModelContext,
    state: InternalState,
    propagation: PropagationResult,
    rand: () => number,
): void {
    if (!ctx.fillToContract) return;
    const owed = ctx.employees
        .map((e) => ({ employeeId: e.id, owed: hoursOwed(ctx, state, e.id) }))
        .filter((e) => e.owed > 0);
    if (owed.length === 0) return;

    const exhausted = new Set<string>();
    for (;;) {
        owed.sort((a, b) => b.owed - a.owed || (a.employeeId < b.employeeId ? -1 : 1));
        let progressed = false;
        for (const entry of owed) {
            if (entry.owed <= 0 || exhausted.has(entry.employeeId)) continue;
            let best: { instanceId: string; rank: number } | undefined;
            for (const instanceId of propagation.eligibility.get(entry.employeeId) ?? []) {
                const inst = ctx.instanceById.get(instanceId);
                if (!inst || inst.workingMinutes <= 0 || state.isAssigned(entry.employeeId, instanceId)) continue;
                const staffed = state.assignments.get(instanceId)?.size ?? 0;
                if (inst.maxEmployees !== undefined && staffed >= inst.maxEmployees) continue;
                if (!closesGap(ctx, state, entry.employeeId, inst.workingMinutes)) continue;
                // Largest gap closed first, then the least-staffed occurrence,
                // then earliest start; seeded jitter breaks exact ties.
                const gain = Math.min(inst.workingMinutes, entry.owed);
                const rank = -gain * 1_000 + staffed * 10 + inst.startMinute / MINUTES_PER_PERIOD_SCALE + rand();
                if (!best || rank < best.rank) {
                    if (hardCompliant(ctx, state, entry.employeeId, instanceId)) best = { instanceId, rank };
                }
            }
            if (!best) {
                exhausted.add(entry.employeeId);
                continue;
            }
            assign(state, entry.employeeId, best.instanceId, ['added to reach contracted hours']);
            entry.owed = hoursOwed(ctx, state, entry.employeeId);
            progressed = true;
        }
        if (!progressed) return;
    }
}

/** Scales a period minute into a sub-unit tie-break term below the staffing step. */
const MINUTES_PER_PERIOD_SCALE = 1_000_000;

/**
 * Greedily staff `instanceIds` (default: everything, most-constrained first).
 * Shared by initial construction and LNS repair. The full pass (no
 * `instanceIds`) also tops people up to their contracted hours afterwards.
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
            // Re-vet against the state as this slot fills: the vet above ran
            // before any of this batch was assigned, so a constraint that
            // depends on the instance's other assignees (tagMaximums, a
            // night-worker cap) could be satisfied for each candidate alone
            // yet breached by the pair of them.
            if (!hardCompliant(ctx, state, c.employeeId, instanceId)) continue;
            assign(state, c.employeeId, instanceId, c.reasons);
            need--;
        }
    }
    if (!instanceIds) fillToContract(ctx, state, propagation, rand);
}
