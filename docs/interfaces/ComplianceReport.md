[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ComplianceReport

# Interface: ComplianceReport

## Table of contents

### Properties

- [compliant](ComplianceReport.md#compliant)
- [contractHours](ComplianceReport.md#contracthours)
- [coverageComplete](ComplianceReport.md#coveragecomplete)
- [ledger](ComplianceReport.md#ledger)
- [publishable](ComplianceReport.md#publishable)
- [verdicts](ComplianceReport.md#verdicts)
- [violations](ComplianceReport.md#violations)

## Properties

### compliant

• **compliant**: `boolean`

#### Defined in

[src/scheduling/operations.ts:61](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L61)

___

### contractHours

• **contractHours**: [`ContractHoursSummary`](ContractHoursSummary.md)[]

Planned against contracted hours — the same summary the solver reports for the same assignments.

#### Defined in

[src/scheduling/operations.ts:77](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L77)

___

### coverageComplete

• **coverageComplete**: `boolean`

Whether all headcount and skill coverage requirements are met.

#### Defined in

[src/scheduling/operations.ts:63](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L63)

___

### ledger

• **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Obligations the roster accrues (compensatory rest, late-cancellation
pay, protection fallbacks, time off in lieu) — the same ledger the
solver reports for the same assignments, so a hand-edited roster can
never validate as "compliant but owing nothing".

#### Defined in

[src/scheduling/operations.ts:75](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L75)

___

### publishable

• **publishable**: `boolean`

A fully covered roster with no hard breaches.

#### Defined in

[src/scheduling/operations.ts:65](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L65)

___

### verdicts

• **verdicts**: \{ `pair`: [`AssignmentPair`](AssignmentPair.md) ; `verdicts`: [`RuleVerdict`](RuleVerdict.md)[]  }[]

Per-assignment verdicts for every rule that had something to say.

#### Defined in

[src/scheduling/operations.ts:68](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L68)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:66](https://github.com/ViljarVoidula/assignment-user-matcher/blob/e31fe4af714c62a4dc6fa37196c45b503b1587f3/src/scheduling/operations.ts#L66)
