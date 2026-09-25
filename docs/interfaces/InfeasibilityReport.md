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

[src/scheduling/operations.ts:596](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/operations.ts#L596)

___

### findings

• **findings**: \{ `kind`: ``"noEligibleEmployee"`` \| ``"insufficientCapacity"`` \| ``"tagCapacity"`` ; `message`: `string` ; `shiftInstanceId?`: `string` ; `shortfall?`: `number` ; `tag?`: `string`  }[]

#### Defined in

[src/scheduling/operations.ts:597](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/operations.ts#L597)
