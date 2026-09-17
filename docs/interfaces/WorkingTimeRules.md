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
- [contract](WorkingTimeRules.md#contract)
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

[src/scheduling/types.ts:293](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L293)

___

### breaks

• `Optional` **breaks**: [`BreakRule`](BreakRule.md)[]

#### Defined in

[src/scheduling/types.ts:286](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L286)

___

### consecutive

• `Optional` **consecutive**: [`ConsecutiveRule`](ConsecutiveRule.md)

#### Defined in

[src/scheduling/types.ts:277](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L277)

___

### contract

• `Optional` **contract**: [`ContractHoursRule`](ContractHoursRule.md)

Contracted hours: the full-time week `fte` is a fraction of, and how far a plan may stray from a person's contract.

#### Defined in

[src/scheduling/types.ts:274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L274)

___

### dailyRest

• `Optional` **dailyRest**: [`DailyRestRule`](DailyRestRule.md)

#### Defined in

[src/scheduling/types.ts:268](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L268)

___

### dutyQuotas

• `Optional` **dutyQuotas**: [`DutyQuota`](DutyQuota.md)[]

Rolling volume caps on particular duty types, matched on `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:276](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L276)

___

### engagement

• `Optional` **engagement**: [`EngagementRule`](EngagementRule.md)

#### Defined in

[src/scheduling/types.ts:288](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L288)

___

### fairness

• `Optional` **fairness**: [`FairnessRule`](FairnessRule.md)[]

Fairness dimensions to equalise. Soft by nature.

#### Defined in

[src/scheduling/types.ts:291](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L291)

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

[src/scheduling/types.ts:284](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L284)

___

### nightWork

• `Optional` **nightWork**: [`NightWorkRule`](NightWorkRule.md)

#### Defined in

[src/scheduling/types.ts:285](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L285)

___

### notice

• `Optional` **notice**: [`NoticeRule`](NoticeRule.md)

#### Defined in

[src/scheduling/types.ts:289](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L289)

___

### overtime

• `Optional` **overtime**: [`OvertimeRule`](OvertimeRule.md)

The ordinary-vs-overtime split and its caps.

#### Defined in

[src/scheduling/types.ts:272](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L272)

___

### restDays

• `Optional` **restDays**: [`RestDayRule`](RestDayRule.md)

#### Defined in

[src/scheduling/types.ts:287](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L287)

___

### weeklyRest

• `Optional` **weeklyRest**: [`WeeklyRestRule`](WeeklyRestRule.md)

#### Defined in

[src/scheduling/types.ts:269](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L269)

___

### workingTime

• `Optional` **workingTime**: [`WorkingTimeLimits`](WorkingTimeLimits.md)

#### Defined in

[src/scheduling/types.ts:270](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L270)
