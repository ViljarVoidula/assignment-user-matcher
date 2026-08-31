[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ShiftInstance

# Interface: ShiftInstance

One expanded, dated occurrence of a shift template.

## Table of contents

### Properties

- [date](ShiftInstance.md#date)
- [durationMinutes](ShiftInstance.md#durationminutes)
- [duty](ShiftInstance.md#duty)
- [endMinute](ShiftInstance.md#endminute)
- [id](ShiftInstance.md#id)
- [isNightShift](ShiftInstance.md#isnightshift)
- [isPublicHoliday](ShiftInstance.md#ispublicholiday)
- [isSunday](ShiftInstance.md#issunday)
- [maxEmployees](ShiftInstance.md#maxemployees)
- [minEmployees](ShiftInstance.md#minemployees)
- [name](ShiftInstance.md#name)
- [nightMinutes](ShiftInstance.md#nightminutes)
- [paidBreakMinutes](ShiftInstance.md#paidbreakminutes)
- [requiredTags](ShiftInstance.md#requiredtags)
- [shiftTypeTag](ShiftInstance.md#shifttypetag)
- [siteId](ShiftInstance.md#siteid)
- [startMinute](ShiftInstance.md#startminute)
- [tagMaximums](ShiftInstance.md#tagmaximums)
- [tagRequirements](ShiftInstance.md#tagrequirements)
- [templateId](ShiftInstance.md#templateid)
- [unpaidBreakMinutes](ShiftInstance.md#unpaidbreakminutes)
- [weekday](ShiftInstance.md#weekday)
- [workingMinutes](ShiftInstance.md#workingminutes)

## Properties

### date

• **date**: `string`

ISO date the shift starts on.

#### Defined in

[src/scheduling/types.ts:818](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L818)

___

### durationMinutes

• **durationMinutes**: `number`

Elapsed duration in minutes, always positive.

#### Defined in

[src/scheduling/types.ts:824](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L824)

___

### duty

• `Optional` **duty**: [`DutyClassification`](DutyClassification.md)

#### Defined in

[src/scheduling/types.ts:848](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L848)

___

### endMinute

• **endMinute**: `number`

Minutes since period epoch when the shift ends; may exceed 24h for overnight shifts.

#### Defined in

[src/scheduling/types.ts:822](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L822)

___

### id

• **id**: `string`

Unique id: `<templateId>@<date>`.

#### Defined in

[src/scheduling/types.ts:814](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L814)

___

### isNightShift

• **isNightShift**: `boolean`

Whether it counts as a night shift under `NightWorkRule.qualifiesAfterMinutes`.

#### Defined in

[src/scheduling/types.ts:852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L852)

___

### isPublicHoliday

• **isPublicHoliday**: `boolean`

#### Defined in

[src/scheduling/types.ts:856](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L856)

___

### isSunday

• **isSunday**: `boolean`

#### Defined in

[src/scheduling/types.ts:855](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L855)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L843)

___

### minEmployees

• **minEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:825](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L825)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:816](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L816)

___

### nightMinutes

• **nightMinutes**: `number`

Minutes of this occurrence falling inside the configured night band.

#### Defined in

[src/scheduling/types.ts:850](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L850)

___

### paidBreakMinutes

• **paidBreakMinutes**: `number`

Paid break minutes declared by the template. Count as working time.

#### Defined in

[src/scheduling/types.ts:836](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L836)

___

### requiredTags

• **requiredTags**: `string`[]

#### Defined in

[src/scheduling/types.ts:845](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L845)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:846](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L846)

___

### siteId

• `Optional` **siteId**: `string`

#### Defined in

[src/scheduling/types.ts:847](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L847)

___

### startMinute

• **startMinute**: `number`

Minutes since period epoch (midnight of `period.startDate`) when the shift starts.

#### Defined in

[src/scheduling/types.ts:820](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L820)

___

### tagMaximums

• **tagMaximums**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:844](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L844)

___

### tagRequirements

• **tagRequirements**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:826](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L826)

___

### templateId

• **templateId**: `string`

#### Defined in

[src/scheduling/types.ts:815](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L815)

___

### unpaidBreakMinutes

• **unpaidBreakMinutes**: `number`

Unpaid break minutes declared by the template. Break entitlements read
this rather than span − working: for a duty-scaled shift the difference
is duty occupation, not rest.

#### Defined in

[src/scheduling/types.ts:842](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L842)

___

### weekday

• **weekday**: `number`

ISO weekday 1..7 of the start day.

#### Defined in

[src/scheduling/types.ts:854](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L854)

___

### workingMinutes

• **workingMinutes**: `number`

Minutes that count as working time — the span less unpaid breaks, scaled
by the duty classification. Hour budgets and rolling averages use this;
rest gaps use `startMinute`/`endMinute`, because a duty can occupy the
clock without counting as work.

#### Defined in

[src/scheduling/types.ts:834](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L834)
