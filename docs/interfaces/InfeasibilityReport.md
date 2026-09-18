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

[src/scheduling/operations.ts:591](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L591)

___

### findings

• **findings**: \{ `kind`: ``"noEligibleEmployee"`` \| ``"insufficientCapacity"`` \| ``"tagCapacity"`` ; `message`: `string` ; `shiftInstanceId?`: `string` ; `shortfall?`: `number` ; `tag?`: `string`  }[]

#### Defined in

[src/scheduling/operations.ts:592](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L592)
