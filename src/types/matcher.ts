import { createClient } from 'redis';

export type RedisClientType = ReturnType<typeof createClient>;

export interface User {
    id: string;
    tags: string[];
    // Optional routing weights per tag; if present, matching will use these weights.
    // Example: { english: 100, dutch: 30, brazil: 100, german: 0 }
    routingWeights?: Record<string, number>;
    // Optional IP address for network-based matching (IPv4 or IPv6)
    // Example: '192.168.1.100' or '2001:db8::1'
    ip?: string;
    // Optional geographic coordinates for distance-based matching
    latitude?: number;
    longitude?: number;
    // Optional user-side travel cap in kilometers
    maxTravelDistanceKm?: number;
    // Optional per-user backlog cap overriding the matcher-wide
    // maxUserBacklogSize (0 = receive nothing; invalid/negative values are
    // ignored). The fairness rolling-window auto-cap derivation stays
    // team-level and keeps using the global value.
    maxBacklogSize?: number;
    /**
     * Snapshot of routingWeights before the last learned sync; used by
     * revertLearnedRoutingWeights(). `null` records "had no routingWeights"
     * (tag-based matching), so that state is restorable too.
     */
    routingWeightsSnapshot?: Record<string, number> | null;
    /** Unix epoch ms of the last learned routing-weights sync for this user. */
    learnedRoutingWeightsSyncedAt?: number;
    /** The weights last applied by syncLearnedRoutingWeights(); for observability only. */
    learnedRoutingWeights?: Record<string, number>;
    [key: string]: any;
}

export type Assignment = {
    id: string;
    tags: string[];
    priority?: number;
    // Optional CIDR ranges that restrict which users can receive this assignment
    // If specified, only users with IPs within these ranges will be matched
    // Supports both IPv4 (e.g., '192.168.1.0/24') and IPv6 (e.g., '2001:db8::/32')
    allowedCidrs?: string[];
    // Optional minimum skill thresholds for matchmaking
    // If specified, user's routingWeights must meet or exceed these values for each tag
    // Example: { english: 50, support: 30 } requires user to have at least 50 for english and 30 for support
    skillThresholds?: Record<string, number>;
    // Optional list of user IDs that must never receive this assignment,
    // regardless of any other matching criteria (hard veto)
    vetoedUsers?: string[];
    // Optional assignment-side geographic coordinates
    latitude?: number;
    longitude?: number;
    // Optional assignment-side service radius in kilometers
    maxDistanceKm?: number;
    // When true, users without valid coordinates are not eligible
    requireGeo?: boolean;
    // Optional response deadline + escalation ladder. See EscalationPolicy.
    escalation?: EscalationPolicy;
    // Optional service-level agreement: completion deadline, TTL, rejection budget. See SlaPolicy.
    sla?: SlaPolicy;
    // Optional offer window: hold until notBefore, expire un-accepted work at notAfter. See SchedulePolicy.
    schedule?: SchedulePolicy;
    [key: string]: any;
};

/**
 * What should happen when the user an assignment was matched to lets the
 * response deadline run out without accepting or rejecting it.
 *
 * Without a policy, an unanswered assignment is simply requeued after the
 * matcher-wide `matchExpirationMs` — and the same user may win it straight
 * back. A policy makes that behaviour explicit and controllable: a
 * per-assignment deadline, an optional block on the non-responder, a priority
 * climb, and an optional tier ladder that moves the assignment to a different
 * pool on each hop (primary → secondary → manager) with no workflow involved.
 *
 * @example
 * ```typescript
 * await matcher.addAssignment({
 *     id: 'incident-1',
 *     tags: ['sev:1', 'oncall-primary'],
 *     escalation: {
 *         respondWithinMs: 60_000,
 *         onNoResponse: 'block',
 *         priorityBoost: 500,
 *         tiers: [['oncall-primary'], ['oncall-secondary'], ['oncall-manager']],
 *         onExhausted: 'park',
 *     },
 * });
 * ```
 */
export interface EscalationPolicy {
    /**
     * Milliseconds the matched user has to respond before the assignment is
     * taken back. Per-assignment override of `matchExpirationMs`.
     */
    respondWithinMs: number;
    /**
     * What happens to the user who let the clock run out.
     * - `'block'` — treated as a soft rejection: the user is added to their
     *   rejected set so the requeue cannot land back on them.
     * - `'allow'` — the assignment returns to the open pool and the same user
     *   may win it again (the historical behaviour).
     * @default 'allow'
     */
    onNoResponse?: 'block' | 'allow';
    /**
     * Milliseconds the non-responder is held out of matching for *this*
     * assignment after letting the clock run out. Per-assignment override of
     * the matcher-wide `offerCooldownMs`.
     *
     * The middle ground between the two pre-existing answers to "they did not
     * reply": `'allow'` lets them win it back on the very next pass, and
     * `'block'` bars them forever — which, when they are the only eligible
     * worker, means the work is never assigned at all. A cooldown lets the
     * offer rest, gives anybody else a clear run at it, and comes back to them
     * afterwards.
     *
     * Ignored when `onNoResponse` is `'block'`: a block is the stronger
     * statement and both together would be redundant.
     * @default the matcher-wide `offerCooldownMs` (itself 0 — off)
     */
    offerCooldownMs?: number;
    /** Priority delta applied on each escalation so ignored work climbs the queue. */
    priorityBoost?: number;
    /**
     * Tag ladder. Each escalation replaces the assignment's tier tags with the
     * next entry, so tier routing needs no workflow. Tags not named by any
     * tier are preserved across hops. Entry 0 describes the tags the
     * assignment starts with; the first escalation moves it to entry 1.
     */
    tiers?: string[][];
    /**
     * Maximum number of escalations.
     * @default `tiers.length - 1` when tiers are given, otherwise unlimited
     */
    maxEscalations?: number;
    /**
     * Terminal behaviour once the ladder is exhausted.
     * - `'queue'` — requeue and keep offering it (default).
     * - `'park'` — stop matching it and move it to the parked store, where
     *   `getParkedAssignments()` / `unparkAssignment()` can pick it up. This is
     *   the honest "escalated to the top and nobody answered" state.
     * @default 'queue'
     */
    onExhausted?: 'queue' | 'park';
}

/**
 * What service-level contract applies to an assignment once it is queued.
 *
 * EscalationPolicy owns the response/acceptance side (`respondWithinMs`);
 * SlaPolicy owns everything after that: how long the accepting user has to
 * finish, how many times the assignment may be rejected before it is pulled
 * from rotation, and an absolute freshness cutoff after which the work is
 * considered moot.
 *
 * All timers are swept by the maintenance tick (see `startMaintenance()` /
 * `runMaintenanceOnce()`), so they fire with sweep granularity rather than
 * at the exact deadline.
 *
 * @example
 * ```typescript
 * await matcher.addAssignment({
 *     id: 'order-42',
 *     tags: ['fulfillment'],
 *     sla: {
 *         completeWithinMs: 30 * 60_000,
 *         onCompletionBreach: 'requeue',
 *         maxRejections: 3,
 *         expireAfterMs: 24 * 3600_000,
 *     },
 * });
 * ```
 */
export interface SlaPolicy {
    /**
     * Milliseconds the accepting user has to complete the assignment,
     * measured from the moment `acceptAssignment()` succeeds. When the clock
     * runs out the completion-deadline sweep applies `onCompletionBreach`.
     */
    completeWithinMs?: number;
    /**
     * Absolute freshness cutoff in milliseconds, measured from the first
     * enqueue (survives requeues and applies in every state — queued,
     * pending, accepted). When the cutoff elapses the TTL sweep applies
     * `onExpire`. Use this for work that becomes moot after a while
     * regardless of who holds it.
     */
    expireAfterMs?: number;
    /**
     * Maximum number of times the assignment may be refused before
     * `onMaxRejections` fires. Both explicit `rejectAssignment()` calls and
     * blocking no-response expiries (`escalation.onNoResponse: 'block'`)
     * count; idle releases, operator releases, and non-blocking expiries
     * do not.
     */
    maxRejections?: number;
    /**
     * What happens when the completion deadline (`completeWithinMs`) elapses.
     * - `'notify'` — emit a `completionBreached` lifecycle event and record
     *   an `expire` learning outcome; the worker keeps the assignment.
     * - `'requeue'` — take the assignment back, block the breaching user,
     *   and return it to the queue. The TTL (`expireAfterMs`) keeps ticking.
     * - `'fail'` — close the assignment as failed in the completed store.
     * - `'park'` — hold the assignment out of matching (see parked store).
     * @default 'notify'
     */
    onCompletionBreach?: 'notify' | 'requeue' | 'fail' | 'park';
    /**
     * What happens when the rejection budget (`maxRejections`) is exhausted.
     * - `'park'` — move to the parked store; retrievable via
     *   `getParkedAssignments()` / `unparkAssignment()`.
     * - `'fail'` — close the assignment as failed in the completed store.
     * - `'keep'` — keep requeueing (legacy behaviour; makes `maxRejections`
     *   a measurement-only knob).
     * @default 'park'
     */
    onMaxRejections?: 'park' | 'fail' | 'keep';
    /**
     * What happens when the freshness cutoff (`expireAfterMs`) elapses.
     * - `'drop'` — remove the assignment entirely from whichever store it
     *   occupies.
     * - `'park'` — move it to the parked store for operator inspection.
     * @default 'drop'
     */
    onExpire?: 'drop' | 'park';
}

/**
 * When an assignment may be offered at all.
 *
 * EscalationPolicy owns the response clock, SlaPolicy owns the post-accept
 * contract; SchedulePolicy owns the offer window: when the work becomes
 * visible to matching (`notBefore`) and how long an offer may go un-accepted
 * (`notAfter`). Acceptance ends the schedule's authority — completion
 * pressure is `sla.completeWithinMs`'s job.
 *
 * A held assignment lives in a dedicated scheduled store, invisible to every
 * matching path (including workflow targeting) until the scheduled sweep
 * activates it. The wait clock and the SLA freshness TTL both anchor at
 * activation, not creation. Timers fire with sweep granularity (see
 * `startMaintenance()` / `runMaintenanceOnce()` / `processScheduledAssignments()`).
 *
 * A single policy is one offer window. Repeating work is a *recurring
 * assignment* (`addRecurringAssignment`): a standing template whose sweep
 * materializes each occurrence as an ordinary scheduled assignment carrying
 * one of these policies — see `RecurrencePolicy`.
 *
 * @example
 * ```typescript
 * await matcher.addAssignment({
 *     id: 'callback-42',
 *     tags: ['callbacks'],
 *     schedule: {
 *         notBefore: Date.parse('2026-08-07T09:00:00Z'), // hidden until 9:00
 *         notAfter: Date.parse('2026-08-07T11:00:00Z'),  // parked if nobody accepted by 11:00
 *     },
 * });
 * matcher.startMaintenance(); // schedule clocks are swept by the maintenance tick
 * ```
 */
