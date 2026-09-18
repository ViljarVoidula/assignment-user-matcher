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

[src/scheduling/types.ts:1079](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1079)

___

### demandLabel

• `Optional` **demandLabel**: `string`

The label of the last labelled `ShiftDemandOverride` that shaped this
occurrence, so a grid can say *why* Tuesday needs three when the template
says one. Absent when no override touched it.

#### Defined in

[src/scheduling/types.ts:1095](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1095)

___

### durationMinutes

• **durationMinutes**: `number`

Elapsed duration in minutes, always positive.

#### Defined in

[src/scheduling/types.ts:1085](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1085)

___

### duty

• `Optional` **duty**: [`DutyClassification`](DutyClassification.md)

#### Defined in

[src/scheduling/types.ts:1117](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1117)

___

### endMinute

• **endMinute**: `number`

Minutes since period epoch when the shift ends; may exceed 24h for overnight shifts.

#### Defined in

[src/scheduling/types.ts:1083](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1083)

___

### id

• **id**: `string`

Unique id: `<templateId>@<date>`.

#### Defined in

[src/scheduling/types.ts:1075](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1075)

___

### isNightShift

• **isNightShift**: `boolean`

Whether it counts as a night shift under `NightWorkRule.qualifiesAfterMinutes`.

#### Defined in

[src/scheduling/types.ts:1121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1121)

___

### isPublicHoliday

• **isPublicHoliday**: `boolean`

#### Defined in

[src/scheduling/types.ts:1125](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1125)

___

### isSunday

• **isSunday**: `boolean`

#### Defined in

[src/scheduling/types.ts:1124](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1124)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:1112](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1112)

___

### minEmployees

• **minEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:1086](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1086)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:1077](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1077)

___

### nightMinutes

• **nightMinutes**: `number`

Minutes of this occurrence falling inside the configured night band.

#### Defined in

[src/scheduling/types.ts:1119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1119)

___

### paidBreakMinutes

• **paidBreakMinutes**: `number`

Paid break minutes declared by the template. Count as working time.

#### Defined in

[src/scheduling/types.ts:1105](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1105)

___

### requiredTags

• **requiredTags**: `string`[]

#### Defined in

[src/scheduling/types.ts:1114](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1114)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:1115](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1115)

___

### siteId

• `Optional` **siteId**: `string`

#### Defined in

[src/scheduling/types.ts:1116](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1116)

___

### startMinute

• **startMinute**: `number`

Minutes since period epoch (midnight of `period.startDate`) when the shift starts.

#### Defined in

[src/scheduling/types.ts:1081](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1081)

___

### tagMaximums

• **tagMaximums**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:1113](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1113)

___

### tagRatios

• **tagRatios**: `Record`\<`string`, `number`\>

Per-tag proportions of the assigned team, 0 to 1. Empty when none apply.

#### Defined in

[src/scheduling/types.ts:1089](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1089)

___

### tagRequirements

• **tagRequirements**: `Record`\<`string`, [`TagRequirement`](TagRequirement.md)\>

#### Defined in

[src/scheduling/types.ts:1087](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1087)

___

### templateId

• **templateId**: `string`

#### Defined in

[src/scheduling/types.ts:1076](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1076)

___

### unpaidBreakMinutes

• **unpaidBreakMinutes**: `number`

Unpaid break minutes declared by the template. Break entitlements read
this rather than span − working: for a duty-scaled shift the difference
is duty occupation, not rest.

#### Defined in

[src/scheduling/types.ts:1111](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1111)

___

### weekday

• **weekday**: `number`

ISO weekday 1..7 of the start day.

#### Defined in

[src/scheduling/types.ts:1123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1123)

___

### workingMinutes

• **workingMinutes**: `number`

Minutes that count as working time — the span less unpaid breaks, scaled
by the duty classification. Hour budgets and rolling averages use this;
rest gaps use `startMinute`/`endMinute`, because a duty can occupy the
clock without counting as work.

#### Defined in

[src/scheduling/types.ts:1103](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1103)
