[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentCounts

# Interface: AssignmentCounts

## Table of contents

### Properties

- [accepted](AssignmentCounts.md#accepted)
- [parked](AssignmentCounts.md#parked)
- [pending](AssignmentCounts.md#pending)
- [queued](AssignmentCounts.md#queued)
- [total](AssignmentCounts.md#total)

## Properties

### accepted

• **accepted**: `number`

#### Defined in

[src/queries/pagination.ts:25](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/queries/pagination.ts#L25)

___

### parked

• **parked**: `number`

Assignments held out of matching by an exhausted escalation ladder

#### Defined in

[src/queries/pagination.ts:27](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/queries/pagination.ts#L27)

___

### pending

• **pending**: `number`

#### Defined in

[src/queries/pagination.ts:24](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/queries/pagination.ts#L24)

___

### queued

• **queued**: `number`

#### Defined in

[src/queries/pagination.ts:23](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/queries/pagination.ts#L23)

___

### total

• **total**: `number`

queued + pending + accepted — parked items are counted separately

#### Defined in

[src/queries/pagination.ts:29](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/queries/pagination.ts#L29)
