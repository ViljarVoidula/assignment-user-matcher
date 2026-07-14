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

[src/types/matcher.ts:165](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L165)

---

### candidates

• **candidates**: [`MatchCandidateTrace`](MatchCandidateTrace.md)[]

Chosen candidate first, then eligible candidates by effective priority

#### Defined in

[src/types/matcher.ts:170](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L170)

---

### chosenUserId

• **chosenUserId**: `string`

#### Defined in

[src/types/matcher.ts:166](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L166)

---

### id

• **id**: `string`

#### Defined in

[src/types/matcher.ts:164](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L164)

---

### matchedAt

• **matchedAt**: `number`

#### Defined in

[src/types/matcher.ts:167](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L167)

---

### mode

• **mode**: [`MatchDecisionMode`](../modules.md#matchdecisionmode)

#### Defined in

[src/types/matcher.ts:168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L168)
