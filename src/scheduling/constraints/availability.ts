/**
 * Availability and preferences.
 *
 * Four kinds, deliberately distinct rather than a single boolean:
 *
 *   - `unavailable` — a hard blackout, like time off.
 *   - `available` — an allow-list. Once a person declares *any* availability
 *     window, anything outside every window is ineligible. This is the
 *     part-time and student pattern, and it inverts the default.
 *   - `preferred` / `avoid` — soft, weighted. A preference model that only has
 *     "can't work" cannot express "would rather not", so every unwanted shift
 *     becomes a refusal and the roster loses the flexibility it needs.
 *
 * The soft half matters for more than morale: pro-rata fairness in shift quality
 * is a live discrimination question under the part-time and fixed-term
 * directives, and it can only be traded off if it is scored rather than binary.
 */

import type { AvailabilityRule, RuleVerdict, SchedulingConstraint, ShiftInstance } from '../types';
import { availabilityApplies } from '../model';
import { fail, fromVerdict, instanceOf, pass } from './support';

export function availability(): SchedulingConstraint {
    const constraint = fromVerdict({
        id: 'availability',
        hardness: 'hard',
        weight: 1,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            const employee = state.ctx.employeeById.get(pair.employeeId);
            if (!inst || !employee?.availability?.length) return pass('availability', 'no availability rules');

            const clock = state.ctx.clock;
            const range = { start: inst.startMinute, end: inst.endMinute };
            const span = range.end - range.start;

            const matching = employee.availability.filter((rule) => availabilityApplies(rule, inst));

            for (const rule of matching.filter((r) => r.kind === 'unavailable')) {
                if (overlapsRule(clock, range, rule) > 0) {
                    return fail('availability', 'hard', `employee "${pair.employeeId}" is unavailable during "${inst.id}"`);
                }
            }

            // An allow-list only binds when the person declared one for a day
            // this shift could fall on; otherwise every worker with a Monday
            // window would be barred from Tuesdays they never spoke about.
            const allowLists = employee.availability.filter((r) => r.kind === 'available');
            if (allowLists.length > 0) {
                const covered = matching
                    .filter((r) => r.kind === 'available')
                    .reduce((max, rule) => Math.max(max, overlapsRule(clock, range, rule)), 0);
                if (covered < span) {
                    return fail(
                        'availability',
                        'hard',
                        `"${inst.id}" falls outside employee "${pair.employeeId}"'s declared availability`,
                        { actual: covered, required: span, unit: 'minutes' },
                    );
                }
            }

            const avoided = matching.find((r) => r.kind === 'avoid' && overlapsRule(clock, range, r) > 0);
            if (avoided) {
                return fail('availability', 'soft', `employee "${pair.employeeId}" prefers to avoid "${inst.id}"`, {
                    actual: avoided.weight ?? 1,
                });
            }

            const preferred = matching.find((r) => r.kind === 'preferred' && overlapsRule(clock, range, r) > 0);
            return pass('availability', preferred ? `matches a preferred window` : 'no availability objection');
        },
        // Soft avoidance scales by its declared weight so a strong objection
        // outranks a mild one instead of every preference costing the same.
        magnitude: (v) => (v.severity === 'soft' ? (v.actual ?? 1) : 1),
    });

    // A soft breach must not make the pair ineligible, so the level is decided
    // per verdict rather than fixed on the constraint.
    const innerDelta = constraint.delta;
    constraint.delta = (state, pair) => {
        const v = constraint.verdict!(state, pair);
        if (v.pass) return 0;
        return v.severity === 'hard' ? innerDelta(state, pair) : 0;
    };
    constraint.evaluate = (state) => {
        const out = [];
        for (const [instanceId, employees] of state.assignments) {
            for (const employeeId of employees) {
                const v = constraint.verdict!(state, { employeeId, shiftInstanceId: instanceId });
                if (v.pass || v.severity === 'hard') continue;
                out.push({
                    constraintId: 'availability',
                    severity: v.severity,
                    employeeId,
                    shiftInstanceId: instanceId,
                    message: v.message,
                });
            }
        }
        return out;
    };

    return constraint;
}

/** Minutes of `range` covered by one availability rule's clock window. */
function overlapsRule(
    clock: { minutesInClockRange: (r: { start: number; end: number }, c: { from: string; to: string }) => number },
    range: { start: number; end: number },
    rule: AvailabilityRule,
): number {
    if (rule.from === undefined || rule.to === undefined) return range.end - range.start;
    return clock.minutesInClockRange(range, { from: rule.from, to: rule.to });
}

/** Soft preference score for a pair: negative is better. Used by candidate ranking. */
export function preferenceScore(
    clock: Parameters<typeof overlapsRule>[0],
    rules: AvailabilityRule[] | undefined,
    inst: ShiftInstance,
): number {
    if (!rules?.length) return 0;
    const range = { start: inst.startMinute, end: inst.endMinute };
    let score = 0;
    for (const rule of rules) {
        if (!availabilityApplies(rule, inst)) continue;
        if (overlapsRule(clock, range, rule) <= 0) continue;
        if (rule.kind === 'preferred') score -= rule.weight ?? 1;
        if (rule.kind === 'avoid') score += rule.weight ?? 1;
    }
    return score;
}
