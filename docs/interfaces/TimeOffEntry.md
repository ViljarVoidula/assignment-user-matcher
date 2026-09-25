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

[src/scheduling/types.ts:220](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L220)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

Optional shift-instance id (`<templateId>@<date>`); when set only that instance is blocked.

#### Defined in

[src/scheduling/types.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L222)
