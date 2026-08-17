[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowInstanceQuery

# Interface: WorkflowInstanceQuery

Filters for `listWorkflowInstances()`.

## Table of contents

### Properties

- [cursor](WorkflowInstanceQuery.md#cursor)
- [limit](WorkflowInstanceQuery.md#limit)
- [status](WorkflowInstanceQuery.md#status)
- [workflowDefinitionId](WorkflowInstanceQuery.md#workflowdefinitionid)

## Properties

### cursor

• `Optional` **cursor**: `string`

Opaque pagination cursor from a previous page's `nextCursor`

#### Defined in

[src/types/matcher.ts:1249](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1249)

---

### limit

• `Optional` **limit**: `number`

Maximum instances returned (default 50), newest-created first

#### Defined in

[src/types/matcher.ts:1247](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1247)

---

### status

• `Optional` **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Only instances in this status

#### Defined in

[src/types/matcher.ts:1245](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1245)

---

### workflowDefinitionId

• `Optional` **workflowDefinitionId**: `string`

Only instances of this workflow definition

#### Defined in

[src/types/matcher.ts:1243](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1243)
