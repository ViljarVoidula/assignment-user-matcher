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

[src/types/matcher.ts:612](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L612)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

Chosen candidate first, then eligible candidates by effective priority

#### Defined in

[src/types/matcher.ts:617](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L617)

___

### chosenUserId

• **chosenUserId**: `string`

#### Defined in

[src/types/matcher.ts:613](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L613)

___

### id

• **id**: `string`

#### Defined in

[src/types/matcher.ts:611](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L611)

___

### matchedAt

• **matchedAt**: `number`

#### Defined in

[src/types/matcher.ts:614](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L614)

___

### mode

• **mode**: [`MatchDecisionMode`](../modules.md#matchdecisionmode)

#### Defined in

[src/types/matcher.ts:615](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L615)
