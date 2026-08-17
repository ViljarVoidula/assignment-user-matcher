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

[src/scheduling/types.ts:223](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L223)

---

### minMinutes

• **minMinutes**: `number`

e.g. 660 (EU floor), 720 (ES, RO), 540 (FI period work).

#### Defined in

[src/scheduling/types.ts:211](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L211)

---

### mustContainClockRange

• `Optional` **mustContainClockRange**: `ClockRangeConfig`

A clock band the rest must contain. Sweden requires the 11h to include
00:00–05:00 — a _positional_ rule, not a duration one.

#### Defined in

[src/scheduling/types.ts:228](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L228)

---

### perWindowMinutes

• `Optional` **perWindowMinutes**: `number`

Window the rest must fit in. Defaults to 1440 — "in every rolling 24h".

#### Defined in

[src/scheduling/types.ts:213](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L213)

---

### reducibleToMinutes

• `Optional` **reducibleToMinutes**: `number`

Floor a permitted derogation may reduce rest to (NL/DK/CZ 480, FR 540).

#### Defined in

[src/scheduling/types.ts:215](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L215)

---

### reductionsPer

• `Optional` **reductionsPer**: `Object`

How often the reduction may be used, e.g. NL's "once per 7×24h".

#### Type declaration

| Name         | Type     |
| :----------- | :------- |
| `max`        | `number` |
| `windowDays` | `number` |

#### Defined in

[src/scheduling/types.ts:217](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L217)
