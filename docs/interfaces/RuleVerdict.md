[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RuleVerdict

# Interface: RuleVerdict

A single rule's structured judgement on one candidate assignment.

The same type answers "why can't Anna work this shift?", validates a proposed
swap, and populates the violation report — so the score and the explanation
can never drift apart, which they do as soon as they have separate code paths.

## Table of contents

### Properties

- [actual](RuleVerdict.md#actual)
- [citation](RuleVerdict.md#citation)
- [message](RuleVerdict.md#message)
- [pass](RuleVerdict.md#pass)
- [required](RuleVerdict.md#required)
- [ruleId](RuleVerdict.md#ruleid)
- [severity](RuleVerdict.md#severity)
- [unit](RuleVerdict.md#unit)

## Properties

### actual

• `Optional` **actual**: `number`

Measured value, e.g. rest actually available.

#### Defined in

[src/scheduling/types.ts:943](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L943)

___

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:948](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L948)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:947](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L947)

___

### pass

• **pass**: `boolean`

#### Defined in

[src/scheduling/types.ts:940](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L940)

___

### required

• `Optional` **required**: `number`

Bound it was measured against.

#### Defined in

[src/scheduling/types.ts:945](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L945)

___

### ruleId

• **ruleId**: `string`

#### Defined in

[src/scheduling/types.ts:939](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L939)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:941](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L941)

___

### unit

• `Optional` **unit**: ``"count"`` \| ``"hours"`` \| ``"minutes"`` \| ``"days"``

#### Defined in

[src/scheduling/types.ts:946](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L946)
