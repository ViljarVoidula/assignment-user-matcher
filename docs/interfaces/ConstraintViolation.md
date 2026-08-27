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

[src/scheduling/types.ts:673](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L673)

___

### citation

• `Optional` **citation**: `string`

Legal source, echoed from the rule that produced it.

#### Defined in

[src/scheduling/types.ts:671](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L671)

___

### constraintId

• **constraintId**: `string`

#### Defined in

[src/scheduling/types.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L665)

___

### employeeId

• `Optional` **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:669](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L669)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L667)

___

### required

• `Optional` **required**: `number`

#### Defined in

[src/scheduling/types.ts:674](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L674)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:666](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L666)

___

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/types.ts:668](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L668)

___

### unit

• `Optional` **unit**: `string`

#### Defined in

[src/scheduling/types.ts:675](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/types.ts#L675)
