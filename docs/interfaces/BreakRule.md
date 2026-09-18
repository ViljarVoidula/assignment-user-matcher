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

[src/scheduling/types.ts:540](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L540)

___

### interruptible

• `Optional` **interruptible**: `boolean`

A break the worker must stay reachable through. C-107/19 holds such a
break is working time *and* does not discharge the Art 4 entitlement, so
an interruptible break never satisfies this rule.

#### Defined in

[src/scheduling/types.ts:553](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L553)

___

### minMinutes

• **minMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:541](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L541)

___

### paid

• `Optional` **paid**: `boolean`

The entitlement is to a *paid* break, so only `ShiftTemplate.paidBreakMinutes`
discharges it — an unpaid break costs the worker wages and does not.
Unset, any declared break (paid or unpaid) counts.

#### Defined in

[src/scheduling/types.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L547)
