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

[src/scheduling/types.ts:191](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L191)

___

### resolvedTravelMinutes

• **resolvedTravelMinutes**: `Map`\<`string`, `Map`\<`string`, `number`\>\>

Precomputed travel minutes for every ordered site pair with resolvable data.

#### Defined in

[src/scheduling/types.ts:195](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L195)

___

### travelSpeedKmh

• `Optional` **travelSpeedKmh**: `number`

Caller-supplied fallback speed for deriving minutes from haversine kilometres.

#### Defined in

[src/scheduling/types.ts:193](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/scheduling/types.ts#L193)
