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

[src/scheduling/types.ts:904](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L904)

___

### durationMinutes

• **durationMinutes**: `number`

Elapsed duration in minutes, always positive.

#### Defined in

[src/scheduling/types.ts:910](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L910)

___

### duty

• `Optional` **duty**: [`DutyClassification`](DutyClassification.md)

#### Defined in

[src/scheduling/types.ts:934](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L934)

___

### endMinute

• **endMinute**: `number`

Minutes since period epoch when the shift ends; may exceed 24h for overnight shifts.

#### Defined in

[src/scheduling/types.ts:908](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L908)

___

### id

• **id**: `string`

Unique id: `<templateId>@<date>`.

#### Defined in

[src/scheduling/types.ts:900](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L900)

___

### isNightShift

• **isNightShift**: `boolean`

Whether it counts as a night shift under `NightWorkRule.qualifiesAfterMinutes`.

#### Defined in

[src/scheduling/types.ts:938](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L938)

___

### isPublicHoliday

• **isPublicHoliday**: `boolean`

#### Defined in

[src/scheduling/types.ts:942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L942)

___

### isSunday

• **isSunday**: `boolean`

#### Defined in

[src/scheduling/types.ts:941](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L941)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:929](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L929)

___

### minEmployees

• **minEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:911](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L911)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:902](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L902)

___

### nightMinutes

• **nightMinutes**: `number`

Minutes of this occurrence falling inside the configured night band.

#### Defined in

[src/scheduling/types.ts:936](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L936)

___

### paidBreakMinutes

• **paidBreakMinutes**: `number`

Paid break minutes declared by the template. Count as working time.

#### Defined in

[src/scheduling/types.ts:922](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L922)

___

### requiredTags

• **requiredTags**: `string`[]

#### Defined in

[src/scheduling/types.ts:931](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L931)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:932](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L932)

___

### siteId

• `Optional` **siteId**: `string`

#### Defined in

[src/scheduling/types.ts:933](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L933)

___

### startMinute

• **startMinute**: `number`

Minutes since period epoch (midnight of `period.startDate`) when the shift starts.

#### Defined in

[src/scheduling/types.ts:906](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L906)

___

### tagMaximums

• **tagMaximums**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:930](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L930)

___

### tagRequirements

• **tagRequirements**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:912](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L912)

___

### templateId

• **templateId**: `string`

#### Defined in

[src/scheduling/types.ts:901](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L901)

___

### unpaidBreakMinutes

• **unpaidBreakMinutes**: `number`

Unpaid break minutes declared by the template. Break entitlements read
this rather than span − working: for a duty-scaled shift the difference
is duty occupation, not rest.

#### Defined in

[src/scheduling/types.ts:928](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L928)

___

### weekday

• **weekday**: `number`

ISO weekday 1..7 of the start day.

#### Defined in

[src/scheduling/types.ts:940](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L940)

___

### workingMinutes

• **workingMinutes**: `number`

Minutes that count as working time — the span less unpaid breaks, scaled
by the duty classification. Hour budgets and rolling averages use this;
rest gaps use `startMinute`/`endMinute`, because a duty can occupy the
clock without counting as work.

#### Defined in

[src/scheduling/types.ts:920](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L920)
