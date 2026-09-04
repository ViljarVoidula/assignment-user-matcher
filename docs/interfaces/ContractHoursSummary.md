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

[src/scheduling/types.ts:868](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L868)

___

### deltaMinutes

• **deltaMinutes**: `number`

`plannedMinutes − contractedMinutes`; negative is a shortfall.

#### Defined in

[src/scheduling/types.ts:871](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L871)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:862](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L862)

___

### fte

• `Optional` **fte**: `number`

As supplied, or derived from `weeklyMinutes` when a full-time week is known.

#### Defined in

[src/scheduling/types.ts:866](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L866)

___

### plannedMinutes

• **plannedMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:869](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L869)

___

### weeklyMinutes

• **weeklyMinutes**: `number`

The contracted week, explicit or resolved from `fte`.

#### Defined in

[src/scheduling/types.ts:864](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L864)
