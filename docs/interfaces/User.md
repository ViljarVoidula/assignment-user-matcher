[assignment-user-matcher](../README.md) / [Exports](../modules.md) / User

# Interface: User

## Indexable

▪ [key: `string`]: `any`

## Table of contents

### Properties

- [id](User.md#id)
- [ip](User.md#ip)
- [latitude](User.md#latitude)
- [learnedRoutingWeights](User.md#learnedroutingweights)
- [learnedRoutingWeightsSyncedAt](User.md#learnedroutingweightssyncedat)
- [longitude](User.md#longitude)
- [maxBacklogSize](User.md#maxbacklogsize)
- [maxTravelDistanceKm](User.md#maxtraveldistancekm)
- [routingWeights](User.md#routingweights)
- [routingWeightsSnapshot](User.md#routingweightssnapshot)
- [tags](User.md#tags)

## Properties

### id

• **id**: `string`

#### Defined in

[src/types/matcher.ts:6](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L6)

___

### ip

• `Optional` **ip**: `string`

#### Defined in

[src/types/matcher.ts:13](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L13)

___

### latitude

• `Optional` **latitude**: `number`

#### Defined in

[src/types/matcher.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L15)

___

### learnedRoutingWeights

• `Optional` **learnedRoutingWeights**: `Record`\<`string`, `number`\>

The weights last applied by syncLearnedRoutingWeights(); for observability only.

#### Defined in

[src/types/matcher.ts:33](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L33)

___

### learnedRoutingWeightsSyncedAt

• `Optional` **learnedRoutingWeightsSyncedAt**: `number`

Unix epoch ms of the last learned routing-weights sync for this user.

#### Defined in

[src/types/matcher.ts:31](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L31)

___

### longitude

• `Optional` **longitude**: `number`

#### Defined in

[src/types/matcher.ts:16](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L16)

___

### maxBacklogSize

• `Optional` **maxBacklogSize**: `number`

#### Defined in

[src/types/matcher.ts:23](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L23)

___

### maxTravelDistanceKm

• `Optional` **maxTravelDistanceKm**: `number`

#### Defined in

[src/types/matcher.ts:18](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L18)

___

### routingWeights

• `Optional` **routingWeights**: `Record`\<`string`, `number`\>

#### Defined in

[src/types/matcher.ts:10](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L10)

___

### routingWeightsSnapshot

• `Optional` **routingWeightsSnapshot**: ``null`` \| `Record`\<`string`, `number`\>

Snapshot of routingWeights before the last learned sync; used by
revertLearnedRoutingWeights(). `null` records "had no routingWeights"
(tag-based matching), so that state is restorable too.

#### Defined in

[src/types/matcher.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L29)

___

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:7](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L7)
