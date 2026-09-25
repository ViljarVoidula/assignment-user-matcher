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

[src/scheduling/operations.ts:235](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/operations.ts#L235)

___

### diff

• **diff**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `added` | [`AssignmentPair`](AssignmentPair.md)[] |
| `removed` | [`AssignmentPair`](AssignmentPair.md)[] |

#### Defined in

[src/scheduling/operations.ts:234](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/operations.ts#L234)

___

### perturbation

• **perturbation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `affectedEmployees` | `number` |
| `changedAssignments` | `number` |

#### Defined in

[src/scheduling/operations.ts:237](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/operations.ts#L237)

___

### violationsIntroduced

• **violationsIntroduced**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:236](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/operations.ts#L236)
