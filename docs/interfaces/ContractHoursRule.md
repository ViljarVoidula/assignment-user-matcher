[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ContractHoursRule

# Interface: ContractHoursRule

Contracted hours as a planning fact.

A contracted week already sets a person's overtime baseline (`overtime`) and
pro-rata fairness share (`fairness[].proRataByContract`). This family makes
it steer the roster itself. The contracted *period* total is
`weeklyMinutes × periodDays / 7`; the solver's soft objective pulls every
person with a known contract towards that total (weight
`objectives.contractHoursWeight`), so a half-time worker is planned half the
hours of a full-timer rather than filled to the statutory ceiling.

The two bounds are optional because whether over-contract time is a breach
or merely overtime is the caller's regime: a workspace whose `overtime` rule
governs the surplus omits `maxOverMinutes`; one whose part-timers must not
exceed their agreed hours sets it to 0.

## Table of contents

### Properties

- [citation](ContractHoursRule.md#citation)
- [fullTimeWeeklyMinutes](ContractHoursRule.md#fulltimeweeklyminutes)
- [maxOverMinutes](ContractHoursRule.md#maxoverminutes)
- [maxUnderMinutes](ContractHoursRule.md#maxunderminutes)

## Properties

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:445](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L445)

___

### fullTimeWeeklyMinutes

• `Optional` **fullTimeWeeklyMinutes**: `number`

The full-time week that `contract.fte` is a fraction of, in minutes.
Falls back to `overtime.ordinaryPerWeekMinutes`. Required (one or the
other) for any employee with an `fte`.

#### Defined in

[src/scheduling/types.ts:433](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L433)

___

### maxOverMinutes

• `Optional` **maxOverMinutes**: `number`

Hard cap: minutes a person may be planned *over* their contracted period
total. `0` means never over contract. Omit for no hard cap.

#### Defined in

[src/scheduling/types.ts:438](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L438)

___

### maxUnderMinutes

• `Optional` **maxUnderMinutes**: `number`

Soft report: a shortfall larger than this against the contracted period
total is surfaced as a violation. Omit to leave shortfalls to the
objective and the result summary.

#### Defined in

[src/scheduling/types.ts:444](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L444)
