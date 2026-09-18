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

[src/types/matcher.ts:750](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L750)

___

### matchExpirationMs

• `Optional` **matchExpirationMs**: `number`

Fallback response deadline when no escalation policy declares one

#### Defined in

[src/types/matcher.ts:748](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L748)

___

### now

• `Optional` **now**: `number`

Reference time in epoch ms (default: `Date.now()`)

#### Defined in

[src/types/matcher.ts:746](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L746)
