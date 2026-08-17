[assignment-user-matcher](../README.md) / [Exports](../modules.md) / HistoricalAssignment

# Interface: HistoricalAssignment

An assignment from before the period start, treated as immutable context.

## Table of contents

### Properties

- [date](HistoricalAssignment.md#date)
- [employeeId](HistoricalAssignment.md#employeeid)
- [endTime](HistoricalAssignment.md#endtime)
- [id](HistoricalAssignment.md#id)
- [shiftTypeTag](HistoricalAssignment.md#shifttypetag)
- [startTime](HistoricalAssignment.md#starttime)
- [workingMinutes](HistoricalAssignment.md#workingminutes)

## Properties

### date

• **date**: `string`

ISO date the duty started on; may precede `period.startDate`.

#### Defined in

[src/scheduling/types.ts:632](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L632)

---

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:630](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L630)

---

### endTime

• **endTime**: `string`

#### Defined in

[src/scheduling/types.ts:634](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L634)

---

### id

• `Optional` **id**: `string`

#### Defined in

[src/scheduling/types.ts:638](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L638)

---

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:637](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L637)

---

### startTime

• **startTime**: `string`

#### Defined in

[src/scheduling/types.ts:633](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L633)

---

### workingMinutes

• `Optional` **workingMinutes**: `number`

Working minutes, if they differ from the elapsed span.

#### Defined in

[src/scheduling/types.ts:636](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L636)
