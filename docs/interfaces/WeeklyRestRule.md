[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WeeklyRestRule

# Interface: WeeklyRestRule

Weekly rest — Art 5, with the Art 16(a) averaging option.

## Table of contents

### Properties

- [absoluteFloorMinutes](WeeklyRestRule.md#absolutefloorminutes)
- [averageOverDays](WeeklyRestRule.md#averageoverdays)
- [minMinutes](WeeklyRestRule.md#minminutes)
- [windowDays](WeeklyRestRule.md#windowdays)

## Properties

### absoluteFloorMinutes

• `Optional` **absoluteFloorMinutes**: `number`

A lower per-window floor that always holds when `minMinutes` is only met
on average. Estonia requires 36h every week *and* 48h on average.

#### Defined in

[src/scheduling/types.ts:329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L329)

___

### averageOverDays

• `Optional` **averageOverDays**: `number`

Averaging window in days; Art 16(a) caps this at 14.

#### Defined in

[src/scheduling/types.ts:331](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L331)

___

### minMinutes

• **minMinutes**: `number`

Continuous rest required per window: 2100 (35h), 2160 (36h), 2880 (48h).

#### Defined in

[src/scheduling/types.ts:322](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L322)

___

### windowDays

• **windowDays**: `number`

Length of the window in days. Normally 7.

#### Defined in

[src/scheduling/types.ts:324](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L324)
