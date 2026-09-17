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

[src/types/matcher.ts:1933](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1933)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1915](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1915)

___

### candidateCount

• `Optional` **candidateCount**: `number`

Number of admissible candidates the choice was made from

#### Defined in

[src/types/matcher.ts:1927](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1927)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1919](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1919)

___

### decisionId

• **decisionId**: `string`

Unique id of this attempt — the key the record is stored under

#### Defined in

[src/types/matcher.ts:1913](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1913)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1929](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1929)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1916](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1916)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1931](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1931)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1925](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1925)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1917](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1917)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy selected this candidate

#### Defined in

[src/types/matcher.ts:1923](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1923)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1921](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1921)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1934](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1934)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1914](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1914)
