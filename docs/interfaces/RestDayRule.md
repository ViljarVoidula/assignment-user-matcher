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

[src/scheduling/types.ts:497](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L497)

___

### holidayAllowed

• `Optional` **holidayAllowed**: `boolean`

#### Defined in

[src/scheduling/types.ts:500](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L500)

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

[src/scheduling/types.ts:495](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L495)

___

### minFreeSundaysPerYear

• `Optional` **minFreeSundaysPerYear**: `number`

e.g. Germany's 15, the Netherlands' 13.

#### Defined in

[src/scheduling/types.ts:493](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L493)

___

### sundayAllowed

• `Optional` **sundayAllowed**: `boolean`

Bar Sunday or holiday work outright.

#### Defined in

[src/scheduling/types.ts:499](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/types.ts#L499)
