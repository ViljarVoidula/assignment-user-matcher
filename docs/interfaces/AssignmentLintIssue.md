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

[src/types/matcher.ts:499](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L499)

___

### message

• **message**: `string`

Human-readable explanation, safe to surface to operators

#### Defined in

[src/types/matcher.ts:513](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L513)

___

### severity

• **severity**: ``"info"`` \| ``"error"`` \| ``"warning"``

#### Defined in

[src/types/matcher.ts:498](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L498)

___

### tag

• `Optional` **tag**: `string`

The tag concerned, for tag-scoped issues

#### Defined in

[src/types/matcher.ts:515](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L515)
