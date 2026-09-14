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

[src/scheduling/types.ts:1196](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1196)

___

### aggregateConstraints

• `Optional` **aggregateConstraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Custom whole-roster constraints that must also contribute to search scoring.

#### Defined in

[src/scheduling/types.ts:1166](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1166)

___

### asOfMinute

• `Optional` **asOfMinute**: `number`

Period minutes of `ScheduleInput.asOf`, when supplied.

#### Defined in

[src/scheduling/types.ts:1202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1202)

___

### clock

• **clock**: [`PeriodClock`](../classes/PeriodClock.md)

DST-correct wall-clock resolver for the roster's zone.

#### Defined in

[src/scheduling/types.ts:1171](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1171)

___

### constraints

• **constraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Constraint registry snapshot, resolved with caller overrides.

#### Defined in

[src/scheduling/types.ts:1168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1168)

___

### contractHoursWeight

• **contractHoursWeight**: `number`

Resolved `objectives.contractHoursWeight`.

#### Defined in

[src/scheduling/types.ts:1185](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1185)

___

### contractedPeriodMinutes

• **contractedPeriodMinutes**: `Map`\<`string`, `number`\>

The contracted week pro-rated to the period, for the same employees.

#### Defined in

[src/scheduling/types.ts:1183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1183)

___

### contractedWeeklyMinutes

• **contractedWeeklyMinutes**: `Map`\<`string`, `number`\>

Each employee's contracted week in minutes — explicit `weeklyMinutes` or
`fte` resolved against the full-time week — for those who have one. Every
rule that reads a contracted week reads it here, so `fte` and
`weeklyMinutes` can never disagree between overtime and fairness.

#### Defined in

[src/scheduling/types.ts:1181](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1181)

___

### employeeBlockedIntervals

• **employeeBlockedIntervals**: `Map`\<`string`, \{ `end`: `number` ; `start`: `number`  }[]\>

Blocked intervals in elapsed period minutes, including overlapping overnight spillover.

#### Defined in

[src/scheduling/types.ts:1163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1163)

___

### employeeById

• **employeeById**: `Map`\<`string`, [`Employee`](Employee.md)\>

#### Defined in

[src/scheduling/types.ts:1133](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1133)

___

### employeeTags

• **employeeTags**: `Map`\<`string`, `Set`\<`string`\>\>

Plain `Employee.tags` only — valid for the whole period by definition.

Never count a tag requirement off this map: anything with an expiry lives
in `Employee.qualifications` and is a question about the shift's date.
Use `holdsTagOn` for that, so per-tag minimums and maximums read a lapsed
certificate the same way `requiredTags` does.

#### Defined in

[src/scheduling/types.ts:1142](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1142)

___

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:1132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1132)

___

### employeesOfPerson

• **employeesOfPerson**: `Map`\<`string`, `string`[]\>

Person id → the employee records that share it.

#### Defined in

[src/scheduling/types.ts:1191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1191)

___

### fillToContract

• **fillToContract**: `boolean`

Resolved `objectives.fillToContract`.

#### Defined in

[src/scheduling/types.ts:1187](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1187)

___

### history

• **history**: `Map`\<`string`, [`TimelineEntry`](TimelineEntry.md)[]\>

Pre-period assignments, keyed by person, at negative period minutes.

#### Defined in

[src/scheduling/types.ts:1193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1193)

___

### instanceById

• **instanceById**: `Map`\<`string`, [`ShiftInstance`](ShiftInstance.md)\>

#### Defined in

[src/scheduling/types.ts:1159](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1159)

___

### instances

• **instances**: [`ShiftInstance`](ShiftInstance.md)[]

#### Defined in

[src/scheduling/types.ts:1158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1158)

___

### minRestMinutes

• **minRestMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:1164](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1164)

___

### periodDays

• **periodDays**: `number`

#### Defined in

[src/scheduling/types.ts:1131](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1131)

___

### periodStartDate

• **periodStartDate**: `string`

#### Defined in

[src/scheduling/types.ts:1130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1130)

___

### personIdOf

• **personIdOf**: `Map`\<`string`, `string`\>

Employee id → the natural person it belongs to (CJEU C-585/19).

#### Defined in

[src/scheduling/types.ts:1189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1189)

___

### pinned

• **pinned**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1197)

___

### publicHolidays

• **publicHolidays**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1194](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1194)

___

### publishedAtMinute

• `Optional` **publishedAtMinute**: `number`

Period minutes the roster was published, when a published roster was supplied.

#### Defined in

[src/scheduling/types.ts:1199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1199)

___

### publishedPairs

• **publishedPairs**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:1200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1200)

___

### rules

• **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Rules after merging the global set with each person's overrides.

#### Defined in

[src/scheduling/types.ts:1173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1173)

___

### rulesByEmployee

• **rulesByEmployee**: `Map`\<`string`, [`WorkingTimeRules`](WorkingTimeRules.md)\>

#### Defined in

[src/scheduling/types.ts:1174](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1174)

___

### siteIndex

• **siteIndex**: [`SiteIndex`](SiteIndex.md)

Site registry built from `ScheduleInput.sites`.

#### Defined in

[src/scheduling/types.ts:1161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1161)

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

[src/scheduling/types.ts:1157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1157)

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

[src/scheduling/types.ts:1147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1147)
