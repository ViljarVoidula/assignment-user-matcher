[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SlotAvailability

# Interface: SlotAvailability

A worker's availability for booking, supplied by the caller.

The library owns the *shape* of a booking rule and nothing else: it knows
that two appointments cannot overlap, because it owns every booking. It has
no idea what a leave request or a rostered shift is, and inventing one would
put a second, smaller copy of the caller's own policy inside the engine.

So availability is typed input. `blocked` refuses a booking that overlaps
it — an approved absence is a fact the caller owns, and booking over it is
simply wrong. `warnings` allow the booking and are recorded on it: a roster
is a plan rather than an authority, a worker's personal calendar is not the
employer's to veto on, and a genuine emergency needs an escape hatch.

## Table of contents

### Properties

- [blocked](SlotAvailability.md#blocked)
- [userId](SlotAvailability.md#userid)
- [warnings](SlotAvailability.md#warnings)

## Properties

### blocked

• `Optional` **blocked**: \{ `from`: `number` ; `reason`: `string` ; `to`: `number`  }[]

Intervals that refuse a booking overlapping them.

#### Defined in

[src/types/matcher.ts:148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L148)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L146)

___

### warnings

• `Optional` **warnings**: \{ `from`: `number` ; `reason`: `string` ; `to`: `number`  }[]

Intervals that allow the booking but record the reason on it.

#### Defined in

[src/types/matcher.ts:150](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L150)
