[assignment-user-matcher](../README.md) / [Exports](../modules.md) / EmployeeContract

# Interface: EmployeeContract

Contract shape — hours-based or day-count.

## Table of contents

### Properties

- [endDate](EmployeeContract.md#enddate)
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

[src/scheduling/types.ts:121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L121)

___

### kind

• **kind**: ``"hours"`` \| ``"days"``

#### Defined in

[src/scheduling/types.ts:112](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L112)

___

### maxDaysInPeriod

• `Optional` **maxDaysInPeriod**: `number`

Day-count contracts: maximum working days in the period (e.g. FR forfait jours).

#### Defined in

[src/scheduling/types.ts:116](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L116)

___

### maxPeriodMinutes

• `Optional` **maxPeriodMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L119)

___

### minPeriodMinutes

• `Optional` **minPeriodMinutes**: `number`

Hard bounds over the period, in minutes.

#### Defined in

[src/scheduling/types.ts:118](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L118)

___

### weeklyMinutes

• `Optional` **weeklyMinutes**: `number`

Target contractual minutes per week, used for pro-rata fairness.

#### Defined in

[src/scheduling/types.ts:114](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L114)
