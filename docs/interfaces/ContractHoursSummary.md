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

[src/scheduling/types.ts:929](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L929)

___

### deltaMinutes

• **deltaMinutes**: `number`

`plannedMinutes − contractedMinutes`; negative is a shortfall.

#### Defined in

[src/scheduling/types.ts:932](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L932)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:923](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L923)

___

### fte

• `Optional` **fte**: `number`

As supplied, or derived from `weeklyMinutes` when a full-time week is known.

#### Defined in

[src/scheduling/types.ts:927](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L927)

___

### plannedMinutes

• **plannedMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:930](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L930)

___

### weeklyMinutes

• **weeklyMinutes**: `number`

The contracted week, explicit or resolved from `fte`.

#### Defined in

[src/scheduling/types.ts:925](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L925)
