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

[src/types/matcher.ts:1245](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1245)

___

### nextCursor

• `Optional` **nextCursor**: `string`

Present when more instances remain; pass back as `cursor` for the next page

#### Defined in

[src/types/matcher.ts:1247](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1247)
