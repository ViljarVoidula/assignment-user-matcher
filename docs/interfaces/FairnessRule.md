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

[src/scheduling/types.ts:485](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L485)

___

### hardMaxSpread

• `Optional` **hardMaxSpread**: `number`

Hard cap on the spread between the most- and least-loaded person on this
dimension. Leave unset to keep fairness purely soft.

#### Defined in

[src/scheduling/types.ts:496](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L496)

___

### proRataByContract

• `Optional` **proRataByContract**: `boolean`

Weight each person's fair share by contracted hours rather than headcount.

#### Defined in

[src/scheduling/types.ts:498](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L498)

___

### tag

• `Optional` **tag**: `string`

Required when `dimension` is `'tag'`: shifts whose `shiftTypeTag` equals
this are the load being equalised (e.g. spread the `'oncall'` shifts).

#### Defined in

[src/scheduling/types.ts:490](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L490)

___

### weight

• `Optional` **weight**: `number`

#### Defined in

[src/scheduling/types.ts:491](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L491)
