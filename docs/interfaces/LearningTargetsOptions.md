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

[src/types/matcher.ts:1845](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1845)

___

### learningRates

• `Optional` **learningRates**: `Partial`\<`Record`\<[`LearningRewardTarget`](../modules.md#learningrewardtarget), `number`\>\>

Per-target learning-rate overrides (default: the shared learning rate).

#### Defined in

[src/types/matcher.ts:1849](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1849)

___

### qualityWeight

• `Optional` **qualityWeight**: `number`

#### Defined in

[src/types/matcher.ts:1847](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1847)

___

### successWeight

• `Optional` **successWeight**: `number`

#### Defined in

[src/types/matcher.ts:1846](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1846)

___

### systemFaultCountsAsFailure

• `Optional` **systemFaultCountsAsFailure**: `boolean`

Treat a system-side cancellation (`failAssignment` with
`systemFault: true`, SLA expiry of an accepted item) as a
`successGivenAcceptance` = 0 label. Default false: a system fault is
not the worker's failure, so it produces no label at all.

#### Defined in

[src/types/matcher.ts:1856](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1856)

___

### targets

• `Optional` **targets**: [`LearningRewardTarget`](../modules.md#learningrewardtarget)[]

Targets to model. Default when enabled: acceptance + successGivenAcceptance.

#### Defined in

[src/types/matcher.ts:1838](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1838)
