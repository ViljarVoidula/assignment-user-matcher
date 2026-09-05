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

[src/scheduling/types.ts:771](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L771)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/types.ts:769](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L769)

___

### endTime

• **endTime**: `string`

#### Defined in

[src/scheduling/types.ts:773](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L773)

___

### id

• `Optional` **id**: `string`

#### Defined in

[src/scheduling/types.ts:779](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L779)

___

### shiftTypeTag

• `Optional` **shiftTypeTag**: `string`

#### Defined in

[src/scheduling/types.ts:776](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L776)

___

### siteId

• `Optional` **siteId**: `string`

Site where the historical duty took place, so cross-site travel gaps can be enforced at the period boundary.

#### Defined in

[src/scheduling/types.ts:778](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L778)

___

### startTime

• **startTime**: `string`

#### Defined in

[src/scheduling/types.ts:772](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L772)

___

### workingMinutes

• `Optional` **workingMinutes**: `number`

Working minutes, if they differ from the elapsed span.

#### Defined in

[src/scheduling/types.ts:775](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L775)
