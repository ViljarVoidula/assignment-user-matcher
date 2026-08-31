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

[src/types/matcher.ts:734](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L734)

___

### limit

• `Optional` **limit**: `number`

Examine at most this many queued assignments, longest-waiting first.

**`Default`**

```ts
100
```

#### Defined in

[src/types/matcher.ts:730](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L730)

___

### minWaitingMs

• `Optional` **minWaitingMs**: `number`

Only examine assignments that have waited at least this long.

**`Default`**

```ts
0
```

#### Defined in

[src/types/matcher.ts:732](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/types/matcher.ts#L732)
