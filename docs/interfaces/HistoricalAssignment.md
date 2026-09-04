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
- [siteId](HistoricalAssignment.md#siteid)
- [startTime](HistoricalAssignment.md#starttime)
- [workingMinutes](HistoricalAssignment.md#workingminutes)

## Properties

### date

• **date**: `string`

ISO date the duty started on; may precede `period.startDate`.

#### Defined in

[src/scheduling/types.ts:710](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L710)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:708](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L708)

___

### endTime

• **endTime**: `string`

#### Defined in

[src/scheduling/types.ts:712](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L712)

___

### id

• `Optional` **id**: `string`

#### Defined in

[src/scheduling/types.ts:718](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L718)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:715](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L715)

___

### siteId

• `Optional` **siteId**: `string`

Site where the historical duty took place, so cross-site travel gaps can be enforced at the period boundary.

#### Defined in

[src/scheduling/types.ts:717](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L717)

___

### startTime

• **startTime**: `string`

#### Defined in

[src/scheduling/types.ts:711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L711)

___

### workingMinutes

• `Optional` **workingMinutes**: `number`

Working minutes, if they differ from the elapsed span.

#### Defined in

[src/scheduling/types.ts:714](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L714)
