[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ShiftInstance

# Interface: ShiftInstance

One expanded, dated occurrence of a shift template.

## Table of contents

### Properties

- [date](ShiftInstance.md#date)
- [demandLabel](ShiftInstance.md#demandlabel)
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
- [tagRatios](ShiftInstance.md#tagratios)
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

[src/scheduling/types.ts:1150](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1150)

___

### demandLabel

• `Optional` **demandLabel**: `string`

The label of the last labelled `ShiftDemandOverride` that shaped this
occurrence, so a grid can say *why* Tuesday needs three when the template
says one. Absent when no override touched it.

#### Defined in

[src/scheduling/types.ts:1166](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1166)

___

### durationMinutes

• **durationMinutes**: `number`

Elapsed duration in minutes, always positive.

#### Defined in

[src/scheduling/types.ts:1156](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1156)

___

### duty

• `Optional` **duty**: [`DutyClassification`](DutyClassification.md)

#### Defined in

[src/scheduling/types.ts:1188](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1188)

___

### endMinute

• **endMinute**: `number`

Minutes since period epoch when the shift ends; may exceed 24h for overnight shifts.

#### Defined in

[src/scheduling/types.ts:1154](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1154)

___

### id

• **id**: `string`

Unique id: `<templateId>@<date>`.

#### Defined in

[src/scheduling/types.ts:1146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1146)

___

### isNightShift

• **isNightShift**: `boolean`

Whether it counts as a night shift under `NightWorkRule.qualifiesAfterMinutes`.

#### Defined in

[src/scheduling/types.ts:1192](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1192)

___

### isPublicHoliday

• **isPublicHoliday**: `boolean`

#### Defined in

[src/scheduling/types.ts:1196](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1196)

___

### isSunday

• **isSunday**: `boolean`

#### Defined in

[src/scheduling/types.ts:1195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1195)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:1183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1183)

___

### minEmployees

• **minEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:1157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1157)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:1148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1148)

___

### nightMinutes

• **nightMinutes**: `number`

Minutes of this occurrence falling inside the configured night band.

#### Defined in

[src/scheduling/types.ts:1190](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1190)

___

### paidBreakMinutes

• **paidBreakMinutes**: `number`

Paid break minutes declared by the template. Count as working time.

#### Defined in

[src/scheduling/types.ts:1176](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1176)

___

### requiredTags

• **requiredTags**: `string`[]

#### Defined in

[src/scheduling/types.ts:1185](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1185)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:1186](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1186)

___

### siteId

• `Optional` **siteId**: `string`

#### Defined in

[src/scheduling/types.ts:1187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1187)

___

### startMinute

• **startMinute**: `number`

Minutes since period epoch (midnight of `period.startDate`) when the shift starts.

#### Defined in

[src/scheduling/types.ts:1152](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1152)

___

### tagMaximums

• **tagMaximums**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:1184](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1184)

___

### tagRatios

• **tagRatios**: `Record`\<`string`, `number`\>

Per-tag proportions of the assigned team, 0 to 1. Empty when none apply.

#### Defined in

[src/scheduling/types.ts:1160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1160)

___

### tagRequirements

• **tagRequirements**: `Record`\<`string`, [`TagRequirement`](TagRequirement.md)\>

#### Defined in

[src/scheduling/types.ts:1158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1158)

___

### templateId

• **templateId**: `string`

#### Defined in

[src/scheduling/types.ts:1147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1147)

___

### unpaidBreakMinutes

• **unpaidBreakMinutes**: `number`

Unpaid break minutes declared by the template. Break entitlements read
this rather than span − working: for a duty-scaled shift the difference
is duty occupation, not rest.

#### Defined in

[src/scheduling/types.ts:1182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1182)

___

### weekday

• **weekday**: `number`

ISO weekday 1..7 of the start day.

#### Defined in

[src/scheduling/types.ts:1194](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1194)

___

### workingMinutes

• **workingMinutes**: `number`

Minutes that count as working time — the span less unpaid breaks, scaled
by the duty classification. Hour budgets and rolling averages use this;
rest gaps use `startMinute`/`endMinute`, because a duty can occupy the
clock without counting as work.

#### Defined in

[src/scheduling/types.ts:1174](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1174)
