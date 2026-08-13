/**
 * Predictability of work — Directive (EU) 2019/1152 Art 10.
 *
 * Where a work pattern is wholly or mostly unpredictable, a worker may not be
 * required to work unless *both* the work falls within predetermined reference
 * hours and days, *and* they were given reasonable notice. Where either fails,
 * Art 10(2) gives a **right to refuse without adverse consequences** — so the
 * engine's job is not to forbid the assignment but to mark it refusable, since
 * a roster built on refusable shifts is a roster that will not survive contact
 * with the workforce.
 *
 * Art 10(3) adds that cancelling after a specified deadline entitles the worker
 * to compensation. The Netherlands pays the originally-called hours outright.
 * That makes a late change a *real cost*, not a soft preference, which is why
 * it surfaces as a ledger entry rather than a score nudge.
 *
 * None of this means anything without a published roster: notice is measured
 * from `published.publishedAt`, and with no publication there is nothing to give
 * notice of.
 */

import type {
    ConstraintViolation,
    NoticeRule,
    RuleVerdict,
    SchedulingConstraint,
    SearchState,
    ShiftInstance,
} from '../types';
import { fail, fromVerdict, h, instanceOf, pass } from './support';

export const NOTICE_CITATION = 'Directive (EU) 2019/1152 Art 10';

export function noticeRule(rule: NoticeRule): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'notice',
        // Medium, not hard: work outside the reference hours is refusable, not
        // unlawful. Treating it as hard would make rosters infeasible for a
        // right the worker may well not exercise.
        hardness: 'medium',
        weight: 200,
        citation: NOTICE_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('notice', 'unknown shift');

            if (rule.referenceHours?.length && !insideReferenceHours(state, inst, rule)) {
                return fail(
                    'notice',
                    'medium',
                    `"${inst.id}" falls outside employee "${pair.employeeId}"'s reference hours, so it may be refused without detriment`,
                    { citation: NOTICE_CITATION },
                );
            }

            const shortfall = noticeShortfall(state, inst, rule);
            if (shortfall !== null) {
                return fail(
                    'notice',
                    'medium',
                    `"${inst.id}" gives ${h(shortfall.given)} notice, below the ${h(shortfall.required)} required — refusable without detriment`,
                    {
                        actual: shortfall.given,
                        required: shortfall.required,
                        unit: 'minutes',
                        citation: NOTICE_CITATION,
                    },
                );
            }

            return pass('notice', 'within reference hours and given adequate notice', { citation: NOTICE_CITATION });
        },
    });

    // A published roster that may only change by consent (Finland) or for cause
    // makes every *new* assignment a reportable change, not merely a late one.
    constraint.evaluate = (state) => {
        const out: ConstraintViolation[] = [];
        if (rule.changeAfterPublication === undefined || rule.changeAfterPublication === 'free') return out;
        if (state.ctx.publishedPairs.size === 0) return out;

        for (const [instanceId, employees] of state.assignments) {
            for (const employeeId of employees) {
                if (state.ctx.publishedPairs.has(`${employeeId}|${instanceId}`)) continue;
                out.push({
                    constraintId: 'notice',
                    severity: 'medium',
                    employeeId,
                    shiftInstanceId: instanceId,
                    message:
                        rule.changeAfterPublication === 'consent'
                            ? `"${instanceId}" was added for "${employeeId}" after publication; this needs the employee's consent`
                            : `"${instanceId}" was added for "${employeeId}" after publication; this needs a compelling reason on record`,
                    citation: NOTICE_CITATION,
                });
            }
        }
        return out;
    };

    return constraint;
}

function insideReferenceHours(state: SearchState, inst: ShiftInstance, rule: NoticeRule): boolean {
    const clock = state.ctx.clock;
    const span = inst.endMinute - inst.startMinute;
    for (const window of rule.referenceHours ?? []) {
        if (window.daysOfWeek.length && !window.daysOfWeek.includes(inst.weekday)) continue;
        const covered = clock.minutesInClockRange({ start: inst.startMinute, end: inst.endMinute }, window);
        if (covered >= span) return true;
    }
    return false;
}

/** Notice actually given against the notice owed, or `null` when adequate. */
function noticeShortfall(
    state: SearchState,
    inst: ShiftInstance,
    rule: NoticeRule,
): { given: number; required: number } | null {
    if (rule.minNoticeMinutes === undefined || state.ctx.publishedAtMinute === undefined) return null;
    const given = inst.startMinute - state.ctx.publishedAtMinute;
    return given < rule.minNoticeMinutes ? { given: Math.max(0, given), required: rule.minNoticeMinutes } : null;
}

/**
 * Compensation owed for assignments dropped from a published roster.
 *
 * Computed against the published roster rather than the new one, because the
 * liability attaches to what the worker was told to expect.
 */
export function cancellationLedger(state: SearchState, rule: NoticeRule | undefined) {
    if (!rule?.cancellationCompensationMinutes) return [];
    const out = [];
    for (const key of state.ctx.publishedPairs) {
        const [employeeId, instanceId] = key.split('|');
        if (state.assignments.get(instanceId)?.has(employeeId)) continue;
        const inst = state.ctx.instanceById.get(instanceId);
        out.push({
            kind: 'lateCancellationPay' as const,
            employeeId,
            minutes: Math.max(rule.cancellationCompensationMinutes, inst?.workingMinutes ?? 0),
            reason: `published assignment "${instanceId}" was cancelled`,
            citation: NOTICE_CITATION,
        });
    }
    return out;
}
