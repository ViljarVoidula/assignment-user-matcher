[assignment-user-matcher](../README.md) / [Exports](../modules.md) / DutyQuota

# Interface: DutyQuota

A rolling volume cap on one duty type — "at most N hours (or N occurrences)
of stand-by in any 28 days". Matched on `ShiftTemplate.shiftTypeTag`.

`maxMinutes` counts _elapsed_ duty minutes, not working minutes: a cap on
stand-by limits how long the duty may occupy the person's clock, which is
precisely the time a duty classification keeps out of the working-time
budget. Working-time volume belongs to `workingTime`, not here.

## Table of contents

### Properties

- [citation](DutyQuota.md#citation)
- [label](DutyQuota.md#label)
- [maxCount](DutyQuota.md#maxcount)
- [maxMinutes](DutyQuota.md#maxminutes)
- [shiftTypeTag](DutyQuota.md#shifttypetag)
- [windowDays](DutyQuota.md#windowdays)

## Properties

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:341](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L341)

---

### label

• `Optional` **label**: `string`

#### Defined in

[src/scheduling/types.ts:340](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L340)

---

### maxCount

• `Optional` **maxCount**: `number`

Cap on the number of matching duties in any window.

#### Defined in

[src/scheduling/types.ts:338](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L338)

---

### maxMinutes

• `Optional` **maxMinutes**: `number`

Cap on elapsed minutes of matching duties in any window.

#### Defined in

[src/scheduling/types.ts:336](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L336)

---

### shiftTypeTag

• **shiftTypeTag**: `string`

Which duties count: exact match on the instance's `shiftTypeTag`.

#### Defined in

[src/scheduling/types.ts:334](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L334)

---

### windowDays

• **windowDays**: `number`

#### Defined in

[src/scheduling/types.ts:339](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L339)
