[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ConstraintOptions

# Interface: ConstraintOptions

Tunables for built-in constraints plus caller-supplied customs.

## Table of contents

### Properties

- [custom](ConstraintOptions.md#custom)
- [minRestMinutes](ConstraintOptions.md#minrestminutes)
- [oneShiftPerDay](ConstraintOptions.md#oneshiftperday)
- [overrides](ConstraintOptions.md#overrides)

## Properties

### custom

• `Optional` **custom**: [`SchedulingConstraint`](SchedulingConstraint.md)[]

Additional caller-supplied constraints, evaluated alongside the built-ins.

#### Defined in

[src/scheduling/types.ts:845](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L845)

___

### minRestMinutes

• `Optional` **minRestMinutes**: `number`

Minimum rest minutes between the end of one assignment and the start of
the next. Defaults to 660 (11h), the Directive 2003/88/EC Art 3 floor.

#### Defined in

[src/scheduling/types.ts:835](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L835)

___

### oneShiftPerDay

• `Optional` **oneShiftPerDay**: `boolean`

Enforce at most one shift per calendar day. Defaults to `false` — split
shifts are lawful, and `no-overlap` + `min-rest` already exclude the
impossible cases.

#### Defined in

[src/scheduling/types.ts:841](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L841)

___

### overrides

• `Optional` **overrides**: `Record`\<`string`, \{ `hardness?`: ``"hard"`` \| ``"soft"`` ; `weight?`: `number`  }\>

Override built-in hardness/weight by constraint id.

#### Defined in

[src/scheduling/types.ts:843](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L843)
