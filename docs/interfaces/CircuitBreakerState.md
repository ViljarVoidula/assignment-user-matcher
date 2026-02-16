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

[src/types/matcher.ts:265](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L265)

___

### lastFailureTime

• **lastFailureTime**: `number`

Timestamp of last failure

#### Defined in

[src/types/matcher.ts:267](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L267)

___

### state

• **state**: ``"closed"`` \| ``"open"`` \| ``"half-open"``

Current state of the circuit breaker

#### Defined in

[src/types/matcher.ts:263](https://github.com/ViljarVoidula/assignment-user-matcher/blob/cdc1577018af6ef7d6c7f890d02d0fa8460bc5d9/src/types/matcher.ts#L263)
