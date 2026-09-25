[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AutoWeightExplanation

# Interface: AutoWeightExplanation

Per-tag rationale for a synthesized routing weight.

## Table of contents

### Properties

- [attempts](AutoWeightExplanation.md#attempts)
- [decayHalfLifeMs](AutoWeightExplanation.md#decayhalflifems)
- [decision](AutoWeightExplanation.md#decision)
- [effectiveSampleSize](AutoWeightExplanation.md#effectivesamplesize)
- [estimate](AutoWeightExplanation.md#estimate)
- [lastObservedAt](AutoWeightExplanation.md#lastobservedat)
- [lowerBound](AutoWeightExplanation.md#lowerbound)
- [reassessAt](AutoWeightExplanation.md#reassessat)
- [tag](AutoWeightExplanation.md#tag)
- [uncertainty](AutoWeightExplanation.md#uncertainty)
- [upperBound](AutoWeightExplanation.md#upperbound)
- [weight](AutoWeightExplanation.md#weight)

## Properties

### attempts

• `Optional` **attempts**: `number`

Independent attempts backing the estimate

#### Defined in

[src/types/matcher.ts:2388](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2388)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Configured decay half-life, if any

#### Defined in

[src/types/matcher.ts:2394](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2394)

___

### decision

• **decision**: ``"veto"`` \| ``"scored"`` \| ``"prior"`` \| ``"cooldown"`` \| ``"insufficient-evidence"`` \| ``"unobserved"``

What happened, and why

#### Defined in

[src/types/matcher.ts:2379](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2379)

___

### effectiveSampleSize

• `Optional` **effectiveSampleSize**: `number`

Kish effective sample size after decay

#### Defined in

[src/types/matcher.ts:2390](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2390)

___

### estimate

• `Optional` **estimate**: `number`

Posterior mean reward estimate

#### Defined in

[src/types/matcher.ts:2381](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2381)

___

### lastObservedAt

• `Optional` **lastObservedAt**: `number`

Epoch ms of the most recent observation

#### Defined in

[src/types/matcher.ts:2392](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2392)

___

### lowerBound

• `Optional` **lowerBound**: `number`

Lower/upper credible bounds at the configured z

#### Defined in

[src/types/matcher.ts:2385](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2385)

___

### reassessAt

• `Optional` **reassessAt**: `number`

Epoch ms at which a lapsed veto would be reassessed

#### Defined in

[src/types/matcher.ts:2396](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2396)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:2375](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2375)

___

### uncertainty

• `Optional` **uncertainty**: `number`

Posterior standard error of that estimate

#### Defined in

[src/types/matcher.ts:2383](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2383)

___

### upperBound

• `Optional` **upperBound**: `number`

#### Defined in

[src/types/matcher.ts:2386](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2386)

___

### weight

• **weight**: `number`

The weight this tag was assigned

#### Defined in

[src/types/matcher.ts:2377](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2377)
