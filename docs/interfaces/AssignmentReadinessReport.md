[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentReadinessReport

# Interface: AssignmentReadinessReport

Output of `AssignmentMatcher.checkAssignmentReadiness()`.

## Table of contents

### Properties

- [eligibleUserCount](AssignmentReadinessReport.md#eligibleusercount)
- [evaluatedAt](AssignmentReadinessReport.md#evaluatedat)
- [issues](AssignmentReadinessReport.md#issues)
- [uncoveredTags](AssignmentReadinessReport.md#uncoveredtags)

## Properties

### eligibleUserCount

• **eligibleUserCount**: `number`

Users eligible for the assignment right now (same rules as `previewMatch()`)

#### Defined in

[src/types/matcher.ts:533](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L533)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L536)

___

### issues

• **issues**: [`AssignmentLintIssue`](AssignmentLintIssue.md)[]

Policy lint findings plus live findings (coverage, duplicates, eligibility)

#### Defined in

[src/types/matcher.ts:531](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L531)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:535](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L535)
