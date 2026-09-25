# Worker schedule preferences — design

Date: 2026-09-25
Status: approved design, not yet planned

## Problem

The engine has always scored soft `preferred` / `avoid` availability windows
(`constraints/availability.ts`, `preferencePenalty`), but nothing lets a worker
state one. The platform emits only hard weekday blackouts (`weekly_pattern`) and
imported calendar busy time (`avoid`, weight 5). Two defects also sit in the
engine's current scoring:

1. **Loudest worker wins.** Penalties are summed, so a person with twenty
   stated wishes pulls twenty times harder than a person with one.
2. **No shift-type preferences.** Rules match clock windows only; "prefer
   nights" cannot be said independently of when nights start.

And nobody is ever told which wishes were met, or why not.

## Research summary

Common patterns in rostering products and literature:

| Pattern | Seen in | Adopted |
|---|---|---|
| Standing weekly likes/dislikes | Planday, Deputy, When I Work | Yes |
| Dated requests with a priority and a per-person cap | Nurse rostering (INRC), HealthRoster | Yes (two tiers, capped) |
| Shift-type preferences | Nurse rostering | Yes (`shiftTypeTags`) |
| Per-person weight budget ("points") | Bidding systems, auction papers | Yes (normalization, no spending UI) |
| Fair satisfaction over time (history carry) | KU Leuven fairness study, residency scheduling | Later — builds on the report |
| Bidding / self-rostering | Airline PBS, hospitals | No — process change |

