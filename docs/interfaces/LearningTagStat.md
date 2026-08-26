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

[src/types/matcher.ts:1675](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1675)

___

### lastUpdatedAt

• `Optional` **lastUpdatedAt**: `number`

Unix epoch ms of the most recent observation (used for time decay)

#### Defined in

[src/types/matcher.ts:1683](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1683)

___

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:1679](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1679)

___

### rewardSqSum

• `Optional` **rewardSqSum**: `number`

Sum of squared observed rewards (available when reward-squared tracking is enabled)

#### Defined in

[src/types/matcher.ts:1681](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1681)

___

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:1677](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1677)

___

### standardError

• `Optional` **standardError**: `number`

Standard error of the mean (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1687](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1687)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:1673](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1673)

___

### variance

• `Optional` **variance**: `number`

Population variance of observed rewards (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1685](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1685)
