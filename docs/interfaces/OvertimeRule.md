[assignment-user-matcher](../README.md) / [Exports](../modules.md) / OvertimeRule

# Interface: OvertimeRule

The ordinary-vs-overtime split.

`WorkingTimeLimits` caps *total* working time; several member states also
regulate the overtime portion by itself — Estonia makes overtime conditional
on agreement and compensates it primarily in time off, Germany's ArbZG builds
the 10h day out of 8 ordinary + 2 averaged, Austria caps overtime separately
from normal hours. That needs a defined ordinary baseline, which is what the
`ordinary*` fields (or a person's `contract.weeklyMinutes`) supply; everything
worked beyond the baseline in a window is that window's overtime.

## Table of contents

### Properties

- [citation](OvertimeRule.md#citation)
- [compensation](OvertimeRule.md#compensation)
- [maxOvertimeInWindow](OvertimeRule.md#maxovertimeinwindow)
- [maxOvertimePerDayMinutes](OvertimeRule.md#maxovertimeperdayminutes)
- [ordinaryPerDayMinutes](OvertimeRule.md#ordinaryperdayminutes)
- [ordinaryPerWeekMinutes](OvertimeRule.md#ordinaryperweekminutes)
- [requiresConsent](OvertimeRule.md#requiresconsent)

## Properties

### citation

• `Optional` **citation**: `string`

Legal source echoed into verdicts and violations.

#### Defined in

[src/scheduling/types.ts:342](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L342)

___

### compensation

• `Optional` **compensation**: ``"timeOff"`` \| ``"pay"``

How overtime is compensated. `'timeOff'` accrues a `timeOffInLieu` ledger
entry per employee; `'pay'` leaves compensation to the cost model.

#### Defined in

[src/scheduling/types.ts:340](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L340)

___

### maxOvertimeInWindow

• `Optional` **maxOvertimeInWindow**: \{ `label?`: `string` ; `maxMinutes`: `number` ; `windowDays`: `number`  }[]

Caps on overtime minutes over rolling windows, each measured against the
weekly ordinary baseline pro-rated to the window. Requires a weekly
baseline (`ordinaryPerWeekMinutes` or per-person contract minutes).

#### Defined in

[src/scheduling/types.ts:330](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L330)

___

### maxOvertimePerDayMinutes

• `Optional` **maxOvertimePerDayMinutes**: `number`

Cap on overtime minutes in any rolling 24h. Requires `ordinaryPerDayMinutes`.

#### Defined in

[src/scheduling/types.ts:324](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L324)

___

### ordinaryPerDayMinutes

• `Optional` **ordinaryPerDayMinutes**: `number`

Working minutes per rolling 24h beyond which time is overtime.

#### Defined in

[src/scheduling/types.ts:316](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L316)

___

### ordinaryPerWeekMinutes

• `Optional` **ordinaryPerWeekMinutes**: `number`

Working minutes per rolling 7 days beyond which time is overtime.
A person's `contract.weeklyMinutes` overrides this — a part-timer's
overtime starts at their agreed hours, not at full time.

#### Defined in

[src/scheduling/types.ts:322](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L322)

___

### requiresConsent

• `Optional` **requiresConsent**: `boolean`

Overtime needs the employee's agreement (`Employee.overtimeConsent`).
Without recorded consent, any overtime at all is a hard breach.

#### Defined in

[src/scheduling/types.ts:335](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L335)
