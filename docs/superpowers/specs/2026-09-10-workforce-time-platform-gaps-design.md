# From roster tool to workforce-time source: the gap plan

**Status:** design (2026-09-10), not yet approved. Written from a code audit of `assignment-engine`,
`platform` and the console, not from the marketing copy.
**Owner:** viljar@fivexer.com
**Goal:** make 5xer a credible *work/time management and payroll-input* platform whose distinguishing
feature is shift planning automation nobody else matches — for multi-site frontline teams in several
European countries.

---

## 0. What is actually there (checked, not assumed)

The three gaps you named are real, but two of them are half-built, and the audit turned up a
different picture of where the product stands than the marketing plans imply.

| Area | State today | Evidence |
|---|---|---|
| Vacations / time off | **Request → decide → roster spine exists.** Worker asks from the phone, supervisor or console decides with a staffing-impact preview, console approval rewrites overlapping roster versions, only approved leave reaches the solver. **No entitlement, balance, accrual, leave year, carry-over, half-days, absence calendar, or pay for leave.** `kind` (vacation/sick/personal) is a label nothing reads. | `platform/packages/control-plane/src/schema/roster.ts:519-548`, `apps/api/src/routes/roster.ts:2812-2985`, `portal-templates/src/core/TimeOff.tsx`, console `roster/TimeOffInbox.tsx` |
| Legal rule packs | **Four packs (EE, SE, UK, EU floor)**, each with statute citations, reviewed 2026-08-30. Applied by copying the pack's numbers into `roster_settings.rules_json`; which pack was chosen is *guessed back from the figures* (`RulesPanel.tsx:114-134`), never stored. One pack per workspace. No CBA/agreement layer. | `platform/packages/shared/src/roster/rule-packs.ts` |
| Multi-site, multi-country | **Sites carry name, address, coordinates and travel matrix only.** No country, no timezone, no holiday calendar, no rules. One `rules_json`, one `holiday_country`, one `time_zone` per workspace. An EE+SE workspace silently checks one country's staff against the other country's law and reports "compliant". | `schema/roster.ts:105-153`, `packages/shared/src/roster/context.ts:159-168, 281-320` |
| Engine per-person law | **Already built and tested, never wired.** `Employee.rules` (per-person `WorkingTimeRules` override, family-level), `Employee.protections` (minor, hazardous night, pregnancy night exclusion), `personId` (multi-contract aggregation) all exist in the engine; the platform's `assembleScheduleInput` never sets any of them. | `assignment-engine/src/scheduling/types.ts:33-62,138-147`, `constraints/employee-scope.ts`, `platform/packages/shared/src/roster/input-assembly.ts:50-72` |
| Time tracking & payroll | **About three quarters of a payroll source for one country.** Working-time record (CJEU C-55/18 cited in the schema), corrections with before-images, period close/reopen, planned-vs-actual reconciliation against the *published* rota, priced payroll period, payroll CSV, one live write connector (Merit Palk). Missing: leave pay, worker attestation, retention on the time records themselves, allowances, lateness, second vendor. | `platform/packages/control-plane/src/control-plane-payroll.ts`, `apps/api/src/routes/payroll.ts`, `packages/connectors/src/merit-palk.ts` |

Two things the audit found that are worse than "missing feature":

- **The supervisor approve path skips `dropShiftsForLeave`.** Only the console route (`roster.ts:2905`) frees the person's shifts; a crew lead's approval in the portal leaves them rostered inside their own leave. `supervisor.ts:425-465` has no call to it.
- **`tagRequirements`/`tagMaximums` ignore dated qualifications.** `employeeTags` is built from `employee.tags` alone (`model.ts:550`), so a certificate that expired mid-period still satisfies `{ nurse: 2 }` while `requiredTags` correctly rejects it. Solve and compliance agree with each other, but both are wrong.

Both are bugs and go first, before any new feature.

---

## 1. The gap register

Ranked by what blocks the positioning, not by size. **S/M/L** = rough build size.

### Tier 1 — blocks "payroll source" outright

