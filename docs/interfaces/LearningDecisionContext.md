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

[src/types/matcher.ts:1885](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1885)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1877](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1877)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1887](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1887)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1874](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1874)

___

### generation

• `Optional` **generation**: `number`

Model generation this prediction was made against

#### Defined in

[src/types/matcher.ts:1889](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1889)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Name of the selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1883](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1883)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1875](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1875)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy actually selected this candidate

#### Defined in

[src/types/matcher.ts:1881](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1881)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time

#### Defined in

[src/types/matcher.ts:1879](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1879)
