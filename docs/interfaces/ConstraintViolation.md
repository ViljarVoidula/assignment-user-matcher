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

[src/scheduling/types.ts:946](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L946)

___

### citation

• `Optional` **citation**: `string`

Legal source, echoed from the rule that produced it.

#### Defined in

[src/scheduling/types.ts:944](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L944)

___

### constraintId

• **constraintId**: `string`

#### Defined in

[src/scheduling/types.ts:938](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L938)

___

### employeeId

• `Optional` **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:942](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L942)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:940](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L940)

___

### required

• `Optional` **required**: `number`

#### Defined in

[src/scheduling/types.ts:947](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L947)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:939](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L939)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/types.ts:941](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L941)

___

### unit

• `Optional` **unit**: `string`

#### Defined in

[src/scheduling/types.ts:948](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L948)
