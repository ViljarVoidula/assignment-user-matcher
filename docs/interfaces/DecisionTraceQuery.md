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

[src/types/matcher.ts:591](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L591)

___

### limit

• `Optional` **limit**: `number`

Maximum traces returned (default 50), newest first

#### Defined in

[src/types/matcher.ts:595](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L595)

___

### userId

• `Optional` **userId**: `string`

Only traces where this user was chosen

#### Defined in

[src/types/matcher.ts:593](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5181f900e2ab0885e710caebe1b33a28ad244920/src/types/matcher.ts#L593)
