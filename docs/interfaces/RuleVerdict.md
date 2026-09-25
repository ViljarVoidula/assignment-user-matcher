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

[src/scheduling/types.ts:963](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L963)

___

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:968](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L968)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:967](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L967)

___

### pass

• **pass**: `boolean`

#### Defined in

[src/scheduling/types.ts:960](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L960)

___

### required

• `Optional` **required**: `number`

Bound it was measured against.

#### Defined in

[src/scheduling/types.ts:965](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L965)

___

### ruleId

• **ruleId**: `string`

#### Defined in

[src/scheduling/types.ts:959](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L959)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:961](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L961)

___

### unit

• `Optional` **unit**: ``"count"`` \| ``"hours"`` \| ``"minutes"`` \| ``"days"``

#### Defined in

[src/scheduling/types.ts:966](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L966)
