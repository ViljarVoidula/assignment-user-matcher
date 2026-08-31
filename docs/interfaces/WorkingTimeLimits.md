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

[src/scheduling/types.ts:275](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L275)

___

### maxPerDayExtendedMinutes

• `Optional` **maxPerDayExtendedMinutes**: `number`

Extended daily cap permitted when the average over `dayAverageWindowDays` holds.

#### Defined in

[src/scheduling/types.ts:274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L274)

___

### maxPerDayMinutes

• `Optional` **maxPerDayMinutes**: `number`

Ordinary daily cap, e.g. Germany's 8h.

#### Defined in

[src/scheduling/types.ts:272](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L272)

___

### maxPerPeriodMinutes

• `Optional` **maxPerPeriodMinutes**: `number`

Hard cap over the whole period, in minutes.

#### Defined in

[src/scheduling/types.ts:286](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L286)

___

### maxPerShiftMinutes

• `Optional` **maxPerShiftMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:270](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L270)

___

### maxPerWeekAbsoluteMinutes

• `Optional` **maxPerWeekAbsoluteMinutes**: `number`

Cap no single week may exceed regardless of averaging.

#### Defined in

[src/scheduling/types.ts:277](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L277)

___

### neutraliseAbsenceKinds

• `Optional` **neutraliseAbsenceKinds**: `string`[]

Absence kinds excluded from rolling averages. Art 16(b) requires paid
annual leave and sick leave to be neutral in the 48h calculation, so
counting them would wrongly depress a worker's average.

#### Defined in

[src/scheduling/types.ts:292](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L292)

___

### rollingAverages

• `Optional` **rollingAverages**: [`RollingAverage`](RollingAverage.md)[]

Rolling averages, each "at most `maxMinutes` of working time in any
window of `windowDays` days". The EU 48h/4-month rule is
`{ maxMinutes: 2880, windowDays: 120 }`; the Netherlands stacks
`{3300, 28}` with `{2880, 112}`; Spain averages over a year.

#### Defined in

[src/scheduling/types.ts:284](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L284)
