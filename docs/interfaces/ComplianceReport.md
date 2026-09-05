[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ComplianceReport

# Interface: ComplianceReport

## Table of contents

### Properties

- [compliant](ComplianceReport.md#compliant)
- [contractHours](ComplianceReport.md#contracthours)
- [ledger](ComplianceReport.md#ledger)
- [verdicts](ComplianceReport.md#verdicts)
- [violations](ComplianceReport.md#violations)

## Properties

### compliant

• **compliant**: `boolean`

#### Defined in

[src/scheduling/operations.ts:57](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L57)

___

### contractHours

• **contractHours**: [`ContractHoursSummary`](ContractHoursSummary.md)[]

Planned against contracted hours — the same summary the solver reports for the same assignments.

#### Defined in

[src/scheduling/operations.ts:69](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L69)

___

### ledger

• **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

Obligations the roster accrues (compensatory rest, late-cancellation
pay, protection fallbacks, time off in lieu) — the same ledger the
solver reports for the same assignments, so a hand-edited roster can
never validate as "compliant but owing nothing".

#### Defined in

[src/scheduling/operations.ts:67](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L67)

___

### verdicts

• **verdicts**: \{ `pair`: [`AssignmentPair`](AssignmentPair.md) ; `verdicts`: [`RuleVerdict`](RuleVerdict.md)[]  }[]

Per-assignment verdicts for every rule that had something to say.

#### Defined in

[src/scheduling/operations.ts:60](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L60)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:58](https://github.com/ViljarVoidula/assignment-user-matcher/blob/5c10f943144f74081b307cfec3d33835ccc204df/src/scheduling/operations.ts#L58)
