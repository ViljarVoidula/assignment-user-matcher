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

[src/scheduling/types.ts:623](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L623)

___

### hardMaxSpread

• `Optional` **hardMaxSpread**: `number`

Hard cap on the spread between the most- and least-loaded person on this
dimension. Leave unset to keep fairness purely soft.

#### Defined in

[src/scheduling/types.ts:634](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L634)

___

### proRataByContract

• `Optional` **proRataByContract**: `boolean`

Weight each person's fair share by contracted hours rather than headcount.

#### Defined in

[src/scheduling/types.ts:636](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L636)

___

### tag

• `Optional` **tag**: `string`

Required when `dimension` is `'tag'`: shifts whose `shiftTypeTag` equals
this are the load being equalised (e.g. spread the `'oncall'` shifts).

#### Defined in

[src/scheduling/types.ts:628](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L628)

___

### weight

• `Optional` **weight**: `number`

#### Defined in

[src/scheduling/types.ts:629](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L629)
