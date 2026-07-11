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
- [metadata](WorkflowBuilder.md#metadata)
- [step](WorkflowBuilder.md#step)
- [version](WorkflowBuilder.md#version)
- [create](WorkflowBuilder.md#create)

## Methods

### \_addStep

▸ **_addStep**(`step`): `void`

Internal method to add a step from the step builder.

#### Parameters

| Name | Type |
| :------ | :------ |
| `step` | [`WorkflowStep`](../interfaces/WorkflowStep.md) |

#### Returns

`void`

#### Defined in

[src/workflow-builder.ts:262](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L262)

___

### addStep

▸ **addStep**(`step`): `this`

Add a pre-built step to the workflow.

#### Parameters

| Name | Type |
| :------ | :------ |
| `step` | [`WorkflowStep`](../interfaces/WorkflowStep.md) |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:254](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L254)

___

### build

▸ **build**(): [`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

Build and return the workflow definition.

#### Returns

[`WorkflowDefinition`](../interfaces/WorkflowDefinition.md)

**`Throws`**

Error if the workflow is invalid

#### Defined in

[src/workflow-builder.ts:278](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L278)

___

### defaultTimeout

▸ **defaultTimeout**(`ms`): `this`

Set the default timeout for all steps (in milliseconds).

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:238](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L238)

___

### initialStep

▸ **initialStep**(`stepId`): `this`

Set the initial (entry point) step ID.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stepId` | `string` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:269](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L269)

___

### metadata

▸ **metadata**(`metadata`): `this`

Set workflow metadata.

#### Parameters

| Name | Type |
| :------ | :------ |
| `metadata` | `Record`\<`string`, `any`\> |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:230](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L230)

___

### step

▸ **step**(`id`): [`WorkflowStepBuilder`](WorkflowStepBuilder.md)

Start building a new step.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Unique identifier for the step within this workflow |

#### Returns

[`WorkflowStepBuilder`](WorkflowStepBuilder.md)

#### Defined in

[src/workflow-builder.ts:247](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L247)

___

### version

▸ **version**(`version`): `this`

Set the workflow version.

#### Parameters

| Name | Type |
| :------ | :------ |
| `version` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L222)

___

### create

▸ **create**(`id`, `name`): [`WorkflowBuilder`](WorkflowBuilder.md)

Create a new workflow builder.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | Unique identifier for the workflow |
| `name` | `string` | Human-readable name |

#### Returns

[`WorkflowBuilder`](WorkflowBuilder.md)

#### Defined in

[src/workflow-builder.ts:215](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/workflow-builder.ts#L215)
