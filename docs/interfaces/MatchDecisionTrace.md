[assignment-user-matcher](../README.md) / [Exports](../modules.md) / MatchDecisionTrace

# Interface: MatchDecisionTrace

The auditable record of one routing decision, captured while the decision
was made (not reconstructed after the fact). `candidates` holds every user
evaluated in the matching pass plus users excluded by hard rules (vetoes,
prior rejections); users that were never candidates for the assignment do
not appear.

## Table of contents

### Properties

- [assignmentId](MatchDecisionTrace.md#assignmentid)
- [candidates](MatchDecisionTrace.md#candidates)
- [chosenUserId](MatchDecisionTrace.md#chosenuserid)
- [id](MatchDecisionTrace.md#id)
- [matchedAt](MatchDecisionTrace.md#matchedat)
- [mode](MatchDecisionTrace.md#mode)

## Properties

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:668](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L668)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

Chosen candidate first, then eligible candidates by effective priority

#### Defined in

[src/types/matcher.ts:673](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L673)

___

### chosenUserId

• **chosenUserId**: `string`

#### Defined in

[src/types/matcher.ts:669](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L669)

___

### id

• **id**: `string`

#### Defined in

[src/types/matcher.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L667)

___

### matchedAt

• **matchedAt**: `number`

#### Defined in

[src/types/matcher.ts:670](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L670)

___

### mode

• **mode**: [`MatchDecisionMode`](../modules.md#matchdecisionmode)

#### Defined in

[src/types/matcher.ts:671](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L671)
