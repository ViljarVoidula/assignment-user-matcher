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

[src/types/matcher.ts:713](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L713)

___

### matchExpirationMs

• `Optional` **matchExpirationMs**: `number`

Fallback response deadline when no escalation policy declares one

#### Defined in

[src/types/matcher.ts:711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L711)

___

### now

• `Optional` **now**: `number`

Reference time in epoch ms (default: `Date.now()`)

#### Defined in

[src/types/matcher.ts:709](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L709)
