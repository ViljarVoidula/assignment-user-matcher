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

[src/scheduling/types.ts:658](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L658)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:656](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L656)

___

### endTime

• **endTime**: `string`

#### Defined in

[src/scheduling/types.ts:660](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L660)

___

### id

• `Optional` **id**: `string`

#### Defined in

[src/scheduling/types.ts:666](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L666)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:663](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L663)

___

### siteId

• `Optional` **siteId**: `string`

Site where the historical duty took place, so cross-site travel gaps can be enforced at the period boundary.

#### Defined in

[src/scheduling/types.ts:665](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L665)

___

### startTime

• **startTime**: `string`

#### Defined in

[src/scheduling/types.ts:659](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L659)

___

### workingMinutes

• `Optional` **workingMinutes**: `number`

Working minutes, if they differ from the elapsed span.

#### Defined in

[src/scheduling/types.ts:662](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L662)
