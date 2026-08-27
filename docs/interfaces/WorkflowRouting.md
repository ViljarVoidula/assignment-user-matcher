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

[src/types/matcher.ts:1385](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1385)

___

### targetStepId

• **targetStepId**: `string`

Target step ID if condition is true

#### Defined in

[src/types/matcher.ts:1387](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/types/matcher.ts#L1387)
