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

[src/types/matcher.ts:218](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L218)

___

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:215](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L215)

___

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L222)

___

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:220](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L220)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:221](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L221)

___

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:216](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L216)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:217](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L217)

___

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:219](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L219)
