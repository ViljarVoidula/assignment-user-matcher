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

[src/types/matcher.ts:1359](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1359)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:1365](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1365)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:1367](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1367)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:1361](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1361)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:1363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1363)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:1357](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1357)