export interface SchedulePolicy {
    /**
     * Epoch milliseconds before which the assignment is held out of the
     * queue entirely — no matching, no workflow targeting, no wait clock.
     * The scheduled sweep enqueues it once the time arrives.
     */
    notBefore?: number;
    /**
     * Epoch milliseconds after which a still un-accepted assignment
     * (scheduled, queued, or pending) is taken out of rotation by the
     * scheduled sweep, applying `onMiss`. Acceptance kills this clock.
     * Valid without `notBefore` (a pure absolute offer deadline). When both
     * are present, `notAfter` must be greater than `notBefore` or the whole
     * policy is ignored.
     */
    notAfter?: number;
    /**
     * What happens when `notAfter` elapses un-accepted.
     * - `'park'` — move to the parked store for operator inspection;
     *   retrievable via `getParkedAssignments()` / `unparkAssignment()`.
     * - `'drop'` — remove the assignment entirely.
     * @default 'park'
     */
    onMiss?: 'park' | 'drop';
}

/**
 * How a recurring assignment repeats.
 *
 * A recurring assignment (`addRecurringAssignment`) is a standing template,
 * not a matchable assignment: the recurrence sweep materializes each
 * occurrence as an ordinary assignment whose `schedule` is derived from this
 * policy (`notBefore` = the slot's open time, `notAfter` = open + `windowMs`).
 * Occurrence ids are deterministic — `<templateId>@<openEpochMs>` — so a
 * crashed sweep re-materializing a slot is an idempotent re-add.
 *
 * The sweep keeps the *next* occurrence materialized one interval ahead of
 * its open time, so upcoming work is visible in the scheduled store (and in
 * any host UI reading it) before the window opens. Slots are aligned to
 * `startAt + k × everyMs` and never drift, whatever the sweep cadence.
 *
 * @example
 * ```typescript
 * await matcher.addRecurringAssignment({
 *     id: 'blog-draft',
 *     tags: ['blog'],
 *     recurrence: {
 *         everyMs: 14 * 24 * 3600_000,   // biweekly
 *         startAt: Date.parse('2026-09-07T09:00:00Z'),
 *         windowMs: 3 * 24 * 3600_000,   // each occurrence offered for 3 days
 *         onMiss: 'park',
 *     },
 * });
 * matcher.startMaintenance(); // the recurrence sweep rides the maintenance tick
 * ```
 */
export interface RecurrencePolicy {
    /** Milliseconds between one occurrence's window opening and the next. Minimum 1000. */
    everyMs: number;
    /**
     * How many occurrences one `everyMs` period contains, spread evenly across
     * it: occurrence *k* opens at `startAt + k × everyMs / times`. This is what
     * "twice a week" means — `{ everyMs: 7 × 86400_000, times: 2 }` — without
     * the caller hand-dividing the period into an interval that no longer reads
     * back as the cadence they asked for.
     *
     * The derived gap is what every other field is measured against: it must
     * still be at least 1000 ms, and `windowMs` is an occurrence's own offer
     * window, not the period's. `maxOccurrences` and `until` stay totals across
     * every occurrence, whichever period it falls in.
     * @default 1
     */
    times?: number;
    /**
     * Epoch ms the first occurrence's window opens.
     * @default now — the first sweep materializes an occurrence immediately
     */
    startAt?: number;
    /**
     * Offer window per occurrence: the occurrence's `schedule.notAfter` is its
     * open time plus this. Omitted, an occurrence never expires off the offer
     * clock (and under `catchUp: 'skip'` an unmaterialized slot goes stale the
     * moment its successor's time arrives).
     */
    windowMs?: number;
    /** Per-occurrence miss policy (see `SchedulePolicy.onMiss`). @default 'park' */
    onMiss?: 'park' | 'drop';
    /** Stop recurring: no occurrence opens after this epoch ms; the template retires. */
    until?: number;
    /** Stop recurring after this many occurrences have been materialized. */
    maxOccurrences?: number;
    /**
     * What to do with slots whose time already passed when the sweep runs
     * (host downtime):
     * - `'skip'` — materialize only slots whose window is still open; fully
     *   elapsed slots are skipped without counting against `maxOccurrences`.
     *   A revived host resumes the cadence instead of flooding the queue.
     * - `'all'` — materialize every elapsed slot; ones whose window already
     *   closed are immediately missed by the schedule sweep (parked/dropped
     *   per `onMiss`), which is the audit-trail reading of a dead interval.
     * @default 'skip'
     */
    catchUp?: 'skip' | 'all';
}

/**
 * A standing template that repeats. Everything an `Assignment` carries —
 * tags, priority, SLA, escalation, vetoes, geo — is inherited by every
 * occurrence; `schedule` is generated per occurrence from `recurrence`, so
 * the template itself cannot carry one.
 */
export type RecurringAssignment = Assignment & {
    recurrence: RecurrencePolicy;
    /** Generated per occurrence from `recurrence` — a template cannot carry its own. */
    schedule?: never;
};

/** A stored recurring template plus its clock, from `getRecurringAssignment()` / `listRecurringAssignments()`. */
export interface RecurringAssignmentRecord {
    template: RecurringAssignment;
    /** Epoch ms the next occurrence's window opens */
    nextAt: number;
    /** Occurrences materialized so far (skipped slots do not count) */
    occurrences: number;
}

/** Outcome of one `processRecurringAssignments()` sweep. */
export type RecurrenceSweepResult = {
    /** Occurrences materialized as assignments this pass */
    materialized: number;
    /** Templates retired (`until` passed or `maxOccurrences` reached) */
    retired: number;
};

/** Outcome of one `processCompletedAssignmentsRetention()` sweep. */
export type RetentionSweepResult = {
    /** Completed assignments whose terminal timestamp fell outside the window */
    purged: number;
};

/** Aggregate SLO attainment counters from `getSlaStats()`. */
export interface SlaStats {
    /** Total assignments offered (pending) for the scope */
    offers: number;
    /** Assignments accepted before their response deadline */
    acceptedInTime: number;
    /**
     * Pending assignments whose response deadline elapsed. The response clock
     * applies to every assignment (escalation window or `matchExpirationMs`),
     * but like every counter here only SLA-bearing assignments are measured.
     */
    acceptanceBreaches: number;
    /** Accepted assignments whose completion deadline elapsed */
    completionBreaches: number;
    /** Assignments removed/parked by the freshness TTL */
    ttlExpiries: number;
    /** Assignments parked because their rejection budget ran out */
    rejectionParked: number;
    /** Assignments parked/dropped because their offer window (`schedule.notAfter`) closed */
    scheduleMisses: number;
    /** Mean accept latency in ms (acceptedAt - matchedAt), 0 when no data */
    meanAcceptLatencyMs: number;
    /** Mean completion latency in ms (completedAt - acceptedAt), 0 when no data */
    meanCompleteLatencyMs: number;
}

export type GeoMatchResult = {
    eligible: boolean;
    distanceKm?: number;
    effectiveMaxDistanceKm?: number;
};

export type GeoMatchingFunction = (args: {
    user: User;
    assignment: Assignment;
    defaultMaxDistanceKm?: number;
}) => Promise<GeoMatchResult>;

export type Stats = {
    users?: number;
    usersWithoutAssignment?: string[];
    remainingAssignments?: number;
};

/** One user's live load snapshot inside `QueueStats`. */
export type UserLoadInfo = {
    userId: string;
    /** Current pending-backlog depth */
    backlog: number;
    /** Effective cap (per-user `maxBacklogSize` or the matcher-wide default) */
    maxBacklogSize: number;
    paused: boolean;
};

/**
 * Live operational snapshot from `getQueueStats()`: state counts, the age of
 * the longest-waiting unaccepted assignment (queued or pending — the clock
 * starts at first enqueue and survives requeues, stopping only on accept or
 * removal), and per-user load.
 */
export type QueueStats = {
    queued: number;
    pending: number;
    /** Assignments held by `schedule.notBefore`, not yet in the queue */
    scheduled: number;
    /** Age in ms of the oldest not-yet-accepted assignment; null when none */
    oldestWaitingMs: number | null;
    perUser: UserLoadInfo[];
};

export type PendingAssignmentInfo = {
    assignment: Assignment;
    ownerId: string | null;
    pendingForMs: number | null;
    pendingSince: number | null;
    expiresAt: number | null;
};

/** One page of `getCompletedAssignments()`. */
export type CompletedAssignmentPage = {
    /** Terminal assignments, each stamped `_status: 'completed' | 'failed'` */
    assignments: Array<Assignment & { _status?: 'completed' | 'failed' }>;
    /** Opaque cursor for the next page (an entry offset); null on the last page */
    nextCursor: string | null;
    hasMore: boolean;
};

/**
 * Status filter for `getUsersPaginated()`:
 * - `all`: every user in the pool (default)
 * - `active`: not paused
 * - `paused`: currently paused via `pauseUser()`
 * - `idle`: last activity older than `idleForMs` (requires `idleForMs`)
 */
export type UserStatusFilter = 'all' | 'active' | 'paused' | 'idle';

/**
 * Options for `getUsersPaginated()`. Filters compose (logical AND). Filtered
 * pages may return fewer than `limit` users while `hasMore` is still true —
 * keep consuming until `hasMore` is false.
 */
export type UserQueryOptions = {
    /** Opaque cursor from a previous `UserQueryResult.nextCursor` */
    cursor?: string | null;
    /** Page size after filtering, clamped to [1, 1000]; default 100 */
    limit?: number;
    /** Status filter; default 'all' */
    status?: UserStatusFilter;
    /** Idle threshold in ms; implied when `status: 'idle'`, ANDed otherwise */
    idleForMs?: number;
    /** Keep only users with a non-empty pending backlog */
    hasBacklog?: boolean;
    /** Keep only users whose backlog reached their effective cap */
    atCapacity?: boolean;
    /** Include pending/accepted assignment ids for the returned page */
    includeAssignments?: boolean;
    /** Include the total number of users in the pool (unfiltered) */
    includeTotal?: boolean;
};

/** One user's status/workload summary. */
export type UserSummary = {
    userId: string;
    /** The stored user record as written by `addUser()` */
    user: User;
    paused: boolean;
    /** Last `touchUser()` epoch ms; null when never recorded */
    lastActiveAt: number | null;
    /** Pending backlog depth */
    backlog: number;
    /** Number of accepted (in-progress) assignments */
    acceptedCount: number;
    /** Effective cap (per-user `maxBacklogSize` or the matcher-wide default) */
    maxBacklogSize: number;
    /** `backlog >= maxBacklogSize` */
    atCapacity: boolean;
    /** Present only when requested via `includeAssignments` */
    pendingAssignmentIds?: string[];
    /** Present only when requested via `includeAssignments`; newest first */
    acceptedAssignmentIds?: string[];
};

export type UserQueryResult = {
    users: UserSummary[];
    nextCursor: string | null;
    hasMore: boolean;
    /** Total users in the pool (unfiltered); present only when requested */
    total?: number;
};

/** One accepted (in-progress) assignment of a user, newest first. */
export type ActiveAssignmentInfo = {
    assignmentId: string;
    /** Accept epoch ms (score of the accepted index entry) */
    acceptedAt: number;
};

/**
 * Bulk-matching fairness policy. See `MatcherOptions.fairness` for what each
 * value does.
 */
export type FairnessMode = 'first-come' | 'best-match' | 'balanced' | 'spread-work';

