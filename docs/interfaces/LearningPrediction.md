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

[src/types/matcher.ts:1903](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1903)

___

### utility

• **utility**: `number`

The value used for ranking

#### Defined in

[src/types/matcher.ts:1901](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1901)
