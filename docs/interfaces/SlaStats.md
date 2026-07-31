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
- [ttlExpiries](SlaStats.md#ttlexpiries)

## Properties

### acceptanceBreaches

• **acceptanceBreaches**: `number`

Pending assignments whose response deadline elapsed (all, not only SLA-bearing)

#### Defined in

[src/types/matcher.ts:216](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L216)

___

### acceptedInTime

• **acceptedInTime**: `number`

Assignments accepted before their response deadline

#### Defined in

[src/types/matcher.ts:214](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L214)

___

### completionBreaches

• **completionBreaches**: `number`

Accepted assignments whose completion deadline elapsed

#### Defined in

[src/types/matcher.ts:218](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L218)

___

### meanAcceptLatencyMs

• **meanAcceptLatencyMs**: `number`

Mean accept latency in ms (acceptedAt - matchedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:224](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L224)

___

### meanCompleteLatencyMs

• **meanCompleteLatencyMs**: `number`

Mean completion latency in ms (completedAt - acceptedAt), 0 when no data

#### Defined in

[src/types/matcher.ts:226](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L226)

___

### offers

• **offers**: `number`

Total assignments offered (pending) for the scope

#### Defined in

[src/types/matcher.ts:212](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L212)

___

### rejectionParked

• **rejectionParked**: `number`

Assignments parked because their rejection budget ran out

#### Defined in

[src/types/matcher.ts:222](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L222)

___

### ttlExpiries

• **ttlExpiries**: `number`

Assignments removed/parked by the freshness TTL

#### Defined in

[src/types/matcher.ts:220](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L220)