| # | Gap | Why it matters | Size |
|---|---|---|---|
| 1 | **Leave is unpaid.** A week of approved annual leave exports as a short month; no `PayComponentKind` for leave, nothing in `buildPayrollLines` or the CSV. | Any customer with paid leave (all of them in the EU) cannot use the payroll handoff. | M |
| 2 | **No entitlement / balance / accrual ledger.** Nobody can see days remaining before asking or approving; nothing is deducted; nothing carries over. | "Vacation management" is this, not the request form. | M |
| 3 | **Engine ledgers vanish.** `timeOffInLieu` and `lateCancellationPay` entries the solver computes are never persisted (`grep` across platform returns nothing). | The engine already prices debts the platform then forgets. | S once #2 exists |
| 4 | **Multi-country is silently wrong.** One rules set, one holiday country, one timezone per workspace. | Multi-site is the wedge; multi-site across a border today produces a wrong "compliant". | M (platform) + S–M (engine) |
| 5 | **Worker never attests the timesheet.** `/me/time-entries` is read-only; a period can close and go to payroll without the person confirming. | First thing an inspector or dispute asks for. Cheap: corrections table already exists. | S |
| 6 | **Time records have no retention or immutability.** Six-year retention and append-only trigger protect `audit_events`; `worker_shifts`/`worker_breaks`/`worker_time_corrections` cascade-delete with the workspace or identity. | The EU obligation sits on the wrong table. | S |

### Tier 2 — blocks "fully fledged" and the country expansion

| # | Gap | Size |
|---|---|---|
| 7 | Only four rule packs; pack choice not persisted, so packs cannot be versioned or re-reviewed with customers notified. | M (infra) + S per pack |
| 8 | No collective-agreement (CBA) layer and no per-person derogation UI (minor, UK reg 5 opt-out, hazardous night, pregnancy), although the engine supports all of them. | M |
| 9 | Recurring availability (`Employee.availability`, "never Fridays", part-time day pattern) has no storage and is never fed to the solver. Leave charging also needs a working pattern. | S–M |
| 10 | Vendor breadth: Merit's integer `Typecode` is baked into `payroll-lines.ts`; no generic mapped-CSV export profile, no second vendor. | M |
| 11 | Allowances: stand-by fraction priced by the engine but absent from `WorkspacePay`; no call-out, per-diem, mileage. | S–M |
| 12 | Lateness is invisible: planned/actual match is by overlap only, no `startVarianceMinutes`. | S |
| 13 | Working-time auto-close caps are deployment env, not per-workspace (`working-time-guard.ts:30` says so). | S |

### Tier 3 — what "unbeatable planning" still needs in the engine

| # | Gap | Size |
|---|---|---|
| 14 | Rotating patterns / cyclic rosters (4-on-4-off, forward-rotating teams). Shifts are template × dates only. | L |
| 15 | Multi-week fairness *sequencing*: "every second weekend off", "no two consecutive weekends worked". Fairness equalises counts, not arrangement. | M |
| 16 | Skill-mix ratios ("≥60% RNs") and level-graded requirements: `holds(..., minLevel)` exists but nothing passes `minLevel`. | S–M |
| 17 | Per-site timezone. One `PeriodClock` per solve (`model.ts:70`). | M |
| 18 | Mid-period contract start / FTE change; `contractedPeriodMinutes` pro-rates the whole period. Annualised-hours opening balance as a scalar instead of replaying a year of history. | S–M |
| 19 | Worker-to-worker shift swap and a claimable open-shift pool. Cover exists (manager/absence-initiated) but no give/take. | M |
| 20 | `Employee.seniority` is declared and never read. Implement as a rank tiebreak or remove. | S |

Non-gaps worth saying out loud: minors, pregnancy/night health, hazardous night, multi-contract persons, split shifts, stand-by duty classification, notice periods, Sunday/holiday rest are all *already expressible* in the engine. The work is wiring and UI, not rules.

---

## 2. What we deliberately do not build

- **Net pay, tax, social contributions, payslips, payment execution.** 5xer is the hours-and-gross-inputs source; payroll software stays the calculator. This is already the marketing boundary (`features-overhaul.plan.md` § D) and it is right.
- **Country legal numbers inside the MIT library.** Packs stay in `platform/packages/shared` (strict core, helpful shell). The library gains *shapes* only.
- **A rule DSL.** New leave and agreement concepts are typed config, same as everything else.
- **Leave-law presets** (statutory minimum days per country) as *defaults*. They can ship as pack fields with citations, applied on the same explicit opt-in as working-time packs.

---

## 3. Design

### 3.1 Leave: entitlement, balance, pay (gaps 1, 2, 3, 9)

**Model.** Three new control-plane tables, all workspace-scoped.

