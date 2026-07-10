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

[src/types/matcher.ts:368](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L368)

---

### createdAt

• **createdAt**: `number`

Timestamps

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[createdAt](WorkflowInstance.md#createdat)

#### Defined in

[src/types/matcher.ts:382](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L382)

---

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[currentAssignmentId](WorkflowInstance.md#currentassignmentid)

#### Defined in

[src/types/matcher.ts:364](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L364)

---

### currentStepId

• **currentStepId**: `null` \| `string`

Current step ID (null if completed or in parallel execution)

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[currentStepId](WorkflowInstance.md#currentstepid)

#### Defined in

[src/types/matcher.ts:362](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L362)

---

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[definitionSnapshot](WorkflowInstance.md#definitionsnapshot)

#### Defined in

[src/types/matcher.ts:385](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L385)

---

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string` }[]

History of completed steps with their results

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[history](WorkflowInstance.md#history)

#### Defined in

[src/types/matcher.ts:370](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L370)

---

### id

• **id**: `string`

Unique identifier for this instance

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[id](WorkflowInstance.md#id)

#### Defined in

[src/types/matcher.ts:354](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L354)

---

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[initiatorUserId](WorkflowInstance.md#initiatoruserid)

#### Defined in

[src/types/matcher.ts:358](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L358)

---

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[parallelBranches](WorkflowInstance.md#parallelbranches)

#### Defined in

[src/types/matcher.ts:366](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L366)

---

### resolvedDefinition

• `Optional` **resolvedDefinition**: [`WorkflowDefinition`](WorkflowDefinition.md)

Resolved definition (from snapshot or registry)

#### Defined in

[src/types/matcher.ts:467](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L467)

---

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[retryCount](WorkflowInstance.md#retrycount)

#### Defined in

[src/types/matcher.ts:378](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L378)

---

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[status](WorkflowInstance.md#status)

#### Defined in

[src/types/matcher.ts:360](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L360)

---

### updatedAt

• **updatedAt**: `number`

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[updatedAt](WorkflowInstance.md#updatedat)

#### Defined in

[src/types/matcher.ts:383](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L383)

---

### version

• **version**: `number`

Version for optimistic locking

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[version](WorkflowInstance.md#version)

#### Defined in

[src/types/matcher.ts:380](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L380)

---

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Inherited from

[WorkflowInstance](WorkflowInstance.md).[workflowDefinitionId](WorkflowInstance.md#workflowdefinitionid)

#### Defined in

[src/types/matcher.ts:356](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L356)
