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

[src/types/matcher.ts:721](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L721)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:724](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L724)

___

### issues

• **issues**: [`AssignmentLintIssue`](AssignmentLintIssue.md)[]

Policy lint findings plus live findings (coverage, duplicates, eligibility)

#### Defined in

[src/types/matcher.ts:719](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L719)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:723](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L723)
