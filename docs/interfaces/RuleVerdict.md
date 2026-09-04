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

[src/scheduling/types.ts:770](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L770)

___

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:775](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L775)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:774](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L774)

___

### pass

• **pass**: `boolean`

#### Defined in

[src/scheduling/types.ts:767](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L767)

___

### required

• `Optional` **required**: `number`

Bound it was measured against.

#### Defined in

[src/scheduling/types.ts:772](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L772)

___

### ruleId

• **ruleId**: `string`

#### Defined in

[src/scheduling/types.ts:766](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L766)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:768](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L768)

___

### unit

• `Optional` **unit**: ``"count"`` \| ``"hours"`` \| ``"days"`` \| ``"minutes"``

#### Defined in

[src/scheduling/types.ts:773](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L773)
