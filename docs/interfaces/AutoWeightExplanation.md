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

[src/types/matcher.ts:2094](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2094)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Configured decay half-life, if any

#### Defined in

[src/types/matcher.ts:2100](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2100)

___

### decision

• **decision**: ``"veto"`` \| ``"scored"`` \| ``"prior"`` \| ``"cooldown"`` \| ``"insufficient-evidence"`` \| ``"unobserved"``

What happened, and why

#### Defined in

[src/types/matcher.ts:2085](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2085)

___

### effectiveSampleSize

• `Optional` **effectiveSampleSize**: `number`

Kish effective sample size after decay

#### Defined in

[src/types/matcher.ts:2096](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2096)

___

### estimate

• `Optional` **estimate**: `number`

Posterior mean reward estimate

#### Defined in

[src/types/matcher.ts:2087](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2087)

___

### lastObservedAt

• `Optional` **lastObservedAt**: `number`

Epoch ms of the most recent observation

#### Defined in

[src/types/matcher.ts:2098](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2098)

___

### lowerBound

• `Optional` **lowerBound**: `number`

Lower/upper credible bounds at the configured z

#### Defined in

[src/types/matcher.ts:2091](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2091)

___

### reassessAt

• `Optional` **reassessAt**: `number`

Epoch ms at which a lapsed veto would be reassessed

#### Defined in

[src/types/matcher.ts:2102](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2102)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:2081](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2081)

___

### uncertainty

• `Optional` **uncertainty**: `number`

Posterior standard error of that estimate

#### Defined in

[src/types/matcher.ts:2089](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2089)

___

### upperBound

• `Optional` **upperBound**: `number`

#### Defined in

[src/types/matcher.ts:2092](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2092)

___

### weight

• **weight**: `number`

The weight this tag was assigned

#### Defined in

[src/types/matcher.ts:2083](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L2083)
