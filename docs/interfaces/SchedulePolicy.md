[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SchedulePolicy

# Interface: SchedulePolicy

When an assignment may be offered at all.

EscalationPolicy owns the response clock, SlaPolicy owns the post-accept
contract; SchedulePolicy owns the offer window: when the work becomes
visible to matching (`notBefore`) and how long an offer may go un-accepted
(`notAfter`). Acceptance ends the schedule's authority — completion
pressure is `sla.completeWithinMs`'s job.

A held assignment lives in a dedicated scheduled store, invisible to every
matching path (including workflow targeting) until the scheduled sweep
activates it. The wait clock and the SLA freshness TTL both anchor at
activation, not creation. Timers fire with sweep granularity (see
`startMaintenance()` / `runMaintenanceOnce()` / `processScheduledAssignments()`).

Recurrence is deliberately out of scope: hosts materialize each occurrence
as its own assignment (re-adding an existing id is a no-op on the clocks,
so materialization is idempotent).

**`Example`**

```typescript
await matcher.addAssignment({
    id: 'callback-42',
    tags: ['callbacks'],
    schedule: {
        notBefore: Date.parse('2026-08-07T09:00:00Z'), // hidden until 9:00
        notAfter: Date.parse('2026-08-07T11:00:00Z'),  // parked if nobody accepted by 11:00
    },
});
matcher.startMaintenance(); // schedule clocks are swept by the maintenance tick
```

## Table of contents

### Properties

- [notAfter](SchedulePolicy.md#notafter)
- [notBefore](SchedulePolicy.md#notbefore)
- [onMiss](SchedulePolicy.md#onmiss)

## Properties

### notAfter

• `Optional` **notAfter**: `number`

Epoch milliseconds after which a still un-accepted assignment
(scheduled, queued, or pending) is taken out of rotation by the
scheduled sweep, applying `onMiss`. Acceptance kills this clock.
Valid without `notBefore` (a pure absolute offer deadline). When both
are present, `notAfter` must be greater than `notBefore` or the whole
policy is ignored.

#### Defined in

[src/types/matcher.ts:258](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L258)

___

### notBefore

• `Optional` **notBefore**: `number`

Epoch milliseconds before which the assignment is held out of the
queue entirely — no matching, no workflow targeting, no wait clock.
The scheduled sweep enqueues it once the time arrives.

#### Defined in

[src/types/matcher.ts:249](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L249)

___

### onMiss

• `Optional` **onMiss**: ``"park"`` \| ``"drop"``

What happens when `notAfter` elapses un-accepted.
- `'park'` — move to the parked store for operator inspection;
  retrievable via `getParkedAssignments()` / `unparkAssignment()`.
- `'drop'` — remove the assignment entirely.

**`Default`**

```ts
'park'
```

#### Defined in

[src/types/matcher.ts:266](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L266)
