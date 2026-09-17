[assignment-user-matcher](../README.md) / [Exports](../modules.md) / RepairCandidate

# Interface: RepairCandidate

## Table of contents

### Properties

- [blockers](RepairCandidate.md#blockers)
- [contractDeltaMinutes](RepairCandidate.md#contractdeltaminutes)
- [distanceKm](RepairCandidate.md#distancekm)
- [eligible](RepairCandidate.md#eligible)
- [employeeId](RepairCandidate.md#employeeid)
- [fairnessDebt](RepairCandidate.md#fairnessdebt)
- [isHomeSite](RepairCandidate.md#ishomesite)
- [marginalCostCents](RepairCandidate.md#marginalcostcents)
- [originSiteId](RepairCandidate.md#originsiteid)
- [rank](RepairCandidate.md#rank)
- [rationale](RepairCandidate.md#rationale)
- [shiftInstanceId](RepairCandidate.md#shiftinstanceid)
- [travelMinutes](RepairCandidate.md#travelminutes)
- [verdicts](RepairCandidate.md#verdicts)

## Properties

### blockers

• **blockers**: [`RuleVerdict`](RuleVerdict.md)[]

Failing rules only, for a compact "why not" list.

#### Defined in

[src/scheduling/operations.ts:205](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L205)

___

### contractDeltaMinutes

• `Optional` **contractDeltaMinutes**: `number`

Where this shift would leave the person against their contracted period
total: `(planned + this shift) − contracted`, negative while still under
contract. Only for employees whose contracted week resolves.

#### Defined in

[src/scheduling/operations.ts:214](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L214)

___

### distanceKm

• `Optional` **distanceKm**: `number`

Straight-line distance from origin to the shift's site, when minutes are unavailable.

#### Defined in

[src/scheduling/operations.ts:223](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L223)

___

### eligible

• **eligible**: `boolean`

#### Defined in

[src/scheduling/operations.ts:202](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L202)

___

### employeeId

• **employeeId**: `string`

#### Defined in

[src/scheduling/operations.ts:200](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L200)

___

### fairnessDebt

• **fairnessDebt**: `number`

How far below their fair share of extra work this person is. Higher means more owed.

#### Defined in

[src/scheduling/operations.ts:208](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L208)

___

### isHomeSite

• **isHomeSite**: `boolean`

Whether the shift is at this employee's home site.

#### Defined in

[src/scheduling/operations.ts:225](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L225)

___

### marginalCostCents

• **marginalCostCents**: `number`

#### Defined in

[src/scheduling/operations.ts:206](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L206)

___

### originSiteId

• `Optional` **originSiteId**: `string`

Site the candidate is travelling from (same-day assignment, then home site).

#### Defined in

[src/scheduling/operations.ts:219](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L219)

___

### rank

• **rank**: `number`

Lower is a better call.

#### Defined in

[src/scheduling/operations.ts:216](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L216)

___

### rationale

• **rationale**: `string`

#### Defined in

[src/scheduling/operations.ts:217](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L217)

___

### shiftInstanceId

• **shiftInstanceId**: `string`

#### Defined in

[src/scheduling/operations.ts:201](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L201)

___

### travelMinutes

• `Optional` **travelMinutes**: `number`

Estimated travel minutes from origin to the shift's site.

#### Defined in

[src/scheduling/operations.ts:221](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L221)

___

### verdicts

• **verdicts**: [`RuleVerdict`](RuleVerdict.md)[]

#### Defined in

[src/scheduling/operations.ts:203](https://github.com/ViljarVoidula/assignment-user-matcher/blob/daf0017f81d9a71d344e7779c2b35c1bc27fb284/src/scheduling/operations.ts#L203)
