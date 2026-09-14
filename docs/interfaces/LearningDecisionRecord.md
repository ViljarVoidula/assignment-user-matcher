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

[src/types/matcher.ts:1915](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1915)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1897](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1897)

___

### candidateCount

• `Optional` **candidateCount**: `number`

Number of admissible candidates the choice was made from

#### Defined in

[src/types/matcher.ts:1909](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1909)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1901](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1901)

___

### decisionId

• **decisionId**: `string`

Unique id of this attempt — the key the record is stored under

#### Defined in

[src/types/matcher.ts:1895](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1895)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1911](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1911)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1898](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1898)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1913](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1913)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1907](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1907)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1899](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1899)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy selected this candidate

#### Defined in

[src/types/matcher.ts:1905](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1905)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1903](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1903)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1916](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1916)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1896](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1896)
