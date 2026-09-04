[assignment-user-matcher](../README.md) / [Exports](../modules.md) / TimelineIndex

# Class: TimelineIndex

All timelines for a solve, keyed by person id.

The engine owns mutation; constraints only read. Keeping the index here
rather than on `SearchState` means a constraint never has to reconstruct a
person's history to answer a window question.

## Table of contents

### Constructors

- [constructor](TimelineIndex.md#constructor)

### Methods

- [add](TimelineIndex.md#add)
- [for](TimelineIndex.md#for)
- [personIds](TimelineIndex.md#personids)
- [remove](TimelineIndex.md#remove)

## Constructors

### constructor

• **new TimelineIndex**(`history?`): [`TimelineIndex`](TimelineIndex.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `history` | `Map`\<`string`, [`TimelineEntry`](../interfaces/TimelineEntry.md)[]\> |

#### Returns

[`TimelineIndex`](TimelineIndex.md)

#### Defined in

[src/scheduling/engine/timeline.ts:368](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/engine/timeline.ts#L368)

## Methods

### add

▸ **add**(`personId`, `entry`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `personId` | `string` |
| `entry` | [`TimelineEntry`](../interfaces/TimelineEntry.md) |

#### Returns

`void`

#### Defined in

[src/scheduling/engine/timeline.ts:384](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/engine/timeline.ts#L384)

___

### for

▸ **for**(`personId`): [`PersonTimeline`](PersonTimeline.md)

The person's timeline, created empty on first use.

#### Parameters

| Name | Type |
| :------ | :------ |
| `personId` | `string` |

#### Returns

[`PersonTimeline`](PersonTimeline.md)

#### Defined in

[src/scheduling/engine/timeline.ts:375](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/engine/timeline.ts#L375)

___

### personIds

▸ **personIds**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/scheduling/engine/timeline.ts:392](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/engine/timeline.ts#L392)

___

### remove

▸ **remove**(`personId`, `entryId`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `personId` | `string` |
| `entryId` | `string` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/engine/timeline.ts:388](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/engine/timeline.ts#L388)