Sources:
[Accommodating individual preferences in nurse scheduling via auctions and optimization](https://www.researchgate.net/publication/26798147_Accommodating_individual_preferences_in_nurse_scheduling_via_auctions_and_optimization),
[A study on fairness objectives for nurse rostering](https://lirias.kuleuven.be/retrieve/176620),
[Integrating Nurse Preferences Into AI-Based Scheduling Systems](https://pmc.ncbi.nlm.nih.gov/articles/PMC12157959/),
[Planday — schedule based on availability](https://help.planday.com/en/articles/30427-schedule-based-on-availability-preferences).

## Decisions

- Workers set their own preferences; no approval (they are soft). Managers can
  view and edit them for workers who do not use the portal.
- Dated requests have two tiers, `normal` and `important`; `important` weighs
  more and is capped per worker per month. Nothing is hard — a fixed
  commitment is time off, which already exists.
- Approach B: extend `AvailabilityRule` rather than add a parallel
  `Employee.preferences` type, so there is one matching and scoring path.

## Part 1 — Engine (`assignment-engine`, minor release)

### `AvailabilityRule` additions (all optional; existing input byte-compatible)

```ts
/** Match only instances whose `shiftTypeTag` is listed. ANDed with days/dates/clock window. */
shiftTypeTags?: string[];
/** `important` is multiplied by `objectives.preferences.importantWeight`. Soft kinds only. */
priority?: 'normal' | 'important';
/** Caller's identifier, echoed in `result.preferences`. */
id?: string;
/** Excluded from budget normalization (imported facts such as calendar busy time, not wishes). */
outsideBudget?: boolean;
```

`shiftTypeTags` applies to every kind (an `unavailable` rule on `night` is a
valid hard rule), through `availabilityApplies` in `model.ts`, so the hard
verdict, the soft score and the report all read one predicate.

### `objectives.preferences?: { budget?: number; importantWeight?: number }`

- `importantWeight` (no default in the engine beyond `1`, i.e. no effect
  unless set) multiplies the weight of `important` rules.
- `budget`, when set: per employee, the in-budget soft rules (`preferred` /
  `avoid`, `outsideBudget !== true`) that match **at least one** instance in the
  period are scaled so the sum of their effective absolute weights equals
  `budget`. Rules matching no instance cost nothing and are left out of the
  denominator. Without `budget`, weights are used as given (today's behaviour).
- Scaling is done once, at normalization in `model.ts`; `preferenceScore`,
  `preferencePenalty`, `rankCandidates` and the report all read the scaled
  weights. No second weighting path.
- The preferences term stays in the **soft** level; it can never outrank
  coverage or a hard rule.
- `objectives` is already hashed into `provenance.rulesHash`; the new field is
  covered by that.

### `result.preferences: EmployeePreferenceReport[]`

```ts
interface EmployeePreferenceReport {
    employeeId: string;
    rules: PreferenceRuleOutcome[];
}
interface PreferenceRuleOutcome {
    ruleId?: string;
    kind: 'preferred' | 'avoid';
    priority: 'normal' | 'important';
    matchedInstances: number;        // instances in the period the rule matches
    honoured: number;                // matching instances that went the worker's way
    outcome: 'met' | 'missed' | 'partly' | 'not-applicable';
    missed: Array<{ instanceId: string; reason: 'cover' | 'blocked' | 'tradeoff' }>;
}
```

- A **dated** rule (`fromDate` and `toDate` both set):
  - `avoid` is missed if the person is assigned to any instance it touches.
  - `preferred` is missed if the person is assigned to none of its matching
    instances. `missed` then lists the matching instances.
- A **weekly** `avoid` counts `honoured` as the matching instances the person
  was *not* assigned to, and lists each assigned one in `missed`. Its
  `outcome` is `met` when none were assigned, `missed` when every matching
  instance was, and otherwise `partly`.
- A **weekly** `preferred` counts `honoured` as the matching instances the
  person *was* assigned to. Its `outcome` is `met` when that is at least one,
  and otherwise `missed`. `missed` stays empty: listing every preferred
  instance they did not get would be noise, since nobody can work all of them.
- `not-applicable` means the rule matched no instance.
- Every reason asks whether someone could have taken **this person's place**
  on that occurrence, not merely whether someone else was free: the holder is
  vacated for the check, so a shift already at `maxEmployees` never reads as
  cover. Another employee record of the same person (shared `personId`) never
  counts as "someone else" — two contracts are not mutual cover.
- `reason: 'cover'` means nobody else could have taken their place. The
  eligibility is the same as `rankCandidates` uses, via `engine/verdicts.ts`.
- `reason: 'blocked'` (dated `preferred` rules only) means the person
  themselves could not legally have taken the shift they wanted — including
  being blocked by their own other assignments. Otherwise the reason is
  `'tradeoff'`.
- `outsideBudget` rules are reported too, so the platform can mark busy-time
  clashes from the same source.
- The report is assembled once, at final result assembly. It never runs in
  the search loop or in `onProgress` payloads.
- `checkCompliance()` returns `preferences` too (always present, unlike
  `result.preferences`, which is omitted when there is nothing to report).

### Out of scope

Hard preferences, carry-over of unmet wishes between periods, preference
quotas ("at most 2 nights" — already `dutyQuotas`).

### Engine tests

- Budget: one wish vs twenty wishes produce equal total pull; out-of-period
  rules excluded from the denominator; `outsideBudget` excluded.
- `shiftTypeTags` matching for `preferred`, `avoid` and `unavailable`.
- `importantWeight` changes the chosen roster in a contested case.
- Report: dated met/missed, weekly partly, `cover` vs `tradeoff` reason.
- Parity: `rankCandidates` preference contribution equals the objective's.
- No `budget`, no new fields → identical result to current release.

README and typedoc updated for the new fields and option.

## Part 2 — Platform (`platform`, console in `example`)

### Data

New table `worker_preferences` (workspace-scoped):

| column | notes |
|---|---|
| `id` | also the engine rule `id` |
| `workspace_id`, `worker_id` | |
| `kind` | `preferred` / `avoid` |
| `scope` | `weekly` / `dated` |
| `days_of_week` | weekly only, ISO 1–7 |
| `from_time`, `to_time` | optional band |
| `from_date`, `to_date` | dated only |
| `shift_type_tag` | optional |
| `priority` | `normal` / `important`; weekly rows are always `normal` |
| `note` | optional, the worker's own; never sent to the solver |
| `created_by` | worker or manager |

The workspace roster settings gain `preferenceBudget` (default 10),
`importantWeight` (default 4) and `maxImportantPerMonth` (default 2). When a
dated `important` row would exceed the cap for the calendar month of its
`from_date`, the API refuses it with `important_limit_reached`.

Check `git status` on the drizzle folder before `drizzle-kit generate`, which
can renumber uncommitted migrations.

### Input assembly (`packages/shared/src/roster/input-assembly.ts`)

- Weekly rows become `{kind, daysOfWeek, from, to, shiftTypeTags?, id, priority}`.
- Dated rows become `{kind, fromDate, toDate, from?, to?, shiftTypeTags?, id, priority}`.
- Calendar busy rules gain `outsideBudget: true`.
- `objectives.preferences` comes from the workspace settings.
- `weekly_pattern` blackouts stay hard and unchanged.

The solve result's `preferences` is stored with the roster version.

### API

- Console: `GET/PUT /workers/:id/preferences`.
- Portal: `GET/PUT /me/preferences`. A worker reads and edits only their own
  rows.
- Portal: `GET /me/preferences/outcomes`, for the latest published version
  covering each dated request.
- Updates go into OpenAPI, the SDK, both `sdks/` parity gates
  (`operations.yaml` and `check-field-parity.py`) and the MCP tool
  `set_worker_preferences`.

### Worker portal (`portal-templates`, beside `TimeOff.tsx`)

The "My preferences" screen has:

- A week strip: mark 👍 or 👎 on a day or time band, and pick shift types from
  the workspace's templates (by `shiftTypeTag`).
- "Request a date": off or on, ordinary or important, with the remaining-count
  hint "Important: 1 of 2 left in October".
- After publishing, each dated request shows whether it was met. When it was
  not, the reason reads "needed for cover" or "balanced with the team".

The new core file and `/portal` endpoint must be named in `studio-agent.mjs`.
Existing portals need a republish.

### Console

- The worker drawer gets an inline-editable Preferences section. It follows
  the console rule: no modal and no Edit mode.
- On the roster, an assigned shift that goes against a wish gets a marker,
  reusing the busy-time marking.
- The published-roster summary shows a per-worker line such as
  "4/5 wishes met".
- New ET/EN catalog strings follow the Estonian glossary.

### Platform tests

- Assembly unit tests: weekly and dated rows map to the right rules; busy time
  gets `outsideBudget`; the settings map to `objectives.preferences`.
- API tests: the important cap (per month, and the refusal code); a worker
  can reach only their own rows; a manager can edit them.
- E2E: a worker states a dated wish, the roster is solved and published, and
  the portal shows the outcome.

## Later

Balancing satisfaction over time: feed each worker's missed wishes from
`result.preferences` into the next period's budget, so the same person does not
lose every contested wish.
