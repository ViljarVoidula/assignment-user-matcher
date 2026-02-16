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

[src/types/matcher.ts:249](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L249)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:255](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L255)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:257](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L257)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:251](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L251)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:253](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L253)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:247](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L247)
