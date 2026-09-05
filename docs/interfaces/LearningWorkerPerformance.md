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

[src/types/matcher.ts:1750](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1750)

___

### attempts

• `Optional` **attempts**: `Record`\<`string`, `number`\>

Number of independent attempts backing the per-tag estimates

#### Defined in

[src/types/matcher.ts:1758](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1758)

___

### backlog

• `Optional` **backlog**: `number`

Current backlog size at decision time

#### Defined in

[src/types/matcher.ts:1760](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1760)

___

### backlogLimit

• `Optional` **backlogLimit**: `number`

Effective backlog cap for this worker

#### Defined in

[src/types/matcher.ts:1762](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1762)

___

### handlingTimeMs

• `Optional` **handlingTimeMs**: `Record`\<`string`, `number`\>

Mean handling time in ms, per tag; absent when unobserved

#### Defined in

[src/types/matcher.ts:1756](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1756)

___

### overallAcceptanceRate

• `Optional` **overallAcceptanceRate**: `number`

#### Defined in

[src/types/matcher.ts:1751](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1751)

___

### overallSuccessRate

• `Optional` **overallSuccessRate**: `number`

#### Defined in

[src/types/matcher.ts:1754](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1754)

___

### successRate

• `Optional` **successRate**: `Record`\<`string`, `number`\>

Shrunk P(success | accepted) estimate, per tag and overall

#### Defined in

[src/types/matcher.ts:1753](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1753)
