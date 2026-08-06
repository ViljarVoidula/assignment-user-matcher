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

[src/types/matcher.ts:360](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L360)

___

### fairness

• `Optional` **fairness**: [`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/types/matcher.ts:359](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L359)

___

### fairnessLoadPenalty

• `Optional` **fairnessLoadPenalty**: `number`

#### Defined in

[src/types/matcher.ts:361](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L361)

___

### fairnessMaxPerWindow

• `Optional` **fairnessMaxPerWindow**: `number`

#### Defined in

[src/types/matcher.ts:363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L363)

___

### fairnessTieBand

• `Optional` **fairnessTieBand**: `number`

#### Defined in

[src/types/matcher.ts:362](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L362)

___

### fairnessWindowMs

• `Optional` **fairnessWindowMs**: `number`

#### Defined in

[src/types/matcher.ts:364](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L364)
