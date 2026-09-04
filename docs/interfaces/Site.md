[assignment-user-matcher](../README.md) / [Exports](../modules.md) / Site

# Interface: Site

A physical site, with optional coordinates and an asymmetric travel-time matrix.

## Table of contents

### Properties

- [id](Site.md#id)
- [lat](Site.md#lat)
- [lng](Site.md#lng)
- [travelMinutesTo](Site.md#travelminutesto)

## Properties

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L182)

___

### lat

• `Optional` **lat**: `number`

#### Defined in

[src/scheduling/types.ts:183](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L183)

___

### lng

• `Optional` **lng**: `number`

#### Defined in

[src/scheduling/types.ts:184](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L184)

___

### travelMinutesTo

• `Optional` **travelMinutesTo**: `Record`\<`string`, `number`\>

Travel time from this site to another site, in minutes. Takes precedence over haversine estimates.

#### Defined in

[src/scheduling/types.ts:186](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L186)
