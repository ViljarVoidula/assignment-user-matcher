# Task timeslots and advance booking — progress

Spec: [`../specs/2026-09-22-task-timeslots-design.md`](../specs/2026-09-22-task-timeslots-design.md).
Approach **C** (the library owns the shape, the platform owns the facts), approved 2026-09-22.

Both user stories are working end to end:

- **Planner** — states an appointment on a task, the sweep books the best free worker ahead of
  time, and the console shows who is on what with the clashes named.
- **Worker** — sees booked jobs in the portal beside their shifts, and can raise a problem
  with one rather than silently not turning up.

## Sub-project 1 — the engine (`assignment-engine`) — DONE

Commits `d42a0ab`, `47ba209`.

| Piece | Where | Verified by |
|---|---|---|
| `TimeSlot`, `SlotAvailability`, `SlotBooking`, `SlotCandidate`, refusals, 3 events | `src/types/matcher.ts` | `tsc`, exported from `src/index.ts` |
| Pure slot policy (normalize, half-open overlap, book-ahead, JSON fast path) | `src/schedule/slot.ts` | `tests/slot_policy.test.ts` — 15 tests |
| Atomic reservation gate (clash probe + write in one script) | `src/lua/book-slot.lua` | overlap / back-to-back / already-booked / NOSCRIPT-reload |
| Keys: `slotBookings`, `bookingSpans`, `userBookings(user)`, `slotBookingDueAt` | `src/utils/keys.ts` | — |
| Hold on `slot.startAt` (later of it and `notBefore`), booking index | `addAssignment` | held / indexed / clamped-to-now / too-long-refused |
| `bookSlot`, `releaseSlotBooking`, `handBackBooking`, `getSlotBooking`, `getBookings`, `rankSlotCandidates`, `processSlotBookings` | `src/matcher.class.ts` | `tests/matcher_slots.test.ts` — 44 tests |
| Activation to the booked holder as **pending**; `onUnbooked` queue/park/drop | `processScheduledAssignments` | activation tests |
| Booking cleared on complete / fail / remove | `clearBookingOnTerminal`, `removeAssignment` | terminal tests |
| Maintenance wiring (`slotBookings` option, `slotsBooked`/`slotsUnfillable`) | `runMaintenanceOnce` | "books and then activates in one pass" |
| README § "Timeslots and advance booking" | `README.md` | — |

**Suite:** 1785 passing, branches 90.17% (gate 90%). `pnpm build` copies `book-slot.lua` into `dist/lua/`.

## Sub-project 2 — platform + console planner — DONE

Platform `421c234`; console `6338897`, `b3e37cb`.

| Piece | Where |
|---|---|
| `makeSlotAvailability` / `rosterSlotFacts` — leave blocks, roster gap and personal calendar warn | `packages/shared/src/slot-availability.ts` (11 tests) |
| `wallClockInstant` / `zonedDateTimeParts` lifted out of the portal so both readings agree | `packages/shared/src/wall-clock.ts` |
| `slotAvailability` on the pool, wired in **both** the API and the matching worker | `matcher-pool.ts`, `apps/*/src/index.ts` |
| `slot` on create + preflight, validation, `scheduled` status, bookings in the listing | `apps/api/src/routes/tasks.ts` |
| `GET /tasks/bookings`, `GET /tasks/:id/booking/candidates`, `POST`/`DELETE /tasks/:id/booking` | same (27 tests) |
| Library→platform renames (`assignmentId`→`taskId`, `userId`→`workerId`) | `apps/api/src/mappers.ts` |
| `task.booked` / `task.booking_released` / `task.booking_unfillable`, both locales, filed under `rota` | `packages/shared/src` |
| SDK types + `tasks.bookings()` / `tasks.booking.*` | `packages/sdk` |
| Console: **Appointment** as the third answer in the When row, with its own sentence | `AppointmentFields.tsx`, `appointment.ts` (8 tests) |
| Console: length and "Booked to X" / "Nobody booked yet" on the scheduled agenda | `ScheduledAgenda.tsx` |
| Estonian for all 24 new console strings | `src/locales/et/messages.po` |

