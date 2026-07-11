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

[src/types/matcher.ts:607](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L607)

---

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:608](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L608)

---

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:610](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L610)

---

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:612](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L612)

---

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:613](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L613)

---

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:606](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L606)
