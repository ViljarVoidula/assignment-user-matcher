[assignment-user-matcher](../README.md) / [Exports](../modules.md) / DecisionTraceQuery

# Interface: DecisionTraceQuery

Filters for `getDecisionTraces()`.

## Table of contents

### Properties

- [assignmentId](DecisionTraceQuery.md#assignmentid)
- [limit](DecisionTraceQuery.md#limit)
- [userId](DecisionTraceQuery.md#userid)

## Properties

### assignmentId

• `Optional` **assignmentId**: `string`

Only traces for this assignment (an assignment re-queued and re-matched has several)

#### Defined in

[src/types/matcher.ts:195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L195)

---

### limit

• `Optional` **limit**: `number`

Maximum traces returned (default 50), newest first

#### Defined in

[src/types/matcher.ts:199](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L199)

---

### userId

• `Optional` **userId**: `string`

Only traces where this user was chosen

#### Defined in

[src/types/matcher.ts:197](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L197)
