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

[src/scheduling/types.ts:378](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L378)

___

### maxNightShifts

• `Optional` **maxNightShifts**: `number`

e.g. Finland 5, Netherlands 7.

#### Defined in

[src/scheduling/types.ts:371](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L371)

___

### maxWorkingDays

• `Optional` **maxWorkingDays**: `number`

e.g. Portugal's 6.

#### Defined in

[src/scheduling/types.ts:369](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L369)

___

### restAfterNightBlockMinutes

• `Optional` **restAfterNightBlockMinutes**: `number`

Rest owed once the night run ends: NL 2760 (46h), FI 1440 (24h).

#### Defined in

[src/scheduling/types.ts:373](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L373)
