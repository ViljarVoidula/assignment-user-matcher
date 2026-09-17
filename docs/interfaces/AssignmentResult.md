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

[src/types/matcher.ts:1679](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1679)

___

### error

• `Optional` **error**: `string`

Error message if failed

#### Defined in

[src/types/matcher.ts:1681](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1681)

___

### success

• **success**: `boolean`

Outcome: success or failure

#### Defined in

[src/types/matcher.ts:1677](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L1677)