/**
 * Runtime-mutable subset of the bulk-matching fairness knobs. Pass any subset
 * to `AssignmentMatcher.setFairnessConfig()` to retune fairness without
 * reconstructing the matcher; each field carries the same semantics as the
 * identically-named `MatcherOptions` field and is picked up on the next
 * `matchUsersAssignments()` call. Absent fields are left unchanged; pass
 * `fairness` or `fairnessMaxPerWindow` as `undefined` explicitly to clear them
 * back to their auto-derived behavior.
 */
export interface FairnessConfig {
    fairness?: FairnessMode;
    enableFairTiebreaker?: boolean;
    fairnessLoadPenalty?: number;
    fairnessTieBand?: number;
    fairnessMaxPerWindow?: number;
    fairnessWindowMs?: number;
}

// ============================================================================
// Decision traces & explainability
// ============================================================================

/**
 * One factor that contributed to (or excluded) a candidate in a routing
 * decision. Discriminated on `kind` so consumers can render/aggregate without
 * string parsing. Positive factors carry their contribution; exclusions carry
 * the rule that fired and the values it compared.
 */
export type MatchTraceReason =
    /** A positive routing weight matched an assignment tag (pattern set when matched via wildcard) */
    | { kind: 'tagWeight'; tag: string; weight: number; pattern?: string }
    /** The internal 'default' tag matched with its implicit weight (enableDefaultMatching) */
    | { kind: 'defaultTag'; weight: number }
    /** Unweighted tag-intersection scoring (users without routingWeights) */
    | { kind: 'tagOverlap'; matchedTags: string[]; overlapRatio: number }
    /** A custom `matchingFunction` produced the score; no further breakdown is available */
    | { kind: 'customScore'; score: number }
    /**
     * A zero-weight routing entry hard-vetoed an assignment tag. `source` is set
     * only for users carrying `learnedRoutingWeights`, and distinguishes a veto
     * the learning layer synthesized from one an operator configured.
     */
    | { kind: 'veto'; tag: string; pattern: string; source?: 'manual' | 'learned' }
    /** The user is in the assignment's `vetoedUsers` list */
    | { kind: 'assignmentVeto' }
    /** The user previously rejected this assignment */
    | { kind: 'rejectedPreviously' }
    /**
     * The user let this assignment's response deadline lapse and is resting
     * before it can be offered to them again (`offerCooldownMs`). `until` is
     * the epoch ms at which they become eligible for it once more.
     */
    | { kind: 'offerCooldown'; until: number }
    /** The user has routingWeights but no positive entries, so nothing is eligible */
    | { kind: 'noPositiveWeights' }
    /** A `skillThresholds` requirement was not met */
    | { kind: 'skillThreshold'; skill: string; required: number; actual: number }
    /** The user's IP is outside the assignment's `allowedCidrs` */
    | { kind: 'cidrMismatch'; ip?: string }
    /** Geo distance evaluation (exclusion when `withinRange` is false) */
    | { kind: 'geoDistance'; distanceKm?: number; maxDistanceKm?: number; withinRange: boolean }
    /** Proximity boost added to the effective priority (`geoScoreWeight`) */
    | { kind: 'geoBoost'; boost: number }
    /** The user's backlog is at `maxUserBacklogSize` */
    | { kind: 'backlogFull'; backlog: number; limit: number }
    /** The user is paused (`pauseUser()`) and receives no new assignments */
    | { kind: 'paused' }
    /** Learning-layer re-ranking contribution (zero influence when `shadowMode`) */
    | { kind: 'learningBoost'; predicted: number; boost: number; shadowMode: boolean }
    /** Deterministic workflow-targeted handoff; tag/weight selection was bypassed */
    | { kind: 'workflowTargeted' }
    /** Operator override via assignToUser(); matching rules were bypassed */
    | { kind: 'manualAssignment'; force: boolean; previousOwnerId: string | null };

/** One user's evaluation within a routing decision or explanation. */
export interface MatchCandidateTrace {
    userId: string;
    /** Whether the user could have received the assignment under the hard rules */
    eligible: boolean;
    /** Whether this user actually received (or currently owns) the assignment */
    chosen: boolean;
    /** Pure match score (routing-weight sum or tag-overlap ratio); 0 when excluded */
    score: number;
    /** What arbitration compares: base priority + score + geo boost + learning boost */
    effectivePriority: number;
    reasons: MatchTraceReason[];
}

/** How the winning user of a decision was arbitrated. */
export type MatchDecisionMode = FairnessMode | 'direct' | 'workflow' | 'manual';

/**
 * The auditable record of one routing decision, captured while the decision
 * was made (not reconstructed after the fact). `candidates` holds every user
 * evaluated in the matching pass plus users excluded by hard rules (vetoes,
 * prior rejections); users that were never candidates for the assignment do
 * not appear.
 */
export interface MatchDecisionTrace {
    id: string;
    assignmentId: string;
    chosenUserId: string;
    matchedAt: number;
    mode: MatchDecisionMode;
    /** Chosen candidate first, then eligible candidates by effective priority */
    candidates: MatchCandidateTrace[];
}

/**
 * On-demand answer to "who could receive this assignment, and why (not)?" —
 * recomputed from live state by `explainMatch()`. For matched assignments the
 * current owner is flagged `chosen`; for the record of the decision as it
 * actually happened, use decision traces instead.
 */
export interface MatchExplanation {
    assignmentId: string;
    status: 'queued' | 'pending' | 'accepted' | 'completed' | 'scheduled' | 'not_found';
    /**
     * Current owner for pending assignments and completer for completed ones.
     * `null` while queued and for accepted assignments (ownership metadata is
     * released on acceptance — consult decision traces for the full history).
     */
    ownerId: string | null;
    evaluatedAt: number;
    candidates: MatchCandidateTrace[];
}

/** Input for `AssignmentMatcher.previewMatch()`: describe a hypothetical assignment. */
export interface MatchPreviewInput {
    tags: string[];
    priority?: number;
    skillThresholds?: Record<string, number>;
    allowedCidrs?: string[];
    vetoedUsers?: string[];
    latitude?: number;
    longitude?: number;
    maxDistanceKm?: number;
    requireGeo?: boolean;
}

/** Output of `AssignmentMatcher.previewMatch()`: ranked candidates for a hypothetical assignment. */
export interface MatchPreview {
    tags: string[];
    priority: number;
    evaluatedAt: number;
    candidates: MatchCandidateTrace[];
}

/**
 * One finding from the pre-flight checks (`lintAssignment()` /
 * `AssignmentMatcher.checkAssignmentReadiness()`). `error` means the
 * assignment cannot be served as declared; `warning` means it will behave
 * in a way that is probably not intended; `info` is worth knowing.
 */
export interface AssignmentLintIssue {
    severity: 'error' | 'warning' | 'info';
    code:
        | 'no-tags'
        | 'schedule-window-inverted'
        | 'schedule-ignored'
        | 'schedule-window-elapsed'
        | 'schedule-notbefore-past'
        | 'offer-window-tight'
        | 'schedule-notafter-shadowed-by-sla-ttl'
        | 'sla-ignored'
        | 'escalation-ignored'
        | 'duplicate-id'
        | 'tag-uncovered'
        | 'no-eligible-users';
    /** Human-readable explanation, safe to surface to operators */
    message: string;
    /** The tag concerned, for tag-scoped issues */
    tag?: string;
}

/** Context for the pure `lintAssignment()` checks. */
export interface AssignmentLintContext {
    /** Reference time in epoch ms (default: `Date.now()`) */
    now?: number;
    /** Fallback response deadline when no escalation policy declares one */
    matchExpirationMs?: number;
    /** Whether the matcher injects the `default` tag */
    enableDefaultMatching?: boolean;
}

/** Output of `AssignmentMatcher.checkAssignmentReadiness()`. */
export interface AssignmentReadinessReport {
    /** Policy lint findings plus live findings (coverage, duplicates, eligibility) */
    issues: AssignmentLintIssue[];
    /** Users eligible for the assignment right now (same rules as `previewMatch()`) */
    eligibleUserCount: number;
    /** Assignment tags no active (non-paused) user can currently serve */
    uncoveredTags: string[];
    evaluatedAt: number;
}

/** Options for `AssignmentMatcher.auditQueue()`. */
export interface QueueAuditOptions {
    /** Examine at most this many queued assignments, longest-waiting first. @default 100 */
    limit?: number;
    /** Only examine assignments that have waited at least this long. @default 0 */
    minWaitingMs?: number;
    /** Also return entries that do have eligible users. @default false */
    includeHealthy?: boolean;
}

/** One queued assignment's stuck-analysis from `auditQueue()`. */
export interface QueueAuditEntry {
    assignmentId: string;
    tags: string[];
    /** Ms since first enqueue; null when the wait-clock entry is missing */
    waitingMs: number | null;
    /** Users eligible right now under the full hard rules */
    eligibleUserCount: number;
    /** Assignment tags no active (non-paused) user can currently serve */
    uncoveredTags: string[];
    /**
     * Why users are blocked: `MatchTraceReason` kind → how many users it
     * blocks (e.g. `{ backlogFull: 3, paused: 1 }`). Users excluded purely
     * by tag/weight mismatch are counted under `noTagMatch`.
     */
    blockers: Record<string, number>;
}

/** Output of `AssignmentMatcher.auditQueue()`: stuck work plus unswept clocks. */
export interface QueueAuditReport {
    evaluatedAt: number;
    /** Queued assignments examined (after `limit` / `minWaitingMs`) */
    scanned: number;
    /** Assignments nobody can take right now (plus healthy ones when requested) */
    entries: QueueAuditEntry[];
    /**
     * Past-due entries sitting in each deadline index. Nonzero values that
     * persist across calls mean nothing is sweeping — check that
     * `startMaintenance()` (or a `runMaintenanceOnce()` tick) is running.
     */
    sweepBacklog: {
        scheduleActivations: number;
        scheduleMisses: number;
        responseDeadlines: number;
        completionDeadlines: number;
        slaExpiries: number;
    };
}

/** Filters for `getDecisionTraces()`. */
export interface DecisionTraceQuery {
    /** Only traces for this assignment (an assignment re-queued and re-matched has several) */
    assignmentId?: string;
    /** Only traces where this user was chosen */
    userId?: string;
    /** Maximum traces returned (default 50), newest first */
    limit?: number;
}

