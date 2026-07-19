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

[src/types/matcher.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L119)

___

### fairness

• `Optional` **fairness**: [`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/types/matcher.ts:118](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L118)

___

### fairnessLoadPenalty

• `Optional` **fairnessLoadPenalty**: `number`

#### Defined in

[src/types/matcher.ts:120](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L120)

___

### fairnessMaxPerWindow

• `Optional` **fairnessMaxPerWindow**: `number`

#### Defined in

[src/types/matcher.ts:122](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L122)

___

### fairnessTieBand

• `Optional` **fairnessTieBand**: `number`

#### Defined in

[src/types/matcher.ts:121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L121)

___

### fairnessWindowMs

• `Optional` **fairnessWindowMs**: `number`

#### Defined in

[src/types/matcher.ts:123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L123)
