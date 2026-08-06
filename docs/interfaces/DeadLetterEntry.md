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

[src/types/matcher.ts:1345](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1345)

___

### errorStack

• `Optional` **errorStack**: `string`

Error stack trace if available

#### Defined in

[src/types/matcher.ts:1347](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1347)

___

### event

• **event**: [`WorkflowEvent`](WorkflowEvent.md)

Original event that failed

#### Defined in

[src/types/matcher.ts:1341](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1341)

___

### movedAt

• **movedAt**: `number`

Timestamp when moved to DLQ

#### Defined in

[src/types/matcher.ts:1349](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1349)

___

### reason

• **reason**: `string`

Reason the event failed

#### Defined in

[src/types/matcher.ts:1343](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1343)

___

### retryCount

• **retryCount**: `number`

Number of processing attempts before moving to DLQ

#### Defined in

[src/types/matcher.ts:1351](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L1351)
