[assignment-user-matcher](../README.md) / [Exports](../modules.md) / OvertimeRule

# Interface: OvertimeRule

The ordinary-vs-overtime split.

`WorkingTimeLimits` caps _total_ working time; several member states also
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

[src/scheduling/types.ts:320](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L320)

---

### compensation

• `Optional` **compensation**: `"timeOff"` \| `"pay"`

How overtime is compensated. `'timeOff'` accrues a `timeOffInLieu` ledger
entry per employee; `'pay'` leaves compensation to the cost model.

#### Defined in

[src/scheduling/types.ts:318](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L318)

---

### maxOvertimeInWindow

• `Optional` **maxOvertimeInWindow**: \{ `label?`: `string` ; `maxMinutes`: `number` ; `windowDays`: `number` }[]

Caps on overtime minutes over rolling windows, each measured against the
weekly ordinary baseline pro-rated to the window. Requires a weekly
baseline (`ordinaryPerWeekMinutes` or per-person contract minutes).

#### Defined in

[src/scheduling/types.ts:308](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L308)

---

### maxOvertimePerDayMinutes

• `Optional` **maxOvertimePerDayMinutes**: `number`

Cap on overtime minutes in any rolling 24h. Requires `ordinaryPerDayMinutes`.

#### Defined in

[src/scheduling/types.ts:302](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L302)

---

### ordinaryPerDayMinutes

• `Optional` **ordinaryPerDayMinutes**: `number`

Working minutes per rolling 24h beyond which time is overtime.

#### Defined in

[src/scheduling/types.ts:294](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L294)

---

### ordinaryPerWeekMinutes

• `Optional` **ordinaryPerWeekMinutes**: `number`

Working minutes per rolling 7 days beyond which time is overtime.
A person's `contract.weeklyMinutes` overrides this — a part-timer's
overtime starts at their agreed hours, not at full time.

#### Defined in

[src/scheduling/types.ts:300](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L300)

---

### requiresConsent

• `Optional` **requiresConsent**: `boolean`

Overtime needs the employee's agreement (`Employee.overtimeConsent`).
Without recorded consent, any overtime at all is a hard breach.

#### Defined in

[src/scheduling/types.ts:313](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L313)
