[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ScheduleProvenance

# Interface: ScheduleProvenance

Identifying stamp for a solve.

## Table of contents

### Properties

- [dutyClassificationNotes](ScheduleProvenance.md#dutyclassificationnotes)
- [engineVersion](ScheduleProvenance.md#engineversion)
- [profilingFree](ScheduleProvenance.md#profilingfree)
- [rulesHash](ScheduleProvenance.md#ruleshash)
- [seed](ScheduleProvenance.md#seed)

## Properties

### dutyClassificationNotes

• `Optional` **dutyClassificationNotes**: `Record`\<`string`, `string`\>

Duty classifications the caller supplied, recorded verbatim.

#### Defined in

[src/scheduling/types.ts:752](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L752)

___

### engineVersion

• **engineVersion**: `string`

#### Defined in

[src/scheduling/types.ts:748](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L748)

___

### profilingFree

• **profilingFree**: `boolean`

True when no behavioural or predictive per-worker signal fed the
allocation. Allocating on declared qualifications, availability, legal
limits, cost and realised counts is a constraint solve; adding
reliability or no-show prediction makes it profiling, which is
unconditionally high-risk under AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:760](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L760)

___

### rulesHash

• **rulesHash**: `string`

#### Defined in

[src/scheduling/types.ts:750](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L750)

___

### seed

• **seed**: `number`

#### Defined in

[src/scheduling/types.ts:749](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L749)
