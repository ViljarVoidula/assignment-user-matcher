[assignment-user-matcher](../README.md) / [Exports](../modules.md) / SlaStats

# Interface: SlaStats

Aggregate SLO attainment counters from `getSlaStats()`.

## Table of contents

### Properties

- [acceptanceBreaches](SlaStats.md#acceptancebreaches)
- [acceptedInTime](SlaStats.md#acceptedintime)
- [completionBreaches](SlaStats.md#completionbreaches)
- [meanAcceptLatencyMs](SlaStats.md#meanacceptlatencyms)
- [meanCompleteLatencyMs](SlaStats.md#meancompletelatencyms)
- [offers](SlaStats.md#offers)
- [rejectionParked](SlaStats.md#rejectionparked)
- [scheduleMisses](SlaStats.md#schedulemisses)
- [ttlExpiries](SlaStats.md#ttlexpiries)

## Properties

### acceptanceBreaches

• **acceptanceBreaches**: `number`

Pending assignments whose response deadline elapsed (all, not only SLA-bearing)

#### Defined in

[src/types/matcher.ts:375](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L375)

___

### acceptedInTime

• **acceptedInTime**: `number`

Assignments accepted before their response deadline

#### Defined in

[src/types/matcher.ts:373](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L373)

___

### completionBreaches

• **completionBreaches**: `number`

Accepted assignments whose completion deadline elapsed

#### Defined in

[src/types/matcher.ts:377](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L377)

___

### meanAcceptLatencyMs

• **meanAcceptLatencyMs**: `number`

Mean accept latency in ms (acceptedAt - matchedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:385](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L385)

___

### meanCompleteLatencyMs

• **meanCompleteLatencyMs**: `number`

Mean completion latency in ms (completedAt - acceptedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:387](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L387)

___

### offers

• **offers**: `number`

Total assignments offered (pending) for the scope

#### Defined in

[src/types/matcher.ts:371](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L371)

___

### rejectionParked

• **rejectionParked**: `number`

Assignments parked because their rejection budget ran out

#### Defined in

[src/types/matcher.ts:381](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L381)

___

### scheduleMisses

• **scheduleMisses**: `number`

Assignments parked/dropped because their offer window (`schedule.notAfter`) closed

#### Defined in

[src/types/matcher.ts:383](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L383)

___

### ttlExpiries

• **ttlExpiries**: `number`

Assignments removed/parked by the freshness TTL

#### Defined in

[src/types/matcher.ts:379](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L379)
