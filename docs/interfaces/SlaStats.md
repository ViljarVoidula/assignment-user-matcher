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

[src/types/matcher.ts:562](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L562)

___

### acceptedInTime

• **acceptedInTime**: `number`

Assignments accepted before their response deadline

#### Defined in

[src/types/matcher.ts:556](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L556)

___

### completionBreaches

• **completionBreaches**: `number`

Accepted assignments whose completion deadline elapsed

#### Defined in

[src/types/matcher.ts:564](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L564)

___

### meanAcceptLatencyMs

• **meanAcceptLatencyMs**: `number`

Mean accept latency in ms (acceptedAt - matchedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:572](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L572)

___

### meanCompleteLatencyMs

• **meanCompleteLatencyMs**: `number`

Mean completion latency in ms (completedAt - acceptedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:574](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L574)

___

### offers

• **offers**: `number`

Total assignments offered (pending) for the scope

#### Defined in

[src/types/matcher.ts:554](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L554)

___

### rejectionParked

• **rejectionParked**: `number`

Assignments parked because their rejection budget ran out

#### Defined in

[src/types/matcher.ts:568](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L568)

___

### scheduleMisses

• **scheduleMisses**: `number`

Assignments parked/dropped because their offer window (`schedule.notAfter`) closed

#### Defined in

[src/types/matcher.ts:570](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L570)

___

### ttlExpiries

• **ttlExpiries**: `number`

Assignments removed/parked by the freshness TTL

#### Defined in

[src/types/matcher.ts:566](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b634360620cd48da2d30183ba514010ac4bd1bba/src/types/matcher.ts#L566)
