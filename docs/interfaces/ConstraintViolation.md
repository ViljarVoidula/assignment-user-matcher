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

[src/scheduling/types.ts:673](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L673)

---

### citation

• `Optional` **citation**: `string`

Legal source, echoed from the rule that produced it.

#### Defined in

[src/scheduling/types.ts:671](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L671)

---

### constraintId

• **constraintId**: `string`

#### Defined in

[src/scheduling/types.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L665)

---

### employeeId

• `Optional` **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:669](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L669)

---

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:667](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L667)

---

### required

• `Optional` **required**: `number`

#### Defined in

[src/scheduling/types.ts:674](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L674)

---

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:666](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L666)

---

### shiftInstanceId

• `Optional` **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/types.ts:668](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L668)

---

### unit

• `Optional` **unit**: `string`

#### Defined in

[src/scheduling/types.ts:675](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L675)
