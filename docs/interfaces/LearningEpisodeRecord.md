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

[src/types/matcher.ts:1919](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1919)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1910](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1910)

___

### decisionId

• **decisionId**: `string`

Unique id of the attempt this episode closes

#### Defined in

[src/types/matcher.ts:1908](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1908)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1911](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1911)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1917](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1917)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:1913](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1913)

___

### tagStatsAt

• `Optional` **tagStatsAt**: `number`

When that per-tag contribution was written (needed to revise it under decay)

#### Defined in

[src/types/matcher.ts:1921](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1921)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1915](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1915)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1922](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1922)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1909](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1909)
