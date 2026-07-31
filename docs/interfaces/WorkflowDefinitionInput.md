[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowDefinitionInput

# Interface: WorkflowDefinitionInput

User-friendly input shape for registering or executing workflows

## Table of contents

### Properties

- [defaultTimeoutMs](WorkflowDefinitionInput.md#defaulttimeoutms)
- [id](WorkflowDefinitionInput.md#id)
- [initialStepId](WorkflowDefinitionInput.md#initialstepid)
- [maxEscalationDepth](WorkflowDefinitionInput.md#maxescalationdepth)
- [metadata](WorkflowDefinitionInput.md#metadata)
- [name](WorkflowDefinitionInput.md#name)
- [steps](WorkflowDefinitionInput.md#steps)
- [version](WorkflowDefinitionInput.md#version)

## Properties

### defaultTimeoutMs

• `Optional` **defaultTimeoutMs**: `number`

Default timeout for steps in milliseconds

#### Defined in

[src/types/matcher.ts:1016](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1016)

___

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:1006](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1006)

___

### initialStepId

• `Optional` **initialStepId**: `string`

The entry point step ID (defaults to the first step ID)

#### Defined in

[src/types/matcher.ts:1012](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1012)

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

[src/types/matcher.ts:1023](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1023)

___

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:1025](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1025)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1008](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1008)

___

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:1014](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1014)

___

### version

• `Optional` **version**: `number`

Version for schema evolution (defaults to 1)

#### Defined in

[src/types/matcher.ts:1010](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1010)
