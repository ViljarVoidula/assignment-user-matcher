[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AssignmentResult

# Interface: AssignmentResult

Result payload when completing an assignment

## Table of contents

### Properties

- [data](AssignmentResult.md#data)
- [error](AssignmentResult.md#error)
- [success](AssignmentResult.md#success)

## Properties

### data

• `Optional` **data**: `Record`\<`string`, `any`\>

Arbitrary result data for routing decisions

#### Defined in

[src/types/matcher.ts:200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L200)

___

### error

• `Optional` **error**: `string`

Error message if failed

#### Defined in

[src/types/matcher.ts:202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L202)

___

### success

• **success**: `boolean`

Outcome: success or failure

#### Defined in

[src/types/matcher.ts:198](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5144870af651229861c818fd76553e2e7f058aba/src/types/matcher.ts#L198)
