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

[src/types/matcher.ts:1864](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1864)

___

### utility

• **utility**: `number`

The value used for ranking

#### Defined in

[src/types/matcher.ts:1862](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1862)
