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

[src/types/matcher.ts:216](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L216)

___

### errorStack

• `Optional` **errorStack**: `string`

Error stack trace if available

#### Defined in

[src/types/matcher.ts:218](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L218)

___

### event

• **event**: [`WorkflowEvent`](WorkflowEvent.md)

Original event that failed

#### Defined in

[src/types/matcher.ts:212](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L212)

___

### movedAt

• **movedAt**: `number`

Timestamp when moved to DLQ

#### Defined in

[src/types/matcher.ts:220](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L220)

___

### reason

• **reason**: `string`

Reason the event failed

#### Defined in

[src/types/matcher.ts:214](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L214)

___

### retryCount

• **retryCount**: `number`

Number of processing attempts before moving to DLQ

#### Defined in

[src/types/matcher.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L222)
