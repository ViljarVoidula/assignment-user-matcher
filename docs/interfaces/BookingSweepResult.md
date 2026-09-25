[assignment-user-matcher](../README.md) / [Exports](../modules.md) / BookingSweepResult

# Interface: BookingSweepResult

What one pass of the booking sweep did.

## Table of contents

### Properties

- [booked](BookingSweepResult.md#booked)
- [unfillable](BookingSweepResult.md#unfillable)

## Properties

### booked

• **booked**: `number`

Reservations made this pass.

#### Defined in

[src/types/matcher.ts:209](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L209)

___

### unfillable

• **unfillable**: `number`

Slots that came due for booking with no eligible, free worker.

#### Defined in

[src/types/matcher.ts:211](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L211)
