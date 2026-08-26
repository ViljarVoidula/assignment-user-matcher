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

[src/types/matcher.ts:1555](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1555)

___

### errorStack

• `Optional` **errorStack**: `string`

Error stack trace if available

#### Defined in

[src/types/matcher.ts:1557](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1557)

___

### event

• **event**: [`WorkflowEvent`](WorkflowEvent.md)

Original event that failed

#### Defined in

[src/types/matcher.ts:1551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1551)

___

### movedAt

• **movedAt**: `number`

Timestamp when moved to DLQ

#### Defined in

[src/types/matcher.ts:1559](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1559)

___

### reason

• **reason**: `string`

Reason the event failed

#### Defined in

[src/types/matcher.ts:1553](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1553)

___

### retryCount

• **retryCount**: `number`

Number of processing attempts before moving to DLQ

#### Defined in

[src/types/matcher.ts:1561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1561)
