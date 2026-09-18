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

[src/types/matcher.ts:1884](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1884)

___

### learningRates

• `Optional` **learningRates**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target learning-rate overrides (default: the shared learning rate).

#### Defined in

[src/types/matcher.ts:1888](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1888)

___

### qualityWeight

• `Optional` **qualityWeight**: `number`

#### Defined in

[src/types/matcher.ts:1886](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1886)

___

### successWeight

• `Optional` **successWeight**: `number`

#### Defined in

[src/types/matcher.ts:1885](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1885)

___

### systemFaultCountsAsFailure

• `Optional` **systemFaultCountsAsFailure**: `boolean`

Treat a system-side cancellation (`failAssignment` with
`systemFault: true`, SLA expiry of an accepted item) as a
`successGivenAcceptance` = 0 label. Default false: a system fault is
not the worker's failure, so it produces no label at all.

#### Defined in

[src/types/matcher.ts:1895](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1895)

___

### targets

• `Optional` **targets**: [`LearningRewardTarget`](../modules.md#learningrewardtarget)[]

Targets to model. Default when enabled: acceptance + successGivenAcceptance.

#### Defined in

[src/types/matcher.ts:1877](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1877)
