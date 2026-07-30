[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowHost

# Interface: WorkflowHost

## Implemented by

- [`AssignmentMatcher`](../classes/AssignmentMatcher.md)

## Table of contents

### Methods

- [addAssignment](WorkflowHost.md#addassignment)
- [executeMachineTask](WorkflowHost.md#executemachinetask)
- [matchUsersAssignments](WorkflowHost.md#matchusersassignments)
- [removeAssignment](WorkflowHost.md#removeassignment)
- [userExists](WorkflowHost.md#userexists)

## Methods

### addAssignment

▸ **addAssignment**(`assignment`): `Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignment` | [`Assignment`](../modules.md#assignment) |

#### Returns

`Promise`\<[`Assignment`](../modules.md#assignment)\>

#### Defined in

[src/managers/WorkflowManager.ts:28](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/managers/WorkflowManager.ts#L28)

___

### executeMachineTask

▸ **executeMachineTask**(`args`): `Promise`\<`void` \| `Record`\<`string`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | `Object` |
| `args.definition` | [`WorkflowDefinition`](WorkflowDefinition.md) |
| `args.instance` | [`WorkflowInstance`](WorkflowInstance.md) |
| `args.step` | [`WorkflowStep`](WorkflowStep.md) |

#### Returns

`Promise`\<`void` \| `Record`\<`string`, `any`\>\>

#### Defined in

[src/managers/WorkflowManager.ts:30](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/managers/WorkflowManager.ts#L30)

___

### matchUsersAssignments

▸ **matchUsersAssignments**(`userId`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/managers/WorkflowManager.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/managers/WorkflowManager.ts#L29)

___

### removeAssignment

▸ **removeAssignment**(`assignmentId`): `Promise`\<`any`\>

Used by cancelWorkflow to clean up a run's outstanding queued/pending assignment. Skipped if unimplemented.

#### Parameters

| Name | Type |
| :------ | :------ |
| `assignmentId` | `string` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/managers/WorkflowManager.ts:38](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/managers/WorkflowManager.ts#L38)

___

### userExists

▸ **userExists**(`userId`): `Promise`\<`boolean`\>

Checked at run start when a step targets 'initiator' (the default target). Skipped if unimplemented.

#### Parameters

| Name | Type |
| :------ | :------ |
| `userId` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/managers/WorkflowManager.ts:36](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/managers/WorkflowManager.ts#L36)
