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
on average. Estonia requires 36h every week _and_ 48h on average.

#### Defined in

[src/scheduling/types.ts:241](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L241)

---

### averageOverDays

• `Optional` **averageOverDays**: `number`

Averaging window in days; Art 16(a) caps this at 14.

#### Defined in

[src/scheduling/types.ts:243](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L243)

---

### minMinutes

• **minMinutes**: `number`

Continuous rest required per window: 2100 (35h), 2160 (36h), 2880 (48h).

#### Defined in

[src/scheduling/types.ts:234](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L234)

---

### windowDays

• **windowDays**: `number`

Length of the window in days. Normally 7.

#### Defined in

[src/scheduling/types.ts:236](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L236)
