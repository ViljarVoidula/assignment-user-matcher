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

[src/types/matcher.ts:1990](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1990)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1981](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1981)

___

### decisionId

• **decisionId**: `string`

Unique id of the attempt this episode closes

#### Defined in

[src/types/matcher.ts:1979](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1979)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1982](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1982)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1988](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1988)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:1984](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1984)

___

### tagStatsAt

• `Optional` **tagStatsAt**: `number`

When that per-tag contribution was written (needed to revise it under decay)

#### Defined in

[src/types/matcher.ts:1992](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1992)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1986](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1986)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1993](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1993)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1980](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1980)
