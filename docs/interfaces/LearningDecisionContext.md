[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningDecisionContext

# Interface: LearningDecisionContext

In-memory context produced while scoring a candidate and carried to the
claim, so a decision is only ever committed for the worker who actually
won the assignment.

## Table of contents

### Properties

- [candidateCount](LearningDecisionContext.md#candidatecount)
- [components](LearningDecisionContext.md#components)
- [featureVersion](LearningDecisionContext.md#featureversion)
- [features](LearningDecisionContext.md#features)
- [generation](LearningDecisionContext.md#generation)
- [policy](LearningDecisionContext.md#policy)
- [predictedReward](LearningDecisionContext.md#predictedreward)
- [propensity](LearningDecisionContext.md#propensity)
- [tags](LearningDecisionContext.md#tags)

## Properties

### candidateCount

• `Optional` **candidateCount**: `number`

Number of admissible candidates the choice was made from

#### Defined in

[src/types/matcher.ts:1871](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1871)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1863](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1863)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1873](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1873)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1860](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1860)

___

### generation

• `Optional` **generation**: `number`

Model generation this prediction was made against

#### Defined in

[src/types/matcher.ts:1875](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1875)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Name of the selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1869](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1869)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1861](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1861)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy actually selected this candidate

#### Defined in

[src/types/matcher.ts:1867](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1867)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time

#### Defined in

[src/types/matcher.ts:1865](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1865)
