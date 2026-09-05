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

[src/types/matcher.ts:1445](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1445)

___

### targetStepId

• **targetStepId**: `string`

Target step ID if condition is true

#### Defined in

[src/types/matcher.ts:1447](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1447)
