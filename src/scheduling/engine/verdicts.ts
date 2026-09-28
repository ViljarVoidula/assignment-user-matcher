/**
 * Verdict collection — the single place a roster is judged.
 *
 * Both the solver's result assembly and `checkCompliance` run through here.
 * That is deliberate: an earlier version had the solver report only aggregate
 * violations while the compliance check evaluated every pair, so a solve could
 * announce "no hard violations" on a roster the compliance check then rejected.
 * Two judgement paths always drift, and the one that drifts is the one nobody
 * is reading at the time.
 */

import type { AssignmentPair, ConstraintViolation, ModelContext, RuleVerdict, SchedulingConstraint, SearchState } from '../types';
import { builtInConstraints, deltaMirrorsVerdict } from '../constraints/support';

/** Every rule's verdict on one pair, in registry order. */
export function verdictsFor(state: SearchState, pair: AssignmentPair): RuleVerdict[] {
    const out: RuleVerdict[] = [];
    for (const constraint of state.ctx.constraints) {
        if (constraint.verdict) {
            out.push(constraint.verdict(state, pair));
            continue;
        }
        // Rules predating the structured SPI still contribute, through their
        // delta/explain pair, so no rule is silently skipped.
        const breach = constraint.delta(state, pair);
        const message = constraint.explain(state, pair);
        out.push({
            ruleId: constraint.id,
            pass: breach === 0,
            severity: constraint.hardness,
            message: message ?? `satisfies ${constraint.id}`,
            citation: constraint.citation,
        });
    }
    return out;
}

/** Breaches attributable to individual assignments in the committed roster. */
export function collectPairViolations(state: SearchState): ConstraintViolation[] {
    return pairViolationsFrom(collectPairVerdicts(state));
}

/** Every committed pair with every rule's verdict on it, in assignment order. */
export function collectPairVerdicts(state: SearchState): Array<{ pair: AssignmentPair; verdicts: RuleVerdict[] }> {
    const out: Array<{ pair: AssignmentPair; verdicts: RuleVerdict[] }> = [];
    for (const [shiftInstanceId, employees] of state.assignments) {
        for (const employeeId of employees) {
            const pair = { employeeId, shiftInstanceId };
            out.push({ pair, verdicts: verdictsFor(state, pair) });
        }
    }
    return out;
}

/**
 * The failing verdicts of `collectPairVerdicts`, as violations. Split out so a
 * caller that reports the verdicts too (`checkCompliance`) judges each pair
 * once rather than twice — the verdicts are the expensive part.
 */
export function pairViolationsFrom(
    pairVerdicts: Array<{ pair: AssignmentPair; verdicts: RuleVerdict[] }>,
): ConstraintViolation[] {
    const out: ConstraintViolation[] = [];
    for (const { pair, verdicts } of pairVerdicts) {
        for (const v of verdicts) {
            if (v.pass) continue;
            out.push({
                constraintId: v.ruleId,
                severity: v.severity,
                employeeId: pair.employeeId,
                shiftInstanceId: pair.shiftInstanceId,
                message: v.message,
                citation: v.citation,
                actual: v.actual,
                required: v.required,
                unit: v.unit,
            });
        }
    }
    return out;
}

/**
 * Relative cost of judging one pair, by rule id. Static facts (time off, site,
 * qualification, availability) are a lookup; timeline rules probe windows.
 * Unknown ids — custom rules — sort with the expensive ones.
 */
const RULE_COST: Record<string, number> = {
    'time-off': 0,
    'site-eligibility': 0,
    qualification: 0,
    'max-shift-duration': 0,
    protections: 0,
    availability: 0,
    'no-overlap': 1,
    'one-shift-per-day': 1,
    'group-composition': 1,
    contract: 1,
    'hour-budget': 1,
    'engagement-floor': 1,
    notice: 1,
    'min-rest': 2,
    'start-interval': 2,
    'site-travel-gap': 2,
    'shift-succession': 2,
    'daily-rest': 2,
};

const byCost = new WeakMap<ModelContext, SchedulingConstraint[]>();

/**
 * The context's rules, cheapest first. Only for questions whose answer does
 * not depend on the order the rules are asked in — "does any hard rule
 * object?" — where a cheap early rejection saves the window probes. Custom
 * rules keep their place after every built-in one, so a custom rule is still
 * only consulted once the built-ins have all passed.
 */
