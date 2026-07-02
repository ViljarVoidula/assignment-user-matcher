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

[src/types/matcher.ts:510](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L510)

---

### maxWeight

• `Optional` **maxWeight**: `number`

Maximum synthesized weight on the conventional 0-100 scale (default: 100)

#### Defined in

[src/types/matcher.ts:508](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L508)

---

### minSamples

• `Optional` **minSamples**: `number`

Minimum observations before a tag's stats are trusted (default: 5)

#### Defined in

[src/types/matcher.ts:504](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L504)

---

### priorWeight

• `Optional` **priorWeight**: `number`

Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2)

#### Defined in

[src/types/matcher.ts:512](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L512)

---

### vetoThreshold

• `Optional` **vetoThreshold**: `number`

Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5)

#### Defined in

[src/types/matcher.ts:506](https://github.com/ViljarVoidula/assignment-user-matcher/blob/d4f8d56dce2452af0f96c1a85e94fb29dbe2afd5/src/types/matcher.ts#L506)
