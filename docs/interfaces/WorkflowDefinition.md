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

[src/types/matcher.ts:1197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1197)

---

### id

• **id**: `string`

Unique identifier for this workflow definition

#### Defined in

[src/types/matcher.ts:1187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1187)

---

### initialStepId

• **initialStepId**: `string`

The entry point step ID

#### Defined in

[src/types/matcher.ts:1193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1193)

---

### maxEscalationDepth

• `Optional` **maxEscalationDepth**: `number`

Safety net for `onTimeoutStepId` ladders: once a run has escalated this
many times it falls back to the ordinary failure path instead of
climbing further, so a mis-wired cycle still terminates.

**`Default`**

```ts
10;
```

#### Defined in

[src/types/matcher.ts:1204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1204)

---

### metadata

• `Optional` **metadata**: `Record`\<`string`, `any`\>

Metadata for the workflow

#### Defined in

[src/types/matcher.ts:1206](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1206)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1189)

---

### steps

• **steps**: [`WorkflowStep`](WorkflowStep.md)[]

All steps in this workflow

#### Defined in

[src/types/matcher.ts:1195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1195)

---

### version

• **version**: `number`

Version for schema evolution

#### Defined in

[src/types/matcher.ts:1191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1191)
