# Worker Schedule Preferences — Platform, Worker App & Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Workers state schedule preferences in the worker app. Managers see and edit them in the console. The roster solver honours them through engine 1.17.0, and both sides see which wishes were met and why not.

**Architecture:**
- **Storage.** One JSON preference document per worker, in a new `roster_worker_preferences` row.
- **Settings.** Four workspace settings go on the existing `roster_settings` row.
- **One pure module** in `packages/shared` does everything:
  - maps the document to engine `AvailabilityRule`s and `objectives.preferences`;
  - validates the document;
  - counts important wishes per month;
  - turns the engine's `EmployeePreferenceReport` into plain outcome items.
- **One assembly path.** Input assembly (`buildRosterContext` → `assembleScheduleInput`) adds the rules, so solve and lint both see them.
- **One report path.** Lint surfaces the engine report (`checkCompliance().preferences`) the same way it surfaces `contractHours`. Nothing new is persisted on roster versions.
- **The UI follows the approved design canvas** at https://claude.ai/artifact/GrbLaWrFY4DijtxS8bEVw6, in the repos' own components.

**Tech Stack:**
- platform: pnpm monorepo. Fastify API (`apps/api`), Drizzle (`packages/control-plane`), `packages/shared`, `packages/sdk`, `packages/mcp`, and `packages/portal-templates` (the React worker app, Lingui, vitest + jsdom).
- Console: `example/web` (React, Lingui, TanStack Query, vitest in the node environment).
- sdks: Python / Java / PHP.

Spec: `docs/superpowers/specs/2026-09-25-worker-schedule-preferences-design.md` (Part 2). Engine half: branch `feat/worker-preferences`, engine 1.17.0.

## Workspace (all work happens here; never in the original checkouts)

| Repo | Path | Branch |
|---|---|---|
| engine (read-only here) | `/home/viljar/Projects/fivexer-wp/assignment-engine` | detached at `feat/worker-preferences` (717ba2d) |
| console | `/home/viljar/Projects/fivexer-wp/assignment-engine/example` | `feat/worker-preferences` (from `main`) |
| platform | `/home/viljar/Projects/fivexer-wp/platform` | `feat/worker-preferences` (from `main`) |
| sdks | `/home/viljar/Projects/fivexer-wp/sdks` | `feat/worker-preferences` (from `main`) |

Dependencies are installed and built. The platform's `node_modules` holds a hard copy of engine 1.17.0.

- **The console reads the SDK's `dist`.** After any change to `platform/packages/sdk`, run `pnpm --filter @fivexer/sdk build` in the platform worktree before the console can typecheck against it.
- **Node:** run `export PATH="$HOME/.nvm/versions/node/$(ls $HOME/.nvm/versions/node | tail -1)/bin:$PATH"` first.

## Global Constraints

- **Plain words everywhere a person reads.** UI copy uses "wish", "preferences", "good", "rather not" and "important". Never write "budget", "weight", "objective" or "rule" in UI copy. Keep lines short.
- **Every new UI string ships English and Estonian.** Portal: `test/i18n-coverage.test.ts` fails on an empty `msgstr`. Console: the eslint rule `lingui/no-unlocalized-strings` applies.
- **Estonian comes from the `estonian-copy` skill** and the binding glossary (`platform/docs/i18n/glossary.md`): "preference" → *eelistus*, "wish" → *soov*, "shift" → *vahetus*. Use the sina-voice.
- **Console inline-edit rule.** No modals, no Edit mode, one side drawer. Fields edit where they are read, and each control saves on its own. Copy the `TaskInlineFields.tsx` pattern.
- **Wishes are soft.** Nothing in this plan may turn a wish into a hard rule. A worker who must be away uses leave; the existing time-off flow is untouched.
- **Workers only ever read or write their own preferences.** Portal routes take `workerId` from `request.worker`, never from the path or the body.
- **Settings defaults:**
  - `preferencesEnabled: true`
  - `importantWishesPerMonth: 2`
  - `importantWishWeight: 'more'`
  - `preferencesEqualWeight: true`

  Engine mapping:
  - `importantWeight`: bit → 2, more → 4, much → 8.
  - `budget`: 10 when `preferencesEqualWeight`, else unset.
  - `preferencesEnabled: false` means no worker-preference rules are emitted at all. Calendar busy time is unaffected.
