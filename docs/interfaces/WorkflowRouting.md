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

[src/types/matcher.ts:1127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1127)

___

### targetStepId

• **targetStepId**: `string`

Target step ID if condition is true

#### Defined in

[src/types/matcher.ts:1129](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L1129)
