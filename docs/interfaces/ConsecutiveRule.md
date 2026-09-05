[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ConsecutiveRule

# Interface: ConsecutiveRule

Sequence rules over one person's ordered assignments.

## Table of contents

### Properties

- [forbiddenSuccessions](ConsecutiveRule.md#forbiddensuccessions)
- [maxNightShifts](ConsecutiveRule.md#maxnightshifts)
- [maxWorkingDays](ConsecutiveRule.md#maxworkingdays)
- [restAfterNightBlockMinutes](ConsecutiveRule.md#restafternightblockminutes)

## Properties

### forbiddenSuccessions

• `Optional` **forbiddenSuccessions**: \{ `fromTag`: `string` ; `minGapMinutes?`: `number` ; `toTag`: `string`  }[]

Disallowed shift-type transitions, matched on `ShiftTemplate.shiftTypeTag`.
The classic is Night → Early ("quick return").

#### Defined in

[src/scheduling/types.ts:430](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L430)

___

### maxNightShifts

• `Optional` **maxNightShifts**: `number`

e.g. Finland 5, Netherlands 7.

#### Defined in

[src/scheduling/types.ts:423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L423)

___

### maxWorkingDays

• `Optional` **maxWorkingDays**: `number`

e.g. Portugal's 6.

#### Defined in

[src/scheduling/types.ts:421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L421)

___

### restAfterNightBlockMinutes

• `Optional` **restAfterNightBlockMinutes**: `number`

Rest owed once the night run ends: NL 2760 (46h), FI 1440 (24h).

#### Defined in

[src/scheduling/types.ts:425](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L425)
