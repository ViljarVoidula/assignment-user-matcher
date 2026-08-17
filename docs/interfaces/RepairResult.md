[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RepairResult

# Interface: RepairResult

## Table of contents

### Properties

- [candidates](RepairResult.md#candidates)
- [diff](RepairResult.md#diff)
- [perturbation](RepairResult.md#perturbation)
- [violationsIntroduced](RepairResult.md#violationsintroduced)

## Properties

### candidates

• **candidates**: [`RepairCandidate`](RepairCandidate.md)[]

#### Defined in

[src/scheduling/operations.ts:159](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L159)

---

### diff

• **diff**: `Object`

#### Type declaration

| Name      | Type                                    |
| :-------- | :-------------------------------------- |
| `added`   | [`AssignmentPair`](AssignmentPair.md)[] |
| `removed` | [`AssignmentPair`](AssignmentPair.md)[] |

#### Defined in

[src/scheduling/operations.ts:158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L158)

---

### perturbation

• **perturbation**: `Object`

#### Type declaration

| Name                 | Type     |
| :------------------- | :------- |
| `affectedEmployees`  | `number` |
| `changedAssignments` | `number` |

#### Defined in

[src/scheduling/operations.ts:161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L161)

---

### violationsIntroduced

• **violationsIntroduced**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L160)
