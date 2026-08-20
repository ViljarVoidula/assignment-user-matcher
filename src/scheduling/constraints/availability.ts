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

import type { AvailabilityRule, RuleVerdict, SchedulingConstraint, SearchState, ShiftInstance } from '../types';
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

            // Declaring any 'available' window inverts the default: everything
            // outside every declared window is ineligible, including days no
            // window mentions — a Monday-only declaration bars Tuesdays too.
            // Coverage is the UNION of the declared windows: a shift spanning
            // two contiguous windows lies inside the declaration.
            const allowLists = employee.availability.filter((r) => r.kind === 'available');
            if (allowLists.length > 0) {
                const covered = unionCoveredMinutes(
                    clock,
                    range,
                    matching.filter((r) => r.kind === 'available'),
                );
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
    });

    // A soft breach must not make the pair ineligible, and it must not leak
    // into the hard score bucket (the SPI levels by constraint, not by
    // verdict), so `delta` reports hard breaches only. The soft half is scored
    // by `preferencePenalty`, which the objective adds at the soft level.
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

/**
 * Minutes of `range` covered by the union of the given windows. A window with
 * no `from`/`to` covers the whole range; timed windows are projected onto the
 * range via the clock (same per-day band semantics as `overlapsRule`) and
 * merged, so contiguous or overlapping declarations never undercount.
 */
function unionCoveredMinutes(
    clock: {
        clockRangeIntervals: (
            r: { start: number; end: number },
            c: { from: string; to: string },
        ) => Array<{ start: number; end: number }>;
    },
    range: { start: number; end: number },
    rules: AvailabilityRule[],
): number {
    const intervals: Array<{ start: number; end: number }> = [];
    for (const rule of rules) {
        if (rule.from === undefined || rule.to === undefined) return range.end - range.start;
        intervals.push(...clock.clockRangeIntervals(range, { from: rule.from, to: rule.to }));
    }
    intervals.sort((a, b) => a.start - b.start);
    let covered = 0;
    let cursor = range.start;
    for (const interval of intervals) {
        if (interval.end <= cursor) continue;
        covered += interval.end - Math.max(interval.start, cursor);
        cursor = interval.end;
    }
    return covered;
}

function overlapsRule(
    clock: { minutesInClockRange: (r: { start: number; end: number }, c: { from: string; to: string }) => number },
    range: { start: number; end: number },
    rule: AvailabilityRule,
): number {
    if (rule.from === undefined || rule.to === undefined) return range.end - range.start;
    return clock.minutesInClockRange(range, { from: rule.from, to: rule.to });
}

/**
 * Weighted preference term over the whole roster, for the soft objective:
 * every assigned pair contributes its `avoid` weights and is credited its
 * `preferred` weights. This is what makes `preferred`/`avoid` *scored* rather
 * than advisory — without it, the solver would treat a roster of avoided
 * shifts and a roster of preferred ones as equal.
 */
export function preferencePenalty(state: SearchState): number {
    let penalty = 0;
    for (const [instanceId, employees] of state.assignments) {
        const inst = state.ctx.instanceById.get(instanceId);
        if (!inst) continue;
        for (const employeeId of employees) {
            const rules = state.ctx.employeeById.get(employeeId)?.availability;
            if (rules?.length) penalty += preferenceScore(state.ctx.clock, rules, inst);
        }
    }
    return penalty;
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
