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

[src/types/matcher.ts:1786](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1786)

___

### performance

• `Optional` **performance**: [`LearningWorkerPerformance`](LearningWorkerPerformance.md)

Aggregates for the worker being scored (absent when unavailable)

#### Defined in

[src/types/matcher.ts:1782](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1782)

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

[src/types/matcher.ts:1784](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1784)
