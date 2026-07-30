[assignment-user-matcher](../README.md) / [Exports](../modules.md) / EscalationPolicy

# Interface: EscalationPolicy

What should happen when the user an assignment was matched to lets the
response deadline run out without accepting or rejecting it.

Without a policy, an unanswered assignment is simply requeued after the
matcher-wide `matchExpirationMs` — and the same user may win it straight
back. A policy makes that behaviour explicit and controllable: a
per-assignment deadline, an optional block on the non-responder, a priority
climb, and an optional tier ladder that moves the assignment to a different
pool on each hop (primary → secondary → manager) with no workflow involved.

**`Example`**

```typescript
await matcher.addAssignment({
    id: 'incident-1',
    tags: ['sev:1', 'oncall-primary'],
    escalation: {
        respondWithinMs: 60_000,
        onNoResponse: 'block',
        priorityBoost: 500,
        tiers: [['oncall-primary'], ['oncall-secondary'], ['oncall-manager']],
        onExhausted: 'park',
    },
});
```

## Table of contents

### Properties

- [maxEscalations](EscalationPolicy.md#maxescalations)
- [onExhausted](EscalationPolicy.md#onexhausted)
- [onNoResponse](EscalationPolicy.md#onnoresponse)
- [priorityBoost](EscalationPolicy.md#priorityboost)
- [respondWithinMs](EscalationPolicy.md#respondwithinms)
- [tiers](EscalationPolicy.md#tiers)

## Properties

### maxEscalations

• `Optional` **maxEscalations**: `number`

Maximum number of escalations.

**`Default`**

`tiers.length - 1` when tiers are given, otherwise unlimited

#### Defined in

[src/types/matcher.ts:114](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L114)

___

### onExhausted

• `Optional` **onExhausted**: ``"queue"`` \| ``"park"``

Terminal behaviour once the ladder is exhausted.
- `'queue'` — requeue and keep offering it (default).
- `'park'` — stop matching it and move it to the parked store, where
  `getParkedAssignments()` / `unparkAssignment()` can pick it up. This is
  the honest "escalated to the top and nobody answered" state.

**`Default`**

```ts
'queue'
```

#### Defined in

[src/types/matcher.ts:123](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L123)

___

### onNoResponse

• `Optional` **onNoResponse**: ``"block"`` \| ``"allow"``

What happens to the user who let the clock run out.
- `'block'` — treated as a soft rejection: the user is added to their
  rejected set so the requeue cannot land back on them.
- `'allow'` — the assignment returns to the open pool and the same user
  may win it again (the historical behaviour).

**`Default`**

```ts
'allow'
```

#### Defined in

[src/types/matcher.ts:100](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L100)

___

### priorityBoost

• `Optional` **priorityBoost**: `number`

Priority delta applied on each escalation so ignored work climbs the queue.

#### Defined in

[src/types/matcher.ts:102](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L102)

___

### respondWithinMs

• **respondWithinMs**: `number`

Milliseconds the matched user has to respond before the assignment is
taken back. Per-assignment override of `matchExpirationMs`.

#### Defined in

[src/types/matcher.ts:91](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L91)

___

### tiers

• `Optional` **tiers**: `string`[][]

Tag ladder. Each escalation replaces the assignment's tier tags with the
next entry, so tier routing needs no workflow. Tags not named by any
tier are preserved across hops. Entry 0 describes the tags the
assignment starts with; the first escalation moves it to entry 1.

#### Defined in

[src/types/matcher.ts:109](https://github.com/ViljarVoidula/assignment-user-matcher/blob/f853b579a0d896b86670698da5eb35de58484c98/src/types/matcher.ts#L109)
