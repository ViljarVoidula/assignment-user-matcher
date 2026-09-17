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
- [maxIterations](ScheduleInput.md#maxiterations)
- [objective](ScheduleInput.md#objective)
- [objectives](ScheduleInput.md#objectives)
- [onProgress](ScheduleInput.md#onprogress)
- [period](ScheduleInput.md#period)
- [pinned](ScheduleInput.md#pinned)
- [published](ScheduleInput.md#published)
- [rules](ScheduleInput.md#rules)
- [seed](ScheduleInput.md#seed)
- [shifts](ScheduleInput.md#shifts)
- [sites](ScheduleInput.md#sites)
- [timeBudgetMs](ScheduleInput.md#timebudgetms)
- [travelSpeedKmh](ScheduleInput.md#travelspeedkmh)

## Properties

### absences

• `Optional` **absences**: \{ `employeeId`: `string` ; `from`: `string` ; `kind?`: `string` ; `to`: `string`  }[]

Absences that block assignment and may be neutral in rolling averages.

#### Defined in

[src/scheduling/types.ts:874](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L874)

___

### asOf

• `Optional` **asOf**: `string`

The instant this solve or compliance run represents, as an ISO date or
date-time. It anchors deadline arithmetic that needs a "now" — notably
whether cancelling a published assignment fell inside
`notice.cancellationDeadlineMinutes` of the shift's start. Omitted, every
cancellation is treated as late (the conservative reading). Caller-supplied
so runs stay deterministic and replayable.

#### Defined in

[src/scheduling/types.ts:870](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L870)

___

### calendar

• `Optional` **calendar**: `Object`

Public holidays and closures, as ISO dates.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `closedDates?` | `string`[] |
| `publicHolidays?` | `string`[] |

#### Defined in

[src/scheduling/types.ts:852](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L852)

___

### constraints

• `Optional` **constraints**: [`ConstraintOptions`](ConstraintOptions.md)

#### Defined in

[src/scheduling/types.ts:837](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L837)

___

### employees

• **employees**: [`Employee`](Employee.md)[]

#### Defined in

[src/scheduling/types.ts:832](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L832)

___

### history

• `Optional` **history**: [`HistoricalAssignment`](HistoricalAssignment.md)[]

Assignments from before the period, used to seed rest and rolling
windows. Without them the first days of every period are non-compliant by
construction, because an 11h rest rule cannot see the shift that ended at
06:00 on day one.

#### Defined in

[src/scheduling/types.ts:859](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L859)

___

### maxIterations

• `Optional` **maxIterations**: `number`

Fixed search iteration limit. Without timeBudgetMs, runs deterministically to this limit.

#### Defined in

[src/scheduling/types.ts:843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L843)

___

### objective

• `Optional` **objective**: ``"balanced"`` \| ``"standard"``

#### Defined in

[src/scheduling/types.ts:834](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L834)

___

### objectives

• `Optional` **objectives**: [`ObjectiveWeights`](ObjectiveWeights.md)

Weights of optional soft-objective terms. Omitted terms stay out of the solve.

#### Defined in

[src/scheduling/types.ts:836](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L836)

___

### onProgress

• `Optional` **onProgress**: (`best`: [`ScheduleResult`](ScheduleResult.md)) => `void`

Called with the best roster so far as the search improves it.

#### Type declaration

▸ (`best`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `best` | [`ScheduleResult`](ScheduleResult.md) |

##### Returns

`void`

#### Defined in

[src/scheduling/types.ts:876](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L876)

___

### period

• **period**: `Object`

Inclusive ISO date range, plus the zone its wall-clock times are read in.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `endDate` | `string` |
| `startDate` | `string` |
| `timeZone?` | `string` |

#### Defined in

[src/scheduling/types.ts:831](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L831)

___

### pinned

• `Optional` **pinned**: [`AssignmentPair`](AssignmentPair.md)[]

Pairs the solver may not move.

#### Defined in

[src/scheduling/types.ts:872](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L872)

___

### published

• `Optional` **published**: `Object`

A published roster, which anchors the notice clock and the perturbation objective.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `publishedAt?` | `string` |
| `roster` | [`ScheduledAssignment`](ScheduledAssignment.md)[] |

#### Defined in

[src/scheduling/types.ts:861](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L861)

___

### rules

• `Optional` **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

The labour-law layer. Omit for a plain feasibility solve.

#### Defined in

[src/scheduling/types.ts:846](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L846)

___

### seed

• `Optional` **seed**: `number`

Seed for reproducible runs.

#### Defined in

[src/scheduling/types.ts:839](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L839)

___

### shifts

• **shifts**: [`ShiftTemplate`](ShiftTemplate.md)[]

#### Defined in

[src/scheduling/types.ts:833](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L833)

___

### sites

• `Optional` **sites**: [`Site`](Site.md)[]

Site registry. Required for multi-site travel-gap, distance-aware ranking and home-site preferences.

#### Defined in

[src/scheduling/types.ts:848](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L848)

___

### timeBudgetMs

• `Optional` **timeBudgetMs**: `number`

Wall-clock budget for the improvement loop. Default 10_000.

#### Defined in

[src/scheduling/types.ts:841](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L841)

___

### travelSpeedKmh

• `Optional` **travelSpeedKmh**: `number`

Fallback speed (km/h) used to derive travel minutes from haversine distance when a matrix entry is absent.

#### Defined in

[src/scheduling/types.ts:850](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L850)
