# `assignment-user-matcher`: Lightning-Fast, Tag-Based User & Assignment Matching

[![npm version](https://badge.fury.io/js/assignment-user-matcher.svg)](https://badge.fury.io/js/assignment-user-matcher)
[![CI Pipeline](https://github.com/ViljarVoidula/assignment-user-matcher/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ViljarVoidula/assignment-user-matcher/actions/workflows/npm-publish.yml)
[![5xer Cloud](https://img.shields.io/badge/%E2%98%81%EF%B8%8F_5xer_Cloud-Sign_up-7C3AED)](https://5xer.com)

<!-- Add other badges if you have them, e.g., build status, test coverage -->

**Tired of inefficiently assigning tasks or struggling to connect the right users with the right work? `assignment-user-matcher` is a specialized Node.js library designed for high-performance, near real-time matching of a smaller pool of users to a large volume of assignments, primarily based on shared tags and priority.**

It leverages the speed and efficiency of Redis to deliver a robust solution perfect for scenarios like call centers, customer support queues, back-office operations, and more.

> ### ☁️ Don't want to run your own Redis?
>
> **[5xer Cloud](https://5xer.com)** offers this matching engine as a fully managed service — no infrastructure, no maintenance sweeps, no Redis ops. On top of that, you get a polished no-code UI: a mobile-friendly PWA where workers see their assignments, accept, and complete work from anywhere — no client to install, no code to write.
>
> **[Sign up at 5xer.com →](https://5xer.com)** — getting started is free.

## The Challenge: Efficiently Connecting Users to Work

In many applications, from customer service platforms to internal task management systems, the core challenge remains the same: how do you quickly and accurately assign incoming work (assignments) to the best available person (user)? This becomes particularly complex when dealing with:

- **Large volumes of incoming assignments:** Tasks can pile up quickly, demanding immediate attention.
- **Real-time requirements:** Users expect instant responses, and assignments need prompt handling.
- **Varying skill sets and priorities:** Not all users are equipped for all tasks, and some assignments are more critical than others.

Traditional matching systems can become bottlenecks, leading to delays, suboptimal pairings, and frustrated users or customers.

## Introducing `assignment-user-matcher`: Your Solution for Smart Task Distribution

`assignment-user-matcher` tackles these challenges head-on by providing a specialized engine optimized for a common pattern: a relatively small, active set of users (like support agents or back-office staff) processing a continuous, large stream of assignments.

**Key Features:**

- **Tag-Based Matching:** Intelligently connect users and assignments based on an intersection of descriptive tags (e.g., skills, language, department).
- **Priority-Aware:** Ensure that high-priority assignments are surfaced and processed first.
- **Redis-Powered:** Utilizes Redis for its in-memory data structures, enabling blazing-fast lookups and operations.
- **Optimized for Specific Scenarios:** Excels where a smaller group of users handles a large number of assignments.
- **User Backlog Management:** Prevents users from being overwhelmed by limiting the number of assignments they can be tentatively matched with.

## Why `assignment-user-matcher`?

- 🚀 **Speed:** Designed for near real-time performance, ensuring assignments are matched and delivered swiftly.
- 🎯 **Accuracy:** Improves the quality of matches by considering relevant tags and priorities.
- ⚙️ **Efficiency:** Optimizes resource allocation, ensuring users are working on the most appropriate and urgent tasks.
- 😌 **Improved Experience:** Leads to faster response times for customers and a more streamlined workflow for users.
- 💡 **Scalable (for its niche):** Handles a large throughput of assignments efficiently.

## Core Concepts: How It Works

`assignment-user-matcher` operates on a few key principles:

1.  **Users and Assignments Have Tags:**

    - **Users:** Each user is defined by an ID and a set of `tags` representing their skills, capabilities, or any other relevant attributes (e.g., `['english', 'billing_support', 'tier_1']`).
    - **Assignments:** Each assignment has an ID, `tags` describing its requirements (e.g., `['english', 'billing_inquiry']`), and a `createdAt` timestamp (or a custom priority score) to determine its urgency.

2.  **Matching via Tag Intersection:**
    The core matching logic finds users whose tags have a common intersection with an assignment's tags.

When using `routingWeights` with the built-in matcher:

- Only **positive** weights (`> 0`) make assignments eligible.
- Weight `0` is a **hard veto** (exact tag or suffix wildcard like `lang:*`).
- Wildcards are **suffix-only** (`prefix*`). Patterns like `skill:*:node` are not treated as wildcards.
- If a user has `routingWeights` but no positive entries, assignments stay queued.

Hard veto configuration example:

```ts
await assignmentMatcher.addUser({
    id: 'agent_1',
    tags: [],
    routingWeights: {
        'support:*': 100, // eligible
        'lang:*': 0, // hard veto for all language-tagged assignments
        default: 0, // hard veto for default matching fallback
    },
});
```

Note: `usingDefaultMatchScore` is an internal implementation detail and is **not** a public option.
Configure hard veto behavior only through `routingWeights` values.

Assignments can also veto specific users from their side: setting `vetoedUsers: ['user_1']` on an
assignment guarantees those users are never matched to it, no matter how well their tags, weights,
or other criteria fit (this also overrides workflow targeting).

3.  **Prioritization Engine:**
    Assignments are typically processed in the order they are received or by a custom prioritization function you can provide. This ensures that older or more critical assignments get attention first. The library aims to match the highest priority assignments to available, suitable users.

4.  **Redis as the Backbone:**
    Redis is used to store user availability, assignment details, and manage the matching process. Its speed is crucial for the near real-time performance of the library. Users are maintained in sorted sets based on their backlog size and last activity, ensuring fair and efficient distribution.

5.  **User Backlog (`maxUserBacklogSize`):**
    To prevent any single user from being assigned too many tasks at once (even if they are a match), `assignment-user-matcher` maintains a backlog for each user. New assignments are only matched if a user's backlog is below this threshold.

## Real-World Use Cases

`assignment-user-matcher` is particularly well-suited for:

- **📞 Call Centers:** Routing incoming calls (assignments) to the agent (user) with the right language skills, product knowledge, and availability.
- **🎫 Customer Support Ticketing:** Assigning new support tickets to support agents based on their expertise (e.g., "technical_issue," "api_support") and the ticket's urgency.
- **🗄️ Back-Office Operations:** Distributing tasks like data entry, document verification, or claims processing to available staff members based on task type and employee skills.
- **🚗 Gig Economy Platforms (Niche):** Matching available service providers to incoming customer requests where the provider pool is managed and assignments are plentiful (e.g., a dispatch system for a fleet of delivery drivers).
- ** Leads Distribution:** Assigning sales leads to representatives based on territory, product specialization, or lead score.

## Getting Started

### 1. Installation

```bash
npm install assignment-user-matcher redis
# or
yarn add assignment-user-matcher redis
# or
pnpm add assignment-user-matcher redis
```

### 2. Basic Usage

Here's a simple example to get you up and running:

```javascript
import AssignmentMatcher from 'assignment-user-matcher'; // or `import { AssignmentMatcher } from 'assignment-user-matcher';`
import { createClient } from 'redis';

async function runExample() {
    // Connect to your Redis instance
    const redisClient = createClient({
        // url: 'redis://your-redis-host:6379' // Optional: specify Redis URL if not default
    });
    await redisClient.connect();
    console.log('Connected to Redis.');

    const assignmentMatcher = new AssignmentMatcher(redisClient, {
        redisPrefix: 'exampleApp:', // Good practice to namespace your Redis keys
        maxUserBacklogSize: 5, // Max 5 assignments per user backlog
        enableDefaultMatching: true,
    });

    // Add a user
    await assignmentMatcher.addUser({
        id: 'agent_007',
        tags: ['english', 'technical_support', 'vip_clients'],
    });
    console.log("User 'agent_007' added.");

    // Add an assignment
    await assignmentMatcher.addAssignment({
        id: 'ticket_12345',
        tags: ['english', 'technical_support'],
        createdAt: new Date().getTime(), // Use current time for priority
    });
    console.log("Assignment 'ticket_12345' added.");

    // Run the matching process
    // This will attempt to match pending assignments to available users
    console.log('Running matching process...');
    await assignmentMatcher.matchUsersAssignments();

    // Check current assignments for the user
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser('agent_007');
    console.log(`Assignments for 'agent_007':`, userAssignments);

    if (userAssignments && userAssignments.length > 0) {
        console.log(`User 'agent_007' is matched with assignment '${userAssignments[0].id}'.`);
    } else {
        console.log(`User 'agent_007' has no assignments currently.`);
    }

    // Clean up (optional, depending on your Redis setup)
    // await redisClient.flushDb(); // Be careful with this in production!
    await redisClient.quit();
    console.log('Disconnected from Redis.');
}

runExample().catch(console.error);
```

### 3. Workflow Quick Start

Workflows are easiest to use with the builder helpers and the `executeWorkflow()` convenience method.

```typescript
import AssignmentMatcher, { workflow } from 'assignment-user-matcher';

const matcher = new AssignmentMatcher(redisClient, {
    enableWorkflows: true,
    redisPrefix: 'exampleApp:',
});

// Optional if your Redis client is already connected.
// Useful when the matcher is created with a closed client.
await matcher.waitUntilReady();

const onboardingWorkflow = workflow('onboarding', 'Onboarding')
    .step('profile')
    .name('Complete profile')
    .assignment({ tags: ['profile'], title: 'Complete your profile' })
    .targetUser('initiator')
    .defaultNext('review')
    .done()
    .step('review')
    .name('Manager review')
    .assignment({ tags: ['review'], title: 'Review onboarding' })
    .targetUser({ tag: 'managers' })
    .defaultNext(null)
    .done()
    .build();

// Registers the definition if needed, then starts the workflow instance.
const instance = await matcher.executeWorkflow(onboardingWorkflow, 'agent_007', {
    source: 'signup',
});

console.log(instance.id, instance.currentStepId);
```

You can still call `registerWorkflow()` and `startWorkflow()` separately if you want explicit lifecycle control.

#### Escalation ladders (`escalateTo`)

A step whose timeout expires normally fails the run (after any `maxRetries`). `escalateTo(stepId)` turns that timeout into a forward hop instead — the classic page-the-primary-then-the-secondary ladder:

```typescript
const escalation = workflow('oncall', 'On-call escalation')
    .step('page-primary')
    .assignment({ tags: ['sev:1', 'oncall-primary'] })
    .targetUser({ tag: 'oncall-primary' })
    .timeout(60_000)
    .escalateTo('page-secondary')
    .route('result.acked === true', 'mitigate')
    .done()
    .step('page-secondary')
    .assignment({ tags: ['sev:1', 'oncall-secondary'] })
    .targetUser({ tag: 'oncall-secondary' })
    .timeout(300_000)
    .escalateTo('page-manager')
    .done();
// … 'page-manager' has no escalateTo: the ladder ends and the run fails,
// which is the honest "escalated to the top and nobody answered" state.
```

When a step escalates, its outstanding assignment is removed so a late responder cannot act on a superseded tier, `context._escalatedFrom` and `context._escalationDepth` are set, and a `step.escalated` transition is emitted (in addition to `step.expired`). Escalating does **not** consume `maxRetries` — a different person getting the work is not another attempt at the same one. `maxEscalationDepth(n)` (default 10) stops a mis-wired cycle from climbing forever.

Registration rejects an escalation target that doesn't exist, a step escalating to itself, escalation without a resolvable timeout, and escalation from inside a parallel group.

Targeting matters: `targetUser({ tag: '…' })` routes the step's assignment through ordinary tag matching (so fairness, backlog caps, and the rolling-window grant cap all apply), while `targetUser('<userId>')` makes it workflow-targeted and therefore exempt from the fairness window cap. For tiered escalation you almost always want the tag form.

A workflow-targeted assignment is claimed queued→pending for its target through the same atomic claim gate as organic matching, whether or not the worker's tags/weights would ever have matched it — so `acceptAssignment`/`completeAssignment` work identically and the workflow advances. A worker who rejects a targeted assignment is not re-granted it (the standard rejection contract); the step then runs its response-deadline/escalation machinery.

Plain object workflow definitions are also accepted. The library now fills in sensible defaults:

- `version` defaults to `1`
- `initialStepId` defaults to the first step ID
- invalid definitions fail early during registration with clear validation errors

### 4. Scaling & Reliability for Workflows

The workflow engine is designed to run with many orchestrator replicas over large instance counts. The key building blocks:

- **Indexed step timeouts** — step expirations are tracked in a sorted set and claimed atomically, so `processExpiredWorkflowSteps()` is O(due steps) instead of scanning every instance, and an expiry fires on exactly one replica.
- **In-place conflict retries** — optimistic-lock (`VERSION_MISMATCH`) conflicts are retried immediately with a fresh read instead of waiting for the orphan-reclaim window.
- **Delayed retry queue** — failed events are scheduled for retry with exponential backoff (`workflowRetryBackoffMs`, default 1000ms initial delay) and drained automatically by the orchestrator; retries are claimed atomically across replicas.
- **Flow rate control** — tune orchestrator throughput per replica: `workflowEventBatchSize` (XREADGROUP COUNT, default 10), `workflowPollBlockMs` (blocking poll wait, default 5000ms), and `workflowMaxEventsPerSecond` to cap event processing (applies to both stream consumption and retry draining; unlimited when unset).
- **Per-event idempotency markers** — processed-event markers carry their own TTL (`workflowIdempotencyTtlMs`), and replayed step executions generate deterministic assignment IDs so crash-replays never create duplicate assignments.
- **Shared circuit breaker** — set `circuitBreakerShared: true` to converge breaker state across replicas through a shared Redis failure counter (recommended for multi-replica deployments).
- **Instance retention** — set `workflowInstanceRetentionMs` to expire terminal (completed/failed/cancelled) instances and clean their registry/index entries. Unset (the default) keeps them forever, matching previous behavior; a value in the range of days to weeks is recommended for high-volume deployments.
- **Event-stream trimming** — set `workflowEventStreamAutoTrim: true` to keep the `events:stream` Redis stream bounded. Trimming runs after event processing and on the orchestrator's reclaim interval, and is anchored to the consumption frontier — every entry delivered _and_ acknowledged by every consumer group — so it can never drop an unconsumed event, no matter how far consumers lag (the flip side: the stream still grows while consumers are down). Unset (the default), the stream is never trimmed; `trimWorkflowEventStream()` exposes the same trim for hosts running their own tick.

Operational helpers:

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableWorkflows: true,
    circuitBreakerShared: true,
    workflowInstanceRetentionMs: 30 * 24 * 60 * 60 * 1000, // 30 days
});

// Machine steps can run through named handlers with timeout enforcement
// (step.timeoutMs / defaultTimeoutMs); falls back to executeMachineTask.
matcher.registerMachineHandler('score-lead', async ({ instance, step }) => {
    return { score: 42 };
});

// One-time migration for deployments created before the indexes existed
await matcher.backfillWorkflowIndexes();

// Periodic maintenance for deployments without retention configured
await matcher.pruneWorkflowInstances(30 * 24 * 60 * 60 * 1000);

// Monitoring: active instances, retry queue depth, DLQ size, stream stats
const metrics = await matcher.getWorkflowMetrics();
```

## API Reference

The main class provided is `AssignmentMatcher`.

### `new AssignmentMatcher(redisClient, options?)`

Creates a new `AssignmentMatcher` instance.

- `redisClient`: An initialized and connected `redis` client instance (version 4+).
- `options` (Optional): Configuration options for the matcher. See [Options](#options) below.

### `addUser(user: User): Promise<void>`

Adds or updates a user in the system.

- `user`: An object representing the user.
    - `id: string`: Unique identifier for the user.
    - `tags: string[]`: Array of tags associated with the user.
    - `maxBacklogSize?: number`: Optional per-user backlog cap overriding the matcher-wide `maxUserBacklogSize` in every matching path (`0` = receive nothing; negative or non-numeric values are ignored). The cap bounds the user's **total** pending backlog: a user already holding work is only topped up to the cap, never past it. The fairness rolling-window auto-cap derivation stays team-level and keeps using the global value.

### `addAssignment(assignment: Assignment): Promise<void>`

Adds a new assignment to be matched.

- `assignment`: An object representing the assignment.
    - `id: string`: Unique identifier for the assignment.
    - `tags: string[]`: Array of tags required for the assignment.
    - `createdAt: number`: Timestamp (e.g., `new Date().getTime()`) indicating when the assignment was created. Used for default prioritization (older assignments get higher priority). Can be influenced by `prioritizationFunction`.
    - `priority?: number | string`: Optional explicit priority. If `prioritizationFunction` is used, this might be an input to it.
    - `vetoedUsers?: string[]`: Optional list of user IDs that must never receive this assignment, regardless of any other matching criteria (tags, `routingWeights`, priority, or workflow targeting). Vetoed assignments are excluded from a user's candidate pool before scoring, so the veto adds no per-match overhead. To change an assignment's vetoes, remove and re-add the assignment.

### `matchUsersAssignments(): Promise<void>`

Triggers the matching process. This method iterates through pending assignments and tries to match them with suitable, available users based on tags and user backlog capacity. With no `userId`, every eligible user is evaluated in parallel by default and contested assignments go to whoever's claim resolves first - see the `fairness` option in [Options](#options) to make the best-scoring candidate win deterministically (`'best-match'`), or to additionally balance load across users (`'balanced'`, `'spread-work'`).

### `getCurrentAssignmentsForUser(userId: string): Promise<Assignment[]>`

Retrieves the current list of assignments that a user is tentatively matched with (i.e., in their backlog).

- `userId: string`: The ID of the user.

### `getPendingAssignmentsWithAge(options?: { limit?: number }): Promise<PendingAssignmentInfo[]>`

Retrieves current pending assignments, including who owns each assignment and how long it has been pending. Reads are bounded (the pending hash is paged with `HSCAN` and each page's lookups are batched), and corrupt entries are skipped. Pass `{ limit }` (clamped to 1000) to hydrate only the top-N longest-pending assignments instead of every one; without options the behavior is unchanged.

- `assignment`: The assignment payload.
- `ownerId`: The current owner user ID, or `null` if missing.
- `pendingForMs`: Elapsed pending time in milliseconds.
- `pendingSince`: Unix timestamp (ms) when the assignment entered pending state (derived from the assignment's own response deadline — `escalation.respondWithinMs` or `matchExpirationMs`).
- `expiresAt`: Unix timestamp (ms) when pending expiration is scheduled.

### `getCompletedAssignments(options?: { cursor?, limit? }): Promise<CompletedAssignmentPage>`

Lists terminal assignments from the completed store (completions and failures share it), cursor-paged like the other bounded reads. Each entry is stamped `_status: 'completed'` or `'failed'` (the terminal marker also distinguishes them: `_completedBy`/`_completedAt` vs `_failedBy`/`_failedAt`). The store is only pruned when `completedAssignmentsRetentionMs` is configured (see [Options](#options)); pagination is best-effort under a concurrent purge — the cursor is a positional offset, so entries deleted between pages can shift what a later page returns. Loop until `hasMore` is false and re-page if completeness matters.

### User status & workload queries

Three bounded APIs answer "who is in the pool and how loaded are they?" without materializing whole Redis structures:

#### `getUsersPaginated(options?: UserQueryOptions): Promise<UserQueryResult>`

Paginated user scan with composable filters (logical AND):

```ts
const page = await matcher.getUsersPaginated({
    status: 'active', // 'all' | 'active' | 'paused' | 'idle'
    idleForMs: 10 * 60_000, // last touchUser() older than this
    hasBacklog: true, // pending backlog non-empty
    atCapacity: true, // backlog reached the effective cap
    limit: 100, // clamped to [1, 1000]
    includeAssignments: true, // also return pending/accepted ids
    includeTotal: true, // also return the unfiltered pool size
    cursor: null, // pass nextCursor verbatim to continue
});
```

Each `UserSummary` carries `userId`, the stored `user` record, `paused`, `lastActiveAt`, `backlog`, `acceptedCount`, the effective `maxBacklogSize` (per-user override honored), and `atCapacity`. `status: 'idle'` without an explicit `idleForMs` falls back to the matcher's `idleUserTimeoutMs` (and matches nobody when neither is set). Two pagination caveats, both consequences of paging the users hash with `HSCAN`: a scan page is never split, so a returned page may exceed `limit` by less than one scan page; and filters are applied during the scan, so a page may return fewer than `limit` users while `hasMore` is still true. Loop on `hasMore` until it is false. With `includeAssignments`, the returned `acceptedAssignmentIds` come straight from the per-user index and are not verified against the accepted store — a rare stale id can appear; `getActiveAssignmentsForUser()` is the verified (and self-healing) read.

#### `getUserSummaries(userIds: string[]): Promise<UserSummary[]>`

Order-preserving batch version for a known set of ids (chunked pipelined reads). Missing or corrupt user records are omitted.

#### `getActiveAssignmentsForUser(userId: string): Promise<ActiveAssignmentInfo[]>`

A user's accepted (in-progress) assignments, newest first, each with its `acceptedAt` timestamp — the complement to `getCurrentAssignmentsForUser()`'s pending backlog. Backed by a per-user accepted index (`user:{id}:accepted`) maintained on accept and on every terminal transition (complete/fail/remove/SLA sweeps). Two freshness notes:

- The index is maintained from the version that introduced it: accepted work that predates upgrading (or that is in flight during a rolling upgrade) appears only after it cycles.
- A stale member can survive `removeAssignment` on a non-SLA accepted assignment (only SLA records carry their owner); reads verify ids against the accepted store and self-heal, so results stay correct.

**Crash-safety note.** `getUsers()` (and `getQueueStats()`'s internal user scan) now skip a corrupt user record instead of throwing on it — the same precedent `getAllAssignmentsFromStores` already set. One malformed entry can no longer take down a dashboard endpoint.

### `pauseUser(userId: string): Promise<boolean>` / `resumeUser(userId: string): Promise<boolean>`

Operator availability controls. A paused user stops receiving new assignments in every matching path but keeps their pending backlog and can still accept, complete, or reject work they already hold. Paused users are exempt from idle auto-removal (`idleUserTimeoutMs`) — pausing is deliberate absence, not idleness. `pauseUser` returns `false` when the user is not in the pool; `resumeUser` returns `false` when the user was not paused, and records activity (resets the idle clock) when it succeeds. Inspect state with `isUserPaused(userId)` and `getPausedUsers()`.

When decision traces are enabled, paused users appear struck out in traces with a `paused` reason, and `explainMatch()` reports them as ineligible.

### `releaseUserAssignments(userId: string): Promise<string[]>`

The redistribution counterpart to `pauseUser`: requeue every pending (matched but not yet accepted) assignment the user holds so other users can pick them up — for when a worker is gone rather than briefly away. Accepted assignments (work in progress) are never touched. Requeued assignments keep their original wait clock (`getQueueStats().oldestWaitingMs` does not reset), workflow subscribers receive an `EXPIRED` event per released assignment, and a still-paused user cannot win their released work back until resumed. Returns the released assignment ids (`[]` when the user holds nothing or is unknown). The idle auto-removal path (`processIdleUsers`) uses the same requeue mechanics internally.

### `assignToUser(assignmentId: string, userId: string, options?: { force?: boolean }): Promise<{ previousOwnerId: string | null }>`

Operator override: hand an assignment directly to a user, bypassing tag/weight selection. Works on queued assignments and on pending assignments held by another user (the previous owner's backlog slot is released and the expiry clock restarts). Idempotent when the user already owns the assignment.

Hard rules still apply unless `force: true`: the user must not be paused, must have backlog headroom, must not be vetoed on the assignment, and must not have previously rejected it. The learning layer is never fed by manual assignments. When tracing is active the override is recorded as a decision trace with mode `'manual'`, so supervisor actions land in the same audit trail as organic matches.

### Response deadlines & escalation (`Assignment.escalation`)

By default an assignment nobody responds to is requeued after the matcher-wide `matchExpirationMs` — and the same user may win it straight back. Attach an `EscalationPolicy` to make that behaviour explicit: a per-assignment deadline, an optional block on the non-responder, a priority climb, and an optional tier ladder that moves the work to a different pool on each hop. **No workflow is required.**

```ts
await matcher.addAssignment({
    id: 'incident-1',
    tags: ['sev:1', 'oncall-primary'],
    priority: 1000,
    escalation: {
        respondWithinMs: 60_000,
        onNoResponse: 'block', // don't offer it back to whoever ignored it
        priorityBoost: 500, // ignored work climbs the queue
        tiers: [['oncall-primary'], ['oncall-secondary'], ['oncall-manager']],
        onExhausted: 'park', // nobody answered, all the way up
    },
});

matcher.startMaintenance(); // deadlines don't fire unless something sweeps them
```

| Field             | Meaning                                                                                                                                        | Default                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| `respondWithinMs` | Per-assignment response deadline, overriding `matchExpirationMs`                                                                               | required                           |
| `onNoResponse`    | `'block'` treats a non-response as a soft rejection (same rejected set an explicit reject writes to); `'allow'` keeps the historical behaviour | `'allow'`                          |
| `priorityBoost`   | Priority delta applied on each hop                                                                                                             | `0`                                |
| `tiers`           | Tag ladder. Tier tags are swapped per hop; tags not named by any tier survive untouched                                                        | none                               |
| `maxEscalations`  | Hop ceiling                                                                                                                                    | `tiers.length - 1`, else unlimited |
| `onExhausted`     | `'queue'` keeps recirculating; `'park'` holds it out of matching                                                                               | `'queue'`                          |

The wait clock always survives an escalation: requeues go through `addAssignment`, whose `NX` keeps the original first-enqueue time, so `getQueueStats().oldestWaitingMs` measures the work item rather than the current tier.

Subscribe via `onAssignmentLifecycle` for `escalated` (`{ fromWorkerId, level, blockedPreviousOwner }`) and `escalationExhausted` (`{ level, parked }`) events; `expired` is still emitted first, so existing consumers are unaffected. Parked assignments are reachable with `getParkedAssignments()`, returned to the queue with `unparkAssignment(id, { resetEscalation? })`, and report `_status: 'parked'` from `getAssignment()` — they never read as "not found". `getEscalationLevel(id)` reports how far an assignment has climbed.

#### `failed` — the worker-reported outcome

`failAssignment(userId, assignmentId, reason?)` now emits `{ kind: 'failed', taskId, workerId, reason?, failedAt }`. It previously emitted nothing at all, so an explicit failure was the one terminal transition invisible to `onAssignmentLifecycle` (the workflow event stream did hear it). It is deliberately distinct from `completionBreached` with `action: 'fail'`: that is a deadline a policy acted on, this is a person reporting that the work could not be done. No `assignment` snapshot rides along — the record stays in the completed store carrying `_failedBy` / `_failureReason`, so `getAssignment()` can still answer for it.

A host that `switch`es exhaustively over `AssignmentLifecycleEvent` will see a new `kind` here; the union is additive and every existing branch keeps its shape.

### SLA policies (`Assignment.sla`)

Escalation owns the _response_ side (how long a matched user has to accept). `SlaPolicy` owns everything after that: how long the accepting user has to finish, how many times the work may be refused before it is pulled from rotation, and an absolute freshness cutoff after which the work is moot.

```ts
await matcher.addAssignment({
    id: 'order-42',
    tags: ['fulfillment'],
    sla: {
        completeWithinMs: 30 * 60_000, // finish within 30 min of accepting
        onCompletionBreach: 'requeue', // take it back if they don't
        maxRejections: 3, // after 3 refusals, stop offering it
        expireAfterMs: 24 * 3600_000, // moot after 24h no matter what
    },
});

matcher.startMaintenance(); // SLA clocks are swept by the maintenance tick
```

| Field                | Meaning                                                                                                                                                            | Default    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| `completeWithinMs`   | Completion deadline, measured from `acceptAssignment()`. Swept by `processCompletionDeadlines()`                                                                   | none       |
| `expireAfterMs`      | Absolute freshness cutoff from **first enqueue** — survives requeues and applies in every state (queued, pending, accepted). Swept by `processSlaExpiries()`       | none       |
| `maxRejections`      | Refusal budget. Explicit `rejectAssignment()` calls **and** blocking no-response expiries (`escalation.onNoResponse: 'block'`) count; idle/operator releases don't | none       |
| `onCompletionBreach` | `'notify'` (event only, worker keeps it) / `'requeue'` (take back, block breacher) / `'fail'` / `'park'`                                                           | `'notify'` |
| `onMaxRejections`    | `'park'` / `'fail'` / `'keep'` (keep offering; budget becomes measurement-only)                                                                                    | `'park'`   |
| `onExpire`           | `'drop'` (remove entirely) / `'park'` (retain for inspection)                                                                                                      | `'drop'`   |

Semantics worth knowing:

- **Fire-once.** A breached completion deadline is removed from the deadline index before the action runs, so a `'notify'` breach doesn't re-fire every tick; a requeued-after-breach assignment gets a fresh completion clock only on its next accept.
- **The TTL never extends.** Rejection ping-pong re-adds the same JSON, whose `_enqueuedAt` keeps the original first-enqueue time — the freshness cutoff is a hard wall, not a sliding window.
- **Rejection budget outranks escalation.** Once `maxRejections` is exhausted the assignment is parked/failed instead of climbing further tiers.
- **Sweep granularity.** Like response deadlines, SLA clocks fire on the maintenance tick, not at the exact deadline.
- **Unparking.** `unparkAssignment(id, { resetSla: true })` clears the first-enqueue clock and rejection counter; without it an unparked TTL-expired item simply expires again on the next sweep.

Lifecycle events: `completionBreached` (`{ workerId, action }`), `slaExpired` (`{ ownerId, action }`), `rejectionBudgetExhausted` (`{ rejections, action }`).

**SLO measurement.** `getSlaStats(tag?)` returns aggregate attainment counters — global, or for one tag: `offers`, `acceptedInTime`, `acceptanceBreaches`, `completionBreaches`, `ttlExpiries`, `rejectionParked`, plus `meanAcceptLatencyMs` (matched→accepted) and `meanCompleteLatencyMs` (accepted→completed). Counters are best-effort `HINCRBY`s piggybacking paths that already touch Redis; only SLA-bearing assignments are measured.

**Learning integration.** Breach outcomes flow into the contextual bandit as ordinary rewards (TTL expiry and completion breach → `expire`; completion breach with `'fail'` → `fail`), so per-user/per-tag stats and the automatic routing-weight vetoes pick up chronic breachers with no extra configuration. The default feature extractor also emits `sla:hasDeadline` and `sla:tightness` (normalized against `learningSlaTightnessReferenceMs`, default 1h) for assignments with a completion deadline, letting the model learn that tight-deadline work needs fast finishers. Custom feature extractors are unaffected.

### Scheduled assignments (`Assignment.schedule`)

Escalation owns the response clock and `SlaPolicy` owns the post-accept contract; `SchedulePolicy` owns the **offer window**: when the work becomes visible to matching at all (`notBefore`), and how long an offer may go un-accepted before it is pulled (`notAfter`). Acceptance ends the schedule's authority — completion pressure is `sla.completeWithinMs`'s job.

```ts
await matcher.addAssignment({
    id: 'callback-42',
    tags: ['callbacks'],
    schedule: {
        notBefore: Date.parse('2026-08-07T09:00:00Z'), // invisible to matching until 9:00
        notAfter: Date.parse('2026-08-07T11:00:00Z'), // parked if nobody accepted by 11:00
        onMiss: 'park', // or 'drop'
    },
});

matcher.startMaintenance(); // schedule clocks are swept by the maintenance tick
```

| Field       | Meaning                                                                                                                                                               | Default  |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `notBefore` | Epoch ms. Held in a dedicated scheduled store — no matching, no workflow targeting, no wait clock — until the scheduled sweep enqueues it                             | none     |
| `notAfter`  | Epoch ms. Absolute offer deadline; applies only while un-accepted (scheduled, queued, or pending). Valid without `notBefore`. Must be `> notBefore` when both are set | none     |
| `onMiss`    | `'park'` (retain for inspection) / `'drop'` (remove entirely) when `notAfter` elapses un-accepted                                                                     | `'park'` |

Semantics worth knowing:

- **Clocks anchor at activation.** A held assignment has no wait clock and no SLA freshness stamp; both start when the sweep (or a forced early assign) enqueues it. `getQueueStats().oldestWaitingMs` never counts held work.
- **Acceptance kills the offer clock.** Once accepted, a passing `notAfter` is a non-event — late completion is governed by `sla.completeWithinMs` alone.
- **A miss beats activation.** When one sweep finds both timestamps in the past, the assignment parks/drops directly; it never transits the queue or emits `scheduleActivated`.
- **The offer deadline never extends.** `notAfter` is absolute, so rejection requeues carry the same deadline — a re-offered assignment can still miss.
- **Fire-once, replica-safe.** Sweep entries are claimed with a `ZREM` before acting, so concurrent replicas can run the sweep in parallel.
- **Sweep granularity.** Schedule clocks fire on the maintenance tick (`processScheduledAssignments()`), not at the exact millisecond.
- **One policy, one window.** Repeating work is a [recurring assignment](#recurring-assignments-addrecurringassignment): a standing template whose sweep materializes each occurrence as an ordinary scheduled assignment carrying a derived policy. (Hand-materializing occurrences from your own scheduler still works — re-adding an existing id never resets its clocks, so materialization is idempotent — and the [`scheduling` module](#shift-scheduling-scheduling-module) produces dated occurrences you can feed straight in.)
- **Operator override.** `assignToUser(id, userId)` refuses held assignments; `{ force: true }` early-activates (clocks anchor there). If the user then rejects and `notBefore` is still in the future, the assignment returns to the scheduled store.
- **Unparking.** `unparkAssignment(id, { resetSchedule: true })` strips the schedule policy; without it a miss-parked assignment misses again on the next sweep.

Lifecycle events: `scheduleActivated` (`{ taskId, at }`) and `scheduleMissed` (`{ ownerId, state, action, assignment }` — the snapshot is the last surviving copy on the `'drop'` path).

**Introspection.** Held assignments are listed by `getScheduledAssignments()`, read as `_status: 'scheduled'` from `getAssignment()`, and counted separately in `getAssignmentCounts().scheduled` and `getQueueStats().scheduled` (excluded from `total` and pagination, like parked items). Misses bump the `scheduleMisses` counter in `getSlaStats(tag?)`.

**Learning integration.** Misses feed the contextual bandit as `expire` outcomes — a pending-state miss penalizes the user who sat on the offer, so automatic routing-weight vetoes pick up chronic missers with no extra configuration.

### Recurring assignments (`addRecurringAssignment`)

A recurring assignment is a **standing template**, never itself matchable: the recurrence sweep cuts each occurrence from it as an ordinary assignment whose `schedule` is derived from the policy (`notBefore` = the slot's open time, `notAfter` = open + `windowMs`). Everything else the template carries — tags, priority, SLA, escalation, vetoes, geo — is inherited by every occurrence.

```ts
await matcher.addRecurringAssignment({
    id: 'blog-draft',
    tags: ['blog'],
    recurrence: {
        everyMs: 14 * 24 * 3600_000, // biweekly
        startAt: Date.parse('2026-09-07T09:00:00Z'), // first window opens here (default: now)
        windowMs: 3 * 24 * 3600_000, // each occurrence offered for 3 days
        onMiss: 'park', // an unserved window parks the occurrence for inspection
    },
});

matcher.startMaintenance(); // the recurrence sweep rides the maintenance tick
```

| Field            | Meaning                                                                                                                             | Default  |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `everyMs`        | Interval between window opens. Minimum 1000                                                                                         | required |
| `startAt`        | Epoch ms the first window opens                                                                                                     | now      |
| `windowMs`       | Offer window per occurrence (`schedule.notAfter = open + windowMs`). Omitted: occurrences never expire off the offer clock          | none     |
| `onMiss`         | Per-occurrence miss policy, as in `SchedulePolicy`                                                                                  | `'park'` |
| `until`          | No occurrence opens after this epoch ms; the template retires                                                                       | none     |
| `maxOccurrences` | Retire after this many occurrences materialized                                                                                     | none     |
| `catchUp`        | Downtime policy: `'skip'` materializes only slots whose window is still open; `'all'` materializes every elapsed slot (audit trail) | `'skip'` |

Semantics worth knowing:

- **Occurrence ids are deterministic** — `<templateId>@<openEpochMs>` — so a crashed sweep re-materializing a slot is an idempotent re-add, and any occurrence traces back to its template with no extra state.
- **Slots never drift.** They align to `startAt + k × everyMs` whatever the sweep cadence; the tick decides when a slot is _noticed_, never where it sits.
- **One occurrence ahead.** The sweep materializes each occurrence one interval before its window opens, so upcoming work is already visible in the scheduled store (`getScheduledAssignments()`, `getQueueStats().scheduled`).
- **Skipped slots are free.** Under `catchUp: 'skip'`, slots that fully elapsed during downtime never existed: they don't count against `maxOccurrences` and don't flood the queue on revival. Under `'all'` they materialize and are immediately missed by the schedule sweep (parked/dropped per `onMiss`) — the audit-trail reading of a dead interval.
- **Re-adding updates the template, not the clock.** Occurrences already cut and the next slot are facts about the past; remove and re-add to restart.
- **Removal is forward-looking.** `removeRecurringAssignment(id)` stops future occurrences; already-materialized ones live on as ordinary assignments. `{ dropScheduled: true }` additionally clears occurrences still held un-activated in the scheduled store — never queued, pending, or accepted work.
- **Fire-once, replica-safe, self-healing.** Sweep claims are one-shot `ZREM`s like the scheduled sweep; the due index is re-derived from the template store at the top of every pass, so a crashed sweep can strand nothing.

API: `addRecurringAssignment(template)` · `removeRecurringAssignment(id, { dropScheduled? })` · `getRecurringAssignment(id)` / `listRecurringAssignments()` (each returns `{ template, nextAt, occurrences }`) · `processRecurringAssignments()` (manual sweep; also runs on the maintenance tick as `recurrence`, default on).

Lifecycle events: `recurrenceMaterialized` (`{ taskId, recurringId, occurrence, opensAt, at }` — hosts that keep per-task context copy it template → occurrence on this event) and `recurrenceRetired` (`{ recurringId, reason, occurrences, at }`).

### `startMaintenance(options?)` / `stopMaintenance()` / `runMaintenanceOnce(options?)`

Deadlines are not self-firing — something has to sweep them. `startMaintenance()` runs every enabled sweep on one tick:

- `recurrence` (default on) — recurring-assignment materialization. Runs first so a due-now occurrence flows recurrence → schedule → queue inside one tick.
- `scheduled` (default on) — schedule activations and offer-window misses (`schedule.notBefore` / `schedule.notAfter`). Runs before the deadline sweeps so a just-activated assignment's other clocks start from the same tick.
- `responseDeadlines` (default on) — expiry, escalation, parking.
- `completionDeadlines` (default on) — SLA completion deadlines (`sla.completeWithinMs`).
- `slaExpiries` (default on) — SLA freshness TTLs (`sla.expireAfterMs`).
- `workflowStepTimeouts` (default on when `enableWorkflows`) — the step-timeout index. **Note:** `startOrchestrator()` consumes the event stream but does not sweep step timeouts; without maintenance, `timeoutMs` on a workflow step never fires.
- `idleUsers` (default on when `idleUserTimeoutMs` is set).
- `completedRetention` (default on when `completedAssignmentsRetentionMs` is set) — purges terminal assignments from the completed store once their `_completedAt`/`_failedAt` timestamp is older than the window. The window applies retroactively to records created before the option was configured; purges are capped per pass so a large historical store drains across ticks. Entries without a terminal timestamp (externally injected) are never deleted. Also available standalone as `processCompletedAssignmentsRetention()`.

`runMaintenanceOnce()` does one pass and returns a `MaintenanceReport` (`expiredMatches`, `escalations`, `parked`, `completionBreaches`, `slaExpiries`, `scheduleActivations`, `scheduleMisses`, `recurrenceMaterializations`, `recurrenceRetirements`, `retentionPurged`, `expiredSteps`, `releasedIdleUsers`, `tookMs`) — use it from a host that already owns a tick (a multi-tenant worker, a serverless schedule) instead of holding a timer per matcher. `startAutoReleaseInterval()` remains as a deprecated alias that sweeps response deadlines only.

### `getQueueStats(): Promise<QueueStats>`

Live operational snapshot for dashboards:

- `queued` / `pending` / `scheduled`: assignment counts by state (`scheduled` = held by `schedule.notBefore`, not yet in the queue).
- `oldestWaitingMs`: age of the longest-waiting unaccepted assignment, or `null`. The wait clock starts at first enqueue and survives reject/expiry requeues; it stops when a user accepts the assignment or it is removed. Held (scheduled) assignments have no wait clock yet.
- `perUser`: every user's `backlog` depth, effective `maxBacklogSize` cap, and `paused` state.

### `removeUser(userId: string): Promise<void>`

Removes a user from the system and clears their assignment backlog.

### `removeAssignment(assignmentId: string, tags: string[]): Promise<void>`

Removes a specific assignment from the system. Requires tags to efficiently locate the assignment in Redis.

### `completeAssignmentForUser(userId: string, assignmentId: string): Promise<void>`

Marks an assignment as completed by a user, removing it from their backlog and potentially making them available for new assignments.

### `waitUntilReady(): Promise<AssignmentMatcher>`

Waits for the matcher to finish connecting and initializing internal Redis and workflow resources.

### `executeWorkflow(workflowOrId, userId, initialContext?): Promise<WorkflowInstance>`

The simplest workflow entrypoint.

- Pass a workflow ID to start an already-registered workflow.
- Pass a workflow definition or builder-produced definition to register it and start it in one call.

## Options

You can pass an options object to the `AssignmentMatcher` constructor:

```typescript
type Options = {
    // How many of the highest-priority assignments to consider in one matching batch.
    // A larger batch might find more matches but could be slower.
    relevantBatchSize?: number; // Default: 50

    // Prefix for all Redis keys used by this library. Useful for namespacing
    // if you use the same Redis instance for multiple applications or purposes.
    redisPrefix?: string; // Default: '' (empty string)

    // The maximum number of assignments a user can have in their "tentative" backlog.
    // Once a user reaches this limit, they won't be matched with new assignments
    // until some are completed or removed.
    maxUserBacklogSize?: number; // Default: 9

    // Whether to enable default tag injection/matching behavior.
    // Notes for built-in weighted matching (`routingWeights`):
    // - only weights > 0 are eligible
    // - weight 0 is a hard veto (exact and suffix wildcard)
    // - if no positive weights exist, no assignment is pulled from queue
    // If set to false, you should provide a custom `matchingFunction`.
    enableDefaultMatching?: boolean; // Default: true

    // Opt-in idle user auto-rejection. When set, users holding pending
    // (not yet accepted/rejected) assignments with no activity for this many
    // milliseconds are removed from the matching pool by `processIdleUsers()`,
    // and their pending assignments are requeued for other users.
    // Activity is recorded automatically on addUser/acceptAssignment/rejectAssignment,
    // or explicitly via `touchUser(userId)` as a heartbeat.
    // Use `startIdleUserInterval(intervalMs)` / `stopIdleUserInterval()` to run
    // the check periodically. Disabled when undefined (default).
    idleUserTimeoutMs?: number; // Default: undefined (disabled)

    // Retention window for the completed-assignments store, in ms. Terminal
    // assignments (completed or failed — they share the store) whose
    // _completedAt/_failedAt timestamp is older than the window are purged by
    // the maintenance tick (sweep flag `completedRetention`, default on when
    // this is set; also callable directly as processCompletedAssignmentsRetention()).
    // The window applies RETROACTIVELY: records created before you configured
    // it are purged too — in capped batches per tick, so a large historical
    // store drains gradually rather than in one deletion storm. Entries
    // without a terminal timestamp are never deleted. Disabled when
    // undefined (default) — the store is kept forever, so set this on busy
    // deployments unless you need the full audit trail.
    completedAssignmentsRetentionMs?: number; // Default: undefined (keep forever)

    // Who wins when several users are eligible for the same assignment
    // during bulk matching (matchUsersAssignments() with no userId)?
    //   'first-come'  - whoever's claim reaches Redis first (fastest; the
    //                   winner is arbitrary). This is the default.
    //   'best-match'  - the highest-scoring eligible user, deterministically.
    //   'balanced'    - best match wins, but near-ties (within ~5% of the
    //                   typical candidate score) go to whoever has less work.
    //   'spread-work' - work is spread as evenly as skills allow: every
    //                   assignment already on someone's plate discounts their
    //                   next bid by half the typical candidate score, so
    //                   finishing work fast never just means drowning in more.
    // The numbers behind 'balanced' / 'spread-work' are derived automatically
    // from each matching pass's candidate scores - nothing to calibrate. Both
    // also include an hourly guardrail by default: nobody receives at more
    // than double the team's average grant rate (see fairnessMaxPerWindow).
    // Switchable at runtime via `setFairness(mode)` / `getFairness()`, or
    // retune every fairness knob below at once with
    // `setFairnessConfig(partial)` / `getFairnessConfig()` - changes apply on
    // the next `matchUsersAssignments()` call, no reconstruction needed.
    fairness?: 'first-come' | 'best-match' | 'balanced' | 'spread-work'; // Default: 'first-come'

    // Hard ceiling on how many assignments one user can be *granted* within a
    // rolling time window, in any fairness mode other than 'first-come'. The
    // backlog cap alone can't protect diligent users: fast workers keep
    // freeing backlog slots and keep winning, so speed is rewarded with ever
    // more work. This counts grants regardless of how quickly they were
    // cleared; at the cap, contested work spills to the next-best eligible
    // user (or stays queued) until the window rolls. Workflow-targeted
    // assignments are direct handoffs and bypass the cap.
    // Left undefined, the 'balanced' / 'spread-work' presets default it to a
    // team-relative guardrail - max(maxUserBacklogSize, 2x the team's average
    // grants in the window), recomputed each pass, so it adapts to any
    // deployment's volume. Set a number to pin the ceiling, or Infinity to
    // disable the window cap entirely.
    fairnessMaxPerWindow?: number; // Default: auto for 'balanced'/'spread-work', else disabled
    fairnessWindowMs?: number; // Default: 3600000 (one hour)

    // Expert alternative to `fairness` - the raw switches behind it:
    // enableFairTiebreaker is exactly `fairness: 'best-match'` when true;
    // fairnessLoadPenalty is an absolute score discount per assignment
    // already on a user's backlog, and fairnessTieBand treats scores in the
    // same band-sized bucket as tied (less-loaded user wins). Explicit values
    // here override what a `fairness` preset would derive. Runtime toggles:
    // `setFairTiebreaker(enabled)` / `isFairTiebreakerEnabled()`.
    enableFairTiebreaker?: boolean; // Default: false
    fairnessLoadPenalty?: number; // Default: 0 (off)
    fairnessTieBand?: number; // Default: 0 (off)

    // A custom function to determine the priority of an assignment.
    // The function receives assignment objects (or undefined if fewer than 3 are available for comparison)
    // and should return a numerical priority score. Higher scores mean higher priority.
    // Useful if `createdAt` is not sufficient for your prioritization needs.
    prioritizationFunction?: (...args: (Assignment | undefined)[]) => Promise<number>;

    // A custom function to determine if a user can be matched with an assignment
    // and the "cost" or "rank" of that match.
    // If `enableDefaultMatching` is true, this function can augment or override the default logic.
    // If `enableDefaultMatching` is false, this function is solely responsible for matching.
    // It should return a tuple: `[matchRank, userCost]`.
    // Important: built-in hard-veto/positive-only weighted semantics apply to the
    // built-in matcher. With a custom matchingFunction, you own final scoring logic.
    // - `matchRank`: A score indicating the quality of the match (higher is better).
    //                A rank of 0 or less means no match.
    // - `userCost`: A score indicating the "cost" of assigning this task to this user
    //               (lower is better, used for tie-breaking among users).
    matchingFunction?: (
        user: User,
        assignmentTags: string[],
        assignmentPriority: number | string, // This is the score from prioritizationFunction or createdAt
        assignmentId?: string,
    ) => Promise<[number, number]>;

    // ========== Decision Traces & Explainability ==========

    // Persist an auditable decision trace for every routing decision. Each
    // matched assignment gets a MatchDecisionTrace — winner, arbitration mode,
    // and every evaluated candidate with score breakdown and exclusion
    // reasons — appended to a capped Redis stream and queryable via
    // getDecisionTraces(). Captured while the decision happens, never
    // reconstructed. Toggleable at runtime via setDecisionTraces(enabled).
    enableDecisionTraces?: boolean; // Default: false

    // Retention (entry count) for the trace stream, and how many candidates
    // are stored per trace (the chosen candidate is always kept).
    decisionTraceMaxEntries?: number; // Default: 1000
    decisionTraceMaxCandidates?: number; // Default: 25

    // Real-time hook invoked with each MatchDecisionTrace as decisions are
    // made (e.g. push to a websocket). Setting it activates capture even when
    // enableDecisionTraces is false — traces then stream to the callback only
    // and are not persisted. Callback errors never affect matching.
    onMatchDecision?: (trace: MatchDecisionTrace) => void;

    // ========== Reinforcement Learning Options ==========

    // Enable the adaptive learning layer (contextual bandit re-ranking).
    enableLearning?: boolean; // Default: false

    // SGD learning rate for online model updates.
    learningRate?: number; // Default: 0.1

    // Epsilon-greedy exploration rate in [0, 1]. With this probability, a random
    // jitter is added to candidate scores so the model keeps gathering data on
    // under-served candidates.
    learningExplorationRate?: number; // Default: 0.05

    // Shadow mode: record decisions and learn from outcomes, but never alter
    // ranking. Useful for safely evaluating the model before going live.
    learningShadowMode?: boolean; // Default: false

    // Multiplier applied to the predicted reward when re-ranking candidates.
    // Higher values let the learned model dominate over base priority.
    learningBoostFactor?: number; // Default: 1

    // Override rewards per lifecycle outcome (merged with defaults):
    // { accept: 0.3, complete: 1, reject: -0.6, expire: -0.3, fail: -0.8 }
    learningRewards?: Partial<Record<'accept' | 'complete' | 'reject' | 'expire' | 'fail', number>>;

    // Custom feature extractor. Defaults to tag-match, normalized skill-weight,
    // tag-overlap-ratio and embedding-similarity features.
    learningFeatureExtractor?: (user: User, assignment: { id: string; tags: string[] }) => Record<string, number>;

    // Reference duration (ms) used to normalize the `sla:tightness` feature
    // emitted by the default extractor for assignments with sla.completeWithinMs.
    learningSlaTightnessReferenceMs?: number; // Default: 3600000 (1 hour)

    // TTL for stored decision contexts in ms.
    learningDecisionTtlMs?: number; // Default: 604800000 (7 days)

    // Weights applied to named external feedback signals when computing rewards.
    // Signals not listed here default to weight 1. Negative weights turn a
    // signal into a penalty (e.g. { errorRate: -2 }).
    learningSignalWeights?: Record<string, number>;

    // TTL for archived episodes awaiting late external feedback in ms.
    learningFeedbackTtlMs?: number; // Default: 604800000 (7 days)

    // SGD update rule. 'normalized' bounds the step by the active feature
    // vector's squared norm; 'raw' is the pre-1.16 rule and diverges once
    // several features fire at once.
    learningUpdateMode?: 'normalized' | 'raw'; // Default: 'normalized'

    // L2 weight decay applied per update.
    learningL2?: number; // Default: 0

    // Clip on the L2 norm of a single update.
    learningMaxUpdateNorm?: number; // Default: 1

    // Absolute cap on any single learned weight.
    learningMaxWeightMagnitude?: number; // Default: 100

    // Cap on the learning layer's contribution to effective priority.
    // Unset = unbounded (pre-1.16 behaviour).
    learningMaxBoost?: number;

    // What counts as one observation for per-tag evidence.
    learningRewardAccounting?: 'per-event' | 'per-attempt'; // Default: 'per-event'

    // Candidate selection policy. 'epsilon-greedy' logs a recoverable
    // propensity on every committed decision; 'jitter' is the pre-1.16
    // unlogged score noise.
    learningExplorationPolicy?: 'greedy' | 'epsilon-greedy' | 'jitter'; // Default: 'jitter'

    // Random source for exploration; inject for reproducible runs.
    learningRng?: () => number; // Default: Math.random

    // Opt-in multi-target reward modelling.
    learningTargets?: {
        targets?: Array<'acceptance' | 'successGivenAcceptance' | 'quality'>;
        acceptanceWeight?: number;
        successWeight?: number;
        qualityWeight?: number;
        learningRates?: Partial<Record<'acceptance' | 'successGivenAcceptance' | 'quality', number>>;
        systemFaultCountsAsFailure?: boolean; // Default: false
    };

    // Emit observed worker-performance features (batch-loaded once per
    // worker per matching pass, never per candidate).
    enableLearningPerformanceFeatures?: boolean; // Default: false
    learningPerformancePriorStrength?: number; // Default: 5

    // Maximum age of an outcome/feedback event relative to its attempt.
    // Later events are rejected and counted as staleEvents.
    learningMaxFeedbackAgeMs?: number; // Default: learningFeedbackTtlMs

    // Validation bounds applied before anything is written.
    learningMaxSignalMagnitude?: number; // Default: 1e6
    learningMaxRewardMagnitude?: number; // Default: 100
};
```

## Decision Traces & Explainability

Every routing decision the engine makes can be explained and audited. Two
complementary tools cover the two questions teams actually ask:

- **"Why did this assignment go to that user?"** — decision traces, the
  auditable record captured _while the decision was made_.
- **"Who could receive this assignment right now, and why (not)?"** —
  `explainMatch()`, an on-demand evaluation against live state.

### Decision traces (`enableDecisionTraces`)

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableDecisionTraces: true,
    // Optional real-time feed (dashboards, sockets). Works even without
    // persistence: setting only onMatchDecision streams traces to the
    // callback and skips storage.
    onMatchDecision: (trace) => io.emit('match:decision', trace),
});

await matcher.matchUsersAssignments();

const [trace] = await matcher.getDecisionTraces({ assignmentId: 'ticket-42' });
// {
//   assignmentId: 'ticket-42',
//   chosenUserId: 'alice',
//   mode: 'best-match',            // how the winner was arbitrated
//   matchedAt: 1752404712345,
//   candidates: [
//     { userId: 'alice', eligible: true,  chosen: true,  score: 101,
//       effectivePriority: 201, reasons: [ { kind: 'tagWeight', tag: 'english', weight: 100 }, ... ] },
//     { userId: 'bob',   eligible: false, chosen: false, score: 0,
//       effectivePriority: 0,   reasons: [ { kind: 'veto', tag: 'german', pattern: 'german' } ] },
//   ],
// }
```

Traces are appended to a capped Redis stream (`decisionTraceMaxEntries`,
default 1000), so the audit record survives restarts and is shared across
replicas. Query with `getDecisionTraces({ assignmentId?, userId?, limit? })`
(newest first), wipe with `clearDecisionTraces()`, and toggle at runtime with
`setDecisionTraces(enabled)` / `isDecisionTracesEnabled()`.

What a trace contains:

- The winner, the arbitration mode (`'first-come'`, `'best-match'`,
  `'balanced'`, `'spread-work'`, `'direct'` for per-user matching, or
  `'workflow'` for deterministic workflow-targeted handoffs), and the moment
  of the decision.
- Every candidate evaluated in that matching pass with its full score
  breakdown: matched routing weights (`tagWeight`, wildcard `pattern`
  included), the implicit `defaultTag`, `tagOverlap` for unweighted users,
  `geoDistance`/`geoBoost`, `learningBoost` (with `shadowMode` flag),
  `skillThreshold` failures, `cidrMismatch`, and `customScore` when a custom
  `matchingFunction` owns scoring.
- Users excluded before scoring by hard rules — zero-weight `veto` entries,
  `assignmentVeto` (the assignment's `vetoedUsers`), and `rejectedPreviously` —
  are struck out in the trace even though the Redis-side prefilter kept them
  out of the scoring pass entirely.
- Where a veto came from. For users carrying `learnedRoutingWeights`, each
  `veto` reason also has `source: 'learned' | 'manual'`, separating a veto the
  automatic routing-weight sync synthesized from one an operator configured.
  The field is absent for users with no learned weights, so traces are
  unchanged when the learning layer is off.

Honesty notes: in the default `'first-come'` mode users evaluate and claim in
parallel, so a candidate whose snapshot read happened after the winner's claim
may be absent from the trace (they never evaluated it); fair modes evaluate
everyone read-only first and always capture the full candidate field. Reason
kinds are additive over time — treat unknown `kind` values as forward
compatibility, not errors.

### On-demand explanations (`explainMatch`)

```typescript
const explanation = await matcher.explainMatch('ticket-42');
// { assignmentId, status: 'queued' | 'pending' | 'accepted' | 'completed' | 'not_found',
//   ownerId, evaluatedAt, candidates: MatchCandidateTrace[] }

// Or scope to specific users:
await matcher.explainMatch('ticket-42', { userIds: ['alice', 'bob'] });
```

`explainMatch()` recomputes eligibility for every user (or the given ids)
against the assignment's current state using the engine's own scoring
internals — vetoes, prior rejections, backlog, thresholds, CIDR, geo, weight
breakdown, learning influence — and works in any lifecycle state (for matched
assignments the current owner is flagged `chosen`). Because it evaluates _now_
rather than at decision time, use it for support tooling and dry-runs
("who would get this?"), and decision traces for the compliance-grade record.

### Hypothetical preview (`previewMatch`)

`previewMatch()` answers "who would receive this assignment if I created it?"
without persisting or claiming anything. It uses the same scoring and hard
rules as real matching, so the ranking mirrors what `explainMatch()` would
report after the assignment is added.

```typescript
const preview = await matcher.previewMatch(
    { tags: ['english', 'billing'], priority: 100, skillThresholds: { english: 50 } },
    // optional: restrict to specific users
    { userIds: ['alice', 'bob'] },
);
// { tags, priority, evaluatedAt, candidates: MatchCandidateTrace[] }
```

Use it for autosuggestion UIs: render the ranked best-fit workers with score
breakdowns and blocked reasons before the operator commits the task.

### Pre-flight checks (`lintAssignment` / `checkAssignmentReadiness`)

The runtime is deliberately forgiving — an invalid schedule window or an
unusable SLA object normalizes away silently, and an assignment whose tags no
user carries just sits queued. The pre-flight helpers surface those problems
_before_ `addAssignment()`:

```typescript
import { lintAssignment } from 'assignment-user-matcher';

// Pure and Redis-free — run it host-side, in a form validator, anywhere:
const issues = lintAssignment(assignment, { matchExpirationMs: 60000 });
// [{ severity: 'error', code: 'schedule-window-inverted', message: '...' }, ...]

// Live version: same lint plus checks against the current user pool:
const report = await matcher.checkAssignmentReadiness(assignment);
// {
//   issues,             // lint + live findings, each { severity, code, message, tag? }
//   eligibleUserCount,  // who could take it right now (same rules as previewMatch)
//   uncoveredTags,      // tags no active (non-paused) user can serve
//   evaluatedAt,
// }
```

Static codes (from `lintAssignment`): `no-tags`, `schedule-window-inverted`,
`schedule-ignored`, `schedule-window-elapsed`, `schedule-notbefore-past`,
`offer-window-tight` (offer window shorter than one response deadline),
`schedule-notafter-shadowed-by-sla-ttl` (the freshness TTL fires first, so
`notAfter` never does), `sla-ignored`, `escalation-ignored`.

Live codes (from `checkAssignmentReadiness`): `duplicate-id` (re-adding keeps
the original wait/TTL clocks), `tag-uncovered` (per tag; paused users don't
count as coverage), `no-eligible-users`.

Tag coverage mirrors the matching semantics exactly: users with
`routingWeights` cover a tag when the effective weight is positive (wildcards
honored, weight `0` is a veto); users without them cover it via tag
membership. `checkAssignmentReadiness()` is read-only and safe to call from
dashboards or admission pipelines; it never claims or records anything.

### Queue overlook (`auditQueue`)

When work sits in the queue and nobody knows why, `auditQueue()` answers both
of the usual questions at once — _who is blocked by what_ and _is anything
sweeping the clocks_:

```typescript
const audit = await matcher.auditQueue({ minWaitingMs: 60_000 });
// {
//   scanned,          // queued assignments examined (longest-waiting first)
//   entries: [{       // assignments nobody can take right now
//     assignmentId, tags, waitingMs,
//     eligibleUserCount,          // 0 for stuck work
//     uncoveredTags,              // tags no active user can serve
//     blockers,                   // reason -> blocked-user count, e.g.
//   }],               //   { backlogFull: 3, paused: 1, rejectedPreviously: 1, noTagMatch: 4 }
//   sweepBacklog: {   // past-due entries sitting unswept in each deadline index
//     scheduleActivations, scheduleMisses,
//     responseDeadlines, completionDeadlines, slaExpiries,
//   },
// }
```

- **`blockers`** tallies the hard-rule reasons across ineligible users, using
  the same `MatchTraceReason` kinds as decision traces (`paused`,
  `backlogFull`, `rejectedPreviously`, `assignmentVeto`, `cidrMismatch`,
  `skillThreshold`, `geoDistance`, …). Users excluded by plain tag/weight
  mismatch are counted as `noTagMatch`.
- **`sweepBacklog`** counts deadline-index entries already in the past.
  Values that stay nonzero across calls are the classic "assignments never
  process" cause: no maintenance tick is running — start one with
  `startMaintenance()` or call `runMaintenanceOnce()` from your own tick.
- Note that with `enableDefaultMatching` on (the default), tag-mismatched
  work is still routable through the injected `default` tag, so stuckness
  then comes from paused users, full backlogs, vetoes, and rejections rather
  than tag gaps.
- Options: `limit` (default 100, longest-waiting first), `minWaitingMs`
  (ignore fresh work), `includeHealthy` (also report matchable entries).
  Read-only, O(scanned × users) — a diagnostic, not a hot path.

## Adaptive Matching with Reinforcement Learning

The matcher includes an opt-in, Redis-backed contextual bandit that learns from
assignment outcomes and re-ranks candidates automatically. Hard matching rules
(tags, `routingWeights`, vetoes, CIDR, `skillThresholds`) always apply first —
the learned model only reorders assignments that are already eligible.

How it works:

1. When a user is matched, a sparse feature vector is extracted for each
   eligible candidate (tag matches, normalized skill weights, tag overlap, and
   optional `embedding` cosine similarity if both user and assignment carry an
   `embedding: number[]` field).
2. Candidates are ranked by `combinedPriority + boostFactor * predictedReward`
   and selected by an explicit policy.
3. **The decision context is committed only for the worker who actually wins
   the claim**, under a unique attempt id. Lifecycle outcomes (`accept`,
   `complete`, `reject`, `expire`, `fail`) feed rewards back into that attempt
   via online SGD updates — fully automatic, no training pipeline needed.

Four invariants are worth knowing, because they are what the layer's
correctness rests on:

- **One decision per committed attempt.** A candidate that was scored but lost
  the assignment — to another worker under fair arbitration, or to another
  process at the claim gate — leaves no decision behind. An assignment that is
  rejected and rematched opens a *second, independent* attempt with its own id;
  feedback for the first can never reach the second.
- **Ingestion is idempotent.** Every outcome and every feedback call is gated
  on the attempt's applied-event set, so a redelivered message applies once and
  counts as evidence once. `getLearningStats()` reports `duplicateEvents`,
  `staleEvents`, `orphanEvents`, `supersededEvents`, `ambiguousFeedback` and
  `invalidFeedback` so rejected traffic is visible rather than silent.
- **Missing means unknown.** Absent quality feedback trains nothing; it is
  never a zero label. An empty or malformed signal map is rejected whole.
- **Manual assignment never trains.** `assignToUser()` records no decision.

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    // Start safe: observe without affecting ranking
    learningShadowMode: true,
    // Optional reward shaping
    learningRewards: { complete: 2, reject: -1 },
});

// ... normal addUser / addAssignment / matchUsersAssignments usage ...

// Inspect what the model has learned
const model = await matcher.getLearningModel(); // { 'tag:english': '0.42', ... }
const stats = await matcher.getLearningStats(); // { decisions, rewards, totalReward, averageReward }

// Manual reward shaping for a matched assignment (e.g. CSAT score arrived later)
await matcher.recordLearningReward('assignment-123', 1.5);

// Start over
await matcher.resetLearningModel();
```

### Feeding External Data into the Model

Matchmaking quality signals often arrive after an assignment is closed — QA
audits, accuracy reviews, customer satisfaction scores, handle-time analysis.
The learning layer supports three external feed paths:

**1. Named feedback signals (post-processing per assignment).** When an
assignment reaches a terminal state, its feature context is archived as an
_episode_ (kept for `learningFeedbackTtlMs`). External pipelines can attribute
late signals to it at any point within that window:

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    // Reward = sum(signalValue * signalWeight); unlisted signals default to 1
    learningSignalWeights: {
        accuracy: 2, // accuracy audits matter most
        csat: 1, // customer satisfaction
        handleTimePenalty: -0.5, // longer handling reduces reward
    },
});

// ...assignment is matched, accepted, completed...

// Hours/days later, the QA pipeline reports back:
await matcher.recordLearningFeedback('assignment-123', {
    accuracy: 0.95,
    csat: 0.8,
    handleTimePenalty: 0.3,
});
// reward = 0.95*2 + 0.8*1 + 0.3*-0.5 = 2.55, applied to the episode's features
```

**2. Raw reward shaping.** `recordLearningReward(assignmentId, reward)` applies
an explicit numeric reward against an assignment's decision context when you
want full control over the value.

**3. Offline batch training.** `trainLearningSamples(samples)` updates the
model directly from raw `(features, reward)` pairs — no live decision context
needed. Use it to bootstrap the model from historical data or to run scheduled
imports from a data warehouse:

```typescript
await matcher.trainLearningSamples([
    { features: { bias: 1, 'tag:english': 1, 'skill:english': 0.8 }, reward: 1.2 },
    { features: { bias: 1, 'tag:billing': 1 }, reward: -0.4 },
]);
```

Feature names are arbitrary strings — as long as your
`learningFeatureExtractor` produces the same names at match time, externally
trained weights apply immediately to live ranking.

Rollout recommendation: enable with `learningShadowMode: true` first, watch
`getLearningStats()` and `getLearningModel()`, then flip shadow mode off and
tune `learningBoostFactor` / `learningExplorationRate` for your workload. For
domain-specific setups (custom embeddings, business features), supply a
`learningFeatureExtractor`.

### Stable Model Updates

The SGD rule is `learningUpdateMode`, and it defaults to `'normalized'`:

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningUpdateMode: 'normalized', // default since 1.16
    learningL2: 0, // optional weight decay
    learningMaxUpdateNorm: 1, // clip on a single update
    learningMaxWeightMagnitude: 100, // absolute cap on any weight
    learningMaxBoost: 60, // cap the learning layer's ranking influence
});
```

The pre-1.16 rule (`'raw'`, `w += lr * error * x`) is unstable once several
features fire at once: with `k` active unit features every step overshoots by a
factor of `k`, so the error alternates sign and grows. Twenty-two unit features
at the default learning rate is already enough — 40 identical reward-1 samples
drive the prediction past -1000 instead of toward 1. Normalizing by the active
vector's squared norm makes one step land on the observation regardless of how
many features fired, and the norm clip and weight cap bound the rest.
`'raw'` remains available for reproducing an existing model, and is not
recommended for new deployments.

`learningMaxBoost` matters for a different reason: predicted reward and
business priority are in unrelated units, so an unbounded boost can silently
outrank an operator's priority or an SLA band. It is unset by default (the
pre-1.16 behaviour); set it, and the learned contribution can never leave
`±learningMaxBoost`.

Model reads are bounded too — an update reads only the weights it touches
(`HMGET` over the active features), not the whole model hash, so cost is
`O(active features)` regardless of how large the feature space grows. Batch
imports via `trainLearningSamples()` process in bounded chunks and re-read per
chunk, so a long import cannot keep accumulating against a snapshot the live
model has already moved away from.

### Modelling Acceptance and Success Separately

A single scalar reward cannot distinguish a worker who takes everything and
finishes nothing from one who is selective and reliable — both can average out
the same. `learningTargets` models them apart:

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningTargets: {
        targets: ['acceptance', 'successGivenAcceptance', 'quality'],
        successWeight: 1,
        qualityWeight: 0.5,
        learningRates: { quality: 0.05 },
        // A platform-side cancellation is not the worker's failure. Default
        // false: it produces no success label at all.
        systemFaultCountsAsFailure: false,
    },
});
```

Each target gets its own model hash and its own label timing:

| Target | Denominator | Label | Missing data |
| --- | --- | --- | --- |
| `acceptance` | one per committed attempt | 1 on accept; 0 on reject or **pre-acceptance** response expiry | attempt still open |
| `successGivenAcceptance` | one per *accepted* attempt | 1 on complete; 0 on fail or **post-acceptance** expiry | no label when flagged a system fault |
| `quality` | one per quality observation | normalized `quality` signal, clamped to [0, 1] | **no update at all** |

Component predictions come back as calibrated probabilities; the combined
utility is `acceptanceWeight * P(accept) + P(accept) * (successWeight *
P(success|accept) + qualityWeight * E[quality])` and is deliberately *not*
presented as a probability. Corrections revise a label rather than adding a
second one — see `learningRewardAccounting` below.

When `learningTargets` is unset (the default) the layer keeps the legacy
behaviour: one model, one scalar reward per lifecycle outcome.

### Evidence Accounting

`learningRewardAccounting` decides what one "observation" means for the per-tag
statistics that drive automatic routing weights:

- `'per-event'` (default, legacy): every lifecycle outcome and every feedback
  call is one observation. An attempt that accepts, completes and then receives
  a CSAT score counts three times.
- `'per-attempt'`: one observation per committed attempt, written at the
  terminal outcome with the attempt's accrued reward. Late feedback *revises*
  that observation instead of adding another.

`'per-attempt'` is what the veto sample floors actually assume — they are
supposed to count independent attempts, and correlated events inflating the
count is how a tag reaches a "20 sample" bar on five real assignments.

### Explicit Exploration and Propensity Logging

`learningExplorationPolicy` selects how candidates are picked:

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningExplorationPolicy: 'epsilon-greedy',
    learningExplorationRate: 0.05,
    learningRng: seededRng(1234), // inject for reproducible tests
});

const decision = await matcher.getLearningDecision('assignment-123');
// { decisionId, userId, features, predictedReward, propensity, policy, candidateCount, ... }
```

Under `'epsilon-greedy'`, selecting `k` candidates is modelled as `k`
sequential conditional choices over the admissible set that remains, and each
committed decision records the probability it was actually chosen with. For a
unique leader among `K` admissible candidates that probability is
`1 - ε + ε/K`, and every other candidate's is `ε/K`. That number is what
off-policy evaluation (IPS, doubly-robust) needs; the legacy `'jitter'` policy
— independent random noise added to the score — perturbs the ranking without
any recoverable probability, so the logs it produces cannot be evaluated
offline at all. `'jitter'` remains the default for backward compatibility.

One honest caveat: under `fairness: 'best-match'` and the other fair modes,
allocation is a constrained *joint* decision across workers, and a per-worker
epsilon-greedy probability is not the probability of the final allocation.
Treat fair-mode logs as needing an allocation-aware estimator or a randomized
online comparison, not as ordinary contextual-bandit logs.

Exploration never widens eligibility: it chooses among candidates that already
passed every hard rule, and it is disabled entirely in shadow mode.

### Worker Performance Features

By default the feature vector is assignment-side plus the worker's *declared*
tags, which means two workers with identical declared tags produce identical
features for a given assignment — the model has nothing to learn about *who*
should get the work. `enableLearningPerformanceFeatures` adds observed
behaviour:

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    enableLearningPerformanceFeatures: true,
    learningPerformancePriorStrength: 5, // shrinkage toward the team prior
});
```

New features: `perf:accept`, `perf:success`, `perf:support`, `perf:speed`,
`perf:speedKnown`, `load:backlog`, `difficulty`, `complexity`,
`sla:remainingFraction`, `sla:urgency`, and the interactions
`x:urgency*speed`, `x:difficulty*success`, `x:load*complexity`.

Two properties are load-bearing:

- Rates are **shrunk toward the team prior**, so a worker with no history reads
  as average rather than as a failure. An unjustifiably pessimistic estimate is
  how a new worker starves.
- Aggregates are **batch-loaded once per worker per matching pass** — one
  `HGETALL` — never per candidate. Enabling the feature does not add a Redis
  round trip per candidate pair.

`sla:urgency` uses time actually remaining at the decision timestamp, not the
originally configured duration: an assignment with a one-hour deadline that has
been queued 55 minutes is urgent, and the configured duration alone cannot say
so.

Enabling this option also stamps an accept timestamp on non-SLA assignments
(handling time has to be measured from something). With it off, stored JSON is
unchanged.

### Automatic Routing Weights (RL-Generated Tags/Weights)

Beyond re-ranking, the learning layer can fully automate `routingWeights`
authoring. With `enableAutoRoutingWeights: true` (requires `enableLearning`),
every reward observation also updates per-user, per-tag statistics in Redis
(atomic `HINCRBY`/`HINCRBYFLOAT` — O(tags) per outcome, no scans, no
read-modify-write), and weights are synthesized on demand with a configurable
bandit policy.

**Policies:**

- `policy: 'ucb1'` (default): high-mean tags get high weights, an exploration
  bonus favors less-sampled tags, and bad tags are hard-vetoed at weight `0`.
- `policy: 'confidence'`: uses upper-confidence-bound for the weight and for
  the veto decision — a tag is hard-vetoed only when the whole confidence
  interval sits below the threshold, so uncertainty alone never excludes.
- `policy: 'thompson'`: samples from the per-tag posterior when mapping to a
  weight; the veto decision uses the deterministic mean, never the draw.

**Uncertainty.** Before 1.16 the standard error came straight from the observed
moments, so five identical observations produced variance 0 and a
zero-width confidence interval — total certainty from five samples, on which
the `'confidence'` policy would hard-veto. The posterior is now prior-backed:

```typescript
autoRoutingWeights: {
    policy: 'confidence',
    rewardModel: 'gaussian', // or 'bernoulli' for genuine success indicators
    rewardRange: [-1, 1], // sets the default prior variance and the Bernoulli mapping
    priorStrength: 2, // pseudo-observations of prior weight
    // priorVariance defaults to ((max - min) / 4) ** 2
}
```

`'bernoulli'` uses a Beta-Bernoulli posterior over rewards rescaled into
[0, 1], with Thompson draws taken from the Beta itself. It is only sound when
the reward genuinely is a success indicator — applying Bernoulli formulas to
arbitrary continuous rewards is the error the explicit option exists to make
visible rather than implicit.

**Evidence is counted in independent attempts, not observations.** With
`decayHalfLifeMs` set, the decayed weight sum is *not* a sample size: scaling
every weight equally leaves it looking like fewer observations than were
actually seen. `LearningTagStat` therefore carries `attempts` (never decayed)
and `effectiveSampleSize` (the Kish quantity `sum(w)² / sum(w²)`), and sample
floors are judged against those, in that order of preference. Likewise
`minTotalSamples` is judged against distinct attempts, so one assignment
carrying five tags is one attempt, not five.

**Explainability.** `explainLearnedRoutingWeights(userId)` returns the same
synthesis with its reasoning attached — posterior estimate and uncertainty,
credible bounds, independent attempts, effective sample size, last
observation, decay settings, and for a lapsed veto when it will be reassessed:

```typescript
const rows = await matcher.explainLearnedRoutingWeights('user-1');
// [{ tag: 'english', weight: 0, decision: 'veto', estimate: -0.71,
//    uncertainty: 0.12, lowerBound: -0.95, upperBound: -0.47,
//    attempts: 34, lastObservedAt: 1757... }, ...]
```

`decision` is one of `'veto' | 'scored' | 'prior' | 'cooldown' |
'insufficient-evidence' | 'unobserved'`. The pure form is exported as
`explainRoutingWeights`.

**Guardrails (all opt-in):**

- `minSamplesForVeto`: a learned weight-0 requires this many independent
  attempts, preventing a few bad rolls from silently starving a user.
  Defaults to `minSamples` (5); 20 is a reasonable production floor. **Since
  1.16 this floor applies to learned and manually-weighted tags alike** — a
  hard veto removes eligibility outright, and that consequence does not depend
  on where the previous weight came from. Set it and the bar rises for every
  tag; leave it unset and nothing changes.
- `vetoCooldownMs`: how long after a tag's last observation a learned veto
  lapses and the tag returns at `priorWeight` for reassessment. A veto with no
  recovery path is permanent exclusion, and a worker who improved — or whose
  bad run was circumstantial — can never be re-evaluated. Prefer setting this
  over relying on decay alone.
- `rewardModel` / `rewardRange` / `priorVariance` / `priorStrength`: the
  posterior over a tag's mean reward. See "Uncertainty" below.
- `maxDeltaPerSync`: clamps how far any single learned weight can move per
  sync, avoiding oscillation.
- `minTotalSamples`: skip users whose total evidence is still too thin.
- `decayHalfLifeMs`: exponentially decay older observations so stale history
  cannot veto a user's improving skills. The decay is applied at write time
  (old mass is rescaled before each new outcome lands, atomically in Redis)
  and continues on read, so a single fresh outcome re-weights the stats
  toward recent behavior instead of resurrecting decayed history.
- `terminalOnlyTagStats`: when `true`, only terminal outcomes
  (complete/reject/expire/fail plus manual rewards/feedback) feed tag stats;
  the non-terminal `accept` update is skipped.

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    enableAutoRoutingWeights: true,
    // Optional: run the guarded sync automatically on one replica.
    // A Redis lock prevents overlapping runs across replicas.
    autoRoutingWeightsSyncIntervalMs: 60_000,
    autoRoutingWeights: {
        minSamples: 5, // observations before a tag's stats are trusted
        vetoThreshold: -0.5, // mean reward at/below this → weight 0 (hard veto)
        maxWeight: 100, // top of the synthesized weight scale
        explorationBonus: 0.5, // UCB coefficient; higher → more exploration
        priorWeight: 50, // optimistic weight for unexplored tags
        policy: 'confidence', // or 'ucb1' (default) / 'thompson'
        confidenceZ: 1.5, // z-score for the confidence policy
        minSamplesForVeto: 20, // stricter bar for overriding manual weights
        maxDeltaPerSync: 25, // max change per sync on a single weight
        decayHalfLifeMs: 24 * 60 * 60 * 1000, // 24h half-life
        terminalOnlyTagStats: false,
    },
});

