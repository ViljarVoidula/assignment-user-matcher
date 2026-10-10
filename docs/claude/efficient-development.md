# Efficient Claude development

Project default: Opus 5.5 (`claude-opus-5-5`) with medium effort for planning,
implementation, debugging, test design, and validation, with one implementer.
Validation quality comes from executable checks, observable behavior, and fresh
test evidence. Keep effort at medium; use the hooks and validation runner to
enforce the fix-and-test loop.
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
Run focused checks while iterating and required broader checks at completion.
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
This bypasses `.mocharc.json`'s global spec. Keep the required final suite and
Redis isolation rules. Use existing examples as scaffolds for recurring work.

Checkpoint decisions, changed files, acceptance criteria, and validation before
compacting around 100k context. Avoid exceeding 150k. Start a fresh session for
unrelated work. Do not run background loops unless explicitly requested. An
eight-hour session span is a signal to investigate, not proof of continuous work.

## Enforced validation

`scripts/claude/claude-validation.py` is the shared tool for these five checkouts.
`scripts/claude/validation-profiles.json` maps source paths to fixed validation
commands. It uses existing project test, lint, build, coverage, parity, and browser
commands; it does not replace their assertions or coverage requirements.

```bash
python3 scripts/claude/claude-validation.py status
python3 scripts/claude/claude-validation.py run --profile engine
python3 scripts/claude/claude-validation.py run --profile web --profile browser-public
python3 scripts/claude/claude-validation.py run --profile server --profile platform
python3 scripts/claude/claude-validation.py run --profile claude
# Inside Claude, with the SessionStart environment available, select changed profiles:
python3 scripts/claude/claude-validation.py run
```

Run these from the engine checkout, or use the script's absolute path from a
sibling checkout. Profile commands execute in their configured package directory.
Use focused native test commands while iterating; use the configured runner for
the required final checks and recorded evidence.

SessionStart saves a source baseline and preserves it across resume/compaction.
PreToolUse initializes it before the first mutation if needed. PostToolUse and
PostToolUseFailure detect changed inputs after Edit, Write, Bash, and delegated
work and remind Claude which profiles need evidence. Stop blocks completion while
an affected profile is missing, failed, or stale. It supplies the exact runner
command and instructs Claude to read failures, fix their cause, and rerun.
Read-only turns and edits already present at startup do not require unrelated
suites. Source changes elsewhere in this shared workspace can invalidate evidence;
the gate conservatively requires validation of changed inputs.

The runner saves real exit codes and full logs under `.claude/validation/runs/`,
and receipts under `.claude/validation/receipts/`. Receipts bind the checks to
source content and the configured command recipe. New files, deletions, shell
edits, and edits made during a check invalidate the relevant evidence. Zero-test
runs and an explicit parity-check skip do not count as passing. A failed rerun
invalidates an earlier pass. Checks run in sequence with a shared runner lock;
direct external test runs still need to follow the project's Redis isolation rules.

Browser checks use the built site and existing Playwright projects; console and
onboarding runs use one worker. Build prerequisites run before browser checks
unless matching passing web evidence already exists. Maintain the relevant
feature-specific acceptance criteria and visual review from `e2e/TEST-PLAN.md`,
PRODUCT.md, and DESIGN.md: automated passes do not prove those by themselves.
The AI checkout currently has no behavioral test suite, so its profile reports
static checks only; supply separate evidence for changed runtime behavior.

If validation is unavailable, after hook feedback end with `Validation blocked:`
and name every pending profile plus its actual blocker. This allows an honest
incomplete handoff and records no passing result. Do not claim verified completion
or disable hooks to get past failures. Hooks and receipts are workflow controls,
not a security boundary against manually altering the configuration or evidence.

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
