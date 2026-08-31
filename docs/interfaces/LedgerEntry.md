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

[src/scheduling/types.ts:796](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L796)

___

### dueBy

• `Optional` **dueBy**: `string`

ISO date by which the obligation must be discharged.

#### Defined in

[src/scheduling/types.ts:794](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L794)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:791](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L791)

___

### kind

• **kind**: ``"compensatoryRest"`` \| ``"substituteRestDay"`` \| ``"lateCancellationPay"`` \| ``"timeOffInLieu"``

#### Defined in

[src/scheduling/types.ts:790](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L790)

___

### minutes

• `Optional` **minutes**: `number`

#### Defined in

[src/scheduling/types.ts:792](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L792)

___

### reason

• **reason**: `string`

#### Defined in

[src/scheduling/types.ts:795](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L795)
