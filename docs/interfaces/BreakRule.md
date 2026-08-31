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

[src/scheduling/types.ts:422](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L422)

___

### interruptible

• `Optional` **interruptible**: `boolean`

A break the worker must stay reachable through. C-107/19 holds such a
break is working time *and* does not discharge the Art 4 entitlement, so
an interruptible break never satisfies this rule.

#### Defined in

[src/scheduling/types.ts:435](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L435)

___

### minMinutes

• **minMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L423)

___

### paid

• `Optional` **paid**: `boolean`

The entitlement is to a *paid* break, so only `ShiftTemplate.paidBreakMinutes`
discharges it — an unpaid break costs the worker wages and does not.
Unset, any declared break (paid or unpaid) counts.

#### Defined in

[src/scheduling/types.ts:429](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L429)
