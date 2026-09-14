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

[src/scheduling/types.ts:1043](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1043)

___

### deltaMinutes

• **deltaMinutes**: `number`

`plannedMinutes − contractedMinutes`; negative is a shortfall.

#### Defined in

[src/scheduling/types.ts:1046](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1046)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:1037](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1037)

___

### fte

• `Optional` **fte**: `number`

As supplied, or derived from `weeklyMinutes` when a full-time week is known.

#### Defined in

[src/scheduling/types.ts:1041](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1041)

___

### plannedMinutes

• **plannedMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:1044](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1044)

___

### weeklyMinutes

• **weeklyMinutes**: `number`

The contracted week, explicit or resolved from `fte`.

#### Defined in

[src/scheduling/types.ts:1039](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L1039)