// Inspect what the system has learned for a user
const stats = await matcher.getLearnedTagStats('user-1');
const preview = await matcher.getLearnedRoutingWeights('user-1');

// Apply learned weights to one user, or to all tracked users (e.g. on a
// periodic job). Manual routingWeights entries for tags the learner has no
// data on are preserved; pass { overrideManual: true } to replace them.
await matcher.syncLearnedRoutingWeights('user-1');
await matcher.syncLearnedRoutingWeights(); // all tracked users

// Include exploration priors for known tags the user has never seen:
await matcher.syncLearnedRoutingWeights('user-1', { includeUnexploredTags: true });

// Preview the would-be map without writing anything:
const wouldBe = await matcher.syncLearnedRoutingWeights('user-1', { dryRun: true });

// Undo the last sync if the result looks wrong:
await matcher.revertLearnedRoutingWeights('user-1');
```

Two safety properties of the sync: a user's **declared tags always stay
matchable** — a declared tag with no recorded outcomes gets the exploration
prior rather than silently dropping out of the installed `routingWeights` —
and the pre-sync state is always restorable: a user who had no
`routingWeights` at all is snapshotted as such (`routingWeightsSnapshot:
null`), so `revertLearnedRoutingWeights()` returns them to plain tag-based
matching.

Synthesis happens outside the matching hot path — matching itself reads the
user's stored `routingWeights` exactly as before, so the per-match cost is
unchanged. The last-applied learned map is stored on the user as
`learnedRoutingWeights` for observability, the previous map is snapshotted as
`routingWeightsSnapshot` for rollback, and `resetLearningModel()` clears all
per-user tag statistics. The pure synthesis function is exported as
`synthesizeRoutingWeights` for offline pipelines.

Run the regression gate to validate a new policy before shipping it:

```bash
./node_modules/.bin/ts-node benchmark-weights.ts
```

### RL Scalability & Redis Constraints

The RL layer adds controlled overhead: decision recording, outcome archival,
and weight updates. Because these operations are write-heavy and per-assignment,
scalability depends primarily on Redis memory, write throughput, and feature
cardinality — not on learning math itself.

#### Redis Workload Breakdown

Each matched assignment now costs:

1. **Decision record** (live): ~300 bytes for features + metadata; expires in 7 days (configurable).
2. **Episode archive** (terminal): ~400 bytes; kept until feedback arrives, expires in 7 days.
3. **Model updates**: One hash increment per feature per outcome (typically 5–15 features).
4. **Stats tracking**: Shared atomic increments.

Matching a single assignment typically involves:

- 1–2 Redis reads (model + candidate details).
- 3–5 Redis writes per matched assignment (decision, model updates, stats).
- Pipelined to reduce round trips.

#### Memory Estimation

Assume:

- **Small deployment**: 10 users, 1,000 live assignments, ~8 features per assignment.

    - Model: ~8 KB (8 features × 1 KB per weight + overhead).
    - Decisions: ~300 KB (1,000 × 300 bytes).
    - Overhead: ~500 KB for indices and stats.
    - **Total: ~1 MB**. No scaling issues with standard Redis (safe at anything).

- **Medium deployment**: 100 users, 100,000 live assignments, ~15 features.

    - Model: ~15 KB.
    - Decisions: ~30 MB (100,000 × 300 bytes).
    - Episodes archived: ~10 MB (depends on feedback delay; typically 10% of live at any moment).
    - Overhead: ~5 MB.
    - **Total: ~50 MB**. Easily within Redis limits; watch growth over weeks.

- **High-throughput deployment**: 1,000 users, 1,000,000 live assignments, ~20 features, exploration enabled.
    - Model: ~20 KB.
    - Decisions: ~300 MB (1,000,000 × 300 bytes).
    - Episodes: ~100 MB.
    - Overhead: ~50 MB.
    - **Total: ~450 MB**. Manageable with a 2–4 GB Redis instance; requires TTL discipline.

#### Configuration Guidelines

**Small (10–50 users, <10K assignments/day):**

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningShadowMode: true, // Observe first; no ranking impact
    learningRate: 0.1,
    learningExplorationRate: 0, // No exploration overhead
    learningDecisionTtlMs: 604800000, // 7 days
    learningFeedbackTtlMs: 604800000, // 7 days
});
// Safe: no performance issues. Monitor model size weekly.
```

