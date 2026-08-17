[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkingTimeRules

# Interface: WorkingTimeRules

The labour-law layer, as plain typed configuration.

Every field is optional and every value is caller-supplied: the library ships
the _shapes_ that EU working-time law takes, never a jurisdiction's numbers.
That split matters twice over — legal values differ per member state, per
sector and per collective agreement and change without notice; and for the
sectoral regimes that _replace_ the Working Time Directive rather than relax
it (Art 14/20/21 — mobile workers, seafarers), the correct encoding is to
omit the displaced rule entirely rather than to widen its bounds.

`Employee.rules` overrides this per person, which is how age classes,
individual opt-outs and hazardous-work status are expressed.

## Table of contents

### Properties

- [aggregation](WorkingTimeRules.md#aggregation)
- [breaks](WorkingTimeRules.md#breaks)
- [consecutive](WorkingTimeRules.md#consecutive)
- [dailyRest](WorkingTimeRules.md#dailyrest)
- [dutyQuotas](WorkingTimeRules.md#dutyquotas)
- [engagement](WorkingTimeRules.md#engagement)
- [fairness](WorkingTimeRules.md#fairness)
- [minimumStartInterval](WorkingTimeRules.md#minimumstartinterval)
- [nightWork](WorkingTimeRules.md#nightwork)
- [notice](WorkingTimeRules.md#notice)
- [overtime](WorkingTimeRules.md#overtime)
- [restDays](WorkingTimeRules.md#restdays)
- [weeklyRest](WorkingTimeRules.md#weeklyrest)
- [workingTime](WorkingTimeRules.md#workingtime)

## Properties

### aggregation

• `Optional` **aggregation**: `Object`

How to aggregate a person's assignments across records.

#### Type declaration

| Name               | Type      |
| :----------------- | :-------- |
| `acrossContracts?` | `boolean` |

#### Defined in

[src/scheduling/types.ts:205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L205)

---

### breaks

• `Optional` **breaks**: `BreakRule`[]

#### Defined in

[src/scheduling/types.ts:198](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L198)

---

### consecutive

• `Optional` **consecutive**: `ConsecutiveRule`

#### Defined in

[src/scheduling/types.ts:189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L189)

---

### dailyRest

• `Optional` **dailyRest**: [`DailyRestRule`](DailyRestRule.md)

#### Defined in

[src/scheduling/types.ts:182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L182)

---

### dutyQuotas

• `Optional` **dutyQuotas**: [`DutyQuota`](DutyQuota.md)[]

Rolling volume caps on particular duty types, matched on `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:188](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L188)

---

### engagement

• `Optional` **engagement**: `EngagementRule`

#### Defined in

[src/scheduling/types.ts:200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L200)

---

### fairness

• `Optional` **fairness**: `FairnessRule`[]

Fairness dimensions to equalise. Soft by nature.

#### Defined in

[src/scheduling/types.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L203)

---

### minimumStartInterval

• `Optional` **minimumStartInterval**: `Object`

Minimum minutes between the _starts_ of two assignments. Poland's
_doba pracownicza_ makes restarting inside 24h of the previous start
overtime regardless of how much rest was taken, so it is keyed on starts,
not gaps — a distinct shape from `dailyRest`.

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `minMinutes` | `number` |

#### Defined in

[src/scheduling/types.ts:196](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L196)

---

### nightWork

• `Optional` **nightWork**: [`NightWorkRule`](NightWorkRule.md)

#### Defined in

[src/scheduling/types.ts:197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L197)

---

### notice

• `Optional` **notice**: `NoticeRule`

#### Defined in

[src/scheduling/types.ts:201](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L201)

---

### overtime

• `Optional` **overtime**: [`OvertimeRule`](OvertimeRule.md)

The ordinary-vs-overtime split and its caps.

#### Defined in

[src/scheduling/types.ts:186](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L186)

---

### restDays

• `Optional` **restDays**: `RestDayRule`

#### Defined in

[src/scheduling/types.ts:199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L199)

---

### weeklyRest

• `Optional` **weeklyRest**: [`WeeklyRestRule`](WeeklyRestRule.md)

#### Defined in

[src/scheduling/types.ts:183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L183)

---

### workingTime

• `Optional` **workingTime**: [`WorkingTimeLimits`](WorkingTimeLimits.md)

#### Defined in

[src/scheduling/types.ts:184](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L184)
