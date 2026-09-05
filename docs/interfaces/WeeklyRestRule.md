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

[src/scheduling/types.ts:278](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L278)

___

### averageOverDays

• `Optional` **averageOverDays**: `number`

Averaging window in days; Art 16(a) caps this at 14.

#### Defined in

[src/scheduling/types.ts:280](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L280)

___

### minMinutes

• **minMinutes**: `number`

Continuous rest required per window: 2100 (35h), 2160 (36h), 2880 (48h).

#### Defined in

[src/scheduling/types.ts:271](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L271)

___

### windowDays

• **windowDays**: `number`

Length of the window in days. Normally 7.

#### Defined in

[src/scheduling/types.ts:273](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L273)
