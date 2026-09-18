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

[src/scheduling/types.ts:563](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L563)

___

### holidayAllowed

• `Optional` **holidayAllowed**: `boolean`

#### Defined in

[src/scheduling/types.ts:566](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L566)

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

[src/scheduling/types.ts:561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L561)

___

### minFreeSundaysPerYear

• `Optional` **minFreeSundaysPerYear**: `number`

e.g. Germany's 15, the Netherlands' 13.

#### Defined in

[src/scheduling/types.ts:559](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L559)

___

### sundayAllowed

• `Optional` **sundayAllowed**: `boolean`

Bar Sunday or holiday work outright.

#### Defined in

[src/scheduling/types.ts:565](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/types.ts#L565)
