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

[src/types/matcher.ts:904](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L904)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:907](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L907)

___

### issues

• **issues**: [`AssignmentLintIssue`](AssignmentLintIssue.md)[]

Policy lint findings plus live findings (coverage, duplicates, eligibility)

#### Defined in

[src/types/matcher.ts:902](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L902)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:906](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L906)
