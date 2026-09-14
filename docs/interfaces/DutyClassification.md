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

[src/scheduling/types.ts:806](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L806)

___

### countsAsWorkingTime

• **countsAsWorkingTime**: `number` \| ``"full"`` \| ``"actualOnly"``

`'full'` counts the whole span (a normal shift, or on-premises stand-by).
`'actualOnly'` counts only `expectedActiveMinutes`.
A number between 0 and 1 counts that fraction — the usual encoding for
stand-by that accrues at a percentage.

#### Defined in

[src/scheduling/types.ts:792](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L792)

___

### countsTowardRestClock

• `Optional` **countsTowardRestClock**: `boolean`

Whether the duty still blocks the rest clock even if it barely counts as work.

#### Defined in

[src/scheduling/types.ts:796](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L796)

___

### expectedActiveMinutes

• `Optional` **expectedActiveMinutes**: `number`

Expected active minutes when `countsAsWorkingTime` is `'actualOnly'`.

#### Defined in

[src/scheduling/types.ts:794](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L794)

___

### standby

• `Optional` **standby**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `atWorkplace` | `boolean` |
| `avgCalloutsPerPeriod?` | `number` |
| `responseMinutes?` | `number` |

#### Defined in

[src/scheduling/types.ts:797](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L797)
