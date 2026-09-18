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

[src/scheduling/types.ts:466](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L466)

___

### label

• `Optional` **label**: `string`

#### Defined in

[src/scheduling/types.ts:465](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L465)

___

### maxCount

• `Optional` **maxCount**: `number`

Cap on the number of matching duties in any window.

#### Defined in

[src/scheduling/types.ts:463](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L463)

___

### maxMinutes

• `Optional` **maxMinutes**: `number`

Cap on elapsed minutes of matching duties in any window.

#### Defined in

[src/scheduling/types.ts:461](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L461)

___

### shiftTypeTag

• **shiftTypeTag**: `string`

Which duties count: exact match on the instance's `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:459](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L459)

___

### windowDays

• **windowDays**: `number`

#### Defined in

[src/scheduling/types.ts:464](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L464)
