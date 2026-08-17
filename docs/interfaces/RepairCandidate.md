[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RepairCandidate

# Interface: RepairCandidate

## Table of contents

### Properties

- [blockers](RepairCandidate.md#blockers)
- [eligible](RepairCandidate.md#eligible)
- [employeeId](RepairCandidate.md#employeeid)
- [fairnessDebt](RepairCandidate.md#fairnessdebt)
- [marginalCostCents](RepairCandidate.md#marginalcostcents)
- [rank](RepairCandidate.md#rank)
- [rationale](RepairCandidate.md#rationale)
- [shiftInstanceId](RepairCandidate.md#shiftinstanceid)
- [verdicts](RepairCandidate.md#verdicts)

## Properties

### blockers

• **blockers**: [`RuleVerdict`](RuleVerdict.md)[]

Failing rules only, for a compact "why not" list.

#### Defined in

[src/scheduling/operations.ts:148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L148)

---

### eligible

• **eligible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:145](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L145)

---

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/operations.ts:143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L143)

---

### fairnessDebt

• **fairnessDebt**: `number`

How far below their fair share of extra work this person is. Higher means more owed.

#### Defined in

[src/scheduling/operations.ts:151](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L151)

---

### marginalCostCents

• **marginalCostCents**: `number`

#### Defined in

[src/scheduling/operations.ts:149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L149)

---

### rank

• **rank**: `number`

Lower is a better call.

#### Defined in

[src/scheduling/operations.ts:153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L153)

---

### rationale

• **rationale**: `string`

#### Defined in

[src/scheduling/operations.ts:154](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L154)

---

### shiftInstanceId

• **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/operations.ts:144](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L144)

---

### verdicts

• **verdicts**: [`RuleVerdict`](RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/operations.ts#L146)
