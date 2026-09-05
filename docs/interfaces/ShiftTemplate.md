[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ShiftTemplate

# Interface: ShiftTemplate

A recurring or dated shift definition. Times are local time-of-day `HH:MM` or `HH:MM:SS`.

## Table of contents

### Properties

- [dates](ShiftTemplate.md#dates)
- [daysOfWeek](ShiftTemplate.md#daysofweek)
- [demandOverrides](ShiftTemplate.md#demandoverrides)
- [duty](ShiftTemplate.md#duty)
- [endTime](ShiftTemplate.md#endtime)
- [id](ShiftTemplate.md#id)
- [maxEmployees](ShiftTemplate.md#maxemployees)
- [minEmployees](ShiftTemplate.md#minemployees)
- [name](ShiftTemplate.md#name)
- [paidBreakMinutes](ShiftTemplate.md#paidbreakminutes)
- [requiredTags](ShiftTemplate.md#requiredtags)
- [shiftTypeTag](ShiftTemplate.md#shifttypetag)
- [siteId](ShiftTemplate.md#siteid)
- [startTime](ShiftTemplate.md#starttime)
- [tagMaximums](ShiftTemplate.md#tagmaximums)
- [tagRequirements](ShiftTemplate.md#tagrequirements)
- [unpaidBreakMinutes](ShiftTemplate.md#unpaidbreakminutes)

## Properties

### dates

• `Optional` **dates**: `string`[]

Inclusive ISO dates this template occurs on. Mutually exclusive with `daysOfWeek`.

#### Defined in

[src/scheduling/types.ts:623](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L623)

___

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

ISO weekdays 1 (Mon) .. 7 (Sun) within the scheduling period. Mutually exclusive with `dates`.

#### Defined in

[src/scheduling/types.ts:625](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L625)

___

### demandOverrides

• `Optional` **demandOverrides**: [`ShiftDemandOverride`](ShiftDemandOverride.md)[]

Temporary changes to the demand above, each bounded to a date range —
peak periods, closures, a stretch that needs a particular qualification.
See `ShiftDemandOverride` for how they combine.

#### Defined in

[src/scheduling/types.ts:642](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L642)

___

### duty

• `Optional` **duty**: [`DutyClassification`](DutyClassification.md)

How this duty counts as working time.

The engine never infers this. Whether stand-by counts is a fact-specific
legal test — on-premises stand-by counts in full even while asleep
(SIMAP, Jaeger), while off-premises stand-by turns on response time and
call-out frequency under an all-circumstances test the CJEU has
deliberately declined to reduce to a threshold (Matzak, C-344/19,
C-580/19). The caller classifies; the engine does the arithmetic.

#### Defined in

[src/scheduling/types.ts:669](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L669)

___

### endTime

• **endTime**: `string`

Time of day the shift ends; `endTime <= startTime` means it runs into the next day.

#### Defined in

[src/scheduling/types.ts:621](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L621)

___

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L616)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

Cap on assignees. Useful for supervision limits and to stop over-staffing.

#### Defined in

[src/scheduling/types.ts:632](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L632)

___

### minEmployees

• `Optional` **minEmployees**: `number`

Minimum employees that must be assigned to each occurrence. Defaults to 1.

#### Defined in

[src/scheduling/types.ts:627](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L627)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:617](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L617)

___

### paidBreakMinutes

• `Optional` **paidBreakMinutes**: `number`

Paid break minutes inside the span. They count as working time (no
deduction), and they are what discharges a `BreakRule` with `paid: true`.

#### Defined in

[src/scheduling/types.ts:658](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L658)

___

### requiredTags

• `Optional` **requiredTags**: `string`[]

Tags every assignee must hold, checked against date-valid qualifications.

#### Defined in

[src/scheduling/types.ts:636](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L636)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

Classification tag for sequence rules — `'night'`, `'early'`, `'late'`.
`ConsecutiveRule.forbiddenSuccessions` matches on this.

#### Defined in

[src/scheduling/types.ts:647](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L647)

___

### siteId

• `Optional` **siteId**: `string`

Site this shift is at, for multi-site rosters.

#### Defined in

[src/scheduling/types.ts:671](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L671)

___

### startTime

• **startTime**: `string`

Time of day the shift starts.

#### Defined in

[src/scheduling/types.ts:619](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L619)

___

### tagMaximums

• `Optional` **tagMaximums**: `Record`\<`string`, `number`\>

Per-tag maximums, e.g. at most 2 trainees on a shift.

#### Defined in

[src/scheduling/types.ts:634](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L634)

___

### tagRequirements

• `Optional` **tagRequirements**: `Record`\<`string`, `number`\>

Per-tag minimums: at least `count` assigned employees must carry the tag.

#### Defined in

[src/scheduling/types.ts:629](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L629)

___

### unpaidBreakMinutes

• `Optional` **unpaidBreakMinutes**: `number`

Unpaid break minutes inside the span. Working time is the span minus this,
which is why a 9h shift with a 45-minute unpaid break is 8h15 against an
hours budget — not 9h.

#### Defined in

[src/scheduling/types.ts:653](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L653)
