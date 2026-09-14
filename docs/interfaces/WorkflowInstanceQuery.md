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

[src/types/matcher.ts:1572](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1572)

___

### limit

• `Optional` **limit**: `number`

Maximum instances returned (default 50), newest-created first

#### Defined in

[src/types/matcher.ts:1570](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1570)

___

### status

• `Optional` **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Only instances in this status

#### Defined in

[src/types/matcher.ts:1568](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1568)

___

### workflowDefinitionId

• `Optional` **workflowDefinitionId**: `string`

Only instances of this workflow definition

#### Defined in

[src/types/matcher.ts:1566](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/types/matcher.ts#L1566)
