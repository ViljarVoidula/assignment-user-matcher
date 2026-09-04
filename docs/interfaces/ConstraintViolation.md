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

[src/scheduling/types.ts:753](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L753)

___

### citation

• `Optional` **citation**: `string`

Legal source, echoed from the rule that produced it.

#### Defined in

[src/scheduling/types.ts:751](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L751)

___

### constraintId

• **constraintId**: `string`

#### Defined in

[src/scheduling/types.ts:745](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L745)

___

### employeeId

• `Optional` **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:749](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L749)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:747](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L747)

___

### required

• `Optional` **required**: `number`

#### Defined in

[src/scheduling/types.ts:754](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L754)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:746](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L746)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/types.ts:748](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L748)

___

### unit

• `Optional` **unit**: `string`

#### Defined in

[src/scheduling/types.ts:755](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L755)
