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

[src/scheduling/operations.ts:408](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L408)

---

### findings

• **findings**: \{ `kind`: `"noEligibleEmployee"` \| `"insufficientCapacity"` \| `"tagCapacity"` ; `message`: `string` ; `shiftInstanceId?`: `string` ; `shortfall?`: `number` ; `tag?`: `string` }[]

#### Defined in

[src/scheduling/operations.ts:409](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L409)
