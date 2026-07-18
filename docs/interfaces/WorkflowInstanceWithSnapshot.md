[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowInstanceWithSnapshot

# Interface: WorkflowInstanceWithSnapshot

Workflow instance with resolved definition for versioning

## Hierarchy

- [`WorkflowInstance`](WorkflowInstance.md)

  ↳ **`WorkflowInstanceWithSnapshot`**

## Table of contents

### Properties

- [context](WorkflowInstanceWithSnapshot.md#context)
- [createdAt](WorkflowInstanceWithSnapshot.md#createdat)
- [currentAssignmentId](WorkflowInstanceWithSnapshot.md#currentassignmentid)
- [currentStepId](WorkflowInstanceWithSnapshot.md#currentstepid)
- [definitionSnapshot](WorkflowInstanceWithSnapshot.md#definitionsnapshot)
- [history](WorkflowInstanceWithSnapshot.md#history)
- [id](WorkflowInstanceWithSnapshot.md#id)
- [initiatorUserId](WorkflowInstanceWithSnapshot.md#initiatoruserid)
- [parallelBranches](WorkflowInstanceWithSnapshot.md#parallelbranches)
- [resolvedDefinition](WorkflowInstanceWithSnapshot.md#resolveddefinition)
- [retryCount](WorkflowInstanceWithSnapshot.md#retrycount)
- [status](WorkflowInstanceWithSnapshot.md#status)
- [updatedAt](WorkflowInstanceWithSnapshot.md#updatedat)
- [version](WorkflowInstanceWithSnapshot.md#version)
- [workflowDefinitionId](WorkflowInstanceWithSnapshot.md#workflowdefinitionid)

## Properties

### context

• **context**: `Record`\<`string`, `any`\>

Persistent context passed between steps

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[context](WorkflowInstance.md#context)

#### Defined in

[src/types/matcher.ts:653](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L653)

___

### createdAt

• **createdAt**: `number`

Timestamps

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[createdAt](WorkflowInstance.md#createdat)

#### Defined in

[src/types/matcher.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L667)

___

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[currentAssignmentId](WorkflowInstance.md#currentassignmentid)

#### Defined in

[src/types/matcher.ts:649](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L649)

___

### currentStepId

• **currentStepId**: ``null`` \| `string`

Current step ID (null if completed or in parallel execution)

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[currentStepId](WorkflowInstance.md#currentstepid)

#### Defined in

[src/types/matcher.ts:647](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L647)

___

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[definitionSnapshot](WorkflowInstance.md#definitionsnapshot)

#### Defined in

[src/types/matcher.ts:670](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L670)

___

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string`  }[]

History of completed steps with their results

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[history](WorkflowInstance.md#history)

#### Defined in

[src/types/matcher.ts:655](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L655)

___

### id

• **id**: `string`

Unique identifier for this instance

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[id](WorkflowInstance.md#id)

#### Defined in

[src/types/matcher.ts:639](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L639)

___

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[initiatorUserId](WorkflowInstance.md#initiatoruserid)

#### Defined in

[src/types/matcher.ts:643](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L643)

___

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[parallelBranches](WorkflowInstance.md#parallelbranches)

#### Defined in

[src/types/matcher.ts:651](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L651)

___

### resolvedDefinition

• `Optional` **resolvedDefinition**: [`WorkflowDefinition`](WorkflowDefinition.md)

Resolved definition (from snapshot or registry)

#### Defined in

[src/types/matcher.ts:752](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L752)

___

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[retryCount](WorkflowInstance.md#retrycount)

#### Defined in

[src/types/matcher.ts:663](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L663)

___

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[status](WorkflowInstance.md#status)

#### Defined in

[src/types/matcher.ts:645](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L645)

___

### updatedAt

• **updatedAt**: `number`

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[updatedAt](WorkflowInstance.md#updatedat)

#### Defined in

[src/types/matcher.ts:668](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L668)

___

### version

• **version**: `number`

Version for optimistic locking

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[version](WorkflowInstance.md#version)

#### Defined in

[src/types/matcher.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L665)

___

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[workflowDefinitionId](WorkflowInstance.md#workflowdefinitionid)

#### Defined in

[src/types/matcher.ts:641](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L641)
