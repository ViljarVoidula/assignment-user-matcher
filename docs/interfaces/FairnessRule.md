[assignment-user-matcher](../README.md) / [Exports](../modules.md) / FairnessRule

# Interface: FairnessRule

A dimension to equalise across the team.

## Table of contents

### Properties

- [dimension](FairnessRule.md#dimension)
- [hardMaxSpread](FairnessRule.md#hardmaxspread)
- [proRataByContract](FairnessRule.md#proratabycontract)
- [tag](FairnessRule.md#tag)
- [weight](FairnessRule.md#weight)

## Properties

### dimension

• **dimension**: ``"tag"`` \| ``"minutes"`` \| ``"shifts"`` \| ``"nights"`` \| ``"weekends"`` \| ``"holidays"``

#### Defined in

[src/scheduling/types.ts:603](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L603)

___

### hardMaxSpread

• `Optional` **hardMaxSpread**: `number`

Hard cap on the spread between the most- and least-loaded person on this
dimension. Leave unset to keep fairness purely soft.

#### Defined in

[src/scheduling/types.ts:614](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L614)

___

### proRataByContract

• `Optional` **proRataByContract**: `boolean`

Weight each person's fair share by contracted hours rather than headcount.

#### Defined in

[src/scheduling/types.ts:616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L616)

___

### tag

• `Optional` **tag**: `string`

Required when `dimension` is `'tag'`: shifts whose `shiftTypeTag` equals
this are the load being equalised (e.g. spread the `'oncall'` shifts).

#### Defined in

[src/scheduling/types.ts:608](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L608)

___

### weight

• `Optional` **weight**: `number`

#### Defined in

[src/scheduling/types.ts:609](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/types.ts#L609)