- **Calendar busy-time rules gain `outsideBudget: true`.** They are imported facts, not wishes.
- **Rule ids** (echoed back by the engine report):
  - `week:<isoDay>` for day wishes;
  - `type:<shiftTypeTag>` for shift-type wishes;
  - `date:<wishId>` for dated wishes.
- **Commits:** Conventional Commits, and **no `Co-Authored-By` trailer** in any repo. Stage only your own paths (`git add <paths>`); never `git add -A`.
- **Formatting and migrations:**
  - platform `pnpm prettier` reformats ~90 untouched files, so run prettier only on your own files.
  - Check `git status` on the drizzle folder before `drizzle-kit generate`, because it can renumber an uncommitted migration.

## The preference document (the contract every task shares)

Add to `platform/packages/shared/src/roster/preferences.ts`, exported from the shared package index:

```ts
export type WishLevel = 'like' | 'avoid';

export interface DatedWish {
    /** Stable id, generated by the server on first save when absent (newId). */
    id: string;
    /** ISO date. */
    date: string;
    /** 'off' = would like the day off (engine avoid); 'work' = would like to work (engine preferred). */
    want: 'off' | 'work';
    important: boolean;
    /** The worker's own words; never sent to the solver. */
    note?: string;
}

export interface WorkerPreferences {
    /** ISO weekday 1..7 → level. Absent = no wish ("fine"). */
    week: Partial<Record<'1' | '2' | '3' | '4' | '5' | '6' | '7', WishLevel>>;
    /** shiftTypeTag → level. */
    shiftTypes: Record<string, WishLevel>;
    dates: DatedWish[];
}

export interface PreferenceSettings {
    preferencesEnabled: boolean;
    importantWishesPerMonth: number;
    importantWishWeight: 'bit' | 'more' | 'much';
    preferencesEqualWeight: boolean;
}

/** One line a person reads: the engine report, restated. */
export interface WishOutcome {
    ruleId: string;
    /** What the wish was about, for the UI to phrase. */
    subject: { kind: 'day'; isoDay: number } | { kind: 'type'; tag: string } | { kind: 'date'; date: string; want: 'off' | 'work' };
    level: WishLevel;
    important: boolean;
    outcome: 'met' | 'missed' | 'partly' | 'not-applicable';
    matched: number;
    honoured: number;
    missed: Array<{ shiftInstanceId: string; date: string; reason: 'cover' | 'blocked' | 'tradeoff' }>;
}
```

---

### Task 1: Pure preference module (platform `packages/shared`)

**Files:**
- Create: `packages/shared/src/roster/preferences.ts`
- Create: `packages/shared/test/preferences.test.ts` (match the existing test location and style in `packages/shared/test/`, e.g. `personal-busy.test.ts`)
- Modify: `packages/shared/src/index.ts` (export)

**Produces:**
- The types above.
- `emptyPreferences(): WorkerPreferences`
- `normalizePreferences(input: unknown, newId: () => string): WorkerPreferences`
  - Throws `PreferenceError` (`{ code: 'invalid_preferences', message }`) on anything malformed.
  - Weekday keys must be `'1'`..`'7'`; levels `'like' | 'avoid'`.
  - `shiftTypes` keys are non-empty trimmed strings; at most 50.
  - `dates` holds at most 60 entries, and each is a valid ISO `YYYY-MM-DD`. Duplicate dates keep the last one. The array is sorted by date. A missing `id` gets `newId()`. `note` is trimmed and at most 280 chars.
  - `'fine'` / `null` values are dropped, so absent means "no wish".
- `importantByMonth(prefs): Record<string /* YYYY-MM */, number>`
- `assertImportantCap(prefs, cap: number): void` throws `PreferenceError` with code `'important_wish_limit_reached'` and a message naming the month (`"2 important wishes already in 2026-10"`) when any month exceeds `cap`.
- `preferenceRules(prefs): AvailabilityRule[]` (engine type from `assignment-user-matcher/scheduling`). Rule ids and kinds follow the Global Constraints:
  - `like` → `preferred`; `avoid` → `avoid`.
  - A date `off` → `avoid` and `work` → `preferred`, with `fromDate = toDate = date` and `priority: important ? 'important' : 'normal'`.
  - Week rules carry `daysOfWeek: [n]`; type rules carry `shiftTypeTags: [tag]`.
