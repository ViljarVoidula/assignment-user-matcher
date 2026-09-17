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

[src/types/matcher.ts:748](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L748)

___

### limit

• `Optional` **limit**: `number`

Examine at most this many queued assignments, longest-waiting first.

**`Default`**

```ts
100
```

#### Defined in

[src/types/matcher.ts:744](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L744)

___

### minWaitingMs

• `Optional` **minWaitingMs**: `number`

Only examine assignments that have waited at least this long.

**`Default`**

```ts
0
```

#### Defined in

[src/types/matcher.ts:746](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L746)
