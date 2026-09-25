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

[src/types/matcher.ts:2195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2195)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:2177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2177)

___

### candidateCount

• `Optional` **candidateCount**: `number`

Number of admissible candidates the choice was made from

#### Defined in

[src/types/matcher.ts:2189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2189)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:2181](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2181)

___

### decisionId

• **decisionId**: `string`

Unique id of this attempt — the key the record is stored under

#### Defined in

[src/types/matcher.ts:2175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2175)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:2191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2191)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:2178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2178)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:2193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2193)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:2187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2187)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:2179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2179)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy selected this candidate

#### Defined in

[src/types/matcher.ts:2185](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2185)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:2183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2183)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:2196](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2196)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:2176](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2176)
