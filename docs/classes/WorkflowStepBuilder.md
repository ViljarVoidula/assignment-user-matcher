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
- [escalateTo](WorkflowStepBuilder.md#escalateto)
- [external](WorkflowStepBuilder.md#external)
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

[src/workflow-builder.ts:58](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L58)

## Methods

### \_getStep

▸ **_getStep**(): [`WorkflowStep`](../interfaces/WorkflowStep.md)

Get the built step (for internal use).

#### Returns

[`WorkflowStep`](../interfaces/WorkflowStep.md)

#### Defined in

[src/workflow-builder.ts:225](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L225)

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

[src/workflow-builder.ts:88](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L88)

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

[src/workflow-builder.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L139)

___

### done

▸ **done**(): [`WorkflowBuilder`](WorkflowBuilder.md)

Finish configuring this step and return to the parent builder.

#### Returns

[`WorkflowBuilder`](WorkflowBuilder.md)

#### Defined in

[src/workflow-builder.ts:209](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L209)

___

### escalateTo

▸ **escalateTo**(`stepId`): `this`

Advance to `stepId` when this step times out, instead of failing the run.

The classic escalation ladder — page the primary, and if nobody responds
within the timeout, move on to the secondary rather than giving up:

```typescript
.step('page-primary')
    .targetUser({ tag: 'oncall-primary' })
    .timeout(60_000)
    .escalateTo('page-secondary')
    .done()
```

Requires a timeout on this step or a workflow `defaultTimeout()`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `stepId` | `string` |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:201](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L201)

___

### external

▸ **external**(`name`, `input?`): `this`

Configure this step as an external (callback) task, completed by a
caller outside this process via completeWorkflowStep()/failWorkflowStep().
Requires a timeout — set here or via the workflow's defaultTimeout().

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `input?` | `Record`\<`string`, `any`\> |

#### Returns

`this`

#### Defined in

[src/workflow-builder.ts:107](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L107)

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

[src/workflow-builder.ts:164](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L164)

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

[src/workflow-builder.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L96)

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

[src/workflow-builder.ts:172](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L172)

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

[src/workflow-builder.ts:80](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L80)

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

[src/workflow-builder.ts:148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L148)

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

[src/workflow-builder.ts:127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L127)

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

[src/workflow-builder.ts:117](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L117)

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

[src/workflow-builder.ts:72](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L72)

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

[src/workflow-builder.ts:180](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L180)

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

[src/workflow-builder.ts:156](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/workflow-builder.ts#L156)
