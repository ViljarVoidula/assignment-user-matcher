/**
 * Search state — the mutable assignment matrix the engine owns and constraints
 * read. Kept deliberately small: three indices plus derived minutes and the
 * per-person timelines, all updated together on every assign/unassign so
 * constraint `delta` calls stay local rather than rebuilding a person's
 * schedule from scratch.
 */

import type { ModelContext, SearchState } from '../types';
import { TimelineIndex } from './timeline';

export interface InternalState extends SearchState {
    /** Per-pair selection reasons recorded by construction/repair, surfaced in the result. */
    reasons: Map<string, string[]>;
}

export function createState(ctx: ModelContext): InternalState {
    const assignments = new Map<string, Set<string>>();
    const byEmployee = new Map<string, Set<string>>();
    const minutesByEmployee = new Map<string, number>();
    for (const inst of ctx.instances) assignments.set(inst.id, new Set());
    for (const emp of ctx.employees) {
        byEmployee.set(emp.id, new Set());
        minutesByEmployee.set(emp.id, 0);
    }
    return {
        ctx,
        assignments,
        byEmployee,
        minutesByEmployee,
        // Seeded from history so rest and rolling windows see across the period
        // boundary from the very first evaluation.
        timelines: new TimelineIndex(ctx.history),
        reasons: new Map(),
        isAssigned(employeeId: string, instanceId: string) {
            return assignments.get(instanceId)?.has(employeeId) ?? false;
        },
    };
}

export function pairKey(employeeId: string, instanceId: string): string {
    return `${employeeId}|${instanceId}`;
}

export function assign(state: InternalState, employeeId: string, instanceId: string, reasons: string[]): void {
    const inst = state.ctx.instanceById.get(instanceId);
    // Unknown ids are a no-op, not a partial write: booking minutes for an
    // employee the model never saw would corrupt the fairness and cost sums.
    if (!inst || !state.ctx.employeeById.has(employeeId)) return;
    state.assignments.get(instanceId)?.add(employeeId);
    state.byEmployee.get(employeeId)?.add(instanceId);
    // `minutesByEmployee` tracks *working* time, which unpaid breaks and duty
    // classification can put below the elapsed span.
    state.minutesByEmployee.set(employeeId, (state.minutesByEmployee.get(employeeId) ?? 0) + inst.workingMinutes);

    const personId = state.ctx.personIdOf.get(employeeId) ?? employeeId;
    state.timelines.add(personId, {
        id: timelineEntryId(employeeId, instanceId),
        start: inst.startMinute,
        end: inst.endMinute,
        workingMinutes: inst.workingMinutes,
        tag: inst.shiftTypeTag,
    });

    state.reasons.set(pairKey(employeeId, instanceId), reasons);
}

export function unassign(state: InternalState, employeeId: string, instanceId: string): void {
    const inst = state.ctx.instanceById.get(instanceId);
    if (!inst || !state.ctx.employeeById.has(employeeId)) return;
    state.assignments.get(instanceId)?.delete(employeeId);
    state.byEmployee.get(employeeId)?.delete(instanceId);
    state.minutesByEmployee.set(employeeId, (state.minutesByEmployee.get(employeeId) ?? 0) - inst.workingMinutes);

    const personId = state.ctx.personIdOf.get(employeeId) ?? employeeId;
    state.timelines.remove(personId, timelineEntryId(employeeId, instanceId));

    state.reasons.delete(pairKey(employeeId, instanceId));
}

/**
 * Timeline entries are keyed by employee *and* instance, not by instance alone:
 * two contracts of the same person share a timeline, so an instance id on its
 * own would not identify which record's entry to remove.
 */
export function timelineEntryId(employeeId: string, instanceId: string): string {
    return `${employeeId}@@${instanceId}`;
}

/** Snapshot as a flat list of assigned pairs (stable order: instance, then employee). */
export function assignedPairs(state: InternalState): Array<{ employeeId: string; instanceId: string }> {
    const out: Array<{ employeeId: string; instanceId: string }> = [];
    for (const inst of state.ctx.instances) {
        const set = state.assignments.get(inst.id);
        if (!set) continue;
        for (const employeeId of [...set].sort()) out.push({ employeeId, instanceId: inst.id });
    }
    return out;
}
