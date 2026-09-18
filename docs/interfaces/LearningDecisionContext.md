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

[src/types/matcher.ts:1942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1942)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1934](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1934)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1944](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1944)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1931](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1931)

___

### generation

• `Optional` **generation**: `number`

Model generation this prediction was made against

#### Defined in

[src/types/matcher.ts:1946](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1946)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Name of the selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1940](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1940)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1932](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1932)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy actually selected this candidate

#### Defined in

[src/types/matcher.ts:1938](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1938)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time

#### Defined in

[src/types/matcher.ts:1936](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1936)
