[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningEpisodeRecord

# Interface: LearningEpisodeRecord

Archived episode retained after a terminal outcome for late external feedback

## Table of contents

### Properties

- [appliedTagReward](LearningEpisodeRecord.md#appliedtagreward)
- [assignmentId](LearningEpisodeRecord.md#assignmentid)
- [decisionId](LearningEpisodeRecord.md#decisionid)
- [features](LearningEpisodeRecord.md#features)
- [generation](LearningEpisodeRecord.md#generation)
- [outcome](LearningEpisodeRecord.md#outcome)
- [tagStatsAt](LearningEpisodeRecord.md#tagstatsat)
- [tags](LearningEpisodeRecord.md#tags)
- [timestamp](LearningEpisodeRecord.md#timestamp)
- [userId](LearningEpisodeRecord.md#userid)

## Properties

### appliedTagReward

• `Optional` **appliedTagReward**: `number`

Reward already written into per-tag statistics (per-attempt accounting)

#### Defined in

[src/types/matcher.ts:2213](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2213)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:2204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2204)

___

### decisionId

• **decisionId**: `string`

Unique id of the attempt this episode closes

#### Defined in

[src/types/matcher.ts:2202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2202)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:2205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2205)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:2211](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2211)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:2207](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2207)

___

### tagStatsAt

• `Optional` **tagStatsAt**: `number`

When that per-tag contribution was written (needed to revise it under decay)

#### Defined in

[src/types/matcher.ts:2215](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2215)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:2209](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2209)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:2216](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2216)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:2203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2203)
