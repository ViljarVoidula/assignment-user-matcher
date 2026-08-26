[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AvailabilityRule

# Interface: AvailabilityRule

A recurring availability or preference window.

## Table of contents

### Properties

- [daysOfWeek](AvailabilityRule.md#daysofweek)
- [from](AvailabilityRule.md#from)
- [fromDate](AvailabilityRule.md#fromdate)
- [kind](AvailabilityRule.md#kind)
- [to](AvailabilityRule.md#to)
- [toDate](AvailabilityRule.md#todate)
- [weight](AvailabilityRule.md#weight)

## Properties

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

ISO weekdays 1 (Mon) .. 7 (Sun). Omit for every day.

#### Defined in

[src/scheduling/types.ts:89](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L89)

___

### from

• `Optional` **from**: `string`

Wall-clock window within the day. Omit for the whole day.

#### Defined in

[src/scheduling/types.ts:94](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L94)

___

### fromDate

• `Optional` **fromDate**: `string`

Inclusive ISO date bounds. Omit for the whole period.

#### Defined in

[src/scheduling/types.ts:91](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L91)

___

### kind

• **kind**: ``"unavailable"`` \| ``"available"`` \| ``"preferred"`` \| ``"avoid"``

`unavailable` is a hard blackout; `available` restricts to the listed
windows (any shift outside every `available` rule is ineligible);
`preferred` / `avoid` are soft and scale by `weight`.

#### Defined in

[src/scheduling/types.ts:101](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L101)

___

### to

• `Optional` **to**: `string`

#### Defined in

[src/scheduling/types.ts:95](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L95)

___

### toDate

• `Optional` **toDate**: `string`

#### Defined in

[src/scheduling/types.ts:92](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L92)

___

### weight

• `Optional` **weight**: `number`

Soft-rule strength. Defaults to 1.

#### Defined in

[src/scheduling/types.ts:103](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/types.ts#L103)
