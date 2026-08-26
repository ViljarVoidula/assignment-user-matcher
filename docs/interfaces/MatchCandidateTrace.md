[assignment-user-matcher](../README.md) / [Exports](../modules.md) / MatchCandidateTrace

# Interface: MatchCandidateTrace

One user's evaluation within a routing decision or explanation.

## Table of contents

### Properties

- [chosen](MatchCandidateTrace.md#chosen)
- [effectivePriority](MatchCandidateTrace.md#effectivepriority)
- [eligible](MatchCandidateTrace.md#eligible)
- [reasons](MatchCandidateTrace.md#reasons)
- [score](MatchCandidateTrace.md#score)
- [userId](MatchCandidateTrace.md#userid)

## Properties

### chosen

• **chosen**: `boolean`

Whether this user actually received (or currently owns) the assignment

#### Defined in

[src/types/matcher.ts:592](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L592)

___

### effectivePriority

• **effectivePriority**: `number`

What arbitration compares: base priority + score + geo boost + learning boost

#### Defined in

[src/types/matcher.ts:596](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L596)

___

### eligible

• **eligible**: `boolean`

Whether the user could have received the assignment under the hard rules

#### Defined in

[src/types/matcher.ts:590](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L590)

___

### reasons

• **reasons**: [`MatchTraceReason`](../modules.md#matchtracereason)[]

#### Defined in

[src/types/matcher.ts:597](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L597)

___

### score

• **score**: `number`

Pure match score (routing-weight sum or tag-overlap ratio); 0 when excluded

#### Defined in

[src/types/matcher.ts:594](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L594)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:588](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L588)
