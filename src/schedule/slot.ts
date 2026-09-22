/**
 * Timeslot policy — pure logic.
 *
 * A `SchedulePolicy` says when an assignment may be *offered*; a `TimeSlot`
 * says when the work is *performed* and for how long. They are different
 * clocks and deliberately different objects: escalation owns the response
 * clock, SLA the completion clock, schedule the offer window, and the slot
 * the appointment itself. Folding a fourth meaning into `schedule` is how one
 * field's two readings start disagreeing.
 *
 * Everything here is side-effect free: `AssignmentMatcher` owns the Redis
 * writes and `src/lua/book-slot.lua` owns the atomic reservation, this module
 * owns the arithmetic and the definition of a clash.
 */

import type { Assignment, TimeSlot } from '../types/matcher';

/** How far ahead of the slot the booking sweep reserves a worker by default. */
export const DEFAULT_BOOK_AHEAD_MS = 7 * 24 * 60 * 60 * 1000;

/** A slot with every optional field resolved. */
export interface NormalizedSlot {
    startAt: number;
    durationMs: number;
    bookAheadMs: number;
    onUnbooked: 'queue' | 'park' | 'drop';
}

/** A half-open interval `[startAt, endAt)`. */
export interface SlotSpan {
    startAt: number;
    endAt: number;
}

function positive(value: unknown): number | undefined {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

/**
 * Resolve an assignment's timeslot, or `null` when it has none or the one it
 * has is unusable. A zero-length appointment is not an appointment and a
 * negative one is a data error; both return `null` so the assignment stays on
 * the untouched legacy path rather than being half-booked.
 */
export function normalizeSlot(slot: TimeSlot | undefined | null): NormalizedSlot | null {
    if (!slot || typeof slot !== 'object') return null;

    const startAt = positive(slot.startAt);
    const durationMs = positive(slot.durationMs);
    if (startAt === undefined || durationMs === undefined) return null;

    return {
        startAt,
        durationMs,
        bookAheadMs: positive(slot.bookAheadMs) ?? DEFAULT_BOOK_AHEAD_MS,
        onUnbooked: slot.onUnbooked === 'park' || slot.onUnbooked === 'drop' ? slot.onUnbooked : 'queue',
    };
}

/** When the appointment finishes. Exclusive: the slot is `[startAt, endAt)`. */
export function slotEndsAt(slot: NormalizedSlot): number {
    return slot.startAt + slot.durationMs;
}

/**
 * Whether two appointments collide.
 *
 * The intervals are half-open, so a job ending at 15:00 and the next starting
 * at 15:00 do not clash — that is an ordinary working day, and refusing it
 * would make every back-to-back schedule unbookable.
 */
export function slotsOverlap(a: SlotSpan, b: SlotSpan): boolean {
    return a.startAt < b.endAt && b.startAt < a.endAt;
}

/**
 * The earliest the booking sweep may reserve somebody. Clamped at 0 so a slot
 * close to the epoch (only ever seen in tests) still produces a sane index
 * score rather than a negative one.
 */
export function bookingOpensAt(slot: NormalizedSlot): number {
    return Math.max(0, slot.startAt - slot.bookAheadMs);
}

/**
 * Same question, answered from the stored JSON without paying for a parse.
 * Assignments without a slot — effectively all of them in a typical
 * deployment — cost one `indexOf` and nothing else, mirroring
 * `scheduleFromJson`.
 */
export function slotFromJson(json: string | null | undefined): NormalizedSlot | null {
    if (!json || json.indexOf('"slot"') === -1) return null;
    try {
        return normalizeSlot((JSON.parse(json) as Assignment).slot);
    } catch {
        return null;
    }
}
