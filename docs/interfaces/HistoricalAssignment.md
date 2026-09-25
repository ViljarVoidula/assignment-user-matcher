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

[src/scheduling/types.ts:903](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L903)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:901](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L901)

___

### endTime

• **endTime**: `string`

#### Defined in

[src/scheduling/types.ts:905](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L905)

___

### id

• `Optional` **id**: `string`

#### Defined in

[src/scheduling/types.ts:911](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L911)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:908](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L908)

___

### siteId

• `Optional` **siteId**: `string`

Site where the historical duty took place, so cross-site travel gaps can be enforced at the period boundary.

#### Defined in

[src/scheduling/types.ts:910](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L910)

___

### startTime

• **startTime**: `string`

#### Defined in

[src/scheduling/types.ts:904](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L904)

___

### workingMinutes

• `Optional` **workingMinutes**: `number`

Working minutes, if they differ from the elapsed span.

#### Defined in

[src/scheduling/types.ts:907](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L907)
