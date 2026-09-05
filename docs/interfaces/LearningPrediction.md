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

[src/types/matcher.ts:1832](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1832)

___

### utility

• **utility**: `number`

The value used for ranking

#### Defined in

[src/types/matcher.ts:1830](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1830)
