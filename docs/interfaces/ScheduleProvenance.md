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

[src/scheduling/types.ts:806](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L806)

___

### engineVersion

• **engineVersion**: `string`

#### Defined in

[src/scheduling/types.ts:802](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L802)

___

### profilingFree

• **profilingFree**: `boolean`

True when no behavioural or predictive per-worker signal fed the
allocation. Allocating on declared qualifications, availability, legal
limits, cost and realised counts is a constraint solve; adding
reliability or no-show prediction makes it profiling, which is
unconditionally high-risk under AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:814](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L814)

___

### rulesHash

• **rulesHash**: `string`

#### Defined in

[src/scheduling/types.ts:804](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L804)

___

### seed

• **seed**: `number`

#### Defined in

[src/scheduling/types.ts:803](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L803)
