[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SearchState

# Interface: SearchState

Mutable search state shared with constraints for delta/explain evaluation.
The engine keeps these structures consistent on every assign/unassign.

## Table of contents

### Properties

- [assignments](SearchState.md#assignments)
- [byEmployee](SearchState.md#byemployee)
- [ctx](SearchState.md#ctx)
- [minutesByEmployee](SearchState.md#minutesbyemployee)
- [timelines](SearchState.md#timelines)

### Methods

- [isAssigned](SearchState.md#isassigned)

## Properties

### assignments

• **assignments**: `Map`\<`string`, `Set`\<`string`\>\>

instanceId -> set of assigned employee ids.

#### Defined in

[src/scheduling/types.ts:1077](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1077)

___

### byEmployee

• **byEmployee**: `Map`\<`string`, `Set`\<`string`\>\>

employeeId -> assigned instance ids.

#### Defined in

[src/scheduling/types.ts:1079](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1079)

___

### ctx

• **ctx**: [`ModelContext`](ModelContext.md)

#### Defined in

[src/scheduling/types.ts:1075](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1075)

___

### minutesByEmployee

• **minutesByEmployee**: `Map`\<`string`, `number`\>

employeeId -> total assigned minutes in the period.

#### Defined in

[src/scheduling/types.ts:1081](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1081)

___

### timelines

• **timelines**: [`TimelineIndex`](../classes/TimelineIndex.md)

Per-person timelines, history included, kept in step with every
assign/unassign. Window rules read them instead of rebuilding a person's
schedule from `byEmployee` on each evaluation.

#### Defined in

[src/scheduling/types.ts:1089](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1089)

## Methods

### isAssigned

▸ **isAssigned**(`employeeId`, `instanceId`): `boolean`

Whether `(employeeId, instanceId)` is currently assigned.

#### Parameters

| Name | Type |
| :------ | :------ |
| `employeeId` | `string` |
| `instanceId` | `string` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/types.ts:1083](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L1083)
