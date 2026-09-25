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

[src/types/matcher.ts:2418](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2418)

___

### averageReward

• **averageReward**: `number`

totalReward / rewards (0 when no rewards)

#### Defined in

[src/types/matcher.ts:2408](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2408)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions (== committed attempts)

#### Defined in

[src/types/matcher.ts:2402](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2402)

___

### duplicateEvents

• **duplicateEvents**: `number`

Events rejected as replays of an already-applied event

#### Defined in

[src/types/matcher.ts:2410](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2410)

___

### generation

• **generation**: `number`

Current model generation (bumped by resetLearningModel)

#### Defined in

[src/types/matcher.ts:2422](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2422)

___

### invalidFeedback

• **invalidFeedback**: `number`

Feedback rejected by validation (non-finite, out of range, empty)

#### Defined in

[src/types/matcher.ts:2420](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2420)

___

### orphanEvents

• **orphanEvents**: `number`

Events rejected because no attempt context exists for the assignment

#### Defined in

[src/types/matcher.ts:2414](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2414)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:2404](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2404)

___

### staleEvents

• **staleEvents**: `number`

Events rejected because their attempt context had expired

#### Defined in

[src/types/matcher.ts:2412](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2412)

___

### supersededEvents

• **supersededEvents**: `number`

Events rejected because the attempt belonged to a superseded model generation

#### Defined in

[src/types/matcher.ts:2416](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2416)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:2406](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2406)
