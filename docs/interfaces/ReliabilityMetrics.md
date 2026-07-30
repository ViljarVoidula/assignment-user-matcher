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

[src/types/matcher.ts:1018](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1018)

___

### circuitBreakerState

• **circuitBreakerState**: [`CircuitBreakerState`](CircuitBreakerState.md)

Current circuit breaker state

#### Defined in

[src/types/matcher.ts:1004](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1004)

___

### deadLetterQueueSize

• **deadLetterQueueSize**: `number`

Current Dead Letter Queue size

#### Defined in

[src/types/matcher.ts:1006](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1006)

___

### lastConnectedAt

• **lastConnectedAt**: `number`

Timestamp of last successful connection

#### Defined in

[src/types/matcher.ts:1014](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1014)

___

### lastError

• `Optional` **lastError**: `string`

Last error message if any

#### Defined in

[src/types/matcher.ts:1012](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1012)

___

### lastHealthCheckAt

• `Optional` **lastHealthCheckAt**: `number`

Timestamp of last health check

#### Defined in

[src/types/matcher.ts:1016](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1016)

___

### reconnectCount

• **reconnectCount**: `number`

Number of reconnection attempts since start

#### Defined in

[src/types/matcher.ts:1010](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1010)

___

### redisHealthy

• **redisHealthy**: `boolean`

Whether Redis is considered healthy

#### Defined in

[src/types/matcher.ts:1008](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L1008)
