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

[src/types/matcher.ts:1558](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1558)

___

### limit

• `Optional` **limit**: `number`

Maximum instances returned (default 50), newest-created first

#### Defined in

[src/types/matcher.ts:1556](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1556)

___

### status

• `Optional` **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Only instances in this status

#### Defined in

[src/types/matcher.ts:1554](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1554)

___

### workflowDefinitionId

• `Optional` **workflowDefinitionId**: `string`

Only instances of this workflow definition

#### Defined in

[src/types/matcher.ts:1552](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1552)
