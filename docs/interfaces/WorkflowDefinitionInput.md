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

[src/types/matcher.ts:329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L329)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:319](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L319)

---

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L325)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:331](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L331)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:321](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L321)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:327](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L327)

---

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L323)
