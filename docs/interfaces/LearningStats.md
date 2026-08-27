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

[src/types/matcher.ts:1813](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1813)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions

#### Defined in

[src/types/matcher.ts:1807](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1807)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:1809](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1809)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:1811](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1811)
