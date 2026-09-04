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

[src/types/matcher.ts:631](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L631)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

Chosen candidate first, then eligible candidates by effective priority

#### Defined in

[src/types/matcher.ts:636](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L636)

___

### chosenUserId

• **chosenUserId**: `string`

#### Defined in

[src/types/matcher.ts:632](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L632)

___

### id

• **id**: `string`

#### Defined in

[src/types/matcher.ts:630](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L630)

___

### matchedAt

• **matchedAt**: `number`

#### Defined in

[src/types/matcher.ts:633](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L633)

___

### mode

• **mode**: [`MatchDecisionMode`](../modules.md#matchdecisionmode)

#### Defined in

[src/types/matcher.ts:634](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L634)