export type AssignmentLifecycleEvent =
    | { kind: 'pending'; taskId: string; workerId: string; matchedAt: number; expiresAt: number }
    | { kind: 'expired'; taskId: string; workerId: string | null; expiredAt: number }
    /**
     * A pending or accepted task was taken back off its holder without them
     * refusing it. `'idle'` is the inactivity sweep, `'operator'` an explicit
     * redistribution, and `'retagged'` an `updateAssignment` whose new routing
     * tags no longer reach the person holding it — in every case the task goes
     * straight back to the queue rather than anywhere terminal.
     */
    | {
          kind: 'released';
          taskId: string;
          workerId: string;
          /**
           * `reassigned` is the only one that can name a worker who had
           * *accepted* the task: an operator moved work that was already under
           * way. The others release an unanswered offer.
           */
          reason: 'idle' | 'operator' | 'retagged' | 'reassigned';
          releasedAt: number;
      }
    | { kind: 'accepted'; taskId: string; workerId: string; acceptedAt: number }
    | { kind: 'rejected'; taskId: string; workerId: string; rejectedAt: number }
    | { kind: 'completed'; taskId: string; workerId: string; completedAt: number }
    /**
     * The accepting user reported the work could not be done
     * (`failAssignment`). The counterpart to `completed`, and distinct from
     * `completionBreached` with `action: 'fail'`: that one is a deadline the
     * policy acted on, this one is a person saying so. The record stays in the
     * completed store carrying `_failedBy` / `_failureReason`, so no snapshot
     * is needed.
     */
    | { kind: 'failed'; taskId: string; workerId: string; reason?: string; failedAt: number }
    /**
     * An `EscalationPolicy` moved an unanswered assignment on. Always follows
     * the `expired` event for the same assignment — `expired` says the deadline
     * elapsed, `escalated` says what the policy did about it.
     */
    | {
          kind: 'escalated';
          taskId: string;
          fromWorkerId: string | null;
          /** Level after this hop; 1 is the first escalation */
          level: number;
          /** Whether the timed-out owner was blocked from winning it back */
          blockedPreviousOwner: boolean;
          reason: 'no-response';
          escalatedAt: number;
      }
    /** The ladder ran out of hops. `parked` reflects the policy's `onExhausted`. */
    | { kind: 'escalationExhausted'; taskId: string; level: number; parked: boolean; at: number }
    /**
     * An accepted assignment's completion deadline (`sla.completeWithinMs`)
     * elapsed. `action` is what the policy did about it.
     */
    | {
          kind: 'completionBreached';
          taskId: string;
          workerId: string | null;
          action: 'notify' | 'requeue' | 'fail' | 'park';
          /** The assignment as it stood when the deadline elapsed. See the note below. */
          assignment: Assignment;
          at: number;
      }
    /**
     * The freshness TTL (`sla.expireAfterMs`) elapsed; the assignment was
     * removed from whichever store it occupied.
     */
    | {
          kind: 'slaExpired';
          taskId: string;
          ownerId: string | null;
          action: 'drop' | 'park';
          /** The assignment as it stood when the TTL elapsed. See the note below. */
          assignment: Assignment;
          at: number;
      }
    /**
     * The rejection budget (`sla.maxRejections`) ran out; the assignment was
     * pulled from rotation.
     */
    | {
          kind: 'rejectionBudgetExhausted';
          taskId: string;
          rejections: number;
          action: 'park' | 'fail';
          /** The assignment as it stood when the budget ran out. See the note below. */
          assignment: Assignment;
          at: number;
      }
    /**
     * A held assignment's `schedule.notBefore` arrived; the scheduled sweep
     * enqueued it. The assignment is now fetchable in the queued store.
     */
    | { kind: 'scheduleActivated'; taskId: string; at: number }
    /**
     * The offer window (`schedule.notAfter`) elapsed while the assignment
     * was still un-accepted. `state` is where it was caught; `action` is
     * what the policy did about it.
     */
    | {
          kind: 'scheduleMissed';
          taskId: string;
          /** Pending owner at miss time, null when scheduled or queued */
          ownerId: string | null;
          state: 'scheduled' | 'queued' | 'pending';
          action: 'park' | 'drop';
          /** The assignment as it stood when the window closed. See the note below. */
          assignment: Assignment;
          at: number;
      }
    /**
     * The recurrence sweep materialized one occurrence of a recurring
     * assignment. `taskId` is the occurrence (an ordinary assignment, now in
     * the scheduled store or the queue); `recurringId` is the template it was
     * cut from. Hosts that keep per-task context (titles, descriptions) copy
     * it from the template to the occurrence on this event.
     */
    | {
          kind: 'recurrenceMaterialized';
          taskId: string;
          recurringId: string;
          /** 1-based index of this occurrence among those materialized */
          occurrence: number;
          /** Epoch ms the occurrence's offer window opens (its `schedule.notBefore`) */
          opensAt: number;
          at: number;
      }
    /** A recurring template reached its bound (`until` / `maxOccurrences`) and was removed. */
    | {
          kind: 'recurrenceRetired';
          recurringId: string;
          reason: 'until' | 'maxOccurrences';
          /** Total occurrences the template materialized over its life */
          occurrences: number;
          at: number;
      };

/*
 * Why the three SLA events and `scheduleMissed` carry a full `assignment`
 * and the others do not: they are the only ones that can *destroy* the
 * record. `onExpire: 'drop'` / `onMiss: 'drop'` remove the assignment
 * outright, and by the time the handler runs there is nothing left to read —
 * a host that wants to archive the outcome would have only an id. Every
 * other event leaves the assignment somewhere the host can still fetch it
 * (queued, pending, accepted, parked, or the completed store).
 */

/** Outcome of one `processResponseDeadlines()` sweep. */
export type EscalationSweepResult = {
    /** Pending assignments whose response deadline elapsed */
    expired: number;
    /** How many of those an escalation policy moved to the next hop */
    escalations: number;
    /** How many exhausted their ladder and were parked */
    parked: number;
};

/** Outcome of one `processCompletionDeadlines()` sweep. */
export type CompletionDeadlineSweepResult = {
    /** Accepted assignments whose completion deadline elapsed */
    breached: number;
};

/** Outcome of one `processSlaExpiries()` sweep. */
export type SlaExpirySweepResult = {
    /** Assignments whose freshness TTL elapsed */
    expired: number;
};

/** Outcome of one `processScheduledAssignments()` sweep. */
export type ScheduleSweepResult = {
    /** Held assignments whose `notBefore` arrived and were enqueued */
    activated: number;
    /** Un-accepted assignments whose `notAfter` elapsed (parked or dropped) */
    missed: number;
};

/** One pass of `runMaintenanceOnce()`. Counts are per pass, not cumulative. */
export type MaintenanceReport = {
    /** Pending assignments whose response deadline elapsed */
    expiredMatches: number;
    /** How many of those an escalation policy moved on */
    escalations: number;
    /** How many exhausted their ladder and were parked */
    parked: number;
    /** Workflow steps whose timeout fired */
    expiredSteps: number;
    /** Idle users removed from the pool (see `idleUserTimeoutMs`) */
    releasedIdleUsers: number;
    /** Accepted assignments whose completion deadline elapsed (SLA) */
    completionBreaches: number;
    /** Assignments whose freshness TTL elapsed (SLA) */
    slaExpiries: number;
    /** Held assignments enqueued by the scheduled sweep */
    scheduleActivations: number;
    /** Assignments whose offer window (`schedule.notAfter`) elapsed */
    scheduleMisses: number;
    /** Occurrences materialized from recurring assignments */
    recurrenceMaterializations: number;
    /** Recurring templates retired (bound reached) */
    recurrenceRetirements: number;
    /** Completed assignments removed by the retention sweep */
    retentionPurged: number;
    /** Wall-clock duration of the pass */
    tookMs: number;
};

/** Which sweeps `startMaintenance()` runs, and how often. */
export type MaintenanceOptions = {
    /** Master tick interval for every enabled sweep. @default 5000 */
    intervalMs?: number;
    /** Response deadlines / escalation. @default true */
    responseDeadlines?: boolean;
    /** Completion deadlines (SLA `completeWithinMs`). @default true */
    completionDeadlines?: boolean;
    /** Freshness TTL expiries (SLA `expireAfterMs`). @default true */
    slaExpiries?: boolean;
    /** Scheduled-assignment activations and offer-window misses. @default true */
    scheduled?: boolean;
    /** Recurring-assignment materialization. @default true */
    recurrence?: boolean;
    /** Workflow step timeouts. @default true when `enableWorkflows` */
    workflowStepTimeouts?: boolean;
    /** Idle-user release. @default true when `idleUserTimeoutMs` is set */
    idleUsers?: boolean;
    /**
     * Completed-assignments retention sweep (`completedAssignmentsRetentionMs`).
     * @default true when `completedAssignmentsRetentionMs` is set
     */
    completedRetention?: boolean;
};

