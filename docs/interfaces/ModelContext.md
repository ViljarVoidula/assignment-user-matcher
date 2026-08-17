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

• **absences**: `Map`\<`string`, \{ `end`: `number` ; `kind?`: `string` ; `start`: `number` }[]\>

Absence spans per employee, with the kind that drives averaging neutrality.

#### Defined in

[src/scheduling/types.ts:846](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L846)

---

### asOfMinute

• `Optional` **asOfMinute**: `number`

Period minutes of `ScheduleInput.asOf`, when supplied.

#### Defined in

[src/scheduling/types.ts:852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L852)

---

### clock

• **clock**: [`PeriodClock`](../classes/PeriodClock.md)

DST-correct wall-clock resolver for the roster's zone.

#### Defined in

[src/scheduling/types.ts:834](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L834)

---

### constraints

• **constraints**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Constraint registry snapshot, resolved with caller overrides.

#### Defined in

[src/scheduling/types.ts:831](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L831)

---

### employeeBlockedIntervals

• **employeeBlockedIntervals**: `Map`\<`string`, \{ `end`: `number` ; `start`: `number` }[]\>

Minutes in [0, periodDays\*1440) the employee is blocked by time-off.

#### Defined in

[src/scheduling/types.ts:828](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L828)

---

### employeeById

• **employeeById**: `Map`\<`string`, [`Employee`](Employee.md)\>

#### Defined in

[src/scheduling/types.ts:823](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L823)

---

### employeeTags

• **employeeTags**: `Map`\<`string`, `Set`\<`string`\>\>

#### Defined in

[src/scheduling/types.ts:824](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L824)

---

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:822](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L822)

---

### employeesOfPerson

• **employeesOfPerson**: `Map`\<`string`, `string`[]\>

Person id → the employee records that share it.

#### Defined in

[src/scheduling/types.ts:841](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L841)

---

### history

• **history**: `Map`\<`string`, `TimelineEntry`[]\>

Pre-period assignments, keyed by person, at negative period minutes.

#### Defined in

[src/scheduling/types.ts:843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L843)

---

### instanceById

• **instanceById**: `Map`\<`string`, [`ShiftInstance`](ShiftInstance.md)\>

#### Defined in

[src/scheduling/types.ts:826](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L826)

---

### instances

• **instances**: [`ShiftInstance`](ShiftInstance.md)[]

#### Defined in

[src/scheduling/types.ts:825](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L825)

---

### minRestMinutes

• **minRestMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:829](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L829)

---

### periodDays

• **periodDays**: `number`

#### Defined in

[src/scheduling/types.ts:821](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L821)

---

### periodStartDate

• **periodStartDate**: `string`

#### Defined in

[src/scheduling/types.ts:820](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L820)

---

### personIdOf

• **personIdOf**: `Map`\<`string`, `string`\>

Employee id → the natural person it belongs to (CJEU C-585/19).

#### Defined in

[src/scheduling/types.ts:839](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L839)

---

### pinned

• **pinned**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:847](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L847)

---

### publicHolidays

• **publicHolidays**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:844](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L844)

---

### publishedAtMinute

• `Optional` **publishedAtMinute**: `number`

Period minutes the roster was published, when a published roster was supplied.

#### Defined in

[src/scheduling/types.ts:849](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L849)

---

### publishedPairs

• **publishedPairs**: `Set`\<`string`\>

#### Defined in

[src/scheduling/types.ts:850](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L850)

---

### rules

• **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Rules after merging the global set with each person's overrides.

#### Defined in

[src/scheduling/types.ts:836](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L836)

---

### rulesByEmployee

• **rulesByEmployee**: `Map`\<`string`, [`WorkingTimeRules`](WorkingTimeRules.md)\>

#### Defined in

[src/scheduling/types.ts:837](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L837)
