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

[src/scheduling/types.ts:831](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L831)

___

### citation

• `Optional` **citation**: `string`

#### Defined in

[src/scheduling/types.ts:836](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L836)

___

### message

• **message**: `string`

#### Defined in

[src/scheduling/types.ts:835](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L835)

___

### pass

• **pass**: `boolean`

#### Defined in

[src/scheduling/types.ts:828](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L828)

___

### required

• `Optional` **required**: `number`

Bound it was measured against.

#### Defined in

[src/scheduling/types.ts:833](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L833)

___

### ruleId

• **ruleId**: `string`

#### Defined in

[src/scheduling/types.ts:827](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L827)

___

### severity

• **severity**: [`Severity`](../modules.md#severity)

#### Defined in

[src/scheduling/types.ts:829](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L829)

___

### unit

• `Optional` **unit**: ``"count"`` \| ``"hours"`` \| ``"days"`` \| ``"minutes"``

#### Defined in

[src/scheduling/types.ts:834](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L834)
