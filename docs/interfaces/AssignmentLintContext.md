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

[src/types/matcher.ts:694](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L694)

___

### matchExpirationMs

• `Optional` **matchExpirationMs**: `number`

Fallback response deadline when no escalation policy declares one

#### Defined in

[src/types/matcher.ts:692](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L692)

___

### now

• `Optional` **now**: `number`

Reference time in epoch ms (default: `Date.now()`)

#### Defined in

[src/types/matcher.ts:690](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L690)
