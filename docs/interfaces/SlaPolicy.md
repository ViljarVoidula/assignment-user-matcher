[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SlaPolicy

# Interface: SlaPolicy

What service-level contract applies to an assignment once it is queued.

EscalationPolicy owns the response/acceptance side (`respondWithinMs`);
SlaPolicy owns everything after that: how long the accepting user has to
finish, how many times the assignment may be rejected before it is pulled
from rotation, and an absolute freshness cutoff after which the work is
considered moot.

All timers are swept by the maintenance tick (see `startMaintenance()` /
`runMaintenanceOnce()`), so they fire with sweep granularity rather than
at the exact deadline.

**`Example`**

```typescript
await matcher.addAssignment({
    id: 'order-42',
    tags: ['fulfillment'],
    sla: {
        completeWithinMs: 30 * 60_000,
        onCompletionBreach: 'requeue',
        maxRejections: 3,
        expireAfterMs: 24 * 3600_000,
    },
});
```

## Table of contents

### Properties

- [completeWithinMs](SlaPolicy.md#completewithinms)
- [expireAfterMs](SlaPolicy.md#expireafterms)
- [maxRejections](SlaPolicy.md#maxrejections)
- [onCompletionBreach](SlaPolicy.md#oncompletionbreach)
- [onExpire](SlaPolicy.md#onexpire)
- [onMaxRejections](SlaPolicy.md#onmaxrejections)

## Properties

### completeWithinMs

• `Optional` **completeWithinMs**: `number`

Milliseconds the accepting user has to complete the assignment,
measured from the moment `acceptAssignment()` succeeds. When the clock
runs out the completion-deadline sweep applies `onCompletionBreach`.

#### Defined in

[src/types/matcher.ts:167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L167)

___

### expireAfterMs

• `Optional` **expireAfterMs**: `number`

Absolute freshness cutoff in milliseconds, measured from the first
enqueue (survives requeues and applies in every state — queued,
pending, accepted). When the cutoff elapses the TTL sweep applies
`onExpire`. Use this for work that becomes moot after a while
regardless of who holds it.

#### Defined in

[src/types/matcher.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L175)

___

### maxRejections

• `Optional` **maxRejections**: `number`

Maximum number of times the assignment may be refused before
`onMaxRejections` fires. Both explicit `rejectAssignment()` calls and
blocking no-response expiries (`escalation.onNoResponse: 'block'`)
count; idle releases, operator releases, and non-blocking expiries
do not.

#### Defined in

[src/types/matcher.ts:183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L183)

___

### onCompletionBreach

• `Optional` **onCompletionBreach**: ``"park"`` \| ``"notify"`` \| ``"requeue"`` \| ``"fail"``

What happens when the completion deadline (`completeWithinMs`) elapses.
- `'notify'` — emit a `completionBreached` lifecycle event and record
  an `expire` learning outcome; the worker keeps the assignment.
- `'requeue'` — take the assignment back, block the breaching user,
  and return it to the queue. The TTL (`expireAfterMs`) keeps ticking.
- `'fail'` — close the assignment as failed in the completed store.
- `'park'` — hold the assignment out of matching (see parked store).

**`Default`**

```ts
'notify'
```

#### Defined in

[src/types/matcher.ts:194](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L194)

___

### onExpire

• `Optional` **onExpire**: ``"park"`` \| ``"drop"``

What happens when the freshness cutoff (`expireAfterMs`) elapses.
- `'drop'` — remove the assignment entirely from whichever store it
  occupies.
- `'park'` — move it to the parked store for operator inspection.

**`Default`**

```ts
'drop'
```

#### Defined in

[src/types/matcher.ts:212](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L212)

___

### onMaxRejections

• `Optional` **onMaxRejections**: ``"park"`` \| ``"fail"`` \| ``"keep"``

What happens when the rejection budget (`maxRejections`) is exhausted.
- `'park'` — move to the parked store; retrievable via
  `getParkedAssignments()` / `unparkAssignment()`.
- `'fail'` — close the assignment as failed in the completed store.
- `'keep'` — keep requeueing (legacy behaviour; makes `maxRejections`
  a measurement-only knob).

**`Default`**

```ts
'park'
```

#### Defined in

[src/types/matcher.ts:204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L204)
