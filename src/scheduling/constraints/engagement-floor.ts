/**
 * Minimum engagement — the rules that decouple *paid* from *worked*.
 *
 * Belgium requires at least three hours per work session (Labour Act 1971
 * art. 21); the Netherlands pays an on-call worker a minimum of three hours per
 * call and credits 30 minutes for any call-out; Germany's TzBfG §12 implies
 * three consecutive hours where none is agreed; Ireland owes the lesser of 25%
 * of contracted hours or 15 hours when someone is sent home early.
 *
 * These constrain *shift design* rather than assignment — a two-hour shift is
 * unlawful in Belgium no matter who works it — so the breach is reported once
 * per instance, and the paid-minutes floor is surfaced for the cost model
 * rather than folded into working time, since a minimum payment does not make
 * the time count against a working-time limit.
 */

import type { ConstraintViolation, EngagementRule, RuleVerdict, SchedulingConstraint, ShiftInstance } from '../types';
import { fail, fromVerdict, h, instanceOf, pass } from './support';

export const ENGAGEMENT_CITATION = 'National minimum-engagement law (e.g. BE Labour Act 1971 art. 21)';

export function engagementFloor(rule: EngagementRule): SchedulingConstraint {
    const tooShort = (inst: ShiftInstance) =>
        rule.minShiftMinutes !== undefined && inst.durationMinutes < rule.minShiftMinutes;

    const constraint = fromVerdict({
        id: 'engagement-floor',
        hardness: 'hard',
        weight: 1,
        citation: ENGAGEMENT_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('engagement-floor', 'unknown shift');
            if (tooShort(inst)) {
                return fail(
                    'engagement-floor',
                    'hard',
                    `shift "${inst.id}" is ${h(inst.durationMinutes)}, below the ${h(rule.minShiftMinutes!)} minimum engagement`,
                    {
                        actual: inst.durationMinutes,
                        required: rule.minShiftMinutes,
                        unit: 'minutes',
                        citation: ENGAGEMENT_CITATION,
                    },
                );
            }
            return pass('engagement-floor', 'meets the minimum engagement', { citation: ENGAGEMENT_CITATION });
        },
    });

    constraint.evaluate = (state) => {
        const out: ConstraintViolation[] = [];
        for (const inst of state.ctx.instances) {
            if ((state.assignments.get(inst.id)?.size ?? 0) === 0) continue;
            if (!tooShort(inst)) continue;
            out.push({
                constraintId: 'engagement-floor',
                severity: 'hard',
                shiftInstanceId: inst.id,
                message: `shift "${inst.id}" is ${h(inst.durationMinutes)}, below the ${h(rule.minShiftMinutes!)} minimum engagement`,
                actual: inst.durationMinutes,
                required: rule.minShiftMinutes,
                unit: 'minutes',
                citation: ENGAGEMENT_CITATION,
            });
        }
        return out;
    };

    return constraint;
}

/**
 * Minutes that must be *paid* for a shift, which can exceed the minutes worked.
 *
 * Kept separate from working time deliberately: a three-hour minimum payment for
 * a one-hour call-out costs three hours of wages and one hour of the worker's
 * 48-hour weekly allowance. Folding the floor into working time would overstate
 * the second.
 */
export function paidMinutesFor(inst: ShiftInstance, rule: EngagementRule | undefined): number {
    if (!rule?.minPaidMinutesPerEngagement) return inst.workingMinutes;
    return Math.max(inst.workingMinutes, rule.minPaidMinutesPerEngagement);
}
