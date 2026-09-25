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

[src/types/matcher.ts:962](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L962)

___

### limit

• `Optional` **limit**: `number`

Maximum traces returned (default 50), newest first

#### Defined in

[src/types/matcher.ts:966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L966)

___

### userId

• `Optional` **userId**: `string`

Only traces where this user was chosen

#### Defined in

[src/types/matcher.ts:964](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L964)
