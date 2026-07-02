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

[src/types/matcher.ts:333](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L333)

---

### createdAt

• **createdAt**: `number`

Timestamps

#### Defined in

[src/types/matcher.ts:347](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L347)

---

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Defined in

[src/types/matcher.ts:329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L329)

---

### currentStepId

• **currentStepId**: `null` \| `string`

Current step ID (null if completed or in parallel execution)

#### Defined in

[src/types/matcher.ts:327](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L327)

---

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Defined in

[src/types/matcher.ts:350](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L350)

---

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string` }[]

History of completed steps with their results

#### Defined in

[src/types/matcher.ts:335](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L335)

---

### id

• **id**: `string`

Unique identifier for this instance

#### Defined in

[src/types/matcher.ts:319](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L319)

---

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Defined in

[src/types/matcher.ts:323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L323)

---

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Defined in

[src/types/matcher.ts:331](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L331)

---

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Defined in

[src/types/matcher.ts:343](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L343)

---

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Defined in

[src/types/matcher.ts:325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L325)

---

### updatedAt

• **updatedAt**: `number`

#### Defined in

[src/types/matcher.ts:348](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L348)

---

### version

• **version**: `number`

Version for optimistic locking

#### Defined in

[src/types/matcher.ts:345](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L345)

---

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Defined in

[src/types/matcher.ts:321](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L321)
