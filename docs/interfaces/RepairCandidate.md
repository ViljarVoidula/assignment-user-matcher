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

[src/scheduling/operations.ts:168](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L168)

___

### eligible

• **eligible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:165](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L165)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/operations.ts:163](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L163)

___

### fairnessDebt

• **fairnessDebt**: `number`

How far below their fair share of extra work this person is. Higher means more owed.

#### Defined in

[src/scheduling/operations.ts:171](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L171)

___

### marginalCostCents

• **marginalCostCents**: `number`

#### Defined in

[src/scheduling/operations.ts:169](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L169)

___

### rank

• **rank**: `number`

Lower is a better call.

#### Defined in

[src/scheduling/operations.ts:173](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L173)

___

### rationale

• **rationale**: `string`

#### Defined in

[src/scheduling/operations.ts:174](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L174)

___

### shiftInstanceId

• **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/operations.ts:164](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L164)

___

### verdicts

• **verdicts**: [`RuleVerdict`](RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:166](https://github.com/ViljarVoidula/assignment-user-matcher/blob/326255ef7b75a86169d8f4e5d601b412717d2cc8/src/scheduling/operations.ts#L166)
