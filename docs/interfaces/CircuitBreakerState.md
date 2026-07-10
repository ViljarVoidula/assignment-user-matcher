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

[src/types/matcher.ts:439](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L439)

---

### lastFailureTime

• **lastFailureTime**: `number`

Timestamp of last failure

#### Defined in

[src/types/matcher.ts:441](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L441)

---

### state

• **state**: `"closed"` \| `"open"` \| `"half-open"`

Current state of the circuit breaker

#### Defined in

[src/types/matcher.ts:437](https://github.com/ViljarVoidula/assignment-user-matcher/blob/fb907b9fa03f8b108af924838157f4245941a522/src/types/matcher.ts#L437)
