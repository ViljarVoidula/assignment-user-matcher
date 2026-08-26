[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ModelContext

# Interface: ModelContext

The normalized, fully-indexed problem the engine and constraints operate on.

## Table of contents

### Properties

- [absences](ModelContext.md#absences)
- [asOfMinute](ModelContext.md#asofminute)
- [clock](ModelContext.md#clock)
- [constraints](ModelContext.md#constraints)
- [employeeBlockedIntervals](ModelContext.md#employeeblockedintervals)
- [employeeById](ModelContext.md#employeebyid)
- [employeeTags](ModelContext.md#employeetags)
- [employees](ModelContext.md#employees)
- [employeesOfPerson](ModelContext.md#employeesofperson)
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

## Properties

### absences

• **absences**: `Map`\<`string`, \{ `end`: `number` ; `kind?`: `string` ; `start`: `number`  }[]\>

Absence spans per employee, with the kind that drives averaging neutrality.

#### Defined in

[src/scheduling/types.ts:852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L852)

___

### asOfMinute

• `Optional` **asOfMinute**: `number`

Period minutes of `ScheduleInput.asOf`, when supplied.

#### Defined in

[src/scheduling/types.ts:858](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L858)

___

### clock

• **clock**: [`PeriodClock`](../classes/PeriodClock.md)

DST-correct wall-clock resolver for the roster's zone.

#### Defined in

[src/scheduling/types.ts:840](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L840)

___

### constraints

• **constraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Constraint registry snapshot, resolved with caller overrides.

#### Defined in

[src/scheduling/types.ts:837](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L837)

___

### employeeBlockedIntervals

• **employeeBlockedIntervals**: `Map`\<`string`, \{ `end`: `number` ; `start`: `number`  }[]\>

Minutes in [0, periodDays*1440) the employee is blocked by time-off.

#### Defined in

[src/scheduling/types.ts:834](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L834)

___

### employeeById

• **employeeById**: `Map`\<`string`, [`Employee`](Employee.md)\>

#### Defined in

[src/scheduling/types.ts:829](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L829)

___

### employeeTags

• **employeeTags**: `Map`\<`string`, `Set`\<`string`\>\>

#### Defined in

[src/scheduling/types.ts:830](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L830)

___

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:828](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L828)

___

### employeesOfPerson

• **employeesOfPerson**: `Map`\<`string`, `string`[]\>

Person id → the employee records that share it.

#### Defined in

[src/scheduling/types.ts:847](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L847)

___

### history

• **history**: `Map`\<`string`, `TimelineEntry`[]\>

Pre-period assignments, keyed by person, at negative period minutes.

#### Defined in

[src/scheduling/types.ts:849](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L849)

___

### instanceById

• **instanceById**: `Map`\<`string`, [`ShiftInstance`](ShiftInstance.md)\>

#### Defined in

[src/scheduling/types.ts:832](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L832)

___

### instances

• **instances**: [`ShiftInstance`](ShiftInstance.md)[]

#### Defined in

[src/scheduling/types.ts:831](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L831)

___

### minRestMinutes

• **minRestMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:835](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L835)

___

### periodDays

• **periodDays**: `number`

#### Defined in

[src/scheduling/types.ts:827](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L827)

___

### periodStartDate

• **periodStartDate**: `string`

#### Defined in

[src/scheduling/types.ts:826](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L826)

___

### personIdOf

• **personIdOf**: `Map`\<`string`, `string`\>

Employee id → the natural person it belongs to (CJEU C-585/19).

#### Defined in

[src/scheduling/types.ts:845](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L845)

___

### pinned

• **pinned**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:853](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L853)

___

### publicHolidays

• **publicHolidays**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:850](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L850)

___

### publishedAtMinute

• `Optional` **publishedAtMinute**: `number`

Period minutes the roster was published, when a published roster was supplied.

#### Defined in

[src/scheduling/types.ts:855](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L855)

___

### publishedPairs

• **publishedPairs**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:856](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L856)

___

### rules

• **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Rules after merging the global set with each person's overrides.

#### Defined in

[src/scheduling/types.ts:842](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L842)

___

### rulesByEmployee

• **rulesByEmployee**: `Map`\<`string`, [`WorkingTimeRules`](WorkingTimeRules.md)\>

#### Defined in

[src/scheduling/types.ts:843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L843)
