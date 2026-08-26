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
- [priorWeight](AutoRoutingWeightsOptions.md#priorweight)
- [rng](AutoRoutingWeightsOptions.md#rng)
- [terminalOnlyTagStats](AutoRoutingWeightsOptions.md#terminalonlytagstats)
- [vetoThreshold](AutoRoutingWeightsOptions.md#vetothreshold)

## Properties

### confidenceZ

• `Optional` **confidenceZ**: `number`

Z-score used by the 'confidence' policy for UCB/LCB bounds (default: 1.96).
Also reused as the exploration multiplier by 'ucb1' when explorationBonus
is omitted and policy is 'confidence' for backward compatibility.

#### Defined in

[src/types/matcher.ts:1717](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1717)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Reward-squared half-life in ms for tag statistics. When set, older
observations are decayed exponentially on read (default: undefined =
no decay).

#### Defined in

[src/types/matcher.ts:1742](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1742)

___

### explorationBonus

• `Optional` **explorationBonus**: `number`

UCB exploration coefficient; higher favors less-sampled tags (default: 0.5)

#### Defined in

[src/types/matcher.ts:1702](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1702)

___

### maxDeltaPerSync

• `Optional` **maxDeltaPerSync**: `number`

Maximum absolute change allowed per sync on a single learned weight
(default: undefined = no clamping). Vetoes that pass the strict veto
gate may still jump to 0 despite the clamp.

#### Defined in

[src/types/matcher.ts:1736](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1736)

___

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:1700](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1700)

___

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:1696](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1696)

___

### minSamplesForVeto

• `Optional` **minSamplesForVeto**: `number`

Minimum samples required before a learned veto may override a tag that
already has a manual (non-learned) routing weight (defaults to
`minSamples`, i.e. 5, for backward compatibility). Raise it — 20 is a
reasonable production floor — to make learned vetoes of operator-set
weights harder to trigger.

#### Defined in

[src/types/matcher.ts:1730](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1730)

___

### minTotalSamples

• `Optional` **minTotalSamples**: `number`

Minimum total samples across all of a user's tags before sync will write
any learned weights (default: 0 = off).

#### Defined in

[src/types/matcher.ts:1722](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1722)

___

### policy

• `Optional` **policy**: [`AutoRoutingWeightsPolicy`](../modules.md#autoroutingweightspolicy)

Synthesis policy.
- 'ucb1' (default): current mean + exploration-bonus mapping.
- 'confidence': upper-confidence-bound for weight, lower-confidence-bound for veto.
- 'thompson': sample from the per-tag posterior when mapping to a weight.

#### Defined in

[src/types/matcher.ts:1711](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1711)

___

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:1704](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1704)

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

[src/types/matcher.ts:1753](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1753)

___

### terminalOnlyTagStats

• `Optional` **terminalOnlyTagStats**: `boolean`

If true, only terminal outcomes (complete/reject/expire/fail plus manual
rewards/feedback) feed tag statistics; non-terminal 'accept' updates are
skipped (default: false).

#### Defined in

[src/types/matcher.ts:1748](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1748)

___

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:1698](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/types/matcher.ts#L1698)
