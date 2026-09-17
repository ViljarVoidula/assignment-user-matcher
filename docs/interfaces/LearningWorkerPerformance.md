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

[src/types/matcher.ts:1782](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1782)

___

### attempts

• `Optional` **attempts**: `Record`\<`string`, `number`\>

Number of independent attempts backing the per-tag estimates

#### Defined in

[src/types/matcher.ts:1790](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1790)

___

### backlog

• `Optional` **backlog**: `number`

Current backlog size at decision time

#### Defined in

[src/types/matcher.ts:1792](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1792)

___

### backlogLimit

• `Optional` **backlogLimit**: `number`

Effective backlog cap for this worker

#### Defined in

[src/types/matcher.ts:1794](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1794)

___

### handlingTimeMs

• `Optional` **handlingTimeMs**: `Record`\<`string`, `number`\>

Mean handling time in ms, per tag; absent when unobserved

#### Defined in

[src/types/matcher.ts:1788](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1788)

___

### overallAcceptanceRate

• `Optional` **overallAcceptanceRate**: `number`

#### Defined in

[src/types/matcher.ts:1783](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1783)

___

### overallSuccessRate

• `Optional` **overallSuccessRate**: `number`

#### Defined in

[src/types/matcher.ts:1786](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1786)

___

### successRate

• `Optional` **successRate**: `Record`\<`string`, `number`\>

Shrunk P(success | accepted) estimate, per tag and overall

#### Defined in

[src/types/matcher.ts:1785](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1785)
