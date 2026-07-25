/**
 * Escalation policy — pure logic.
 *
 * An assignment carries an optional `escalation` policy describing what should
 * happen when the user it was matched to lets the response deadline run out.
 * Everything here is deliberately side-effect free: `AssignmentMatcher` owns
 * the Redis writes, this module owns the decisions.
 *
 * The same primitive backs both plain (non-workflow) escalation ladders and,
 * via synthesised policies, workflow steps that escalate on timeout.
 */

import type { Assignment, EscalationPolicy } from '../types/matcher';

/** A policy with every optional field resolved. */
export interface NormalizedEscalationPolicy {
    respondWithinMs: number;
    onNoResponse: 'block' | 'allow';
    priorityBoost: number;
    tiers?: string[][];
    maxEscalations: number;
    onExhausted: 'queue' | 'park';
}

/** Internal marker the matcher persists on the assignment between hops. */
export const ESCALATION_LEVEL_FIELD = '_escalationLevel';

/**
 * Resolve an assignment's policy, or `null` when it has none (the overwhelming
 * majority of assignments — callers use the null to stay on the untouched
 * legacy path).
 */
export function normalizeEscalationPolicy(policy: EscalationPolicy | undefined | null): NormalizedEscalationPolicy | null {
    if (!policy || typeof policy !== 'object') return null;

    const respondWithinMs = Number(policy.respondWithinMs);
    if (!Number.isFinite(respondWithinMs) || respondWithinMs <= 0) return null;

    const tiers = Array.isArray(policy.tiers)
        ? policy.tiers.filter((tier) => Array.isArray(tier) && tier.length > 0)
        : undefined;

    const declaredMax = Number(policy.maxEscalations);
    // With a tier ladder the natural ceiling is "one hop per remaining tier".
    const defaultMax = tiers && tiers.length > 0 ? tiers.length - 1 : Number.POSITIVE_INFINITY;

    return {
        respondWithinMs,
        onNoResponse: policy.onNoResponse === 'block' ? 'block' : 'allow',
        priorityBoost: Number.isFinite(Number(policy.priorityBoost)) ? Number(policy.priorityBoost) : 0,
        tiers: tiers && tiers.length > 0 ? tiers : undefined,
        maxEscalations: Number.isFinite(declaredMax) && declaredMax >= 0 ? declaredMax : defaultMax,
        onExhausted: policy.onExhausted === 'park' ? 'park' : 'queue',
    };
}

/** Current escalation level of an assignment (0 = never escalated). */
export function escalationLevelOf(assignment: Assignment): number {
    const raw = Number((assignment as Record<string, any>)[ESCALATION_LEVEL_FIELD]);
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;
}

/**
 * How long the matched user has to respond, in ms. Falls back to the
 * matcher-wide `matchExpirationMs` when the assignment declares no policy.
 */
export function responseDeadlineMs(assignment: Assignment | null | undefined, fallbackMs: number): number {
    if (!assignment) return fallbackMs;
    const policy = normalizeEscalationPolicy(assignment.escalation);
    return policy ? policy.respondWithinMs : fallbackMs;
}

/**
 * Same question, answered from the stored JSON without paying for a parse on
 * the claim hot path. Assignments without a policy — effectively all of them
 * in a typical deployment — cost one `indexOf` and nothing else.
 */
export function responseDeadlineFromJson(json: string | null | undefined, fallbackMs: number): number {
    if (!json || json.indexOf('"escalation"') === -1) return fallbackMs;
    try {
        return responseDeadlineMs(JSON.parse(json), fallbackMs);
    } catch {
        return fallbackMs;
    }
}

export interface EscalationDecision {
    /** The assignment as it should be re-queued (tier tags + boosted priority + bumped level). */
    assignment: Assignment;
    /** Level after this hop (1 = first escalation). Equals the previous level when exhausted. */
    level: number;
    /** True when the ladder had no hop left — `assignment` is unchanged in that case. */
    exhausted: boolean;
    /** Whether the timed-out owner should be blocked from winning it back. */
    blockPreviousOwner: boolean;
    /** What to do with an exhausted assignment. */
    onExhausted: 'queue' | 'park';
}

/**
 * Decide the next state of an assignment whose response deadline elapsed.
 *
 * Tier tags are swapped rather than appended: the vocabulary of every tag
 * named by any tier is removed first, then the target tier's tags are added,
 * so a ladder like `[['oncall-primary'], ['oncall-secondary']]` moves the
 * assignment cleanly from one tier to the next while non-tier tags
 * (`sev:1`, `service:checkout`, …) survive untouched.
 */
export function escalateAssignment(assignment: Assignment, policy: NormalizedEscalationPolicy): EscalationDecision {
    const currentLevel = escalationLevelOf(assignment);
    const nextLevel = currentLevel + 1;

    const outOfHops = nextLevel > policy.maxEscalations;
    const outOfTiers = policy.tiers ? nextLevel >= policy.tiers.length : false;

    if (outOfHops || outOfTiers) {
        return {
            assignment,
            level: currentLevel,
            exhausted: true,
            // The non-responder is still blocked on the final hop: an exhausted
            // ladder means nobody answered, not that the last person gets it back.
            blockPreviousOwner: policy.onNoResponse === 'block',
            onExhausted: policy.onExhausted,
        };
    }

    const next: Assignment = { ...assignment, [ESCALATION_LEVEL_FIELD]: nextLevel };

    if (policy.priorityBoost !== 0 && typeof assignment.priority === 'number') {
        next.priority = assignment.priority + policy.priorityBoost;
    }

    if (policy.tiers) {
        const tierVocabulary = new Set(policy.tiers.flat());
        const preserved = (assignment.tags ?? []).filter((tag) => !tierVocabulary.has(tag));
        const tierTags = policy.tiers[nextLevel];
        next.tags = [...preserved, ...tierTags.filter((tag) => !preserved.includes(tag))];
    }

    return {
        assignment: next,
        level: nextLevel,
        exhausted: false,
        blockPreviousOwner: policy.onNoResponse === 'block',
        onExhausted: policy.onExhausted,
    };
}
