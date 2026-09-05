[assignment-user-matcher](../README.md) / [Exports](../modules.md) / DailyRestRule

# Interface: DailyRestRule

Daily rest — Directive 2003/88/EC Art 3 and its national variants.

## Table of contents

### Properties

- [compensateWithinDays](DailyRestRule.md#compensatewithindays)
- [minMinutes](DailyRestRule.md#minminutes)
- [mustContainClockRange](DailyRestRule.md#mustcontainclockrange)
- [perWindowMinutes](DailyRestRule.md#perwindowminutes)
- [reducibleToMinutes](DailyRestRule.md#reducibletominutes)
- [reductionsPer](DailyRestRule.md#reductionsper)

## Properties

### compensateWithinDays

• `Optional` **compensateWithinDays**: `number`

Deadline for the compensatory rest a derogation creates. Jaeger (C-151/02)
requires it "immediately following" the period worked; national rules give
a window instead (DE 28 days, AT 10).

#### Defined in

[src/scheduling/types.ts:260](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L260)

___

### minMinutes

• **minMinutes**: `number`

e.g. 660 (EU floor), 720 (ES, RO), 540 (FI period work).

#### Defined in

[src/scheduling/types.ts:248](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L248)

___

### mustContainClockRange

• `Optional` **mustContainClockRange**: [`ClockRangeConfig`](ClockRangeConfig.md)

A clock band the rest must contain. Sweden requires the 11h to include
00:00–05:00 — a *positional* rule, not a duration one.

#### Defined in

[src/scheduling/types.ts:265](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L265)

___

### perWindowMinutes

• `Optional` **perWindowMinutes**: `number`

Window the rest must fit in. Defaults to 1440 — "in every rolling 24h".

#### Defined in

[src/scheduling/types.ts:250](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L250)

___

### reducibleToMinutes

• `Optional` **reducibleToMinutes**: `number`

Floor a permitted derogation may reduce rest to (NL/DK/CZ 480, FR 540).

#### Defined in

[src/scheduling/types.ts:252](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L252)

___

### reductionsPer

• `Optional` **reductionsPer**: `Object`

How often the reduction may be used, e.g. NL's "once per 7×24h".

#### Type declaration

| Name | Type |
| :------ | :------ |
| `max` | `number` |
| `windowDays` | `number` |

#### Defined in

[src/scheduling/types.ts:254](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L254)
