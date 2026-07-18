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

[src/types/matcher.ts:596](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L596)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:586](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L586)

___

### initialStepId

• **initialStepId**: `string`

The entry point step ID

#### Defined in

[src/types/matcher.ts:592](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L592)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:598](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L598)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:588](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L588)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:594](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L594)

___

### version

• **version**: `number`

Version for schema evolution

#### Defined in

[src/types/matcher.ts:590](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L590)
