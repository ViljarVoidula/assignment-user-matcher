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

[src/types/matcher.ts:627](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L627)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:628](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L628)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:630](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L630)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:632](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L632)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:633](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L633)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:626](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L626)