**Medium (50–500 users, 10K–100K assignments/day):**

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningShadowMode: false,
    learningRate: 0.05, // Slower learning for stability
    learningExplorationRate: 0.02, // 2% of matches explore randomly
    learningBoostFactor: 50, // Moderate impact on ranking
    learningDecisionTtlMs: 259200000, // 3 days (balance TTL vs memory)
    learningFeedbackTtlMs: 259200000,
    learningSignalWeights: { accuracy: 1, csat: 0.5, errorRate: -1 },
});
// Recommended: batch external feedback imports off-peak.
// Monitor: Redis memory growth, write latency, decision key count.
```

**High-throughput (500+ users, 100K+ assignments/day):**

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningShadowMode: false,
    learningRate: 0.02, // Conservative learning rate
    learningExplorationRate: 0.01, // Minimal exploration (1%)
    learningBoostFactor: 30, // Restrained boost to avoid instability
    learningDecisionTtlMs: 86400000, // 1 day (shorter TTL for faster cleanup)
    learningFeedbackTtlMs: 172800000, // 2 days (stagger feedback arrival)
    learningSignalWeights: { accuracy: 1, csat: 0.3 }, // Fewer signals = less noise
    // Consider sampling outcomes if traffic is extreme:
    // Only learn from 10% of low-priority assignments.
});
// Monitoring critical: set up Redis memory alerts, track write amplification.
// Consider a separate Redis instance for RL state if main matcher instance is saturated.
```

