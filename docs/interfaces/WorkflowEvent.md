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

[src/types/matcher.ts:1729](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1729)

___

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:1726](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1726)

___

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:1733](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1733)

___

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:1731](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1731)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1732](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1732)

___

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:1727](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1727)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1728](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1728)

___

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:1730](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1730)
