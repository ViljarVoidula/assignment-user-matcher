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

[src/types/matcher.ts:404](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L404)

___

### lastFailureTime

• **lastFailureTime**: `number`

Timestamp of last failure

#### Defined in

[src/types/matcher.ts:406](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L406)

___

### state

• **state**: ``"closed"`` \| ``"open"`` \| ``"half-open"``

Current state of the circuit breaker

#### Defined in

[src/types/matcher.ts:402](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L402)