#### Safety Guardrails

1. **Keep hard rules outside RL.** Eligibility, vetoes, backlog limits, and lifecycle state remain deterministic. RL only adjusts ranking of already-eligible candidates.
2. **Start shadow mode.** Always enable `learningShadowMode: true` for the first week, then migrate to live mode with guardrails in place.
3. **Cap exploration.** Set `learningExplorationRate ≤ 0.05` (5%). Exploration is important for learning but creates churn and can impact user experience.
4. **Aggressive TTL.** Never leave decision records for more than 7 days. Episodes (feedback-waiting) should expire in 3–7 days depending on your feedback SLA.
5. **Batch feedback imports.** Run external QA/accuracy signal imports as background jobs during low-traffic windows, not inline with matching.
6. **Monitor key counts.** Use `redis-cli info keyspace` or equivalent to watch key cardinality. If decision keys grow unbounded, TTL is broken or Redis is out of memory.
7. **Separate concerns.** If your matcher handles 1M+ assignments/day, use a dedicated Redis instance for RL state, separate from the main queue data.

#### Monitoring & Diagnostics

Key metrics to track:

- **Model size**: `(await matcher.getLearningModel()).length` — should be stable (5–50 features). If growing > 100, your feature extractor is leaking.
- **Decision cardinality**: `DBSIZE` and filter for `learning:decision:*` — should stay < 2× your `maxUserBacklogSize × numUsers`.
- **Learning stats**: `getLearningStats()` — watch `averageReward` drift and `decisions` growth rate. If `averageReward` is always zero or NaN, your reward signals are malformed.
- **Redis memory**: Keep below 70% of instance limit. Set memory alerts.
- **Write latency**: Track Redis command latencies (`latency latest`). Spikes indicate contention; consider sharding or a larger instance.
- **Model convergence**: Periodically log `getLearningModel()` weights and compare week-over-week. Sharp weight changes suggest concept drift or noisy rewards.

