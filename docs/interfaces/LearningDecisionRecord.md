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

[src/types/matcher.ts:1901](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1901)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1883](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1883)

___

### candidateCount

• `Optional` **candidateCount**: `number`

Number of admissible candidates the choice was made from

#### Defined in

[src/types/matcher.ts:1895](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1895)

___

### components

• `Optional` **components**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target component predictions, when multi-target modelling is on

#### Defined in

[src/types/matcher.ts:1887](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1887)

___

### decisionId

• **decisionId**: `string`

Unique id of this attempt — the key the record is stored under

#### Defined in

[src/types/matcher.ts:1881](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1881)

___

### featureVersion

• `Optional` **featureVersion**: `number`

Feature-extractor contract version

#### Defined in

[src/types/matcher.ts:1897](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1897)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1884](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1884)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1899](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1899)

___

### policy

• `Optional` **policy**: [`LearningExplorationPolicy`](../modules.md#learningexplorationpolicy)

Selection policy that produced `propensity`

#### Defined in

[src/types/matcher.ts:1893](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1893)

___

### predictedReward

• **predictedReward**: `number`

#### Defined in

[src/types/matcher.ts:1885](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1885)

___

### propensity

• `Optional` **propensity**: `number`

Probability with which the policy selected this candidate

#### Defined in

[src/types/matcher.ts:1891](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1891)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1889](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1889)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1902](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1902)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1882](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1882)
