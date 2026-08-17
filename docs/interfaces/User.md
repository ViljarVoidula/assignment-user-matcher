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

[src/types/matcher.ts:6](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L6)

---

### ip

• `Optional` **ip**: `string`

#### Defined in

[src/types/matcher.ts:13](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L13)

---

### latitude

• `Optional` **latitude**: `number`

#### Defined in

[src/types/matcher.ts:15](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L15)

---

### learnedRoutingWeights

• `Optional` **learnedRoutingWeights**: `Record`\<`string`, `number`\>

The weights last applied by syncLearnedRoutingWeights(); for observability only.

#### Defined in

[src/types/matcher.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L29)

---

### learnedRoutingWeightsSyncedAt

• `Optional` **learnedRoutingWeightsSyncedAt**: `number`

Unix epoch ms of the last learned routing-weights sync for this user.

#### Defined in

[src/types/matcher.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L27)

---

### longitude

• `Optional` **longitude**: `number`

#### Defined in

[src/types/matcher.ts:16](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L16)

---

### maxBacklogSize

• `Optional` **maxBacklogSize**: `number`

#### Defined in

[src/types/matcher.ts:23](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L23)

---

### maxTravelDistanceKm

• `Optional` **maxTravelDistanceKm**: `number`

#### Defined in

[src/types/matcher.ts:18](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L18)

---

### routingWeights

• `Optional` **routingWeights**: `Record`\<`string`, `number`\>

#### Defined in

[src/types/matcher.ts:10](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L10)

---

### routingWeightsSnapshot

• `Optional` **routingWeightsSnapshot**: `Record`\<`string`, `number`\>

Snapshot of routingWeights before the last learned sync; used by revertLearnedRoutingWeights().

#### Defined in

[src/types/matcher.ts:25](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L25)

---

### tags

• **tags**: `string`[]

#### Defined in

[src/types/matcher.ts:7](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L7)
