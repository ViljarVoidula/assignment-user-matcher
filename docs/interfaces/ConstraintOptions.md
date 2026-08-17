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

[src/scheduling/types.ts:580](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L580)

---

### minRestMinutes

• `Optional` **minRestMinutes**: `number`

Minimum rest minutes between the end of one assignment and the start of
the next. Defaults to 660 (11h), the Directive 2003/88/EC Art 3 floor.

#### Defined in

[src/scheduling/types.ts:570](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L570)

---

### oneShiftPerDay

• `Optional` **oneShiftPerDay**: `boolean`

Enforce at most one shift per calendar day. Defaults to `false` — split
shifts are lawful, and `no-overlap` + `min-rest` already exclude the
impossible cases.

#### Defined in

[src/scheduling/types.ts:576](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L576)

---

### overrides

• `Optional` **overrides**: `Record`\<`string`, \{ `hardness?`: `"hard"` \| `"soft"` ; `weight?`: `number` }\>

Override built-in hardness/weight by constraint id.

#### Defined in

[src/scheduling/types.ts:578](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L578)
