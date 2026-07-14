[assignment-user-matcher](../README.md) / [Exports](../modules.md) / DeadLetterEntry

# Interface: DeadLetterEntry

Dead Letter Queue entry for failed events

## Table of contents

### Properties

- [errorMessage](DeadLetterEntry.md#errormessage)
- [errorStack](DeadLetterEntry.md#errorstack)
- [event](DeadLetterEntry.md#event)
- [movedAt](DeadLetterEntry.md#movedat)
- [reason](DeadLetterEntry.md#reason)
- [retryCount](DeadLetterEntry.md#retrycount)

## Properties

### errorMessage

• `Optional` **errorMessage**: `string`

Error message if available

#### Defined in

[src/types/matcher.ts:661](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L661)

---

### errorStack

• `Optional` **errorStack**: `string`

Error stack trace if available

#### Defined in

[src/types/matcher.ts:663](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L663)

---

### event

• **event**: [`WorkflowEvent`](WorkflowEvent.md)

Original event that failed

#### Defined in

[src/types/matcher.ts:657](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L657)

---

### movedAt

• **movedAt**: `number`

Timestamp when moved to DLQ

#### Defined in

[src/types/matcher.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L665)

---

### reason

• **reason**: `string`

Reason the event failed

#### Defined in

[src/types/matcher.ts:659](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L659)

---

### retryCount

• **retryCount**: `number`

Number of processing attempts before moving to DLQ

#### Defined in

[src/types/matcher.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L667)
