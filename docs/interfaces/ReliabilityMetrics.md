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

[src/types/matcher.ts:561](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L561)

---

### circuitBreakerState

• **circuitBreakerState**: [`CircuitBreakerState`](CircuitBreakerState.md)

Current circuit breaker state

#### Defined in

[src/types/matcher.ts:547](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L547)

---

### deadLetterQueueSize

• **deadLetterQueueSize**: `number`

Current Dead Letter Queue size

#### Defined in

[src/types/matcher.ts:549](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L549)

---

### lastConnectedAt

• **lastConnectedAt**: `number`

Timestamp of last successful connection

#### Defined in

[src/types/matcher.ts:557](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L557)

---

### lastError

• `Optional` **lastError**: `string`

Last error message if any

#### Defined in

[src/types/matcher.ts:555](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L555)

---

### lastHealthCheckAt

• `Optional` **lastHealthCheckAt**: `number`

Timestamp of last health check

#### Defined in

[src/types/matcher.ts:559](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L559)

---

### reconnectCount

• **reconnectCount**: `number`

Number of reconnection attempts since start

#### Defined in

[src/types/matcher.ts:553](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L553)

---

### redisHealthy

• **redisHealthy**: `boolean`

Whether Redis is considered healthy

#### Defined in

[src/types/matcher.ts:551](https://github.com/ViljarVoidula/assignment-user-matcher/blob/9740691a6c978ed597b8a107d0d77e8dbb4c9423/src/types/matcher.ts#L551)
