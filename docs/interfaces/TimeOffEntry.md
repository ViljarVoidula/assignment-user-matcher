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

[src/scheduling/types.ts:158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L158)

---

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

Optional shift-instance id (`<templateId>@<date>`); when set only that instance is blocked.

#### Defined in

[src/scheduling/types.ts:160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L160)
