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
- [tagRatios](ShiftTemplate.md#tagratios)
- [tagRequirements](ShiftTemplate.md#tagrequirements)
- [unpaidBreakMinutes](ShiftTemplate.md#unpaidbreakminutes)

## Properties

### dates

• `Optional` **dates**: `string`[]

Inclusive ISO dates this template occurs on. Mutually exclusive with `daysOfWeek`.

#### Defined in

[src/scheduling/types.ts:724](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L724)

___

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

ISO weekdays 1 (Mon) .. 7 (Sun) within the scheduling period. Mutually exclusive with `dates`.

#### Defined in

[src/scheduling/types.ts:726](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L726)

___

### demandOverrides

• `Optional` **demandOverrides**: [`ShiftDemandOverride`](ShiftDemandOverride.md)[]

Temporary changes to the demand above, each bounded to a date range —
peak periods, closures, a stretch that needs a particular qualification.
See `ShiftDemandOverride` for how they combine.

#### Defined in

[src/scheduling/types.ts:772](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L772)

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

[src/scheduling/types.ts:799](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L799)

___

### endTime

• **endTime**: `string`

Time of day the shift ends; `endTime <= startTime` means it runs into the next day.

#### Defined in

[src/scheduling/types.ts:722](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L722)

___

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:717](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L717)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

Cap on assignees. Useful for supervision limits and to stop over-staffing.

#### Defined in

[src/scheduling/types.ts:762](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L762)

___

### minEmployees

• `Optional` **minEmployees**: `number`

Minimum employees that must be assigned to each occurrence. Defaults to 1.

#### Defined in

[src/scheduling/types.ts:728](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L728)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:718](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L718)

___

### paidBreakMinutes

• `Optional` **paidBreakMinutes**: `number`

Paid break minutes inside the span. They count as working time (no
deduction), and they are what discharges a `BreakRule` with `paid: true`.

#### Defined in

[src/scheduling/types.ts:788](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L788)

___

### requiredTags

• `Optional` **requiredTags**: `string`[]

Tags every assignee must hold, checked against date-valid qualifications.

#### Defined in

[src/scheduling/types.ts:766](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L766)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

Classification tag for sequence rules — `'night'`, `'early'`, `'late'`.
`ConsecutiveRule.forbiddenSuccessions` matches on this.

#### Defined in

[src/scheduling/types.ts:777](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L777)

___

### siteId

• `Optional` **siteId**: `string`

Site this shift is at, for multi-site rosters.

#### Defined in

[src/scheduling/types.ts:801](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L801)

___

### startTime

• **startTime**: `string`

Time of day the shift starts.

#### Defined in

[src/scheduling/types.ts:720](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L720)

___

### tagMaximums

• `Optional` **tagMaximums**: `Record`\<`string`, `number`\>

Per-tag maximums, e.g. at most 2 trainees on a shift.

#### Defined in

[src/scheduling/types.ts:764](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L764)

___

### tagRatios

• `Optional` **tagRatios**: `Record`\<`string`, `number`\>

Per-tag **proportions** of the assigned team, as a fraction of 0 to 1.

The other shape a headcount cannot express, and the one the composition
rule's own header has always named as its motivation: German ward
staffing is a proportion by ward and shift, and "no fewer than 60%
registered nurses" is not two nurses or three — it depends on how many
people are on.

A **floor, rounded up**: 60% of four people is 2.4, and nobody staffs
2.4, so it means three. An empty shift is silent rather than 0% — a
proportion of nobody is undefined, and reporting it as a breach would
bury the real finding, which is that the shift is unstaffed.

#### Defined in

[src/scheduling/types.ts:759](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L759)

___

### tagRequirements

• `Optional` **tagRequirements**: `Record`\<`string`, `number` \| [`TagRequirement`](TagRequirement.md)\>

Per-tag minimums: at least this many assigned employees must carry the tag.

A plain number counts heads holding the tag at all. The object form adds
a **grade floor** — `{ min: 1, level: 3 }` is "at least one senior on
every shift", the question operational buyers ask first and the one a
headcount cannot answer. `Qualification.level` has always been stored and
`holds(..., minLevel)` has always accepted a floor; this is what finally
passes one.

A graded requirement is satisfied only by a dated qualification at or
above the level. A plain `Employee.tags` entry carries no grade, so it
cannot answer a question about seniority — reading it as "any level"
would let an unstated fact settle one.

#### Defined in

[src/scheduling/types.ts:744](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L744)

___

### unpaidBreakMinutes

• `Optional` **unpaidBreakMinutes**: `number`

Unpaid break minutes inside the span. Working time is the span minus this,
which is why a 9h shift with a 45-minute unpaid break is 8h15 against an
hours budget — not 9h.

#### Defined in

[src/scheduling/types.ts:783](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L783)
