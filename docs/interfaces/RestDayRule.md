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

[src/scheduling/types.ts:583](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L583)

___

### holidayAllowed

• `Optional` **holidayAllowed**: `boolean`

#### Defined in

[src/scheduling/types.ts:586](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L586)

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

[src/scheduling/types.ts:581](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L581)

___

### minFreeSundaysPerYear

• `Optional` **minFreeSundaysPerYear**: `number`

e.g. Germany's 15, the Netherlands' 13.

#### Defined in

[src/scheduling/types.ts:579](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L579)

___

### sundayAllowed

• `Optional` **sundayAllowed**: `boolean`

Bar Sunday or holiday work outright.

#### Defined in

[src/scheduling/types.ts:585](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L585)
