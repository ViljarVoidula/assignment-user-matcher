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

[src/scheduling/types.ts:169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L169)

___

### lat

• `Optional` **lat**: `number`

#### Defined in

[src/scheduling/types.ts:170](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L170)

___

### lng

• `Optional` **lng**: `number`

#### Defined in

[src/scheduling/types.ts:171](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L171)

___

### travelMinutesTo

• `Optional` **travelMinutesTo**: `Record`\<`string`, `number`\>

Travel time from this site to another site, in minutes. Takes precedence over haversine estimates.

#### Defined in

[src/scheduling/types.ts:173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L173)