Browser-verified on the live dev console: the appointment row renders its four fields and reads
back *"Wed 09:00 for 1.5 hours. Someone is booked up to 7 days ahead and sees it in their
calendar; if nobody is free, it goes to the whole pool."*; the agenda shows
`1.5 hours · gas-safe / Booked to ada` and `1 hour · nobody-has-this / Nobody booked yet`.
The whole booking API was also driven against the dev server (create → candidates → book →
clash 409 → calendar → per-worker filter → release 204 → 404).

## Sub-project 3 — the worker's calendar — PARTLY DONE

| Surface | State |
|---|---|
| **Portal view** | **DONE** — `packages/portal-templates/src/core/MyBookings.tsx`, commit `7019f74`, 8 tests, Estonian done (the portal's i18n gate is hard). `GET /portal/me/bookings` + `POST /portal/me/bookings/:taskId/hand-back`. |
| **ICS feed** | **NOT DONE.** Needs a revocable per-worker secret, which means a column on `worker_identities` and a migration. Deriving the token by HMAC would avoid the migration but leaves no way to revoke one worker's URL, and a feed URL is a bearer capability — so the migration is the right answer, not a shortcut. |
| **Google Calendar write** | **NOT DONE.** Today's Google integration is inbound and read-only (free/busy). Writing needs the wider `calendar.events` scope, per-event state to reconcile on change and cancel, and a re-consent for every already-connected worker. |

A live portal does not pick up a new bundle on its own — **each workspace must republish its
portal** before workers see the Booked jobs section.

## Things worth remembering

**Two real defects, both found by reaching for the seam rather than the unit:**

1. The enqueue's hand-off out of the scheduled store was gated on a `schedule` policy existing.
   A slot-only task (no `schedule` anywhere) ended up queued **and** still sitting in the
   scheduled store. Now unconditional — a no-op for tasks that were never held.
2. The bookings route spread the platform's own `workerId` into a query the engine reads as
   `userId`, so a calendar filtered to one worker silently returned the **whole workspace's**.
   The engine was right and its own test passed, because the window alone happened to separate
   the two people in the fixture. `tests/matcher_slots.test.ts` now books a colleague *inside*
   the same window so the filter has to do the work.

**Deliberate choices:**

- Backlog and pause are ignored when ranking for a slot: a reservation takes no backlog place,
  and being swamped this morning says nothing about next Thursday.
- The booking row survives activation and is cleared only on hand-back or a terminal
  transition, so the overlap rule protects in-flight appointments too.
- `force` skips the host's `blocked` intervals, never the overlap rule.
- `slotAvailability` throwing makes the sweep restore its index entry and rethrow — booking
  nobody is the safe reading of "the leave service is down".
- Approved leave **blocks**; an unrostered hour or a busy personal calendar only **warns**, and
  the reason is recorded on the booking and shown to both planner and worker.

**A gate worth knowing about:** `packages/ui-builder/test/studio-agent-prompt.test.ts` checks the
studio agent's system prompt against the real `portal-templates/src/core` file list and the real
endpoint list in `api.ts`. Adding a portal file or a worker endpoint fails it until the prompt
names them — the point being that whatever the prompt omits, the agent rebuilds by hand, and
nothing else breaks when it goes stale. Commit `aaf6dd1` adds this change's entries and, in the
same two lists, the `TaskThread.tsx` / comment-and-attachment endpoints that had been missing
since the portal thread landed (one assertion per list, so a partial fix keeps it red).

**Environment notes:**

- The platform's copy of the engine is `file:` — a `pnpm build` in `assignment-engine` then
  `pnpm install --offline` in `platform` is required before the new `book-slot.lua` is visible.
- The console's `@fivexer/sdk` is `link:` and serves the built `dist`, so the SDK must be
  rebuilt before the console typechecks against new types.
- `packages/portal-templates/test/queue-actions.test.ts` fails on this tree with the work
  stashed — pre-existing, not from this change.
