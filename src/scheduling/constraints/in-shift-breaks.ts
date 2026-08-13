/**
 * In-shift break entitlement — Directive 2003/88/EC Art 4.
 *
 * Art 4 fixes only the trigger — "where the working day is longer than six
 * hours" — and leaves the duration to member states and collective agreements.
 * The spread is wide: 10 minutes as an Italian floor, 15 in Spain and Belgium,
 * 20 in France, 30 in Germany rising to 45 past nine hours, and a full one to
 * two hours in Portugal, which splits the shift rather than pausing it.
 *
 * This engine assigns people to shifts rather than placing breaks inside them,
 * so the rule is enforced against *shift design*: a template whose working span
 * triggers an entitlement it does not carry is reported, once, rather than
 * silently rostered. `ShiftTemplate.unpaidBreakMinutes` is how a template
 * declares the break it provides.
 *
 * One trap worth encoding: C-107/19 holds that a break the worker must stay
 * reachable through is working time *and* does not discharge the Art 4
 * entitlement. An interruptible break therefore never satisfies the rule, no
 * matter how long it is.
 */

import type { BreakRule, ConstraintViolation, RuleVerdict, SchedulingConstraint, ShiftInstance } from '../types';
import { fail, fromVerdict, h, instanceOf, pass } from './support';

export const BREAK_CITATION = 'Directive 2003/88/EC Art 4';

export function inShiftBreaks(rules: BreakRule[]): SchedulingConstraint {
    // Strictest applicable entitlement wins, so evaluate longest trigger first.
    const ordered = [...rules].sort((a, b) => b.afterMinutes - a.afterMinutes);

    const shortfall = (inst: ShiftInstance): { rule: BreakRule; provided: number } | null => {
        const applicable = ordered.find((r) => inst.workingMinutes > r.afterMinutes);
        if (!applicable) return null;
        // An interruptible break provides nothing towards the entitlement.
        const provided = applicable.interruptible ? 0 : inst.durationMinutes - inst.workingMinutes;
        if (provided >= applicable.minMinutes) return null;
        return { rule: applicable, provided };
    };

    const constraint = fromVerdict({
        id: 'in-shift-breaks',
        hardness: 'medium',
        weight: 50,
        citation: BREAK_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('in-shift-breaks', 'unknown shift');

            const missing = shortfall(inst);
            if (!missing) return pass('in-shift-breaks', 'break entitlement satisfied', { citation: BREAK_CITATION });

            const why = missing.rule.interruptible
                ? 'an interruptible break is working time and does not discharge the entitlement (C-107/19)'
                : `provides only ${h(missing.provided)}`;
            return fail(
                'in-shift-breaks',
                'medium',
                `shift "${inst.id}" works ${h(inst.workingMinutes)} and owes a ${h(missing.rule.minMinutes)} break, but ${why}`,
                {
                    actual: missing.provided,
                    required: missing.rule.minMinutes,
                    unit: 'minutes',
                    citation: BREAK_CITATION,
                },
            );
        },
    });

    // The defect belongs to the template, not to whoever is rostered on it, so
    // report it once per instance rather than once per assignee.
    constraint.evaluate = (state) => {
        const out: ConstraintViolation[] = [];
        for (const inst of state.ctx.instances) {
            if ((state.assignments.get(inst.id)?.size ?? 0) === 0) continue;
            const missing = shortfall(inst);
            if (!missing) continue;
            const why = missing.rule.interruptible
                ? 'its break is interruptible, so it is working time and does not discharge the entitlement (C-107/19)'
                : `provides only ${h(missing.provided)}`;
            out.push({
                constraintId: 'in-shift-breaks',
                severity: 'medium',
                shiftInstanceId: inst.id,
                message: `shift "${inst.id}" works ${h(inst.workingMinutes)} and owes a ${h(missing.rule.minMinutes)} break after ${h(missing.rule.afterMinutes)}, but ${why}`,
                actual: missing.provided,
                required: missing.rule.minMinutes,
                unit: 'minutes',
                citation: BREAK_CITATION,
            });
        }
        return out;
    };

    return constraint;
}