```
leave_types
  id, workspace_id, code ('annual' | 'sick' | 'toil' | 'unpaid' | custom), name,
  paid boolean, deducts_from_balance boolean,
  absence_kind text          -- what the engine sees: 'sick' neutralises the 48h average
                             --   (WorkingTimeLimits.neutraliseAbsenceKinds); 'leave' does not
  pay_component_key text     -- 'leave:annual' etc., mapped on the payroll screen like any component
  requires_approval boolean, active boolean

leave_policies            -- one per worker terms row, optional
  worker_id, leave_type_id,
  entitlement_minutes_per_year, leave_year_start ('01-01' or hire date),
  accrual ('upfront' | 'monthly' | 'per-hour-worked'), pro_rata_by_fte boolean,
  carry_over_max_minutes, carry_over_expires_after_months

leave_ledger              -- append-only, minutes, signed
  id, workspace_id, worker_id, leave_type_id, occurred_on, minutes,
  reason ('accrual' | 'consume' | 'restore' | 'adjust' | 'carry' | 'expire' | 'engine-ledger'),
  source_id (time_off_request id, roster version id, or null), actor, note
```

Balance is `SUM(minutes)` per worker × type; never a stored column. Minutes, not days, because
half-days and part-time patterns then need no special case: a day of leave costs the worker's
*pattern* minutes for that date.

**Charging.** On approve, for each date in the range: skip if public holiday for the worker's
jurisdiction (§3.3), skip if the working pattern (§3.1 below) has no minutes, otherwise consume the
pattern minutes (or `day_portion` × pattern for a half-day, a new optional column on
`time_off_requests`). On cancel or deny-after-approve, write `restore`. Accrual is a worker job
(`apps/worker`) at month start and at leave-year rollover writing `carry`/`expire`.

**Working pattern.** New `roster_worker_terms.weekly_pattern` JSON: per weekday minutes (and optional
clock window). Fed to the engine as `Employee.availability` (`kind: 'unavailable'` on zero-minute
days) — the field the engine already has and the platform never populated. Default when absent:
`weekly_minutes / 5` Monday–Friday, stated in the UI as an assumption.

**One approval service.** Extract `approveTimeOff()` into `packages/shared` (or the control-plane
store) doing: pending guard → ledger consume → `dropShiftsForLeave` → events. Both the console route
and `supervisor.ts` call it. This is the bug fix; the ledger just rides along.

**Pay.** Add `PayComponentKind = ... | 'leave'` with per-type keys (`leave:annual`). `buildPlannedHours`
gains leave rows from approved requests intersecting the period (minutes from the ledger consume
entries, not recomputed). CSV gains a `leave` row per request per person; `PayTypeMap` maps each leave
type to a vendor code; unmapped paid leave is a blocking reason like any other unmapped component.
Sick pay is where the country rule bites (employer days, waiting days): ship it as *hours of sick
leave* and let payroll price it; a `sick_pay` pack field with citation can come with the packs in §3.2.

**Engine ledgers.** After a publish, persist every `LedgerEntry` on the published version into
`leave_ledger` with `reason: 'engine-ledger'`, `timeOffInLieu` → the `toil` type, `lateCancellationPay`
→ a pay component (`allowance:late-cancel`). Re-publishing the same version is idempotent on
`(source_id = version id, worker, type)`.

**Surfaces.**
- Portal `TimeOff.tsx`: balance per type above the form, cost of the selected range before submit,
  half-day toggle.
- Console `TimeOffInbox.tsx`: balance and post-decision balance on each row next to the impact preview.
- Console: a **team absence calendar** (month grid, who is off, pending in hatched) — the one view
  every WFM buyer expects and we do not have. `HolidayCalendarPanel` and `MonthGrid` already draw the
  grid; reuse.
- SDK: `timeOff.balances(workerId)`, `leaveTypes.*`, `leavePolicies.*`; expose the worker-portal
  time-off endpoints on `worker-client.ts` (missing today).

### 3.2 Legal packs: versioned, persisted, more countries, agreements (gaps 7, 8)

**Persist the choice.** `roster_settings.rule_pack_id` + `rule_pack_version`. Applying a pack still
copies the numbers (the roster must never depend on a pack that later changes underneath it), but now
the console can say "EE pack v3 applied; v4 reviewed 2027-01-15 changes X, Y — review and re-apply",
instead of guessing from figures.

**Pack shape grows** (all optional, all cited): `leave` (statutory annual minimum, sick pay employer
window, waiting days), `protections` defaults for minors (which `Employee.rules` family values a
minor gets), `nightWorkerHealthCheck`, and `sources[]` with `reviewedOn` per rule, not per pack.

**Authoring discipline.** A pack is a PR with: statute citations per rule, `reviewedOn`, caveats,
and a *drift test* pinning the marketing copy (`example/web/src/ui/tools/rota/packs.ts`) to it, as
exists today. Add a review checklist file next to `rule-packs.ts`. No pack ships without a named
human reviewer in the pack metadata.

