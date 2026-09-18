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

[src/scheduling/types.ts:1057](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1057)

___

### dueBy

• `Optional` **dueBy**: `string`

ISO date by which the obligation must be discharged.

#### Defined in

[src/scheduling/types.ts:1055](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1055)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:1052](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1052)

___

### kind

• **kind**: ``"compensatoryRest"`` \| ``"substituteRestDay"`` \| ``"lateCancellationPay"`` \| ``"timeOffInLieu"``

#### Defined in

[src/scheduling/types.ts:1051](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1051)

___

### minutes

• `Optional` **minutes**: `number`

#### Defined in

[src/scheduling/types.ts:1053](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1053)

___

### reason

• **reason**: `string`

#### Defined in

[src/scheduling/types.ts:1056](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L1056)
