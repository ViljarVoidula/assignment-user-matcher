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

[src/types/matcher.ts:2027](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2027)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Reward-squared half-life in ms for tag statistics. When set, older
observations are decayed exponentially on read (default: undefined =
no decay).

#### Defined in

[src/types/matcher.ts:2052](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2052)

___

### explorationBonus

• `Optional` **explorationBonus**: `number`

UCB exploration coefficient; higher favors less-sampled tags (default: 0.5)

#### Defined in

[src/types/matcher.ts:2012](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2012)

___

### maxDeltaPerSync

• `Optional` **maxDeltaPerSync**: `number`

Maximum absolute change allowed per sync on a single learned weight
(default: undefined = no clamping). Vetoes that pass the strict veto
gate may still jump to 0 despite the clamp.

#### Defined in

[src/types/matcher.ts:2046](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2046)

___

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:2010](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2010)

___

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:2006](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2006)

___

### minSamplesForVeto

• `Optional` **minSamplesForVeto**: `number`

Minimum samples required before a learned veto may override a tag that
already has a manual (non-learned) routing weight (defaults to
`minSamples`, i.e. 5, for backward compatibility). Raise it — 20 is a
reasonable production floor — to make learned vetoes of operator-set
weights harder to trigger.

#### Defined in

[src/types/matcher.ts:2040](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2040)

___

### minTotalSamples

• `Optional` **minTotalSamples**: `number`

Minimum total samples across all of a user's tags before sync will write
any learned weights (default: 0 = off).

#### Defined in

[src/types/matcher.ts:2032](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2032)

___

### policy

• `Optional` **policy**: [`AutoRoutingWeightsPolicy`](../modules.md#autoroutingweightspolicy)

Synthesis policy.
- 'ucb1' (default): current mean + exploration-bonus mapping.
- 'confidence': upper-confidence-bound for weight, lower-confidence-bound for veto.
- 'thompson': sample from the per-tag posterior when mapping to a weight.

#### Defined in

[src/types/matcher.ts:2021](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2021)

___

### priorStrength

• `Optional` **priorStrength**: `number`

Strength of the prior in pseudo-observations (default: 2). Higher
values shrink under-sampled tags harder toward the prior.

#### Defined in

[src/types/matcher.ts:2093](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2093)

___

### priorVariance

• `Optional` **priorVariance**: `number`

Prior variance for the `'gaussian'` reward model
(default: `((max - min) / 4) ** 2`). Acts as a floor: five identical
observations still leave a non-zero standard error, so uncertainty
reflects evidence rather than coincidence.

#### Defined in

[src/types/matcher.ts:2088](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2088)

___

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:2014](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2014)

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

[src/types/matcher.ts:2074](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2074)

___

### rewardRange

• `Optional` **rewardRange**: [`number`, `number`]

Reward scale `[min, max]` (default `[-1, 1]`). Sets the default prior
variance and the mapping used by the `'bernoulli'` reward model.
The `'ucb1'` exploration coefficient is only portable within a fixed
scale — state it explicitly if your rewards are not in [-1, 1].

#### Defined in

[src/types/matcher.ts:2081](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2081)

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

[src/types/matcher.ts:2063](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2063)

___

### terminalOnlyTagStats

• `Optional` **terminalOnlyTagStats**: `boolean`

If true, only terminal outcomes (complete/reject/expire/fail plus manual
rewards/feedback) feed tag statistics; non-terminal 'accept' updates are
skipped (default: false).

#### Defined in

[src/types/matcher.ts:2058](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2058)

___

### totalAttempts

• `Optional` **totalAttempts**: `number`

Judge `minTotalSamples` against this count of independent attempts
instead of the sum of per-tag counts. One assignment carrying three
tags is one attempt, not three, and summing tags lets correlated
evidence clear a worker-level floor on its own.

#### Defined in

[src/types/matcher.ts:2108](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2108)

___

### vetoCooldownMs

• `Optional` **vetoCooldownMs**: `number`

Time after a tag's last observation at which a learned veto lapses and
the tag returns at `priorWeight` for reassessment (default: undefined =
vetoes never lapse). Prefer setting this over permanent exclusion: a
hard veto with no recovery path means a worker who improved, or whose
bad run was circumstantial, can never be re-evaluated.

#### Defined in

[src/types/matcher.ts:2101](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2101)

___

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:2008](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/types/matcher.ts#L2008)
