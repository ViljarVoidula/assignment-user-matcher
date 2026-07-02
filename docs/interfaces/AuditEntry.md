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

[src/types/matcher.ts:388](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L388)

---

### consumerId

• **consumerId**: `string`

Consumer ID that processed the event

#### Defined in

[src/types/matcher.ts:394](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L394)

---

### details

• `Optional` **details**: `Record`\<`string`, `any`\>

Additional details

#### Defined in

[src/types/matcher.ts:396](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L396)

---

### resourceId

• **resourceId**: `string`

Resource ID (event ID, workflow instance ID, etc.)

#### Defined in

[src/types/matcher.ts:390](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L390)

---

### resourceType

• **resourceType**: `string`

Type of resource

#### Defined in

[src/types/matcher.ts:392](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L392)

---

### timestamp

• **timestamp**: `number`

Timestamp of the action

#### Defined in

[src/types/matcher.ts:386](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L386)
