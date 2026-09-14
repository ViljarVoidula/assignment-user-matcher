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

[src/types/matcher.ts:727](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L727)

___

### matchExpirationMs

• `Optional` **matchExpirationMs**: `number`

Fallback response deadline when no escalation policy declares one

#### Defined in

[src/types/matcher.ts:725](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L725)

___

### now

• `Optional` **now**: `number`

Reference time in epoch ms (default: `Date.now()`)

#### Defined in

[src/types/matcher.ts:723](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L723)
