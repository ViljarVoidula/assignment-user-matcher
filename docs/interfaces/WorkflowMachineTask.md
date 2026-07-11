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

[src/types/matcher.ts:363](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L363)

___

### input

• `Optional` **input**: `Record`\<`string`, `any`\>

Optional static input merged with workflow context

#### Defined in

[src/types/matcher.ts:365](https://github.com/ViljarVoidula/assignment-user-matcher/blob/ba693b056eb384a6e211569ec45a23e047e546f9/src/types/matcher.ts#L365)
