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

[src/types/matcher.ts:611](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L611)

___

### effectivePriority

• **effectivePriority**: `number`

What arbitration compares: base priority + score + geo boost + learning boost

#### Defined in

[src/types/matcher.ts:615](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L615)

___

### eligible

• **eligible**: `boolean`

Whether the user could have received the assignment under the hard rules

#### Defined in

[src/types/matcher.ts:609](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L609)

___

### reasons

• **reasons**: [`MatchTraceReason`](../modules.md#matchtracereason)[]

#### Defined in

[src/types/matcher.ts:616](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L616)

___

### score

• **score**: `number`

Pure match score (routing-weight sum or tag-overlap ratio); 0 when excluded

#### Defined in

[src/types/matcher.ts:613](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L613)

___

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:607](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L607)
