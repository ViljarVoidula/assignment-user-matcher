[assignment-user-matcher](../README.md) / [Exports](../modules.md) / EpsilonGreedyOptions

# Interface: EpsilonGreedyOptions

## Table of contents

### Properties

- [epsilon](EpsilonGreedyOptions.md#epsilon)
- [rng](EpsilonGreedyOptions.md#rng)
- [tieEpsilon](EpsilonGreedyOptions.md#tieepsilon)

## Properties

### epsilon

• **epsilon**: `number`

Probability of the exploratory branch, in [0, 1]

#### Defined in

[src/learning/policy.ts:31](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/learning/policy.ts#L31)

___

### rng

• **rng**: () => `number`

Random source returning values in [0, 1)

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[src/learning/policy.ts:33](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/learning/policy.ts#L33)

___

### tieEpsilon

• `Optional` **tieEpsilon**: `number`

Scores within this distance of the leader count as tied for greedy
purposes, so a tie is shared rather than resolved by list order.

#### Defined in

[src/learning/policy.ts:38](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/learning/policy.ts#L38)
