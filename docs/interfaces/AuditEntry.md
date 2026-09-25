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

[src/types/matcher.ts:1971](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1971)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:1977](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1977)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:1979](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1979)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:1973](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1973)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:1975](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1975)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:1969](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1969)
