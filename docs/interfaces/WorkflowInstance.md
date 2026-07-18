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

[src/types/matcher.ts:653](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L653)

___

### createdAt

• **createdAt**: `number`

Timestamps

#### Defined in

[src/types/matcher.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L667)

___

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Defined in

[src/types/matcher.ts:649](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L649)

___

### currentStepId

• **currentStepId**: ``null`` \| `string`

Current step ID (null if completed or in parallel execution)

#### Defined in

[src/types/matcher.ts:647](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L647)

___

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Defined in

[src/types/matcher.ts:670](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L670)

___

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string`  }[]

History of completed steps with their results

#### Defined in

[src/types/matcher.ts:655](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L655)

___

### id

• **id**: `string`

Unique identifier for this instance

#### Defined in

[src/types/matcher.ts:639](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L639)

___

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Defined in

[src/types/matcher.ts:643](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L643)

___

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Defined in

[src/types/matcher.ts:651](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L651)

___

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Defined in

[src/types/matcher.ts:663](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L663)

___

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Defined in

[src/types/matcher.ts:645](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L645)

___

### updatedAt

• **updatedAt**: `number`

#### Defined in

[src/types/matcher.ts:668](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L668)

___

### version

• **version**: `number`

Version for optimistic locking

#### Defined in

[src/types/matcher.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L665)

___

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Defined in

[src/types/matcher.ts:641](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L641)
