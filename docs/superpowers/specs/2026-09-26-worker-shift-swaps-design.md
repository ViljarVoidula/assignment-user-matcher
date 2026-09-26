# Worker shift swaps: site-aware takers and two-way trades

Date: 2026-09-26 · Repos: assignment-engine (library), platform (API + portal template)

## Problem

The worker portal already has a hand-over flow (`HandOver.tsx`: give away or swap → engine-checked
colleague list → accept → atomic `applyShiftSwap`, optional operator approval, expiry sweep,
withdraw). Four gaps:

1. **Swap mode is broken.** "Take instead" lists the proposer's *own* shifts and sends one as
   `forShiftInstanceId`; the propose route requires the *colleague* to hold it, so every trade is
   refused with `invalid_swap`. Only give-aways work.
2. **Site data is dropped.** `candidatesFor` returns `rank`, `isHomeSite`, `originSiteId`,
   `travelMinutes`, `distanceKm`; `/portal/roster/shifts/:id/takers` forwards only
   `workerId/label/eligible/reason`, so the phone shows a flat, unordered list.
3. **Trades are checked one way.** Nobody asks whether the proposer may take the colleague's shift
   until the colleague accepts and the lint refuses.
4. **Siblings stay open.** Asking three people and one accepting leaves two proposals open until
   the expiry sweep.

## Scope

In: the four gaps. Out: a swap board / open marketplace, push notification to the person asked
(today only a console event fires), console UI changes.

## Engine: `rankSwapPartners` (assignment-engine, `src/scheduling/operations.ts`)

```ts
rankSwapPartners(
    input: ScheduleInput,
    shiftInstanceId: string,       // the shift being handed over
    fromEmployeeId: string,        // who holds it
    roster: ScheduledAssignment[],
    options?: { trades?: boolean; tradesFrom?: string /* ISO date, inclusive */ },
): SwapPartner[]

interface SwapPartner {
    employeeId: string;
    eligible: boolean;            // may take the shift as a give-away
    blockers: RuleVerdict[];      // failing hard verdicts for the give-away
    rank: number;
    isHomeSite: boolean;
    originSiteId?: string;
    travelMinutes?: number;
    distanceKm?: number;
    trades?: SwapTrade[];         // present only when options.trades
}
interface SwapTrade { shiftInstanceId: string }
```

- **Built once.** One `buildModel` + one state per call; pairs are evaluated by assign/unassign on
  that state. Never a model rebuild per pair (200 pairs on a phone refresh is the reason this is in
  the engine rather than a platform loop over `explainCandidate`).
- **The proposer is vacated.** Give-away eligibility is judged with `fromEmployeeId` removed from
  `shiftInstanceId`, so a full shift does not read as "no room" for every colleague. The existing
  takers route does not vacate; a failing test for that comes first.
- **Trades are two-way, both people vacated.** For colleague C and each shift T C holds (dated
  `>= tradesFrom`, not an instance the proposer already holds): state = roster − proposer@S − C@T;
  the trade is listed only if C passes on S **and** the proposer passes on T. Same hard verdicts as
  `rankCandidates`/`explainCandidate` — no second judgement path.
- **Aggregate rules are not judged here** (tag counts/ratios across a shift, period aggregates).
  They run once in the platform's accept-time `lintRoster`, which stays the final gate. The doc
  comment says so.
- Ordering and site fields are `rankCandidates`' own (profiling-free; seniority tiebreak only).
- Exported from the root; README scheduling section + typedoc updated; minor version bump.

## Platform

**Shared** (`packages/shared/src/roster/context.ts`): `swapPartnersFor(context, shiftInstanceId,
workerId, { trades })` wrapping the engine call with the same verdict mapping `candidatesFor` uses.

**`GET /portal/roster/shifts/:id/takers[?mode=swap]`** — ownership check unchanged. Each taker adds:

