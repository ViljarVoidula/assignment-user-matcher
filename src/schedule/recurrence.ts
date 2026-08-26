/**
 * Recurrence policy — pure logic.
 *
 * A recurring assignment is a standing template; the sweep in
 * `AssignmentMatcher.processRecurringAssignments()` owns the Redis writes,
 * this module owns the decisions: which slots are due, what the next clock
 * state is, and when a template retires.
 *
 * Slots are aligned to `startAt + k × everyMs` and never drift: the sweep
 * cadence decides *when* a slot is noticed, never *where* it sits. The sweep
 * materializes one interval ahead (`horizon = now + everyMs`), so the next
 * occurrence exists as a scheduled assignment before its window opens.
 */

import type { Assignment, RecurrencePolicy, RecurringAssignment, SchedulePolicy } from '../types/matcher';

/** A policy with every optional field resolved. */
export interface NormalizedRecurrencePolicy {
    everyMs: number;
    startAt?: number;
    windowMs?: number;
    onMiss: 'park' | 'drop';
    until?: number;
    maxOccurrences?: number;
    catchUp: 'skip' | 'all';
}

/** The template's clock, as stored alongside it. */
export interface RecurrenceState {
    /** Epoch ms the next occurrence's window opens */
    nextAt: number;
    /** Occurrences materialized so far */
    occurrences: number;
}

/** Sub-second intervals are a runaway queue, not a schedule. */
export const MIN_EVERY_MS = 1000;

/**
 * Ceiling on slots one sweep may emit for one template. Only reachable under
 * `catchUp: 'all'` after downtime spanning many intervals — the remainder
 * materializes on subsequent sweeps (the state only advances past what was
 * emitted), so nothing is lost, just paced.
 */
export const MAX_SLOTS_PER_SWEEP = 200;

function positiveInt(value: unknown): number | undefined {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

/**
 * Resolve a recurrence policy, or `null` when it is unusable. Unlike
 * `normalizeSchedulePolicy` (where an absent policy is the common case and
 * null routes to the legacy path), a null here is a caller error —
 * `addRecurringAssignment` refuses it rather than storing a template that
 * can never fire.
 */
export function normalizeRecurrencePolicy(policy: RecurrencePolicy | undefined | null): NormalizedRecurrencePolicy | null {
    if (!policy || typeof policy !== 'object') return null;

    const everyMs = positiveInt(policy.everyMs);
    if (everyMs === undefined || everyMs < MIN_EVERY_MS) return null;

    const startAt = positiveInt(policy.startAt);
    const windowMs = positiveInt(policy.windowMs);
    const until = positiveInt(policy.until);
    const maxOccurrences = positiveInt(policy.maxOccurrences);
    // A bound before the first slot can never admit an occurrence.
    if (until !== undefined && startAt !== undefined && until < startAt) return null;

    return {
        everyMs,
        startAt,
        windowMs,
        onMiss: policy.onMiss === 'drop' ? 'drop' : 'park',
        until,
        maxOccurrences,
        catchUp: policy.catchUp === 'all' ? 'all' : 'skip',
    };
}

/**
 * Deterministic occurrence id: template id + the slot's open time. What makes
 * a crashed sweep's re-materialization an idempotent re-add rather than a
 * duplicate, and what lets a host trace any occurrence back to its template
 * without extra state.
 */
export function occurrenceId(recurringId: string, openAt: number): string {
    return `${recurringId}@${openAt}`;
}

/**
 * Which slots one sweep should materialize, and the clock state afterwards.
 *
 * `retiredReason` is non-null when the template is finished *after* this
 * batch — the final slots are still returned, so a `maxOccurrences: 3`
 * template materializes exactly three and then retires.
 */
export function dueSlots(
    policy: NormalizedRecurrencePolicy,
    state: RecurrenceState,
    now: number,
): { slots: number[]; next: RecurrenceState; retiredReason: 'until' | 'maxOccurrences' | null } {
    const horizon = now + policy.everyMs;
    let nextAt = state.nextAt;
    let slots: number[] = [];

    if (policy.catchUp === 'skip') {
        // A slot is stale once its window closed; a windowless slot implicitly
        // yields to its successor (window = everyMs). The jump is arithmetic
        // so a host dead for a year neither loops nor floods the queue —
        // stale slots simply never existed, and don't count against
        // maxOccurrences.
        const staleBefore = now - (policy.windowMs ?? policy.everyMs);
        if (nextAt <= staleBefore) {
            const behind = Math.floor((staleBefore - nextAt) / policy.everyMs) + 1;
            nextAt += behind * policy.everyMs;
        }
    }

    while (nextAt <= horizon && slots.length < MAX_SLOTS_PER_SWEEP) {
        if (policy.until !== undefined && nextAt > policy.until) break;
        slots.push(nextAt);
        nextAt += policy.everyMs;
    }

    let retiredReason: 'until' | 'maxOccurrences' | null = null;
    if (policy.maxOccurrences !== undefined) {
        const room = policy.maxOccurrences - state.occurrences;
        if (slots.length >= room) {
            slots = slots.slice(0, Math.max(0, room));
            retiredReason = 'maxOccurrences';
        }
    }
    if (retiredReason === null && policy.until !== undefined && nextAt > policy.until) {
        retiredReason = 'until';
    }

    return {
        slots,
        next: { nextAt, occurrences: state.occurrences + slots.length },
        retiredReason,
    };
}

/**
 * Cut one occurrence from the template: everything the template carries,
 * with the generated id and the slot's own offer window. A past slot's
 * `notBefore` falls straight through `addAssignment`'s hold guard into the
 * normal enqueue, notAfter clock intact — which is exactly what a due
 * occurrence should do.
 */
export function materializeOccurrence(
    template: RecurringAssignment,
    policy: NormalizedRecurrencePolicy,
    openAt: number,
): Assignment {
    const schedule: SchedulePolicy = {
        notBefore: openAt,
        ...(policy.windowMs !== undefined ? { notAfter: openAt + policy.windowMs, onMiss: policy.onMiss } : {}),
    };
    // Spread + delete rather than rest-destructuring: a rest pattern over
    // Assignment's index signature erases the named keys from the rest type.
    const occurrence: Assignment = { ...template, id: occurrenceId(template.id, openAt), schedule };
    delete occurrence.recurrence;
    return occurrence;
}

/**
 * When the sweep should next act on this template: one interval before the
 * next occurrence opens, so it is already sitting in the scheduled store
 * (visible to hosts) when its window arrives.
 */
export function sweepDueAt(state: RecurrenceState, policy: NormalizedRecurrencePolicy): number {
    return state.nextAt - policy.everyMs;
}
