[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ShiftTemplate

# Interface: ShiftTemplate

A recurring or dated shift definition. Times are local time-of-day `HH:MM` or `HH:MM:SS`.

## Table of contents

### Properties

- [dates](ShiftTemplate.md#dates)
- [daysOfWeek](ShiftTemplate.md#daysofweek)
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

[src/scheduling/types.ts:494](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L494)

___

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

ISO weekdays 1 (Mon) .. 7 (Sun) within the scheduling period. Mutually exclusive with `dates`.

#### Defined in

[src/scheduling/types.ts:496](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L496)

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

[src/scheduling/types.ts:534](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L534)

___

### endTime

• **endTime**: `string`

Time of day the shift ends; `endTime <= startTime` means it runs into the next day.

#### Defined in

[src/scheduling/types.ts:492](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L492)

___

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:487](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L487)

___

### maxEmployees

• `Optional` **maxEmployees**: `number`

Cap on assignees. Useful for supervision limits and to stop over-staffing.

#### Defined in

[src/scheduling/types.ts:503](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L503)

___

### minEmployees

• `Optional` **minEmployees**: `number`

Minimum employees that must be assigned to each occurrence. Defaults to 1.

#### Defined in

[src/scheduling/types.ts:498](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L498)

___

### name

• **name**: `string`

#### Defined in

[src/scheduling/types.ts:488](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L488)

___

### paidBreakMinutes

• `Optional` **paidBreakMinutes**: `number`

Paid break minutes inside the span. They count as working time (no
deduction), and they are what discharges a `BreakRule` with `paid: true`.

#### Defined in

[src/scheduling/types.ts:523](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L523)

___

### requiredTags

• `Optional` **requiredTags**: `string`[]

Tags every assignee must hold, checked against date-valid qualifications.

#### Defined in

[src/scheduling/types.ts:507](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L507)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

Classification tag for sequence rules — `'night'`, `'early'`, `'late'`.
`ConsecutiveRule.forbiddenSuccessions` matches on this.

#### Defined in

[src/scheduling/types.ts:512](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L512)

___

### siteId

• `Optional` **siteId**: `string`

Site this shift is at, for multi-site rosters.

#### Defined in

[src/scheduling/types.ts:536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L536)

___

### startTime

• **startTime**: `string`

Time of day the shift starts.

#### Defined in

[src/scheduling/types.ts:490](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L490)

___

### tagMaximums

• `Optional` **tagMaximums**: `Record`\<`string`, `number`\>

Per-tag maximums, e.g. at most 2 trainees on a shift.

#### Defined in

[src/scheduling/types.ts:505](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L505)

___

### tagRequirements

• `Optional` **tagRequirements**: `Record`\<`string`, `number`\>

Per-tag minimums: at least `count` assigned employees must carry the tag.

#### Defined in

[src/scheduling/types.ts:500](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L500)

___

### unpaidBreakMinutes

• `Optional` **unpaidBreakMinutes**: `number`

Unpaid break minutes inside the span. Working time is the span minus this,
which is why a 9h shift with a 45-minute unpaid break is 8h15 against an
hours budget — not 9h.

#### Defined in

[src/scheduling/types.ts:518](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L518)
