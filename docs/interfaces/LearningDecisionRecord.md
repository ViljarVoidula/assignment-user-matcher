[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningDecisionRecord

# Interface: LearningDecisionRecord

Stored decision context awaiting an outcome

## Table of contents

### Properties

- [accruedReward](LearningDecisionRecord.md#accruedreward)
- [assignmentId](LearningDecisionRecord.md#assignmentid)
- [candidateCount](LearningDecisionRecord.md#candidatecount)
- [components](LearningDecisionRecord.md#components)
- [decisionId](LearningDecisionRecord.md#decisionid)
- [featureVersion](LearningDecisionRecord.md#featureversion)
- [features](LearningDecisionRecord.md#features)
- [generation](LearningDecisionRecord.md#generation)
- [policy](LearningDecisionRecord.md#policy)
- [predictedReward](LearningDecisionRecord.md#predictedreward)
- [propensity](LearningDecisionRecord.md#propensity)
- [tags](LearningDecisionRecord.md#tags)
- [timestamp](LearningDecisionRecord.md#timestamp)
- [userId](LearningDecisionRecord.md#userid)

## Properties

### accruedReward

• `Optional` **accruedReward**: `number`

Sum of rewards applied to this attempt so far (per-attempt accounting)

#### Defined in

[src/types/matcher.ts:1972](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1972)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1954](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1954)

___

### candidateCount

• `Optional` **candidateCount**: `number`

Number of admissible candidates the choice was made from

#### Defined in

[src/types/matcher.ts:1966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1966)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1958](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1958)

___

### decisionId

• **decisionId**: `string`

Unique id of this attempt — the key the record is stored under

#### Defined in

[src/types/matcher.ts:1952](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1952)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1968](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1968)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1955](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1955)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1970](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1970)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1964](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1964)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1956](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1956)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy selected this candidate

#### Defined in

[src/types/matcher.ts:1962](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1962)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1960](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1960)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1973](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1973)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1953)
