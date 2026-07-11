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

[src/types/matcher.ts:629](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L629)

---

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:633](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L633)

---

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:631](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L631)

---

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:627](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L627)
