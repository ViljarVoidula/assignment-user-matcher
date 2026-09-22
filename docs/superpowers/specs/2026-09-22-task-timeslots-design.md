# Task Timeslots and Advance Booking — Design

**Status:** approved 2026-09-22.

## The problem

A task today can say *when it may be offered* (`schedule.notBefore` / `notAfter`) but
not *when the work happens*. There is no duration anywhere on an assignment, so
nothing can be drawn on a calendar, and nothing stops two appointments landing on
one person at 14:00.

Two user stories:

- **Planner** — match assignments to people ahead of time, so workers can plan
  their week.
- **Worker** — see scheduled tasks in my calendar.

## Decisions

| Question | Decision |
|---|---|
| What a timeslot is | A **fixed appointment**: `startAt` + `durationMs`. Not a size estimate. |
| What a pre-assignment means | **Booked.** The planner's (or the sweep's) decision stands; the worker may hand it back with a reason. |
| When booked work goes live | **At the slot.** Until then it is a reservation: no backlog slot, no SLA clock, no queue presence. |
| Guardrails | **Overlaps and time off refuse. Roster and personal-calendar conflicts warn** and are recorded on the booking. |
| Who picks | **The sweep books automatically**, ahead of the slot; the planner reviews and can rebook. |
| Where the logic lives | **Split (approach C).** The library owns the slot, the reservation, the non-overlap rule and the booking sweep. The platform owns the *facts* — time off, roster, calendar busy — supplied as typed input, batch-loaded once per pass. |
| Worker surfaces | Portal calendar view, then a per-worker ICS feed, then writes into a connected Google Calendar. |

### Why approach C

The library already owns the scheduled store, its sweep and every claim gate, but
it has no idea what a roster or a leave request is. The platform has those facts
but would become a second scheduling brain beside the existing sweep — and
`CLAUDE.md`'s own warning applies: *the one that drifts is always the one nobody
is reading.* Splitting on *shape vs facts* is the pattern this repo already
insists on ("the library ships rule shapes, never a jurisdiction's values";
"no DSL, prefer typed input").

## Decomposition

Three sub-projects. Each is independently testable; 2 and 3 are meaningless
without 1.

1. **Slots and reservations in the engine** (`assignment-engine`) — the slot, the
   booking store, the atomic non-overlap gate, the booking sweep, activation to
   the booked holder, hand-back.
2. **Planner surface** (`platform` API + console) — slot fields on the task API,
   a week view of booked and unbooked slots, clash badges, rebook.
3. **Worker calendar** (`platform`) — portal view, ICS feed, Google Calendar write.

---

# Sub-project 1 — the engine

## The fourth clock

```ts
export interface TimeSlot {
    /** Epoch ms the work is performed. */
    startAt: number;
    /** How long it takes, ms. Must be > 0. */
    durationMs: number;
    /** How far ahead of startAt the sweep may book. Default 7 days. */
    bookAheadMs?: number;
    /** What happens if startAt arrives unbooked. Default 'queue'. */
    onUnbooked?: 'queue' | 'park' | 'drop';
}
```

`Assignment.slot` is deliberately **its own object, not a field on `schedule`**.
Escalation owns the response clock, SLA the completion clock, schedule the offer
window; the slot is when the work is *performed*. Folding a fourth meaning into
`schedule` is how one field's two readings start disagreeing.

Pure logic lives in `src/schedule/slot.ts` — `normalizeSlot`, `slotEndsAt`,
`slotsOverlap` (half-open `[start, end)`), `bookingOpensAt`, `slotFromJson`
(the `indexOf('"slot"')` fast path, mirroring `scheduleFromJson`). A malformed
slot — non-finite, non-positive duration — normalizes to `null` and the
assignment behaves exactly as it does today.

## Three moments, not one

```
bookingOpensAt = startAt − bookAheadMs      the sweep may reserve a worker
        ↓
   reservation                              calendar-visible; no backlog slot, no clocks
        ↓
     startAt                                activation: live work, pending on the booked holder
```

A slotted assignment lives in the **existing scheduled store** from creation —
already invisible to every matching path, which is exactly right for work that is
not due. Activation time is `max(schedule.notBefore ?? 0, slot.startAt)`: a slot
implies a hold, and an explicit offer window can only push it later.

Between booking and activation the task counts against nothing. This is what keeps
`accepted` meaning *"I am working on this"* — a week of booked appointments must
not fill the backlog cap, and an SLA completion clock must not run for six days
against work that has not started.

## Storage

Three new keys, on the pattern of the existing indexes:

- `slotBookings()` — hash `assignmentId -> userId`. The single index answering
  "who is booked for this". Its `HSETNX` is the claim gate.
- `bookingSpans()` — hash `assignmentId -> "<startAt>:<endAt>"`. Needed to resolve
  a candidate's end during an overlap probe.
- `userBookings(userId)` — zset of assignment ids scored by `startAt`. Backs both
  the overlap probe and the worker's calendar read.
- `slotBookingDueAt()` — zset `assignmentId -> bookingOpensAt`. The booking
  sweep's index, one-shot `zRem`-claimed like `scheduledActivateAt`.

**Booking survives activation.** The booking row is cleared on terminal
transitions and on hand-back, not when the work goes live: "this person's
14:00–15:30 is spoken for" stays true while they are doing it, and keeping it
means the overlap rule also protects in-flight work. Every terminal path must
clear it — the same rule the wait clock and the SLA indexes already carry.

