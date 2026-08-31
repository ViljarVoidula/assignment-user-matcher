[assignment-user-matcher](../README.md) / [Exports](../modules.md) / TimeOffEntry

# Interface: TimeOffEntry

Time-off as an explicit entry — date alone blocks the whole day; `shiftInstanceId` scopes it.

## Table of contents

### Properties

- [date](TimeOffEntry.md#date)
- [shiftInstanceId](TimeOffEntry.md#shiftinstanceid)

## Properties

### date

• **date**: `string`

ISO date, YYYY-MM-DD.

#### Defined in

[src/scheduling/types.ts:162](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L162)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

Optional shift-instance id (`<templateId>@<date>`); when set only that instance is blocked.

#### Defined in

[src/scheduling/types.ts:164](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L164)