#### Recommended Production Workflow

1. Deploy with `learningShadowMode: true` and `learningExplorationRate: 0` for 1–2 weeks.
2. Validate that `getLearningStats()` shows growing reward without ranking instability.
3. Switch to live mode with low `learningExplorationRate` (0.01–0.02).
4. Set up external feedback pipeline (QA, CSAT, etc.) and test with a small sample.
5. Gradually increase `boostFactor` and `explorationRate` based on business metrics (completion rate, SLA, re-open rate).
6. Monitor weekly; roll back or reduce `boostFactor` if metrics degrade.

### Learning Benchmark Simulation

Use the built-in simulation benchmark to compare baseline routing vs learning shadow mode vs live learning mode on the same deterministic workload.

Run with defaults:

```bash
pnpm benchmark:learning
```

Run with custom scale:

```bash
pnpm benchmark:learning -- 300 8000 10 20260611
# arguments: <users> <assignmentsPerRound> <rounds> <seed>
```

Set `REDIS_URL` to benchmark against a non-default Redis endpoint. Benchmark
runs use isolated, unique key prefixes and never call `FLUSHDB`.

Output includes:

1. Per-mode throughput and latency (`baseline`, `learning-shadow`, `learning-live`)
2. Acceptance/completion/rejection/failure rates
3. A normalized quality score for quick comparisons
4. Top learned model weights
5. Delta summary vs baseline (throughput, completion rate, quality)

