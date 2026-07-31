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

[src/types/matcher.ts:1121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1121)

___

### errorStack

• `Optional` **errorStack**: `string`

Error stack trace if available

#### Defined in

[src/types/matcher.ts:1123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1123)

___

### event

• **event**: [`WorkflowEvent`](WorkflowEvent.md)

Original event that failed

#### Defined in

[src/types/matcher.ts:1117](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1117)

___

### movedAt

• **movedAt**: `number`

Timestamp when moved to DLQ

#### Defined in

[src/types/matcher.ts:1125](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1125)

___

### reason

• **reason**: `string`

Reason the event failed

#### Defined in

[src/types/matcher.ts:1119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1119)

___

### retryCount

• **retryCount**: `number`

Number of processing attempts before moving to DLQ

#### Defined in

[src/types/matcher.ts:1127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L1127)
