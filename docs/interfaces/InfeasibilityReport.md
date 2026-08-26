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

[src/scheduling/operations.ts:408](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L408)

___

### findings

• **findings**: \{ `kind`: ``"noEligibleEmployee"`` \| ``"insufficientCapacity"`` \| ``"tagCapacity"`` ; `message`: `string` ; `shiftInstanceId?`: `string` ; `shortfall?`: `number` ; `tag?`: `string`  }[]

#### Defined in

[src/scheduling/operations.ts:409](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L409)
