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

[src/types/matcher.ts:1647](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1647)

___

### error

• `Optional` **error**: `string`

Error message if failed

#### Defined in

[src/types/matcher.ts:1649](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1649)

___

### success

• **success**: `boolean`

Outcome: success or failure

#### Defined in

[src/types/matcher.ts:1645](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/types/matcher.ts#L1645)
