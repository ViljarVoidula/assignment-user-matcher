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

[src/scheduling/types.ts:176](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L176)

___

### overtimeAfterMinutes

• `Optional` **overtimeAfterMinutes**: `number`

Minutes in the period after which overtime rates apply.

#### Defined in

[src/scheduling/types.ts:178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L178)

___

### overtimeMultiplier

• `Optional` **overtimeMultiplier**: `number`

#### Defined in

[src/scheduling/types.ts:179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L179)

___

### premiums

• `Optional` **premiums**: \{ `multiplier`: `number` ; `predicate`: ``"night"`` \| ``"sunday"`` \| ``"holiday"``  }[]

Premium multipliers by predicate, applied to the minutes actually inside each band.

#### Defined in

[src/scheduling/types.ts:188](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L188)

___

### stacking

• `Optional` **stacking**: ``"add"`` \| ``"max"``

How multiple applicable premiums combine. Romania requires `'add'`
(overtime 75% + night 25% + holiday 100% stack); most others take the max.
Defaults to `'max'`.

#### Defined in

[src/scheduling/types.ts:194](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L194)

___

### standbyRateFraction

• `Optional` **standbyRateFraction**: `number`

Fraction of the hourly rate paid for the non-working remainder of a
duty-classified span — stand-by hours that occupy the clock without
counting as work. Estonia's *valveaeg* owes at least 1/10 of the agreed
wage (`0.1`); unset means the remainder is unpaid.

#### Defined in

[src/scheduling/types.ts:186](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L186)
