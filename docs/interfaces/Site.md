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

[src/scheduling/types.ts:227](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L227)

___

### lat

• `Optional` **lat**: `number`

#### Defined in

[src/scheduling/types.ts:228](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L228)

___

### lng

• `Optional` **lng**: `number`

#### Defined in

[src/scheduling/types.ts:229](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L229)

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

[src/scheduling/types.ts:245](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L245)

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

[src/scheduling/types.ts:257](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L257)

___

### travelMinutesTo

• `Optional` **travelMinutesTo**: `Record`\<`string`, `number`\>

Travel time from this site to another site, in minutes. Takes precedence over haversine estimates.

#### Defined in

[src/scheduling/types.ts:231](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/scheduling/types.ts#L231)
