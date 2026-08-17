[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ScheduleInput

# Interface: ScheduleInput

The full scheduling problem.

## Table of contents

### Properties

- [absences](ScheduleInput.md#absences)
- [asOf](ScheduleInput.md#asof)
- [calendar](ScheduleInput.md#calendar)
- [constraints](ScheduleInput.md#constraints)
- [employees](ScheduleInput.md#employees)
- [history](ScheduleInput.md#history)
- [objective](ScheduleInput.md#objective)
- [objectives](ScheduleInput.md#objectives)
- [onProgress](ScheduleInput.md#onprogress)
- [period](ScheduleInput.md#period)
- [pinned](ScheduleInput.md#pinned)
- [published](ScheduleInput.md#published)
- [rules](ScheduleInput.md#rules)
- [seed](ScheduleInput.md#seed)
- [shifts](ScheduleInput.md#shifts)
- [timeBudgetMs](ScheduleInput.md#timebudgetms)

## Properties

### absences

• `Optional` **absences**: \{ `employeeId`: `string` ; `from`: `string` ; `kind?`: `string` ; `to`: `string` }[]

Absences that block assignment and may be neutral in rolling averages.

#### Defined in

[src/scheduling/types.ts:623](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L623)

---

### asOf

• `Optional` **asOf**: `string`

The instant this solve or compliance run represents, as an ISO date or
date-time. It anchors deadline arithmetic that needs a "now" — notably
whether cancelling a published assignment fell inside
`notice.cancellationDeadlineMinutes` of the shift's start. Omitted, every
cancellation is treated as late (the conservative reading). Caller-supplied
so runs stay deterministic and replayable.

#### Defined in

[src/scheduling/types.ts:619](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L619)

---

### calendar

• `Optional` **calendar**: `Object`

Public holidays and closures, as ISO dates.

#### Type declaration

| Name              | Type       |
| :---------------- | :--------- |
| `closedDates?`    | `string`[] |
| `publicHolidays?` | `string`[] |

#### Defined in

[src/scheduling/types.ts:601](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L601)

---

### constraints

• `Optional` **constraints**: [`ConstraintOptions`](ConstraintOptions.md)

#### Defined in

[src/scheduling/types.ts:592](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L592)

---

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:587](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L587)

---

### history

• `Optional` **history**: [`HistoricalAssignment`](HistoricalAssignment.md)[]

Assignments from before the period, used to seed rest and rolling
windows. Without them the first days of every period are non-compliant by
construction, because an 11h rest rule cannot see the shift that ended at
06:00 on day one.

#### Defined in

[src/scheduling/types.ts:608](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L608)

---

### objective

• `Optional` **objective**: `"balanced"` \| `"standard"`

#### Defined in

[src/scheduling/types.ts:589](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L589)

---

### objectives

• `Optional` **objectives**: [`ObjectiveWeights`](ObjectiveWeights.md)

Weights of optional soft-objective terms. Omitted terms stay out of the solve.

#### Defined in

[src/scheduling/types.ts:591](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L591)

---

### onProgress

• `Optional` **onProgress**: (`best`: [`ScheduleResult`](ScheduleResult.md)) => `void`

Called with the best roster so far as the search improves it.

#### Type declaration

▸ (`best`): `void`

##### Parameters

| Name   | Type                                  |
| :----- | :------------------------------------ |
| `best` | [`ScheduleResult`](ScheduleResult.md) |

##### Returns

`void`

#### Defined in

[src/scheduling/types.ts:625](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L625)

---

### period

• **period**: `Object`

Inclusive ISO date range, plus the zone its wall-clock times are read in.

#### Type declaration

| Name        | Type     |
| :---------- | :------- |
| `endDate`   | `string` |
| `startDate` | `string` |
| `timeZone?` | `string` |

#### Defined in

[src/scheduling/types.ts:586](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L586)

---

### pinned

• `Optional` **pinned**: [`AssignmentPair`](AssignmentPair.md)[]

Pairs the solver may not move.

#### Defined in

[src/scheduling/types.ts:621](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L621)

---

### published

• `Optional` **published**: `Object`

A published roster, which anchors the notice clock and the perturbation objective.

#### Type declaration

| Name           | Type                                              |
| :------------- | :------------------------------------------------ |
| `publishedAt?` | `string`                                          |
| `roster`       | [`ScheduledAssignment`](ScheduledAssignment.md)[] |

#### Defined in

[src/scheduling/types.ts:610](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L610)

---

### rules

• `Optional` **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

The labour-law layer. Omit for a plain feasibility solve.

#### Defined in

[src/scheduling/types.ts:599](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L599)

---

### seed

• `Optional` **seed**: `number`

Seed for reproducible runs.

#### Defined in

[src/scheduling/types.ts:594](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L594)

---

### shifts

• **shifts**: [`ShiftTemplate`](ShiftTemplate.md)[]

#### Defined in

[src/scheduling/types.ts:588](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L588)

---

### timeBudgetMs

• `Optional` **timeBudgetMs**: `number`

Wall-clock budget for the improvement loop. Default 10_000.

#### Defined in

[src/scheduling/types.ts:596](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L596)
