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

[src/types/matcher.ts:263](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L263)

---

### targetStepId

• **targetStepId**: `string`

Target step ID if condition is true

#### Defined in

[src/types/matcher.ts:265](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L265)
