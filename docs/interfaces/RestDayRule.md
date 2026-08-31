[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RestDayRule

# Interface: RestDayRule

Rest days, Sunday and public-holiday rules.

## Table of contents

### Properties

- [compensatoryRestWithinDays](RestDayRule.md#compensatoryrestwithindays)
- [holidayAllowed](RestDayRule.md#holidayallowed)
- [minFreeSundaysPer](RestDayRule.md#minfreesundaysper)
- [minFreeSundaysPerYear](RestDayRule.md#minfreesundaysperyear)
- [sundayAllowed](RestDayRule.md#sundayallowed)

## Properties

### compensatoryRestWithinDays

• `Optional` **compensatoryRestWithinDays**: `Object`

Deadline for the substitute rest day Sunday or holiday work creates.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `holiday?` | `number` |
| `sunday?` | `number` |

#### Defined in

[src/scheduling/types.ts:445](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L445)

___

### holidayAllowed

• `Optional` **holidayAllowed**: `boolean`

#### Defined in

[src/scheduling/types.ts:448](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L448)

___

### minFreeSundaysPer

• `Optional` **minFreeSundaysPer**: `Object`

Rolling form, e.g. Poland's one free Sunday per 4 weeks.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `count` | `number` |
| `weeks` | `number` |

#### Defined in

[src/scheduling/types.ts:443](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L443)

___

### minFreeSundaysPerYear

• `Optional` **minFreeSundaysPerYear**: `number`

e.g. Germany's 15, the Netherlands' 13.

#### Defined in

[src/scheduling/types.ts:441](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L441)

___

### sundayAllowed

• `Optional` **sundayAllowed**: `boolean`

Bar Sunday or holiday work outright.

#### Defined in

[src/scheduling/types.ts:447](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L447)
