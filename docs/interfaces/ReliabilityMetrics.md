[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ReliabilityMetrics

# Interface: ReliabilityMetrics

Reliability metrics for monitoring

## Table of contents

### Properties

- [circuitBreakerAllowingRequests](ReliabilityMetrics.md#circuitbreakerallowingrequests)
- [circuitBreakerState](ReliabilityMetrics.md#circuitbreakerstate)
- [deadLetterQueueSize](ReliabilityMetrics.md#deadletterqueuesize)
- [lastConnectedAt](ReliabilityMetrics.md#lastconnectedat)
- [lastError](ReliabilityMetrics.md#lasterror)
- [lastHealthCheckAt](ReliabilityMetrics.md#lasthealthcheckat)
- [reconnectCount](ReliabilityMetrics.md#reconnectcount)
- [redisHealthy](ReliabilityMetrics.md#redishealthy)

## Properties

### circuitBreakerAllowingRequests

• **circuitBreakerAllowingRequests**: `boolean`

Whether circuit breaker is currently allowing requests

#### Defined in

[src/types/matcher.ts:426](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L426)

___

### circuitBreakerState

• **circuitBreakerState**: [`CircuitBreakerState`](CircuitBreakerState.md)

Current circuit breaker state

#### Defined in

[src/types/matcher.ts:412](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L412)

___

### deadLetterQueueSize

• **deadLetterQueueSize**: `number`

Current Dead Letter Queue size

#### Defined in

[src/types/matcher.ts:414](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L414)

___

### lastConnectedAt

• **lastConnectedAt**: `number`

Timestamp of last successful connection

#### Defined in

[src/types/matcher.ts:422](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L422)

___

### lastError

• `Optional` **lastError**: `string`

Last error message if any

#### Defined in

[src/types/matcher.ts:420](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L420)

___

### lastHealthCheckAt

• `Optional` **lastHealthCheckAt**: `number`

Timestamp of last health check

#### Defined in

[src/types/matcher.ts:424](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L424)

___

### reconnectCount

• **reconnectCount**: `number`

Number of reconnection attempts since start

#### Defined in

[src/types/matcher.ts:418](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L418)

___

### redisHealthy

• **redisHealthy**: `boolean`

Whether Redis is considered healthy

#### Defined in

[src/types/matcher.ts:416](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L416)
