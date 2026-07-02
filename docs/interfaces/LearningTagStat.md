[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningTagStat

# Interface: LearningTagStat

Per-user, per-tag reward statistics aggregated from lifecycle outcomes

## Table of contents

### Properties

- [count](LearningTagStat.md#count)
- [meanReward](LearningTagStat.md#meanreward)
- [rewardSum](LearningTagStat.md#rewardsum)
- [tag](LearningTagStat.md#tag)

## Properties

### count

• **count**: `number`

Number of reward observations for this tag

#### Defined in

[src/types/matcher.ts:494](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L494)

---

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:498](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L498)

---

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:496](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L496)

---

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:492](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L492)