One caveat about this runner: it derives each worker's initial `routingWeights`
directly from their latent skill, so the operator's configuration is already
optimal and learning has little room to add anything. That is a useful
**strong-baseline** case — a policy must not regress there — but it is not
evidence of uplift.

### Scenario Benchmark (policy comparison)

`benchmark:scenarios` is the runner that can actually fail a policy. It varies
the conditions learning is supposed to help with, seeds every source of
randomness including exploration and Thompson draws, gives every mode the
identical workload and event-keyed outcome draws, and reports **paired**
differences with confidence intervals rather than single-run numbers.

```bash
pnpm benchmark:scenarios -- --scenarios=cold-start,noisy-weights \
    --modes=off,legacy,corrected,confidence --seeds=5 \
    --users=40 --per-round=200 --rounds=8 --json=run.json
```

Scenarios: `accurate-weights` (strong baseline), `noisy-weights`,
`cold-start`, `skill-drift`, `rare-specialist`, `multi-tag`,
`delayed-feedback`, `contention`, `overload`.

Modes: `off`, `shadow`, `legacy` (the pre-1.16 configuration), `corrected`
(normalized updates, per-attempt evidence, epsilon-greedy, performance
features, multi-target), `ucb1`, `confidence`, `thompson`.

Reported per scenario: completed useful work per incoming task, mean quality,
deadline misses, queue-age p50/p95/p99, allocation Gini, match latency
p50/p95/p99 and throughput, reward observations per decision, acceptance Brier
score and reliability bins, plus Redis commands, memory delta and model size.
`--json` writes the raw per-run metrics along with runtime, hardware and seed
provenance.

