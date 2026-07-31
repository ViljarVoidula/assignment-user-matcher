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

[src/types/matcher.ts:1021](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1021)

___

### nextCursor

• `Optional` **nextCursor**: `string`

Present when more instances remain; pass back as `cursor` for the next page

#### Defined in

[src/types/matcher.ts:1023](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1023)
