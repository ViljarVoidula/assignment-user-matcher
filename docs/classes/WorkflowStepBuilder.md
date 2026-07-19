[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowStepBuilder

# Class: WorkflowStepBuilder

Builder for individual workflow steps.

## Table of contents

### Constructors

- [constructor](WorkflowStepBuilder.md#constructor)

### Methods

- [\_getStep](WorkflowStepBuilder.md#_getstep)
- [assignment](WorkflowStepBuilder.md#assignment)
- [defaultNext](WorkflowStepBuilder.md#defaultnext)
- [done](WorkflowStepBuilder.md#done)
- [failurePolicy](WorkflowStepBuilder.md#failurepolicy)
- [machineTask](WorkflowStepBuilder.md#machinetask)
- [maxRetries](WorkflowStepBuilder.md#maxretries)
- [name](WorkflowStepBuilder.md#name)
- [parallel](WorkflowStepBuilder.md#parallel)
- [route](WorkflowStepBuilder.md#route)
- [targetUser](WorkflowStepBuilder.md#targetuser)
- [taskType](WorkflowStepBuilder.md#tasktype)
- [timeout](WorkflowStepBuilder.md#timeout)
- [waitForAll](WorkflowStepBuilder.md#waitforall)

## Constructors

### constructor

• **new WorkflowStepBuilder**(`id`, `parentBuilder`): [`WorkflowStepBuilder`](WorkflowStepBuilder.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `parentBuilder` | [`WorkflowBuilder`](WorkflowBuilder.md) |

#### Returns

[`WorkflowStepBuilder`](WorkflowStepBuilder.md)

#### Defined in

[src/workflow-builder.ts:58](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L58)

## Methods

### \_getStep

▸ **_getStep**(): [`WorkflowStep`](../interfaces/WorkflowStep.md)

Get the built step (for internal use).

#### Returns

[`WorkflowStep`](../interfaces/WorkflowStep.md)

#### Defined in

[src/workflow-builder.ts:189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L189)

___

### assignment

▸ **assignment**(`template`): `this`

Set the assignment template for this step.

#### Parameters

| Name | Type |
| :------ | :------ |
| `template` | `Partial`\<[`Assignment`](../modules.md#assignment)\> |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:88](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L88)

___

### defaultNext

▸ **defaultNext**(`stepId`): `this`

Set the default next step if no routing conditions match.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stepId` | ``null`` \| `string` | Next step ID, or null to end workflow |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L128)

___

### done

▸ **done**(): [`WorkflowBuilder`](WorkflowBuilder.md)

Finish configuring this step and return to the parent builder.

#### Returns

[`WorkflowBuilder`](WorkflowBuilder.md)

#### Defined in

[src/workflow-builder.ts:177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L177)

___

### failurePolicy

▸ **failurePolicy**(`policy`): `this`

Set the failure policy for parallel execution.

#### Parameters

| Name | Type |
| :------ | :------ |
| `policy` | ``"abort"`` \| ``"continue"`` \| ``"retry"`` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L153)

___

### machineTask

▸ **machineTask**(`handler`, `input?`): `this`

Configure this step as a machine/code task.

#### Parameters

| Name | Type |
| :------ | :------ |
| `handler` | `string` |
| `input?` | `Record`\<`string`, `any`\> |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L96)

___

### maxRetries

▸ **maxRetries**(`count`): `this`

Set the maximum retry count for this step.

#### Parameters

| Name | Type |
| :------ | :------ |
| `count` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L161)

___

### name

▸ **name**(`name`): `this`

Set the step name.

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:80](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L80)

___

### parallel

▸ **parallel**(`stepIds`): `this`

Configure parallel execution with other steps.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stepIds` | `string`[] | Array of step IDs to execute in parallel with this step |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:137](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L137)

___

### route

▸ **route**(`condition`, `targetStepId`): `this`

Add a routing rule for conditional branching.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `condition` | `string` | Expression to evaluate (e.g., 'result.approved === true') |
| `targetStepId` | `string` | Step to go to if condition is true |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:116](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L116)

___

### targetUser

▸ **targetUser**(`target`): `this`

Set the target user for this step.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | [`WorkflowTargetUser`](../modules.md#workflowtargetuser) | 'initiator' \| 'previous' \| userId \| { tag: string } |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:106](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L106)

___

### taskType

▸ **taskType**(`type`): `this`

Set execution mode for this step.

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | [`WorkflowTaskType`](../modules.md#workflowtasktype) |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:72](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L72)

___

### timeout

▸ **timeout**(`ms`): `this`

Set a timeout for this step in milliseconds.

#### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L169)

___

### waitForAll

▸ **waitForAll**(`wait?`): `this`

Set whether to wait for all parallel branches before continuing.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `wait` | `boolean` | `true` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:145](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a243014d9767b8083172045261cc58852a94fd80/src/workflow-builder.ts#L145)
