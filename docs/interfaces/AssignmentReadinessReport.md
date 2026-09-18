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

[src/types/matcher.ts:758](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L758)

___

### evaluatedAt

• **evaluatedAt**: `number`

#### Defined in

[src/types/matcher.ts:761](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L761)

___

### issues

• **issues**: [`AssignmentLintIssue`](AssignmentLintIssue.md)[]

Policy lint findings plus live findings (coverage, duplicates, eligibility)

#### Defined in

[src/types/matcher.ts:756](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L756)

___

### uncoveredTags

• **uncoveredTags**: `string`[]

Assignment tags no active (non-paused) user can currently serve

#### Defined in

[src/types/matcher.ts:760](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L760)
