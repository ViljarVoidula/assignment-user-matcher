[assignment-user-matcher](../README.md) / [Exports](../modules.md) / NightWorkRule

# Interface: NightWorkRule

Night work — Art 2(3), 2(4), 8 and their national variants.

## Table of contents

### Properties

- [absoluteWhenHazardous](NightWorkRule.md#absolutewhenhazardous)
- [averageWindowDays](NightWorkRule.md#averagewindowdays)
- [maxShiftMinutes](NightWorkRule.md#maxshiftminutes)
- [prohibitedRanges](NightWorkRule.md#prohibitedranges)
- [qualifiesAfterMinutes](NightWorkRule.md#qualifiesafterminutes)
- [volumeQuotas](NightWorkRule.md#volumequotas)
- [window](NightWorkRule.md#window)

## Properties

### absoluteWhenHazardous

• `Optional` **absoluteWhenHazardous**: `boolean`

Art 8(b): for work involving special hazards or heavy strain the 8h is an
absolute per-24h cap with no averaging. Set by `Employee.protections`
carrying `hazardousNight`, or globally here.

#### Defined in

[src/scheduling/types.ts:378](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L378)

---

### averageWindowDays

• `Optional` **averageWindowDays**: `number`

Days over which the 8h night limit is averaged. Art 8(a) sets no EU ceiling.

#### Defined in

[src/scheduling/types.ts:372](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L372)

---

### maxShiftMinutes

• `Optional` **maxShiftMinutes**: `number`

Cap on a night worker's shift, normally 480.

#### Defined in

[src/scheduling/types.ts:370](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L370)

---

### prohibitedRanges

• `Optional` **prohibitedRanges**: `ClockRangeConfig`[]

Clock bands where work is barred outright (94/33/EC bars adolescents 00:00–04:00).

#### Defined in

[src/scheduling/types.ts:382](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L382)

---

### qualifiesAfterMinutes

• `Optional` **qualifiesAfterMinutes**: `number`

Night minutes in a shift that make it a night shift. Art 2(4)(a) uses 180.

#### Defined in

[src/scheduling/types.ts:368](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L368)

---

### volumeQuotas

• `Optional` **volumeQuotas**: `NightVolumeQuota`[]

Caps on how many night shifts may fall in a window, optionally filtered by end time.

#### Defined in

[src/scheduling/types.ts:380](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L380)

---

### window

• **window**: `ClockRangeConfig`

The night band. Art 2(3) requires at least 7 hours including 00:00–05:00,
but the exact window is national: 20:00–06:00 (BE) through 00:00–07:00 (IE),
and Poland lets the employer choose any 8h band within 21:00–07:00.

#### Defined in

[src/scheduling/types.ts:366](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L366)
