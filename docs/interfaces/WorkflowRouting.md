[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowRouting

# Interface: WorkflowRouting

Routing condition for workflow branching

## Table of contents

### Properties

- [condition](WorkflowRouting.md#condition)
- [targetStepId](WorkflowRouting.md#targetstepid)

## Properties

### condition

• **condition**: `string`

Condition expression evaluated against assignment result (e.g., 'result.score > 80')

#### Defined in

[src/types/matcher.ts:548](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L548)

___

### targetStepId

• **targetStepId**: `string`

Target step ID if condition is true

#### Defined in

[src/types/matcher.ts:550](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L550)
