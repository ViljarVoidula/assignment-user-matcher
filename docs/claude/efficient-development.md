# Efficient Claude development

Project default: `opusplan` (Opus in plan mode, Sonnet for implementation),
medium effort, one implementer. Delegate only for a
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

Use Opus for planning and all independent code/spec/architecture reviews.
Enter plan mode for planning; outside plan mode, explicitly select Opus. Use the
local `project-reviewer` agent for one cohesive independent review: it declares
`model: opus` and high effort. Reserve one agent call for required review; report
it as pending if the budget prevents it. Avoid plugin review fan-out.

Use Haiku for simple read-only extraction and Sonnet for bounded implementation
and exploration. No global subagent model override is configured: older Claude
versions could let that override an explicit Opus reviewer. Always specify the
model on delegated tasks and verify actual models in the usage report.

## Start a feature

```text
Implement [feature] as one working end-to-end slice.
Start from [file / existing example].
Acceptance criteria: [observable behavior].
Read applicable DESIGN.md, PRODUCT.md, domain guidance, and validation docs first;
name the consulted paths and use their constraints as acceptance criteria.
Reuse existing patterns and dependencies.
Keep the plan brief using Opus in plan mode, then implement in the main session
using Sonnet. Use Opus for any independent review.
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

CLAUDE.md and `.claude/` are ignored local files in this repository. Their settings
take effect on the next Claude session; these changes do not alter sibling projects.
User/local/managed settings, environment variables, and CLI flags can override
defaults. Check `/model`, `/context`, `/usage`, and `/tasks` in Claude to confirm.
