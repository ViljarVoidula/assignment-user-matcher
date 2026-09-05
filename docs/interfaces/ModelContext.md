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

[src/scheduling/types.ts:1055](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1055)

___

### asOfMinute

• `Optional` **asOfMinute**: `number`

Period minutes of `ScheduleInput.asOf`, when supplied.

#### Defined in

[src/scheduling/types.ts:1061](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1061)

___

### clock

• **clock**: [`PeriodClock`](../classes/PeriodClock.md)

DST-correct wall-clock resolver for the roster's zone.

#### Defined in

[src/scheduling/types.ts:1030](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1030)

___

### constraints

• **constraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Constraint registry snapshot, resolved with caller overrides.

#### Defined in

[src/scheduling/types.ts:1027](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1027)

___

### contractHoursWeight

• **contractHoursWeight**: `number`

Resolved `objectives.contractHoursWeight`.

#### Defined in

[src/scheduling/types.ts:1044](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1044)

___

### contractedPeriodMinutes

• **contractedPeriodMinutes**: `Map`\<`string`, `number`\>

The contracted week pro-rated to the period, for the same employees.

#### Defined in

[src/scheduling/types.ts:1042](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1042)

___

### contractedWeeklyMinutes

• **contractedWeeklyMinutes**: `Map`\<`string`, `number`\>

Each employee's contracted week in minutes — explicit `weeklyMinutes` or
`fte` resolved against the full-time week — for those who have one. Every
rule that reads a contracted week reads it here, so `fte` and
`weeklyMinutes` can never disagree between overtime and fairness.

#### Defined in

[src/scheduling/types.ts:1040](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1040)

___

### employeeBlockedIntervals

• **employeeBlockedIntervals**: `Map`\<`string`, \{ `end`: `number` ; `start`: `number`  }[]\>

Minutes in [0, periodDays*1440) the employee is blocked by time-off.

#### Defined in

[src/scheduling/types.ts:1024](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1024)

___

### employeeById

• **employeeById**: `Map`\<`string`, [`Employee`](Employee.md)\>

#### Defined in

[src/scheduling/types.ts:1017](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1017)

___

### employeeTags

• **employeeTags**: `Map`\<`string`, `Set`\<`string`\>\>

#### Defined in

[src/scheduling/types.ts:1018](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1018)

___

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:1016](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1016)

___

### employeesOfPerson

• **employeesOfPerson**: `Map`\<`string`, `string`[]\>

Person id → the employee records that share it.

#### Defined in

[src/scheduling/types.ts:1050](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1050)

___

### fillToContract

• **fillToContract**: `boolean`

Resolved `objectives.fillToContract`.

#### Defined in

[src/scheduling/types.ts:1046](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1046)

___

### history

• **history**: `Map`\<`string`, [`TimelineEntry`](TimelineEntry.md)[]\>

Pre-period assignments, keyed by person, at negative period minutes.

#### Defined in

[src/scheduling/types.ts:1052](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1052)

___

### instanceById

• **instanceById**: `Map`\<`string`, [`ShiftInstance`](ShiftInstance.md)\>

#### Defined in

[src/scheduling/types.ts:1020](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1020)

___

### instances

• **instances**: [`ShiftInstance`](ShiftInstance.md)[]

#### Defined in

[src/scheduling/types.ts:1019](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1019)

___

### minRestMinutes

• **minRestMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:1025](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1025)

___

### periodDays

• **periodDays**: `number`

#### Defined in

[src/scheduling/types.ts:1015](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1015)

___

### periodStartDate

• **periodStartDate**: `string`

#### Defined in

[src/scheduling/types.ts:1014](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1014)

___

### personIdOf

• **personIdOf**: `Map`\<`string`, `string`\>

Employee id → the natural person it belongs to (CJEU C-585/19).

#### Defined in

[src/scheduling/types.ts:1048](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1048)

___

### pinned

• **pinned**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1056](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1056)

___

### publicHolidays

• **publicHolidays**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1053](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1053)

___

### publishedAtMinute

• `Optional` **publishedAtMinute**: `number`

Period minutes the roster was published, when a published roster was supplied.

#### Defined in

[src/scheduling/types.ts:1058](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1058)

___

### publishedPairs

• **publishedPairs**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1059](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1059)

___

### rules

• **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Rules after merging the global set with each person's overrides.

#### Defined in

[src/scheduling/types.ts:1032](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1032)

___

### rulesByEmployee

• **rulesByEmployee**: `Map`\<`string`, [`WorkingTimeRules`](WorkingTimeRules.md)\>

#### Defined in

[src/scheduling/types.ts:1033](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1033)

___

### siteIndex

• **siteIndex**: [`SiteIndex`](SiteIndex.md)

Site registry built from `ScheduleInput.sites`.

#### Defined in

[src/scheduling/types.ts:1022](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1022)
