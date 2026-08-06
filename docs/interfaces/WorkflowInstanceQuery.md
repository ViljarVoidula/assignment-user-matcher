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

[src/types/matcher.ts:1240](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1240)

___

### limit

• `Optional` **limit**: `number`

Maximum instances returned (default 50), newest-created first

#### Defined in

[src/types/matcher.ts:1238](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1238)

___

### status

• `Optional` **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Only instances in this status

#### Defined in

[src/types/matcher.ts:1236](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1236)

___

### workflowDefinitionId

• `Optional` **workflowDefinitionId**: `string`

Only instances of this workflow definition

#### Defined in

[src/types/matcher.ts:1234](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1234)