- `preferenceObjective(settings): { budget?: number; importantWeight: number } | undefined`: `undefined` when disabled, otherwise per the Global Constraints.
- `wishOutcomes(report: EmployeePreferenceReport | undefined, prefs, instanceDate: (id: string) => string | undefined): WishOutcome[]`
  - Joins the report back to the document by rule id.
  - Skips report rules whose id is not one of ours (e.g. calendar busy).
  - Carries each missed instance's date.
  - Orders results: dates first (by date), then days (1..7), then types (alphabetical).

- [ ] **Step 1: Write the failing tests.** Cover:
  - normalize accepts a full document and drops `fine` levels;
  - normalize assigns missing ids, rejects a bad weekday key, a bad date or a 61st date, and dedupes by date;
  - `importantByMonth` counts per month;
  - `assertImportantCap` throws the exact code at cap+1 and passes at cap;
  - `preferenceRules` output for one of each kind, as an exact deep-equal;
  - `preferenceObjective` covers all three weights, equal-weight on and off, and disabled → `undefined`;
  - `wishOutcomes` maps a hand-built `EmployeePreferenceReport` (met date, cover-missed Sunday with a date lookup, and a foreign `busy:*` rule that is dropped) and orders the result.
- [ ] **Step 2:** Run it and confirm it fails. From the platform root: `pnpm exec vitest run packages/shared/test/preferences.test.ts`. (Check `packages/shared/package.json` for its test runner. If it differs, use the package's own command.)
- [ ] **Step 3:** Implement the module.
- [ ] **Step 4:** Run the test and confirm it passes. Then run `pnpm --filter @fivexer/platform-shared build`, or the package's build script.
- [ ] **Step 5:** Commit: `feat(roster): worker preference document, validation and engine rule mapping`.

---

### Task 2: Storage and settings (platform `packages/control-plane`)

**Files:**
- Modify: `packages/control-plane/src/schema/roster.ts`
  - Add the `rosterWorkerPreferences` table, modelled on `rosterWorkerTerms` (composite PK `[workspaceId, workerId]`, `workspaceId` FK with cascade, free-text `workerId`). Columns: `prefs jsonb not null`, `updatedAt` defaultNow, `updatedBy text` (`'worker:<id>'` or the console user id).
  - Add four columns to `rosterSettings`:
    - `preferencesEnabled boolean not null default true`
    - `importantWishesPerMonth integer not null default 2`
    - `importantWishWeight text not null default 'more'`
    - `preferencesEqualWeight boolean not null default true`
- Create: the migration, via `pnpm --filter <control-plane package name> db:generate`, to get the next number in `packages/control-plane/drizzle/` plus its meta snapshot. Name it descriptively if drizzle allows. Check `git status packages/control-plane/drizzle` first.
- Modify: `packages/control-plane/src/roster-foundation.ts`
  - `getWorkerPreferences(workspaceId, workerId): Promise<{ prefs: WorkerPreferences; updatedAt: string | null; updatedBy: string | null }>` returns `emptyPreferences()` when there is no row.
  - `saveWorkerPreferences(workspaceId, workerId, prefs, actor): Promise<same>` upserts.
  - `listWorkerPreferences(workspaceId, workerIds?: string[]): Promise<Map<string, WorkerPreferences>>`
  - `getSettings`/`saveSettings` carry the four new fields.
- Test: the control-plane test folder, next to the existing roster store tests (find them with `grep -rl "saveSettings\|rosterWorkerTerms" packages/control-plane/test apps/api/test`). The test runs a save → get round trip, the empty default, the list filtered by ids, and the settings defaults plus a partial update.

- [ ] **Step 1:** Write the failing store test (it needs the test DB the package already uses, via its existing helpers).
- [ ] **Step 2:** Run it and confirm it fails.
- [ ] **Step 3:** Change the schema, generate the migration, and add the store methods.
- [ ] **Step 4:** Run the test and confirm it passes. Build the package.
- [ ] **Step 5:** Commit: `feat(roster): store worker preferences and preference settings` (schema, migration + snapshot + journal, store, test).

---

### Task 3: Console API, input assembly and lint report (platform `apps/api` + `packages/shared`)

**Files:**
- Modify `apps/api/src/routes/roster.ts`:
  - **`GET /roster/terms/:workerId/preferences`:** returns `{ preferences, updatedAt, updatedBy }`. Place it beside the existing `/roster/terms/:workerId` routes and use the same workspace scoping and docs helper.
  - **`PUT /roster/terms/:workerId/preferences`:**
    - The body is a `WorkerPreferences`, normalised with `normalizePreferences`.
    - Enforce the cap with `assertImportantCap(prefs, settings.importantWishesPerMonth)`.
    - Map a `PreferenceError` to `badRequest(code, message)`.
    - Save with actor `request.sessionUser?.id ?? 'api'`.
    - Return the same shape as the GET.
  - **`GET/PUT /roster/settings`:** add the four fields to the body schema, validation, save patch and `publicSettings`. `importantWishesPerMonth` must be an integer from 0 to 10. `importantWishWeight` must be one of `bit|more|much`.
- Modify `packages/shared/src/roster/context.ts`:
  - `RosterDataSource` gains an optional `listWorkerPreferences(workspaceId, workerIds)`.
  - `buildRosterContext` loads it when present. It passes `workerPreferences` and `preferenceSettings` into `RosterAssemblyInput`, reading the settings through the existing `getSettings`.
  - `LintResult` gains `preferences: EmployeePreferenceReport[]`, filled from `checkCompliance(...).preferences` wherever `contractHours` is filled today.
- Modify `packages/shared/src/roster/types.ts` + `input-assembly.ts`:
  - `RosterAssemblyInput` gains `workerPreferences?: Map<string, WorkerPreferences> | Record<string, WorkerPreferences>` and `preferenceSettings?: PreferenceSettings`.
  - In `assembleScheduleInput`:
    - When the settings are enabled, append `preferenceRules(prefs)` to each worker's `availability`.
    - Set `scheduleInput.objectives = { ...scheduleInput.objectives, preferences }` when `preferenceObjective` returns one.
    - Add `outsideBudget: true` to every rule `busyToAvailabilityRules` emits.
  - Update `packages/shared/test/personal-busy.test.ts` expectations for `outsideBudget`.
- Make sure the store behind `RosterDataSource` (the control-plane store used by the API and by `apps/worker/src/roster-solver.ts`) implements `listWorkerPreferences`, so the background solver gets the rules too.
- Test: `apps/api/test/roster-preferences.test.ts` (new; follow `roster-portal.test.ts` setup), plus assembly unit tests in `packages/shared/test/`. They cover:
  - the GET default and a PUT round trip;
  - PUT with 3 important wishes in one month under cap 2 → 400 `important_wish_limit_reached`;
  - PUT with a bad weekday → 400 `invalid_preferences`;
  - the settings GET defaults and PUT validation;
  - assembly: enabled → rules with the right ids plus the objective; disabled → no preference rules but busy time kept; busy time carries `outsideBudget`;
  - **the seam test:** a real lint call (`POST /rosters/:id/lint` or whatever route calls `lintRoster`) on a roster with one worker who has a dated `off` wish on an assigned day returns `preferences` with that worker's `date:<id>` outcome `missed`. Without this test the rules may never reach the engine.

- [ ] **Step 1:** Write the failing tests: the API route tests and the assembly unit tests.
- [ ] **Step 2:** Run them and confirm they fail: `cd apps/api && pnpm exec vitest run test/roster-preferences.test.ts`, then the shared tests.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run them and confirm they pass. Then run the whole `apps/api` suite and the `packages/shared` suite. Known pre-existing failures are allowed: BYO Redis ×2, the learning-feedback bulk test, and a 200 ms portal-versions timeout flake. Report anything else.
- [ ] **Step 5:** Commit: `feat(roster): console preference routes, settings, and preferences in solve and lint`.

---

### Task 4: Worker-portal API (platform `apps/api`)

**Files:**
- Modify `apps/api/src/routes/worker-portal.ts`, scoped to `request.worker`, next to the time-off routes:
  - **`GET /preferences`** returns:
    ```ts
    {
      enabled: boolean,
      preferences: WorkerPreferences,
      shiftTypes: Array<{ tag: string; label: string }>,  // distinct non-null shiftTypeTag of the workspace's shift templates; label = template name of the first template with that tag, else the tag
      importantPerMonth: number,
      importantUsed: Record<string, number>               // importantByMonth(preferences)
    }
    ```
  - **`PUT /preferences`:** the body is `WorkerPreferences`.
    - Return `featureUnavailable('preferences_disabled', …)` when the workspace has preferences turned off.
    - Otherwise normalise, enforce the cap, save with actor `worker:<workerId>`, and return the same shape as the GET.
  - **`GET /preferences/outcome`** returns `{ period: { startDate, endDate } | null, outcomes: WishOutcome[] }` for the worker's most recent **published** roster whose period ends on or after today. If there is none, it returns the latest published one. If there is none at all, `{ period: null, outcomes: [] }`.
    - Find how `GET /portal/roster` (worker-portal.ts ~2290) locates the worker's published roster and reuse that lookup.
    - Run the shared lint/compliance path on the published assignments (`buildRosterContext` + `lintRoster`).
    - Take this worker's `EmployeePreferenceReport` and map it through `wishOutcomes`. The date lookup comes from the context's shift instances.
    - If the lint path is too heavy to call per request, stop and report instead of caching.
- Test: `apps/api/test/roster-portal-preferences.test.ts`, following `roster-portal.test.ts` (worker PIN login). It covers:
  - GET defaults and the `shiftTypes` list from templates;
  - PUT round trip;
  - a worker cannot touch another worker's preferences (a `workerId` in the body is ignored);
  - the cap refusal;
  - disabled → 501 `preferences_disabled`;
  - **outcome end to end:** create a roster with one worker and a shift on date D, set the worker's dated `off` wish on D via the portal, solve or set assignments so the worker holds D (with nobody else eligible), publish, then call `GET /portal/preferences/outcome`. It must return that wish as `missed` with reason `cover`. Use the same roster-creation helpers other roster API tests use.

- [ ] **Step 1:** Write the failing tests.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the file and the api suite, and confirm they pass.
- [ ] **Step 5:** Commit: `feat(portal): workers set their own schedule preferences and see how they went`.

---

### Task 5: SDK types and methods, plus the MCP tool (platform `packages/sdk`, `packages/mcp`)

**Files:**
- `packages/sdk/src/types.ts`:
  - `WorkerPreferences`, `DatedWish`, `WishLevel`, `WishOutcome`, `WorkerPreferencesResult` (`{ preferences, updatedAt, updatedBy }`) and `PortalPreferences`;
  - the four fields on the roster settings type;
  - `preferences` on the roster lint result type, using an SDK-local `EmployeePreferenceReport` mirror with the engine field names.

  These types are hand-written in the SDK the way the others are; do not import from `shared`.
- The workspace roster client (find where `rosters.candidates` / `roster.settings` / `roster.terms` live) gains `roster.workerPreferences(workerId)` and `roster.setWorkerPreferences(workerId, prefs)`.
- If the SDK has a worker/portal plane client (check `packages/sdk/src` for `/portal/` calls), add `preferences()`, `setPreferences()` and `preferencesOutcome()` there. If it has none, skip this.
- `packages/mcp/src/tools.ts`: add the tools `get_worker_preferences` and `set_worker_preferences`, modelled on `set_worker_terms` / `list_worker_terms`, with annotations in `tool-annotations.ts`. The descriptions are plain words. Update the tool-name lists in `packages/mcp/test/server.test.ts` and add one call test.
- `packages/sdk` tests: add a request-shape test beside the existing roster client tests.

- [ ] **Step 1:** Write the failing SDK and MCP tests.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3:** Implement. Then run `pnpm --filter @fivexer/sdk build` and build mcp.
- [ ] **Step 4:** Run the tests and confirm they pass.
- [ ] **Step 5:** Commit: `feat(sdk): worker preference methods and types; mcp get/set_worker_preferences`.

---

### Task 6: Worker app screens (platform `packages/portal-templates`)

Design (artboards "Worker · My preferences", "Worker · Ask for a date", "Worker · How your wishes went").

**Files:**
- Create `src/core/Preferences.tsx`, a Me section reached from the Me hub like `TimeOff`. It contains:
  1. **Outcome card.** It appears only when `GET /portal/preferences/outcome` returns a period and at least one outcome.
     - The headline is "Most of your wishes came true" (≥ half met) or "Some of your wishes couldn't happen" (otherwise).
     - One row per outcome: an icon (met ✓ green `--ok`, partly – amber `--warn`, missed ✕ grey).
     - Row copy:
       - date off → "Off on Friday 16 October";
       - date work → "Work on Saturday 24 October";
       - day like/avoid → "Mondays" / "Sundays off";
       - type like/avoid → "Nights" / "No nights".
     - Plain reason sentences for missed and partly outcomes:
       - `cover`: "We needed you on 11 October: nobody else could cover it."
       - `blocked`: "Not this time. You'd have had too little rest or too many hours."
       - `tradeoff`: "Given to a teammate to keep hours fair."
       - `partly`: "3 of 4 Sundays off." (`honoured` of `matched`), plus the first missed reason.
  2. **"My usual week".** Seven day tiles, Monday first. A tap cycles fine → good → rather not → fine and saves at once with a PUT of the whole document. The UI updates optimistically and rolls back with an inline error if the save fails. Each tile carries an `aria-label` like "Monday: good. Tap to change."
  3. **"Kinds of shift".** One chip per `shiftTypes` entry, with the same cycle. Hide the section when `shiftTypes` is empty.
  4. **"Specific dates".** A list with day, date, "I'd like to be off" / "I'd like to work", an "Important" marker, and a remove button. The header shows "Important: N of M left in <Month>" for the current month. An "Ask for a date" button opens the sheet.
  5. **Footer.** "Saved. Your manager sees these when planning." shown after a successful save.
- Create `src/core/AskForDate.tsx`, the bottom sheet (reuse `.portal-modal`; add sheet styling in `portal.css` if needed). It contains:
  - a month calendar grid with prev/next month buttons; days that already hold a wish show a dot;
  - a two-option `radiogroup` ("I'd like to be off" / "I'd like to work"), using the `.portal-chip` / `.portal-chip-on` pattern from `CalendarConnection.tsx`;
  - a `role="switch"` "This one really matters" with the hint "N of M important wishes left in <Month>", disabled when none are left;
  - a primary "Save wish" button;
  - the footnote "A wish is not time off. If you must be away, ask for leave.", where "ask for leave" opens the Time off section.

  An `important_wish_limit_reached` response shows inline under the switch.
- Modify `src/core/Me.tsx`: add a `MeSectionId` `'preferences'`, an `ORDER` entry (group `'work'`, just before `'timeoff'`), a hub row "My preferences" (with a subline summarising the count, e.g. "3 wishes"), gating on `enabled` from the GET (hidden when `preferences_disabled` or 404/501), and the page switch.
- Modify `src/core/api.ts`: `myPreferences()` (returns `null` on 404/501, like `myTimeOff`), `setMyPreferences(prefs)` and `myPreferencesOutcome()`, with types matching Task 4.
- Modify `portal.css` only for new classes. The `test/portal-system.test.ts` invariants apply: every `portal-*` class used must be declared, radii use tokens only, rem not px where that test requires it, and every control has a visible focus ring. Touch targets are ≥ 44 px.
- Modify `packages/ui-builder/agent/studio-agent.mjs`: add bullets for `Preferences.tsx` and `AskForDate.tsx` in the `src/core` list, and the three endpoints in the `/portal` list, with **no backticks**. `packages/ui-builder/test/studio-agent-prompt.test.ts` must pass.
- i18n: run `pnpm run i18n:extract` and fill in every new `msgstr` in `src/locales/et/messages.po` using the `estonian-copy` skill. Then run `pnpm run i18n:compile`.
- Tests: `test/preferences.test.ts` (jsdom, rendering like `portal-alignment.test.ts` with stubbed `fetch`). They check:
  - the page renders the week tiles from a GET;
  - tapping a tile sends a PUT with the cycled level;
  - a failed PUT rolls back and shows an error;
  - the sheet saves a dated wish, and the cap error appears inline;
  - the outcome card renders a cover reason;
  - the section is hidden when disabled.

  Also add `Preferences` / `AskForDate` to the vocabulary checks in `portal-alignment.test.ts` if that file lists screens.

- [ ] **Step 1:** Write the failing tests.
- [ ] **Step 2:** Run them and confirm they fail: `pnpm exec vitest run packages/portal-templates/test/preferences.test.ts` from the platform root.
- [ ] **Step 3:** Implement, then run extract, the Estonian translation and compile.
- [ ] **Step 4:** Run `pnpm exec vitest run packages/portal-templates packages/ui-builder/test/studio-agent-prompt.test.ts` and confirm it passes, then typecheck/build the portal package.
- [ ] **Step 5:** Commit: `feat(portal): My preferences screen, ask-for-a-date sheet and wish outcomes`.

---

### Task 7: Console — preferences in the worker drawer, and the settings block (console `example/web`)

Design (artboards "Console · Worker drawer" and "Console · Preference settings").

**Files:**
- Create `src/ui/platform/pages/workers/preferences.ts`, pure and tested:
  - `cycleLevel(level | undefined): WishLevel | undefined`, which cycles fine → like → avoid → fine;
  - `withDay(prefs, isoDay)`, `withType(prefs, tag)` and `withoutDate(prefs, id)` return new documents;
  - `summaryLine(outcomes)` gives `{ met: number; total: number }` for "Last roster: 5 of 6 wishes met".
- Create `src/ui/platform/pages/workers/preferences.test.ts`.
- Create `src/ui/platform/pages/workers/WorkerPreferences.tsx`, a section in `WorkerDrawer`, placed **outside** the batch-saved `<form>` because it saves on its own. It contains:
  - the heading "Preferences" and "Set by Anna, 2 days ago" (from `updatedBy`/`updatedAt`: "Set by <name>" when `updatedBy` starts with `worker:`, "Set by you" or "Set by a manager" otherwise);
  - the "Usual week": seven buttons with the same colours and cycle as the worker app, and a legend "Good · Rather not · Click to change";
  - "Kinds of shift": chips for tags that have a wish, plus "+ Add" offering the workspace's shift-type tags. Find where the console lists shift templates and reuse that query;
  - "Dates": a compact list with an "Important" marker and remove, plus a small inline add (date input + off/work + important), with no modal.

  Each change is a `useMutation` → `setWorkerPreferences` with an optimistic update, invalidating `['pf','worker-preferences',…]` and the roster lint query. Copy the `TaskInlineFields.tsx` pattern. A 400 `important_wish_limit_reached` shows inline.
- Modify `WorkerDrawer.tsx` to mount the section.
- Settings: add a "Worker preferences" block beside or inside the roster rules settings (see `RulesPanel.tsx` for load/save and query invalidation). It holds:
  - a `SwitchRow` "Let workers share preferences";
  - a small stepper "Important wishes per month". This is a new `Stepper` in `components/FormPage.tsx` next to `Segmented`/`SwitchRow`: − and + buttons with `aria-label`s, a value 0–10 with `aria-live`;
  - a `Segmented` "How much an important wish counts", with options "A bit more" / "More" / "Much more";
  - a `SwitchRow` "Treat everyone the same", with the hint "Someone with twenty wishes doesn't get more say than someone with one."

  Each control saves on change through `data.roster.setSettings`.
- Styles: `platform.css`, with the `.pf-` prefix and theme tokens only (`--ok-ink`, `--warn-ink`, `--danger-ink`, `color-mix` tints as used at platform.css ~16696). The design's berry is the console's `--accent`; do not add raw hexes.
- i18n: all copy goes through Lingui macros. Update both `src/locales/en/messages.po` and `src/locales/et/messages.po` (translate with the `estonian-copy` skill). **`pnpm build` runs `lingui extract --clean`, which deletes catalog entries for any source file missing from disk.** Never build with part of the tree stashed.

- [ ] **Step 1:** Write the failing `preferences.test.ts`.
- [ ] **Step 2:** Run it and confirm it fails: `npx vitest run src/ui/platform/pages/workers/preferences.test.ts` from `example/web`.
- [ ] **Step 3:** Implement the module, the section, the stepper, the settings block, the styles and the catalogs.
- [ ] **Step 4:** Run the test and confirm it passes. Then run `npx tsc -b` (or the package's typecheck), `npx eslint src/ui/platform`, and the full `npx vitest run`.
- [ ] **Step 5:** Commit: `feat(console): worker preferences in the drawer and preference settings`.

---

### Task 8: Console — wishes on the roster (console `example/web`)

Design (artboard "Console · Roster with missed wishes").

**Files:**
- Modify `src/ui/platform/pages/roster/grid.ts` and `grid.test.ts`:
  - Add `wishesByCell(reports: EmployeePreferenceReport[]): Map<string /* employeeId|shiftInstanceId */, { ruleId: string; kind: 'preferred'|'avoid'; reason: 'cover'|'blocked'|'tradeoff'; important: boolean }>`.
  - Only **avoid** misses land on a cell, because those are assignments the person holds. Preferred misses have no cell of theirs.
  - Add `wishSummary(reports)`, which gives `{ met, total, missedCover, missedFair, missedBlocked, importantMissed }`. `total` excludes `not-applicable` rules. `partly` counts as not met.
- Modify `WeekGrid.tsx` (and `MonthGrid` if it renders the same cells):
  - When a cell has a wish miss and the "Show missed wishes" toggle is on, render an accent-coloured outline plus the existing dot pattern: add `pf-roster-dot-wish` and `pf-roster-chip-wish` classes.
  - The cell's `aria-label` gains ", against <name>'s wish".
  - In the per-cell menu (WeekGrid ~411), when the cell has a wish miss, show a non-interactive explanation at the top: the bold line "Against a wish" and the sentence "<Name> would rather not work <Sundays | on 11 October | nights>". Then the reason:
    - `cover`: "Needed for cover: nobody else could take this shift."
    - `tradeoff`: "Chosen to keep hours fair."
    - `blocked` does not occur for avoid rules.

    The existing "Find someone else" item stays as the action, and a "Keep" item closes the menu.
  - The sentence needs the worker's wish subject. Pass the preference documents (from lint `preferences` report rule ids plus the worker preferences query), or phrase from the rule id alone: `week:7` → "Sundays", `type:night` → "night shifts", `date:<id>` → the date via the document. Keep this phrasing pure in `grid.ts` and test it.
- Modify `RosterPage.tsx`:
  - Read `preferences` from the lint result the page already fetches.
  - Render a summary bar above the grid: "Wishes met: 42 of 47", a progress bar, and the line "3 missed for cover, 2 to keep hours fair." (show only non-zero parts; add "Important wishes: all met." when `importantMissed` is 0 and important wishes exist).
  - Add a "Show missed wishes" pressed-toggle (`aria-pressed`), on by default. Remember it per viewer in `localStorage` wrapped in try/catch, like other roster view toggles if any exist.
  - Hide the bar entirely when the report is empty.
- Styles in `platform.css` using `--accent` and the existing roster tokens.
- i18n: same rule as Task 7.

- [ ] **Step 1:** Write the failing `grid.test.ts` cases for `wishesByCell`, `wishSummary` and the phrasing.
- [ ] **Step 2:** Run them and confirm they fail.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Run the tests and confirm they pass. Then run the typecheck, eslint, and the full vitest.
- [ ] **Step 5:** Commit: `feat(console): show missed wishes on the roster with the reason`.

---

### Task 9: SDK parity (sdks repo)

**Files (in `/home/viljar/Projects/fivexer-wp/sdks`):**
- `contract/operations.yaml`: add the new operations in their planes:
  - workspace: `GET/PUT /roster/terms/{workerId}/preferences`;
  - worker portal: `GET/PUT /portal/preferences` and `GET /portal/preferences/outcome`.

  Follow the neighbouring roster entries, including their comments about which roster endpoints the hand-written SDKs cover. If roster endpoints are deliberately classified as not yet in the SDKs, classify these the same way rather than implementing them.
- Make `scripts/check-field-parity.py` pass against the platform worktree's `packages/sdk/src/types.ts`. Point the script at `/home/viljar/Projects/fivexer-wp/platform`; read the script for how it locates the platform, and pass an env var or argument if it has one. Either add the fields and types to the Python, Java and PHP models, or classify them if the script has an allow-list for roster types. Follow precedent.
- Do NOT run `scripts/sync-contract.py` on a dirty tree: it rewrites `contract/openapi.json`.

- [ ] **Step 1:** Run both gates against the platform worktree and record the failures they report for the new names.
- [ ] **Step 2:** Implement or classify per precedent.
- [ ] **Step 3:** Run both gates and the per-language test suites the repo's CI runs (PHP tests need docker from the sdks root; if docker is unavailable, say so).
- [ ] **Step 4:** Commit: `feat: worker schedule preferences in the contract and SDKs`.

---

## Out of this plan
- The Playwright e2e in `example/e2e`. The API-level end-to-end test in Task 4 covers the solve → publish → outcome seam.
- Carrying unmet wishes into the next period.
- Push notifications when a roster's wish outcome is ready.
