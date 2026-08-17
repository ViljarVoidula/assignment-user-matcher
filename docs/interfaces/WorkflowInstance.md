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

[src/types/matcher.ts:1313](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1313)

---

### createdAt

• **createdAt**: `number`

Timestamps

#### Defined in

[src/types/matcher.ts:1327](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1327)

---

### currentAssignmentId

• `Optional` **currentAssignmentId**: `string`

Current assignment ID being processed

#### Defined in

[src/types/matcher.ts:1309](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1309)

---

### currentStepId

• **currentStepId**: `null` \| `string`

Current step ID (null if completed or in parallel execution)

#### Defined in

[src/types/matcher.ts:1307](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1307)

---

### definitionSnapshot

• `Optional` **definitionSnapshot**: [`WorkflowDefinition`](WorkflowDefinition.md)

Snapshot of the workflow definition at instance creation time (for versioning)

#### Defined in

[src/types/matcher.ts:1330](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1330)

---

### history

• **history**: \{ `assignmentId`: `string` ; `completedAt`: `number` ; `result?`: `Record`\<`string`, `any`\> ; `stepId`: `string` ; `userId`: `string` }[]

History of completed steps with their results

#### Defined in

[src/types/matcher.ts:1315](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1315)

---

### id

• **id**: `string`

Unique identifier for this instance

#### Defined in

[src/types/matcher.ts:1299](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1299)

---

### initiatorUserId

• **initiatorUserId**: `string`

The user who initiated this workflow

#### Defined in

[src/types/matcher.ts:1303](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1303)

---

### parallelBranches

• `Optional` **parallelBranches**: [`ParallelBranchState`](ParallelBranchState.md)[]

For parallel execution: track all active branches

#### Defined in

[src/types/matcher.ts:1311](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1311)

---

### retryCount

• **retryCount**: `number`

Retry count for current step

#### Defined in

[src/types/matcher.ts:1323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1323)

---

### status

• **status**: [`WorkflowInstanceStatus`](../modules.md#workflowinstancestatus)

Current status

#### Defined in

[src/types/matcher.ts:1305](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1305)

---

### updatedAt

• **updatedAt**: `number`

#### Defined in

[src/types/matcher.ts:1328](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1328)

---

### version

• **version**: `number`

Version for optimistic locking

#### Defined in

[src/types/matcher.ts:1325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1325)

---

### workflowDefinitionId

• **workflowDefinitionId**: `string`

Reference to the workflow definition

#### Defined in

[src/types/matcher.ts:1301](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1301)
