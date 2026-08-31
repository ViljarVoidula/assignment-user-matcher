[assignment-user-matcher](../README.md) / [Exports](../modules.md) / FairnessConfig

# Interface: FairnessConfig

Runtime-mutable subset of the bulk-matching fairness knobs. Pass any subset
to `AssignmentMatcher.setFairnessConfig()` to retune fairness without
reconstructing the matcher; each field carries the same semantics as the
identically-named `MatcherOptions` field and is picked up on the next
`matchUsersAssignments()` call. Absent fields are left unchanged; pass
`fairness` or `fairnessMaxPerWindow` as `undefined` explicitly to clear them
back to their auto-derived behavior.

## Table of contents

### Properties

- [enableFairTiebreaker](FairnessConfig.md#enablefairtiebreaker)
- [fairness](FairnessConfig.md#fairness)
- [fairnessLoadPenalty](FairnessConfig.md#fairnessloadpenalty)
- [fairnessMaxPerWindow](FairnessConfig.md#fairnessmaxperwindow)
- [fairnessTieBand](FairnessConfig.md#fairnesstieband)
- [fairnessWindowMs](FairnessConfig.md#fairnesswindowms)

## Properties

### enableFairTiebreaker

• `Optional` **enableFairTiebreaker**: `boolean`

#### Defined in

[src/types/matcher.ts:548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L548)

___

### fairness

• `Optional` **fairness**: [`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/types/matcher.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L547)

___

### fairnessLoadPenalty

• `Optional` **fairnessLoadPenalty**: `number`

#### Defined in

[src/types/matcher.ts:549](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L549)

___

### fairnessMaxPerWindow

• `Optional` **fairnessMaxPerWindow**: `number`

#### Defined in

[src/types/matcher.ts:551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L551)

___

### fairnessTieBand

• `Optional` **fairnessTieBand**: `number`

#### Defined in

[src/types/matcher.ts:550](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L550)

___

### fairnessWindowMs

• `Optional` **fairnessWindowMs**: `number`

#### Defined in

[src/types/matcher.ts:552](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L552)
