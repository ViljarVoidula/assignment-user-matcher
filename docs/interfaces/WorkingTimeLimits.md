[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkingTimeLimits

# Interface: WorkingTimeLimits

Volume limits, including the rolling reference periods that define EU working time.

## Table of contents

### Properties

- [dayAverageWindowDays](WorkingTimeLimits.md#dayaveragewindowdays)
- [maxPerDayExtendedMinutes](WorkingTimeLimits.md#maxperdayextendedminutes)
- [maxPerDayMinutes](WorkingTimeLimits.md#maxperdayminutes)
- [maxPerPeriodMinutes](WorkingTimeLimits.md#maxperperiodminutes)
- [maxPerShiftMinutes](WorkingTimeLimits.md#maxpershiftminutes)
- [maxPerWeekAbsoluteMinutes](WorkingTimeLimits.md#maxperweekabsoluteminutes)
- [neutraliseAbsenceKinds](WorkingTimeLimits.md#neutraliseabsencekinds)
- [rollingAverages](WorkingTimeLimits.md#rollingaverages)

## Properties

### dayAverageWindowDays

• `Optional` **dayAverageWindowDays**: `number`

#### Defined in

[src/scheduling/types.ts:341](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L341)

___

### maxPerDayExtendedMinutes

• `Optional` **maxPerDayExtendedMinutes**: `number`

Extended daily cap permitted when the average over `dayAverageWindowDays` holds.

#### Defined in

[src/scheduling/types.ts:340](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L340)

___

### maxPerDayMinutes

• `Optional` **maxPerDayMinutes**: `number`

Ordinary daily cap, e.g. Germany's 8h.

#### Defined in

[src/scheduling/types.ts:338](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L338)

___

### maxPerPeriodMinutes

• `Optional` **maxPerPeriodMinutes**: `number`

Hard cap over the whole period, in minutes.

#### Defined in

[src/scheduling/types.ts:352](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L352)

___

### maxPerShiftMinutes

• `Optional` **maxPerShiftMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:336](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L336)

___

### maxPerWeekAbsoluteMinutes

• `Optional` **maxPerWeekAbsoluteMinutes**: `number`

Cap no single week may exceed regardless of averaging.

#### Defined in

[src/scheduling/types.ts:343](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L343)

___

### neutraliseAbsenceKinds

• `Optional` **neutraliseAbsenceKinds**: `string`[]

Absence kinds excluded from rolling averages. Art 16(b) requires paid
annual leave and sick leave to be neutral in the 48h calculation, so
counting them would wrongly depress a worker's average.

#### Defined in

[src/scheduling/types.ts:358](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L358)

___

### rollingAverages

• `Optional` **rollingAverages**: [`RollingAverage`](RollingAverage.md)[]

Rolling averages, each "at most `maxMinutes` of working time in any
window of `windowDays` days". The EU 48h/4-month rule is
`{ maxMinutes: 2880, windowDays: 120 }`; the Netherlands stacks
`{3300, 28}` with `{2880, 112}`; Spain averages over a year.

#### Defined in

[src/scheduling/types.ts:350](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L350)
