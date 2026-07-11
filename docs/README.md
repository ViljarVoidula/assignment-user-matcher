assignment-user-matcher / [Exports](modules.md)

# `assignment-user-matcher`: Lightning-Fast, Tag-Based User & Assignment Matching

[![npm version](https://badge.fury.io/js/assignment-user-matcher.svg)](https://badge.fury.io/js/assignment-user-matcher)
[![CI Pipeline](https://github.com/ViljarVoidula/assignment-user-matcher/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ViljarVoidula/assignment-user-matcher/actions/workflows/npm-publish.yml)

<!-- Add other badges if you have them, e.g., build status, test coverage -->

**Tired of inefficiently assigning tasks or struggling to connect the right users with the right work? `assignment-user-matcher` is a specialized Node.js library designed for high-performance, near real-time matching of a smaller pool of users to a large volume of assignments, primarily based on shared tags and priority.**

It leverages the speed and efficiency of Redis to deliver a robust solution perfect for scenarios like call centers, customer support queues, back-office operations, and more.

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

### `getPendingAssignmentsWithAge(): Promise<PendingAssignmentInfo[]>`

Retrieves current pending assignments, including who owns each assignment and how long it has been pending.

- `assignment`: The assignment payload.
- `ownerId`: The current owner user ID, or `null` if missing.
- `pendingForMs`: Elapsed pending time in milliseconds.
- `pendingSince`: Unix timestamp (ms) when the assignment entered pending state.
- `expiresAt`: Unix timestamp (ms) when pending expiration is scheduled.

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

    // TTL for stored decision contexts in ms.
    learningDecisionTtlMs?: number; // Default: 604800000 (7 days)

    // Weights applied to named external feedback signals when computing rewards.
    // Signals not listed here default to weight 1. Negative weights turn a
    // signal into a penalty (e.g. { errorRate: -2 }).
    learningSignalWeights?: Record<string, number>;

    // TTL for archived episodes awaiting late external feedback in ms.
    learningFeedbackTtlMs?: number; // Default: 604800000 (7 days)
};
```

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
2. Candidates are ranked by `combinedPriority + boostFactor * predictedReward`.
3. The decision context is stored, and lifecycle outcomes (`accept`,
   `complete`, `reject`, `expire`, `fail`) feed rewards back into the model via
   online SGD updates — fully automatic, no training pipeline needed.

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

### Automatic Routing Weights (RL-Generated Tags/Weights)

Beyond re-ranking, the learning layer can fully automate `routingWeights`
authoring. With `enableAutoRoutingWeights: true` (requires `enableLearning`),
every reward observation also updates per-user, per-tag statistics in Redis
(atomic `HINCRBY`/`HINCRBYFLOAT` — O(tags) per outcome, no scans, no
read-modify-write), and weights are synthesized on demand with a UCB1 bandit
policy:

- tags with a high mean reward get proportionally high weights (UCB
  exploration bonus favors less-sampled tags),
- tags with a mean reward at/below `vetoThreshold` (after `minSamples`
  observations) get weight `0` — the matcher's hard-veto semantics,
- under-sampled or unobserved known tags get an optimistic `priorWeight` so
  the system keeps exploring them.

```typescript
const matcher = new AssignmentMatcher(redisClient, {
    enableLearning: true,
    enableAutoRoutingWeights: true,
    autoRoutingWeights: {
        minSamples: 5, // observations before a tag's stats are trusted
        vetoThreshold: -0.5, // mean reward at/below this → weight 0 (hard veto)
        maxWeight: 100, // top of the synthesized weight scale
        explorationBonus: 0.5, // UCB coefficient; higher → more exploration
        priorWeight: 50, // optimistic weight for unexplored tags
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
```

Synthesis happens outside the matching hot path — matching itself reads the
user's stored `routingWeights` exactly as before, so the per-match cost is
unchanged. The last-applied learned map is stored on the user as
`learnedRoutingWeights` for observability, and `resetLearningModel()` clears
all per-user tag statistics. The pure synthesis function is exported as
`synthesizeRoutingWeights` for offline pipelines.

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

Output includes:

1. Per-mode throughput and latency (`baseline`, `learning-shadow`, `learning-live`)
2. Acceptance/completion/rejection/failure rates
3. A normalized quality score for quick comparisons
4. Top learned model weights
5. Delta summary vs baseline (throughput, completion rate, quality)

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

This library is proprietary, commercially-licensed software — see [`LICENCE`](./LICENCE) for the full terms. No use, copying, modification, or distribution is permitted without the Owner's prior written permission (the LICENCE file's non-commercial fair-use footnote covers limited evaluation/academic use with written confirmation from the Owner). Contact viljar@forgemaster.ai for licensing.
