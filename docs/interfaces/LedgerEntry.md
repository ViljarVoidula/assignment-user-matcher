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

[src/scheduling/types.ts:761](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L761)

___

### dueBy

• `Optional` **dueBy**: `string`

ISO date by which the obligation must be discharged.

#### Defined in

[src/scheduling/types.ts:759](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L759)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:756](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L756)

___

### kind

• **kind**: ``"compensatoryRest"`` \| ``"substituteRestDay"`` \| ``"lateCancellationPay"`` \| ``"timeOffInLieu"``

#### Defined in

[src/scheduling/types.ts:755](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L755)

___

### minutes

• `Optional` **minutes**: `number`

#### Defined in

[src/scheduling/types.ts:757](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L757)

___

### reason

• **reason**: `string`

#### Defined in

[src/scheduling/types.ts:760](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L760)
