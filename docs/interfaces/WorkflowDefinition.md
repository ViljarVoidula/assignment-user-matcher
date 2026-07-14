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

[src/types/matcher.ts:563](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L563)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:553](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L553)

---

### initialStepId

• **initialStepId**: `string`

The entry point step ID

#### Defined in

[src/types/matcher.ts:559](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L559)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:565](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L565)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:555](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L555)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L561)

---

### version

• **version**: `number`

Version for schema evolution

#### Defined in

[src/types/matcher.ts:557](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L557)