| field | meaning |
|---|---|
| `rank` | engine order |
| `siteGroup` | `'same'` when `isHomeSite` or `originSiteId` equals the shift's site, else `'other'`; `null` when the shift has no site (no grouping) |
| `siteName` | name of `originSiteId`, from the site registry; `null` if unknown |
| `travelMinutes` | engine value; `null` when unresolved (phone shows no number) |
| `trades` | `mode=swap` only: `{ shiftInstanceId, date, name, startTime, endTime, siteName }[]`, from the same published roster, `tradesFrom` = today |

Response order: eligible first; within that `same` then `other`; `other` by `travelMinutes`
(null last), then `rank`. Never sent: hours, contract debt, cost. A colleague's shift is disclosed
only when it is a legal trade.

**`POST /portal/roster/swaps`** with `forShiftInstanceId`: after the existing ownership checks, run
the two-way check for that single pair; failure → 409 `not_eligible` with the first blocker
message. Give-aways keep the existing behaviour plus the same give-away eligibility check.

**Closing siblings.** `applyShiftSwap`'s `swap` argument gains `id`. After `appendVersion`, a new
store method `closeSwapsTouching(workspaceId, rosterId, movedPairs, exceptId)` moves every other
`proposed`/`awaiting_approval` swap whose from-pair or to-pair is a moved (worker, shift) pair to
`expired` with `decision_note = 'shift moved'` (same guarded-update shape as `decideShiftSwap`; no
migration — `expired` + note follows offboarding's `withdrawn` + `worker left`). Both callers — the
portal accept route and the console approve route (`routes/roster.ts:3547`) — get it for free. A
`roster.swap_decided` console event fires per closed row.

**Portal** (`HandOver.tsx`, `api.ts`, `SwapInbox.tsx`):

- Give mode: two headed groups, **At {site}** then **Other sites** with "25 min away" per row (or
  no suffix when null); ungrouped list when `siteGroup` is null. Blocked stay in the `<details>`
  fold. Multi-select unchanged.
- Swap mode: fetch with `mode=swap`. Single-select colleague; each row shows "N shifts to swap".
  Colleagues with zero trades move to the blocked fold with "No shift of theirs you could take".
  Picking a colleague reveals **their** trade shifts as the "Take instead" picklist. Button: "Ask
  {name}". Fixes gap 1.
- `ShiftTaker` gains the new optional fields (older API → flat list, as today).
- SwapInbox: an `expired` swap with note `shift moved` reads "Someone else took it" / "That shift
  moved" instead of a bare "expired".
- New strings go through Lingui; ET via the `estonian-copy` glossary.

## Error handling

- `trades` empty for everyone → swap mode shows the existing "nobody can" hint, worded for trades.
- Takers computed against a stale roster is fine: propose re-checks, accept re-lints; both already
  return 409s the portal renders as "that moved", not as an error.
- Deployments without rostering keep the 404/501 → null contract.

## Tests

- Engine (`tests/scheduling/`): proposer vacated (full shift, colleague eligible); two-way trade
  listed only when both directions pass (rest breach on either side excludes it); `tradesFrom`
  filter; parity — a listed trade's verdicts match `explainCandidate` on the vacated roster; one
  model build per call.
- Platform API (`apps/api/test/roster-self-service.test.ts`): takers site fields + ordering +
  `mode=swap` trades; propose trade refused 409 when proposer cannot take theirs; accept closes
  siblings (both give-away fan-out and a trade touching the recipient's shift); operator approve
  path closes siblings; the full-shift regression.
- Portal (`packages/portal-templates/test/`): swap mode offers the colleague's shifts, never the
  proposer's; grouping render; fallback on the old response shape.
- Gates: SDK field parity / operations.yaml if the worker-plane routes are covered; studio-agent
  prompt gate if a new core file is added (none planned).

## Rollout

Engine build → `pnpm install --force` in platform (the `file:` dep is a hard copy) → control-plane
build. Portal template change needs each workspace to republish its portal.
