[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningTagStat

# Interface: LearningTagStat

Per-user, per-tag reward statistics aggregated from lifecycle outcomes

## Table of contents

### Properties

- [attempts](LearningTagStat.md#attempts)
- [count](LearningTagStat.md#count)
- [effectiveSampleSize](LearningTagStat.md#effectivesamplesize)
- [lastUpdatedAt](LearningTagStat.md#lastupdatedat)
- [meanReward](LearningTagStat.md#meanreward)
- [rewardSqSum](LearningTagStat.md#rewardsqsum)
- [rewardSum](LearningTagStat.md#rewardsum)
- [standardError](LearningTagStat.md#standarderror)
- [sumWeightsSq](LearningTagStat.md#sumweightssq)
- [tag](LearningTagStat.md#tag)
- [variance](LearningTagStat.md#variance)

## Properties

### attempts

• `Optional` **attempts**: `number`

Lifetime count of independent attempts observed for this tag, never decayed

#### Defined in

[src/types/matcher.ts:1953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1953)

___

### count

• **count**: `number`

Decayed observation weight for this tag. With no decay configured this
is the raw observation count; with decay it is the sum of observation
weights, which is NOT a sample size — see `effectiveSampleSize`.

#### Defined in

[src/types/matcher.ts:1942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1942)

___

### effectiveSampleSize

• `Optional` **effectiveSampleSize**: `number`

Kish effective sample size of the decayed observations,
`sum(w)^2 / sum(w^2)`. Equal to `count` without decay. Evidence
thresholds (veto sample floors) are judged against this, never the
decayed weight sum.

#### Defined in

[src/types/matcher.ts:1949](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1949)

___

### lastUpdatedAt

• `Optional` **lastUpdatedAt**: `number`

Unix epoch ms of the most recent observation (used for time decay)

#### Defined in

[src/types/matcher.ts:1961](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1961)

___

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:1957](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1957)

___

### rewardSqSum

• `Optional` **rewardSqSum**: `number`

Sum of squared observed rewards (available when reward-squared tracking is enabled)

#### Defined in

[src/types/matcher.ts:1959](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1959)

___

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:1955](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1955)

___

### standardError

• `Optional` **standardError**: `number`

Standard error of the mean (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1965](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1965)

___

### sumWeightsSq

• `Optional` **sumWeightsSq**: `number`

Sum of squared observation weights, retained so `effectiveSampleSize` is computable

#### Defined in

[src/types/matcher.ts:1951](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1951)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:1936](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1936)

___

### variance

• `Optional` **variance**: `number`

Population variance of observed rewards (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1963](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1963)
