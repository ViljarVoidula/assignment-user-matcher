[assignment-user-matcher](../README.md) / [Exports](../modules.md) / QueueAuditOptions

# Interface: QueueAuditOptions

Options for `AssignmentMatcher.auditQueue()`.

## Table of contents

### Properties

- [includeHealthy](QueueAuditOptions.md#includehealthy)
- [limit](QueueAuditOptions.md#limit)
- [minWaitingMs](QueueAuditOptions.md#minwaitingms)

## Properties

### includeHealthy

• `Optional` **includeHealthy**: `boolean`

Also return entries that do have eligible users.

**`Default`**

```ts
false
```

#### Defined in

[src/types/matcher.ts:715](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L715)

___

### limit

• `Optional` **limit**: `number`

Examine at most this many queued assignments, longest-waiting first.

**`Default`**

```ts
100
```

#### Defined in

[src/types/matcher.ts:711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L711)

___

### minWaitingMs

• `Optional` **minWaitingMs**: `number`

Only examine assignments that have waited at least this long.

**`Default`**

```ts
0
```

#### Defined in

[src/types/matcher.ts:713](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L713)
