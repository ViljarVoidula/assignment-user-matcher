[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ContractHoursSummary

# Interface: ContractHoursSummary

One person's planned hours set against their contract.

## Table of contents

### Properties

- [contractedMinutes](ContractHoursSummary.md#contractedminutes)
- [deltaMinutes](ContractHoursSummary.md#deltaminutes)
- [employeeId](ContractHoursSummary.md#employeeid)
- [fte](ContractHoursSummary.md#fte)
- [plannedMinutes](ContractHoursSummary.md#plannedminutes)
- [weeklyMinutes](ContractHoursSummary.md#weeklyminutes)

## Properties

### contractedMinutes

• **contractedMinutes**: `number`

The contracted week pro-rated to the period.

#### Defined in

[src/scheduling/types.ts:1084](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1084)

___

### deltaMinutes

• **deltaMinutes**: `number`

`plannedMinutes − contractedMinutes`; negative is a shortfall.

#### Defined in

[src/scheduling/types.ts:1087](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1087)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:1078](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1078)

___

### fte

• `Optional` **fte**: `number`

As supplied, or derived from `weeklyMinutes` when a full-time week is known.

#### Defined in

[src/scheduling/types.ts:1082](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1082)

___

### plannedMinutes

• **plannedMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:1085](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1085)

___

### weeklyMinutes

• **weeklyMinutes**: `number`

The contracted week, explicit or resolved from `fte`.

#### Defined in

[src/scheduling/types.ts:1080](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L1080)
