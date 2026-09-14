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

[src/scheduling/engine/timeline.ts:401](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/engine/timeline.ts#L401)

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

[src/scheduling/engine/timeline.ts:417](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/engine/timeline.ts#L417)

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

[src/scheduling/engine/timeline.ts:408](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/engine/timeline.ts#L408)

___

### personIds

▸ **personIds**(): `string`[]

#### Returns

`string`[]

#### Defined in

[src/scheduling/engine/timeline.ts:425](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/engine/timeline.ts#L425)

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

[src/scheduling/engine/timeline.ts:421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/engine/timeline.ts#L421)