export type MatcherOptions = {
    relevantBatchSize?: number;
    redisPrefix?: string;
    maxUserBacklogSize?: number;
    enableDefaultMatching?: boolean;
    matchExpirationMs?: number;
    /**
     * Milliseconds a user who let a response deadline lapse is held out of
     * matching for *that* assignment. Applies to every assignment without its
     * own `escalation.offerCooldownMs`.
     *
     * Off by default (`0`), preserving the documented behaviour that an
     * unanswered assignment returns to the open pool and the same user may win
     * it straight back. Set it when a single eligible worker who never answers
     * would otherwise be re-offered the same work on every pass.
     *
     * Never applies to operator overrides (`assignToUser`) or workflow-targeted
     * grants, and is skipped entirely when the assignment's policy already says
     * `onNoResponse: 'block'`.
     * @default 0
     */
    offerCooldownMs?: number;
    /**
     * Opt-in idle user auto-rejection. When set, users that have pending
     * (not yet accepted/rejected) assignments and show no activity for this
     * many milliseconds are removed from the matching pool by
     * processIdleUsers(), and their pending assignments are requeued.
     * Disabled when undefined (default), preserving existing behavior.
     */
    idleUserTimeoutMs?: number;
    prioritizationFunction?: (...args: (Assignment | undefined)[]) => Promise<number>;
    matchingFunction?: (
        user: User,
        assignmentTags: string,
        assignmentPriority: number | string,
        assignmentId?: string,
        skillThresholds?: Record<string, number>,
    ) => Promise<[number, number]>;
    /**
     * Opt-in global best-match arbitration for bulk matching (default: false,
     * preserving existing behavior). When `matchUsersAssignments()` is called
     * with no userId, every eligible user is normally evaluated in parallel
     * and independently claims every assignment they qualify for — when two
     * or more users are eligible for the same assignment, whichever user's
     * claim reaches Redis first wins, regardless of their relative score.
     * With this enabled, candidates are instead collected across *all* users
     * first, sorted by score descending, and claimed greedily in that order —
     * so the best-fit eligible candidate wins each assignment deterministically.
     * Uses plain weighted-tag/geo score (the same formula as the non-learning
     * path) as the fairness comparator; the contextual-bandit learning layer,
     * if enabled, still re-ranks each user's own accepted backlog ordering but
     * does not influence which user wins a contested assignment in this mode.
     */
    enableFairTiebreaker?: boolean;
    /**
     * One-word fairness policy for bulk matching — the friendly alternative
     * to tuning `enableFairTiebreaker` / `fairnessLoadPenalty` /
     * `fairnessTieBand` by hand:
     *
     * - `'first-come'` (default): whoever's claim reaches Redis first wins a
     *   contested assignment — fastest, but the winner is arbitrary.
     * - `'best-match'`: the highest-scoring eligible user wins every
     *   contested assignment, deterministically.
     * - `'balanced'`: best match wins, but near-ties (scores within ~5% of
     *   the typical candidate score) go to whoever is carrying less work.
     * - `'spread-work'`: work is spread as evenly as skills allow — each
     *   assignment already on someone's plate discounts their next bid by
     *   half the typical candidate score, so being good (and fast) doesn't
     *   mean drowning in work while capable teammates sit idle.
     *
     * The underlying numbers are derived automatically from the candidate
     * scores of each matching pass, so there is nothing to calibrate.
     * `'balanced'` and `'spread-work'` also include a rolling-window
     * guardrail by default: nobody receives at more than double the team's
     * average grant rate over `fairnessWindowMs` (one hour unless changed) —
     * see `fairnessMaxPerWindow` to set an explicit ceiling instead, or pass
     * `Infinity` there to opt out.
     * Setting `fairnessLoadPenalty` / `fairnessTieBand` explicitly overrides
     * the derived values; setting `fairness` overrides
     * `enableFairTiebreaker`. Switchable at runtime via `setFairness(mode)`;
     * every fairness knob (not just the mode) can be retuned live with
     * `setFairnessConfig(config)`.
     */
    fairness?: FairnessMode;
    /**
     * Hard cap on how many assignments a single user may be granted within a
     * rolling time window (default: undefined, disabled; applies in any
     * `fairness` mode other than `'first-come'`). The backlog cap alone can't
     * protect diligent users: someone who accepts and completes work quickly
     * keeps freeing backlog slots and keeps winning, so speed is rewarded
     * with ever more work. This cap counts *granted* assignments over
     * `fairnessWindowMs` regardless of how fast they were cleared; once a
     * user hits it, contested assignments spill to the next-best eligible
     * user (or stay queued) until the window rolls. Workflow-targeted
     * assignments are direct handoffs and bypass the cap so workflows never
     * stall.
     *
     * When left undefined, the `'balanced'` / `'spread-work'` presets supply
     * a team-relative guardrail automatically: `max(maxUserBacklogSize,
     * 2 x the team's average grants in the window)`, recomputed each pass, so
     * it adapts to any deployment's volume without configuration. Set an
     * explicit number to pin the ceiling, or `Infinity` to disable the
     * window cap entirely.
     */
    fairnessMaxPerWindow?: number;
    /**
     * Rolling window length in milliseconds for `fairnessMaxPerWindow`
     * (default: 3600000 — one hour).
     */
    fairnessWindowMs?: number;
    /**
     * Load-penalized scoring for fair-tiebreaker arbitration (default: 0,
     * disabled; requires `enableFairTiebreaker`). Each assignment already on
     * a user's backlog — including ones won earlier in the same matching
     * pass — subtracts this amount from their effective score when competing
     * for the next contested assignment. Pure best-score-wins arbitration
     * otherwise saturates the top scorer to `maxUserBacklogSize` every pass;
     * a penalty makes distribution progressive: the specialist still wins
     * their first picks, but once loaded they lose marginal contests to an
     * idle, still-capable candidate. Pick a value relative to your score
     * scale (base priority + summed routing weights).
     */
    fairnessLoadPenalty?: number;
    /**
     * Tie-band arbitration for fair-tiebreaker mode (default: 0, disabled;
     * requires `enableFairTiebreaker`). Candidate scores falling in the same
     * band-sized bucket (`floor(score / fairnessTieBand)`) are treated as
     * tied, and the tie goes to the user currently carrying the least work.
     * Scores in different buckets still resolve strictly by score, so clear
     * skill differences always dominate — only near-ties get load-balanced.
     * Note the bucket boundaries are fixed, so two scores less than a band
     * apart can still straddle a boundary and resolve by score.
     */
    fairnessTieBand?: number;
    // ========== Decision Traces & Explainability ==========
    /**
     * Persist an auditable decision trace for every routing decision
     * (default: false). Each matched assignment gets a `MatchDecisionTrace` —
     * winner, arbitration mode, and every evaluated candidate with score
     * breakdown and exclusion reasons — appended to a capped Redis stream and
     * queryable via `getDecisionTraces()`. Capture happens during the matching
     * pass itself, so the record reflects what the engine actually did rather
     * than a reconstruction. Toggleable at runtime via `setDecisionTraces()`.
     */
    enableDecisionTraces?: boolean;
    /** Maximum decision traces retained in the Redis stream (default: 1000, approximate trim) */
    decisionTraceMaxEntries?: number;
    /**
     * Maximum candidates stored per trace (default: 25). The chosen candidate
     * is always kept; remaining slots go to the highest-ranked candidates.
     */
    decisionTraceMaxCandidates?: number;
    /**
     * Real-time hook invoked with each `MatchDecisionTrace` as decisions are
     * made (e.g. to push onto a socket). Setting it activates trace capture
     * even when `enableDecisionTraces` is false — in that case traces are
     * streamed to the callback only and not persisted. Errors thrown by the
     * callback are swallowed; they never affect matching.
     */
    onMatchDecision?: (trace: MatchDecisionTrace) => void;

    /** Enable distance-based geolocation matching (default: false) */
    enableGeoMatching?: boolean;
    /** Global fallback cap in kilometers when assignment/user-specific caps are absent */
    geoDefaultMaxDistanceKm?: number;
    /** Proximity boost weight added to combined priority (default: 0) */
    geoScoreWeight?: number;
    /** Custom geolocation matcher override */
    geoMatchingFunction?: GeoMatchingFunction;
    /** Enable workflow orchestration features */
    enableWorkflows?: boolean;
    /**
     * Real-time hook invoked with every durably-applied workflow transition
     * (run started, step ready/completed/failed/expired, run completed/failed/
     * cancelled) — see `WorkflowTransition`. Mirrors `onMatchDecision`'s
     * contract: best-effort, errors are swallowed, never affects processing.
     * This is how a host fans transitions out to webhooks/notifications
     * without reading the Redis stream directly.
     */
    onWorkflowEvent?: (transition: WorkflowTransition) => void;
    /**
     * Real-time hook invoked at assignment lifecycle boundaries for regular
     * (non-workflow-targeted) assignments: a task becomes pending, expires,
     * is released, accepted, rejected, or completed. Best-effort, errors are
     * swallowed, never affects the lifecycle transition. This is how a host
     * schedules pre-expiry reminders and fans out lifecycle notifications.
     */
    onAssignmentLifecycle?: (event: AssignmentLifecycleEvent) => void;
    /** Consumer group name for Redis Streams (defaults to 'orchestrator') */
    streamConsumerGroup?: string;
    /** Consumer name within the group (defaults to random UUID) */
    streamConsumerName?: string;

    // ========== Redis Connection Reliability Options ==========
    /** Maximum number of reconnection attempts (default: 10) */
    redisMaxRetries?: number;
    /** Initial delay between retries in ms (default: 50) */
    redisInitialRetryDelay?: number;
    /** Maximum delay between retries in ms (default: 2000) */
    redisMaxRetryDelay?: number;
    /** Connection timeout in ms (default: 10000) */
    redisConnectTimeout?: number;
    /** Command timeout in ms (default: 3000) */
    redisCommandTimeout?: number;
    /** Enable offline queue for commands during disconnect (default: true) */
    redisEnableOfflineQueue?: boolean;
    /** Enable ready check before considering connection successful (default: true) */
    redisEnableReadyCheck?: boolean;
    /** Health check interval in ms (default: 30000) */
    redisHealthCheckInterval?: number;

    // ========== Workflow Reliability Options ==========
    /** Maximum retries for failed workflow events before moving to DLQ (default: 3) */
    workflowMaxRetries?: number;
    /** TTL for idempotency keys in milliseconds (default: 86400000 = 24h) */
    workflowIdempotencyTtlMs?: number;
    /** Minimum idle time before reclaiming orphaned messages in ms (default: 60000 = 1min) */
    workflowOrphanReclaimMs?: number;
    /** Polling interval for reclaim loop in ms (default: 5000) */
    workflowReclaimPollIntervalMs?: number;
    /** Number of failures before circuit breaker opens (default: 5) */
    workflowCircuitBreakerThreshold?: number;
    /** Time to wait before attempting to close circuit breaker in ms (default: 30000) */
    workflowCircuitBreakerResetMs?: number;
    /** Enable audit trail stream for compliance (default: false) */
    workflowAuditEnabled?: boolean;
    /** Snapshot workflow definitions at instance creation for versioning (default: true) */
    workflowSnapshotDefinitions?: boolean;
    /** Enable OpenTelemetry tracing (default: false) */
    enableOpenTelemetry?: boolean;
    /** Persist circuit breaker state to Redis for distributed awareness (default: false) */
    circuitBreakerPersistState?: boolean;
    /**
     * Share circuit breaker failure counts across replicas via Redis so
     * breakers converge in multi-orchestrator deployments (default: false).
     */
    circuitBreakerShared?: boolean;
    /**
     * TTL applied to terminal (completed/failed/cancelled) workflow instances,
     * including cleanup of registry, per-user, and active-index entries.
     * When unset (default), terminal instances are kept forever.
     */
    workflowInstanceRetentionMs?: number;
    /**
     * Automatically trim the workflow event stream up to the consumption
     * frontier — every entry delivered *and* acknowledged by every consumer
     * group — after event processing and on the orchestrator's reclaim
     * interval (sweep-mode hosts can call `trimWorkflowEventStream()` from
     * their own tick). Because the trim is anchored below every group's
     * oldest unacknowledged entry, trimming can never lose an event; the
     * tradeoff is that the stream still grows while consumers are down. When
     * unset (default), the stream is never trimmed.
     */
    workflowEventStreamAutoTrim?: boolean;
    /**
     * Retention window for the completed-assignments store, in ms. When set,
     * the maintenance tick purges terminal (completed or failed — the store
     * holds both outcomes) assignments whose `_completedAt`/`_failedAt`
     * timestamp is older than the window. The window applies retroactively:
     * records created before this option was configured are purged as soon
     * as they fall outside it, in capped batches per tick. Entries without a
     * terminal timestamp are never deleted. When unset (default), the store
     * is kept forever.
     */
    completedAssignmentsRetentionMs?: number;
    /** Initial backoff delay for scheduled workflow event retries in ms (default: 1000) */
    workflowRetryBackoffMs?: number;
    /** Max stream entries read per orchestrator poll (XREADGROUP COUNT, default: 10) */
    workflowEventBatchSize?: number;
    /** Blocking wait per orchestrator poll in ms (XREADGROUP BLOCK, default: 5000) */
    workflowPollBlockMs?: number;
    /**
     * Per-replica throttle on workflow event processing (events per second).
     * Applies to orchestrator stream consumption and scheduled-retry draining.
     * When unset (default), events are processed as fast as possible.
     */
    workflowMaxEventsPerSecond?: number;
    /** Enable circuit breaker and reliability metrics (default: true when telemetry enabled) */
    enableReliabilityMetrics?: boolean;
    /** Enable graceful degradation mode when Redis is unavailable (default: false) */
    enableGracefulDegradation?: boolean;
    /** Alert threshold for Dead Letter Queue size (default: 100) */
    deadLetterQueueAlertThreshold?: number;

    // ========== Reinforcement Learning Options ==========
    /** Enable the contextual-bandit learning layer (default: false) */
    enableLearning?: boolean;
    /** SGD learning rate for online model updates (default: 0.1) */
    learningRate?: number;
    /** Epsilon-greedy exploration rate in [0, 1] (default: 0.05) */
    learningExplorationRate?: number;
    /** Shadow mode: record decisions and learn, but never alter ranking (default: false) */
    learningShadowMode?: boolean;
    /** Multiplier applied to predicted reward when re-ranking candidates (default: 1) */
    learningBoostFactor?: number;
    /** Override rewards per lifecycle outcome (merged with defaults) */
    learningRewards?: Partial<LearningRewards>;
    /** Custom feature extractor; defaults to tag/skill/overlap/embedding features */
    learningFeatureExtractor?: LearningFeatureExtractor;
    /**
     * Reference duration (ms) used to normalize the `sla:tightness` learning
     * feature (default: 3600000 = 1 hour). An assignment with
     * `sla.completeWithinMs` equal to this value gets tightness 0; shorter
     * deadlines approach 1. Only used by the default feature extractor.
     */
    learningSlaTightnessReferenceMs?: number;
    /** TTL for stored decision contexts in ms (default: 604800000 = 7 days) */
    learningDecisionTtlMs?: number;
    /** Weights applied to named external feedback signals when computing rewards (default weight: 1) */
    learningSignalWeights?: Record<string, number>;
    /** TTL for archived episodes awaiting external feedback in ms (default: 604800000 = 7 days) */
    learningFeedbackTtlMs?: number;
    /**
     * SGD update rule (default: 'normalized').
     *
     * - `'normalized'`: the gradient step is divided by the active feature
     *   vector's squared norm and the update is norm-clipped, so a wide
     *   feature vector cannot make the model diverge.
     * - `'raw'`: the pre-1.16 rule, `w += lr * error * x`. Kept for
     *   reproducing existing models; it diverges once enough features are
     *   active at once (22 unit features at lr 0.1 is already unstable).
     */
    learningUpdateMode?: LearningUpdateMode;
    /** L2 regularization coefficient applied per update (default: 0) */
    learningL2?: number;
    /** Maximum L2 norm of a single model update (default: 1) */
    learningMaxUpdateNorm?: number;
    /** Absolute cap on any single learned weight (default: 100) */
    learningMaxWeightMagnitude?: number;
    /**
     * Maximum absolute contribution the learning layer may add to a
     * candidate's effective priority (default: unbounded for backward
     * compatibility). Set it to keep learned preference from outranking
     * business priority or SLA bands.
     */
    learningMaxBoost?: number;
    /**
     * How reward observations are counted into per-tag evidence
     * (default: 'per-event', the legacy behaviour).
     */
    learningRewardAccounting?: LearningRewardAccounting;
    /**
     * Selection policy over eligible candidates (default: 'jitter', the
     * legacy behaviour). `'epsilon-greedy'` replaces the unlogged positive
     * score jitter with a named policy whose actual selection probability is
     * recorded on every committed decision, which is what off-policy
     * evaluation needs.
     */
    learningExplorationPolicy?: LearningExplorationPolicy;
    /** Random source for exploration; defaults to Math.random. Inject for reproducible tests. */
    learningRng?: () => number;
    /** Opt-in multi-target reward modelling (acceptance / success / quality) */
    learningTargets?: LearningTargetsOptions;
    /**
     * Emit worker-performance features (per-tag acceptance/success rates,
     * handling time, workload, urgency interactions) from aggregates
     * batch-loaded once per matching pass. Requires enableAutoRoutingWeights
     * for the per-tag aggregates. Default: false.
     */
    enableLearningPerformanceFeatures?: boolean;
    /** Shrinkage strength pulling per-worker rates toward the team prior (default: 5) */
    learningPerformancePriorStrength?: number;
    /**
     * Maximum age of an outcome/feedback event relative to its attempt, in ms.
     * Later events are rejected and counted as `staleEvents`
     * (default: the episode feedback TTL).
     */
    learningMaxFeedbackAgeMs?: number;
    /** Reject any single feedback signal whose magnitude exceeds this (default: 1e6) */
    learningMaxSignalMagnitude?: number;
    /** Clamp any computed reward to this magnitude before training (default: 100) */
    learningMaxRewardMagnitude?: number;
    /**
     * Track per-user, per-tag reward statistics and enable automatic
     * routingWeights generation from RL outcomes (requires enableLearning).
     * Default: false.
     */
    enableAutoRoutingWeights?: boolean;
    /** Tuning for automatic routing-weight synthesis (UCB1 policy) */
    autoRoutingWeights?: AutoRoutingWeightsOptions;
    /**
     * Milliseconds between automatic learned routing-weight syncs for all
     * tracked users. When unset (default), sync remains operator-driven.
     * Set on at most one replica per deployment; a Redis lock prevents
     * overlapping runs.
     */
    autoRoutingWeightsSyncIntervalMs?: number;
};

