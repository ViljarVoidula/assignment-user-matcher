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

[src/types/matcher.ts:98](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L98)

___

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:95](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L95)

___

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:102](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L102)

___

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:100](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L100)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:101](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L101)

___

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L96)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:97](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L97)

___

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:99](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L99)
