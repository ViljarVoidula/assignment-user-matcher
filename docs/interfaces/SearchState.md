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

[src/scheduling/types.ts:868](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L868)

---

### byEmployee

• **byEmployee**: `Map`\<`string`, `Set`\<`string`\>\>

employeeId -> assigned instance ids.

#### Defined in

[src/scheduling/types.ts:870](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L870)

---

### ctx

• **ctx**: [`ModelContext`](ModelContext.md)

#### Defined in

[src/scheduling/types.ts:866](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L866)

---

### minutesByEmployee

• **minutesByEmployee**: `Map`\<`string`, `number`\>

employeeId -> total assigned minutes in the period.

#### Defined in

[src/scheduling/types.ts:872](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L872)

---

### timelines

• **timelines**: `TimelineIndex`

Per-person timelines, history included, kept in step with every
assign/unassign. Window rules read them instead of rebuilding a person's
schedule from `byEmployee` on each evaluation.

#### Defined in

[src/scheduling/types.ts:880](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L880)

## Methods

### isAssigned

▸ **isAssigned**(`employeeId`, `instanceId`): `boolean`

Whether `(employeeId, instanceId)` is currently assigned.

#### Parameters

| Name         | Type     |
| :----------- | :------- |
| `employeeId` | `string` |
| `instanceId` | `string` |

#### Returns

`boolean`

#### Defined in

[src/scheduling/types.ts:874](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L874)
