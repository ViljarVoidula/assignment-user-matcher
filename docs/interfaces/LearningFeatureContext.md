[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningFeatureContext

# Interface: LearningFeatureContext

Ambient context available to a feature extractor at decision time

## Table of contents

### Properties

- [now](LearningFeatureContext.md#now)
- [performance](LearningFeatureContext.md#performance)
- [priors](LearningFeatureContext.md#priors)

## Properties

### now

• `Optional` **now**: `number`

Decision timestamp used for all deadline arithmetic in this pass

#### Defined in

[src/types/matcher.ts:1772](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1772)

___

### performance

• `Optional` **performance**: [`LearningWorkerPerformance`](LearningWorkerPerformance.md)

Aggregates for the worker being scored (absent when unavailable)

#### Defined in

[src/types/matcher.ts:1768](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1768)

___

### priors

• `Optional` **priors**: `Object`

Team-wide priors the per-worker estimates are shrunk toward

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acceptanceRate?` | `number` |
| `handlingTimeMs?` | `number` |
| `successRate?` | `number` |

#### Defined in

[src/types/matcher.ts:1770](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1770)
