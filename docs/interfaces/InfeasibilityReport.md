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

[src/scheduling/operations.ts:535](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/operations.ts#L535)

___

### findings

• **findings**: \{ `kind`: ``"noEligibleEmployee"`` \| ``"insufficientCapacity"`` \| ``"tagCapacity"`` ; `message`: `string` ; `shiftInstanceId?`: `string` ; `shortfall?`: `number` ; `tag?`: `string`  }[]

#### Defined in

[src/scheduling/operations.ts:536](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/operations.ts#L536)
