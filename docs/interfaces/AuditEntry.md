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

[src/types/matcher.ts:708](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L708)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:714](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L714)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:716](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L716)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:710](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L710)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:712](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L712)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:706](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L706)
