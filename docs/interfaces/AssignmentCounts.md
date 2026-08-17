[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentCounts

# Interface: AssignmentCounts

## Table of contents

### Properties

- [accepted](AssignmentCounts.md#accepted)
- [parked](AssignmentCounts.md#parked)
- [pending](AssignmentCounts.md#pending)
- [queued](AssignmentCounts.md#queued)
- [scheduled](AssignmentCounts.md#scheduled)
- [total](AssignmentCounts.md#total)

## Properties

### accepted

• **accepted**: `number`

#### Defined in

[src/queries/pagination.ts:25](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L25)

---

### parked

• **parked**: `number`

Assignments held out of matching by an exhausted escalation ladder

#### Defined in

[src/queries/pagination.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L27)

---

### pending

• **pending**: `number`

#### Defined in

[src/queries/pagination.ts:24](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L24)

---

### queued

• **queued**: `number`

#### Defined in

[src/queries/pagination.ts:23](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L23)

---

### scheduled

• **scheduled**: `number`

Assignments held out of the queue by `schedule.notBefore`

#### Defined in

[src/queries/pagination.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L29)

---

### total

• **total**: `number`

queued + pending + accepted — parked and scheduled items are counted separately

#### Defined in

[src/queries/pagination.ts:31](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/queries/pagination.ts#L31)
