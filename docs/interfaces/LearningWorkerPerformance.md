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

[src/types/matcher.ts:1764](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1764)

___

### attempts

• `Optional` **attempts**: `Record`\<`string`, `number`\>

Number of independent attempts backing the per-tag estimates

#### Defined in

[src/types/matcher.ts:1772](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1772)

___

### backlog

• `Optional` **backlog**: `number`

Current backlog size at decision time

#### Defined in

[src/types/matcher.ts:1774](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1774)

___

### backlogLimit

• `Optional` **backlogLimit**: `number`

Effective backlog cap for this worker

#### Defined in

[src/types/matcher.ts:1776](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1776)

___

### handlingTimeMs

• `Optional` **handlingTimeMs**: `Record`\<`string`, `number`\>

Mean handling time in ms, per tag; absent when unobserved

#### Defined in

[src/types/matcher.ts:1770](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1770)

___

### overallAcceptanceRate

• `Optional` **overallAcceptanceRate**: `number`

#### Defined in

[src/types/matcher.ts:1765](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1765)

___

### overallSuccessRate

• `Optional` **overallSuccessRate**: `number`

#### Defined in

[src/types/matcher.ts:1768](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1768)

___

### successRate

• `Optional` **successRate**: `Record`\<`string`, `number`\>

Shrunk P(success | accepted) estimate, per tag and overall

#### Defined in

[src/types/matcher.ts:1767](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1767)
