[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowDefinition

# Interface: WorkflowDefinition

A workflow definition (template)

## Table of contents

### Properties

- [defaultTimeoutMs](WorkflowDefinition.md#defaulttimeoutms)
- [id](WorkflowDefinition.md#id)
- [initialStepId](WorkflowDefinition.md#initialstepid)
- [metadata](WorkflowDefinition.md#metadata)
- [name](WorkflowDefinition.md#name)
- [steps](WorkflowDefinition.md#steps)
- [version](WorkflowDefinition.md#version)

## Properties

### defaultTimeoutMs

• `Optional` **defaultTimeoutMs**: `number`

Default timeout for steps in milliseconds

#### Defined in

[src/types/matcher.ts:431](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L431)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L421)

___

### initialStepId

• **initialStepId**: `string`

The entry point step ID

#### Defined in

[src/types/matcher.ts:427](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L427)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:433](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L433)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L423)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:429](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L429)

___

### version

• **version**: `number`

Version for schema evolution

#### Defined in

[src/types/matcher.ts:425](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L425)
