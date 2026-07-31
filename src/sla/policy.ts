/**
 * SLA policy — pure logic.
 *
 * An assignment carries an optional `sla` policy describing its service-level
 * contract: completion deadline (from accept), freshness TTL (from first
 * enqueue), and rejection budget. Everything here is deliberately
 * side-effect free: `AssignmentMatcher` owns the Redis writes, this module
 * owns the decisions.
 *
 * The response/acceptance side is owned by `EscalationPolicy`; SLA starts
 * where escalation stops.
 */

import type { Assignment, SlaPolicy } from '../types/matcher';

/** A policy with every optional field resolved. */
export interface NormalizedSlaPolicy {
    completeWithinMs?: number;
    expireAfterMs?: number;
    maxRejections?: number;
    onCompletionBreach: 'notify' | 'requeue' | 'fail' | 'park';
    onMaxRejections: 'park' | 'fail' | 'keep';
    onExpire: 'drop' | 'park';
}

/** Internal markers the matcher persists on the assignment JSON. */
export const SLA_ENQUEUED_AT_FIELD = '_enqueuedAt';
export const SLA_REJECTION_COUNT_FIELD = '_rejectionCount';
export const SLA_MATCHED_AT_FIELD = '_matchedAt';
export const SLA_ACCEPTED_AT_FIELD = '_acceptedAt';
export const SLA_ACCEPTED_BY_FIELD = '_acceptedBy';

function positiveMs(value: unknown): number | undefined {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : undefined;
}

function nonNegativeInt(value: unknown): number | undefined {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

/**
 * Resolve an assignment's SLA policy, or `null` when it has none (the
 * overwhelming majority of assignments — callers use the null to stay on
 * the untouched legacy path).
 */
export function normalizeSlaPolicy(policy: SlaPolicy | undefined | null): NormalizedSlaPolicy | null {
    if (!policy || typeof policy !== 'object') return null;

    const completeWithinMs = positiveMs(policy.completeWithinMs);
    const expireAfterMs = positiveMs(policy.expireAfterMs);
    const maxRejections = nonNegativeInt(policy.maxRejections);

    if (completeWithinMs === undefined && expireAfterMs === undefined && maxRejections === undefined) {
        return null;
    }

    return {
        completeWithinMs,
        expireAfterMs,
        maxRejections,
        onCompletionBreach:
            policy.onCompletionBreach === 'requeue' ||
            policy.onCompletionBreach === 'fail' ||
            policy.onCompletionBreach === 'park'
                ? policy.onCompletionBreach
                : 'notify',
        onMaxRejections:
            policy.onMaxRejections === 'fail' || policy.onMaxRejections === 'keep' ? policy.onMaxRejections : 'park',
        onExpire: policy.onExpire === 'park' ? 'park' : 'drop',
    };
}

/**
 * Same question, answered from the stored JSON without paying for a parse on
 * the claim/accept hot path. Assignments without an SLA — effectively all of
 * them in a typical deployment — cost one `indexOf` and nothing else.
 */
export function slaFromJson(json: string | null | undefined): NormalizedSlaPolicy | null {
    if (!json || json.indexOf('"sla"') === -1) return null;
    try {
        return normalizeSlaPolicy((JSON.parse(json) as Assignment).sla);
    } catch {
        return null;
    }
}

/** Current rejection count of an assignment (0 = never rejected). */
export function rejectionCountOf(assignment: Assignment): number {
    const raw = Number((assignment as Record<string, any>)[SLA_REJECTION_COUNT_FIELD]);
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

/** Deadline score for the accepted-expiry zset. */
export function completionDeadlineScore(acceptedAt: number, policy: NormalizedSlaPolicy): number | null {
    return policy.completeWithinMs === undefined ? null : acceptedAt + policy.completeWithinMs;
}

/** Deadline score for the TTL zset. */
export function slaExpiryScore(enqueuedAt: number, policy: NormalizedSlaPolicy): number | null {
    return policy.expireAfterMs === undefined ? null : enqueuedAt + policy.expireAfterMs;
}

/** Whether the rejection budget has been exhausted. */
export function rejectionBudgetExhausted(assignment: Assignment, policy: NormalizedSlaPolicy): boolean {
    if (policy.maxRejections === undefined) return false;
    return rejectionCountOf(assignment) >= policy.maxRejections;
}
