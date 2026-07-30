[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningEpisodeRecord

# Interface: LearningEpisodeRecord

Archived episode retained after a terminal outcome for late external feedback

## Table of contents

### Properties

- [assignmentId](LearningEpisodeRecord.md#assignmentid)
- [features](LearningEpisodeRecord.md#features)
- [outcome](LearningEpisodeRecord.md#outcome)
- [tags](LearningEpisodeRecord.md#tags)
- [timestamp](LearningEpisodeRecord.md#timestamp)
- [userId](LearningEpisodeRecord.md#userid)

## Properties

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1064](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1064)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1065](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1065)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:1067](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1067)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1069](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1069)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1070](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1070)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1063](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1063)
