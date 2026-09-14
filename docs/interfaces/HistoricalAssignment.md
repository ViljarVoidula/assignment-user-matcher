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

[src/scheduling/types.ts:883](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L883)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:881](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L881)

___

### endTime

• **endTime**: `string`

#### Defined in

[src/scheduling/types.ts:885](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L885)

___

### id

• `Optional` **id**: `string`

#### Defined in

[src/scheduling/types.ts:891](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L891)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:888](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L888)

___

### siteId

• `Optional` **siteId**: `string`

Site where the historical duty took place, so cross-site travel gaps can be enforced at the period boundary.

#### Defined in

[src/scheduling/types.ts:890](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L890)

___

### startTime

• **startTime**: `string`

#### Defined in

[src/scheduling/types.ts:884](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L884)

___

### workingMinutes

• `Optional` **workingMinutes**: `number`

Working minutes, if they differ from the elapsed span.

#### Defined in

[src/scheduling/types.ts:887](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L887)
