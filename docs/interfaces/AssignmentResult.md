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

[src/types/matcher.ts:1132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1132)

___

### error

• `Optional` **error**: `string`

Error message if failed

#### Defined in

[src/types/matcher.ts:1134](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1134)

___

### success

• **success**: `boolean`

Outcome: success or failure

#### Defined in

[src/types/matcher.ts:1130](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1130)
