[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ScheduleProvenance

# Interface: ScheduleProvenance

Identifying stamp for a solve.

## Table of contents

### Properties

- [dutyClassificationNotes](ScheduleProvenance.md#dutyclassificationnotes)
- [engineVersion](ScheduleProvenance.md#engineversion)
- [maxIterations](ScheduleProvenance.md#maxiterations)
- [profilingFree](ScheduleProvenance.md#profilingfree)
- [rulesHash](ScheduleProvenance.md#ruleshash)
- [seed](ScheduleProvenance.md#seed)

## Properties

### dutyClassificationNotes

• `Optional` **dutyClassificationNotes**: `Record`\<`string`, `string`\>

Duty classifications the caller supplied, recorded verbatim.

#### Defined in

[src/scheduling/types.ts:981](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L981)

___

### engineVersion

• **engineVersion**: `string`

#### Defined in

[src/scheduling/types.ts:975](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L975)

___

### maxIterations

• `Optional` **maxIterations**: `number`

Fixed iteration limit used for this run, if supplied. Persist the full input for replay.

#### Defined in

[src/scheduling/types.ts:977](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L977)

___

### profilingFree

• **profilingFree**: `boolean`

True when no behavioural or predictive per-worker signal fed the
allocation. Allocating on declared qualifications, availability, legal
limits, cost and realised counts is a constraint solve; adding
reliability or no-show prediction makes it profiling, which is
unconditionally high-risk under AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:989](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L989)

___

### rulesHash

• **rulesHash**: `string`

#### Defined in

[src/scheduling/types.ts:979](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L979)

___

### seed

• **seed**: `number`

#### Defined in

[src/scheduling/types.ts:978](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L978)