Read the results with the gates in mind: require positive paired uplift on the
noisy/cold-start scenarios, **and** no material regression on the
strong-baseline, deadline or overload scenarios. Materiality is a product SLO
question, not a universal percentage. Shadow mode validates data and decisions;
it does not establish causal uplift — that needs offline policy evaluation or a
controlled online rollout, and because workers share queues, an experiment unit
has to account for interference rather than assuming task-level independence.

### Configuration Playbook (How To Choose)

Use this quick guide based on your primary goal.

#### Throughput-first (minimal latency impact)

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningShadowMode: false,
    learningExplorationRate: 0.005,
    learningBoostFactor: 20,
    learningRate: 0.02,
    learningDecisionTtlMs: 86400000,
    learningFeedbackTtlMs: 86400000,
    relevantBatchSize: 50,
    maxUserBacklogSize: 1,
});
```

When to use:

1. You have tight p95/p99 latency SLOs.
2. Even a 2-5% throughput drop is expensive.

#### Balanced (recommended starting point)

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningShadowMode: false,
    learningExplorationRate: 0.01,
    learningBoostFactor: 35,
    learningRate: 0.05,
    learningDecisionTtlMs: 259200000,
    learningFeedbackTtlMs: 259200000,
    relevantBatchSize: 100,
    maxUserBacklogSize: 1,
});
```

When to use:

1. You want measurable quality lift with moderate performance cost.
2. You can tolerate small throughput swings while tuning.

#### Quality-first (maximize learning impact)

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    learningShadowMode: false,
    learningExplorationRate: 0.02,
    learningBoostFactor: 60,
    learningRate: 0.08,
    learningDecisionTtlMs: 604800000,
    learningFeedbackTtlMs: 604800000,
    relevantBatchSize: 200,
    maxUserBacklogSize: 1,
});
```

When to use:

1. Completion/quality metrics matter more than raw throughput.
2. You have enough headroom in Redis and CPU.

### How To Tune It (Step by Step)

1. Start with **shadow mode** and exploration off:

```typescript
learningShadowMode: true,
learningExplorationRate: 0,
```

2. Run baseline benchmark and record metrics:

```bash
pnpm benchmark:learning -- 100 1000 10 42
```

3. Move to live mode with conservative values:

```typescript
learningShadowMode: false,
learningBoostFactor: 20,
learningExplorationRate: 0.005,
```

4. Compare deltas:

    - `Throughput delta` should stay above your SLO floor (e.g. not below `-2%`).
    - `Completion rate delta` should be positive.
    - `Quality score delta` should be positive.

5. If throughput regresses too much:

    - Reduce `learningBoostFactor`.
    - Reduce `learningExplorationRate`.
    - Reduce `relevantBatchSize`.
    - Shorten `learningDecisionTtlMs` / `learningFeedbackTtlMs`.

6. If quality lift is too small:
    - Increase `learningBoostFactor` gradually (`+10` per step).
    - Increase `learningExplorationRate` slightly (`+0.005`), capped at `0.05`.
    - Improve signal quality in `learningSignalWeights`.

### Reading Benchmark Deltas Quickly

Example:

```text
Throughput delta: -5.11%
Completion rate delta: +4.80pp
Quality score delta: +0.0274
```

Interpretation:

1. You traded some speed (`-5.11%`) for better outcomes.
2. Completion improved by **4.80 percentage points** (`pp`, not percent).
3. Quality improved overall (`+0.0274`).

Choose the config where business utility is highest for your constraints.
If throughput is the hard constraint, keep throughput delta near zero and accept smaller quality gains.

## Detailed Example & Performance Insights

The following example demonstrates adding multiple users and assignments and then measures the performance of the matching process.

```javascript
// Save this as example.ts and ensure you have ts-node and typescript installed
// npm install -D ts-node typescript
// Then run: ./example.ts

import AssignmentMatcher, { User, Assignment } from 'assignment-user-matcher';
import { createClient } from 'redis';

async function bootstrap(userCount: number, assignmentCount: number) {
  const redisClient = await createClient({});
  await redisClient.connect();
  // It's good practice to clear keys for a fresh test run,
  // but be VERY careful with flushDb in production.
  await redisClient.flushDb();


  const assignmentMatcher = new AssignmentMatcher(redisClient, {
    relevantBatchSize: 100, // Larger batch for testing
    maxUserBacklogSize: 10,
    redisPrefix: 'perfTest:',
  });

  console.log(`Setting up ${userCount} users and ${assignmentCount} assignments...`);

  // Add Users
  for (let i = 0; i < userCount; i++) {
    await assignmentMatcher.addUser({
      id: `user_${i}`,
      tags: ['tag1', 'tag2', `unique_skill_${i % 5}`], // Varied tags with smaller modulo for more matches
    });
  }

  // Add Assignments
  for (let i = 0; i < assignmentCount; i++) {
    await assignmentMatcher.addAssignment({
      id: `assignment_${i}`,
      tags: ['tag1', `unique_skill_${i % 5}`], // Ensure more matches
      createdAt: new Date().getTime() + i, // Stagger creation time slightly
    });
  }
  console.log('Setup complete.');

  // --- Performance Measurement for Initial Matching ---
  console.log('Performing initial matching...');
  performance.mark('match-start');
  await assignmentMatcher.matchUsersAssignments();
  performance.mark('match-end');
  const matchMeasure = performance.measure('Initial Matching Process', 'match-start', 'match-end');
  console.log(`Initial matching execution time: ${matchMeasure.duration.toFixed(2)}ms`);

  // --- Log initial assignments for all users ---
  console.log('\nInitial assignments for users:');
  for (let i = 0; i < userCount; i++) {
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser(`user_${i}`);
    console.log(`User 'user_${i}' has ${userAssignments.length} assignments.`);
  }

  // --- Simulate completing assignments ---
  console.log('\nSimulating users completing assignments...');
  for (let i = 0; i < userCount; i++) {
    // Only process for the first 15 users
    if (i >= 15) break;

    // Get the current assignments for this user
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser(`user_${i}`);

    if (userAssignments.length > 0) {
      // Simulate completing half of the assignments
      const assignmentsToComplete = userAssignments.slice(0, Math.ceil(userAssignments.length / 2));
      console.log(`User 'user_${i}' completing ${assignmentsToComplete.length} assignments...`);

      // Remove these assignments from the user's queue
      for (const assignmentId of assignmentsToComplete) {
        await redisClient.sRem(assignmentMatcher.redisPrefix + `user:user_${i}:assignments`, `assignment:${assignmentId}`);
      }
    }
  }

  // --- Perform another matching after completion ---
  console.log('\nPerforming second matching after assignment completion...');
  performance.mark('rematch-start');
  await assignmentMatcher.matchUsersAssignments();
  performance.mark('rematch-end');
  const rematchMeasure = performance.measure('Second Matching Process', 'rematch-start', 'rematch-end');
  console.log(`Second matching execution time: ${rematchMeasure.duration.toFixed(2)}ms`);

  // --- Final check of assignments for all users ---
  console.log('\nFinal assignments for users:');
  for (let i = 0; i < userCount; i++) {
    if (i >= 15) break; // Only show for the first 15 users
    const userAssignments = await assignmentMatcher.getCurrentAssignmentsForUser(`user_${i}`);
    console.log(`User 'user_${i}' now has ${userAssignments.length} assignments.`);
  }

  console.log(
    `
Summary:
    Users: ${userCount} (simulated 15 users completing assignments)
    Assignments: ${assignmentCount}
    Initial Matching Duration: ${matchMeasure.duration.toFixed(2)}ms
    Second Matching Duration: ${rematchMeasure.duration.toFixed(2)}ms`
  );

  await redisClient.quit();
}

// Adjust these numbers to test different scales
const USER_COUNT = 30;
const ASSIGNMENT_COUNT = 150000;

bootstrap(USER_COUNT, ASSIGNMENT_COUNT)
  .then(() => {
    console.log('Performance test finished.');
    // process.exit(0); // Exit cleanly
  })
  .catch((err) => {
    console.error('Error during bootstrap:', err);
    // process.exit(1);
  });
```

### Example Performance Results

When running the above example with 30 users and 150,000 assignments, you might see results similar to this:

```
Summary:
    Users: 30 (simulated 15 users completing assignments)
    Assignments: 150000
    Initial Matching Duration: 3.83ms
    Second Matching Duration: 0.83ms
Performance test finished.
```

This demonstrates the library's impressive performance even with large numbers of assignments and shows how subsequent matching operations can be even faster after initial assignment distribution.

## Shift Scheduling (`scheduling` module)

A companion engine for **rostering**: generating fair, constraint-compliant timetables that assign employees to shifts over a period. Unlike the matcher, this module is **pure and Redis-free** — `solveSchedule(input)` is a synchronous in-process function; wrap it in your own queue if you need one.

**Import it from the `assignment-user-matcher/scheduling` subpath** to get the engine without the Redis-backed matcher. The root barrel pulls in `redis`; this one pulls nothing but the scheduler, so it loads in a browser, a Web Worker or an edge runtime as well as in Node. (Every example below uses the root import for continuity; the subpath exports the same names.)

```ts
import { solveSchedule } from 'assignment-user-matcher/scheduling';
```

```ts
import { solveSchedule } from 'assignment-user-matcher';

