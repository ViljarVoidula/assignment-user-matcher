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

[src/types/matcher.ts:529](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L529)

---

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:533](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L533)

---

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:531](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L531)

---

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:527](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L527)
