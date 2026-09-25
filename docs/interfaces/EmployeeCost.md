[assignment-user-matcher](../README.md) / [Exports](../modules.md) / EmployeeCost

# Interface: EmployeeCost

Cost inputs. All money is in minor units (cents) to keep arithmetic integral.

## Table of contents

### Properties

- [hourlyRateCents](EmployeeCost.md#hourlyratecents)
- [overtimeAfterMinutes](EmployeeCost.md#overtimeafterminutes)
- [overtimeMultiplier](EmployeeCost.md#overtimemultiplier)
- [premiums](EmployeeCost.md#premiums)
- [stacking](EmployeeCost.md#stacking)
- [standbyRateFraction](EmployeeCost.md#standbyratefraction)

## Properties

### hourlyRateCents

• `Optional` **hourlyRateCents**: `number`

#### Defined in

[src/scheduling/types.ts:196](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L196)

___

### overtimeAfterMinutes

• `Optional` **overtimeAfterMinutes**: `number`

Minutes in the period after which overtime rates apply.

#### Defined in

[src/scheduling/types.ts:198](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L198)

___

### overtimeMultiplier

• `Optional` **overtimeMultiplier**: `number`

#### Defined in

[src/scheduling/types.ts:199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L199)

___

### premiums

• `Optional` **premiums**: \{ `multiplier`: `number` ; `predicate`: ``"night"`` \| ``"sunday"`` \| ``"holiday"``  }[]

Premium multipliers by predicate, applied to the minutes actually inside each band.

#### Defined in

[src/scheduling/types.ts:208](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L208)

___

### stacking

• `Optional` **stacking**: ``"add"`` \| ``"max"``

How multiple applicable premiums combine. Romania requires `'add'`
(overtime 75% + night 25% + holiday 100% stack); most others take the max.
Defaults to `'max'`.

#### Defined in

[src/scheduling/types.ts:214](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L214)

___

### standbyRateFraction

• `Optional` **standbyRateFraction**: `number`

Fraction of the hourly rate paid for the non-working remainder of a
duty-classified span — stand-by hours that occupy the clock without
counting as work. Estonia's *valveaeg* owes at least 1/10 of the agreed
wage (`0.1`); unset means the remainder is unpaid.

#### Defined in

[src/scheduling/types.ts:206](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L206)
