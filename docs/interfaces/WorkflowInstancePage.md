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

[src/types/matcher.ts:1595](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1595)

___

### nextCursor

• `Optional` **nextCursor**: `string`

Present when more instances remain; pass back as `cursor` for the next page

#### Defined in

[src/types/matcher.ts:1597](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1597)
