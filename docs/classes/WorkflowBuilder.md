[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowBuilder

# Class: WorkflowBuilder

Builder for workflow definitions.

## Table of contents

### Methods

- [\_addStep](WorkflowBuilder.md#_addstep)
- [addStep](WorkflowBuilder.md#addstep)
- [build](WorkflowBuilder.md#build)
- [defaultTimeout](WorkflowBuilder.md#defaulttimeout)
- [initialStep](WorkflowBuilder.md#initialstep)
- [maxEscalationDepth](WorkflowBuilder.md#maxescalationdepth)
- [metadata](WorkflowBuilder.md#metadata)
- [step](WorkflowBuilder.md#step)
- [version](WorkflowBuilder.md#version)
- [create](WorkflowBuilder.md#create)

## Methods

### \_addStep

▸ **\_addStep**(`step`): `void`

Internal method to add a step from the step builder.

#### Parameters

| Name   | Type                                            |
| :----- | :---------------------------------------------- |
| `step` | [`WorkflowStep`](../interfaces/WorkflowStep.md) |

#### Returns

`void`

#### Defined in

[src/workflow-builder.ts:307](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L307)

---

### addStep

▸ **addStep**(`step`): `this`

Add a pre-built step to the workflow.

#### Parameters

| Name   | Type                                            |
| :----- | :---------------------------------------------- |
| `step` | [`WorkflowStep`](../interfaces/WorkflowStep.md) |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:299](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L299)

---

### build

▸ **build**(): [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

Build and return the workflow definition.

#### Returns

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

**`Throws`**

Error if the workflow is invalid

#### Defined in

[src/workflow-builder.ts:323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L323)

---

### defaultTimeout

▸ **defaultTimeout**(`ms`): `this`

Set the default timeout for all steps (in milliseconds).

#### Parameters

| Name | Type     |
| :--- | :------- |
| `ms` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L274)

---

### initialStep

▸ **initialStep**(`stepId`): `this`

Set the initial (entry point) step ID.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `stepId` | `string` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:314](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L314)

---

### maxEscalationDepth

▸ **maxEscalationDepth**(`depth`): `this`

Cap how many times one run may escalate through `escalateTo()` before
falling back to the ordinary failure path (default 10).

#### Parameters

| Name    | Type     |
| :------ | :------- |
| `depth` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:283](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L283)

---

### metadata

▸ **metadata**(`metadata`): `this`

Set workflow metadata.

#### Parameters

| Name       | Type                        |
| :--------- | :-------------------------- |
| `metadata` | `Record`\<`string`, `any`\> |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:266](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L266)

---

### step

▸ **step**(`id`): [`WorkflowStepBuilder`](WorkflowStepBuilder.md)

Start building a new step.

#### Parameters

| Name | Type     | Description                                         |
| :--- | :------- | :-------------------------------------------------- |
| `id` | `string` | Unique identifier for the step within this workflow |

#### Returns

[`WorkflowStepBuilder`](WorkflowStepBuilder.md)

#### Defined in

[src/workflow-builder.ts:292](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L292)

---

### version

▸ **version**(`version`): `this`

Set the workflow version.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `version` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:258](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L258)

---

### create

▸ **create**(`id`, `name`): [`WorkflowBuilder`](WorkflowBuilder.md)

Create a new workflow builder.

#### Parameters

| Name   | Type     | Description                        |
| :----- | :------- | :--------------------------------- |
| `id`   | `string` | Unique identifier for the workflow |
| `name` | `string` | Human-readable name                |

#### Returns

[`WorkflowBuilder`](WorkflowBuilder.md)

#### Defined in

[src/workflow-builder.ts:251](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/workflow-builder.ts#L251)
