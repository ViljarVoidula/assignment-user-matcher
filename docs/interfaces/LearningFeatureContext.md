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

[src/types/matcher.ts:1843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1843)

___

### performance

• `Optional` **performance**: [`LearningWorkerPerformance`](LearningWorkerPerformance.md)

Aggregates for the worker being scored (absent when unavailable)

#### Defined in

[src/types/matcher.ts:1839](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1839)

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

[src/types/matcher.ts:1841](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1841)
