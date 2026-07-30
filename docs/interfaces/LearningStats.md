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

[src/types/matcher.ts:1173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1173)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions

#### Defined in

[src/types/matcher.ts:1167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1167)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:1169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1169)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:1171](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1171)
