[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ModelContext

# Interface: ModelContext

The normalized, fully-indexed problem the engine and constraints operate on.

## Table of contents

### Properties

- [absences](ModelContext.md#absences)
- [aggregateConstraints](ModelContext.md#aggregateconstraints)
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
- [preferenceRules](ModelContext.md#preferencerules)
- [publicHolidays](ModelContext.md#publicholidays)
- [publishedAtMinute](ModelContext.md#publishedatminute)
- [publishedPairs](ModelContext.md#publishedpairs)
- [rules](ModelContext.md#rules)
- [rulesByEmployee](ModelContext.md#rulesbyemployee)
- [siteIndex](ModelContext.md#siteindex)

### Methods

- [holdsTagAt](ModelContext.md#holdstagat)
- [holdsTagOn](ModelContext.md#holdstagon)

## Properties

### absences

• **absences**: `Map`\<`string`, \{ `end`: `number` ; `kind?`: `string` ; `start`: `number`  }[]\>

Absence spans per employee, with the kind that drives averaging neutrality.

#### Defined in

[src/scheduling/types.ts:1273](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1273)

___

### aggregateConstraints

• `Optional` **aggregateConstraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Custom whole-roster constraints that must also contribute to search scoring.

#### Defined in

[src/scheduling/types.ts:1237](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1237)

___

### asOfMinute

• `Optional` **asOfMinute**: `number`

Period minutes of `ScheduleInput.asOf`, when supplied.

#### Defined in

[src/scheduling/types.ts:1279](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1279)

___

### clock

• **clock**: [`PeriodClock`](../classes/PeriodClock.md)

DST-correct wall-clock resolver for the roster's zone.

#### Defined in

[src/scheduling/types.ts:1242](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1242)

___

### constraints

• **constraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Constraint registry snapshot, resolved with caller overrides.

#### Defined in

[src/scheduling/types.ts:1239](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1239)

___

### contractHoursWeight

• **contractHoursWeight**: `number`

Resolved `objectives.contractHoursWeight`.

#### Defined in

[src/scheduling/types.ts:1256](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1256)

___

### contractedPeriodMinutes

• **contractedPeriodMinutes**: `Map`\<`string`, `number`\>

The contracted week pro-rated to the period, for the same employees.

#### Defined in

[src/scheduling/types.ts:1254](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1254)

___

### contractedWeeklyMinutes

• **contractedWeeklyMinutes**: `Map`\<`string`, `number`\>

Each employee's contracted week in minutes — explicit `weeklyMinutes` or
`fte` resolved against the full-time week — for those who have one. Every
rule that reads a contracted week reads it here, so `fte` and
`weeklyMinutes` can never disagree between overtime and fairness.

#### Defined in

[src/scheduling/types.ts:1252](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1252)

___

### employeeBlockedIntervals

• **employeeBlockedIntervals**: `Map`\<`string`, \{ `end`: `number` ; `start`: `number`  }[]\>

Blocked intervals in elapsed period minutes, including overlapping overnight spillover.

#### Defined in

[src/scheduling/types.ts:1234](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1234)

___

### employeeById

• **employeeById**: `Map`\<`string`, [`Employee`](Employee.md)\>

#### Defined in

[src/scheduling/types.ts:1204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1204)

___

### employeeTags

• **employeeTags**: `Map`\<`string`, `Set`\<`string`\>\>

Plain `Employee.tags` only — valid for the whole period by definition.

Never count a tag requirement off this map: anything with an expiry lives
in `Employee.qualifications` and is a question about the shift's date.
Use `holdsTagOn` for that, so per-tag minimums and maximums read a lapsed
certificate the same way `requiredTags` does.

#### Defined in

[src/scheduling/types.ts:1213](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1213)

___

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:1203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1203)

___

### employeesOfPerson

• **employeesOfPerson**: `Map`\<`string`, `string`[]\>

Person id → the employee records that share it.

#### Defined in

[src/scheduling/types.ts:1268](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1268)

___

### fillToContract

• **fillToContract**: `boolean`

Resolved `objectives.fillToContract`.

#### Defined in

[src/scheduling/types.ts:1258](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1258)

___

### history

• **history**: `Map`\<`string`, [`TimelineEntry`](TimelineEntry.md)[]\>

Pre-period assignments, keyed by person, at negative period minutes.

#### Defined in

[src/scheduling/types.ts:1270](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1270)

___

### instanceById

• **instanceById**: `Map`\<`string`, [`ShiftInstance`](ShiftInstance.md)\>

#### Defined in

[src/scheduling/types.ts:1230](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1230)

___

### instances

• **instances**: [`ShiftInstance`](ShiftInstance.md)[]

#### Defined in

[src/scheduling/types.ts:1229](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1229)

___

### minRestMinutes

• **minRestMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:1235](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1235)

___

### periodDays

• **periodDays**: `number`

#### Defined in

[src/scheduling/types.ts:1202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1202)

___

### periodStartDate

• **periodStartDate**: `string`

#### Defined in

[src/scheduling/types.ts:1201](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1201)

___

### personIdOf

• **personIdOf**: `Map`\<`string`, `string`\>

Employee id → the natural person it belongs to (CJEU C-585/19).

#### Defined in

[src/scheduling/types.ts:1266](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1266)

___

### pinned

• **pinned**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1274)

___

### preferenceRules

• **preferenceRules**: `Map`\<`string`, [`AvailabilityRule`](AvailabilityRule.md)[]\>

Each employee's `preferred` / `avoid` rules with `weight` resolved
(priority multiplier, then budget scaling). Every preference scorer
reads this, never `Employee.availability` weights directly.

#### Defined in

[src/scheduling/types.ts:1264](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1264)

___

### publicHolidays

• **publicHolidays**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1271](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1271)

___

### publishedAtMinute

• `Optional` **publishedAtMinute**: `number`

Period minutes the roster was published, when a published roster was supplied.

#### Defined in

[src/scheduling/types.ts:1276](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1276)

___

### publishedPairs

• **publishedPairs**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1277](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1277)

___

### rules

• **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Rules after merging the global set with each person's overrides.

#### Defined in

[src/scheduling/types.ts:1244](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1244)

___

### rulesByEmployee

• **rulesByEmployee**: `Map`\<`string`, [`WorkingTimeRules`](WorkingTimeRules.md)\>

#### Defined in

[src/scheduling/types.ts:1245](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1245)

___

### siteIndex

• **siteIndex**: [`SiteIndex`](SiteIndex.md)

Site registry built from `ScheduleInput.sites`.

#### Defined in

[src/scheduling/types.ts:1232](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1232)

## Methods

### holdsTagAt

▸ **holdsTagAt**(`employeeId`, `tag`, `date`, `minLevel`): `boolean`

The same question with a grade floor: a dated qualification at or above
`minLevel`.

A plain `Employee.tags` entry never satisfies this. A tag carries no
grade, and reading it as "any level" would let an unstated fact answer a
question about seniority — which is exactly what a graded requirement
exists to ask.

#### Parameters

| Name | Type |
| :------ | :------ |
| `employeeId` | `string` |
| `tag` | `string` |
| `date` | `string` |
| `minLevel` | `number` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/types.ts:1228](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1228)

___

### holdsTagOn

▸ **holdsTagOn**(`employeeId`, `tag`, `date`): `boolean`

Whether the employee holds `tag` on `date`, by plain tag or by a
qualification whose validity covers that day.

#### Parameters

| Name | Type |
| :------ | :------ |
| `employeeId` | `string` |
| `tag` | `string` |
| `date` | `string` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/types.ts:1218](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1218)
