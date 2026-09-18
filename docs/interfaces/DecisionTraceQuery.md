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

[src/types/matcher.ts:816](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L816)

___

### limit

• `Optional` **limit**: `number`

Maximum traces returned (default 50), newest first

#### Defined in

[src/types/matcher.ts:820](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L820)

___

### userId

• `Optional` **userId**: `string`

Only traces where this user was chosen

#### Defined in

[src/types/matcher.ts:818](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L818)
