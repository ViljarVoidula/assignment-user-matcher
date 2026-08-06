/**
 * Schedule policy — pure logic.
 *
 * An assignment carries an optional `schedule` policy describing its offer
 * window: `notBefore` holds it out of the queue entirely, `notAfter` expires
 * it while still un-accepted. Everything here is deliberately side-effect
 * free: `AssignmentMatcher` owns the Redis writes, this module owns the
 * decisions.
 *
 * Escalation owns the response clock and SLA owns the post-accept contract;
 * schedule owns the offer window. Acceptance ends its authority.
 */

import type { Assignment, SchedulePolicy } from '../types/matcher';

/** A policy with every optional field resolved. */
export interface NormalizedSchedulePolicy {
    notBefore?: number;
    notAfter?: number;
    onMiss: 'park' | 'drop';
}

function epochMs(value: unknown): number | undefined {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : undefined;
}

/**
 * Resolve an assignment's schedule policy, or `null` when it has none (the
 * overwhelming majority of assignments — callers use the null to stay on
 * the untouched legacy path). A window with `notAfter <= notBefore` can
 * never be satisfied, so the whole policy is treated as absent.
 */
export function normalizeSchedulePolicy(policy: SchedulePolicy | undefined | null): NormalizedSchedulePolicy | null {
    if (!policy || typeof policy !== 'object') return null;

    const notBefore = epochMs(policy.notBefore);
    const notAfter = epochMs(policy.notAfter);

    if (notBefore === undefined && notAfter === undefined) return null;
    if (notBefore !== undefined && notAfter !== undefined && notAfter <= notBefore) return null;

    return {
        notBefore,
        notAfter,
        onMiss: policy.onMiss === 'drop' ? 'drop' : 'park',
    };
}

/**
 * Same question, answered from the stored JSON without paying for a parse on
 * the accept hot path. Assignments without a schedule — effectively all of
 * them in a typical deployment — cost one `indexOf` and nothing else.
 */
export function scheduleFromJson(json: string | null | undefined): NormalizedSchedulePolicy | null {
    if (!json || json.indexOf('"schedule"') === -1) return null;
    try {
        return normalizeSchedulePolicy((JSON.parse(json) as Assignment).schedule);
    } catch {
        return null;
    }
}

/** Whether the assignment must stay in the scheduled store at `now`. */
export function isHeld(policy: NormalizedSchedulePolicy, now: number): boolean {
    return policy.notBefore !== undefined && policy.notBefore > now;
}
