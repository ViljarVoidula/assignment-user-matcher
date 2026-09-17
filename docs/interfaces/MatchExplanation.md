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

[src/types/matcher.ts:660](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L660)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

#### Defined in

[src/types/matcher.ts:669](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L669)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:668](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L668)

___

### ownerId

• **ownerId**: ``null`` \| `string`

Current owner for pending assignments and completer for completed ones.
`null` while queued and for accepted assignments (ownership metadata is
released on acceptance — consult decision traces for the full history).

#### Defined in

[src/types/matcher.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L667)

___

### status

• **status**: ``"completed"`` \| ``"queued"`` \| ``"pending"`` \| ``"accepted"`` \| ``"scheduled"`` \| ``"not_found"``

#### Defined in

[src/types/matcher.ts:661](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L661)
