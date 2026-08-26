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

[src/scheduling/operations.ts:148](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L148)

___

### eligible

• **eligible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:145](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L145)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/operations.ts:143](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L143)

___

### fairnessDebt

• **fairnessDebt**: `number`

How far below their fair share of extra work this person is. Higher means more owed.

#### Defined in

[src/scheduling/operations.ts:151](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L151)

___

### marginalCostCents

• **marginalCostCents**: `number`

#### Defined in

[src/scheduling/operations.ts:149](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L149)

___

### rank

• **rank**: `number`

Lower is a better call.

#### Defined in

[src/scheduling/operations.ts:153](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L153)

___

### rationale

• **rationale**: `string`

#### Defined in

[src/scheduling/operations.ts:154](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L154)

___

### shiftInstanceId

• **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/operations.ts:144](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L144)

___

### verdicts

• **verdicts**: [`RuleVerdict`](RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:146](https://github.com/ViljarVoidula/assignment-user-matcher/blob/dfb81fd890bda21204ff43403124613346477f3e/src/scheduling/operations.ts#L146)
