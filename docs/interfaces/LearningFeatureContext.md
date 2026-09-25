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

[src/types/matcher.ts:2066](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2066)

___

### performance

• `Optional` **performance**: [`LearningWorkerPerformance`](LearningWorkerPerformance.md)

Aggregates for the worker being scored (absent when unavailable)

#### Defined in

[src/types/matcher.ts:2062](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2062)

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

[src/types/matcher.ts:2064](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2064)
