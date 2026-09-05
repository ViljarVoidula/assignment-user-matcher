[assignment-user-matcher](../README.md) / [Exports](../modules.md) / PersonTimeline

# Class: PersonTimeline

One person's ordered, non-overlapping-by-construction spans, with prefix sums
for O(log n) window queries.

Entries are kept sorted by start. The prefix array is rebuilt lazily, so a
burst of assign/unassign calls during a search move costs one rebuild at the
next query rather than one per mutation.

## Table of contents

### Constructors

- [constructor](PersonTimeline.md#constructor)

### Methods

- [add](PersonTimeline.md#add)
- [all](PersonTimeline.md#all)
- [countIn](PersonTimeline.md#countin)
- [entriesIn](PersonTimeline.md#entriesin)
- [has](PersonTimeline.md#has)
- [longestConsecutiveDays](PersonTimeline.md#longestconsecutivedays)
- [longestRestIn](PersonTimeline.md#longestrestin)
- [longestRun](PersonTimeline.md#longestrun)
- [maxWorkingMinutesInAnyWindow](PersonTimeline.md#maxworkingminutesinanywindow)
- [minGapAround](PersonTimeline.md#mingaparound)
- [minLongestRestInAnyWindow](PersonTimeline.md#minlongestrestinanywindow)
- [remove](PersonTimeline.md#remove)
- [restGapsIn](PersonTimeline.md#restgapsin)
- [totalWorkingMinutes](PersonTimeline.md#totalworkingminutes)
- [withEntry](PersonTimeline.md#withentry)
- [workingMinutesIn](PersonTimeline.md#workingminutesin)

## Constructors

### constructor

• **new PersonTimeline**(`history?`): [`PersonTimeline`](PersonTimeline.md)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `history` | [`TimelineEntry`](../interfaces/TimelineEntry.md)[] | `[]` |

#### Returns

[`PersonTimeline`](PersonTimeline.md)

#### Defined in

[src/scheduling/engine/timeline.ts:62](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L62)

## Methods

### add

▸ **add**(`entry`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | [`TimelineEntry`](../interfaces/TimelineEntry.md) |

#### Returns

`void`

#### Defined in

[src/scheduling/engine/timeline.ts:80](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L80)

___

### all

▸ **all**(): readonly [`TimelineEntry`](../interfaces/TimelineEntry.md)[]

Every entry, history first, ordered by start.

#### Returns

readonly [`TimelineEntry`](../interfaces/TimelineEntry.md)[]

#### Defined in

[src/scheduling/engine/timeline.ts:69](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L69)

___

### countIn

▸ **countIn**(`window`, `predicate?`): `number`

Number of entries in `window` satisfying `predicate`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `window` | [`MinuteRange`](../interfaces/MinuteRange.md) |
| `predicate?` | (`entry`: [`TimelineEntry`](../interfaces/TimelineEntry.md)) => `boolean` |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:273](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L273)

___

### entriesIn

▸ **entriesIn**(`window`): [`TimelineEntry`](../interfaces/TimelineEntry.md)[]

Entries intersecting `window`, in order.

#### Parameters

| Name | Type |
| :------ | :------ |
| `window` | [`MinuteRange`](../interfaces/MinuteRange.md) |

#### Returns

[`TimelineEntry`](../interfaces/TimelineEntry.md)[]

#### Defined in

[src/scheduling/engine/timeline.ts:181](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L181)

___

### has

▸ **has**(`id`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/engine/timeline.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L96)

___

### longestConsecutiveDays

▸ **longestConsecutiveDays**(`dayIndexOf`): `number`

Longest run of consecutive day indices on which the person has any entry.
Backs `max consecutive working days`. `dayIndexOf` maps a period minute to
a day so the caller's clock owns DST, not this structure.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dayIndexOf` | (`minute`: `number`) => `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:303](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L303)

___

### longestRestIn

▸ **longestRestIn**(`window`): `number`

Longest uninterrupted free stretch inside `window`, in minutes.

Gaps at the window edges count: a person with no assignments in a 7-day
window has 7 days of rest, and a weekly-rest rule must see that.

#### Parameters

| Name | Type |
| :------ | :------ |
| `window` | [`MinuteRange`](../interfaces/MinuteRange.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:240](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L240)

___

### longestRun

▸ **longestRun**(`predicate`): `number`

Longest run of consecutive entries satisfying `predicate`, where
"consecutive" means adjacent in time order with no non-matching entry
between them. Backs `max consecutive night shifts`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`entry`: [`TimelineEntry`](../interfaces/TimelineEntry.md)) => `boolean` |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:283](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L283)

___

### maxWorkingMinutesInAnyWindow

▸ **maxWorkingMinutesInAnyWindow**(`windowMinutes`, `bounds`): `number`

Worst case of "working minutes in any window of `windowMinutes`" that
overlaps `bounds` — the quantity a rolling average such as "≤48h in any
4-month window" actually limits.

Checking windows on a fixed calendar grid is the classic way to get this
wrong: a person can sit under 48h in every Mon–Sun week while working 60h
across a Thursday-to-Wednesday stretch. The maximum is always attained by
a window whose left edge sits on an entry boundary, so those are the only
candidates worth evaluating.

#### Parameters

| Name | Type |
| :------ | :------ |
| `windowMinutes` | `number` |
| `bounds` | [`MinuteRange`](../interfaces/MinuteRange.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:135](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L135)

___

### minGapAround

▸ **minGapAround**(`range`, `excludeId?`): `number`

Smallest gap between `range` and any existing entry, ignoring `excludeId`.
Returns `Infinity` when the timeline is otherwise empty, and 0 when
something overlaps — overlap is a different rule's business.

#### Parameters

| Name | Type |
| :------ | :------ |
| `range` | [`MinuteRange`](../interfaces/MinuteRange.md) |
| `excludeId?` | `string` |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:260](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L260)

___

### minLongestRestInAnyWindow

▸ **minLongestRestInAnyWindow**(`windowMinutes`, `bounds`): `number`

Worst case of "longest continuous rest in any window of `windowMinutes`"
overlapping `bounds` — what a weekly-rest rule requires a floor on.

Returns `Infinity` when no candidate window applies, so an empty timeline
never reads as a breach.

#### Parameters

| Name | Type |
| :------ | :------ |
| `windowMinutes` | `number` |
| `bounds` | [`MinuteRange`](../interfaces/MinuteRange.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L153)

___

### remove

▸ **remove**(`id`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/engine/timeline.ts:88](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L88)

___

### restGapsIn

▸ **restGapsIn**(`window`): `number`[]

Every free stretch inside `window`, in minutes, including the stretches at
the window edges. Weekly-rest averaging needs the individual gaps, not
just the longest one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `window` | [`MinuteRange`](../interfaces/MinuteRange.md) |

#### Returns

`number`[]

#### Defined in

[src/scheduling/engine/timeline.ts:219](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L219)

___

### totalWorkingMinutes

▸ **totalWorkingMinutes**(): `number`

Total working minutes currently on the timeline, history included.

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:75](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L75)

___

### withEntry

▸ **withEntry**\<`T`\>(`entry`, `fn`): `T`

Run `fn` with `entry` temporarily on the timeline, then restore it.

Constraints are asked "what would assigning this pair cost", and the pair
is not on the timeline yet — so window rules have to measure a
hypothetical. Adding and removing around the call beats copying the
timeline, which would allocate on every candidate evaluation in the
search's hot loop.

Idempotent: when the entry is already present (re-explaining a committed
roster) `fn` simply runs against the timeline as it stands.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `entry` | [`TimelineEntry`](../interfaces/TimelineEntry.md) |
| `fn` | (`timeline`: [`PersonTimeline`](PersonTimeline.md)) => `T` |

#### Returns

`T`

#### Defined in

[src/scheduling/engine/timeline.ts:204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L204)

___

### workingMinutesIn

▸ **workingMinutesIn**(`window`): `number`

Working minutes falling inside `window`, counting partial overlaps
proportionally. This is the primitive behind every rolling average.

Costs a binary search plus one step per overlapping entry. A person's
timeline holds tens of entries per period, so scanning the hits beats
maintaining a minute-resolution index — a Fenwick tree over period
minutes would be ~45k slots per person, 22M across a 500-person solve,
to save a walk over a few dozen items.

#### Parameters

| Name | Type |
| :------ | :------ |
| `window` | [`MinuteRange`](../interfaces/MinuteRange.md) |

#### Returns

`number`

#### Defined in

[src/scheduling/engine/timeline.ts:110](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/engine/timeline.ts#L110)
