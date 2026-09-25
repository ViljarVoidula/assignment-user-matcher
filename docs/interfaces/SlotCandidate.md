[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SlotCandidate

# Interface: SlotCandidate

One worker weighed for one appointment.

`bookable` is the whole judgement in one boolean — eligible under the
ordinary matching rules, free in the hour, and not blocked by the caller's
availability. The detail is there so a planner can see *why* somebody is
not, which is the question they actually ask.

## Table of contents

### Properties

- [blocked](SlotCandidate.md#blocked)
- [bookable](SlotCandidate.md#bookable)
- [clashingAssignmentId](SlotCandidate.md#clashingassignmentid)
- [effectivePriority](SlotCandidate.md#effectivepriority)
- [reasons](SlotCandidate.md#reasons)
- [score](SlotCandidate.md#score)
- [userId](SlotCandidate.md#userid)
- [warnings](SlotCandidate.md#warnings)

## Properties

### blocked

• `Optional` **blocked**: \{ `from`: `number` ; `reason`: `string` ; `to`: `number`  }[]

Caller-supplied absences covering the slot. Refuses the booking.

#### Defined in

[src/types/matcher.ts:201](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L201)

___

### bookable

• **bookable**: `boolean`

Whether a booking for this worker would go through right now.

#### Defined in

[src/types/matcher.ts:195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L195)

___

### clashingAssignmentId

• `Optional` **clashingAssignmentId**: `string`

An appointment already on them that overlaps this one.

#### Defined in

[src/types/matcher.ts:199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L199)

___

### effectivePriority

• **effectivePriority**: `number`

Base priority + score + geo boost + learning boost.

#### Defined in

[src/types/matcher.ts:193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L193)

___

### reasons

• **reasons**: [`MatchTraceReason`](../modules.md#matchtracereason)[]

Why they are or are not eligible, in `explainMatch`'s vocabulary.

#### Defined in

[src/types/matcher.ts:197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L197)

___

### score

• **score**: `number`

Pure match score, as `explainMatch` reports it.

#### Defined in

[src/types/matcher.ts:191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L191)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:189](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L189)

___

### warnings

• `Optional` **warnings**: \{ `from`: `number` ; `reason`: `string` ; `to`: `number`  }[]

Caller-supplied soft conflicts. Allows the booking, recorded on it.

#### Defined in

[src/types/matcher.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L203)
