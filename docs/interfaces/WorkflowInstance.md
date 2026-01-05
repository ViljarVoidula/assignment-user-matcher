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

[src/types/matcher.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L175)

___

### createdAt

• **createdAt**: `number`

Timestamps

#### Defined in

[src/types/matcher.ts:189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L189)

___

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Defined in

[src/types/matcher.ts:171](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L171)

___

### currentStepId

• **currentStepId**: ``null`` \| `string`

Current step ID (null if completed or in parallel execution)

#### Defined in

[src/types/matcher.ts:169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L169)

___

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Defined in

[src/types/matcher.ts:192](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L192)

___

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string`  }[]

History of completed steps with their results

#### Defined in

[src/types/matcher.ts:177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L177)

___

### id

• **id**: `string`

Unique identifier for this instance

#### Defined in

[src/types/matcher.ts:161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L161)

___

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Defined in

[src/types/matcher.ts:165](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L165)

___

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Defined in

[src/types/matcher.ts:173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L173)

___

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Defined in

[src/types/matcher.ts:185](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L185)

___

### status

• **status**: `WorkflowInstanceStatus`

Current status

#### Defined in

[src/types/matcher.ts:167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L167)

___

### updatedAt

• **updatedAt**: `number`

#### Defined in

[src/types/matcher.ts:190](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L190)

___

### version

• **version**: `number`

Version for optimistic locking

#### Defined in

[src/types/matcher.ts:187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L187)

___

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Defined in

[src/types/matcher.ts:163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L163)
