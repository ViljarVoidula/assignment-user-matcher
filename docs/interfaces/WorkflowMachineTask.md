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

[src/types/matcher.ts:528](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L528)

___

### input

• `Optional` **input**: `Record`\<`string`, `any`\>

Optional static input merged with workflow context

#### Defined in

[src/types/matcher.ts:530](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cf40c2e3e178a0c6bda2defaea5cc0043c476739/src/types/matcher.ts#L530)
