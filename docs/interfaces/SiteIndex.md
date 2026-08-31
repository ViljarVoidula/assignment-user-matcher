[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SiteIndex

# Interface: SiteIndex

Indexed view of `ScheduleInput.sites` used by constraints and ranking.

## Table of contents

### Properties

- [byId](SiteIndex.md#byid)
- [resolvedTravelMinutes](SiteIndex.md#resolvedtravelminutes)
- [travelSpeedKmh](SiteIndex.md#travelspeedkmh)

## Properties

### byId

• **byId**: `Map`\<`string`, [`Site`](Site.md)\>

#### Defined in

[src/scheduling/types.ts:178](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L178)

___

### resolvedTravelMinutes

• **resolvedTravelMinutes**: `Map`\<`string`, `Map`\<`string`, `number`\>\>

Precomputed travel minutes for every ordered site pair with resolvable data.

#### Defined in

[src/scheduling/types.ts:182](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L182)

___

### travelSpeedKmh

• `Optional` **travelSpeedKmh**: `number`

Caller-supplied fallback speed for deriving minutes from haversine kilometres.

#### Defined in

[src/scheduling/types.ts:180](https://github.com/ViljarVoidula/assignment-user-matcher/blob/32161ff8553e4314f98a57fd735f2b5fec02e537/src/scheduling/types.ts#L180)
