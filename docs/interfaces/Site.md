[assignment-user-matcher](../README.md) / [Exports](../modules.md) / Site

# Interface: Site

A physical site, with optional coordinates and an asymmetric travel-time matrix.

## Table of contents

### Properties

- [id](Site.md#id)
- [lat](Site.md#lat)
- [lng](Site.md#lng)
- [publicHolidays](Site.md#publicholidays)
- [timeZone](Site.md#timezone)
- [travelMinutesTo](Site.md#travelminutesto)

## Properties

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:207](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L207)

___

### lat

• `Optional` **lat**: `number`

#### Defined in

[src/scheduling/types.ts:208](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L208)

___

### lng

• `Optional` **lng**: `number`

#### Defined in

[src/scheduling/types.ts:209](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L209)

___

### publicHolidays

• `Optional` **publicHolidays**: `string`[]

Public holidays observed at this site, as ISO dates.

A site's own calendar replaces `ScheduleInput.calendar.publicHolidays`
for its shifts — which is what makes one roster legible across a border,
where Midsummer is a holiday on one side of it and an ordinary Friday on
the other. An empty array means "no holidays here", not "inherit"; omit
the field to inherit the roster calendar.

Holidays are a fact about *where the shift happens*, so they follow the
site and never the worker. What follows the worker is their employment
law, expressed as `Employee.rules`.

#### Defined in

[src/scheduling/types.ts:225](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L225)

___

### timeZone

• `Optional` **timeZone**: `string`

IANA zone this site's wall clock is read in.

Declared for validation, not yet for arithmetic: instances resolve once
against the roster's single `PeriodClock`, so a roster whose sites span
two zones would place one of them an hour out — visible in the night
band, break windows and day boundaries, invisible in the verdict.
`buildSiteIndex` therefore *refuses* a site whose zone differs from the
period's, rather than answering the wrong question quietly. Split such a
roster by zone until the clock is per site.

#### Defined in

[src/scheduling/types.ts:237](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L237)

___

### travelMinutesTo

• `Optional` **travelMinutesTo**: `Record`\<`string`, `number`\>

Travel time from this site to another site, in minutes. Takes precedence over haversine estimates.

#### Defined in

[src/scheduling/types.ts:211](https://github.com/ViljarVoidula/assignment-user-matcher/blob/18a837e2d48156ed11f2e3ec23754ebc79f4706c/src/scheduling/types.ts#L211)
