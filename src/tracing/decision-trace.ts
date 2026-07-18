/**
 * Pure decision-trace assembly.
 *
 * A matching pass evaluates users -> assignments; a decision trace is the
 * inverse view: one matched assignment -> every candidate considered for it.
 * The collector accumulates per-(assignment, user) evaluations as they happen
 * inside candidate scoring, and buildDecisionTraces() pivots them into
 * per-assignment records once the pass's winners are known.
 *
 * Candidate discovery is Redis-first: users excluded by the per-tag zset diff
 * (zero-weight vetoes, prior rejections, assignment-level user vetoes) never
 * reach scoring, so they produce no evaluations. Because those are exactly the
 * exclusions an auditor asks about, buildDecisionTraces() re-derives them
 * in memory from the pass's user contexts and adds them as struck-out
 * candidates. Users absent for any other reason (no positive tag overlap, or
 * the assignment was claimed before their snapshot read) were never candidates
 * and are not synthesized.
 */
import { randomUUID } from 'crypto';
import { matchesPattern } from '../scoring/match-score';
import type { MatchCandidateTrace, MatchDecisionMode, MatchDecisionTrace, MatchTraceReason, User } from '../types/matcher';

/** One user's evaluation of one assignment, captured during a matching pass. */
export interface TraceEvaluation {
    userId: string;
    eligible: boolean;
    score: number;
    effectivePriority: number;
    reasons: MatchTraceReason[];
}

/** Per-pass accumulator of candidate evaluations, keyed by assignment. */
export class TraceCollector {
    readonly byAssignment = new Map<string, { tags: string; evaluations: TraceEvaluation[] }>();

    record(assignmentId: string, tags: string, evaluation: TraceEvaluation): void {
        let entry = this.byAssignment.get(assignmentId);
        if (!entry) {
            entry = { tags, evaluations: [] };
            this.byAssignment.set(assignmentId, entry);
        }
        entry.evaluations.push(evaluation);
    }
}

/** A pass participant plus the Redis-side exclusion sets used for enrichment. */
export interface TraceUserContext {
    user: User;
    /** Assignment ids this user previously rejected */
    rejected: Set<string>;
    /** Assignment ids this user is hard-vetoed from (assignment.vetoedUsers) */
    vetoed: Set<string>;
    /** Whether the user was paused during the pass (excluded from all matching) */
    paused?: boolean;
}

/** Chosen candidate first, then eligible before ineligible, then by effective priority. */
export function sortCandidates(candidates: MatchCandidateTrace[]): MatchCandidateTrace[] {
    return candidates.sort((a, b) => {
        if (a.chosen !== b.chosen) return a.chosen ? -1 : 1;
        if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
        return b.effectivePriority - a.effectivePriority;
    });
}

/**
 * Hard-rule exclusion reasons for a user the Redis prefilter kept out of
 * scoring entirely. Returns null when no exclusion rule applies (the user
 * simply was not a candidate).
 */
function excludedCandidate(ctx: TraceUserContext, assignmentId: string, tags: string[]): MatchCandidateTrace | null {
    const reasons: MatchTraceReason[] = [];
    if (ctx.paused) reasons.push({ kind: 'paused' });
    if (ctx.vetoed.has(assignmentId)) reasons.push({ kind: 'assignmentVeto' });
    if (ctx.rejected.has(assignmentId)) reasons.push({ kind: 'rejectedPreviously' });
    const weights = ctx.user.routingWeights;
    if (weights) {
        for (const [pattern, weight] of Object.entries(weights)) {
            if (weight === 0) {
                for (const tag of tags) {
                    if (matchesPattern(pattern, tag)) reasons.push({ kind: 'veto', tag, pattern });
                }
            }
        }
    }
    if (reasons.length === 0) return null;
    return { userId: ctx.user.id, eligible: false, chosen: false, score: 0, effectivePriority: 0, reasons };
}

/**
 * Pivot a pass's evaluations into one decision trace per won assignment.
 * `winners` maps assignmentId -> the user whose claim succeeded.
 */
export function buildDecisionTraces(params: {
    collector: TraceCollector;
    winners: Map<string, string>;
    mode: MatchDecisionMode;
    users: TraceUserContext[];
    maxCandidates: number;
    matchedAt: number;
}): MatchDecisionTrace[] {
    const traces: MatchDecisionTrace[] = [];
    for (const [assignmentId, chosenUserId] of params.winners) {
        const entry = params.collector.byAssignment.get(assignmentId);
        const tags = entry ? entry.tags.split(',').filter(Boolean) : [];

        const evaluated = new Set<string>();
        const candidates: MatchCandidateTrace[] = [];
        for (const e of entry?.evaluations ?? []) {
            evaluated.add(e.userId);
            candidates.push({
                userId: e.userId,
                eligible: e.eligible,
                chosen: e.userId === chosenUserId,
                score: e.score,
                effectivePriority: e.effectivePriority,
                reasons: e.reasons,
            });
        }
        for (const ctx of params.users) {
            if (evaluated.has(ctx.user.id)) continue;
            const excluded = excludedCandidate(ctx, assignmentId, tags);
            if (excluded) candidates.push(excluded);
        }
        // The winner always evaluated the assignment; keep the trace coherent
        // even if capture and claiming ever disagree.
        if (!candidates.some((c) => c.userId === chosenUserId)) {
            candidates.push({
                userId: chosenUserId,
                eligible: true,
                chosen: true,
                score: 0,
                effectivePriority: 0,
                reasons: [],
            });
        }

        sortCandidates(candidates);
        traces.push({
            id: randomUUID(),
            assignmentId,
            chosenUserId,
            matchedAt: params.matchedAt,
            mode: params.mode,
            candidates: candidates.slice(0, Math.max(1, params.maxCandidates)),
        });
    }
    return traces;
}

/** Traces for deterministic workflow-targeted handoffs (no arbitration to show). */
export function buildWorkflowTraces(
    grants: Array<{ assignmentId: string; userId: string; priority: number }>,
    matchedAt: number,
): MatchDecisionTrace[] {
    return grants.map((grant) => ({
        id: randomUUID(),
        assignmentId: grant.assignmentId,
        chosenUserId: grant.userId,
        matchedAt,
        mode: 'workflow' as const,
        candidates: [
            {
                userId: grant.userId,
                eligible: true,
                chosen: true,
                score: 0,
                effectivePriority: grant.priority,
                reasons: [{ kind: 'workflowTargeted' as const }],
            },
        ],
    }));
}
