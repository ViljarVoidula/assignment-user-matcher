[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowHost

# Interface: WorkflowHost

## Implemented by

- [`AssignmentMatcher`](../classes/AssignmentMatcher.md)

## Table of contents

### Methods

- [addAssignment](WorkflowHost.md#addassignment)
- [executeMachineTask](WorkflowHost.md#executemachinetask)
- [matchUsersAssignments](WorkflowHost.md#matchusersassignments)

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

[src/managers/WorkflowManager.ts:25](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/managers/WorkflowManager.ts#L25)

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

[src/managers/WorkflowManager.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/managers/WorkflowManager.ts#L27)

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

[src/managers/WorkflowManager.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/managers/WorkflowManager.ts#L26)
