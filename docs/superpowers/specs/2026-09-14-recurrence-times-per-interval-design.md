# Recurrence: N occurrences per interval

**Date:** 2026-09-14
**Scope:** assignment-engine (library), platform (API, `@fivexer/sdk`, MCP), sdks (Python, PHP, Java), example/web (console)

## Problem

A recurring assignment today cuts exactly one occurrence per `everyMs`. "Two guide
videos each week" or "six checks a day" can only be expressed by hand-dividing the
interval (`everyMs: 3.5 days`), which is what nobody means when they say "twice a week",
is not what the template reads back as, and has no console UI at all.

## Decisions

- **Field, not a new policy shape.** `RecurrencePolicy.times?: number` — occurrences per
  `everyMs`, positive integer, default `1`. `everyMs` keeps its role as the period. Omitting
  `times` is byte-identical to today's behaviour; no stored template changes meaning.
- **Spread evenly.** Occurrence *k* of a period opens at `startAt + k × (everyMs / times)`.
  Not "all at period start", not caller-listed offsets.
- **Rolling from `startAt`, never calendar.** No timezone, no DST, no "Monday". A week is
  seven days from wherever the template started. The matcher stays pure epoch arithmetic.
- **Any cadence.** Hourly, daily, weekly, arbitrary ms — the unit is the caller's.
- **Derive, don't rewrite.** The engine derives `intervalMs = Math.round(everyMs / times)`
  at normalize time; `dueSlots`, `sweepDueAt`, `materializeOccurrence`, occurrence ids and
  the catch-up arithmetic run unchanged on the derived interval. When `everyMs` is not
  divisible by `times`, slots sit up to `times` ms off the period boundary per period; they
  still align to their own cadence, which is the documented "slots never drift" invariant.
  Exact period anchoring (slot-index arithmetic) was considered and rejected as code for
  sub-second precision nobody observes.

## Engine (`assignment-engine`)

### Types — `src/types/matcher.ts`

```ts
export interface RecurrencePolicy {
    everyMs: number;
    /**
     * Occurrences per `everyMs`, spread evenly: occurrence k of a period opens
     * at `startAt + k × everyMs / times`. `{ everyMs: WEEK, times: 2 }` is
     * "twice a week". The derived gap must still be ≥ 1000 ms.
     * @default 1
     */
    times?: number;
    // …existing fields unchanged
}
```

### Pure logic — `src/schedule/recurrence.ts`

- `NormalizedRecurrencePolicy` gains `times: number` and `periodMs: number` (the caller's
  `everyMs`). Its existing `everyMs` field **becomes the derived interval**
  (`Math.round(periodMs / times)`), so every downstream consumer is untouched.
- `normalizeRecurrencePolicy`: `times = positiveInt(policy.times) ?? 1`; return `null`
  when the derived interval `< MIN_EVERY_MS`. Validation message in
  `addRecurringAssignment` mentions `times` when it was the cause.
- `dueSlots`, `sweepDueAt`, `materializeOccurrence`, `occurrenceId`: **no change**.
  `windowMs` default (windowless slot yields to its successor) is relative to the derived
  interval, which is the correct reading — the successor is the next occurrence, whichever
  period it falls in.
- `maxOccurrences` stays a total across all occurrences; `until` unchanged.

### Facade — `src/matcher.class.ts`

No logic change. `addRecurringAssignment` re-add keeps the clock (`nextAt`/`occurrences`)
as today, so changing `times` on a live template takes effect from the next sweep without
re-aligning — documented, not special-cased.

### Tests — `tests/matcher_recurrence.test.ts`

1. `{ everyMs: 1h, times: 2 }` from `startAt` materializes slots at `+0` and `+30m` with
   distinct ids, and the next period continues at `+1h`.
2. `times: 1` and omitted `times` produce identical slots and stored JSON.
3. `{ everyMs: 2000, times: 3 }` (derived 667 ms) is refused by `addRecurringAssignment`.
4. `catchUp: 'skip'` with `times: 3` after downtime resumes on the next un-stale
   sub-slot, not the next period boundary.
5. `maxOccurrences: 3` with `times: 2` retires after three occurrences, mid-period.

### Docs

`README.md` recurrence table gets a `times` row and a "twice a week" example; typedoc
regenerates. Add a line to the CLAUDE.md recurrence bullet: `times` is derived into the
interval at normalize time and nothing downstream may read the period.

## Platform (`platform/`)

### API — `apps/api/src/routes/tasks.ts`

- `RECURRENCE_SCHEMA.properties.times: { type: 'integer', minimum: 1, maximum: 1000 }`.
- `validateRecurrence`: compute `interval = everyMs / (times ?? 1)`; require
  `interval >= RECURRENCE_MIN_EVERY_MS` (error `invalid_recurrence`,
  "recurrence.everyMs / times is under one minute") and `windowMs < interval` (message
  updated to say "shorter than the gap between occurrences").
- `toPublicRecurring` passes `times` through untouched (it already spreads `recurrence`).
- Tests in `apps/api/test/tasks.test.ts`: accepts `times`, refuses sub-minute derived
  interval, refuses `windowMs >= interval`, lists the template back with `times`.

