[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowDefinitionInput

# Interface: WorkflowDefinitionInput

User-friendly input shape for registering or executing workflows

## Table of contents

### Properties

- [defaultTimeoutMs](WorkflowDefinitionInput.md#defaulttimeoutms)
- [id](WorkflowDefinitionInput.md#id)
- [initialStepId](WorkflowDefinitionInput.md#initialstepid)
- [metadata](WorkflowDefinitionInput.md#metadata)
- [name](WorkflowDefinitionInput.md#name)
- [steps](WorkflowDefinitionInput.md#steps)
- [version](WorkflowDefinitionInput.md#version)

## Properties

### defaultTimeoutMs

• `Optional` **defaultTimeoutMs**: `number`

Default timeout for steps in milliseconds

#### Defined in

[src/types/matcher.ts:614](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L614)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:604](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L604)

___

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:610](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L610)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L616)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:606](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L606)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:612](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L612)

___

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:608](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/types/matcher.ts#L608)
