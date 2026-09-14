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

[src/scheduling/types.ts:242](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L242)

___

### resolvedTravelMinutes

• **resolvedTravelMinutes**: `Map`\<`string`, `Map`\<`string`, `number`\>\>

Precomputed travel minutes for every ordered site pair with resolvable data.

#### Defined in

[src/scheduling/types.ts:246](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L246)

___

### travelSpeedKmh

• `Optional` **travelSpeedKmh**: `number`

Caller-supplied fallback speed for deriving minutes from haversine kilometres.

#### Defined in

[src/scheduling/types.ts:244](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L244)