### SDK — `packages/sdk/src/types.ts`

`RecurrencePolicy.times?: number` with the same doc as the engine. `RecurringTask` unchanged
(carries `recurrence`). Bump per the SDK release convention (unpublished chain).

### MCP — `packages/mcp/src/tools.ts`

Add `times: z.number().int().min(1).max(1000).optional().describe(...)` to the recurrence
schema; `windowMs` description says "shorter than everyMs / times".

## SDKs (`sdks/`)

- Python `python/src/fivexer/models.py` `RecurrencePolicy.times: int | None = None`; PHP
  `php/src/Model/RecurrencePolicy.php` `?int $times`; Java
  `java/src/main/java/io/fivexer/sdk/model/RecurrencePolicy.java` `Integer times`.
  Round-trip tests in each SDK's existing `RecurringTemplatesTest` /
  `test_recurring_templates.py`.
- `scripts/check-field-parity.py` walks `platform/packages/sdk/src/types.ts` and checks the
  three SDK sources against it, so the TypeScript type is the source of truth; the gate must
  pass. `contract/openapi.json` is regenerated from the API schema.

## Console (`example/web`)

### Draft model — `src/ui/platform/components/ScheduleFields.tsx`

```ts
export interface RepeatDraft {
    times: string;        // '' → 1
    every: string;        // amount
    unit: 'hours' | 'days' | 'weeks';
    startAt: string;      // datetime-local, '' → now
    windowHours: string;  // '' → no offer window
    onMiss: 'park' | 'drop';
    until: string;        // datetime-local, '' → open-ended
    maxOccurrences: string; // '' → unbounded
}
export interface ScheduleDraft {
    mode: 'once' | 'repeat';
    notBefore: string; notAfter: string; onMiss: 'park' | 'drop';   // existing
    repeat: RepeatDraft;
}
```

- `draftToSchedule` returns `undefined` when `mode === 'repeat'`; new
  `draftToRecurrence(draft): RecurrencePolicy | undefined` returns `undefined` when
  `mode === 'once'` or `every` is empty. `emptyScheduleDraft.mode = 'once'`.
- `hasSchedule` is true for either mode when something is set, so the row's `source` and
  reset behave as today.
- `recurrenceSummary(draft, locale)`: "2 every week, ~3½ days apart, from Thu 09:00 —
  each offered for 24h, then parked. Stops after 10 or on 12 Dec." Invalid states return a
  plain sentence, mirroring `scheduleSummary`: offer window not shorter than the gap; gap
  under a minute; until before start.

### Editor — `RecurrenceFields.tsx` (new sibling of `ScheduleFields.tsx`)

Rendered inside the **When** row of `RunPlan` under a two-way segmented control
**Once / Repeats**. Fields, in order:

1. **Times** (number, min 1) **every** (number) (select: hours / days / weeks).
2. **First one at** — `datetime-local`, reuses the start presets; empty = now.
3. **Each offered for** — hours; existing park/drop toggle appears only when set.
4. **Stop** — `datetime-local` until **and/or** **after N occurrences** (number). Either,
   both, or neither.

`catchUp` is not surfaced (API default `'skip'` is right for the console).

### Submit — `pages/tasks/NewTaskPage.tsx`

Send `schedule: draftToSchedule(schedule)` and `recurrence: draftToRecurrence(schedule)`
(one is always `undefined`). On `created.status === 'recurring'`: toast
"Repeats — 2 every week. The first opens Thu 09:00." and navigate to
`/tasks?status=scheduled`. `reset()` for "add another" keeps the repeat draft, matching the
existing keep-the-run-plan rule. The `RunPlan` "When" row reset label becomes
"Clear the window" / "Stop repeating" by mode.

### Repeating strip — `pages/TasksPage.tsx` (scheduled segment)

A `RepeatingTemplates` component above `ScheduledAgenda`, query
`data.tasks.recurring.list()` (SDK already has `list`/`remove`). Per template: title or
tags, cadence text from the same summary helper (fed from `RecurrencePolicy`, not the
draft — so a small `recurrenceToDraft` or a policy-level formatter is needed; use the
policy-level formatter and have the draft summary call it), "next opens <shortWhen>",
"N so far", **Stop** button with confirm → `recurring.remove(id)`; occurrences already cut
stay. Empty list renders nothing. Invalidates `['pf','tasks',workspaceId]` on stop.

### i18n

All strings through Lingui; run the `estonian-copy` skill for the ET catalog. Build with
the whole tree on disk (Lingui `--clean` hazard).

### Tests

- Unit: `draftToRecurrence`, `recurrenceSummary`, mode exclusivity, alongside the
  existing `ScheduleFields` tests.
- e2e (`example/e2e`): create a task "2 every day", see the toast, see it in the
  Repeating strip, stop it.

## Out of scope

Calendar-aligned periods and timezones; per-occurrence explicit offsets; `catchUp` in the
console; editing a live template from the console (API re-add already supports it).
