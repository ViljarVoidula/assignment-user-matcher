[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ConstraintViolation

# Interface: ConstraintViolation

A constraint breach that survived into the returned schedule.

## Table of contents

### Properties

- [actual](ConstraintViolation.md#actual)
- [citation](ConstraintViolation.md#citation)
- [constraintId](ConstraintViolation.md#constraintid)
- [employeeId](ConstraintViolation.md#employeeid)
- [message](ConstraintViolation.md#message)
- [required](ConstraintViolation.md#required)
- [severity](ConstraintViolation.md#severity)
- [shiftInstanceId](ConstraintViolation.md#shiftinstanceid)
- [unit](ConstraintViolation.md#unit)

## Properties

### actual

• `Optional` **actual**: `number`

The measured value and the bound it broke, for machine-readable reports.

#### Defined in

[src/scheduling/types.ts:814](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L814)

___

### citation

• `Optional` **citation**: `string`

Legal source, echoed from the rule that produced it.

#### Defined in

[src/scheduling/types.ts:812](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L812)

___

### constraintId

• **constraintId**: `string`

#### Defined in

[src/scheduling/types.ts:806](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L806)

___

### employeeId

• `Optional` **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:810](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L810)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:808](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L808)

___

### required

• `Optional` **required**: `number`

#### Defined in

[src/scheduling/types.ts:815](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L815)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:807](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L807)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/types.ts:809](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L809)

___

### unit

• `Optional` **unit**: `string`

#### Defined in

[src/scheduling/types.ts:816](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L816)
