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

[src/types/matcher.ts:581](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L581)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:571](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L571)

---

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:577](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L577)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:583](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L583)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:573](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L573)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:579](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L579)

---

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:575](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L575)
