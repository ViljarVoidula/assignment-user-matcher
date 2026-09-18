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

[src/types/matcher.ts:1530](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1530)

___

### defaultNextStepId

• `Optional` **defaultNextStepId**: ``null`` \| `string`

Default next step if no routing condition matches (null = end workflow)

#### Defined in

[src/types/matcher.ts:1540](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1540)

___

### external

• `Optional` **external**: [`WorkflowExternalTask`](WorkflowExternalTask.md)

External (callback) task metadata used when taskType is 'external'

#### Defined in

[src/types/matcher.ts:1536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1536)

___

### failurePolicy

• `Optional` **failurePolicy**: ``"abort"`` \| ``"continue"`` \| ``"retry"``

Failure policy for parallel steps: 'abort' | 'continue' | 'retry'

#### Defined in

[src/types/matcher.ts:1546](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1546)

___

### id

• **id**: `string`

Unique identifier for this step within the workflow

#### Defined in

[src/types/matcher.ts:1524](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1524)

___

### machineTask

• `Optional` **machineTask**: [`WorkflowMachineTask`](WorkflowMachineTask.md)

Machine task metadata used for code/task worker execution

#### Defined in

[src/types/matcher.ts:1534](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1534)

___

### maxRetries

• `Optional` **maxRetries**: `number`

Maximum retries for this step (default: 0)

#### Defined in

[src/types/matcher.ts:1548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1548)

___

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:1526](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1526)

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

[src/types/matcher.ts:1561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1561)

___

### parallelStepIds

• `Optional` **parallelStepIds**: `string`[]

For parallel execution: IDs of steps to execute simultaneously

#### Defined in

[src/types/matcher.ts:1542](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1542)

___

### routing

• `Optional` **routing**: [`WorkflowRouting`](WorkflowRouting.md)[]

Routing rules for branching (evaluated in order, first match wins)

#### Defined in

[src/types/matcher.ts:1538](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1538)

___

### targetUser

• `Optional` **targetUser**: [`WorkflowTargetUser`](../modules.md#workflowtargetuser)

Target user selector: 'initiator' | 'previous' | specific userId | tag-based selector

#### Defined in

[src/types/matcher.ts:1532](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1532)

___

### taskType

• `Optional` **taskType**: [`WorkflowTaskType`](../modules.md#workflowtasktype)

Step execution mode (default: 'assignment')

#### Defined in

[src/types/matcher.ts:1528](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1528)

___

### timeoutMs

• `Optional` **timeoutMs**: `number`

Timeout override for this step in milliseconds

#### Defined in

[src/types/matcher.ts:1550](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1550)

___

### waitForAll

• `Optional` **waitForAll**: `boolean`

For parallel joins: wait for all parallel steps before continuing

#### Defined in

[src/types/matcher.ts:1544](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1544)
