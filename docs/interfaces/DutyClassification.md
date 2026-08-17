[assignment-user-matcher](../README.md) / [Exports](../modules.md) / DutyClassification

# Interface: DutyClassification

How a duty's elapsed time converts into working time.

## Table of contents

### Properties

- [classificationNote](DutyClassification.md#classificationnote)
- [countsAsWorkingTime](DutyClassification.md#countsasworkingtime)
- [countsTowardRestClock](DutyClassification.md#countstowardrestclock)
- [expectedActiveMinutes](DutyClassification.md#expectedactiveminutes)
- [standby](DutyClassification.md#standby)

## Properties

### classificationNote

• `Optional` **classificationNote**: `string`

Why it was classified this way. Echoed into the result's provenance so a
roster can be defended without re-litigating the classification.

#### Defined in

[src/scheduling/types.ts:561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L561)

---

### countsAsWorkingTime

• **countsAsWorkingTime**: `number` \| `"full"` \| `"actualOnly"`

`'full'` counts the whole span (a normal shift, or on-premises stand-by).
`'actualOnly'` counts only `expectedActiveMinutes`.
A number between 0 and 1 counts that fraction — the usual encoding for
stand-by that accrues at a percentage.

#### Defined in

[src/scheduling/types.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L547)

---

### countsTowardRestClock

• `Optional` **countsTowardRestClock**: `boolean`

Whether the duty still blocks the rest clock even if it barely counts as work.

#### Defined in

[src/scheduling/types.ts:551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L551)

---

### expectedActiveMinutes

• `Optional` **expectedActiveMinutes**: `number`

Expected active minutes when `countsAsWorkingTime` is `'actualOnly'`.

#### Defined in

[src/scheduling/types.ts:549](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L549)

---

### standby

• `Optional` **standby**: `Object`

#### Type declaration

| Name                    | Type      |
| :---------------------- | :-------- |
| `atWorkplace`           | `boolean` |
| `avgCalloutsPerPeriod?` | `number`  |
| `responseMinutes?`      | `number`  |

#### Defined in

[src/scheduling/types.ts:552](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L552)
