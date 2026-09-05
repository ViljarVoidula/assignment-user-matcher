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

[src/scheduling/operations.ts:204](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L204)

___

### diff

• **diff**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `added` | [`AssignmentPair`](AssignmentPair.md)[] |
| `removed` | [`AssignmentPair`](AssignmentPair.md)[] |

#### Defined in

[src/scheduling/operations.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L203)

___

### perturbation

• **perturbation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `affectedEmployees` | `number` |
| `changedAssignments` | `number` |

#### Defined in

[src/scheduling/operations.ts:206](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L206)

___

### violationsIntroduced

• **violationsIntroduced**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L205)
