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
false;
```

#### Defined in

[src/types/matcher.ts:546](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L546)

---

### limit

• `Optional` **limit**: `number`

Examine at most this many queued assignments, longest-waiting first.

**`Default`**

```ts
100;
```

#### Defined in

[src/types/matcher.ts:542](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L542)

---

### minWaitingMs

• `Optional` **minWaitingMs**: `number`

Only examine assignments that have waited at least this long.

**`Default`**

```ts
0;
```

#### Defined in

[src/types/matcher.ts:544](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L544)
