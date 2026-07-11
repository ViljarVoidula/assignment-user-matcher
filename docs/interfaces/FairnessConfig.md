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

[src/types/matcher.ts:90](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L90)

___

### fairness

• `Optional` **fairness**: [`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/types/matcher.ts:89](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L89)

___

### fairnessLoadPenalty

• `Optional` **fairnessLoadPenalty**: `number`

#### Defined in

[src/types/matcher.ts:91](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L91)

___

### fairnessMaxPerWindow

• `Optional` **fairnessMaxPerWindow**: `number`

#### Defined in

[src/types/matcher.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L93)

___

### fairnessTieBand

• `Optional` **fairnessTieBand**: `number`

#### Defined in

[src/types/matcher.ts:92](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L92)

___

### fairnessWindowMs

• `Optional` **fairnessWindowMs**: `number`

#### Defined in

[src/types/matcher.ts:94](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L94)
