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

[src/scheduling/types.ts:313](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L313)

___

### breaks

• `Optional` **breaks**: [`BreakRule`](BreakRule.md)[]

#### Defined in

[src/scheduling/types.ts:306](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L306)

___

### consecutive

• `Optional` **consecutive**: [`ConsecutiveRule`](ConsecutiveRule.md)

#### Defined in

[src/scheduling/types.ts:297](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L297)

___

### contract

• `Optional` **contract**: [`ContractHoursRule`](ContractHoursRule.md)

Contracted hours: the full-time week `fte` is a fraction of, and how far a plan may stray from a person's contract.

#### Defined in

[src/scheduling/types.ts:294](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L294)

___

### dailyRest

• `Optional` **dailyRest**: [`DailyRestRule`](DailyRestRule.md)

#### Defined in

[src/scheduling/types.ts:288](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L288)

___

### dutyQuotas

• `Optional` **dutyQuotas**: [`DutyQuota`](DutyQuota.md)[]

Rolling volume caps on particular duty types, matched on `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:296](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L296)

___

### engagement

• `Optional` **engagement**: [`EngagementRule`](EngagementRule.md)

#### Defined in

[src/scheduling/types.ts:308](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L308)

___

### fairness

• `Optional` **fairness**: [`FairnessRule`](FairnessRule.md)[]

Fairness dimensions to equalise. Soft by nature.

#### Defined in

[src/scheduling/types.ts:311](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L311)

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

[src/scheduling/types.ts:304](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L304)

___

### nightWork

• `Optional` **nightWork**: [`NightWorkRule`](NightWorkRule.md)

#### Defined in

[src/scheduling/types.ts:305](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L305)

___

### notice

• `Optional` **notice**: [`NoticeRule`](NoticeRule.md)

#### Defined in

[src/scheduling/types.ts:309](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L309)

___

### overtime

• `Optional` **overtime**: [`OvertimeRule`](OvertimeRule.md)

The ordinary-vs-overtime split and its caps.

#### Defined in

[src/scheduling/types.ts:292](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L292)

___

### restDays

• `Optional` **restDays**: [`RestDayRule`](RestDayRule.md)

#### Defined in

[src/scheduling/types.ts:307](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L307)

___

### weeklyRest

• `Optional` **weeklyRest**: [`WeeklyRestRule`](WeeklyRestRule.md)

#### Defined in

[src/scheduling/types.ts:289](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L289)

___

### workingTime

• `Optional` **workingTime**: [`WorkingTimeLimits`](WorkingTimeLimits.md)

#### Defined in

[src/scheduling/types.ts:290](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L290)
