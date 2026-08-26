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

A single policy is one offer window. Repeating work is a *recurring
assignment* (`addRecurringAssignment`): a standing template whose sweep
materializes each occurrence as an ordinary scheduled assignment carrying
one of these policies — see `RecurrencePolicy`.

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

[src/types/matcher.ts:263](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L263)

___

### notBefore

• `Optional` **notBefore**: `number`

Epoch milliseconds before which the assignment is held out of the
queue entirely — no matching, no workflow targeting, no wait clock.
The scheduled sweep enqueues it once the time arrives.

#### Defined in

[src/types/matcher.ts:254](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L254)

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

[src/types/matcher.ts:271](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L271)
