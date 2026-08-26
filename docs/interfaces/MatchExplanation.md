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

[src/types/matcher.ts:627](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L627)

___

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

#### Defined in

[src/types/matcher.ts:636](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L636)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:635](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L635)

___

### ownerId

• **ownerId**: ``null`` \| `string`

Current owner for pending assignments and completer for completed ones.
`null` while queued and for accepted assignments (ownership metadata is
released on acceptance — consult decision traces for the full history).

#### Defined in

[src/types/matcher.ts:634](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L634)

___

### status

• **status**: ``"queued"`` \| ``"pending"`` \| ``"accepted"`` \| ``"completed"`` \| ``"scheduled"`` \| ``"not_found"``

#### Defined in

[src/types/matcher.ts:628](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L628)
