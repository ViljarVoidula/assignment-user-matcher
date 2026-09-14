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

[src/types/matcher.ts:2108](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2108)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Configured decay half-life, if any

#### Defined in

[src/types/matcher.ts:2114](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2114)

___

### decision

• **decision**: ``"veto"`` \| ``"scored"`` \| ``"prior"`` \| ``"cooldown"`` \| ``"insufficient-evidence"`` \| ``"unobserved"``

What happened, and why

#### Defined in

[src/types/matcher.ts:2099](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2099)

___

### effectiveSampleSize

• `Optional` **effectiveSampleSize**: `number`

Kish effective sample size after decay

#### Defined in

[src/types/matcher.ts:2110](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2110)

___

### estimate

• `Optional` **estimate**: `number`

Posterior mean reward estimate

#### Defined in

[src/types/matcher.ts:2101](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2101)

___

### lastObservedAt

• `Optional` **lastObservedAt**: `number`

Epoch ms of the most recent observation

#### Defined in

[src/types/matcher.ts:2112](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2112)

___

### lowerBound

• `Optional` **lowerBound**: `number`

Lower/upper credible bounds at the configured z

#### Defined in

[src/types/matcher.ts:2105](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2105)

___

### reassessAt

• `Optional` **reassessAt**: `number`

Epoch ms at which a lapsed veto would be reassessed

#### Defined in

[src/types/matcher.ts:2116](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2116)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:2095](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2095)

___

### uncertainty

• `Optional` **uncertainty**: `number`

Posterior standard error of that estimate

#### Defined in

[src/types/matcher.ts:2103](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2103)

___

### upperBound

• `Optional` **upperBound**: `number`

#### Defined in

[src/types/matcher.ts:2106](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2106)

___

### weight

• **weight**: `number`

The weight this tag was assigned

#### Defined in

[src/types/matcher.ts:2097](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2097)
