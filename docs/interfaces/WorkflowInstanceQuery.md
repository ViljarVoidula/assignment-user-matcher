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

[src/types/matcher.ts:861](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L861)

___

### limit

• `Optional` **limit**: `number`

Maximum instances returned (default 50), newest-created first

#### Defined in

[src/types/matcher.ts:859](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L859)

___

### status

• `Optional` **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Only instances in this status

#### Defined in

[src/types/matcher.ts:857](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L857)

___

### workflowDefinitionId

• `Optional` **workflowDefinitionId**: `string`

Only instances of this workflow definition

#### Defined in

[src/types/matcher.ts:855](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L855)
