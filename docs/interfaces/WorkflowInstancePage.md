[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowInstancePage

# Interface: WorkflowInstancePage

Paginated result of `listWorkflowInstances()`.

## Table of contents

### Properties

- [instances](WorkflowInstancePage.md#instances)
- [nextCursor](WorkflowInstancePage.md#nextcursor)

## Properties

### instances

• **instances**: [`WorkflowInstance`](WorkflowInstance.md)[]

#### Defined in

[src/types/matcher.ts:1563](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1563)

___

### nextCursor

• `Optional` **nextCursor**: `string`

Present when more instances remain; pass back as `cursor` for the next page

#### Defined in

[src/types/matcher.ts:1565](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1565)
