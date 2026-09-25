[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ConsecutiveRule

# Interface: ConsecutiveRule

Sequence rules over one person's ordered assignments.

## Table of contents

### Properties

- [forbiddenSuccessions](ConsecutiveRule.md#forbiddensuccessions)
- [maxConsecutiveWeekends](ConsecutiveRule.md#maxconsecutiveweekends)
- [maxNightShifts](ConsecutiveRule.md#maxnightshifts)
- [maxWorkingDays](ConsecutiveRule.md#maxworkingdays)
- [restAfterNightBlockMinutes](ConsecutiveRule.md#restafternightblockminutes)

## Properties

### forbiddenSuccessions

• `Optional` **forbiddenSuccessions**: \{ `fromTag`: `string` ; `minGapMinutes?`: `number` ; `toTag`: `string`  }[]

Disallowed shift-type transitions, matched on `ShiftTemplate.shiftTypeTag`.
The classic is Night → Early ("quick return").

#### Defined in

[src/scheduling/types.ts:516](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L516)

___

### maxConsecutiveWeekends

• `Optional` **maxConsecutiveWeekends**: `number`

Weekends in a row somebody may be rostered on. `1` is "every second
weekend off".

A **sequence** rule rather than a fairness dimension, and deliberately
so. `FairnessRule` with `dimension: 'weekends'` equalises counts — three
weekends each — which three consecutive weekends followed by three off
satisfies exactly as well as alternating ones. The count is equal; the
arrangement is what was negotiated.

A Saturday and the Sunday after it are one weekend. Counting them as two
would make an ordinary weekend breach "every second", which is the
opposite of what the term asks for.

#### Defined in

[src/scheduling/types.ts:511](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L511)

___

### maxNightShifts

• `Optional` **maxNightShifts**: `number`

e.g. Finland 5, Netherlands 7.

#### Defined in

[src/scheduling/types.ts:494](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L494)

___

### maxWorkingDays

• `Optional` **maxWorkingDays**: `number`

e.g. Portugal's 6.

#### Defined in

[src/scheduling/types.ts:492](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L492)

___

### restAfterNightBlockMinutes

• `Optional` **restAfterNightBlockMinutes**: `number`

Rest owed once the night run ends: NL 2760 (46h), FI 1440 (24h).

#### Defined in

[src/scheduling/types.ts:496](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L496)
