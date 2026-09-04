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

[src/types/matcher.ts:1562](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1562)

___

### createdAt

• **createdAt**: `number`

Timestamps

#### Defined in

[src/types/matcher.ts:1576](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1576)

___

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Defined in

[src/types/matcher.ts:1558](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1558)

___

### currentStepId

• **currentStepId**: ``null`` \| `string`

Current step ID (null if completed or in parallel execution)

#### Defined in

[src/types/matcher.ts:1556](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1556)

___

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Defined in

[src/types/matcher.ts:1579](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1579)

___

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string`  }[]

History of completed steps with their results

#### Defined in

[src/types/matcher.ts:1564](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1564)

___

### id

• **id**: `string`

Unique identifier for this instance

#### Defined in

[src/types/matcher.ts:1548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1548)

___

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Defined in

[src/types/matcher.ts:1552](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1552)

___

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Defined in

[src/types/matcher.ts:1560](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1560)

___

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Defined in

[src/types/matcher.ts:1572](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1572)

___

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Defined in

[src/types/matcher.ts:1554](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1554)

___

### updatedAt

• **updatedAt**: `number`

#### Defined in

[src/types/matcher.ts:1577](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1577)

___

### version

• **version**: `number`

Version for optimistic locking

#### Defined in

[src/types/matcher.ts:1574](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1574)

___

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Defined in

[src/types/matcher.ts:1550](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1550)
