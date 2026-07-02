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

[src/types/matcher.ts:294](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L294)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:284](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L284)

---

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:290](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L290)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:296](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L296)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:286](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L286)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:292](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L292)

---

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:288](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L288)