function constraintsByCost(ctx: ModelContext): SchedulingConstraint[] {
    let ordered = byCost.get(ctx);
    if (!ordered) {
        const rank = (c: SchedulingConstraint) => (builtInConstraints.has(c) ? RULE_COST[c.id] ?? 3 : 10);
        ordered = ctx.constraints
            .map((c, index) => ({ c, index }))
            .sort((a, b) => rank(a.c) - rank(b.c) || a.index - b.index)
            .map(({ c }) => c);
        byCost.set(ctx, ordered);
    }
    return ordered;
}

/** Whether any hard rule's `delta` objects to the pair — `hardCompliant`'s question, short-circuited. */
export function anyHardDelta(ctx: ModelContext, state: SearchState, pair: AssignmentPair): boolean {
    for (const c of constraintsByCost(ctx)) {
        if (c.hardness === 'hard' && c.delta(state, pair) > 0) return true;
    }
    return false;
}

/**
 * Built-in rules whose per-pair judgement reads the instance's crew — who else
 * is on the shift — rather than only the person's own timeline and records.
 * Everything else a pair-scoped built-in reads moves only when the person does.
 */
const CREW_RULES = new Set(['group-composition', 'hour-budget']);

/** Whether a built-in rule's per-pair judgement reads who else is on the shift. */
export function readsCrew(c: SchedulingConstraint): boolean {
    return CREW_RULES.has(c.id);
}

const hardSplit = new WeakMap<ModelContext, { person: SchedulingConstraint[]; crew: SchedulingConstraint[] }>();

/**
 * `anyHardDelta` over one half of the hard rules: those that read the crew of
 * the instance, or those that read only the person. The two halves together
 * are exactly `anyHardDelta`; splitting them lets a caller remember the
 * person half for as long as the person's schedule stands still.
 */
export function anyHardDeltaIn(
    ctx: ModelContext,
    state: SearchState,
    pair: AssignmentPair,
    half: 'person' | 'crew',
): boolean {
    let split = hardSplit.get(ctx);
    if (!split) {
        const hard = constraintsByCost(ctx).filter((c) => c.hardness === 'hard');
        split = { person: hard.filter((c) => !CREW_RULES.has(c.id)), crew: hard.filter((c) => CREW_RULES.has(c.id)) };
        hardSplit.set(ctx, split);
    }
    for (const c of split[half]) {
        if (c.delta(state, pair) > 0) return true;
    }
    return false;
}

/**
 * Whether the pair is blocked: some verdict fails at hard severity, or some
 * hard rule's `delta` objects. Equal to checking `verdictsFor(...).some(hard
 * failure) || anyHardDelta(...)`, but stops at the first objection and reads a
 * rule's verdict once where its delta is known to mirror it.
 */
export function hardBlocked(state: SearchState, pair: AssignmentPair): boolean {
    for (const c of constraintsByCost(state.ctx)) {
        if (c.verdict) {
            const v = c.verdict(state, pair);
            if (!v.pass && v.severity === 'hard') return true;
            if (c.hardness === 'hard') {
                if (deltaMirrorsVerdict(c)) {
                    if (!v.pass) return true;
                } else if (c.delta(state, pair) > 0) {
                    return true;
                }
            }
        } else if (c.hardness === 'hard' && c.delta(state, pair) > 0) {
            // A rule without a verdict reports its hardness as its severity,
            // so only a hard one can block.
            return true;
        }
    }
    return false;
}

/** Breaches only a whole-roster view can see: coverage, quotas, team fairness. */
export function collectAggregateViolations(state: SearchState): ConstraintViolation[] {
    const out: ConstraintViolation[] = [];
    for (const constraint of state.ctx.constraints) {
        if (!constraint.evaluate) continue;
        for (const violation of constraint.evaluate(state)) {
            out.push({ citation: constraint.citation, ...violation });
        }
    }
    return out;
}

/**
 * `anyHardDelta` for a pair whose `verdictsFor` is already in hand. A rule
 * without a verdict had its verdict synthesised from its delta, and a
 * `fromVerdict` rule's delta mirrors its verdict, so only a rule with its own
 * independent delta is asked again.
 */
export function anyHardDeltaGiven(state: SearchState, pair: AssignmentPair, verdicts: RuleVerdict[]): boolean {
    const constraints = state.ctx.constraints;
    for (let i = 0; i < constraints.length; i++) {
        const c = constraints[i];
        if (c.hardness !== 'hard') continue;
        if (!c.verdict || deltaMirrorsVerdict(c)) {
            if (!verdicts[i].pass) return true;
        } else if (c.delta(state, pair) > 0) {
            return true;
        }
    }
    return false;
}
