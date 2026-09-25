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

[src/scheduling/types.ts:361](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L361)

___

### maxPerDayExtendedMinutes

• `Optional` **maxPerDayExtendedMinutes**: `number`

Extended daily cap permitted when the average over `dayAverageWindowDays` holds.

#### Defined in

[src/scheduling/types.ts:360](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L360)

___

### maxPerDayMinutes

• `Optional` **maxPerDayMinutes**: `number`

Ordinary daily cap, e.g. Germany's 8h.

#### Defined in

[src/scheduling/types.ts:358](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L358)

___

### maxPerPeriodMinutes

• `Optional` **maxPerPeriodMinutes**: `number`

Hard cap over the whole period, in minutes.

#### Defined in

[src/scheduling/types.ts:372](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L372)

___

### maxPerShiftMinutes

• `Optional` **maxPerShiftMinutes**: `number`

#### Defined in

[src/scheduling/types.ts:356](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L356)

___

### maxPerWeekAbsoluteMinutes

• `Optional` **maxPerWeekAbsoluteMinutes**: `number`

Cap no single week may exceed regardless of averaging.

#### Defined in

[src/scheduling/types.ts:363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L363)

___

### neutraliseAbsenceKinds

• `Optional` **neutraliseAbsenceKinds**: `string`[]

Absence kinds excluded from rolling averages. Art 16(b) requires paid
annual leave and sick leave to be neutral in the 48h calculation, so
counting them would wrongly depress a worker's average.

#### Defined in

[src/scheduling/types.ts:378](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L378)

___

### rollingAverages

• `Optional` **rollingAverages**: [`RollingAverage`](RollingAverage.md)[]

Rolling averages, each "at most `maxMinutes` of working time in any
window of `windowDays` days". The EU 48h/4-month rule is
`{ maxMinutes: 2880, windowDays: 120 }`; the Netherlands stacks
`{3300, 28}` with `{2880, 112}`; Spain averages over a year.

#### Defined in

[src/scheduling/types.ts:370](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L370)
