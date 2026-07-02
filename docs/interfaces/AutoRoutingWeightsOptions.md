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

[src/types/matcher.ts:510](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L510)

___

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:508](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L508)

___

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:504](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L504)

___

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:512](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L512)

___

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:506](https://github.com/ViljarVoidula/assignment-user-matcher/blob/a2b968d8469e70a64512419c49eaf6a09004fda6/src/types/matcher.ts#L506)
