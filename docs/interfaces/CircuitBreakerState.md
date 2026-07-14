[assignment-user-matcher](../README.md) / [Exports](../modules.md) / CircuitBreakerState

# Interface: CircuitBreakerState

Circuit breaker state for backpressure management

## Table of contents

### Properties

- [failureCount](CircuitBreakerState.md#failurecount)
- [lastFailureTime](CircuitBreakerState.md#lastfailuretime)
- [state](CircuitBreakerState.md#state)

## Properties

### failureCount

• **failureCount**: `number`

Number of consecutive failures

#### Defined in

[src/types/matcher.ts:691](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L691)

---

### lastFailureTime

• **lastFailureTime**: `number`

Timestamp of last failure

#### Defined in

[src/types/matcher.ts:693](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L693)

---

### state

• **state**: `"closed"` \| `"open"` \| `"half-open"`

Current state of the circuit breaker

#### Defined in

[src/types/matcher.ts:689](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a509b01d4cde774650bf913f0453283620e5b4ee/src/types/matcher.ts#L689)
