[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningStats

# Interface: LearningStats

Aggregate learning statistics

## Table of contents

### Properties

- [ambiguousFeedback](LearningStats.md#ambiguousfeedback)
- [averageReward](LearningStats.md#averagereward)
- [decisions](LearningStats.md#decisions)
- [duplicateEvents](LearningStats.md#duplicateevents)
- [generation](LearningStats.md#generation)
- [invalidFeedback](LearningStats.md#invalidfeedback)
- [orphanEvents](LearningStats.md#orphanevents)
- [rewards](LearningStats.md#rewards)
- [staleEvents](LearningStats.md#staleevents)
- [supersededEvents](LearningStats.md#supersededevents)
- [totalReward](LearningStats.md#totalreward)

## Properties

### ambiguousFeedback

• **ambiguousFeedback**: `number`

Assignment-addressed feedback rejected as ambiguous between two attempts

#### Defined in

[src/types/matcher.ts:2138](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2138)

___

### averageReward

• **averageReward**: `number`

totalReward / rewards (0 when no rewards)

#### Defined in

[src/types/matcher.ts:2128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2128)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions (== committed attempts)

#### Defined in

[src/types/matcher.ts:2122](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2122)

___

### duplicateEvents

• **duplicateEvents**: `number`

Events rejected as replays of an already-applied event

#### Defined in

[src/types/matcher.ts:2130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2130)

___

### generation

• **generation**: `number`

Current model generation (bumped by resetLearningModel)

#### Defined in

[src/types/matcher.ts:2142](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2142)

___

### invalidFeedback

• **invalidFeedback**: `number`

Feedback rejected by validation (non-finite, out of range, empty)

#### Defined in

[src/types/matcher.ts:2140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2140)

___

### orphanEvents

• **orphanEvents**: `number`

Events rejected because no attempt context exists for the assignment

#### Defined in

[src/types/matcher.ts:2134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2134)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:2124](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2124)

___

### staleEvents

• **staleEvents**: `number`

Events rejected because their attempt context had expired

#### Defined in

[src/types/matcher.ts:2132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2132)

___

### supersededEvents

• **supersededEvents**: `number`

Events rejected because the attempt belonged to a superseded model generation

#### Defined in

[src/types/matcher.ts:2136](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2136)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:2126](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L2126)
