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

[src/types/matcher.ts:2195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2195)

___

### averageReward

• **averageReward**: `number`

totalReward / rewards (0 when no rewards)

#### Defined in

[src/types/matcher.ts:2185](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2185)

___

### decisions

• **decisions**: `number`

Number of recorded match decisions (== committed attempts)

#### Defined in

[src/types/matcher.ts:2179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2179)

___

### duplicateEvents

• **duplicateEvents**: `number`

Events rejected as replays of an already-applied event

#### Defined in

[src/types/matcher.ts:2187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2187)

___

### generation

• **generation**: `number`

Current model generation (bumped by resetLearningModel)

#### Defined in

[src/types/matcher.ts:2199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2199)

___

### invalidFeedback

• **invalidFeedback**: `number`

Feedback rejected by validation (non-finite, out of range, empty)

#### Defined in

[src/types/matcher.ts:2197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2197)

___

### orphanEvents

• **orphanEvents**: `number`

Events rejected because no attempt context exists for the assignment

#### Defined in

[src/types/matcher.ts:2191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2191)

___

### rewards

• **rewards**: `number`

Number of reward updates applied

#### Defined in

[src/types/matcher.ts:2181](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2181)

___

### staleEvents

• **staleEvents**: `number`

Events rejected because their attempt context had expired

#### Defined in

[src/types/matcher.ts:2189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2189)

___

### supersededEvents

• **supersededEvents**: `number`

Events rejected because the attempt belonged to a superseded model generation

#### Defined in

[src/types/matcher.ts:2193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2193)

___

### totalReward

• **totalReward**: `number`

Sum of all applied rewards

#### Defined in

[src/types/matcher.ts:2183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2183)
