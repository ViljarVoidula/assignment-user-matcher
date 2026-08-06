[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningStats

# Interface: LearningStats

Aggregate learning statistics

## Table of contents

### Properties

- [averageReward](LearningStats.md#averagereward)
- [decisions](LearningStats.md#decisions)
- [rewards](LearningStats.md#rewards)
- [totalReward](LearningStats.md#totalreward)

## Properties

### averageReward

• **averageReward**: `number`

totalReward / rewards (0 when no rewards)

#### Defined in

[src/types/matcher.ts:1555](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1555)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions

#### Defined in

[src/types/matcher.ts:1549](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1549)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:1551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1551)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:1553](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1553)
