[assignment-user-matcher](../README.md) / [Exports](../modules.md) / BreakRule

# Interface: BreakRule

In-shift break entitlement. Art 4 fixes the >6h trigger but leaves the
duration to member states — 10 min (IT floor) to 60–120 min (PT).

## Table of contents

### Properties

- [afterMinutes](BreakRule.md#afterminutes)
- [interruptible](BreakRule.md#interruptible)
- [minMinutes](BreakRule.md#minminutes)
- [paid](BreakRule.md#paid)

## Properties

### afterMinutes

• **afterMinutes**: `number`

Working minutes after which the break is owed.

#### Defined in

[src/scheduling/types.ts:474](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L474)

___

### interruptible

• `Optional` **interruptible**: `boolean`

A break the worker must stay reachable through. C-107/19 holds such a
break is working time *and* does not discharge the Art 4 entitlement, so
an interruptible break never satisfies this rule.

#### Defined in

[src/scheduling/types.ts:487](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L487)

___

### minMinutes

• **minMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:475](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L475)

___

### paid

• `Optional` **paid**: `boolean`

The entitlement is to a *paid* break, so only `ShiftTemplate.paidBreakMinutes`
discharges it — an unpaid break costs the worker wages and does not.
Unset, any declared break (paid or unpaid) counts.

#### Defined in

[src/scheduling/types.ts:481](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L481)
