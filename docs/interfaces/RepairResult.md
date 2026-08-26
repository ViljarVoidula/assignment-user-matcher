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

[src/scheduling/operations.ts:159](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L159)

___

### diff

• **diff**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `added` | [`AssignmentPair`](AssignmentPair.md)[] |
| `removed` | [`AssignmentPair`](AssignmentPair.md)[] |

#### Defined in

[src/scheduling/operations.ts:158](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L158)

___

### perturbation

• **perturbation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `affectedEmployees` | `number` |
| `changedAssignments` | `number` |

#### Defined in

[src/scheduling/operations.ts:161](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L161)

___

### violationsIntroduced

• **violationsIntroduced**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:160](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L160)
