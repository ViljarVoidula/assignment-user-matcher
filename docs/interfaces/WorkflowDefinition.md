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

[src/types/matcher.ts:311](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L311)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:301](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L301)

---

### initialStepId

• **initialStepId**: `string`

The entry point step ID

#### Defined in

[src/types/matcher.ts:307](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L307)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:313](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L313)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:303](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L303)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:309](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L309)

---

### version

• **version**: `number`

Version for schema evolution

#### Defined in

[src/types/matcher.ts:305](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L305)
