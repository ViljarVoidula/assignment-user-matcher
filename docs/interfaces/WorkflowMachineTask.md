[assignment-user-matcher](../README.md) / [Exports](../modules.md) / WorkflowMachineTask

# Interface: WorkflowMachineTask

Machine task metadata for code-driven workflow steps

## Table of contents

### Properties

- [handler](WorkflowMachineTask.md#handler)
- [input](WorkflowMachineTask.md#input)

## Properties

### handler

• **handler**: `string`

Machine handler identifier (resolver-specific)

#### Defined in

[src/types/matcher.ts:866](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L866)

___

### input

• `Optional` **input**: `Record`\<`string`, `any`\>

Optional static input merged with workflow context

#### Defined in

[src/types/matcher.ts:868](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ce38696d728bd7e302c6783a680658616d9287f0/src/types/matcher.ts#L868)
