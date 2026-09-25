[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningWorkerPerformance

# Interface: LearningWorkerPerformance

Per-pass performance aggregates for one worker, batch-loaded once before
scoring so no feature costs a per-candidate Redis read.

## Table of contents

### Properties

- [acceptanceRate](LearningWorkerPerformance.md#acceptancerate)
- [attempts](LearningWorkerPerformance.md#attempts)
- [backlog](LearningWorkerPerformance.md#backlog)
- [backlogLimit](LearningWorkerPerformance.md#backloglimit)
- [handlingTimeMs](LearningWorkerPerformance.md#handlingtimems)
- [overallAcceptanceRate](LearningWorkerPerformance.md#overallacceptancerate)
- [overallSuccessRate](LearningWorkerPerformance.md#overallsuccessrate)
- [successRate](LearningWorkerPerformance.md#successrate)

## Properties

### acceptanceRate

• `Optional` **acceptanceRate**: `Record`\<`string`, `number`\>

Shrunk P(accept) estimate, per tag and overall

#### Defined in

[src/types/matcher.ts:2044](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2044)

___

### attempts

• `Optional` **attempts**: `Record`\<`string`, `number`\>

Number of independent attempts backing the per-tag estimates

#### Defined in

[src/types/matcher.ts:2052](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2052)

___

### backlog

• `Optional` **backlog**: `number`

Current backlog size at decision time

#### Defined in

[src/types/matcher.ts:2054](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2054)

___

### backlogLimit

• `Optional` **backlogLimit**: `number`

Effective backlog cap for this worker

#### Defined in

[src/types/matcher.ts:2056](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2056)

___

### handlingTimeMs

• `Optional` **handlingTimeMs**: `Record`\<`string`, `number`\>

Mean handling time in ms, per tag; absent when unobserved

#### Defined in

[src/types/matcher.ts:2050](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2050)

___

### overallAcceptanceRate

• `Optional` **overallAcceptanceRate**: `number`

#### Defined in

[src/types/matcher.ts:2045](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2045)

___

### overallSuccessRate

• `Optional` **overallSuccessRate**: `number`

#### Defined in

[src/types/matcher.ts:2048](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2048)

___

### successRate

• `Optional` **successRate**: `Record`\<`string`, `number`\>

Shrunk P(success | accepted) estimate, per tag and overall

#### Defined in

[src/types/matcher.ts:2047](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2047)
