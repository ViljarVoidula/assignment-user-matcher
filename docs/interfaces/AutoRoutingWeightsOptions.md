[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AutoRoutingWeightsOptions

# Interface: AutoRoutingWeightsOptions

Options controlling automatic routing-weight synthesis (UCB1 policy)

## Table of contents

### Properties

- [confidenceZ](AutoRoutingWeightsOptions.md#confidencez)
- [decayHalfLifeMs](AutoRoutingWeightsOptions.md#decayhalflifems)
- [explorationBonus](AutoRoutingWeightsOptions.md#explorationbonus)
- [maxDeltaPerSync](AutoRoutingWeightsOptions.md#maxdeltapersync)
- [maxWeight](AutoRoutingWeightsOptions.md#maxweight)
- [minSamples](AutoRoutingWeightsOptions.md#minsamples)
- [minSamplesForVeto](AutoRoutingWeightsOptions.md#minsamplesforveto)
- [minTotalSamples](AutoRoutingWeightsOptions.md#mintotalsamples)
- [policy](AutoRoutingWeightsOptions.md#policy)
- [priorStrength](AutoRoutingWeightsOptions.md#priorstrength)
- [priorVariance](AutoRoutingWeightsOptions.md#priorvariance)
- [priorWeight](AutoRoutingWeightsOptions.md#priorweight)
- [rewardModel](AutoRoutingWeightsOptions.md#rewardmodel)
- [rewardRange](AutoRoutingWeightsOptions.md#rewardrange)
- [rng](AutoRoutingWeightsOptions.md#rng)
- [terminalOnlyTagStats](AutoRoutingWeightsOptions.md#terminalonlytagstats)
- [totalAttempts](AutoRoutingWeightsOptions.md#totalattempts)
- [vetoCooldownMs](AutoRoutingWeightsOptions.md#vetocooldownms)
- [vetoThreshold](AutoRoutingWeightsOptions.md#vetothreshold)

## Properties

### confidenceZ

• `Optional` **confidenceZ**: `number`

Z-score used by the 'confidence' policy for UCB/LCB bounds (default: 1.96).
Also reused as the exploration multiplier by 'ucb1' when explorationBonus
is omitted and policy is 'confidence' for backward compatibility.

#### Defined in

[src/types/matcher.ts:2066](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2066)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Reward-squared half-life in ms for tag statistics. When set, older
observations are decayed exponentially on read (default: undefined =
no decay).

#### Defined in

[src/types/matcher.ts:2091](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2091)

___

### explorationBonus

• `Optional` **explorationBonus**: `number`

UCB exploration coefficient; higher favors less-sampled tags (default: 0.5)

#### Defined in

[src/types/matcher.ts:2051](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2051)

___

### maxDeltaPerSync

• `Optional` **maxDeltaPerSync**: `number`

Maximum absolute change allowed per sync on a single learned weight
(default: undefined = no clamping). Vetoes that pass the strict veto
gate may still jump to 0 despite the clamp.

#### Defined in

[src/types/matcher.ts:2085](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2085)

___

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:2049](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2049)

___

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:2045](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2045)

___

### minSamplesForVeto

• `Optional` **minSamplesForVeto**: `number`

Minimum samples required before a learned veto may override a tag that
already has a manual (non-learned) routing weight (defaults to
`minSamples`, i.e. 5, for backward compatibility). Raise it — 20 is a
reasonable production floor — to make learned vetoes of operator-set
weights harder to trigger.

#### Defined in

[src/types/matcher.ts:2079](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2079)

___

### minTotalSamples

• `Optional` **minTotalSamples**: `number`

Minimum total samples across all of a user's tags before sync will write
any learned weights (default: 0 = off).

#### Defined in

[src/types/matcher.ts:2071](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2071)

___

### policy

• `Optional` **policy**: [`AutoRoutingWeightsPolicy`](../modules.md#autoroutingweightspolicy)

Synthesis policy.
- 'ucb1' (default): current mean + exploration-bonus mapping.
- 'confidence': upper-confidence-bound for weight, lower-confidence-bound for veto.
- 'thompson': sample from the per-tag posterior when mapping to a weight.

#### Defined in

[src/types/matcher.ts:2060](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2060)

___

### priorStrength

• `Optional` **priorStrength**: `number`

Strength of the prior in pseudo-observations (default: 2). Higher
values shrink under-sampled tags harder toward the prior.

#### Defined in

[src/types/matcher.ts:2132](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2132)

___

### priorVariance

• `Optional` **priorVariance**: `number`

Prior variance for the `'gaussian'` reward model
(default: `((max - min) / 4) ** 2`). Acts as a floor: five identical
observations still leave a non-zero standard error, so uncertainty
reflects evidence rather than coincidence.

#### Defined in

[src/types/matcher.ts:2127](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2127)

___

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:2053](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2053)

___

### rewardModel

• `Optional` **rewardModel**: ``"gaussian"`` \| ``"bernoulli"``

Posterior family used for uncertainty.

- `'gaussian'` (default): normal posterior over the mean reward, with a
  prior variance floor so repeated identical observations never become
  infinitely certain.
- `'bernoulli'`: Beta-Bernoulli posterior over rewards rescaled into
  [0, 1] by `rewardRange`. Appropriate when the reward really is a
  success indicator; do not use it on arbitrary continuous rewards.

#### Defined in

[src/types/matcher.ts:2113](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2113)

___

### rewardRange

• `Optional` **rewardRange**: [`number`, `number`]

Reward scale `[min, max]` (default `[-1, 1]`). Sets the default prior
variance and the mapping used by the `'bernoulli'` reward model.
The `'ucb1'` exploration coefficient is only portable within a fixed
scale — state it explicitly if your rewards are not in [-1, 1].

#### Defined in

[src/types/matcher.ts:2120](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2120)

___

### rng

• `Optional` **rng**: () => `number`

Optional random source for Thompson sampling. Defaults to Math.random.
Must return values in [0, 1).

#### Type declaration

▸ (): `number`

##### Returns

`number`

#### Defined in

[src/types/matcher.ts:2102](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2102)

___

### terminalOnlyTagStats

• `Optional` **terminalOnlyTagStats**: `boolean`

If true, only terminal outcomes (complete/reject/expire/fail plus manual
rewards/feedback) feed tag statistics; non-terminal 'accept' updates are
skipped (default: false).

#### Defined in

[src/types/matcher.ts:2097](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2097)

___

### totalAttempts

• `Optional` **totalAttempts**: `number`

Judge `minTotalSamples` against this count of independent attempts
instead of the sum of per-tag counts. One assignment carrying three
tags is one attempt, not three, and summing tags lets correlated
evidence clear a worker-level floor on its own.

#### Defined in

[src/types/matcher.ts:2147](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2147)

___

### vetoCooldownMs

• `Optional` **vetoCooldownMs**: `number`

Time after a tag's last observation at which a learned veto lapses and
the tag returns at `priorWeight` for reassessment (default: undefined =
vetoes never lapse). Prefer setting this over permanent exclusion: a
hard veto with no recovery path means a worker who improved, or whose
bad run was circumstantial, can never be re-evaluated.

#### Defined in

[src/types/matcher.ts:2140](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2140)

___

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:2047](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/types/matcher.ts#L2047)
