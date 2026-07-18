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

[src/types/matcher.ts:746](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L746)

___

### circuitBreakerState

• **circuitBreakerState**: [`CircuitBreakerState`](CircuitBreakerState.md)

Current circuit breaker state

#### Defined in

[src/types/matcher.ts:732](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L732)

___

### deadLetterQueueSize

• **deadLetterQueueSize**: `number`

Current Dead Letter Queue size

#### Defined in

[src/types/matcher.ts:734](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L734)

___

### lastConnectedAt

• **lastConnectedAt**: `number`

Timestamp of last successful connection

#### Defined in

[src/types/matcher.ts:742](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L742)

___

### lastError

• `Optional` **lastError**: `string`

Last error message if any

#### Defined in

[src/types/matcher.ts:740](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L740)

___

### lastHealthCheckAt

• `Optional` **lastHealthCheckAt**: `number`

Timestamp of last health check

#### Defined in

[src/types/matcher.ts:744](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L744)

___

### reconnectCount

• **reconnectCount**: `number`

Number of reconnection attempts since start

#### Defined in

[src/types/matcher.ts:738](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L738)

___

### redisHealthy

• **redisHealthy**: `boolean`

Whether Redis is considered healthy

#### Defined in

[src/types/matcher.ts:736](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L736)
