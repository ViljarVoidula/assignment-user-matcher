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

[src/types/matcher.ts:1569](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1569)

___

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:1575](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1575)

___

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:1577](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1577)

___

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:1571](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1571)

___

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:1573](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1573)

___

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:1567](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1567)
