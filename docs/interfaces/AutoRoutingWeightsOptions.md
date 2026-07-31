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

[src/types/matcher.ts:1310](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1310)

___

### decayHalfLifeMs

• `Optional` **decayHalfLifeMs**: `number`

Reward-squared half-life in ms for tag statistics. When set, older
observations are decayed exponentially on read (default: undefined =
no decay).

#### Defined in

[src/types/matcher.ts:1335](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1335)

___

### explorationBonus

• `Optional` **explorationBonus**: `number`

UCB exploration coefficient; higher favors less-sampled tags (default: 0.5)

#### Defined in

[src/types/matcher.ts:1295](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1295)

___

### maxDeltaPerSync

• `Optional` **maxDeltaPerSync**: `number`

Maximum absolute change allowed per sync on a single learned weight
(default: undefined = no clamping). Vetoes that pass the strict veto
gate may still jump to 0 despite the clamp.

#### Defined in

[src/types/matcher.ts:1329](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1329)

___

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:1293](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1293)

___

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:1289](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1289)

___

### minSamplesForVeto

• `Optional` **minSamplesForVeto**: `number`

Minimum samples required before a learned veto may override a tag that
already has a manual (non-learned) routing weight (defaults to
`minSamples`, i.e. 5, for backward compatibility). Raise it — 20 is a
reasonable production floor — to make learned vetoes of operator-set
weights harder to trigger.

#### Defined in

[src/types/matcher.ts:1323](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1323)

___

### minTotalSamples

• `Optional` **minTotalSamples**: `number`

Minimum total samples across all of a user's tags before sync will write
any learned weights (default: 0 = off).

#### Defined in

[src/types/matcher.ts:1315](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1315)

___

### policy

• `Optional` **policy**: [`AutoRoutingWeightsPolicy`](../modules.md#autoroutingweightspolicy)

Synthesis policy.
- 'ucb1' (default): current mean + exploration-bonus mapping.
- 'confidence': upper-confidence-bound for weight, lower-confidence-bound for veto.
- 'thompson': sample from the per-tag posterior when mapping to a weight.

#### Defined in

[src/types/matcher.ts:1304](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1304)

___

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:1297](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1297)

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

[src/types/matcher.ts:1346](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1346)

___

### terminalOnlyTagStats

• `Optional` **terminalOnlyTagStats**: `boolean`

If true, only terminal outcomes (complete/reject/expire/fail plus manual
rewards/feedback) feed tag statistics; non-terminal 'accept' updates are
skipped (default: false).

#### Defined in

[src/types/matcher.ts:1341](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1341)

___

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:1291](https://github.com/ViljarVoidula/assignment-user-matcher/blob/74234b5233cf2b1ef022c426a022a6c52be974af/src/types/matcher.ts#L1291)
