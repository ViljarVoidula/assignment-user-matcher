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

[src/types/matcher.ts:1951](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1951)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1942)

___

### decisionId

• **decisionId**: `string`

Unique id of the attempt this episode closes

#### Defined in

[src/types/matcher.ts:1940](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1940)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1943](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1943)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1949](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1949)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:1945](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1945)

___

### tagStatsAt

• `Optional` **tagStatsAt**: `number`

When that per-tag contribution was written (needed to revise it under decay)

#### Defined in

[src/types/matcher.ts:1953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1953)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1947](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1947)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1954](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1954)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1941](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1941)
