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

[src/types/matcher.ts:145](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L145)

---

### effectivePriority

• **effectivePriority**: `number`

What arbitration compares: base priority + score + geo boost + learning boost

#### Defined in

[src/types/matcher.ts:149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L149)

---

### eligible

• **eligible**: `boolean`

Whether the user could have received the assignment under the hard rules

#### Defined in

[src/types/matcher.ts:143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L143)

---

### reasons

• **reasons**: [`MatchTraceReason`](../modules.md#matchtracereason)[]

#### Defined in

[src/types/matcher.ts:150](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L150)

---

### score

• **score**: `number`

Pure match score (routing-weight sum or tag-overlap ratio); 0 when excluded

#### Defined in

[src/types/matcher.ts:147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L147)

---

### userId

• **userId**: `string`

#### Defined in

[src/types/matcher.ts:141](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L141)
