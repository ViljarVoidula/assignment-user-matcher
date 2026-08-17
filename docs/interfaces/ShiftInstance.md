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
- [weekday](ShiftInstance.md#weekday)
- [workingMinutes](ShiftInstance.md#workingminutes)

## Properties

### date

• **date**: `string`

ISO date the shift starts on.

#### Defined in

[src/scheduling/types.ts:783](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L783)

---

### durationMinutes

• **durationMinutes**: `number`

Elapsed duration in minutes, always positive.

#### Defined in

[src/scheduling/types.ts:789](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L789)

---

### duty

• `Optional` **duty**: [`DutyClassification`](DutyClassification.md)

#### Defined in

[src/scheduling/types.ts:807](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L807)

---

### endMinute

• **endMinute**: `number`

Minutes since period epoch when the shift ends; may exceed 24h for overnight shifts.

#### Defined in

[src/scheduling/types.ts:787](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L787)

---

### id

• **id**: `string`

Unique id: `<templateId>@<date>`.

#### Defined in

[src/scheduling/types.ts:779](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L779)

---

### isNightShift

• **isNightShift**: `boolean`

Whether it counts as a night shift under `NightWorkRule.qualifiesAfterMinutes`.

#### Defined in

[src/scheduling/types.ts:811](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L811)

---

### isPublicHoliday

• **isPublicHoliday**: `boolean`

#### Defined in

[src/scheduling/types.ts:815](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L815)

---

### isSunday

• **isSunday**: `boolean`

#### Defined in

[src/scheduling/types.ts:814](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L814)

---

### maxEmployees

• `Optional` **maxEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:802](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L802)

---

### minEmployees

• **minEmployees**: `number`

#### Defined in

[src/scheduling/types.ts:790](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L790)

---

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:781](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L781)

---

### nightMinutes

• **nightMinutes**: `number`

Minutes of this occurrence falling inside the configured night band.

#### Defined in

[src/scheduling/types.ts:809](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L809)

---

### paidBreakMinutes

• **paidBreakMinutes**: `number`

Paid break minutes declared by the template. Count as working time.

#### Defined in

[src/scheduling/types.ts:801](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L801)

---

### requiredTags

• **requiredTags**: `string`[]

#### Defined in

[src/scheduling/types.ts:804](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L804)

---

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:805](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L805)

---

### siteId

• `Optional` **siteId**: `string`

#### Defined in

[src/scheduling/types.ts:806](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L806)

---

### startMinute

• **startMinute**: `number`

Minutes since period epoch (midnight of `period.startDate`) when the shift starts.

#### Defined in

[src/scheduling/types.ts:785](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L785)

---

### tagMaximums

• **tagMaximums**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:803](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L803)

---

### tagRequirements

• **tagRequirements**: `Record`\<`string`, `number`\>

#### Defined in

[src/scheduling/types.ts:791](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L791)

---

### templateId

• **templateId**: `string`

#### Defined in

[src/scheduling/types.ts:780](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L780)

---

### weekday

• **weekday**: `number`

ISO weekday 1..7 of the start day.

#### Defined in

[src/scheduling/types.ts:813](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L813)

---

### workingMinutes

• **workingMinutes**: `number`

Minutes that count as working time — the span less unpaid breaks, scaled
by the duty classification. Hour budgets and rolling averages use this;
rest gaps use `startMinute`/`endMinute`, because a duty can occupy the
clock without counting as work.

#### Defined in

[src/scheduling/types.ts:799](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L799)
