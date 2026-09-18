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

[src/types/matcher.ts:1479](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1479)

___

### input

• `Optional` **input**: `Record`\<`string`, `any`\>

Optional static input merged with workflow context

#### Defined in

[src/types/matcher.ts:1481](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L1481)
