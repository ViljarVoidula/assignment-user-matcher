[assignment-user-matcher](../README.md) / [Exports](../modules.md) / TagRequirement

# Interface: TagRequirement

A per-tag minimum with a grade floor.

The long form of `tagRequirements`. `{ min: 2, level: 3 }` means two people
holding the tag at grade 3 or better; omitting `level` is exactly the plain
number form and is accepted so the two shapes can be mixed in one map.

## Table of contents

### Properties

- [level](TagRequirement.md#level)
- [min](TagRequirement.md#min)

## Properties

### level

• `Optional` **level**: `number`

Minimum `Qualification.level`. Absent counts anybody holding the tag.

#### Defined in

[src/scheduling/types.ts:692](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L692)

___

### min

• **min**: `number`

#### Defined in

[src/scheduling/types.ts:690](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L690)