**Which countries.** Assumption (your call): the go-to-market is Baltic + Nordic first. Order:
**LV, LT, FI, NO, DK**, then **DE, PL, NL**. Germany and Poland are the two with the most specific
shapes (BetrVG co-determination hash already exists; PL *doba pracownicza* already exists as
`minimumStartInterval`), so the engine cost is low; the legal review cost is what gates them.

**Agreements (CBA) layer.** New table `working_agreements` (workspace, name, source/citation,
`rules_json` partial, `applies_to`: site ids and/or worker ids). Resolution order per worker at
assembly time: pack → workspace overrides → site jurisdiction (§3.3) → agreement → per-person
derogations; each layer is a family-level override exactly like `mergeRules`, so no new engine
semantics. The Swedish pack's own caveat ("a kollektivavtal usually replaces the Act") finally has a
place to live.

**Per-person derogations UI.** `roster_worker_terms` gains `protections_json` (engine
`EmployeeProtection[]`), `date_of_birth` (optional; only used to *suggest* the minor protection,
never to apply it silently), `rules_override_json`. The assembler emits `Employee.rules` and
`Employee.protections`. The UK reg 5 opt-out becomes "clear the rolling average on this person",
which the pack caveat already asks for.

### 3.3 Sites as jurisdictions; multi-country rosters (gaps 4, 17)

**Platform.** `roster_sites` gains `country`, `region`, `time_zone`, `holiday_country`/`holiday_region`
(default from country), `rule_pack_id` (optional; falls back to workspace). A worker's *employment
jurisdiction* defaults to their home site's and can be overridden on terms — employment law follows
the contract, premiums and holidays follow the site where the shift happens. This distinction is the
whole design; posted workers are the exception and are handled by the override.

**Assembly.** For each employee: rules = resolved chain from §3.2 keyed by the employee's
jurisdiction. For holidays: the engine's single `calendar.publicHolidays` becomes per-site.

**Engine change (small).** `Site` gains `publicHolidays?: string[]` and `timeZone?: string`.
`expandTemplate` marks `isPublicHoliday` from the instance's site calendar when the site has one,
falling back to `calendar.publicHolidays`. Everything downstream already reads `instance.isPublicHoliday`
(rest-days, fairness `holidays`, cost `holiday` premium), so nothing else changes. Test: two sites,
two calendars, one solve.

**Engine change (medium, later).** Per-site clock. Instances are already in period-epoch minutes,
which are absolute, so rest gaps and overlaps are correct across zones today. What is zone-relative is
night-band attribution, break windows and day boundaries — computed at expansion. Give `expandTemplate`
the site's `PeriodClock` when `site.timeZone` is set. Until then: **validate** that all sites in one
roster share the workspace zone and refuse otherwise, so the failure is loud.

**Console.** Site editor gains country/region/timezone; the roster grid shows a jurisdiction chip
per site band; the rules panel shows "this roster applies N rule sets" with a per-site breakdown;
`checkCompliance` violations already carry citations, so the lint just needs the site name.

### 3.4 Payroll-source hardening (gaps 5, 6, 10, 11, 12, 13)

- **Attestation.** `worker_time_attestations` (worker, period closure id or date range, attested_at,
  disputed_at, note). Portal timesheet gains "Confirm my hours" per period; a dispute opens a
  correction request the operator resolves through the existing correction path. Period close shows
  attested/disputed/silent counts; closing with disputes needs `force`. Not a gate by default: silence
  must not block payroll.
- **Retention.** Time records get the same treatment as audit events: an append-only trigger on
  `worker_time_corrections`, a soft-delete on `worker_shifts`/`worker_breaks` instead of cascade
  (identity removal anonymises the worker reference, keeps the record), and a `TIME_RECORD_RETENTION_DAYS`
  sweep defaulting to the audit value. Erasure requests keep the hours, drop the name — that is what the
  working-time obligation and GDPR both allow.
- **Lateness.** `PlannedMatch` gains `startVarianceMinutes`/`endVarianceMinutes`; a per-workspace
  grace (`late_after_minutes`) turns them into a `late` flag on the payroll row and a count in the period
  report. No pay effect unless a pay rule says so.
- **Allowances.** `WorkspacePay` gains `standbyRateFraction` (already priced by the engine) and a
  list of flat `allowances` (call-out, per-diem, mileage) attached to shift tags; each is a pay
  component. Nothing computed from GPS or expenses.
