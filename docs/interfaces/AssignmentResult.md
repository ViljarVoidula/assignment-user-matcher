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

[src/types/matcher.ts:1539](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1539)

___

### error

• `Optional` **error**: `string`

Error message if failed

#### Defined in

[src/types/matcher.ts:1541](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1541)

___

### success

• **success**: `boolean`

Outcome: success or failure

#### Defined in

[src/types/matcher.ts:1537](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1537)
