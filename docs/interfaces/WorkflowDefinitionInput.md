[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowDefinitionInput

# Interface: WorkflowDefinitionInput

User-friendly input shape for registering or executing workflows

## Table of contents

### Properties

- [defaultTimeoutMs](WorkflowDefinitionInput.md#defaulttimeoutms)
- [id](WorkflowDefinitionInput.md#id)
- [initialStepId](WorkflowDefinitionInput.md#initialstepid)
- [maxEscalationDepth](WorkflowDefinitionInput.md#maxescalationdepth)
- [metadata](WorkflowDefinitionInput.md#metadata)
- [name](WorkflowDefinitionInput.md#name)
- [steps](WorkflowDefinitionInput.md#steps)
- [version](WorkflowDefinitionInput.md#version)

## Properties

### defaultTimeoutMs

• `Optional` **defaultTimeoutMs**: `number`

Default timeout for steps in milliseconds

#### Defined in

[src/types/matcher.ts:1423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1423)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:1413](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1413)

___

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:1419](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1419)

___

### maxEscalationDepth

• `Optional` **maxEscalationDepth**: `number`

Safety net for `onTimeoutStepId` ladders: once a run has escalated this
many times it falls back to the ordinary failure path instead of
climbing further, so a mis-wired cycle still terminates.

**`Default`**

```ts
10
```

#### Defined in

[src/types/matcher.ts:1430](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1430)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:1432](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1432)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1415](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1415)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:1421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1421)

___

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:1417](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1417)
