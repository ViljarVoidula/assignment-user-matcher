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

[src/types/matcher.ts:1825](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1825)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:1815](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1815)

___

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:1821](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1821)

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

[src/types/matcher.ts:1832](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1832)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:1834](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1834)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1817](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1817)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:1823](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1823)

___

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:1819](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1819)
