[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowInstance

# Interface: WorkflowInstance

A running instance of a workflow

## Hierarchy

- **`WorkflowInstance`**

  ↳ [`WorkflowInstanceWithSnapshot`](WorkflowInstanceWithSnapshot.md)

## Table of contents

### Properties

- [context](WorkflowInstance.md#context)
- [createdAt](WorkflowInstance.md#createdat)
- [currentAssignmentId](WorkflowInstance.md#currentassignmentid)
- [currentStepId](WorkflowInstance.md#currentstepid)
- [definitionSnapshot](WorkflowInstance.md#definitionsnapshot)
- [history](WorkflowInstance.md#history)
- [id](WorkflowInstance.md#id)
- [initiatorUserId](WorkflowInstance.md#initiatoruserid)
- [parallelBranches](WorkflowInstance.md#parallelbranches)
- [retryCount](WorkflowInstance.md#retrycount)
- [status](WorkflowInstance.md#status)
- [updatedAt](WorkflowInstance.md#updatedat)
- [version](WorkflowInstance.md#version)
- [workflowDefinitionId](WorkflowInstance.md#workflowdefinitionid)

## Properties

### context

• **context**: `Record`\<`string`, `any`\>

Persistent context passed between steps

#### Defined in

[src/types/matcher.ts:1693](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1693)

___

### createdAt

• **createdAt**: `number`

Timestamps

#### Defined in

[src/types/matcher.ts:1707](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1707)

___

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Defined in

[src/types/matcher.ts:1689](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1689)

___

### currentStepId

• **currentStepId**: ``null`` \| `string`

Current step ID (null if completed or in parallel execution)

#### Defined in

[src/types/matcher.ts:1687](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1687)

___

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Defined in

[src/types/matcher.ts:1710](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1710)

___

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string`  }[]

History of completed steps with their results

#### Defined in

[src/types/matcher.ts:1695](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1695)

___

### id

• **id**: `string`

Unique identifier for this instance

#### Defined in

[src/types/matcher.ts:1679](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1679)

___

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Defined in

[src/types/matcher.ts:1683](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1683)

___

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Defined in

[src/types/matcher.ts:1691](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1691)

___

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Defined in

[src/types/matcher.ts:1703](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1703)

___

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Defined in

[src/types/matcher.ts:1685](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1685)

___

### updatedAt

• **updatedAt**: `number`

#### Defined in

[src/types/matcher.ts:1708](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1708)

___

### version

• **version**: `number`

Version for optimistic locking

#### Defined in

[src/types/matcher.ts:1705](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1705)

___

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Defined in

[src/types/matcher.ts:1681](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1681)
