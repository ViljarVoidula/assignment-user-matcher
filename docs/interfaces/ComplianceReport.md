[assignment-user-matcher](../README.md) / [Exports](../modules.md) / ComplianceReport

# Interface: ComplianceReport

## Table of contents

### Properties

- [compliant](ComplianceReport.md#compliant)
- [ledger](ComplianceReport.md#ledger)
- [verdicts](ComplianceReport.md#verdicts)
- [violations](ComplianceReport.md#violations)

## Properties

### compliant

• **compliant**: `boolean`

#### Defined in

[src/scheduling/operations.ts:45](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L45)

---

### ledger

• **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

#### Defined in

[src/scheduling/operations.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L49)

---

### verdicts

• **verdicts**: \{ `pair`: [`AssignmentPair`](AssignmentPair.md) ; `verdicts`: [`RuleVerdict`](RuleVerdict.md)[] }[]

Per-assignment verdicts for every rule that had something to say.

#### Defined in

[src/scheduling/operations.ts:48](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L48)

---

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:46](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L46)