/** @deprecated Use MatcherOptions instead */
export type options = MatcherOptions;

/** Operational metrics for the workflow engine */
export type WorkflowEngineMetrics = {
    /** Number of active workflow instances (from the active-instance index) */
    activeInstances: number;
    /** Number of events waiting in the delayed-retry queue */
    scheduledRetries: number;
    /** Number of events in the Dead Letter Queue */
    deadLetterQueueSize: number;
    /** Total length of the workflow event stream */
    streamLength: number;
    /** Number of pending (delivered but unacknowledged) stream messages */
    streamPending: number;
};

// ============================================================================
// Workflow Types
// ============================================================================

/** Event types for workflow lifecycle */
export type WorkflowEventType = 'STARTED' | 'COMPLETED' | 'REJECTED' | 'EXPIRED' | 'FAILED';

/** Step execution mode */
export type WorkflowTaskType = 'assignment' | 'machine' | 'external';

/** Target user selector for workflow assignment steps */
export type WorkflowTargetUser = 'initiator' | 'previous' | string | { tag: string };

/** Machine task metadata for code-driven workflow steps */
export interface WorkflowMachineTask {
    /** Machine handler identifier (resolver-specific) */
    handler: string;
    /** Optional static input merged with workflow context */
    input?: Record<string, any>;
}

/**
 * External (callback) task metadata: the step is completed by a caller outside
 * the process — a downstream service, an integrator's server, or an AI agent —
 * via `completeWorkflowStep()`/`failWorkflowStep()` rather than an in-process
 * handler. Unlike machine steps, no code needs to be registered with this
 * matcher instance, which is what makes external steps usable from a
 * multi-tenant host (e.g. the platform) that cannot run customer code.
 * External steps require a timeout (`timeoutMs` or the workflow's
 * `defaultTimeoutMs`) so an uncalled-back step cannot hang a run forever.
 */
export interface WorkflowExternalTask {
    /** Caller-facing name identifying what this step asks an external party to do */
    name: string;
    /** Optional static input merged with workflow context, surfaced to the caller */
    input?: Record<string, any>;
}

/** Event published to Redis Streams for workflow orchestration */
export interface WorkflowEvent {
    eventId: string;
    type: WorkflowEventType;
    userId: string;
    assignmentId: string;
    workflowInstanceId?: string;
    stepId?: string;
    timestamp: number;
    payload?: Record<string, any>;
}

/** Routing condition for workflow branching */
export interface WorkflowRouting {
    /** Condition expression evaluated against assignment result (e.g., 'result.score > 80') */
    condition: string;
    /** Target step ID if condition is true */
    targetStepId: string;
}

/** A single step in a workflow definition */
export interface WorkflowStep {
    /** Unique identifier for this step within the workflow */
    id: string;
    /** Human-readable name */
    name: string;
    /** Step execution mode (default: 'assignment') */
    taskType?: WorkflowTaskType;
    /** Assignment template - merged with workflow context when creating the assignment */
    assignmentTemplate?: Partial<Assignment>;
    /** Target user selector: 'initiator' | 'previous' | specific userId | tag-based selector */
    targetUser?: WorkflowTargetUser;
    /** Machine task metadata used for code/task worker execution */
    machineTask?: WorkflowMachineTask;
    /** External (callback) task metadata used when taskType is 'external' */
    external?: WorkflowExternalTask;
    /** Routing rules for branching (evaluated in order, first match wins) */
    routing?: WorkflowRouting[];
    /** Default next step if no routing condition matches (null = end workflow) */
    defaultNextStepId?: string | null;
    /** For parallel execution: IDs of steps to execute simultaneously */
    parallelStepIds?: string[];
    /** For parallel joins: wait for all parallel steps before continuing */
    waitForAll?: boolean;
    /** Failure policy for parallel steps: 'abort' | 'continue' | 'retry' */
    failurePolicy?: 'abort' | 'continue' | 'retry';
    /** Maximum retries for this step (default: 0) */
    maxRetries?: number;
    /** Timeout override for this step in milliseconds */
    timeoutMs?: number;
    /**
     * Step to advance to when this step's timeout expires, instead of the
     * default failure path. The step's outstanding assignment is removed (so a
     * late responder cannot act on a superseded tier) and the run continues at
     * `onTimeoutStepId` with `context._escalatedFrom` set.
     *
     * Requires `timeoutMs` (or the workflow's `defaultTimeoutMs`). Does not
     * consume `maxRetries` — an escalation is not a retry. Not supported on
     * steps that are members of a parallel group.
     */
    onTimeoutStepId?: string;
}

/** A workflow definition (template) */
export interface WorkflowDefinition {
    /** Unique identifier for this workflow definition */
    id: string;
    /** Human-readable name */
    name: string;
    /** Version for schema evolution */
    version: number;
    /** The entry point step ID */
    initialStepId: string;
    /** All steps in this workflow */
    steps: WorkflowStep[];
    /** Default timeout for steps in milliseconds */
    defaultTimeoutMs?: number;
    /**
     * Safety net for `onTimeoutStepId` ladders: once a run has escalated this
     * many times it falls back to the ordinary failure path instead of
     * climbing further, so a mis-wired cycle still terminates.
     * @default 10
     */
    maxEscalationDepth?: number;
    /** Metadata for the workflow */
    metadata?: Record<string, any>;
}

/** User-friendly input shape for registering or executing workflows */
export interface WorkflowDefinitionInput {
    /** Unique identifier for this workflow definition */
    id: string;
    /** Human-readable name */
    name: string;
    /** Version for schema evolution (defaults to 1) */
    version?: number;
    /** The entry point step ID (defaults to the first step ID) */
    initialStepId?: string;
    /** All steps in this workflow */
    steps: WorkflowStep[];
    /** Default timeout for steps in milliseconds */
    defaultTimeoutMs?: number;
    /**
     * Safety net for `onTimeoutStepId` ladders: once a run has escalated this
     * many times it falls back to the ordinary failure path instead of
     * climbing further, so a mis-wired cycle still terminates.
     * @default 10
     */
    maxEscalationDepth?: number;
    /** Metadata for the workflow */
    metadata?: Record<string, any>;
}

/** Compact workflow metadata returned by list endpoints */
export interface WorkflowDefinitionSummary {
    id: string;
    name: string;
}

/** Filters for `listWorkflowInstances()`. */
export interface WorkflowInstanceQuery {
    /** Only instances of this workflow definition */
    workflowDefinitionId?: string;
    /** Only instances in this status */
    status?: WorkflowInstanceStatus;
    /** Maximum instances returned (default 50), newest-created first */
    limit?: number;
    /** Opaque pagination cursor from a previous page's `nextCursor` */
    cursor?: string;
}

/** Paginated result of `listWorkflowInstances()`. */
export interface WorkflowInstancePage {
    instances: WorkflowInstance[];
    /** Present when more instances remain; pass back as `cursor` for the next page */
    nextCursor?: string;
}

/**
 * A durably-applied workflow transition, delivered to `MatcherOptions.onWorkflowEvent`
 * right after it took effect. `instance` is the post-transition snapshot. This is the
 * single fan-out point a host (e.g. the platform) uses to drive webhooks/notifications
 * without parsing the underlying Redis stream itself — mirrors `onMatchDecision`'s
 * contract: fired best-effort, errors thrown by the callback are swallowed and never
 * affect workflow processing.
 */
