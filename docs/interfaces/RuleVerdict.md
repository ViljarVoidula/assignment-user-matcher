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

[src/scheduling/types.ts:718](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L718)

___

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:723](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L723)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:722](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L722)

___

### pass

• **pass**: `boolean`

#### Defined in

[src/scheduling/types.ts:715](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L715)

___

### required

• `Optional` **required**: `number`

Bound it was measured against.

#### Defined in

[src/scheduling/types.ts:720](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L720)

___

### ruleId

• **ruleId**: `string`

#### Defined in

[src/scheduling/types.ts:714](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L714)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:716](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L716)

___

### unit

• `Optional` **unit**: ``"count"`` \| ``"hours"`` \| ``"days"`` \| ``"minutes"``

#### Defined in

[src/scheduling/types.ts:721](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L721)
