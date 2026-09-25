[assignment-user-matcher](../README.md) / [Exports](../modules.md) / MatchExplanation

# Interface: MatchExplanation

On-demand answer to "who could receive this assignment, and why (not)?" —
recomputed from live state by `explainMatch()`. For matched assignments the
current owner is flagged `chosen`; for the record of the decision as it
actually happened, use decision traces instead.

## Table of contents

### Properties

- [assignmentId](MatchExplanation.md#assignmentid)
- [candidates](MatchExplanation.md#candidates)
- [evaluatedAt](MatchExplanation.md#evaluatedat)
- [ownerId](MatchExplanation.md#ownerid)
- [status](MatchExplanation.md#status)

## Properties

### assignmentId

• **assignmentId**: `string`

#### Defined in

[src/types/matcher.ts:829](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L829)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

#### Defined in

[src/types/matcher.ts:838](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L838)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:837](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L837)

___

### ownerId

• **ownerId**: ``null`` \| `string`

Current owner for pending assignments and completer for completed ones.
`null` while queued and for accepted assignments (ownership metadata is
released on acceptance — consult decision traces for the full history).

#### Defined in

[src/types/matcher.ts:836](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L836)

___

### status

• **status**: ``"completed"`` \| ``"queued"`` \| ``"pending"`` \| ``"accepted"`` \| ``"scheduled"`` \| ``"not_found"``

#### Defined in

[src/types/matcher.ts:830](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L830)
