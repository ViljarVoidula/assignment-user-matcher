[assignment-user-matcher](../README.md) / [Exports](../modules.md) / PeriodClock

# Class: PeriodClock

Resolves wall-clock times in one IANA zone to period minutes and back.

Construct once per solve and share it: each instance memoizes the per-day UTC
offset, so repeated conversions cost a map lookup rather than an `Intl` call.

## Table of contents

### Constructors

- [constructor](PeriodClock.md#constructor)

### Properties

- [days](PeriodClock.md#days)
- [startDate](PeriodClock.md#startdate)
- [timeZone](PeriodClock.md#timezone)

### Methods

- [dateAt](PeriodClock.md#dateat)
- [dateOfMinute](PeriodClock.md#dateofminute)
- [dayIndexOf](PeriodClock.md#dayindexof)
- [dayIndexOfMinute](PeriodClock.md#dayindexofminute)
- [dayStartMinutes](PeriodClock.md#daystartminutes)
- [fromEpochMs](PeriodClock.md#fromepochms)
- [minutesInClockRange](PeriodClock.md#minutesinclockrange)
- [toEpochMs](PeriodClock.md#toepochms)
- [toISOString](PeriodClock.md#toisostring)
- [toPeriodMinutes](PeriodClock.md#toperiodminutes)
- [weekdayOfMinute](PeriodClock.md#weekdayofminute)

## Constructors

### constructor

• **new PeriodClock**(`startDate`, `days`, `timeZone?`): [`PeriodClock`](PeriodClock.md)

#### Parameters

| Name        | Type     | Default value |
| :---------- | :------- | :------------ |
| `startDate` | `string` | `undefined`   |
| `days`      | `number` | `undefined`   |
| `timeZone`  | `string` | `'UTC'`       |

#### Returns

[`PeriodClock`](PeriodClock.md)

#### Defined in

[src/scheduling/time.ts:53](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L53)

## Properties

### days

• `Readonly` **days**: `number`

#### Defined in

[src/scheduling/time.ts:45](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L45)

---

### startDate

• `Readonly` **startDate**: `string`

#### Defined in

[src/scheduling/time.ts:43](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L43)

---

### timeZone

• `Readonly` **timeZone**: `string`

#### Defined in

[src/scheduling/time.ts:44](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L44)

## Methods

### dateAt

▸ **dateAt**(`offset`): `string`

ISO date `offset` days after the period start.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `offset` | `number` |

#### Returns

`string`

#### Defined in

[src/scheduling/time.ts:84](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L84)

---

### dateOfMinute

▸ **dateOfMinute**(`minute`): `string`

The ISO date a period minute falls on.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `minute` | `number` |

#### Returns

`string`

#### Defined in

[src/scheduling/time.ts:117](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L117)

---

### dayIndexOf

▸ **dayIndexOf**(`date`): `number`

Day index of an ISO date relative to the period start; negative before it.

#### Parameters

| Name   | Type     |
| :----- | :------- |
| `date` | `string` |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:78](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L78)

---

### dayIndexOfMinute

▸ **dayIndexOfMinute**(`minute`): `number`

Day index containing a period minute. May fall outside `[0, days)` —
history from the previous period lives at negative indices.

`dayStartMinutes` is monotonic and never drifts from the nominal
1440-per-day grid by more than a DST offset, so the floor estimate is
correct or off by one; the two guards settle it.

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `minute` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:190](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L190)

---

### dayStartMinutes

▸ **dayStartMinutes**(`dayIndex`): `number`

True elapsed minutes from local midnight on the period start to local
midnight on `dayIndex` — 1440 per day except across a DST transition.

#### Parameters

| Name       | Type     |
| :--------- | :------- |
| `dayIndex` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:104](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L104)

---

### fromEpochMs

▸ **fromEpochMs**(`epochMs`): `number`

Period minutes for an absolute UTC epoch instant.

#### Parameters

| Name      | Type     |
| :-------- | :------- |
| `epochMs` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:139](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L139)

---

### minutesInClockRange

▸ **minutesInClockRange**(`range`, `clock`): `number`

Minutes of `range` that fall inside a recurring wall-clock window, summed
across every day the range touches. Windows that wrap midnight (a night
band such as 22:00–06:00) are handled.

This is the primitive behind night-work accounting and premium bands —
both need "how much of this shift was inside that clock window", not
"did it start at night".

#### Parameters

| Name    | Type          |
| :------ | :------------ |
| `range` | `MinuteRange` |
| `clock` | `ClockRange`  |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:157](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L157)

---

### toEpochMs

▸ **toEpochMs**(`periodMinute`): `number`

Absolute UTC epoch milliseconds for a period minute.

The bridge out of the engine's integer-minute world. Anything that leaves
the solver — a matcher assignment, an API payload, a calendar entry —
needs a real instant, and deriving one by adding minutes to the period
start would reintroduce exactly the DST error the clock exists to avoid.

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `periodMinute` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L134)

---

### toISOString

▸ **toISOString**(`periodMinute`): `string`

ISO 8601 instant for a period minute, in UTC.

#### Parameters

| Name           | Type     |
| :------------- | :------- |
| `periodMinute` | `number` |

#### Returns

`string`

#### Defined in

[src/scheduling/time.ts:144](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L144)

---

### toPeriodMinutes

▸ **toPeriodMinutes**(`date`, `timeOfDay`, `field?`): `number`

Period minutes for a wall-clock `(date, HH:MM)` in this zone.

Each wall-clock time is resolved to its own UTC instant before being
measured, so a transition earlier the same day is already priced in:
06:00 on a spring-forward morning is 5 real hours after that day's local
midnight, not 6.

#### Parameters

| Name        | Type     | Default value |
| :---------- | :------- | :------------ |
| `date`      | `string` | `undefined`   |
| `timeOfDay` | `string` | `undefined`   |
| `field`     | `string` | `'time'`      |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:96](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L96)

---

### weekdayOfMinute

▸ **weekdayOfMinute**(`minute`): `number`

ISO weekday of a period minute: 1 (Mon) .. 7 (Sun).

#### Parameters

| Name     | Type     |
| :------- | :------- |
| `minute` | `number` |

#### Returns

`number`

#### Defined in

[src/scheduling/time.ts:122](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/time.ts#L122)
