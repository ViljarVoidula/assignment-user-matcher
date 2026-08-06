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

[src/types/matcher.ts:458](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L458)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

#### Defined in

[src/types/matcher.ts:467](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L467)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:466](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L466)

___

### ownerId

• **ownerId**: ``null`` \| `string`

Current owner for pending assignments and completer for completed ones.
`null` while queued and for accepted assignments (ownership metadata is
released on acceptance — consult decision traces for the full history).

#### Defined in

[src/types/matcher.ts:465](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L465)

___

### status

• **status**: ``"queued"`` \| ``"pending"`` \| ``"accepted"`` \| ``"completed"`` \| ``"scheduled"`` \| ``"not_found"``

#### Defined in

[src/types/matcher.ts:459](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L459)
