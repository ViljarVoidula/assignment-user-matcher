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

[src/types/matcher.ts:713](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L713)

---

### circuitBreakerState

• **circuitBreakerState**: [`CircuitBreakerState`](CircuitBreakerState.md)

Current circuit breaker state

#### Defined in

[src/types/matcher.ts:699](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L699)

---

### deadLetterQueueSize

• **deadLetterQueueSize**: `number`

Current Dead Letter Queue size

#### Defined in

[src/types/matcher.ts:701](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L701)

---

### lastConnectedAt

• **lastConnectedAt**: `number`

Timestamp of last successful connection

#### Defined in

[src/types/matcher.ts:709](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L709)

---

### lastError

• `Optional` **lastError**: `string`

Last error message if any

#### Defined in

[src/types/matcher.ts:707](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L707)

---

### lastHealthCheckAt

• `Optional` **lastHealthCheckAt**: `number`

Timestamp of last health check

#### Defined in

[src/types/matcher.ts:711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L711)

---

### reconnectCount

• **reconnectCount**: `number`

Number of reconnection attempts since start

#### Defined in

[src/types/matcher.ts:705](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L705)

---

### redisHealthy

• **redisHealthy**: `boolean`

Whether Redis is considered healthy

#### Defined in

[src/types/matcher.ts:703](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L703)
