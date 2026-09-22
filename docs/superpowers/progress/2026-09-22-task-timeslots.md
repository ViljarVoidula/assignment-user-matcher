# Task timeslots and advance booking — progress

Spec: [`../specs/2026-09-22-task-timeslots-design.md`](../specs/2026-09-22-task-timeslots-design.md).
Approach C (library owns the shape, platform owns the facts), approved 2026-09-22.

## Sub-project 1 — engine (`assignment-engine`) — DONE, verified

| Piece | Where | Verified by |
|---|---|---|
| `TimeSlot`, `SlotAvailability`, `SlotBooking`, `SlotCandidate`, refusals, events | `src/types/matcher.ts` | `tsc`, exported from `src/index.ts` |
| Pure slot policy (normalize, half-open overlap, book-ahead, JSON fast path) | `src/schedule/slot.ts` | `tests/slot_policy.test.ts` — 15 tests |
| Atomic reservation gate (clash probe + write in one script) | `src/lua/book-slot.lua` | overlap / back-to-back / already-booked / NOSCRIPT-reload tests |
| Keys: `slotBookings`, `bookingSpans`, `userBookings(user)`, `slotBookingDueAt` | `src/utils/keys.ts` | — |
| Hold on `slot.startAt` (later of it and `notBefore`), booking index | `addAssignment` | held / indexed / clamped-to-now / too-long-refused tests |
| `bookSlot`, `releaseSlotBooking`, `handBackBooking`, `getSlotBooking`, `getBookings`, `rankSlotCandidates`, `processSlotBookings` | `src/matcher.class.ts` | `tests/matcher_slots.test.ts` — 43 tests |
| Activation to the booked holder as **pending**; `onUnbooked` queue/park/drop | `processScheduledAssignments` | activation tests |
| Booking cleared on complete / fail / remove | `clearBookingOnTerminal`, `removeAssignment` | terminal tests |
| Maintenance wiring (`slotBookings` option, `slotsBooked`/`slotsUnfillable` in the report) | `runMaintenanceOnce` | "books and then activates in one pass" |
| README section "Timeslots and advance booking" | `README.md` | — |

**Suite:** 1785 passing, branches 90.17% (gate 90%), `pnpm build` copies `book-slot.lua` into `dist/lua/`.

**Bug found while building:** the enqueue's hand-off out of the scheduled store was gated on a
`schedule` policy existing. A slot-only task (no `schedule`) was therefore queued *and* still
sitting in the scheduled store after activation. Now unconditional — a no-op for tasks never held.

**Deliberate choices worth remembering**
- Backlog and pause are ignored when ranking for a slot: a reservation takes no backlog place, and
  being swamped this morning says nothing about next Thursday.
- The booking row survives activation and is cleared only on hand-back or a terminal transition, so
  the overlap rule protects in-flight appointments too.
- `force` on `bookSlot` skips the host's `blocked` intervals, never the overlap rule.
- `slotAvailability` throwing makes the sweep restore its index entry and rethrow — booking nobody
  is the safe reading of "the leave service is down".

## Sub-project 2 — platform API + console planner — NOT STARTED

## Sub-project 3 — worker calendar (portal view → ICS feed → Google write) — NOT STARTED
