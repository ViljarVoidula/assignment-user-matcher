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

[src/types/matcher.ts:2165](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2165)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:2157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2157)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:2167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2167)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:2154](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2154)

___

### generation

• `Optional` **generation**: `number`

Model generation this prediction was made against

#### Defined in

[src/types/matcher.ts:2169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2169)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Name of the selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:2163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2163)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:2155](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2155)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy actually selected this candidate

#### Defined in

[src/types/matcher.ts:2161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2161)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time

#### Defined in

[src/types/matcher.ts:2159](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2159)
