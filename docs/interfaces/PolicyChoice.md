[assignment-user-matcher](../README.md) / [Exports](../modules.md) / PolicyChoice

# Interface: PolicyChoice\<T\>

One selected item together with the probability the policy chose it.

## Type parameters

| Name |
| :------ |
| `T` |

## Table of contents

### Properties

- [candidateCount](PolicyChoice.md#candidatecount)
- [explored](PolicyChoice.md#explored)
- [item](PolicyChoice.md#item)
- [propensity](PolicyChoice.md#propensity)

## Properties

### candidateCount

• **candidateCount**: `number`

Size of the admissible set at that step

#### Defined in

[src/learning/policy.ts:24](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/learning/policy.ts#L24)

___

### explored

• **explored**: `boolean`

True when the step took the exploratory branch

#### Defined in

[src/learning/policy.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/learning/policy.ts#L26)

___

### item

• **item**: `T`

#### Defined in

[src/learning/policy.ts:20](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/learning/policy.ts#L20)

___

### propensity

• **propensity**: `number`

Probability of this item being chosen at the step it was chosen

#### Defined in

[src/learning/policy.ts:22](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/learning/policy.ts#L22)
