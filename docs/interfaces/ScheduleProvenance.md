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

[src/scheduling/types.ts:1003](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1003)

___

### engineVersion

• **engineVersion**: `string`

#### Defined in

[src/scheduling/types.ts:997](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L997)

___

### maxIterations

• `Optional` **maxIterations**: `number`

Fixed iteration limit used for this run, if supplied. Persist the full input for replay.

#### Defined in

[src/scheduling/types.ts:999](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L999)

___

### profilingFree

• **profilingFree**: `boolean`

True when no behavioural or predictive per-worker signal fed the
allocation. Allocating on declared qualifications, availability, legal
limits, cost and realised counts is a constraint solve; adding
reliability or no-show prediction makes it profiling, which is
unconditionally high-risk under AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:1011](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1011)

___

### rulesHash

• **rulesHash**: `string`

#### Defined in

[src/scheduling/types.ts:1001](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1001)

___

### seed

• **seed**: `number`

#### Defined in

[src/scheduling/types.ts:1000](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1000)
