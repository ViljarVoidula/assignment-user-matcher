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

[src/types/matcher.ts:2156](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2156)

___

### averageReward

• **averageReward**: `number`

totalReward / rewards (0 when no rewards)

#### Defined in

[src/types/matcher.ts:2146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2146)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions (== committed attempts)

#### Defined in

[src/types/matcher.ts:2140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2140)

___

### duplicateEvents

• **duplicateEvents**: `number`

Events rejected as replays of an already-applied event

#### Defined in

[src/types/matcher.ts:2148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2148)

___

### generation

• **generation**: `number`

Current model generation (bumped by resetLearningModel)

#### Defined in

[src/types/matcher.ts:2160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2160)

___

### invalidFeedback

• **invalidFeedback**: `number`

Feedback rejected by validation (non-finite, out of range, empty)

#### Defined in

[src/types/matcher.ts:2158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2158)

___

### orphanEvents

• **orphanEvents**: `number`

Events rejected because no attempt context exists for the assignment

#### Defined in

[src/types/matcher.ts:2152](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2152)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:2142](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2142)

___

### staleEvents

• **staleEvents**: `number`

Events rejected because their attempt context had expired

#### Defined in

[src/types/matcher.ts:2150](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2150)

___

### supersededEvents

• **supersededEvents**: `number`

Events rejected because the attempt belonged to a superseded model generation

#### Defined in

[src/types/matcher.ts:2154](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2154)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:2144](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2144)
