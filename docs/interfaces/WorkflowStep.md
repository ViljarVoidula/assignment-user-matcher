[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowStep

# Interface: WorkflowStep

A single step in a workflow definition

## Table of contents

### Properties

- [assignmentTemplate](WorkflowStep.md#assignmenttemplate)
- [defaultNextStepId](WorkflowStep.md#defaultnextstepid)
- [external](WorkflowStep.md#external)
- [failurePolicy](WorkflowStep.md#failurepolicy)
- [id](WorkflowStep.md#id)
- [machineTask](WorkflowStep.md#machinetask)
- [maxRetries](WorkflowStep.md#maxretries)
- [name](WorkflowStep.md#name)
- [onTimeoutStepId](WorkflowStep.md#ontimeoutstepid)
- [parallelStepIds](WorkflowStep.md#parallelstepids)
- [routing](WorkflowStep.md#routing)
- [targetUser](WorkflowStep.md#targetuser)
- [taskType](WorkflowStep.md#tasktype)
- [timeoutMs](WorkflowStep.md#timeoutms)
- [waitForAll](WorkflowStep.md#waitforall)

## Properties

### assignmentTemplate

• `Optional` **assignmentTemplate**: `Partial`\<[`Assignment`](../modules.md#assignment)\>

Assignment template - merged with workflow context when creating the assignment

#### Defined in

[src/types/matcher.ts:1141](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1141)

___

### defaultNextStepId

• `Optional` **defaultNextStepId**: ``null`` \| `string`

Default next step if no routing condition matches (null = end workflow)

#### Defined in

[src/types/matcher.ts:1151](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1151)

___

### external

• `Optional` **external**: [`WorkflowExternalTask`](WorkflowExternalTask.md)

External (callback) task metadata used when taskType is 'external'

#### Defined in

[src/types/matcher.ts:1147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1147)

___

### failurePolicy

• `Optional` **failurePolicy**: ``"abort"`` \| ``"continue"`` \| ``"retry"``

Failure policy for parallel steps: 'abort' | 'continue' | 'retry'

#### Defined in

[src/types/matcher.ts:1157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1157)

___

### id

• **id**: `string`

Unique identifier for this step within the workflow

#### Defined in

[src/types/matcher.ts:1135](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1135)

___

### machineTask

• `Optional` **machineTask**: [`WorkflowMachineTask`](WorkflowMachineTask.md)

Machine task metadata used for code/task worker execution

#### Defined in

[src/types/matcher.ts:1145](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1145)

___

### maxRetries

• `Optional` **maxRetries**: `number`

Maximum retries for this step (default: 0)

#### Defined in

[src/types/matcher.ts:1159](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1159)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1137](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1137)

___

### onTimeoutStepId

• `Optional` **onTimeoutStepId**: `string`

Step to advance to when this step's timeout expires, instead of the
default failure path. The step's outstanding assignment is removed (so a
late responder cannot act on a superseded tier) and the run continues at
`onTimeoutStepId` with `context._escalatedFrom` set.

Requires `timeoutMs` (or the workflow's `defaultTimeoutMs`). Does not
consume `maxRetries` — an escalation is not a retry. Not supported on
steps that are members of a parallel group.

#### Defined in

[src/types/matcher.ts:1172](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1172)

___

### parallelStepIds

• `Optional` **parallelStepIds**: `string`[]

For parallel execution: IDs of steps to execute simultaneously

#### Defined in

[src/types/matcher.ts:1153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1153)

___

### routing

• `Optional` **routing**: [`WorkflowRouting`](WorkflowRouting.md)[]

Routing rules for branching (evaluated in order, first match wins)

#### Defined in

[src/types/matcher.ts:1149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1149)

___

### targetUser

• `Optional` **targetUser**: [`WorkflowTargetUser`](../modules.md#workflowtargetuser)

Target user selector: 'initiator' | 'previous' | specific userId | tag-based selector

#### Defined in

[src/types/matcher.ts:1143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1143)

___

### taskType

• `Optional` **taskType**: [`WorkflowTaskType`](../modules.md#workflowtasktype)

Step execution mode (default: 'assignment')

#### Defined in

[src/types/matcher.ts:1139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1139)

___

### timeoutMs

• `Optional` **timeoutMs**: `number`

Timeout override for this step in milliseconds

#### Defined in

[src/types/matcher.ts:1161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1161)

___

### waitForAll

• `Optional` **waitForAll**: `boolean`

For parallel joins: wait for all parallel steps before continuing

#### Defined in

[src/types/matcher.ts:1155](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1155)
