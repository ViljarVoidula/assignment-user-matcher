[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ModelContext

# Interface: ModelContext

The normalized, fully-indexed problem the engine and constraints operate on.

## Table of contents

### Properties

- [absences](ModelContext.md#absences)
- [asOfMinute](ModelContext.md#asofminute)
- [clock](ModelContext.md#clock)
- [constraints](ModelContext.md#constraints)
- [contractHoursWeight](ModelContext.md#contracthoursweight)
- [contractedPeriodMinutes](ModelContext.md#contractedperiodminutes)
- [contractedWeeklyMinutes](ModelContext.md#contractedweeklyminutes)
- [employeeBlockedIntervals](ModelContext.md#employeeblockedintervals)
- [employeeById](ModelContext.md#employeebyid)
- [employeeTags](ModelContext.md#employeetags)
- [employees](ModelContext.md#employees)
- [employeesOfPerson](ModelContext.md#employeesofperson)
- [fillToContract](ModelContext.md#filltocontract)
- [history](ModelContext.md#history)
- [instanceById](ModelContext.md#instancebyid)
- [instances](ModelContext.md#instances)
- [minRestMinutes](ModelContext.md#minrestminutes)
- [periodDays](ModelContext.md#perioddays)
- [periodStartDate](ModelContext.md#periodstartdate)
- [personIdOf](ModelContext.md#personidof)
- [pinned](ModelContext.md#pinned)
- [publicHolidays](ModelContext.md#publicholidays)
- [publishedAtMinute](ModelContext.md#publishedatminute)
- [publishedPairs](ModelContext.md#publishedpairs)
- [rules](ModelContext.md#rules)
- [rulesByEmployee](ModelContext.md#rulesbyemployee)
- [siteIndex](ModelContext.md#siteindex)

## Properties

### absences

• **absences**: `Map`\<`string`, \{ `end`: `number` ; `kind?`: `string` ; `start`: `number`  }[]\>

Absence spans per employee, with the kind that drives averaging neutrality.

#### Defined in

[src/scheduling/types.ts:988](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L988)

___

### asOfMinute

• `Optional` **asOfMinute**: `number`

Period minutes of `ScheduleInput.asOf`, when supplied.

#### Defined in

[src/scheduling/types.ts:994](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L994)

___

### clock

• **clock**: [`PeriodClock`](../classes/PeriodClock.md)

DST-correct wall-clock resolver for the roster's zone.

#### Defined in

[src/scheduling/types.ts:963](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L963)

___

### constraints

• **constraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Constraint registry snapshot, resolved with caller overrides.

#### Defined in

[src/scheduling/types.ts:960](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L960)

___

### contractHoursWeight

• **contractHoursWeight**: `number`

Resolved `objectives.contractHoursWeight`.

#### Defined in

[src/scheduling/types.ts:977](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L977)

___

### contractedPeriodMinutes

• **contractedPeriodMinutes**: `Map`\<`string`, `number`\>

The contracted week pro-rated to the period, for the same employees.

#### Defined in

[src/scheduling/types.ts:975](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L975)

___

### contractedWeeklyMinutes

• **contractedWeeklyMinutes**: `Map`\<`string`, `number`\>

Each employee's contracted week in minutes — explicit `weeklyMinutes` or
`fte` resolved against the full-time week — for those who have one. Every
rule that reads a contracted week reads it here, so `fte` and
`weeklyMinutes` can never disagree between overtime and fairness.

#### Defined in

[src/scheduling/types.ts:973](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L973)

___

### employeeBlockedIntervals

• **employeeBlockedIntervals**: `Map`\<`string`, \{ `end`: `number` ; `start`: `number`  }[]\>

Minutes in [0, periodDays*1440) the employee is blocked by time-off.

#### Defined in

[src/scheduling/types.ts:957](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L957)

___

### employeeById

• **employeeById**: `Map`\<`string`, [`Employee`](Employee.md)\>

#### Defined in

[src/scheduling/types.ts:950](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L950)

___

### employeeTags

• **employeeTags**: `Map`\<`string`, `Set`\<`string`\>\>

#### Defined in

[src/scheduling/types.ts:951](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L951)

___

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:949](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L949)

___

### employeesOfPerson

• **employeesOfPerson**: `Map`\<`string`, `string`[]\>

Person id → the employee records that share it.

#### Defined in

[src/scheduling/types.ts:983](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L983)

___

### fillToContract

• **fillToContract**: `boolean`

Resolved `objectives.fillToContract`.

#### Defined in

[src/scheduling/types.ts:979](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L979)

___

### history

• **history**: `Map`\<`string`, [`TimelineEntry`](TimelineEntry.md)[]\>

Pre-period assignments, keyed by person, at negative period minutes.

#### Defined in

[src/scheduling/types.ts:985](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L985)

___

### instanceById

• **instanceById**: `Map`\<`string`, [`ShiftInstance`](ShiftInstance.md)\>

#### Defined in

[src/scheduling/types.ts:953](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L953)

___

### instances

• **instances**: [`ShiftInstance`](ShiftInstance.md)[]

#### Defined in

[src/scheduling/types.ts:952](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L952)

___

### minRestMinutes

• **minRestMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:958](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L958)

___

### periodDays

• **periodDays**: `number`

#### Defined in

[src/scheduling/types.ts:948](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L948)

___

### periodStartDate

• **periodStartDate**: `string`

#### Defined in

[src/scheduling/types.ts:947](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L947)

___

### personIdOf

• **personIdOf**: `Map`\<`string`, `string`\>

Employee id → the natural person it belongs to (CJEU C-585/19).

#### Defined in

[src/scheduling/types.ts:981](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L981)

___

### pinned

• **pinned**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:989](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L989)

___

### publicHolidays

• **publicHolidays**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:986](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L986)

___

### publishedAtMinute

• `Optional` **publishedAtMinute**: `number`

Period minutes the roster was published, when a published roster was supplied.

#### Defined in

[src/scheduling/types.ts:991](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L991)

___

### publishedPairs

• **publishedPairs**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:992](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L992)

___

### rules

• **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Rules after merging the global set with each person's overrides.

#### Defined in

[src/scheduling/types.ts:965](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L965)

___

### rulesByEmployee

• **rulesByEmployee**: `Map`\<`string`, [`WorkingTimeRules`](WorkingTimeRules.md)\>

#### Defined in

[src/scheduling/types.ts:966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L966)

___

### siteIndex

• **siteIndex**: [`SiteIndex`](SiteIndex.md)

Site registry built from `ScheduleInput.sites`.

#### Defined in

[src/scheduling/types.ts:955](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L955)
