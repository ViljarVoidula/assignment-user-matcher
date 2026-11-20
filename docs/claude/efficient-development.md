# Efficient Claude development

Project default: Opus 5.5 (`claude-opus-5-5`) with medium effort for planning,
implementation, debugging, test design, and validation, with one implementer.
Validation quality comes from executable checks, observable behavior, and fresh
test evidence scoped to the change. Keep effort at medium; use focused native
commands by default. Full validation profiles are exceptional, and hooks never
require them to complete routine work.
Keep Opus active when leaving plan mode. Delegate only for a
concrete independent review or isolated task. The command hook allows at most
two new agent calls per user prompt and denies new background agents. Continue
in the main session when the budget is exhausted. Resuming an existing agent is
allowed. Launch reservations are locked so simultaneous tool calls share the
budget. Attempts allowed by this hook count even if a later permission check
rejects them. Changing the hook's `guard` limit requires editing the script.

Superpowers remains enabled. Project instructions take precedence over its
per-task implementer/reviewer workflow. Keep its useful debugging, verification,
and design guidance; implement cohesive tasks directly. For significant changes,
request one independent review of the completed diff, with existing test evidence.

Use Opus 5.5 for planning, writing code, and all validation, including test design,
failure diagnosis, and independent code/spec/architecture reviews. Use the
local `project-reviewer` agent for one cohesive independent review: it declares
`model: opus` (pinned to Opus 5.5) and medium effort. Reserve one agent call for required review; report
it as pending if the budget prevents it. Avoid plugin review fan-out.

Use Haiku for simple read-only extraction and Sonnet for bounded read-only
exploration. Neither should implement changes, design tests, diagnose failures,
or judge correctness unless the user explicitly requests the cheaper model.
No global subagent model override is configured; project settings pin the `opus`
alias to `claude-opus-5-5`. Specify Opus explicitly on delegated implementation
and validation tasks and verify actual models in the usage report. The bundled
code-review plugin is disabled here because its command launches multiple Sonnet
reviewers; use one `project-reviewer` on the cohesive diff instead.

## Start a feature

```text
Implement [feature] as one working end-to-end slice.
Start from [file / existing example].
Acceptance criteria: [observable behavior].
Read applicable DESIGN.md, PRODUCT.md, domain guidance, and validation docs first;
name the consulted paths and use their constraints as acceptance criteria.
Reuse existing patterns and dependencies.
Keep the plan brief using Opus 5.5, then implement and validate in the main
session using Opus 5.5 with medium effort. Use Opus 5.5 for any independent review.
Delegate only when independent review or isolation materially helps.
Run focused checks for affected behavior while iterating and at completion.
Use full suites only for an explicit user request, release gate, or concrete
cross-cutting risk that focused checks cannot cover; explain why and limit scope.
Save full logs to disk; report failures and summaries.
Stop when the criteria pass; list optional improvements separately.
```

For site/UI tasks, use `example/CLAUDE.md`, `example/docs/claude/INDEX.md` and
the relevant domain references, plus `example/web/PRODUCT.md` and
`example/web/DESIGN.md`. Copy/media/validation tasks also use their applicable
I18N, media, and test-plan documents. Pass the original document paths and
constraints explicitly to planners/reviewers; preserve them across compaction.
Read only relevant sections to keep context focused.

Run `pnpm test:focused tests/example.test.ts [--grep pattern]` during iteration.
This bypasses `.mocharc.json`'s global spec. Keep Redis isolation rules. Completion
does not automatically require the full suite. Use existing examples as scaffolds
for recurring work.

Checkpoint decisions, changed files, acceptance criteria, and validation before
compacting around 100k context. Avoid exceeding 150k. Start a fresh session for
unrelated work. Do not run background loops unless explicitly requested. An
eight-hour session span is a signal to investigate, not proof of continuous work.

## Scope-first validation

Run the smallest meaningful checks for the touched files and affected behavior.
Choose relevant test files/cases and lint changed files. Add a type check, build,
integration test, or browser spec only when the change needs that evidence.
Documentation/copy/styling changes need proportionate checks, not automatic full
web lint, tests, production build, and onboarding/console sweeps.
An entire browser project or package suite is a broad check even when launched
directly with pnpm; do not bypass this policy by avoiding the validation runner.

Examples from the engine root (substitute the files/cases relevant to the task):

```bash
pnpm test:focused tests/matcher_workflows.test.ts --grep 'affected behavior'
pnpm --dir example/web exec vitest run src/lib/format.test.ts
pnpm --dir example/web exec vitest related src/lib/format.ts --run
pnpm --dir example/server exec node --import tsx --test tests/csp.test.ts
pnpm --dir example/e2e exec playwright test tests/console/roster-solve.spec.ts --project=console --workers=1
pnpm --dir example/e2e exec playwright test tests/onboarding/voice-setup.spec.ts --project=onboarding --workers=1
python3 -m unittest discover -s scripts/claude/tests -p test_claude_validation.py -v
```

Use `pnpm exec eslint <changed-files>` in the relevant package for file-scoped
lint. In `platform`, use `pnpm exec vitest run <affected-test-files>` rather than
`pnpm test`, which rebuilds every package and runs the entire coverage gate.
Keep assertions, coverage thresholds, Redis isolation, and browser worker limits.
Focused checks do not claim full-suite coverage. Check that selected tests really
ran; a zero-match filter or a skipped check is not validation.

