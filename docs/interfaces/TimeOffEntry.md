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

[src/scheduling/types.ts:200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L200)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

Optional shift-instance id (`<templateId>@<date>`); when set only that instance is blocked.

#### Defined in

[src/scheduling/types.ts:202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L202)
