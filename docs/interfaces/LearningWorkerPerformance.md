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

[src/types/matcher.ts:1821](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1821)

___

### attempts

• `Optional` **attempts**: `Record`\<`string`, `number`\>

Number of independent attempts backing the per-tag estimates

#### Defined in

[src/types/matcher.ts:1829](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1829)

___

### backlog

• `Optional` **backlog**: `number`

Current backlog size at decision time

#### Defined in

[src/types/matcher.ts:1831](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1831)

___

### backlogLimit

• `Optional` **backlogLimit**: `number`

Effective backlog cap for this worker

#### Defined in

[src/types/matcher.ts:1833](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1833)

___

### handlingTimeMs

• `Optional` **handlingTimeMs**: `Record`\<`string`, `number`\>

Mean handling time in ms, per tag; absent when unobserved

#### Defined in

[src/types/matcher.ts:1827](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1827)

___

### overallAcceptanceRate

• `Optional` **overallAcceptanceRate**: `number`

#### Defined in

[src/types/matcher.ts:1822](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1822)

___

### overallSuccessRate

• `Optional` **overallSuccessRate**: `number`

#### Defined in

[src/types/matcher.ts:1825](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1825)

___

### successRate

• `Optional` **successRate**: `Record`\<`string`, `number`\>

Shrunk P(success | accepted) estimate, per tag and overall

#### Defined in

[src/types/matcher.ts:1824](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1824)
