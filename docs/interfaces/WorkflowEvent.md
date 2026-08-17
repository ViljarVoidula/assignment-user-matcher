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

[src/types/matcher.ts:1126](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1126)

---

### eventId

• **eventId**: `string`

#### Defined in

[src/types/matcher.ts:1123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1123)

---

### payload

• `Optional` **payload**: `Record`\<`string`, `any`\>

#### Defined in

[src/types/matcher.ts:1130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1130)

---

### stepId

• `Optional` **stepId**: `string`

#### Defined in

[src/types/matcher.ts:1128](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1128)

---

### timestamp

• **timestamp**: `number`

#### Defined in

[src/types/matcher.ts:1129](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1129)

---

### type

• **type**: [`WorkflowEventType`](../modules.md#workfloweventtype)

#### Defined in

[src/types/matcher.ts:1124](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1124)

---

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:1125](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1125)

---

### workflowInstanceId

• `Optional` **workflowInstanceId**: `string`

#### Defined in

[src/types/matcher.ts:1127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L1127)
