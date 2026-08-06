/**
 * Assignment pre-flight lint — pure logic.
 *
 * Detects declarations that the runtime would otherwise handle silently:
 * policies that normalize away to nothing, schedule windows that cannot be
 * satisfied, and clock combinations where one policy shadows another.
 * Everything here is deliberately side-effect free and Redis-free;
 * `AssignmentMatcher.checkAssignmentReadiness()` layers the live checks
 * (tag coverage, duplicate ids, eligible users) on top.
 */

import type { Assignment, AssignmentLintContext, AssignmentLintIssue, User } from '../types/matcher';
import { normalizeSchedulePolicy } from '../schedule/policy';
import { normalizeSlaPolicy } from '../sla/policy';
import { normalizeEscalationPolicy } from '../escalation/policy';
import { getEffectiveWeight, matchesPattern } from '../scoring/match-score';

function epochMs(value: unknown): number | undefined {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

/**
 * Whether a user can currently serve a tag, mirroring the matching
 * semantics: positive routing weights (wildcards honored, weight 0 vetoes)
 * when the user has any, tag membership (user-side patterns) otherwise.
 */
export function userCoversTag(user: User, tag: string): boolean {
    const weights = user.routingWeights;
    if (weights && Object.keys(weights).length > 0) {
        return getEffectiveWeight(weights, tag) > 0;
    }
    return (user.tags ?? []).some((userTag) => matchesPattern(userTag, tag));
}

/**
 * Static pre-flight checks for an assignment declaration. Returns an empty
 * array when nothing is worth flagging. Purely structural — pair with
 * `checkAssignmentReadiness()` for checks against the live user pool.
 */
export function lintAssignment(assignment: Assignment, context: AssignmentLintContext = {}): AssignmentLintIssue[] {
    const now = context.now ?? Date.now();
    const issues: AssignmentLintIssue[] = [];

    if (!assignment.tags || assignment.tags.length === 0) {
        issues.push(
            context.enableDefaultMatching
                ? {
                      severity: 'info',
                      code: 'no-tags',
                      message: 'Assignment has no tags; it will match through the injected default tag only.',
                  }
                : {
                      severity: 'error',
                      code: 'no-tags',
                      message: 'Assignment has no tags and default matching is off — no user can ever receive it.',
                  },
        );
    }

    const schedule = normalizeSchedulePolicy(assignment.schedule);
    if (assignment.schedule && !schedule) {
        const rawNotBefore = epochMs(assignment.schedule.notBefore);
        const rawNotAfter = epochMs(assignment.schedule.notAfter);
        if (rawNotBefore !== undefined && rawNotAfter !== undefined && rawNotAfter <= rawNotBefore) {
            issues.push({
                severity: 'error',
                code: 'schedule-window-inverted',
                message: `schedule.notAfter (${rawNotAfter}) is not after notBefore (${rawNotBefore}); the whole schedule policy is ignored.`,
            });
        } else {
            issues.push({
                severity: 'error',
                code: 'schedule-ignored',
                message: 'schedule declares no usable timestamps; the whole schedule policy is ignored.',
            });
        }
    }

    if (schedule) {
        // Where the clocks would start: a future notBefore anchors at
        // activation, everything else anchors at enqueue (now).
        const activation = schedule.notBefore !== undefined ? Math.max(schedule.notBefore, now) : now;

        if (schedule.notAfter !== undefined && schedule.notAfter <= now) {
            issues.push({
                severity: 'warning',
                code: 'schedule-window-elapsed',
                message: 'schedule.notAfter is already in the past; the assignment will miss on the first sweep.',
            });
        } else {
            if (schedule.notBefore !== undefined && schedule.notBefore <= now) {
                issues.push({
                    severity: 'info',
                    code: 'schedule-notbefore-past',
                    message: 'schedule.notBefore is already in the past; the assignment enqueues immediately.',
                });
            }

            if (schedule.notAfter !== undefined) {
                const windowMs = schedule.notAfter - activation;
                const escalation = normalizeEscalationPolicy(assignment.escalation);
                const respondWithinMs = escalation?.respondWithinMs ?? context.matchExpirationMs;
                if (respondWithinMs !== undefined && respondWithinMs > 0 && windowMs < respondWithinMs) {
                    issues.push({
                        severity: 'warning',
                        code: 'offer-window-tight',
                        message: `The offer window (${windowMs}ms from activation) is shorter than one response deadline (${respondWithinMs}ms) — a single unanswered offer consumes the whole window.`,
                    });
                }

                const sla = normalizeSlaPolicy(assignment.sla);
                if (sla?.expireAfterMs !== undefined && activation + sla.expireAfterMs <= schedule.notAfter) {
                    issues.push({
                        severity: 'warning',
                        code: 'schedule-notafter-shadowed-by-sla-ttl',
                        message: `sla.expireAfterMs (${sla.expireAfterMs}ms from activation) elapses before schedule.notAfter — the TTL's onExpire acts first and notAfter never fires.`,
                    });
                }
            }
        }
    }

    if (assignment.sla && !normalizeSlaPolicy(assignment.sla)) {
        issues.push({
            severity: 'warning',
            code: 'sla-ignored',
            message: 'sla declares no usable values; the whole SLA policy is ignored.',
        });
    }
    if (assignment.escalation && !normalizeEscalationPolicy(assignment.escalation)) {
        issues.push({
            severity: 'warning',
            code: 'escalation-ignored',
            message: 'escalation declares no usable respondWithinMs; the whole escalation policy is ignored.',
        });
    }

    return issues;
}