- **Vendor generalisation.** Replace Merit's integer `Typecode` assumption with a `PayTypeMap` whose
  values are opaque strings per vendor; add a **mapped CSV profile** (column names and order per
  vendor) as the second "vendor", since every payroll product imports a CSV. A second real connector
  (assumption: a Nordic or Baltic vendor matching the pack order) reuses the `destination` stream shape.
- **Per-workspace working-time caps.** Move `WORKING_TIME_*` into `roster_settings` with the env as
  fallback.

### 3.5 Engine: the "unbeatable planning" backlog (gaps 14–16, 18–20)

In the order they earn their keep:

1. **Dated-qualification bug** — count `tagRequirements`/`tagMaximums` through `holds(tag, date)`
   like `requiredTags`. One helper, one test. Ships with the bug fixes.
2. **Level-graded requirements** — `tagRequirements: { nurse: { min: 2, level: 3 } }` and
   `tagRatios: { rn: 0.6 }` as a new shape in `ShiftTemplate`; `min-staffing` and
   `group-composition` read levels through `holds(..., minLevel)` which already exists.
3. **Weekend sequencing** — `ConsecutiveRule.maxConsecutiveWeekends` and
   `FairnessRule.dimension: 'weekend-pattern'` (alternation target). Needs history at the boundary,
   which the input already carries.
4. **Contract start / mid-period FTE** — `contract.startDate`, `contract.changes[]`;
   `contractedPeriodMinutes` pro-rates by days in force. Plus `contract.openingBalanceMinutes` for
   annualised hours so callers stop replaying a year of history.
5. **Rotation patterns** — `RotationPattern { cycleDays, sequence: (shiftTemplateId | 'off')[], teams }`
   expanded into pinned assignments the solver repairs around; a pattern is an *input generator*, not a
   constraint, so `checkCompliance` stays unchanged.
6. **Seniority** — a `rankCandidates` tiebreak and an optional fairness pro-rata; or delete the field.
   Decide in the same PR as swaps (§3.6), where seniority-ordered offers matter.

### 3.6 Worker self-service: swaps and open shifts (gap 19)

Reuse the cover machinery: an **open-shift pool** is a cover opening with no absent worker, created by
the planner ("post to team") or automatically for shifts still short after solve; eligible workers see
them under "Needs you" and claim, which runs the same repair + republish as a cover accept. A **swap**
is two openings linked by a swap id, accepted atomically (both repairs must pass compliance or neither
applies). Manager approval is a workspace setting. This is the feature that makes the portal a daily
habit rather than a notification sink.

---

## 4. Sequencing

Each phase is a separate spec → plan → implement cycle. Sizes are relative.

| Phase | Contents | Why this order |
|---|---|---|
| **0. Bugs** (S) | Supervisor approve frees shifts; dated qualifications in tag counts; refuse mixed-zone rosters. | Correctness before features. All three are one-PR fixes. |
| **1. Leave ledger + leave pay** (M) | §3.1 whole. | Unblocks payroll for everyone; the most-asked-for gap; touches no engine rule. |
| **2. Sites as jurisdictions** (M) | §3.3 platform + per-site holidays in engine; wire `Employee.rules`/`protections`/`personId` from terms. | Makes multi-site honest; the engine side is small and already tested. |
| **3. Packs v2 + agreements** (M + S per country) | §3.2: persisted pack id, versioning, CBA table, derogation UI, first three new packs. | Depends on phase 2 for where a pack attaches. Legal review runs in parallel from day one. |
| **4. Payroll hardening** (M) | §3.4: attestation, retention, lateness, allowances, CSV profile, per-workspace caps. | Independent of 2–3; can run in parallel with them. |
| **5. Planning depth** (M–L) | §3.5 items 2–5. | The differentiator; each item ships alone behind typed input. |
| **6. Self-service** (M) | §3.6 swaps and open shifts, seniority decision. | Needs phase 1 balances (a swap into leave is refused) and phase 2 eligibility. |

Phases 1 and 4 are pure platform and can start immediately. Phase 5 is pure engine and can start
immediately. The only true dependency chain is 2 → 3 → 6.

---

## 5. Assumptions to confirm

1. Go-to-market country order is Baltic + Nordic, then DE/PL/NL.
2. Leave is tracked in minutes with a working pattern, not in days (days are the display unit).
3. Sick pay ships as hours of sick leave, not as a priced employer-window calculation, in phase 1.
4. Employment law follows the worker's jurisdiction (home site by default), premiums and holidays
   follow the shift's site.
5. Worker attestation is informational by default, blocking only on dispute.
6. The second payroll target is a mapped CSV profile before a second live connector.
