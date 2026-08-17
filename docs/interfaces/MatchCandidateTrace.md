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

[src/types/matcher.ts:423](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L423)

---

### effectivePriority

• **effectivePriority**: `number`

What arbitration compares: base priority + score + geo boost + learning boost

#### Defined in

[src/types/matcher.ts:427](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L427)

---

### eligible

• **eligible**: `boolean`

Whether the user could have received the assignment under the hard rules

#### Defined in

[src/types/matcher.ts:421](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L421)

---

### reasons

• **reasons**: [`MatchTraceReason`](../modules.md#matchtracereason)[]

#### Defined in

[src/types/matcher.ts:428](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L428)

---

### score

• **score**: `number`

Pure match score (routing-weight sum or tag-overlap ratio); 0 when excluded

#### Defined in

[src/types/matcher.ts:425](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L425)

---

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:419](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/types/matcher.ts#L419)
