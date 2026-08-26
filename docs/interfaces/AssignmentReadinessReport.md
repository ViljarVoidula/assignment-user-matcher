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

[src/types/matcher.ts:702](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L702)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:705](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L705)

___

### issues

• **issues**: [`AssignmentLintIssue`](AssignmentLintIssue.md)[]

Policy lint findings plus live findings (coverage, duplicates, eligibility)

#### Defined in

[src/types/matcher.ts:700](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L700)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:704](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L704)
