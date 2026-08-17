[assignment-user-matcher](../README.md) / [Exports](../modules.md) / Employee

# Interface: Employee

A single employee that can be rostered. Durations are minutes unless the
field name says otherwise — the `*HoursForPeriod` bounds are in hours, every
`*Minutes` field is in minutes.

## Table of contents

### Properties

- [availability](Employee.md#availability)
- [carriedFairness](Employee.md#carriedfairness)
- [contract](Employee.md#contract)
- [cost](Employee.md#cost)
- [externalCommitments](Employee.md#externalcommitments)
- [id](Employee.md#id)
- [maxHoursForPeriod](Employee.md#maxhoursforperiod)
- [maxShiftDurationMinutes](Employee.md#maxshiftdurationminutes)
- [minHoursForPeriod](Employee.md#minhoursforperiod)
- [overtimeConsent](Employee.md#overtimeconsent)
- [personId](Employee.md#personid)
- [protections](Employee.md#protections)
- [qualifications](Employee.md#qualifications)
- [rules](Employee.md#rules)
- [seniority](Employee.md#seniority)
- [tags](Employee.md#tags)
- [timeOff](Employee.md#timeoff)

## Properties

### availability

• `Optional` **availability**: [`AvailabilityRule`](AvailabilityRule.md)[]

Recurring availability, preferences and hard blackouts.

#### Defined in

[src/scheduling/types.ts:43](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L43)

---

### carriedFairness

• `Optional` **carriedFairness**: `Record`\<`string`, `number`\>

Realised counts carried in from previous periods, keyed by fairness dimension.

#### Defined in

[src/scheduling/types.ts:71](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L71)

---

### contract

• `Optional` **contract**: `EmployeeContract`

Contract shape; `kind: 'days'` models day-count contracts such as the French _forfait jours_.

#### Defined in

[src/scheduling/types.ts:51](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L51)

---

### cost

• `Optional` **cost**: `EmployeeCost`

Cost inputs for the ranking and cost objective.

#### Defined in

[src/scheduling/types.ts:61](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L61)

---

### externalCommitments

• `Optional` **externalCommitments**: \{ `from`: `string` ; `to`: `string` }[]

Commitments outside this employer that the roster may never override —
a second job, studies, agreed carer time. Directive (EU) 2019/1152 Art 9
forbids treating parallel employment as a schedulable gap.

#### Defined in

[src/scheduling/types.ts:49](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L49)

---

### id

• **id**: `string`

#### Defined in

[src/scheduling/types.ts:19](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L19)

---

### maxHoursForPeriod

• `Optional` **maxHoursForPeriod**: `number`

Hard upper bound of worked **hours** over the whole period.

#### Defined in

[src/scheduling/types.ts:24](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L24)

---

### maxShiftDurationMinutes

• `Optional` **maxShiftDurationMinutes**: `number`

Hard upper bound of a single shift's duration for this employee.

#### Defined in

[src/scheduling/types.ts:28](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L28)

---

### minHoursForPeriod

• `Optional` **minHoursForPeriod**: `number`

Soft lower bound of worked **hours** over the whole period (warn, don't block).

#### Defined in

[src/scheduling/types.ts:26](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L26)

---

### overtimeConsent

• `Optional` **overtimeConsent**: `boolean`

Whether this person has agreed to work overtime, where
`OvertimeRule.requiresConsent` makes that agreement a precondition.
Consent is a fact the caller records, never something the engine assumes.

#### Defined in

[src/scheduling/types.ts:67](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L67)

---

### personId

• `Optional` **personId**: `string`

The natural person behind this record. Defaults to `id`.

Set it when one human holds several contracts or roles: CJEU C-585/19
holds that daily rest applies to all contracts with the same employer
_taken as a whole_. Rest, rolling hour windows and sequence rules
aggregate on this key, so leaving it unset for a double-contracted worker
understates their hours and overstates their rest.

#### Defined in

[src/scheduling/types.ts:39](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L39)

---

### protections

• `Optional` **protections**: `EmployeeProtection`[]

Statutory protections that select a stricter rule path for this person.

#### Defined in

[src/scheduling/types.ts:59](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L59)

---

### qualifications

• `Optional` **qualifications**: `Qualification`[]

Qualifications with optional validity dates. Absent dates mean "always valid".

#### Defined in

[src/scheduling/types.ts:41](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L41)

---

### rules

• `Optional` **rules**: [`WorkingTimeRules`](WorkingTimeRules.md)

Per-person overrides of the global rule set. This is how age classes,
opt-outs, hazardous-night status and autonomous-worker derogations are
expressed — the rules themselves stay generic.

#### Defined in

[src/scheduling/types.ts:57](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L57)

---

### seniority

• `Optional` **seniority**: `number`

Higher wins where a collective agreement orders offers by seniority.

#### Defined in

[src/scheduling/types.ts:69](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L69)

---

### tags

• **tags**: `string`[]

#### Defined in

[src/scheduling/types.ts:20](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L20)

---

### timeOff

• **timeOff**: [`TimeOffEntry`](TimeOffEntry.md)[]

ISO dates (YYYY-MM-DD) or explicit shift instances the employee must not work.

#### Defined in

[src/scheduling/types.ts:22](https://github.com/ViljarVoidula/assignment-user-matcher/blob/b3eb9426bfa369db6ad83bfd4f2d3bc0d5c86582/src/scheduling/types.ts#L22)
