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

[src/types/matcher.ts:1846](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1846)

___

### utility

• **utility**: `number`

The value used for ranking

#### Defined in

[src/types/matcher.ts:1844](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1844)
