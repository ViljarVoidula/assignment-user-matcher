[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AvailabilityRule

# Interface: AvailabilityRule

A recurring availability or preference window.

## Table of contents

### Properties

- [daysOfWeek](AvailabilityRule.md#daysofweek)
- [from](AvailabilityRule.md#from)
- [fromDate](AvailabilityRule.md#fromdate)
- [id](AvailabilityRule.md#id)
- [kind](AvailabilityRule.md#kind)
- [outsideBudget](AvailabilityRule.md#outsidebudget)
- [priority](AvailabilityRule.md#priority)
- [shiftTypeTags](AvailabilityRule.md#shifttypetags)
- [to](AvailabilityRule.md#to)
- [toDate](AvailabilityRule.md#todate)
- [weight](AvailabilityRule.md#weight)

## Properties

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

ISO weekdays 1 (Mon) .. 7 (Sun). Omit for every day.

#### Defined in

[src/scheduling/types.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L93)

___

### from

• `Optional` **from**: `string`

Wall-clock window within the day. Omit for the whole day.

#### Defined in

[src/scheduling/types.ts:98](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L98)

___

### fromDate

• `Optional` **fromDate**: `string`

Inclusive ISO date bounds. Omit for the whole period.

#### Defined in

[src/scheduling/types.ts:95](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L95)

___

### id

• `Optional` **id**: `string`

Caller's identifier for this rule, echoed in `result.preferences`.

#### Defined in

[src/scheduling/types.ts:121](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L121)

___

### kind

• **kind**: ``"unavailable"`` \| ``"available"`` \| ``"preferred"`` \| ``"avoid"``

`unavailable` is a hard blackout; `available` restricts to the listed
windows (any shift outside every `available` rule is ineligible);
`preferred` / `avoid` are soft and scale by `weight`.

#### Defined in

[src/scheduling/types.ts:105](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L105)

___

### outsideBudget

• `Optional` **outsideBudget**: `boolean`

Leave this rule out of `objectives.preferences.budget` scaling. For
imported facts such as calendar busy time, which are not wishes and
would otherwise dilute the person's real ones.

#### Defined in

[src/scheduling/types.ts:127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L127)

___

### priority

• `Optional` **priority**: ``"normal"`` \| ``"important"``

`important` is multiplied by `objectives.preferences.importantWeight`.
Soft kinds only; a wish that cannot be refused is time off, not a
preference.

#### Defined in

[src/scheduling/types.ts:119](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L119)

___

### shiftTypeTags

• `Optional` **shiftTypeTags**: `string`[]

Match only occurrences whose `shiftTypeTag` is listed. ANDed with the
day, date and clock conditions, so "prefer nights" needs no clock window
and survives a change to when nights start.

#### Defined in

[src/scheduling/types.ts:113](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L113)

___

### to

• `Optional` **to**: `string`

#### Defined in

[src/scheduling/types.ts:99](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L99)

___

### toDate

• `Optional` **toDate**: `string`

#### Defined in

[src/scheduling/types.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L96)

___

### weight

• `Optional` **weight**: `number`

Soft-rule strength. Defaults to 1.

#### Defined in

[src/scheduling/types.ts:107](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L107)
