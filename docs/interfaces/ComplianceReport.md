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

[src/scheduling/operations.ts:45](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L45)

___

### ledger

• **ledger**: [`LedgerEntry`](LedgerEntry.md)[]

#### Defined in

[src/scheduling/operations.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L49)

___

### verdicts

• **verdicts**: \{ `pair`: [`AssignmentPair`](AssignmentPair.md) ; `verdicts`: [`RuleVerdict`](RuleVerdict.md)[]  }[]

Per-assignment verdicts for every rule that had something to say.

#### Defined in

[src/scheduling/operations.ts:48](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L48)

___

### violations

• **violations**: [`ConstraintViolation`](ConstraintViolation.md)[]

#### Defined in

[src/scheduling/operations.ts:46](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L46)