const result = solveSchedule({
    period: { startDate: '2026-01-05', endDate: '2026-01-11' },
    employees: [
        { id: 'alice', tags: ['nurse'], timeOff: [{ date: '2026-01-07' }], maxHoursForPeriod: 40 },
        { id: 'bob', tags: ['nurse', 'lead'], timeOff: [] },
    ],
    shifts: [
        { id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', minEmployees: 1, tagRequirements: { nurse: 1 } },
        { id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', minEmployees: 1 }, // overnight
    ],
    objective: 'balanced', // or 'standard'
    seed: 42, // reproducible runs
    timeBudgetMs: 10_000, // improvement-loop wall clock
});

// result.status: 'optimal' | 'feasible' | 'partial'
// result.assignments: [{ shiftInstanceId: 'day@2026-01-05', employeeId, date, reasons }]
// result.violations: structured report of unfilled slots, tag shortfalls, soft min-hours misses
```

Modeling rules: every shift occurrence gets a unique **shift-instance id** (`<templateId>@<date>`), overnight shifts (`endTime <= startTime`) roll into the next day explicitly, and durations are resolved through a **DST-correct clock** — pass `period.timeZone` and a 22:00–06:00 shift is 7h on the spring transition and 9h on the autumn one, not 8h. Working time is the span less `unpaidBreakMinutes`, scaled by any duty classification, so hour budgets see 8h15 for a 9h shift with a 45-minute break.

Constraints are self-contained TypeScript classes behind a common interface. Override hardness/weights or register customs via `constraints: { overrides, custom }`.

### Working-time rules

The `rules` field is the labour-law layer. Every field is optional and **every value is caller-supplied** — the library ships the _shapes_ EU working-time law takes, never a jurisdiction's numbers, because those differ per member state, per sector and per collective agreement, and change without notice. This is plain JSON, so a template or an LLM can produce it and the same payload can back a public API.

```ts
const result = solveSchedule({
    period: { startDate: '2026-01-05', endDate: '2026-02-01', timeZone: 'Europe/Berlin' },
    employees,
    shifts,
    rules: {
        dailyRest: { minMinutes: 660 }, // Art 3 floor; ES/RO use 720
        weeklyRest: { minMinutes: 2100, windowDays: 7 }, // 35h; EE uses 2880
        workingTime: {
            maxPerDayMinutes: 600, // DE ArbZG §3
            rollingAverages: [{ maxMinutes: 2880, windowDays: 7 }], // 48h in ANY 7 days
        },
        nightWork: { window: { from: '23:00', to: '06:00' }, maxShiftMinutes: 480 },
        breaks: [
            { afterMinutes: 360, minMinutes: 30 },
            { afterMinutes: 540, minMinutes: 45 },
        ],
        consecutive: { maxWorkingDays: 6, forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early' }] },
        fairness: [
            { dimension: 'nights', weight: 2 },
            { dimension: 'weekends', weight: 1 },
        ],
    },
    history, // previous-period tail, so the 1st of the month is not non-compliant by construction
});
```

Rules cover: daily rest (rolling window, reduction allowances, clock-band containment), weekly rest (two-level floor plus average), rolling working-time averages with absence neutralisation, overtime (ordinary-vs-overtime split, consent, per-day and per-window caps, time-off-in-lieu), duty-type volume quotas, night work (configurable band, per-shift cap, averaging, hazardous absolute cap, volume quotas, prohibited bands), in-shift breaks, consecutive days and nights, forbidden shift successions, minimum start interval, Sunday and holiday rules, minimum engagement, publication and change notice, availability and preferences, date-valid qualifications, group composition, statutory protections, contract limits, and fairness.

`Employee.rules` overrides the global set per person — that is how age classes, individual opt-outs and hazardous-work status are expressed. `Employee.personId` aggregates several contracts onto one natural person, which rest and window rules require: overlap (`no-overlap`) and inter-assignment rest (`min-rest`, `dailyRest`) are judged on the person timeline — spanning sibling contracts and supplied `history` — so two contracts cannot double-book a person or dodge a rest floor at the period boundary. Contract hour/day **maxima** are the opposite: per employee record, like the minimum and the `timeOffInLieu` ledger — one contract's cap is never consumed by a sibling's hours. Rolling volume windows (night-shift quotas, weekly-rest averaging) probe true rolling windows anchored on entry boundaries, never a day grid. Declared `available` windows are credited as a **union**: a shift spanning two contiguous windows is inside the declaration.

Break entitlements are checked against shift design: `unpaidBreakMinutes` (deducted from working time) and `paidBreakMinutes` (working time, and the only thing that discharges a `paid: true` break rule). Deadline arithmetic that needs a "now" — notably whether a cancellation of a published assignment fell inside `notice.cancellationDeadlineMinutes` — is anchored by the optional `asOf` input; without it every cancellation is treated as late, the conservative reading.

**Overtime** is regulated separately from total working time where national law does so. `rules.overtime` defines the ordinary baseline (`ordinaryPerDayMinutes` / `ordinaryPerWeekMinutes`; a person's `contract.weeklyMinutes` overrides the weekly figure, so a part-timer's overtime starts at their agreed hours), caps the overtime portion per rolling 24h or per rolling window, and with `requiresConsent` makes any overtime conditional on the employee's recorded `overtimeConsent`. With `compensation: 'timeOff'`, each employee's period overtime accrues a `timeOffInLieu` entry in `result.ledger`.

**Temporary demand.** A shift template is the standing rule; `demandOverrides` are the temporary ones — each bounded to an inclusive `from`/`to` date range (optionally to `daysOfWeek` inside it) and applied to every occurrence whose date falls in it. An override can replace `minEmployees`, `maxEmployees` (`null` removes it), `tagRequirements`, `tagMaximums` or `requiredTags`, add `extraEmployees` on top of whatever is in force, or set `runs` — whether the shift happens on those dates at all. `runs` works in **both** directions: `false` is a closure, and `true` opens the shift on dates the template's own `dates`/`daysOfWeek` excludes, so a weekday-only shift can take one weekend without widening the template and opening every weekend from then on. A date opened this way inherits the template's own shape unless the override states otherwise. Overrides fold in array order, later wins field by field, `extraEmployees` accumulates, and a minimum raised above the standing maximum lifts the maximum with it — "three at the peak" means three. The result is an ordinary `ShiftInstance` (with `demandLabel` naming the last labelled override that touched it), so the solver, `checkCompliance`, `explainCandidate`, `rankCandidates` and `expandShiftInstances` all read one headcount and none of them knows an override exists. The day after `to`, the shift is back to its standing shape without anybody editing it.

```ts
{
    id: 'till', name: 'Till', startTime: '09:00', endTime: '17:00', daysOfWeek: [1, 2, 3, 4, 5],
    minEmployees: 2, maxEmployees: 3,
    demandOverrides: [
        { from: '2026-12-14', to: '2026-12-24', label: 'Christmas peak', extraEmployees: 2 }, // 4 needed, 5 at most
        { from: '2026-12-19', to: '2026-12-19', label: 'Late opening', requiredTags: ['keyholder'] },
        { from: '2026-12-19', to: '2026-12-20', label: 'Christmas weekend', runs: true }, // Sat+Sun, this weekend only
        { from: '2026-12-25', to: '2026-12-26', label: 'Closed', runs: false },
    ],
}
```

**Contracted hours and part-time.** A person's contracted week is stated either as minutes (`contract.weeklyMinutes`) or as a fraction of full time (`contract.fte`, `0 < fte <= 1`, e.g. `0.5` for half-time). An `fte` resolves against `rules.contract.fullTimeWeeklyMinutes`, falling back to `rules.overtime.ordinaryPerWeekMinutes`; with neither the input is rejected rather than a working week guessed. The resolved week is read in one place (`ModelContext.contractedWeeklyMinutes`) by everything that needs it: the overtime baseline, pro-rata fairness (`proRataByContract`), and the **contract-hours objective**, which pulls every person with a contract towards `weekly × periodDays / 7` at the soft level (`objectives.contractHoursWeight`, default `1` point per hour of deviation, `0` to disable) — so a half-timer is planned half the hours of a full-timer instead of being filled to the statutory ceiling. Two optional bounds on `rules.contract`: `maxOverMinutes` (hard cap at contract plus the allowance; `0` means never over contract — omit when your `overtime` rule governs the surplus) and `maxUnderMinutes` (a shortfall beyond it is reported as a soft violation). `result.contractHours` / `ComplianceReport.contractHours` list planned against contracted minutes per person, and `rankCandidates` reports `contractDeltaMinutes` and ranks people with contract headroom ahead of those a shift would push over. Cover is a floor, not a ceiling: once every slot has its `minEmployees`, the solver keeps adding people to shifts that state room for them — **room means `maxEmployees` above the minimum, and a shift that states no maximum has none** — while the shift fits **inside** their contracted total, or while they are under a `minHoursForPeriod` floor — so two full-timers on a roster whose minimum cover is 56h, with `maxEmployees: 2` on the shifts, are each planned their 40h rather than 28h. A shift asking for one person needs one person, and a second body there does not do a second body's work: without that rule a team contracted for far more hours than the period requires is planned onto every shift at once, which is lawful, useless and expensive. The ceiling for this pass is the contracted total **plus whatever `rules.contract.maxOverMinutes` already allows**, never a target to land nearest to: with no allowance stated, a half-timer on 15h of a 20h contract is not given a further 7.5h shift, because 2.5h over is not "closer" enough to be worth hours nobody asked for. State an allowance and the top-up plans into it, which is what lets a part-timer be filled at all when no shift is small enough to fit the room left. Set `objectives.fillToContract: false` (or a zero `contractHoursWeight`) to staff minimum cover only and let contracted hours merely distribute the demand; a `maxEmployees` on the template or a hard `maxOverMinutes` bounds the top-up either way.

**Public holidays** are caller-supplied ISO dates in `calendar.publicHolidays`. They mark `ShiftInstance.isPublicHoliday`, which drives `restDays.holidayAllowed` and `compensatoryRestWithinDays.holiday`, the `holidays` fairness dimension and the `holiday` cost premium. The engine ships no holiday calendar — a host resolves the roster's location to dates and passes them in.

**Duty-type quotas** (`rules.dutyQuotas`) cap how much of one duty type a person may hold over a rolling window, matched on `shiftTypeTag` — e.g. "at most 30 hours of stand-by in any 28 days". `maxMinutes` counts _elapsed_ duty minutes (a stand-by cap limits clock occupation, which is exactly the time a duty classification keeps out of the working-time budget); `maxCount` caps occurrences.

### Multi-site rosters

When you run several sites in one city, site data makes the solver and the call-in suggestions location-aware:

- Add a `sites` registry with optional coordinates and an asymmetric `travelMinutesTo` matrix.
- Set `Employee.homeSiteId` for the soft home-site preference and `Employee.siteIds` as a hard allow-list.
- Use `objectives.homeSiteWeight` to make the solver prefer keeping people at their home site.
- `repairSchedule` and `rankCandidates` measure "nearby" from the candidate's nearest same-day assignment, falling back to `homeSiteId`, and include `originSiteId`, `travelMinutes`, `distanceKm` and `isHomeSite` on every `RepairCandidate`.

```ts
const result = solveSchedule({
    period: { startDate: '2026-01-05', endDate: '2026-01-11', timeZone: 'Europe/Berlin' },
    employees: [
        { id: 'alice', tags: ['nurse'], timeOff: [], homeSiteId: 'north', siteIds: ['north', 'south'] },
        { id: 'bob', tags: ['nurse'], timeOff: [], homeSiteId: 'south', siteIds: ['south'] },
    ],
    shifts: [
        { id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', siteId: 'north' },
        { id: 'late', name: 'Late', startTime: '14:00', endTime: '22:00', siteId: 'south' },
    ],
    sites: [
        { id: 'north', lat: 52.5, lng: 13.4, travelMinutesTo: { south: 35 } },
        { id: 'south', lat: 52.4, lng: 13.5, travelMinutesTo: { north: 40 } },
    ],
    // Fallback only used when a matrix entry is missing:
    travelSpeedKmh: 30,
    objectives: { homeSiteWeight: 1 },
});
```

Travel-time resolution order: explicit matrix entry → haversine kilometres ÷ `travelSpeedKmh` → unknown. When minutes are unknown, suggestions still show `distanceKm` for host-side re-sorting.

The `site-travel-gap` rule is a hard constraint: two consecutive assignments at different sites must leave at least the travel time between them. It reads the same person timeline as the rest rules, so it works across contracts (`personId`) and across the period boundary via `history` entries that carry `siteId`. It enforces the gap only; it does not treat travel time as working time (CJEU C-266/14). Because the default 11h `min-rest` rule masks most intra-day switches, the gap rule mainly matters when you have relaxed `minRestMinutes` or configured a `dailyRest` rule that permits split shifts.

### Labour cost

`Employee.cost` prices the roster: hourly rate, premium bands (`night` / `sunday` / `holiday`, stacked additively or by maximum), an overtime step (`overtimeAfterMinutes` + `overtimeMultiplier`), and a `standbyRateFraction` paying the non-working remainder of a duty-classified span (e.g. stand-by owed at 1/10 of the wage). When any employee carries a cost model, `result.cost` reports `{ totalCents, byEmployee }`.

Cost joins the _solve_ objective only when asked: `objectives: { costWeightPerEuro: n }` adds a soft term of `n` points per euro, so the solver prefers cheaper rosters among otherwise-equal ones — and can never trade a legal breach or an unfilled slot for a saving, because score levels are lexicographic. The same arithmetic drives `repairSchedule`'s per-candidate `marginalCostCents` (which accounts for the overtime step, so the same shift is dearer in the hands of someone already at their threshold). Objective weights are hashed into `provenance.rulesHash` alongside the rules.

### Operational APIs

```ts
checkCompliance(input, roster); // validate a hand-edited or externally-produced roster
explainCandidate(input, who, shift); // every rule's verdict, with numbers
repairSchedule(input, disruption, published); // minimal-perturbation re-plan + ranked candidates
diagnoseInfeasibility(input); // why it cannot be solved, before solving
```

`repairSchedule` is the call-in path: everything untouched is pinned, so you get a **diff** rather than an unrecognisable new roster, plus a ranked list of who can lawfully cover, each with compliance verdicts, marginal cost and a rationale. All four share the solver's constraint set — there is deliberately no second validation path. `checkCompliance` also runs the solver's ledger pass, so a hand-edited roster reports the same accrued obligations (compensatory rest, late-cancellation pay, protection fallbacks, time off in lieu) that `solveSchedule` would report for the same assignments — a human override can never validate as "compliant but owing nothing".

`expandShiftInstances(input)` returns the dated planning grid a host should render before anything is assigned — the same `<templateId>@<date>` ids every other call refers to. Use it so the grid ids never drift from the instances the solver will judge.

### Validation and replay (engine version 3)

`checkCompliance` reports staffing and skill shortfalls alongside assignment violations. Its `compliant` flag means no hard breaches; `coverageComplete` means every staffing requirement is met; `publishable` requires both. The host must still handle any medium-severity obligations and publication approvals required by its workflow. Duplicate assignments are input errors and do not inflate worked hours.

Employee `rules` replace whole global rule families, including families absent globally. The same effective rules apply during solving, candidate checks, and compliance. Night classification uses the employee's effective night window. Rule hardness overrides also apply to returned verdicts; only hard constraints prune eligibility. Absence repair preserves published assignments outside the actual absence interval, including when a shift starts before that interval and overlaps it.

Date-time fields (`asOf`, publication time, absences, external commitments) accept local date-times in the roster zone or ISO instants with `Z`/`±HH:MM`. Bare absence end dates include the entire local day. Invalid dates, reversed spans, unknown absence employees, and invalid search budgets throw `ScheduleValidationError`. Leave beyond the final planning date still blocks overnight work that reaches it.

For repeatable optimization, use a fixed iteration count and omit `timeBudgetMs`:

```ts
const result = solveSchedule({ ...input, seed: 42, maxIterations: 500, timeBudgetMs: undefined });
```

With both limits set, search stops at whichever is reached first, so wall-clock termination can change the result. Persist the full input, engine version, and custom-rule implementations for replay. `rulesHash` includes effective employee rules and optional custom constraint `version` strings; it is a configuration fingerprint, not a complete input archive.

Custom `evaluate(state)` violations now influence search selection as well as final validation. These hooks must be pure and fast, and should express obligations not already scored by `delta`. Candidate checks still use pair-level hooks; implement `delta`/`verdict` for restrictions that must also block an individual cover suggestion. Search remains heuristic and does not prove optimality or infeasibility.

### Compliance boundary

Ranking uses declared qualifications, contractual availability, legal limits, cost, and fairness debt computed from **realised** assignment counts. It never consumes reliability scores, no-show prediction, acceptance history or learned per-worker behaviour, and the module is not wired to the matcher's learning layer. Under AI Act Annex III point 4(b), allocating on individual behaviour or traits is high-risk, and the Art 6(3) narrow-task filter has an absolute carve-back for profiling — so that boundary is what keeps this a constraint solver. `result.provenance` records `{ engineVersion, seed, rulesHash, profilingFree }` for audit.

Infeasibility is never silent: understaffed periods return a best-effort partial schedule with `status: 'partial'`, an `unfilledSlots` count, and per-slot violations; slots with zero eligible employees are reported before the search runs. Violations carry `actual`, `required`, `unit` and `citation`. Malformed input throws `ScheduleValidationError`.

`'optimal'` means _no known improvement_, not a proof of optimality.

Scale (500 employees × 31 days × 3 shifts/day, full EU rule set — `pnpm benchmark:scheduling`): first feasible ~0.4s, converged within the time budget, compliance re-check ~0.1s, repair ~0.15s.

## Important Considerations (Disclaimer)

- **Optimized for a Specific Use Case:** `assignment-user-matcher` is primarily designed and optimized for scenarios with a **relatively small set of active users processing a large volume of incoming assignments** (e.g., call centers, customer support teams, back-office operations). While it might work for other scenarios, its performance characteristics are best suited for this model.
- **Redis Dependency:** This library requires a running Redis instance. Ensure your Redis server is adequately provisioned for your workload.
- **Near Real-Time, Not Instantaneous:** While fast, the matching process involves Redis operations and logic execution. "Near real-time" means it's quick, but not strictly instantaneous with nanosecond precision. The `matchUsersAssignments()` method needs to be called periodically or triggered by events (e.g., new assignment, user becomes available) to perform matching.

## Contributing

Contributions are welcome! If you have ideas for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch for your feature or fix.
3.  Make your changes.
4.  Add tests for your changes.
5.  Ensure all tests pass.
6.  Submit a pull request.

Please open an issue first to discuss significant changes.

## Packaging & Publishing

The npm package only ships the compiled artifacts in `dist/`. Before publishing:

1. Install dependencies: `pnpm install`
2. Build the library: `pnpm run build`
3. (Optional) Inspect the publish payload: `pnpm pack --dry-run`

For version bump + tag release flow (including patch releases), see `RELEASE.md`.
If you prefer a local helper, copy `scripts/release-patch-local.sh.example` to
`scripts/release-patch-local.sh` and run it.

Consumers can `import AssignmentMatcher from 'assignment-user-matcher'` or `const { AssignmentMatcher } = require('assignment-user-matcher')` without running TypeScript themselves.

## License

[MIT](./LICENCE) — free for commercial and non-commercial use.
