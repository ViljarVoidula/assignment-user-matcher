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

[src/types/matcher.ts:1957](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1957)

___

### errorStack

• `Optional` **errorStack**: `string`

Error stack trace if available

#### Defined in

[src/types/matcher.ts:1959](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1959)

___

### event

• **event**: [`WorkflowEvent`](WorkflowEvent.md)

Original event that failed

#### Defined in

[src/types/matcher.ts:1953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1953)

___

### movedAt

• **movedAt**: `number`

Timestamp when moved to DLQ

#### Defined in

[src/types/matcher.ts:1961](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1961)

___

### reason

• **reason**: `string`

Reason the event failed

#### Defined in

[src/types/matcher.ts:1955](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1955)

___

### retryCount

• **retryCount**: `number`

Number of processing attempts before moving to DLQ

#### Defined in

[src/types/matcher.ts:1963](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L1963)
