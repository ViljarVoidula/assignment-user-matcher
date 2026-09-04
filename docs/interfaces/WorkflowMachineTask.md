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

[src/types/matcher.ts:1348](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1348)

___

### input

• `Optional` **input**: `Record`\<`string`, `any`\>

Optional static input merged with workflow context

#### Defined in

[src/types/matcher.ts:1350](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L1350)
