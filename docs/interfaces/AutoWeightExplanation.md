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

[src/types/matcher.ts:2165](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2165)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Configured decay half-life, if any

#### Defined in

[src/types/matcher.ts:2171](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2171)

___

### decision

• **decision**: ``"veto"`` \| ``"scored"`` \| ``"prior"`` \| ``"cooldown"`` \| ``"insufficient-evidence"`` \| ``"unobserved"``

What happened, and why

#### Defined in

[src/types/matcher.ts:2156](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2156)

___

### effectiveSampleSize

• `Optional` **effectiveSampleSize**: `number`

Kish effective sample size after decay

#### Defined in

[src/types/matcher.ts:2167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2167)

___

### estimate

• `Optional` **estimate**: `number`

Posterior mean reward estimate

#### Defined in

[src/types/matcher.ts:2158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2158)

___

### lastObservedAt

• `Optional` **lastObservedAt**: `number`

Epoch ms of the most recent observation

#### Defined in

[src/types/matcher.ts:2169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2169)

___

### lowerBound

• `Optional` **lowerBound**: `number`

Lower/upper credible bounds at the configured z

#### Defined in

[src/types/matcher.ts:2162](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2162)

___

### reassessAt

• `Optional` **reassessAt**: `number`

Epoch ms at which a lapsed veto would be reassessed

#### Defined in

[src/types/matcher.ts:2173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2173)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:2152](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2152)

___

### uncertainty

• `Optional` **uncertainty**: `number`

Posterior standard error of that estimate

#### Defined in

[src/types/matcher.ts:2160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2160)

___

### upperBound

• `Optional` **upperBound**: `number`

#### Defined in

[src/types/matcher.ts:2163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2163)

___

### weight

• **weight**: `number`

The weight this tag was assigned

#### Defined in

[src/types/matcher.ts:2154](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2154)
