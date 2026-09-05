[assignment-user-matcher](../README.md) / [Exports](../modules.md) / InfeasibilityReport

# Interface: InfeasibilityReport

## Table of contents

### Properties

- [feasible](InfeasibilityReport.md#feasible)
- [findings](InfeasibilityReport.md#findings)

## Properties

### feasible

• **feasible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:535](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L535)

___

### findings

• **findings**: \{ `kind`: ``"noEligibleEmployee"`` \| ``"insufficientCapacity"`` \| ``"tagCapacity"`` ; `message`: `string` ; `shiftInstanceId?`: `string` ; `shortfall?`: `number` ; `tag?`: `string`  }[]

#### Defined in

[src/scheduling/operations.ts:536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L536)
