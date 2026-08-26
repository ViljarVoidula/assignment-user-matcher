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

[src/types/matcher.ts:1327](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1327)

___

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:1324](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1324)

___

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:1331](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1331)

___

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:1329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1329)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1330](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1330)

___

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:1325](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1325)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1326](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1326)

___

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:1328](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1328)
