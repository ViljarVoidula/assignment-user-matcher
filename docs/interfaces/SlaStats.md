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

[src/types/matcher.ts:276](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L276)

___

### acceptedInTime

• **acceptedInTime**: `number`

Assignments accepted before their response deadline

#### Defined in

[src/types/matcher.ts:274](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L274)

___

### completionBreaches

• **completionBreaches**: `number`

Accepted assignments whose completion deadline elapsed

#### Defined in

[src/types/matcher.ts:278](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L278)

___

### meanAcceptLatencyMs

• **meanAcceptLatencyMs**: `number`

Mean accept latency in ms (acceptedAt - matchedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:286](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L286)

___

### meanCompleteLatencyMs

• **meanCompleteLatencyMs**: `number`

Mean completion latency in ms (completedAt - acceptedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:288](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L288)

___

### offers

• **offers**: `number`

Total assignments offered (pending) for the scope

#### Defined in

[src/types/matcher.ts:272](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L272)

___

### rejectionParked

• **rejectionParked**: `number`

Assignments parked because their rejection budget ran out

#### Defined in

[src/types/matcher.ts:282](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L282)

___

### scheduleMisses

• **scheduleMisses**: `number`

Assignments parked/dropped because their offer window (`schedule.notAfter`) closed

#### Defined in

[src/types/matcher.ts:284](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L284)

___

### ttlExpiries

• **ttlExpiries**: `number`

Assignments removed/parked by the freshness TTL

#### Defined in

[src/types/matcher.ts:280](https://github.com/ViljarVoidula/assignment-user-matcher/blob/8600cd216fc8e6c0c58c15d71b6fd72a034fd374/src/types/matcher.ts#L280)
