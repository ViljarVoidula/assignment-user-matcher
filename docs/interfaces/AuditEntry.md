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

[src/types/matcher.ts:1135](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1135)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:1141](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1141)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:1143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1143)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:1137](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1137)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:1139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1139)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:1133](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1133)
