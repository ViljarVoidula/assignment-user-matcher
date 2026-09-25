[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SlotBooking

# Interface: SlotBooking

A reservation of one worker's time for one slotted assignment.

## Table of contents

### Properties

- [assignmentId](SlotBooking.md#assignmentid)
- [bookedAt](SlotBooking.md#bookedat)
- [endAt](SlotBooking.md#endat)
- [source](SlotBooking.md#source)
- [startAt](SlotBooking.md#startat)
- [userId](SlotBooking.md#userid)
- [warnings](SlotBooking.md#warnings)

## Properties

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:155](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L155)

___

### bookedAt

• **bookedAt**: `number`

When the reservation was made.

#### Defined in

[src/types/matcher.ts:160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L160)

___

### endAt

• **endAt**: `number`

#### Defined in

[src/types/matcher.ts:158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L158)

___

### source

• **source**: ``"sweep"`` \| ``"manual"``

How it was made: the sweep, or a named operator decision.

#### Defined in

[src/types/matcher.ts:162](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L162)

___

### startAt

• **startAt**: `number`

#### Defined in

[src/types/matcher.ts:157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L157)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:156](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L156)

___

### warnings

• `Optional` **warnings**: \{ `from`: `number` ; `reason`: `string` ; `to`: `number`  }[]

Soft conflicts recorded at booking time — outside a rostered shift, a
busy personal calendar. Present so the planner reviewing the week can
see why a booking is worth a second look.

#### Defined in

[src/types/matcher.ts:168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L168)
