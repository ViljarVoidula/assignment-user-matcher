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
- [openingBalanceMinutes](EmployeeContract.md#openingbalanceminutes)
- [startDate](EmployeeContract.md#startdate)
- [weeklyMinutes](EmployeeContract.md#weeklyminutes)

## Properties

### endDate

• `Optional` **endDate**: `string`

Last day the contract runs; shifts after it are ineligible. Pro-rates the total the same way.

#### Defined in

[src/scheduling/types.ts:165](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L165)

___

### fte

• `Optional` **fte**: `number`

Fraction of a full-time week, `0 < fte <= 1` (0.5 is half-time). Resolved
to weekly minutes against `rules.contract.fullTimeWeeklyMinutes`, falling
back to `rules.overtime.ordinaryPerWeekMinutes`; with neither the engine
rejects the input rather than guess a working week. Ignored when
`weeklyMinutes` is set.

#### Defined in

[src/scheduling/types.ts:147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L147)

___

### kind

• **kind**: ``"hours"`` \| ``"days"``

#### Defined in

[src/scheduling/types.ts:132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L132)

___

### maxDaysInPeriod

• `Optional` **maxDaysInPeriod**: `number`

Day-count contracts: maximum working days in the period (e.g. FR forfait jours).

#### Defined in

[src/scheduling/types.ts:149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L149)

___

### maxPeriodMinutes

• `Optional` **maxPeriodMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:152](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L152)

___

### minPeriodMinutes

• `Optional` **minPeriodMinutes**: `number`

Hard bounds over the period, in minutes.

#### Defined in

[src/scheduling/types.ts:151](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L151)

___

### openingBalanceMinutes

• `Optional` **openingBalanceMinutes**: `number`

Minutes already worked inside the longest rolling window, carried in.

A twelve-month reference period otherwise needs twelve months of
shift-level history replayed on every solve, because the only way to put
minutes into a window was one assignment at a time. This is the scalar
that says "already 1,640 hours into the annual budget" without the
replay.

It is added to every rolling average, so it answers the question those
rules ask and nothing else: it is not hours for pay, not fairness, and
not a contract total.

#### Defined in

[src/scheduling/types.ts:179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L179)

___

### startDate

• `Optional` **startDate**: `string`

First day the contract runs; shifts before it are ineligible.

Also shrinks what the person is *owed*. Without it somebody joining on
day fifteen of a four-week period was planned a full period's contract —
160 hours against a fortnight they were employed for — and the
contract-hours objective spent the solve closing a shortfall that was an
artefact of the arithmetic, loading them past everybody who had been
there all month.

#### Defined in

[src/scheduling/types.ts:163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L163)

___

### weeklyMinutes

• `Optional` **weeklyMinutes**: `number`

Contracted minutes per week. Sets the person's overtime baseline, their
pro-rata fairness share and — through `rules.contract` and the
contract-hours objective — the period total the solver plans them
towards. Takes precedence over `fte`.

#### Defined in

[src/scheduling/types.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L139)
