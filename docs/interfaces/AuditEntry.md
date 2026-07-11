[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AuditEntry

# Interface: AuditEntry

Audit trail entry for compliance

## Table of contents

### Properties

- [action](AuditEntry.md#action)
- [consumerId](AuditEntry.md#consumerid)
- [details](AuditEntry.md#details)
- [resourceId](AuditEntry.md#resourceid)
- [resourceType](AuditEntry.md#resourcetype)
- [timestamp](AuditEntry.md#timestamp)

## Properties

### action

• **action**: `string`

Type of action

#### Defined in

[src/types/matcher.ts:543](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L543)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:549](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L549)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L551)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:545](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L545)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L547)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:541](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L541)
