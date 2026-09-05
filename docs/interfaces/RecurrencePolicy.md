[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RecurrencePolicy

# Interface: RecurrencePolicy

How a recurring assignment repeats.

A recurring assignment (`addRecurringAssignment`) is a standing template,
not a matchable assignment: the recurrence sweep materializes each
occurrence as an ordinary assignment whose `schedule` is derived from this
policy (`notBefore` = the slot's open time, `notAfter` = open + `windowMs`).
Occurrence ids are deterministic — `<templateId>@<openEpochMs>` — so a
crashed sweep re-materializing a slot is an idempotent re-add.

The sweep keeps the *next* occurrence materialized one interval ahead of
its open time, so upcoming work is visible in the scheduled store (and in
any host UI reading it) before the window opens. Slots are aligned to
`startAt + k × everyMs` and never drift, whatever the sweep cadence.

**`Example`**

```typescript
await matcher.addRecurringAssignment({
    id: 'blog-draft',
    tags: ['blog'],
    recurrence: {
        everyMs: 14 * 24 * 3600_000,   // biweekly
        startAt: Date.parse('2026-09-07T09:00:00Z'),
        windowMs: 3 * 24 * 3600_000,   // each occurrence offered for 3 days
        onMiss: 'park',
    },
});
matcher.startMaintenance(); // the recurrence sweep rides the maintenance tick
```

## Table of contents

### Properties

- [catchUp](RecurrencePolicy.md#catchup)
- [everyMs](RecurrencePolicy.md#everyms)
- [maxOccurrences](RecurrencePolicy.md#maxoccurrences)
- [onMiss](RecurrencePolicy.md#onmiss)
- [startAt](RecurrencePolicy.md#startat)
- [until](RecurrencePolicy.md#until)
- [windowMs](RecurrencePolicy.md#windowms)

## Properties

### catchUp

• `Optional` **catchUp**: ``"skip"`` \| ``"all"``

What to do with slots whose time already passed when the sweep runs
(host downtime):
- `'skip'` — materialize only slots whose window is still open; fully
  elapsed slots are skipped without counting against `maxOccurrences`.
  A revived host resumes the cadence instead of flooding the queue.
- `'all'` — materialize every elapsed slot; ones whose window already
  closed are immediately missed by the schedule sweep (parked/dropped
  per `onMiss`), which is the audit-trail reading of a dead interval.

**`Default`**

```ts
'skip'
```

#### Defined in

[src/types/matcher.ts:336](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L336)

___

### everyMs

• **everyMs**: `number`

Milliseconds between one occurrence's window opening and the next. Minimum 1000.

#### Defined in

[src/types/matcher.ts:306](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L306)

___

### maxOccurrences

• `Optional` **maxOccurrences**: `number`

Stop recurring after this many occurrences have been materialized.

#### Defined in

[src/types/matcher.ts:324](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L324)

___

### onMiss

• `Optional` **onMiss**: ``"park"`` \| ``"drop"``

Per-occurrence miss policy (see `SchedulePolicy.onMiss`).

**`Default`**

```ts
'park'
```

#### Defined in

[src/types/matcher.ts:320](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L320)

___

### startAt

• `Optional` **startAt**: `number`

Epoch ms the first occurrence's window opens.

**`Default`**

```ts
now — the first sweep materializes an occurrence immediately
```

#### Defined in

[src/types/matcher.ts:311](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L311)

___

### until

• `Optional` **until**: `number`

Stop recurring: no occurrence opens after this epoch ms; the template retires.

#### Defined in

[src/types/matcher.ts:322](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L322)

___

### windowMs

• `Optional` **windowMs**: `number`

Offer window per occurrence: the occurrence's `schedule.notAfter` is its
open time plus this. Omitted, an occurrence never expires off the offer
clock (and under `catchUp: 'skip'` an unmaterialized slot goes stale the
moment its successor's time arrives).

#### Defined in

[src/types/matcher.ts:318](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L318)