export type WorkflowTransition = {
    kind:
        | 'run.started'
        | 'step.ready'
        | 'step.completed'
        | 'step.failed'
        | 'step.expired'
        /** A timed-out step escalated forward via `onTimeoutStepId` instead of failing */
        | 'step.escalated'
        | 'run.completed'
        | 'run.failed'
        | 'run.cancelled';
    instance: WorkflowInstance;
    stepId?: string;
    assignmentId?: string;
    payload?: Record<string, any>;
};

/** Status of a workflow instance */
export type WorkflowInstanceStatus = 'active' | 'completed' | 'failed' | 'cancelled';

/** Tracks the state of a parallel execution branch */
export interface ParallelBranchState {
    stepId: string;
    assignmentId: string;
    status: 'pending' | 'completed' | 'failed';
    result?: Record<string, any>;
}

/** A running instance of a workflow */
export interface WorkflowInstance {
    /** Unique identifier for this instance */
    id: string;
    /** Reference to the workflow definition */
    workflowDefinitionId: string;
    /** The user who initiated this workflow */
    initiatorUserId: string;
    /** Current status */
    status: WorkflowInstanceStatus;
    /** Current step ID (null if completed or in parallel execution) */
    currentStepId: string | null;
    /** Current assignment ID being processed */
    currentAssignmentId?: string;
    /** For parallel execution: track all active branches */
    parallelBranches?: ParallelBranchState[];
    /** Persistent context passed between steps */
    context: Record<string, any>;
    /** History of completed steps with their results */
    history: Array<{
        stepId: string;
        assignmentId: string;
        userId: string;
        completedAt: number;
        result?: Record<string, any>;
    }>;
    /** Retry count for current step */
    retryCount: number;
    /** Version for optimistic locking */
    version: number;
    /** Timestamps */
    createdAt: number;
    updatedAt: number;
    /** Snapshot of the workflow definition at instance creation time (for versioning) */
    definitionSnapshot?: WorkflowDefinition;
}

/** Result payload when completing an assignment */
export interface AssignmentResult {
    /** Outcome: success or failure */
    success: boolean;
    /** Arbitrary result data for routing decisions */
    data?: Record<string, any>;
    /** Error message if failed */
    error?: string;
}

// ============================================================================
// Enterprise Reliability Types
// ============================================================================

/** Dead Letter Queue entry for failed events */
export interface DeadLetterEntry {
    /** Original event that failed */
    event: WorkflowEvent;
    /** Reason the event failed */
    reason: string;
    /** Error message if available */
    errorMessage?: string;
    /** Error stack trace if available */
    errorStack?: string;
    /** Timestamp when moved to DLQ */
    movedAt: number;
    /** Number of processing attempts before moving to DLQ */
    retryCount: number;
}

/** Audit trail entry for compliance */
export interface AuditEntry {
    /** Timestamp of the action */
    timestamp: number;
    /** Type of action */
    action: string;
    /** Resource ID (event ID, workflow instance ID, etc.) */
    resourceId: string;
    /** Type of resource */
    resourceType: string;
    /** Consumer ID that processed the event */
    consumerId: string;
    /** Additional details */
    details?: Record<string, any>;
}

/** Circuit breaker state for backpressure management */
export interface CircuitBreakerState {
    /** Current state of the circuit breaker */
    state: 'closed' | 'open' | 'half-open';
    /** Number of consecutive failures */
    failureCount: number;
    /** Timestamp of last failure */
    lastFailureTime: number;
}

/** Reliability metrics for monitoring */
export interface ReliabilityMetrics {
    /** Current circuit breaker state */
    circuitBreakerState: CircuitBreakerState;
    /** Current Dead Letter Queue size */
    deadLetterQueueSize: number;
    /** Whether Redis is considered healthy */
    redisHealthy: boolean;
    /** Number of reconnection attempts since start */
    reconnectCount: number;
    /** Last error message if any */
    lastError?: string;
    /** Timestamp of last successful connection */
    lastConnectedAt: number;
    /** Timestamp of last health check */
    lastHealthCheckAt?: number;
    /** Whether circuit breaker is currently allowing requests */
    circuitBreakerAllowingRequests: boolean;
}

/** Workflow instance with resolved definition for versioning */
export interface WorkflowInstanceWithSnapshot extends WorkflowInstance {
    /** Resolved definition (from snapshot or registry) */
    resolvedDefinition?: WorkflowDefinition;
}

// ============================================================================
// Reinforcement Learning Types
// ============================================================================

/** Assignment lifecycle outcomes that generate learning rewards */
export type LearningOutcome = 'accept' | 'complete' | 'reject' | 'expire' | 'fail';

/** Reward values per lifecycle outcome */
export type LearningRewards = Record<LearningOutcome, number>;

/** Sparse feature vector describing a user/assignment match context */
export type LearningFeatures = Record<string, number>;

/** Minimal assignment context passed to feature extractors */
export interface LearningAssignmentContext {
    id: string;
    tags: string[];
    [key: string]: any;
}

/**
 * Per-pass performance aggregates for one worker, batch-loaded once before
 * scoring so no feature costs a per-candidate Redis read.
 */
export interface LearningWorkerPerformance {
    /** Shrunk P(accept) estimate, per tag and overall */
    acceptanceRate?: Record<string, number>;
    overallAcceptanceRate?: number;
    /** Shrunk P(success | accepted) estimate, per tag and overall */
    successRate?: Record<string, number>;
    overallSuccessRate?: number;
    /** Mean handling time in ms, per tag; absent when unobserved */
    handlingTimeMs?: Record<string, number>;
    /** Number of independent attempts backing the per-tag estimates */
    attempts?: Record<string, number>;
    /** Current backlog size at decision time */
    backlog?: number;
    /** Effective backlog cap for this worker */
    backlogLimit?: number;
}

/** Ambient context available to a feature extractor at decision time */
export interface LearningFeatureContext {
    /** Aggregates for the worker being scored (absent when unavailable) */
    performance?: LearningWorkerPerformance;
    /** Team-wide priors the per-worker estimates are shrunk toward */
    priors?: { acceptanceRate?: number; successRate?: number; handlingTimeMs?: number };
    /** Decision timestamp used for all deadline arithmetic in this pass */
    now?: number;
}

/**
 * Pluggable feature extractor for the learning layer.
 *
 * The third parameter is optional and additive: extractors written against
 * the two-argument signature keep working unchanged.
 */
export type LearningFeatureExtractor = (
    user: User,
    assignment: LearningAssignmentContext,
    context?: LearningFeatureContext,
) => LearningFeatures;

/**
 * Prediction targets the learning layer can model separately.
 *
 * - `acceptance`: will the worker take the offer? One binary label per
 *   committed attempt, resolved by accept / reject / response expiry.
 * - `successGivenAcceptance`: conditional on acceptance, did the work finish?
 *   One binary label per accepted attempt.
 * - `quality`: normalized external quality in [0, 1]. Trained only when a
 *   quality observation actually arrives — missing quality is unknown, never
 *   zero.
 */
export type LearningRewardTarget = 'acceptance' | 'successGivenAcceptance' | 'quality';

/**
 * Multi-target reward configuration (opt-in). When absent the layer keeps
 * the legacy behaviour: one model, one scalar reward per lifecycle outcome.
 */
export interface LearningTargetsOptions {
    /** Targets to model. Default when enabled: acceptance + successGivenAcceptance. */
    targets?: LearningRewardTarget[];
    /**
     * Utility combination used for ranking:
     * `P(accept) * (successWeight * P(success|accept) + qualityWeight * E[quality])`,
     * plus `acceptanceWeight * P(accept)`. Defaults: acceptance 0, success 1,
     * quality 0 (or 1 when `quality` is the only non-acceptance target).
     */
    acceptanceWeight?: number;
    successWeight?: number;
    qualityWeight?: number;
    /** Per-target learning-rate overrides (default: the shared learning rate). */
    learningRates?: Partial<Record<LearningRewardTarget, number>>;
    /**
     * Treat a system-side cancellation (`failAssignment` with
     * `systemFault: true`, SLA expiry of an accepted item) as a
     * `successGivenAcceptance` = 0 label. Default false: a system fault is
     * not the worker's failure, so it produces no label at all.
     */
    systemFaultCountsAsFailure?: boolean;
}

/** Component predictions behind a combined learning utility */
export interface LearningPrediction {
    /** The value used for ranking */
    utility: number;
    /** Per-target component predictions (probabilities for binary targets) */
    components: Partial<Record<LearningRewardTarget, number>>;
}

/**
 * How reward observations are counted into per-user/per-tag statistics.
 *
 * - `per-event` (default, legacy): every lifecycle outcome and every feedback
 *   call is one observation. Multiple events on one attempt inflate the
 *   evidence count.
 * - `per-attempt`: one observation per committed attempt, written at the
 *   terminal outcome with the attempt's accrued reward. Late feedback
 *   *revises* that observation instead of adding another, so evidence counts
 *   are independent attempts — which is what the veto sample floors assume.
 */
export type LearningRewardAccounting = 'per-event' | 'per-attempt';

/** SGD update rule for the online model */
export type LearningUpdateMode = 'raw' | 'normalized';

/** Exploration policy used when selecting among eligible candidates */
export type LearningExplorationPolicy = 'greedy' | 'epsilon-greedy' | 'jitter';

/**
 * In-memory context produced while scoring a candidate and carried to the
 * claim, so a decision is only ever committed for the worker who actually
 * won the assignment.
 */
export interface LearningDecisionContext {
    features: LearningFeatures;
    predictedReward: number;
    /** Per-target component predictions, when multi-target modelling is on */
    components?: Partial<Record<LearningRewardTarget, number>>;
    /** Assignment tags captured at decision time */
    tags?: string[];
    /** Probability with which the policy actually selected this candidate */
    propensity?: number;
    /** Name of the selection policy that produced `propensity` */
    policy?: LearningExplorationPolicy;
    /** Number of admissible candidates the choice was made from */
    candidateCount?: number;
    /** Feature-extractor contract version */
    featureVersion?: number;
    /** Model generation this prediction was made against */
    generation?: number;
}

/** Stored decision context awaiting an outcome */
export interface LearningDecisionRecord {
    /** Unique id of this attempt — the key the record is stored under */
    decisionId: string;
    userId: string;
    assignmentId: string;
    features: LearningFeatures;
    predictedReward: number;
    /** Per-target component predictions, when multi-target modelling is on */
    components?: Partial<Record<LearningRewardTarget, number>>;
    /** Assignment tags captured at decision time (used for auto routing weights) */
    tags?: string[];
    /** Probability with which the policy selected this candidate */
    propensity?: number;
    /** Selection policy that produced `propensity` */
    policy?: LearningExplorationPolicy;
    /** Number of admissible candidates the choice was made from */
    candidateCount?: number;
    /** Feature-extractor contract version */
    featureVersion?: number;
    /** Model generation this decision was committed against */
    generation?: number;
    /** Sum of rewards applied to this attempt so far (per-attempt accounting) */
    accruedReward?: number;
    timestamp: number;
}

