[assignment-user-matcher](../README.md) / [Exports](../modules.md) / AutoRoutingWeightsOptions

# Interface: AutoRoutingWeightsOptions

Options controlling automatic routing-weight synthesis (UCB1 policy)

## Table of contents

### Properties

- [explorationBonus](AutoRoutingWeightsOptions.md#explorationbonus)
- [maxWeight](AutoRoutingWeightsOptions.md#maxweight)
- [minSamples](AutoRoutingWeightsOptions.md#minsamples)
- [priorWeight](AutoRoutingWeightsOptions.md#priorweight)
- [vetoThreshold](AutoRoutingWeightsOptions.md#vetothreshold)

## Properties

### explorationBonus

• `Optional` **explorationBonus**: `number`

UCB exploration coefficient; higher favors less-sampled tags (default: 0.5)

#### Defined in

[src/types/matcher.ts:830](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L830)

___

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:828](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L828)

___

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:824](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L824)

___

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:832](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L832)

___

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:826](https://github.com/ViljarVoidula/assignment-user-matcher/blob/67ac85902466fd6b69c70fd53ac0f72691650580/src/types/matcher.ts#L826)
