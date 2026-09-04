[assignment-user-matcher](../README.md) / [Exports](../modules.md) / LedgerEntry

# Interface: LedgerEntry

A dated obligation created by an assignment.

## Table of contents

### Properties

- [citation](LedgerEntry.md#citation)
- [dueBy](LedgerEntry.md#dueby)
- [employeeId](LedgerEntry.md#employeeid)
- [kind](LedgerEntry.md#kind)
- [minutes](LedgerEntry.md#minutes)
- [reason](LedgerEntry.md#reason)

## Properties

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:882](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L882)

___

### dueBy

• `Optional` **dueBy**: `string`

ISO date by which the obligation must be discharged.

#### Defined in

[src/scheduling/types.ts:880](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L880)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:877](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L877)

___

### kind

• **kind**: ``"compensatoryRest"`` \| ``"substituteRestDay"`` \| ``"lateCancellationPay"`` \| ``"timeOffInLieu"``

#### Defined in

[src/scheduling/types.ts:876](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L876)

___

### minutes

• `Optional` **minutes**: `number`

#### Defined in

[src/scheduling/types.ts:878](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L878)

___

### reason

• **reason**: `string`

#### Defined in

[src/scheduling/types.ts:881](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L881)
