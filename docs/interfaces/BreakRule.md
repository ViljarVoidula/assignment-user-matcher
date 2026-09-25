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

[src/scheduling/types.ts:560](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L560)

___

### interruptible

• `Optional` **interruptible**: `boolean`

A break the worker must stay reachable through. C-107/19 holds such a
break is working time *and* does not discharge the Art 4 entitlement, so
an interruptible break never satisfies this rule.

#### Defined in

[src/scheduling/types.ts:573](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L573)

___

### minMinutes

• **minMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L561)

___

### paid

• `Optional` **paid**: `boolean`

The entitlement is to a *paid* break, so only `ShiftTemplate.paidBreakMinutes`
discharges it — an unpaid break costs the worker wages and does not.
Unset, any declared break (paid or unpaid) counts.

#### Defined in

[src/scheduling/types.ts:567](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L567)
