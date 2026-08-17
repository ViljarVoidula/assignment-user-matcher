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

[src/types/matcher.ts:1254](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1254)

---

### nextCursor

• `Optional` **nextCursor**: `string`

Present when more instances remain; pass back as `cursor` for the next page

#### Defined in

[src/types/matcher.ts:1256](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1256)
