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

Pending assignments whose response deadline elapsed. The response clock
applies to every assignment (escalation window or `matchExpirationMs`),
but like every counter here only SLA-bearing assignments are measured.

#### Defined in

[src/types/matcher.ts:385](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L385)

___

### acceptedInTime

• **acceptedInTime**: `number`

Assignments accepted before their response deadline

#### Defined in

[src/types/matcher.ts:379](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L379)

___

### completionBreaches

• **completionBreaches**: `number`

Accepted assignments whose completion deadline elapsed

#### Defined in

[src/types/matcher.ts:387](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L387)

___

### meanAcceptLatencyMs

• **meanAcceptLatencyMs**: `number`

Mean accept latency in ms (acceptedAt - matchedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:395](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L395)

___

### meanCompleteLatencyMs

• **meanCompleteLatencyMs**: `number`

Mean completion latency in ms (completedAt - acceptedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:397](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L397)

___

### offers

• **offers**: `number`

Total assignments offered (pending) for the scope

#### Defined in

[src/types/matcher.ts:377](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L377)

___

### rejectionParked

• **rejectionParked**: `number`

Assignments parked because their rejection budget ran out

#### Defined in

[src/types/matcher.ts:391](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L391)

___

### scheduleMisses

• **scheduleMisses**: `number`

Assignments parked/dropped because their offer window (`schedule.notAfter`) closed

#### Defined in

[src/types/matcher.ts:393](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L393)

___

### ttlExpiries

• **ttlExpiries**: `number`

Assignments removed/parked by the freshness TTL

#### Defined in

[src/types/matcher.ts:389](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a504415158022f52ed81c1ca96eab16d6963f15e/src/types/matcher.ts#L389)
