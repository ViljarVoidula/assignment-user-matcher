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

[src/scheduling/operations.ts:179](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L179)

___

### diff

• **diff**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `added` | [`AssignmentPair`](AssignmentPair.md)[] |
| `removed` | [`AssignmentPair`](AssignmentPair.md)[] |

#### Defined in

[src/scheduling/operations.ts:178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L178)

___

### perturbation

• **perturbation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `affectedEmployees` | `number` |
| `changedAssignments` | `number` |

#### Defined in

[src/scheduling/operations.ts:181](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L181)

___

### violationsIntroduced

• **violationsIntroduced**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:180](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L180)
