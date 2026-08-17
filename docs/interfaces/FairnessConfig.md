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

[src/types/matcher.ts:360](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L360)

---

### fairness

• `Optional` **fairness**: [`FairnessMode`](../modules.md#fairnessmode)

#### Defined in

[src/types/matcher.ts:359](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L359)

---

### fairnessLoadPenalty

• `Optional` **fairnessLoadPenalty**: `number`

#### Defined in

[src/types/matcher.ts:361](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L361)

---

### fairnessMaxPerWindow

• `Optional` **fairnessMaxPerWindow**: `number`

#### Defined in

[src/types/matcher.ts:363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L363)

---

### fairnessTieBand

• `Optional` **fairnessTieBand**: `number`

#### Defined in

[src/types/matcher.ts:362](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L362)

---

### fairnessWindowMs

• `Optional` **fairnessWindowMs**: `number`

#### Defined in

[src/types/matcher.ts:364](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L364)
