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

[src/scheduling/types.ts:262](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L262)

___

### resolvedTravelMinutes

• **resolvedTravelMinutes**: `Map`\<`string`, `Map`\<`string`, `number`\>\>

Precomputed travel minutes for every ordered site pair with resolvable data.

#### Defined in

[src/scheduling/types.ts:266](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L266)

___

### travelSpeedKmh

• `Optional` **travelSpeedKmh**: `number`

Caller-supplied fallback speed for deriving minutes from haversine kilometres.

#### Defined in

[src/scheduling/types.ts:264](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L264)
