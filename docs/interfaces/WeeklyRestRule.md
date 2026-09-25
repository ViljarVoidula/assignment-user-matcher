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

[src/scheduling/types.ts:349](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L349)

___

### averageOverDays

• `Optional` **averageOverDays**: `number`

Averaging window in days; Art 16(a) caps this at 14.

#### Defined in

[src/scheduling/types.ts:351](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L351)

___

### minMinutes

• **minMinutes**: `number`

Continuous rest required per window: 2100 (35h), 2160 (36h), 2880 (48h).

#### Defined in

[src/scheduling/types.ts:342](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L342)

___

### windowDays

• **windowDays**: `number`

Length of the window in days. Normally 7.

#### Defined in

[src/scheduling/types.ts:344](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L344)
