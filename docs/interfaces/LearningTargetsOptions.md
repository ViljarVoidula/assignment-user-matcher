[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LearningTargetsOptions

# Interface: LearningTargetsOptions

Multi-target reward configuration (opt-in). When absent the layer keeps
the legacy behaviour: one model, one scalar reward per lifecycle outcome.

## Table of contents

### Properties

- [acceptanceWeight](LearningTargetsOptions.md#acceptanceweight)
- [learningRates](LearningTargetsOptions.md#learningrates)
- [qualityWeight](LearningTargetsOptions.md#qualityweight)
- [successWeight](LearningTargetsOptions.md#successweight)
- [systemFaultCountsAsFailure](LearningTargetsOptions.md#systemfaultcountsasfailure)
- [targets](LearningTargetsOptions.md#targets)

## Properties

### acceptanceWeight

• `Optional` **acceptanceWeight**: `number`

Utility combination used for ranking:
`P(accept) * (successWeight * P(success|accept) + qualityWeight * E[quality])`,
plus `acceptanceWeight * P(accept)`. Defaults: acceptance 0, success 1,
quality 0 (or 1 when `quality` is the only non-acceptance target).

#### Defined in

[src/types/matcher.ts:2107](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2107)

___

### learningRates

• `Optional` **learningRates**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target learning-rate overrides (default: the shared learning rate).

#### Defined in

[src/types/matcher.ts:2111](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2111)

___

### qualityWeight

• `Optional` **qualityWeight**: `number`

#### Defined in

[src/types/matcher.ts:2109](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2109)

___

### successWeight

• `Optional` **successWeight**: `number`

#### Defined in

[src/types/matcher.ts:2108](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2108)

___

### systemFaultCountsAsFailure

• `Optional` **systemFaultCountsAsFailure**: `boolean`

Treat a system-side cancellation (`failAssignment` with
`systemFault: true`, SLA expiry of an accepted item) as a
`successGivenAcceptance` = 0 label. Default false: a system fault is
not the worker's failure, so it produces no label at all.

#### Defined in

[src/types/matcher.ts:2118](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2118)

___

### targets

• `Optional` **targets**: [`LearningRewardTarget`](../modules.md#learningrewardtarget)[]

Targets to model. Default when enabled: acceptance + successGivenAcceptance.

#### Defined in

[src/types/matcher.ts:2100](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L2100)