/** Archived episode retained after a terminal outcome for late external feedback */
export interface LearningEpisodeRecord {
    /** Unique id of the attempt this episode closes */
    decisionId: string;
    userId: string;
    assignmentId: string;
    features: LearningFeatures;
    /** Terminal outcome that archived this episode */
    outcome?: LearningOutcome;
    /** Assignment tags captured at decision time (used for auto routing weights) */
    tags?: string[];
    /** Model generation this decision was committed against */
    generation?: number;
    /** Reward already written into per-tag statistics (per-attempt accounting) */
    appliedTagReward?: number;
    /** When that per-tag contribution was written (needed to revise it under decay) */
    tagStatsAt?: number;
    timestamp: number;
}

/** Named external signal values (e.g. { accuracy: 0.95, csat: 0.8 }) */
export type LearningSignals = Record<string, number>;

/** Raw training sample for offline/batch model updates */
export interface LearningSample {
    features: LearningFeatures;
    reward: number;
}

/** Per-user, per-tag reward statistics aggregated from lifecycle outcomes */
export interface LearningTagStat {
    tag: string;
    /**
     * Decayed observation weight for this tag. With no decay configured this
     * is the raw observation count; with decay it is the sum of observation
     * weights, which is NOT a sample size — see `effectiveSampleSize`.
     */
    count: number;
    /**
     * Kish effective sample size of the decayed observations,
     * `sum(w)^2 / sum(w^2)`. Equal to `count` without decay. Evidence
     * thresholds (veto sample floors) are judged against this, never the
     * decayed weight sum.
     */
    effectiveSampleSize?: number;
    /** Sum of squared observation weights, retained so `effectiveSampleSize` is computable */
    sumWeightsSq?: number;
    /** Lifetime count of independent attempts observed for this tag, never decayed */
    attempts?: number;
    /** Sum of observed rewards for this tag */
    rewardSum: number;
    /** rewardSum / count (0 when no observations) */
    meanReward: number;
    /** Sum of squared observed rewards (available when reward-squared tracking is enabled) */
    rewardSqSum?: number;
    /** Unix epoch ms of the most recent observation (used for time decay) */
    lastUpdatedAt?: number;
    /** Population variance of observed rewards (0 when absent or single observation) */
    variance?: number;
    /** Standard error of the mean (0 when absent or single observation) */
    standardError?: number;
}

/** Synthesis policy for automatic routing weights. */
export type AutoRoutingWeightsPolicy = 'ucb1' | 'confidence' | 'thompson';

/** Options controlling automatic routing-weight synthesis (UCB1 policy) */
export interface AutoRoutingWeightsOptions {
    /** Minimum observations before a tag's stats are trusted (default: 5) */
    minSamples?: number;
    /** Mean-reward UCB score at or below which a tag is hard-vetoed with weight 0 (default: -0.5) */
    vetoThreshold?: number;
    /** Maximum synthesized weight on the conventional 0-100 scale (default: 100) */
    maxWeight?: number;
    /** UCB exploration coefficient; higher favors less-sampled tags (default: 0.5) */
    explorationBonus?: number;
    /** Optimistic weight assigned to under-sampled or unobserved known tags (default: maxWeight / 2) */
    priorWeight?: number;
    /**
     * Synthesis policy.
     * - 'ucb1' (default): current mean + exploration-bonus mapping.
     * - 'confidence': upper-confidence-bound for weight, lower-confidence-bound for veto.
     * - 'thompson': sample from the per-tag posterior when mapping to a weight.
     */
    policy?: AutoRoutingWeightsPolicy;
    /**
     * Z-score used by the 'confidence' policy for UCB/LCB bounds (default: 1.96).
     * Also reused as the exploration multiplier by 'ucb1' when explorationBonus
     * is omitted and policy is 'confidence' for backward compatibility.
     */
    confidenceZ?: number;
    /**
     * Minimum total samples across all of a user's tags before sync will write
     * any learned weights (default: 0 = off).
     */
    minTotalSamples?: number;
    /**
     * Minimum samples required before a learned veto may override a tag that
     * already has a manual (non-learned) routing weight (defaults to
     * `minSamples`, i.e. 5, for backward compatibility). Raise it — 20 is a
     * reasonable production floor — to make learned vetoes of operator-set
     * weights harder to trigger.
     */
    minSamplesForVeto?: number;
    /**
     * Maximum absolute change allowed per sync on a single learned weight
     * (default: undefined = no clamping). Vetoes that pass the strict veto
     * gate may still jump to 0 despite the clamp.
     */
    maxDeltaPerSync?: number;
    /**
     * Reward-squared half-life in ms for tag statistics. When set, older
     * observations are decayed exponentially on read (default: undefined =
     * no decay).
     */
    decayHalfLifeMs?: number;
    /**
     * If true, only terminal outcomes (complete/reject/expire/fail plus manual
     * rewards/feedback) feed tag statistics; non-terminal 'accept' updates are
     * skipped (default: false).
     */
    terminalOnlyTagStats?: boolean;
    /**
     * Optional random source for Thompson sampling. Defaults to Math.random.
     * Must return values in [0, 1).
     */
    rng?: () => number;
    /**
     * Posterior family used for uncertainty.
     *
     * - `'gaussian'` (default): normal posterior over the mean reward, with a
     *   prior variance floor so repeated identical observations never become
     *   infinitely certain.
     * - `'bernoulli'`: Beta-Bernoulli posterior over rewards rescaled into
     *   [0, 1] by `rewardRange`. Appropriate when the reward really is a
     *   success indicator; do not use it on arbitrary continuous rewards.
     */
    rewardModel?: 'gaussian' | 'bernoulli';
    /**
     * Reward scale `[min, max]` (default `[-1, 1]`). Sets the default prior
     * variance and the mapping used by the `'bernoulli'` reward model.
     * The `'ucb1'` exploration coefficient is only portable within a fixed
     * scale — state it explicitly if your rewards are not in [-1, 1].
     */
    rewardRange?: [number, number];
    /**
     * Prior variance for the `'gaussian'` reward model
     * (default: `((max - min) / 4) ** 2`). Acts as a floor: five identical
     * observations still leave a non-zero standard error, so uncertainty
     * reflects evidence rather than coincidence.
     */
    priorVariance?: number;
    /**
     * Strength of the prior in pseudo-observations (default: 2). Higher
     * values shrink under-sampled tags harder toward the prior.
     */
    priorStrength?: number;
    /**
     * Time after a tag's last observation at which a learned veto lapses and
     * the tag returns at `priorWeight` for reassessment (default: undefined =
     * vetoes never lapse). Prefer setting this over permanent exclusion: a
     * hard veto with no recovery path means a worker who improved, or whose
     * bad run was circumstantial, can never be re-evaluated.
     */
    vetoCooldownMs?: number;
    /**
     * Judge `minTotalSamples` against this count of independent attempts
     * instead of the sum of per-tag counts. One assignment carrying three
     * tags is one attempt, not three, and summing tags lets correlated
     * evidence clear a worker-level floor on its own.
     */
    totalAttempts?: number;
}

/** Per-tag rationale for a synthesized routing weight. */
export interface AutoWeightExplanation {
    tag: string;
    /** The weight this tag was assigned */
    weight: number;
    /** What happened, and why */
    decision: 'veto' | 'scored' | 'prior' | 'cooldown' | 'insufficient-evidence' | 'unobserved';
    /** Posterior mean reward estimate */
    estimate?: number;
    /** Posterior standard error of that estimate */
    uncertainty?: number;
    /** Lower/upper credible bounds at the configured z */
    lowerBound?: number;
    upperBound?: number;
    /** Independent attempts backing the estimate */
    attempts?: number;
    /** Kish effective sample size after decay */
    effectiveSampleSize?: number;
    /** Epoch ms of the most recent observation */
    lastObservedAt?: number;
    /** Configured decay half-life, if any */
    decayHalfLifeMs?: number;
    /** Epoch ms at which a lapsed veto would be reassessed */
    reassessAt?: number;
}

/** Aggregate learning statistics */
export interface LearningStats {
    /** Number of recorded match decisions (== committed attempts) */
    decisions: number;
    /** Number of reward updates applied */
    rewards: number;
    /** Sum of all applied rewards */
    totalReward: number;
    /** totalReward / rewards (0 when no rewards) */
    averageReward: number;
    /** Events rejected as replays of an already-applied event */
    duplicateEvents: number;
    /** Events rejected because their attempt context had expired */
    staleEvents: number;
    /** Events rejected because no attempt context exists for the assignment */
    orphanEvents: number;
    /** Events rejected because the attempt belonged to a superseded model generation */
    supersededEvents: number;
    /** Assignment-addressed feedback rejected as ambiguous between two attempts */
    ambiguousFeedback: number;
    /** Feedback rejected by validation (non-finite, out of range, empty) */
    invalidFeedback: number;
    /** Current model generation (bumped by resetLearningModel) */
    generation: number;
}

// ============================================================================
// Workflow DSL/Builder Types
// ============================================================================

/** Fluent builder for creating workflow steps */
export interface WorkflowStepBuilder {
    /** Set the step name */
    name(name: string): WorkflowStepBuilder;
    /** Set the execution task type */
    taskType(type: WorkflowTaskType): WorkflowStepBuilder;
    /** Set the assignment template */
    assignment(template: Partial<Assignment>): WorkflowStepBuilder;
    /** Configure machine task metadata */
    machineTask(handler: string, input?: Record<string, any>): WorkflowStepBuilder;
    /** Configure this as an external (callback) step, completed via completeWorkflowStep()/failWorkflowStep() */
    external(name: string, input?: Record<string, any>): WorkflowStepBuilder;
    /** Set the target user */
    targetUser(target: 'initiator' | 'previous' | string | { tag: string }): WorkflowStepBuilder;
    /** Add a routing condition */
    when(condition: string, targetStepId: string): WorkflowStepBuilder;
    /** Set the default next step */
    then(stepId: string | null): WorkflowStepBuilder;
    /** Add parallel steps */
    parallel(stepIds: string[]): WorkflowStepBuilder;
    /** Set wait for all parallel steps */
    waitForAll(wait: boolean): WorkflowStepBuilder;
    /** Set failure policy */
    onFailure(policy: 'abort' | 'continue' | 'retry'): WorkflowStepBuilder;
    /** Set max retries */
    retries(count: number): WorkflowStepBuilder;
    /** Set step timeout */
    timeout(ms: number): WorkflowStepBuilder;
    /** Build the step */
    build(): WorkflowStep;
}

/** Fluent builder for creating workflow definitions */
export interface WorkflowDefinitionBuilder {
    /** Set the workflow name */
    name(name: string): WorkflowDefinitionBuilder;
    /** Set the workflow version */
    version(version: number): WorkflowDefinitionBuilder;
    /** Set the initial step ID */
    startWith(stepId: string): WorkflowDefinitionBuilder;
    /** Add a step to the workflow */
    addStep(step: WorkflowStep): WorkflowDefinitionBuilder;
    /** Set default timeout for all steps */
    defaultTimeout(ms: number): WorkflowDefinitionBuilder;
    /** Add metadata */
    metadata(data: Record<string, any>): WorkflowDefinitionBuilder;
    /** Build the workflow definition */
    build(): WorkflowDefinition;
}
