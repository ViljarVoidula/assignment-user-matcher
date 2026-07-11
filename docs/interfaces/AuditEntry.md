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

[src/types/matcher.ts:523](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L523)

---

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:529](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L529)

---

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:531](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L531)

---

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:525](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L525)

---

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:527](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L527)

---

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:521](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L521)
