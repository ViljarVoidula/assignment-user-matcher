[assignment-user-matcher](../README.md) / [Exports](../modules.md) / TimeSlot

# Interface: TimeSlot

When the work is performed, and for how long.

`SchedulePolicy` owns the *offer* window — when an assignment may be handed
out. A `TimeSlot` owns the *appointment* — a fixed wall-clock start and a
duration, the thing a calendar entry is made of. A task can have either,
both, or neither.

A slotted assignment is held out of matching until its slot arrives, exactly
like `schedule.notBefore` (activation is the later of the two). Ahead of
that, the booking sweep reserves a worker for it: the reservation is visible
on their calendar and blocks anything else landing on the same hour, but it
occupies no backlog slot and starts no SLA clock. That is what keeps
`accepted` meaning "I am working on this" — a week of booked appointments
must not fill somebody's backlog cap, and a completion deadline must not run
for six days against work that has not started.

At `startAt` the assignment activates and is handed to whoever holds the
booking as an ordinary pending offer.

**`Example`**

```typescript
await matcher.addAssignment({
    id: 'boiler-service-42',
    tags: ['gas-safe', 'region:north'],
    slot: {
        startAt: Date.parse('2026-10-08T14:00:00Z'),
        durationMs: 90 * 60_000,
        bookAheadMs: 14 * 24 * 60 * 60_000, // reserve an engineer a fortnight out
    },
});
matcher.startMaintenance(); // the booking sweep runs on the maintenance tick
```

## Table of contents

### Properties

- [bookAheadMs](TimeSlot.md#bookaheadms)
- [durationMs](TimeSlot.md#durationms)
- [onUnbooked](TimeSlot.md#onunbooked)
- [startAt](TimeSlot.md#startat)

## Properties

### bookAheadMs

• `Optional` **bookAheadMs**: `number`

How far ahead of `startAt` the booking sweep may reserve a worker.
Defaults to seven days. Booking earlier gives people more notice and
gives the planner more time to review; booking later sees a more
accurate picture of who is actually available.

#### Defined in

[src/types/matcher.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L119)

___

### durationMs

• **durationMs**: `number`

How long the work takes, in milliseconds. Must be greater than zero —
a zero-length appointment is not an appointment, and the whole slot is
ignored rather than half-applied.

#### Defined in

[src/types/matcher.ts:112](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L112)

___

### onUnbooked

• `Optional` **onUnbooked**: ``"queue"`` \| ``"park"`` \| ``"drop"``

What happens if `startAt` arrives with nobody booked.
- `'queue'` (default) — activate into the open pool, matched like any
  other task. The appointment still exists; it is simply being staffed
  late.
- `'park'` — hold it out of rotation for an operator to look at.
- `'drop'` — remove it.

#### Defined in

[src/types/matcher.ts:128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L128)

___

### startAt

• **startAt**: `number`

Epoch milliseconds at which the work is performed.

#### Defined in

[src/types/matcher.ts:106](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L106)
