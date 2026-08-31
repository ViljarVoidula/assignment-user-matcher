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

[src/scheduling/types.ts:93](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L93)

___

### from

• `Optional` **from**: `string`

Wall-clock window within the day. Omit for the whole day.

#### Defined in

[src/scheduling/types.ts:98](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L98)

___

### fromDate

• `Optional` **fromDate**: `string`

Inclusive ISO date bounds. Omit for the whole period.

#### Defined in

[src/scheduling/types.ts:95](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L95)

___

### kind

• **kind**: ``"unavailable"`` \| ``"available"`` \| ``"preferred"`` \| ``"avoid"``

`unavailable` is a hard blackout; `available` restricts to the listed
windows (any shift outside every `available` rule is ineligible);
`preferred` / `avoid` are soft and scale by `weight`.

#### Defined in

[src/scheduling/types.ts:105](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L105)

___

### to

• `Optional` **to**: `string`

#### Defined in

[src/scheduling/types.ts:99](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L99)

___

### toDate

• `Optional` **toDate**: `string`

#### Defined in

[src/scheduling/types.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L96)

___

### weight

• `Optional` **weight**: `number`

Soft-rule strength. Defaults to 1.

#### Defined in

[src/scheduling/types.ts:107](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L107)
