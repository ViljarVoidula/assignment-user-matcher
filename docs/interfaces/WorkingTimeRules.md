[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkingTimeRules

# Interface: WorkingTimeRules

The labour-law layer, as plain typed configuration.

Every field is optional and every value is caller-supplied: the library ships
the *shapes* that EU working-time law takes, never a jurisdiction's numbers.
That split matters twice over — legal values differ per member state, per
sector and per collective agreement and change without notice; and for the
sectoral regimes that *replace* the Working Time Directive rather than relax
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

| Name | Type |
| :------ | :------ |
| `acrossContracts?` | `boolean` |

#### Defined in

[src/scheduling/types.ts:227](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L227)

___

### breaks

• `Optional` **breaks**: [`BreakRule`](BreakRule.md)[]

#### Defined in

[src/scheduling/types.ts:220](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L220)

___

### consecutive

• `Optional` **consecutive**: [`ConsecutiveRule`](ConsecutiveRule.md)

#### Defined in

[src/scheduling/types.ts:211](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L211)

___

### dailyRest

• `Optional` **dailyRest**: [`DailyRestRule`](DailyRestRule.md)

#### Defined in

[src/scheduling/types.ts:204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L204)

___

### dutyQuotas

• `Optional` **dutyQuotas**: [`DutyQuota`](DutyQuota.md)[]

Rolling volume caps on particular duty types, matched on `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:210](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L210)

___

### engagement

• `Optional` **engagement**: [`EngagementRule`](EngagementRule.md)

#### Defined in

[src/scheduling/types.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L222)

___

### fairness

• `Optional` **fairness**: [`FairnessRule`](FairnessRule.md)[]

Fairness dimensions to equalise. Soft by nature.

#### Defined in

[src/scheduling/types.ts:225](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L225)

___

### minimumStartInterval

• `Optional` **minimumStartInterval**: `Object`

Minimum minutes between the *starts* of two assignments. Poland's
*doba pracownicza* makes restarting inside 24h of the previous start
overtime regardless of how much rest was taken, so it is keyed on starts,
not gaps — a distinct shape from `dailyRest`.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `minMinutes` | `number` |

#### Defined in

[src/scheduling/types.ts:218](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L218)

___

### nightWork

• `Optional` **nightWork**: [`NightWorkRule`](NightWorkRule.md)

#### Defined in

[src/scheduling/types.ts:219](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L219)

___

### notice

• `Optional` **notice**: [`NoticeRule`](NoticeRule.md)

#### Defined in

[src/scheduling/types.ts:223](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L223)

___

### overtime

• `Optional` **overtime**: [`OvertimeRule`](OvertimeRule.md)

The ordinary-vs-overtime split and its caps.

#### Defined in

[src/scheduling/types.ts:208](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L208)

___

### restDays

• `Optional` **restDays**: [`RestDayRule`](RestDayRule.md)

#### Defined in

[src/scheduling/types.ts:221](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L221)

___

### weeklyRest

• `Optional` **weeklyRest**: [`WeeklyRestRule`](WeeklyRestRule.md)

#### Defined in

[src/scheduling/types.ts:205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L205)

___

### workingTime

• `Optional` **workingTime**: [`WorkingTimeLimits`](WorkingTimeLimits.md)

#### Defined in

[src/scheduling/types.ts:206](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L206)
