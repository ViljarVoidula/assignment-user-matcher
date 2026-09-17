[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentLintIssue

# Interface: AssignmentLintIssue

One finding from the pre-flight checks (`lintAssignment()` /
`AssignmentMatcher.checkAssignmentReadiness()`). `error` means the
assignment cannot be served as declared; `warning` means it will behave
in a way that is probably not intended; `info` is worth knowing.

## Table of contents

### Properties

- [code](AssignmentLintIssue.md#code)
- [message](AssignmentLintIssue.md#message)
- [severity](AssignmentLintIssue.md#severity)
- [tag](AssignmentLintIssue.md#tag)

## Properties

### code

• **code**: ``"no-tags"`` \| ``"schedule-window-inverted"`` \| ``"schedule-ignored"`` \| ``"schedule-window-elapsed"`` \| ``"schedule-notbefore-past"`` \| ``"offer-window-tight"`` \| ``"schedule-notafter-shadowed-by-sla-ttl"`` \| ``"sla-ignored"`` \| ``"escalation-ignored"`` \| ``"duplicate-id"`` \| ``"tag-uncovered"`` \| ``"no-eligible-users"``

#### Defined in

[src/types/matcher.ts:701](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L701)

___

### message

• **message**: `string`

Human-readable explanation, safe to surface to operators

#### Defined in

[src/types/matcher.ts:715](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L715)

___

### severity

• **severity**: ``"info"`` \| ``"error"`` \| ``"warning"``

#### Defined in

[src/types/matcher.ts:700](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L700)

___

### tag

• `Optional` **tag**: `string`

The tag concerned, for tag-scoped issues

#### Defined in

[src/types/matcher.ts:717](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L717)
