[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningTagStat

# Interface: LearningTagStat

Per-user, per-tag reward statistics aggregated from lifecycle outcomes

## Table of contents

### Properties

- [count](LearningTagStat.md#count)
- [lastUpdatedAt](LearningTagStat.md#lastupdatedat)
- [meanReward](LearningTagStat.md#meanreward)
- [rewardSqSum](LearningTagStat.md#rewardsqsum)
- [rewardSum](LearningTagStat.md#rewardsum)
- [standardError](LearningTagStat.md#standarderror)
- [tag](LearningTagStat.md#tag)
- [variance](LearningTagStat.md#variance)

## Properties

### count

• **count**: `number`

Number of reward observations for this tag

#### Defined in

[src/types/matcher.ts:1241](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1241)

___

### lastUpdatedAt

• `Optional` **lastUpdatedAt**: `number`

Unix epoch ms of the most recent observation (used for time decay)

#### Defined in

[src/types/matcher.ts:1249](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1249)

___

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:1245](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1245)

___

### rewardSqSum

• `Optional` **rewardSqSum**: `number`

Sum of squared observed rewards (available when reward-squared tracking is enabled)

#### Defined in

[src/types/matcher.ts:1247](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1247)

___

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:1243](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1243)

___

### standardError

• `Optional` **standardError**: `number`

Standard error of the mean (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1253](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1253)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:1239](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1239)

___

### variance

• `Optional` **variance**: `number`

Population variance of observed rewards (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1251](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1251)
