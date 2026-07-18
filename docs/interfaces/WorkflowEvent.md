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

[src/types/matcher.ts:538](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L538)

___

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:535](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L535)

___

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:542](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L542)

___

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:540](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L540)

___

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:541](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L541)

___

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L536)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:537](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L537)

___

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:539](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L539)
