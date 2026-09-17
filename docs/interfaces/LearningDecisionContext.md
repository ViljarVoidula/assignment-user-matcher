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

[src/types/matcher.ts:1903](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1903)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1895](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1895)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1905](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1905)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1892](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1892)

___

### generation

• `Optional` **generation**: `number`

Model generation this prediction was made against

#### Defined in

[src/types/matcher.ts:1907](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1907)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Name of the selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1901](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1901)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1893](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1893)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy actually selected this candidate

#### Defined in

[src/types/matcher.ts:1899](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1899)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time

#### Defined in

[src/types/matcher.ts:1897](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1897)
