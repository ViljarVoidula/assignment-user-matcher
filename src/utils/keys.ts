/**
 * Redis Key Builders
 * Centralized key generation for consistent Redis key naming
 */

export interface RedisKeyConfig {
    prefix: string;
}

/**
 * Creates Redis key builder functions with a given prefix
 */
export function createKeyBuilders(config: RedisKeyConfig) {
    const { prefix } = config;

    return {
        // User keys
        users: () => `${prefix}users`,
        userAssignments: (userId: string) => `${prefix}user:${userId}:assignments`,
        userRejected: (userId: string) => `${prefix}user:${userId}:rejected`,
        userVetoed: (userId: string) => `${prefix}user:${userId}:vetoed`,
        userWindowGrants: (userId: string) => `${prefix}user:${userId}:window-grants`,
        userActivity: () => `${prefix}users:activity`,
        pausedUsers: () => `${prefix}users:paused`,
        // Per-user accepted-work index: zset of RAW assignment ids (unlike
        // the backlog set's `assignment:{id}` members) scored by accept epoch
        // ms. Written on accept, removed on every terminal transition; a
        // member orphaned by a missed removal is filtered against the global
        // acceptedAssignments hash on read and self-healed with a zRem.
        userAcceptedAssignments: (userId: string) => `${prefix}user:${userId}:accepted`,

        // Assignment keys
        assignments: () => `${prefix}assignments`,
        assignmentsRef: () => `${prefix}assignments:ref`,
        assignmentsGeo: () => `${prefix}assignments:geo`,
        assignmentPriority: (id: string) => `${prefix}assignment:${id}:priority`,
        assignmentTags: (id: string) => `${prefix}assignment:${id}:tags`,
        assignmentVetoed: (id: string) => `${prefix}assignment:${id}:vetoed`,

        // Wait-clock zset: assignment id -> first-enqueue ms epoch. Entries
        // survive claim/requeue cycles and are cleared on accept/remove, so
        // the oldest entry is always the longest-waiting unaccepted assignment.
        assignmentsQueuedAt: () => `${prefix}assignments:queuedAt`,

        // Pending/accepted state keys
        pendingAssignmentsData: () => `${prefix}assignments:pending:data`,
        pendingAssignmentsExpiry: () => `${prefix}assignments:pending:expiry`,
        assignmentOwner: () => `${prefix}assignments:pending:owner`,
        acceptedAssignments: () => `${prefix}assignments:accepted`,
        // Assignments whose escalation ladder was exhausted under
        // `onExhausted: 'park'` — held out of matching until unparked.
        parkedAssignments: () => `${prefix}assignments:parked`,

        // Schedule keys
        // Assignments held by schedule.notBefore: raw JSON, invisible to
        // every matching path until the scheduled sweep enqueues it. The
        // ONLY pre-activation storage — no priority/tag/geo/veto side keys
        // exist until activation.
        scheduledAssignments: () => `${prefix}assignments:scheduled`,
        // Activation index: id scored by schedule.notBefore epoch ms.
        scheduledActivateAt: () => `${prefix}assignments:scheduled:activateAt`,
        // Offer-window deadline index: id scored by schedule.notAfter epoch
        // ms. Lives outside :scheduled because it follows the assignment
        // through scheduled -> queued -> pending; cleared on accept (the
        // offer clock dies there). Cannot share assignmentsSlaExpiry: a zset
        // holds one score per member and an assignment can carry both
        // sla.expireAfterMs and schedule.notAfter.
        scheduleNotAfter: () => `${prefix}assignments:schedule:notAfter`,

        // Recurrence keys
        // Standing recurring templates: raw JSON records ({template, nextAt,
        // occurrences}). Never matchable themselves — the recurrence sweep
        // cuts ordinary assignments from them.
        recurringAssignments: () => `${prefix}assignments:recurring`,
        // Sweep index: template id scored by when the next materialization is
        // due (one interval before the occurrence opens). One-shot zRem
        // claims, like scheduledActivateAt; the sweep re-indexes templates
        // that fell out (a crashed pass), so an entry here is a cache, not
        // the source of truth.
        recurringDueAt: () => `${prefix}assignments:recurring:dueAt`,

        // SLA keys
        // Accepted assignments with a completion deadline (sla.completeWithinMs),
        // scored by deadline epoch ms. Only SLA-bearing assignments appear here.
        acceptedAssignmentsExpiry: () => `${prefix}assignments:accepted:expiry`,
        // Assignments with a freshness TTL (sla.expireAfterMs), scored by
        // first-enqueue + TTL. Entries survive requeues and state moves.
        assignmentsSlaExpiry: () => `${prefix}assignments:sla:expiry`,
        // Aggregate SLO counters (global + per-tag)
        slaStats: () => `${prefix}sla:stats`,
        slaTagStats: (tag: string) => `${prefix}sla:tag:${tag}:stats`,

        // Tag keys
        allTags: () => `${prefix}all:tags`,
        tagAssignments: (tag: string) => `${prefix}tag:${tag}:assignments`,

        // Temp keys (for computations)
        tempUserCandidates: (userId: string) => `${prefix}tmp:user:${userId}:candidates`,
        tempUserExclude: (userId: string) => `${prefix}tmp:user:${userId}:exclude`,
        tempUserFinal: (userId: string) => `${prefix}tmp:user:${userId}:final`,

        // Workflow keys
        workflowDefinitions: () => `${prefix}workflows:definitions`,
        workflowDefinition: (id: string) => `${prefix}workflow:${id}:definition`,
        workflowInstances: () => `${prefix}workflows:instances`,
        workflowInstance: (id: string) => `${prefix}workflow:instance:${id}`,
        workflowInstancesByUser: (userId: string) => `${prefix}user:${userId}:workflow:instances`,
        workflowAssignmentLink: (assignmentId: string) => `${prefix}assignment:${assignmentId}:workflow`,
        // All-instance creation-order index, independent of status — backs
        // listWorkflowInstances() pagination. Scored by workflowInstanceSequence()
        // (not raw createdAt) so two runs started in the same millisecond still
        // get strictly distinct, order-preserving scores — required for the
        // cursor's exclusive "less than" range to never skip a same-millisecond
        // entry. workflowInstancesActive() only tracks currently-active instances
        // and isn't sorted for pagination.
        workflowInstancesByTime: () => `${prefix}workflows:instances:byTime`,
        // Monotonic counter backing workflowInstancesByTime's scores.
        workflowInstanceSequence: () => `${prefix}workflows:instances:seq`,

        // Completed assignments store
        completedAssignments: () => `${prefix}assignments:completed`,
        // Terminal-timestamp index for the completed store: assignment id
        // scored by _completedAt/_failedAt epoch ms, written in the same multi
        // as the completed hSet, so the retention sweep reads only eligible
        // entries instead of scanning the whole store every tick.
        completedAssignmentsAt: () => `${prefix}assignments:completedAt`,
        // One-shot marker: the retention sweep's backfill pass (indexing
        // entries written before the index existed) has completed.
        completedRetentionIndexed: () => `${prefix}assignments:completed:retention-indexed`,

        // Decision trace stream (auditable routing decisions)
        decisionTraces: () => `${prefix}decisions:traces`,

        // Redis Streams keys
        eventStream: () => `${prefix}events:stream`,
        eventStreamDeadLetter: () => `${prefix}events:deadletter`,

        // Learning (contextual bandit) keys
        learningModel: () => `${prefix}learning:model`,
        // Committed-attempt context, keyed by DECISION id (one per successful
        // offer), not by assignment id: an assignment that is rejected and
        // rematched produces a second, independent attempt, and feedback for
        // the first must never land on the second.
        learningDecision: (decisionId: string) => `${prefix}learning:decision:${decisionId}`,
        learningEpisode: (decisionId: string) => `${prefix}learning:episode:${decisionId}`,
        // assignment id -> decision id of the attempt currently in flight.
        learningDecisionPointer: (assignmentId: string) => `${prefix}learning:decision:current:${assignmentId}`,
        // assignment id -> decision id of the most recently archived attempt,
        // so assignment-addressed late feedback can still resolve one context.
        learningEpisodePointer: (assignmentId: string) => `${prefix}learning:episode:current:${assignmentId}`,
        // Set of event keys already applied to a decision. SADD returns 0 for
        // a replay, which is what makes outcome ingestion idempotent.
        learningApplied: (decisionId: string) => `${prefix}learning:applied:${decisionId}`,
        // Monotonic model generation. Bumped by resetModel() so decisions
        // committed against the old model cannot repopulate the new one.
        learningGeneration: () => `${prefix}learning:generation`,
        learningStats: () => `${prefix}learning:stats`,
        // Auto routing weights (per-user tag bandit) keys
        learningUsers: () => `${prefix}learning:users`,
        learningUserTagCounts: (userId: string) => `${prefix}learning:user:${userId}:tag:counts`,
        learningUserTagRewards: (userId: string) => `${prefix}learning:user:${userId}:tag:rewards`,
        learningUserTagRewardSq: (userId: string) => `${prefix}learning:user:${userId}:tag:rewards:sq`,
        learningUserTagTs: (userId: string) => `${prefix}learning:user:${userId}:tag:ts`,
        // Sum of squared observation weights per tag; with decay configured
        // this is what makes the Kish effective sample size computable, and
        // the decayed weight sum alone is not a sample size.
        learningUserTagWeightSq: (userId: string) => `${prefix}learning:user:${userId}:tag:w2`,
        // Lifetime independent-attempt counts per tag, never decayed — the
        // denominator veto sample floors are judged against.
        learningUserTagAttempts: (userId: string) => `${prefix}learning:user:${userId}:tag:attempts`,
        // Independent attempts observed for a worker, counted ONCE per
        // attempt however many tags it carried — the denominator worker-level
        // evidence floors are judged against.
        learningUserAttempts: (userId: string) => `${prefix}learning:user:${userId}:attempts`,
        // Per-target model hashes for multi-target reward modelling.
        learningTargetModel: (target: string) => `${prefix}learning:model:${target}`,
        // Batch-loadable per-worker performance aggregates (one hash per
        // worker, one HGETALL per matching pass — never a per-candidate read).
        learningUserPerformance: (userId: string) => `${prefix}learning:user:${userId}:perf`,
        // Team-wide aggregates the per-worker estimates are shrunk toward.
        learningTeamPerformance: () => `${prefix}learning:perf:team`,
        autoWeightsSyncLock: () => `${prefix}autoweights:sync:lock`,

        // Workflow reliability keys
        // Reliability and audit keys
        deadLetterQueue: () => `${prefix}workflow:dlq`,
        processedEvents: () => `${prefix}events:processed`,
        processedEvent: (eventId: string) => `${prefix}events:processed:${eventId}`,
        eventRetryCount: (eventId: string) => `${prefix}events:retries:${eventId}`,
        eventsRetryScheduled: () => `${prefix}events:retries:scheduled`,
        workflowStepExpiry: (instanceId: string, stepId: string) => `${prefix}workflow:${instanceId}:step:${stepId}:expiry`,
        workflowStepExpiryIndex: () => `${prefix}workflow:steps:expiry`,
        workflowInstancesActive: () => `${prefix}workflows:instances:active`,
        workflowAuditStream: () => `${prefix}workflow:audit:stream`,
        circuitBreakerState: () => `${prefix}reliability:circuit-breaker:state`,
        circuitBreakerFailures: () => `${prefix}reliability:circuit-breaker:failures`,
        reliabilityMetrics: () => `${prefix}reliability:metrics`,
    };
}

export type KeyBuilders = ReturnType<typeof createKeyBuilders>;
