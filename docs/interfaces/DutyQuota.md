[assignment-user-matcher](../README.md) / [Exports](../modules.md) / DutyQuota

# Interface: DutyQuota

A rolling volume cap on one duty type — "at most N hours (or N occurrences)
of stand-by in any 28 days". Matched on `ShiftTemplate.shiftTypeTag`.

`maxMinutes` counts *elapsed* duty minutes, not working minutes: a cap on
stand-by limits how long the duty may occupy the person's clock, which is
precisely the time a duty classification keeps out of the working-time
budget. Working-time volume belongs to `workingTime`, not here.

## Table of contents

### Properties

- [citation](DutyQuota.md#citation)
- [label](DutyQuota.md#label)
- [maxCount](DutyQuota.md#maxcount)
- [maxMinutes](DutyQuota.md#maxminutes)
- [shiftTypeTag](DutyQuota.md#shifttypetag)
- [windowDays](DutyQuota.md#windowdays)

## Properties

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L363)

___

### label

• `Optional` **label**: `string`

#### Defined in

[src/scheduling/types.ts:362](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L362)

___

### maxCount

• `Optional` **maxCount**: `number`

Cap on the number of matching duties in any window.

#### Defined in

[src/scheduling/types.ts:360](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L360)

___

### maxMinutes

• `Optional` **maxMinutes**: `number`

Cap on elapsed minutes of matching duties in any window.

#### Defined in

[src/scheduling/types.ts:358](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L358)

___

### shiftTypeTag

• **shiftTypeTag**: `string`

Which duties count: exact match on the instance's `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:356](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L356)

___

### windowDays

• **windowDays**: `number`

#### Defined in

[src/scheduling/types.ts:361](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L361)
