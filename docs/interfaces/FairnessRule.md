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

[src/scheduling/types.ts:537](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L537)

___

### hardMaxSpread

• `Optional` **hardMaxSpread**: `number`

Hard cap on the spread between the most- and least-loaded person on this
dimension. Leave unset to keep fairness purely soft.

#### Defined in

[src/scheduling/types.ts:548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L548)

___

### proRataByContract

• `Optional` **proRataByContract**: `boolean`

Weight each person's fair share by contracted hours rather than headcount.

#### Defined in

[src/scheduling/types.ts:550](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L550)

___

### tag

• `Optional` **tag**: `string`

Required when `dimension` is `'tag'`: shifts whose `shiftTypeTag` equals
this are the load being equalised (e.g. spread the `'oncall'` shifts).

#### Defined in

[src/scheduling/types.ts:542](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L542)

___

### weight

• `Optional` **weight**: `number`

#### Defined in

[src/scheduling/types.ts:543](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L543)
