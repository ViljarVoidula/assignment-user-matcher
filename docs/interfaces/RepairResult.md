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

[src/scheduling/operations.ts:191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L191)

___

### diff

• **diff**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `added` | [`AssignmentPair`](AssignmentPair.md)[] |
| `removed` | [`AssignmentPair`](AssignmentPair.md)[] |

#### Defined in

[src/scheduling/operations.ts:190](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L190)

___

### perturbation

• **perturbation**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `affectedEmployees` | `number` |
| `changedAssignments` | `number` |

#### Defined in

[src/scheduling/operations.ts:193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L193)

___

### violationsIntroduced

• **violationsIntroduced**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:192](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/operations.ts#L192)
