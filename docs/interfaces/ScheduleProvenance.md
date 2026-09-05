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

[src/scheduling/types.ts:867](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L867)

___

### engineVersion

• **engineVersion**: `string`

#### Defined in

[src/scheduling/types.ts:863](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L863)

___

### profilingFree

• **profilingFree**: `boolean`

True when no behavioural or predictive per-worker signal fed the
allocation. Allocating on declared qualifications, availability, legal
limits, cost and realised counts is a constraint solve; adding
reliability or no-show prediction makes it profiling, which is
unconditionally high-risk under AI Act Annex III point 4(b).

#### Defined in

[src/scheduling/types.ts:875](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L875)

___

### rulesHash

• **rulesHash**: `string`

#### Defined in

[src/scheduling/types.ts:865](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L865)

___

### seed

• **seed**: `number`

#### Defined in

[src/scheduling/types.ts:864](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L864)