Run only the browser specs that cover the affected flow. Console changes do not
automatically need onboarding; signup/setup changes use relevant onboarding specs.
Use an existing dev server for focused UI behavior when appropriate. Production
CSP, prerendering, bundles, and server routing need a built server; Playwright's
`scripts/serve.sh` prepares it when no `E2E_BASE_URL` is supplied. Do not run the
entire web lint/test/build profile as a browser prerequisite. Avoid fixed sleeps
between runs; check service readiness, or address an actual rate limit for the
affected test. Maintain feature-specific acceptance criteria and visual review
from `example/e2e/TEST-PLAN.md`, PRODUCT.md, and DESIGN.md.

Batch related edits before checking. After a pass, rerun only checks affected by
later edits or unresolved failures. Read a failure's log and fix or isolate its
cause before retrying; do not repeatedly rerun broad suites hoping for green.
Save full logs and real exit codes, and report the checks performed and any actual
blockers. A missing full-profile receipt is not a blocker for focused development.

### Exceptional full runs

Full validation is reserved for an explicit user request, an actual release/CI
gate, or concrete cross-cutting risk that focused checks cannot cover, such as a
major dependency/toolchain change with uncertain impact. A routine feature, a
high-risk label alone, completing a task, or a stale receipt does not justify a
full run. Explain the reason and select only the necessary profiles. Run once
after the cohesive change is ready; broaden or repeat only for new evidence.
The release pipeline retains its existing tests and coverage gates.

`scripts/claude/claude-validation.py` is the shared full-profile runner for these
five checkouts. `scripts/claude/validation-profiles.json` defines its commands.
Bare `run` and `run --profile NAME` are rejected before executing checks. Full runs
must explicitly provide `--full`, a nonempty `--reason`, and `--profile NAME`:

```bash
python3 scripts/claude/claude-validation.py status --profile web
# Only after identifying an exceptional need; do not copy this into routine work:
python3 scripts/claude/claude-validation.py run --full --reason 'Release requires web validation' --profile web
```

Use the script's absolute path from sibling checkouts. `status --profile NAME`
inspects only selected areas; bare `status` lists all available profiles without
running checks. Only explicitly selected
profiles run; there is no automatic expansion to all changed profiles or to web
validation from a browser profile. Matching passing source/command receipts are
reused. Use `--force` with a concrete reason only when fresh execution is needed,
for example after a runtime environment change. Full logs and real exit codes are
saved under `.claude/validation/runs/`, and receipts under
`.claude/validation/receipts/`; the reason is recorded in the receipt. Changes to
inputs or commands, missing logs, zero-test runs, explicit skips, and failed reruns
cannot count as matching passing evidence. Checks are serialized by a shared lock.
The AI checkout's profile contains static checks only; changed runtime behavior
needs separate evidence.

### Advisory hooks

SessionStart saves a source baseline across resume/compaction; PreToolUse
initializes it if needed. PostToolUse and PostToolUseFailure advise on newly
changed areas, not mandatory full profiles. They do not repeat reminders for
every edit in the same area. Stop never blocks completion on full-suite receipts
and does not scan all checkouts. Missing/corrupt hook state does not force a full
run. Report actual focused results and blockers honestly; no special
`Validation blocked:` phrase is required to end a turn.

The existing usage reports, bounded agent guard, and Impeccable hooks remain
active. New hook registration applies on the next Claude session. Hook event
schemas and decisions follow the official
[hooks reference](https://code.claude.com/docs/en/hooks).

## Monitor usage

```bash
pnpm claude:usage
pnpm claude:usage --limit 20 --json --save
python3 scripts/claude/claude-usage.py --project /absolute/path/to/project --limit 10
```

The Stop hook saves `.claude/usage/<session-id>.json` after each completed turn.
Reports contain token counts by actual model, parent/subagent totals, skill
invocations, requested agent models/types, background calls, peak request
context, and request timestamp span. Streamed response usage is deduplicated by
request ID; available child transcripts are included. Malformed trailing JSONL
lines are skipped. No prompts, code, tool outputs, or API calls are included.

Compare representative accepted features before/after using these reports, plus
time to the first working slice and rework. Cache reads, cache writes, and output
are priced differently; raw token share is not spend share. Explicit Superpowers
calls and associated sessions identify workflow patterns, not exact incremental
plugin cost. Automatically injected plugin instructions are not Skill calls.

CLAUDE.md and `.claude/` are ignored local files in this repository. Matching
model defaults are configured separately for `example/`, `../platform/`,
`../matchmaking-ai/`, and `../sdks/`, so sessions opened there also use Opus 5.5.
Settings take effect on the next new Claude session. For an existing or resumed
session, select `/model claude-opus-5-5` and `/effort medium`. Local/managed settings,
environment variables, and CLI flags can override project defaults; user model
defaults have lower precedence. Check `/model`, `/context`, `/usage`, and `/tasks`
in Claude to confirm the active model and effort.

Model IDs, aliases, effort settings, and subagent overrides follow the official
[model configuration](https://code.claude.com/docs/en/model-config) and
[subagent model selection](https://code.claude.com/docs/en/sub-agents#choose-a-model)
documentation. Keep the single implementer, bounded delegation, focused context,
and usage hooks; save time through those controls rather than cheaper coding or
validation models.
