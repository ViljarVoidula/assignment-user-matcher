[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowEvent

# Interface: WorkflowEvent

Event published to Redis Streams for workflow orchestration

## Table of contents

### Properties

- [assignmentId](WorkflowEvent.md#assignmentid)
- [eventId](WorkflowEvent.md#eventid)
- [payload](WorkflowEvent.md#payload)
- [stepId](WorkflowEvent.md#stepid)
- [timestamp](WorkflowEvent.md#timestamp)
- [type](WorkflowEvent.md#type)
- [userId](WorkflowEvent.md#userid)
- [workflowInstanceId](WorkflowEvent.md#workflowinstanceid)

## Properties

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:893](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L893)

___

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:890](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L890)

___

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:897](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L897)

___

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:895](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L895)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:896](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L896)

___

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:891](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L891)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:892](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L892)

___

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:894](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L894)