## The non-overlap gate is atomic or it is nothing

Checking for a clash and then writing the booking is not safe: two sweeps booking
two different tasks into one worker's 14:00 both pass the check. The gate is a Lua
script, `src/lua/book-slot.lua`, on the pattern of `workflow-transition.lua`:

1. `HEXISTS slotBookings id` → already booked, return the holder.
2. `ZRANGEBYSCORE userBookings (startAt − maxSlotSpanMs) (endAt` — every booking
   that could start before this one ends. The lookback bound is what keeps the
   probe `O(bookings in a bounded window)` instead of a full scan.
3. For each candidate, read its end from `bookingSpans`; `end > startAt` is a
   clash — return the clashing id.
4. Otherwise write all three keys and return success.

One script, one round trip, no second claim path.

## The booking sweep

`processSlotBookings()`, a new maintenance tick running **before**
`processScheduledAssignments()` so a task booked this pass activates in the same
pass when its slot has already arrived.

```
due = zRangeByScore(slotBookingDueAt, '-inf', now)
for each id:
    zRem claim (one-shot; a concurrent replica skips it)
    load from the scheduled store; gone → drop the entry
    already booked → done
    rank eligible candidates, drop anyone blocked in the slot
    none → re-index at now + retryMs, emit slotUnfillable
    else → book the best, emit slotBooked
```

Candidates are ranked by the **existing** `evaluateCandidateForAssignment` —
the same evaluator `explainMatch` uses, so routing weights, wildcards, zero-weight
vetoes, skill thresholds, CIDR and geo all apply. A second, smaller copy of the
judgement is how a booking and an explain start disagreeing.

The sweep never consumes the learning layer's output and commits no learning
decision, for the same reason `assignToUser` does not: nobody chose this offer.

## Availability is typed input, not a lookup

```ts
slotAvailability?: (
    userIds: string[],
    from: number,
    to: number,
) => Promise<SlotAvailability[]>;

interface SlotAvailability {
    userId: string;
    /** Refuses a booking overlapping it — approved time off. */
    blocked?: { from: number; to: number; reason: string }[];
    /** Allows the booking and records the reason on it — outside a rostered
     *  shift, personal calendar busy. */
    warnings?: { from: number; to: number; reason: string }[];
}
```

Called **once per sweep pass** for the whole candidate set and the whole horizon —
never per candidate, the same rule the learning performance features carry. The
library ships the shape; the platform supplies leave, roster and free/busy.

`blocked` refuses because it is a fact the system owns and booking over it is
simply wrong. `warnings` allow because a roster is a plan and a worker's private
calendar is not ours to veto on — and because a genuine emergency booking needs
an escape hatch. Warnings are stored on the booking so the planner sees why.

## Activation

In `processScheduledAssignments`'s due loop, before the enqueue: read
`slotBookings`. Booked → enqueue, then hand to the holder through the existing
`assignToUser(..., { force: true })` path, so it lands as **pending**, not
accepted. `force` is right here: the booking already passed every guardrail days
ago, and refusing at activation on a backlog count would strand an appointment a
customer is expecting.

Unbooked at `startAt` → `onUnbooked`: `'queue'` (default) falls into the open pool
exactly as today, `'park'` and `'drop'` mirror `schedule.onMiss`.

## Handing back

`handBackBooking(assignmentId, userId, reason)` releases the booking, adds the
worker to the assignment's rejected set so the next sweep cannot hand it straight
back, and emits `slotBookingReleased` with the reason. The task returns to
unbooked and re-enters the sweep's index. The worker cannot *decline* — the
planner's decision stands — but raising a problem is not declining.

## Public surface

- `bookSlot(assignmentId, userId, { force? })` — the planner's manual booking,
  through the same Lua gate. `force` bypasses `blocked`, never the overlap.
- `releaseSlotBooking(assignmentId)` / `handBackBooking(assignmentId, userId, reason)`
- `getBookings({ from, to, userId? })` — the calendar read.
- `rankSlotCandidates(assignmentId)` — engine ranks, planner reviews.
- `processSlotBookings()` — the sweep, also wired into `runMaintenanceOnce`.

## Events

`slotBooked`, `slotBookingReleased`, `slotUnfillable`, added to
`AssignmentLifecycleEvent`.

## Testing

`tests/slot_policy.test.ts` — the pure module: normalization, half-open overlap
(a slot ending at 14:00 and one starting at 14:00 do **not** clash), the
`bookingOpensAt` default, malformed input falling back to no slot.

`tests/matcher_slots.test.ts` — against real Redis, through the public API:

- a slotted task is held out of every matching path before its slot;
- the sweep books it at `bookingOpensAt` and not before;
- a second task overlapping the same worker's slot refuses and books the next
  eligible worker instead;
- back-to-back slots on one worker both book;
- `blocked` refuses, `warnings` book and are recorded;
- activation hands the task to the booked holder as **pending**, and to the open
  pool when unbooked;
- a booked task occupies no backlog slot and starts no SLA clock before its slot;
- hand-back releases the booking and the next sweep books somebody else;
- every terminal path clears the booking row.

## Backward compatibility

`dist/` ships and the package is published, so: `slot` is optional everywhere, a
task without one takes byte-identical stored JSON and the untouched code path
(`indexOf('"slot"')`), the new keys are created lazily, and `processSlotBookings`
on a deployment with no slotted work is one empty range read.
