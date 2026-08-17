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

[src/types/matcher.ts:1474](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1474)

---

### lastUpdatedAt

• `Optional` **lastUpdatedAt**: `number`

Unix epoch ms of the most recent observation (used for time decay)

#### Defined in

[src/types/matcher.ts:1482](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1482)

---

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:1478](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1478)

---

### rewardSqSum

• `Optional` **rewardSqSum**: `number`

Sum of squared observed rewards (available when reward-squared tracking is enabled)

#### Defined in

[src/types/matcher.ts:1480](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1480)

---

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:1476](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1476)

---

### standardError

• `Optional` **standardError**: `number`

Standard error of the mean (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1486](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1486)

---

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:1472](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1472)

---

### variance

• `Optional` **variance**: `number`

Population variance of observed rewards (0 when absent or single observation)

#### Defined in

[src/types/matcher.ts:1484](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1484)
