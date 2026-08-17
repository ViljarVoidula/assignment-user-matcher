[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentLintContext

# Interface: AssignmentLintContext

Context for the pure `lintAssignment()` checks.

## Table of contents

### Properties

- [enableDefaultMatching](AssignmentLintContext.md#enabledefaultmatching)
- [matchExpirationMs](AssignmentLintContext.md#matchexpirationms)
- [now](AssignmentLintContext.md#now)

## Properties

### enableDefaultMatching

• `Optional` **enableDefaultMatching**: `boolean`

Whether the matcher injects the `default` tag

#### Defined in

[src/types/matcher.ts:525](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L525)

---

### matchExpirationMs

• `Optional` **matchExpirationMs**: `number`

Fallback response deadline when no escalation policy declares one

#### Defined in

[src/types/matcher.ts:523](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L523)

---

### now

• `Optional` **now**: `number`

Reference time in epoch ms (default: `Date.now()`)

#### Defined in

[src/types/matcher.ts:521](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L521)
