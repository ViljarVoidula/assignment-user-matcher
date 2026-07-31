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

[src/types/matcher.ts:430](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L430)

___

### limit

• `Optional` **limit**: `number`

Maximum traces returned (default 50), newest first

#### Defined in

[src/types/matcher.ts:434](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L434)

___

### userId

• `Optional` **userId**: `string`

Only traces where this user was chosen

#### Defined in

[src/types/matcher.ts:432](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L432)
