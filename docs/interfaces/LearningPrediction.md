[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningPrediction

# Interface: LearningPrediction

Component predictions behind a combined learning utility

## Table of contents

### Properties

- [components](LearningPrediction.md#components)
- [utility](LearningPrediction.md#utility)

## Properties

### components

• **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions (probabilities for binary targets)

#### Defined in

[src/types/matcher.ts:2126](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2126)

___

### utility

• **utility**: `number`

The value used for ranking

#### Defined in

[src/types/matcher.ts:2124](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2124)
