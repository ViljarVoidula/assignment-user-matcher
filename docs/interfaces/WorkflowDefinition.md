[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowDefinition

# Interface: WorkflowDefinition

A workflow definition (template)

## Table of contents

### Properties

- [defaultTimeoutMs](WorkflowDefinition.md#defaulttimeoutms)
- [id](WorkflowDefinition.md#id)
- [initialStepId](WorkflowDefinition.md#initialstepid)
- [maxEscalationDepth](WorkflowDefinition.md#maxescalationdepth)
- [metadata](WorkflowDefinition.md#metadata)
- [name](WorkflowDefinition.md#name)
- [steps](WorkflowDefinition.md#steps)
- [version](WorkflowDefinition.md#version)

## Properties

### defaultTimeoutMs

• `Optional` **defaultTimeoutMs**: `number`

Default timeout for steps in milliseconds

#### Defined in

[src/types/matcher.ts:1188](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1188)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:1178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1178)

___

### initialStepId

• **initialStepId**: `string`

The entry point step ID

#### Defined in

[src/types/matcher.ts:1184](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1184)

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

[src/types/matcher.ts:1195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1195)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:1197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1197)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1180](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1180)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:1186](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1186)

___

### version

• **version**: `number`

Version for schema evolution

#### Defined in

[src/types/matcher.ts:1182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1182)
