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

[src/types/matcher.ts:1585](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1585)

___

### lastFailureTime

• **lastFailureTime**: `number`

Timestamp of last failure

#### Defined in

[src/types/matcher.ts:1587](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1587)

___

### state

• **state**: ``"closed"`` \| ``"open"`` \| ``"half-open"``

Current state of the circuit breaker

#### Defined in

[src/types/matcher.ts:1583](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1583)
