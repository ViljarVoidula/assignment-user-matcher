[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowStep

# Interface: WorkflowStep

A single step in a workflow definition

## Table of contents

### Properties

- [assignmentTemplate](WorkflowStep.md#assignmenttemplate)
- [defaultNextStepId](WorkflowStep.md#defaultnextstepid)
- [failurePolicy](WorkflowStep.md#failurepolicy)
- [id](WorkflowStep.md#id)
- [machineTask](WorkflowStep.md#machinetask)
- [maxRetries](WorkflowStep.md#maxretries)
- [name](WorkflowStep.md#name)
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

[src/types/matcher.ts:277](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L277)

---

### defaultNextStepId

• `Optional` **defaultNextStepId**: `null` \| `string`

Default next step if no routing condition matches (null = end workflow)

#### Defined in

[src/types/matcher.ts:285](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L285)

---

### failurePolicy

• `Optional` **failurePolicy**: `"abort"` \| `"continue"` \| `"retry"`

Failure policy for parallel steps: 'abort' | 'continue' | 'retry'

#### Defined in

[src/types/matcher.ts:291](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L291)

---

### id

• **id**: `string`

Unique identifier for this step within the workflow

#### Defined in

[src/types/matcher.ts:271](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L271)

---

### machineTask

• `Optional` **machineTask**: [`WorkflowMachineTask`](WorkflowMachineTask.md)

Machine task metadata used for code/task worker execution

#### Defined in

[src/types/matcher.ts:281](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L281)

---

### maxRetries

• `Optional` **maxRetries**: `number`

Maximum retries for this step (default: 0)

#### Defined in

[src/types/matcher.ts:293](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L293)

---

### name

• **name**: `string`

Human-readable name

#### Defined in

[src/types/matcher.ts:273](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L273)

---

### parallelStepIds

• `Optional` **parallelStepIds**: `string`[]

For parallel execution: IDs of steps to execute simultaneously

#### Defined in

[src/types/matcher.ts:287](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L287)

---

### routing

• `Optional` **routing**: [`WorkflowRouting`](WorkflowRouting.md)[]

Routing rules for branching (evaluated in order, first match wins)

#### Defined in

[src/types/matcher.ts:283](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L283)

---

### targetUser

• `Optional` **targetUser**: [`WorkflowTargetUser`](../modules.md#workflowtargetuser)

Target user selector: 'initiator' | 'previous' | specific userId | tag-based selector

#### Defined in

[src/types/matcher.ts:279](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L279)

---

### taskType

• `Optional` **taskType**: [`WorkflowTaskType`](../modules.md#workflowtasktype)

Step execution mode (default: 'assignment')

#### Defined in

[src/types/matcher.ts:275](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L275)

---

### timeoutMs

• `Optional` **timeoutMs**: `number`

Timeout override for this step in milliseconds

#### Defined in

[src/types/matcher.ts:295](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L295)

---

### waitForAll

• `Optional` **waitForAll**: `boolean`

For parallel joins: wait for all parallel steps before continuing

#### Defined in

[src/types/matcher.ts:289](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L289)
