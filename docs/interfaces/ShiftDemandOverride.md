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
- [tagRatios](ShiftDemandOverride.md#tagratios)
- [tagRequirements](ShiftDemandOverride.md#tagrequirements)
- [to](ShiftDemandOverride.md#to)

## Properties

### daysOfWeek

• `Optional` **daysOfWeek**: `number`[]

Only these ISO weekdays (1 Mon .. 7 Sun) inside the range. Absent means every day.

#### Defined in

[src/scheduling/types.ts:648](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L648)

___

### extraEmployees

• `Optional` **extraEmployees**: `number`

Added to the minimum, and to the maximum when one is in force, rather than
replacing them — "two more than usual" without restating the usual.

#### Defined in

[src/scheduling/types.ts:659](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L659)

___

### from

• **from**: `string`

Inclusive ISO date (YYYY-MM-DD) the override starts applying.

#### Defined in

[src/scheduling/types.ts:644](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L644)

___

### label

• `Optional` **label**: `string`

Why — carried onto every occurrence it touches as `ShiftInstance.demandLabel`.

#### Defined in

[src/scheduling/types.ts:650](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L650)

___

### maxEmployees

• `Optional` **maxEmployees**: ``null`` \| `number`

Replaces the template's maximum. `null` removes it, leaving no room above cover.

#### Defined in

[src/scheduling/types.ts:654](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L654)

___

### minEmployees

• `Optional` **minEmployees**: `number`

Replaces the template's minimum on these dates.

#### Defined in

[src/scheduling/types.ts:652](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L652)

___

### requiredTags

• `Optional` **requiredTags**: `string`[]

Replaces the tags every assignee must hold.

#### Defined in

[src/scheduling/types.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L667)

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

[src/scheduling/types.ts:679](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L679)

___

### tagMaximums

• `Optional` **tagMaximums**: `Record`\<`string`, `number`\>

Replaces the template's per-tag maximums.

#### Defined in

[src/scheduling/types.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L665)

___

### tagRatios

• `Optional` **tagRatios**: `Record`\<`string`, `number`\>

Replaces the template's per-tag proportions.

#### Defined in

[src/scheduling/types.ts:663](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L663)

___

### tagRequirements

• `Optional` **tagRequirements**: `Record`\<`string`, `number` \| [`TagRequirement`](TagRequirement.md)\>

Replaces the template's per-tag minimums. Same shapes as the template's own.

#### Defined in

[src/scheduling/types.ts:661](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L661)

___

### to

• **to**: `string`

Inclusive ISO date it stops applying. Equal to `from` for a single day.

#### Defined in

[src/scheduling/types.ts:646](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L646)
