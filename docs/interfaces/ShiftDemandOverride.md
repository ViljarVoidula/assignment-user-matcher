[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ShiftDemandOverride

# Interface: ShiftDemandOverride

A date-bounded change to a template's demand: a peak fortnight that needs
two more people on every shift, a closure, a week when a licence holder must
be on the desk. The template stays the standing rule; an override is the
temporary one, and it is gone the day after `to` without anybody editing the
shift back.

Overrides are applied in array order to every date in `[from, to]` (and on a
listed weekday, when `daysOfWeek` is given). A later override wins field by
field over an earlier one; `extraEmployees` adds up across all that match.
`runs` decides whether the shift happens on a date at all, in **both**
directions — so an override can open a weekday-only shift for one weekend as
well as close it for a bank holiday. The result is an ordinary `ShiftInstance`, so the
solver, `checkCompliance`, `explainCandidate` and a host's grid all read the
same headcount without knowing an override existed — only `demandLabel`
tells them why.

## Table of contents

### Properties

- [daysOfWeek](ShiftDemandOverride.md#daysofweek)
- [extraEmployees](ShiftDemandOverride.md#extraemployees)
- [from](ShiftDemandOverride.md#from)
- [label](ShiftDemandOverride.md#label)
- [maxEmployees](ShiftDemandOverride.md#maxemployees)
- [minEmployees](ShiftDemandOverride.md#minemployees)
- [requiredTags](ShiftDemandOverride.md#requiredtags)
- [runs](ShiftDemandOverride.md#runs)
- [tagMaximums](ShiftDemandOverride.md#tagmaximums)
- [tagRequirements](ShiftDemandOverride.md#tagrequirements)
- [to](ShiftDemandOverride.md#to)

## Properties

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

Only these ISO weekdays (1 Mon .. 7 Sun) inside the range. Absent means every day.

#### Defined in

[src/scheduling/types.ts:582](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L582)

___

### extraEmployees

• `Optional` **extraEmployees**: `number`

Added to the minimum, and to the maximum when one is in force, rather than
replacing them — "two more than usual" without restating the usual.

#### Defined in

[src/scheduling/types.ts:593](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L593)

___

### from

• **from**: `string`

Inclusive ISO date (YYYY-MM-DD) the override starts applying.

#### Defined in

[src/scheduling/types.ts:578](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L578)

___

### label

• `Optional` **label**: `string`

Why — carried onto every occurrence it touches as `ShiftInstance.demandLabel`.

#### Defined in

[src/scheduling/types.ts:584](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L584)

___

### maxEmployees

• `Optional` **maxEmployees**: ``null`` \| `number`

Replaces the template's maximum. `null` removes it, leaving no room above cover.

#### Defined in

[src/scheduling/types.ts:588](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L588)

___

### minEmployees

• `Optional` **minEmployees**: `number`

Replaces the template's minimum on these dates.

#### Defined in

[src/scheduling/types.ts:586](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L586)

___

### requiredTags

• `Optional` **requiredTags**: `string`[]

Replaces the tags every assignee must hold.

#### Defined in

[src/scheduling/types.ts:599](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L599)

___

### runs

• `Optional` **runs**: `boolean`

Whether the shift runs on these dates at all, overriding the template's
own `dates`/`daysOfWeek`.

`false` is a closure. `true` is the inverse and the reason this is one
field rather than a `cancel` flag: a weekday-only shift that has to open
for one weekend is the same kind of temporary fact as one that has to
close for a bank holiday, and expressing it by editing the template's
`daysOfWeek` would open **every** weekend from then on. Omit it to leave
the template's own pattern deciding.

#### Defined in

[src/scheduling/types.ts:611](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L611)

___

### tagMaximums

• `Optional` **tagMaximums**: `Record`\<`string`, `number`\>

Replaces the template's per-tag maximums.

#### Defined in

[src/scheduling/types.ts:597](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L597)

___

### tagRequirements

• `Optional` **tagRequirements**: `Record`\<`string`, `number`\>

Replaces the template's per-tag minimums.

#### Defined in

[src/scheduling/types.ts:595](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L595)

___

### to

• **to**: `string`

Inclusive ISO date it stops applying. Equal to `from` for a single day.

#### Defined in

[src/scheduling/types.ts:580](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L580)
