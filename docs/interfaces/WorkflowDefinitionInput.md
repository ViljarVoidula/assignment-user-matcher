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

[src/types/matcher.ts:429](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L429)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:419](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L419)

---

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:425](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L425)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:431](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L431)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L421)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:427](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L427)

---

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L423)
