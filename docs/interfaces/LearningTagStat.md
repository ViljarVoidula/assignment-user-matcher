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

[src/types/matcher.ts:649](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L649)

___

### meanReward

• **meanReward**: `number`

rewardSum / count (0 when no observations)

#### Defined in

[src/types/matcher.ts:653](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L653)

___

### rewardSum

• **rewardSum**: `number`

Sum of observed rewards for this tag

#### Defined in

[src/types/matcher.ts:651](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L651)

___

### tag

• **tag**: `string`

#### Defined in

[src/types/matcher.ts:647](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L647)
