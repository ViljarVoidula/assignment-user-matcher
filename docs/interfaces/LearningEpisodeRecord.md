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

[src/types/matcher.ts:1933](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1933)

___

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:1924](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1924)

___

### decisionId

• **decisionId**: `string`

Unique id of the attempt this episode closes

#### Defined in

[src/types/matcher.ts:1922](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1922)

___

### features

• **features**: [`LearningFeatures`](../modules.md#learningfeatures)

#### Defined in

[src/types/matcher.ts:1925](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1925)

___

### generation

• `Optional` **generation**: `number`

Model generation this decision was committed against

#### Defined in

[src/types/matcher.ts:1931](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1931)

___

### outcome

• `Optional` **outcome**: [`LearningOutcome`](../modules.md#learningoutcome)

Terminal outcome that archived this episode

#### Defined in

[src/types/matcher.ts:1927](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1927)

___

### tagStatsAt

• `Optional` **tagStatsAt**: `number`

When that per-tag contribution was written (needed to revise it under decay)

#### Defined in

[src/types/matcher.ts:1935](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1935)

___

### tags

• `Optional` **tags**: `string`[]

Assignment tags captured at decision time (used for auto routing weights)

#### Defined in

[src/types/matcher.ts:1929](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1929)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1936](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1936)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1923](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1923)
