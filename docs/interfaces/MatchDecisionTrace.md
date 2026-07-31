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

[src/types/matcher.ts:379](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L379)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

Chosen candidate first, then eligible candidates by effective priority

#### Defined in

[src/types/matcher.ts:384](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L384)

___

### chosenUserId

• **chosenUserId**: `string`

#### Defined in

[src/types/matcher.ts:380](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L380)

___

### id

• **id**: `string`

#### Defined in

[src/types/matcher.ts:378](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L378)

___

### matchedAt

• **matchedAt**: `number`

#### Defined in

[src/types/matcher.ts:381](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L381)

___

### mode

• **mode**: [`MatchDecisionMode`](../modules.md#matchdecisionmode)

#### Defined in

[src/types/matcher.ts:382](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L382)
