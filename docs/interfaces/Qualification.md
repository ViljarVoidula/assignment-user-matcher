[assignment-user-matcher](../README.md) / [Exports](../modules.md) / Qualification

# Interface: Qualification

A qualification, optionally valid only for part of the period.

## Table of contents

### Properties

- [level](Qualification.md#level)
- [tag](Qualification.md#tag)
- [validFrom](Qualification.md#validfrom)
- [validUntil](Qualification.md#validuntil)

## Properties

### level

• `Optional` **level**: `number`

Optional proficiency; group-composition rules can require a minimum.

#### Defined in

[src/scheduling/types.ts:83](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L83)

___

### tag

• **tag**: `string`

Matches `ShiftTemplate.tagRequirements` keys and `requiredTags`.

#### Defined in

[src/scheduling/types.ts:81](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L81)

___

### validFrom

• `Optional` **validFrom**: `string`

Inclusive ISO date the qualification becomes valid.

#### Defined in

[src/scheduling/types.ts:85](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L85)

___

### validUntil

• `Optional` **validUntil**: `string`

Inclusive ISO date the qualification expires. A shift after this is ineligible.

#### Defined in

[src/scheduling/types.ts:87](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L87)
