[assignment-user-matcher](../README.md) / [Exports](../modules.md) / EmployeeContract

# Interface: EmployeeContract

Contract shape — hours-based or day-count.

## Table of contents

### Properties

- [endDate](EmployeeContract.md#enddate)
- [fte](EmployeeContract.md#fte)
- [kind](EmployeeContract.md#kind)
- [maxDaysInPeriod](EmployeeContract.md#maxdaysinperiod)
- [maxPeriodMinutes](EmployeeContract.md#maxperiodminutes)
- [minPeriodMinutes](EmployeeContract.md#minperiodminutes)
- [weeklyMinutes](EmployeeContract.md#weeklyminutes)

## Properties

### endDate

• `Optional` **endDate**: `string`

Last day the contract runs; shifts after it are ineligible.

#### Defined in

[src/scheduling/types.ts:134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L134)

___

### fte

• `Optional` **fte**: `number`

Fraction of a full-time week, `0 < fte <= 1` (0.5 is half-time). Resolved
to weekly minutes against `rules.contract.fullTimeWeeklyMinutes`, falling
back to `rules.overtime.ordinaryPerWeekMinutes`; with neither the engine
rejects the input rather than guess a working week. Ignored when
`weeklyMinutes` is set.

#### Defined in

[src/scheduling/types.ts:127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L127)

___

### kind

• **kind**: ``"hours"`` \| ``"days"``

#### Defined in

[src/scheduling/types.ts:112](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L112)

___

### maxDaysInPeriod

• `Optional` **maxDaysInPeriod**: `number`

Day-count contracts: maximum working days in the period (e.g. FR forfait jours).

#### Defined in

[src/scheduling/types.ts:129](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L129)

___

### maxPeriodMinutes

• `Optional` **maxPeriodMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L132)

___

### minPeriodMinutes

• `Optional` **minPeriodMinutes**: `number`

Hard bounds over the period, in minutes.

#### Defined in

[src/scheduling/types.ts:131](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L131)

___

### weeklyMinutes

• `Optional` **weeklyMinutes**: `number`

Contracted minutes per week. Sets the person's overtime baseline, their
pro-rata fairness share and — through `rules.contract` and the
contract-hours objective — the period total the solver plans them
towards. Takes precedence over `fte`.

#### Defined in

[src/scheduling/types.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L119)
