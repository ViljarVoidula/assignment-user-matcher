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

[src/scheduling/types.ts:175](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L175)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

Optional shift-instance id (`<templateId>@<date>`); when set only that instance is blocked.

#### Defined in

[src/scheduling/types.ts:177](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L177)
