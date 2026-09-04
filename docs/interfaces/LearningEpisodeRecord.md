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

[src/types/matcher.ts:1701](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1701)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1702](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1702)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:1704](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1704)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1706](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1706)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1707](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1707)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1700](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1700)
