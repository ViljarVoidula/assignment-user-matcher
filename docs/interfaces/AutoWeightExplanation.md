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

[src/types/matcher.ts:2126](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2126)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Configured decay half-life, if any

#### Defined in

[src/types/matcher.ts:2132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2132)

___

### decision

• **decision**: ``"veto"`` \| ``"scored"`` \| ``"prior"`` \| ``"cooldown"`` \| ``"insufficient-evidence"`` \| ``"unobserved"``

What happened, and why

#### Defined in

[src/types/matcher.ts:2117](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2117)

___

### effectiveSampleSize

• `Optional` **effectiveSampleSize**: `number`

Kish effective sample size after decay

#### Defined in

[src/types/matcher.ts:2128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2128)

___

### estimate

• `Optional` **estimate**: `number`

Posterior mean reward estimate

#### Defined in

[src/types/matcher.ts:2119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2119)

___

### lastObservedAt

• `Optional` **lastObservedAt**: `number`

Epoch ms of the most recent observation

#### Defined in

[src/types/matcher.ts:2130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2130)

___

### lowerBound

• `Optional` **lowerBound**: `number`

Lower/upper credible bounds at the configured z

#### Defined in

[src/types/matcher.ts:2123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2123)

___

### reassessAt

• `Optional` **reassessAt**: `number`

Epoch ms at which a lapsed veto would be reassessed

#### Defined in

[src/types/matcher.ts:2134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2134)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:2113](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2113)

___

### uncertainty

• `Optional` **uncertainty**: `number`

Posterior standard error of that estimate

#### Defined in

[src/types/matcher.ts:2121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2121)

___

### upperBound

• `Optional` **upperBound**: `number`

#### Defined in

[src/types/matcher.ts:2124](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2124)

___

### weight

• **weight**: `number`

The weight this tag was assigned

#### Defined in

[src/types/matcher.ts:2115](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2115)
