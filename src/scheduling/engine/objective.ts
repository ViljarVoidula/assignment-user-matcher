/**
 * Objective scoring — pure logic.
 *
 * The score has three lexicographic levels rather than one number:
 *
 *   - **hard** — legal or physical impossibility (rest, overlap, expired
 *     qualification, contract breach);
 *   - **medium** — coverage: unfilled slots and unmet tag requirements;
 *   - **soft** — cost, fairness, preferences, hour-balance.
 *
 * They are compared in order, never summed. A weighted sum would let a large
 * enough soft gain buy a hard breach — arrange the weights unluckily and the
 * solver "discovers" that under-resting one person improves fairness for
 * everyone else. Lexicographic ordering makes that trade unrepresentable
 * instead of merely unlikely.
 *
 * Within a level, breaches contribute their *magnitude*, so a rest gap ten
 * minutes short scores better than one six hours short. Local search needs that
 * gradient to climb out of an infeasible region; a 0/1 flag leaves it on a
 * plateau with nothing to follow.
 *
 * Built-in aggregates use dedicated scoring terms below. Custom `evaluate`
 * hooks also contribute to the score, so extension rules can steer search.
 * Their authors should keep these hooks cheap: they run for each candidate
 * roster. All aggregate hooks run again during final validation.
 */

import type { AssignmentPair, FairnessRule, ModelContext, SchedulingConstraint, SearchState } from '../types';
import type { InternalState } from './state';
import { builtInConstraints } from '../constraints/support';
import { readsCrew } from './verdicts';
import { fairnessPenalty } from '../constraints/fairness';
import { preferencePenalty } from '../constraints/availability';
import { contractHoursPenalty } from '../contract-hours';

export const UNFILLED_WEIGHT = 10_000;
export const TAG_SHORTFALL_WEIGHT = 5_000;
export const MIN_HOURS_WEIGHT = 100;
/** Default weight applied to a soft constraint that does not declare one. */
export const DEFAULT_SOFT_WEIGHT = 1;

/** A three-level score. Lower is better at every level. */
export interface LexScore {
    hard: number;
    medium: number;
    soft: number;
}

/** Negative when `a` is better than `b`, positive when worse, 0 when equal. */
export function compareScores(a: LexScore, b: LexScore): number {
    if (a.hard !== b.hard) return a.hard - b.hard;
    if (a.medium !== b.medium) return a.medium - b.medium;
    return a.soft - b.soft;
}

export function isBetter(a: LexScore, b: LexScore): boolean {
    return compareScores(a, b) < 0;
}

/** Missing assignees for an instance (0 when fully staffed). */
export function slotShortage(ctx: ModelContext, state: SearchState, instanceId: string): number {
    const inst = ctx.instanceById.get(instanceId);
    if (!inst) return 0;
    return Math.max(0, inst.minEmployees - (state.assignments.get(instanceId)?.size ?? 0));
}

/** Missing tagged assignees, summed over the instance's tag requirements. */
export function tagShortage(ctx: ModelContext, state: SearchState, instanceId: string): number {
    const inst = ctx.instanceById.get(instanceId);
    if (!inst) return 0;
    const assigned = state.assignments.get(instanceId);
    let short = 0;
    for (const [tag, requirement] of Object.entries(inst.tagRequirements)) {
        let have = 0;
        if (assigned) {
            for (const employeeId of assigned) {
                const holds =
                    requirement.level === undefined
                        ? ctx.holdsTagOn(employeeId, tag, inst.date)
                        : ctx.holdsTagAt(employeeId, tag, inst.date, requirement.level);
                if (holds) have++;
            }
        }
        short += Math.max(0, requirement.min - have);
    }
    // A ratio's shortfall is measured against the team that is actually on, so
    // it moves as the shift fills — which is what lets the search close it by
    // adding the right person rather than by adding anybody.
    const size = assigned?.size ?? 0;
    if (size > 0) {
        for (const [tag, ratio] of Object.entries(inst.tagRatios)) {
            let have = 0;
            for (const employeeId of assigned!) if (ctx.holdsTagOn(employeeId, tag, inst.date)) have++;
            short += Math.max(0, Math.ceil(ratio * size) - have);
        }
    }
    return short;
}

/** Total unfilled capacity across the period, in person-slots. */
export function unfilledSlots(ctx: ModelContext, state: SearchState): number {
    let total = 0;
    for (const inst of ctx.instances) total += slotShortage(ctx, state, inst.id);
    return total;
}

/** Variance of worked minutes across employees (0 for an empty roster). */
export function hoursVariance(ctx: ModelContext, state: SearchState): number {
    if (ctx.employees.length === 0) return 0;
    const values = ctx.employees.map((e) => state.minutesByEmployee.get(e.id) ?? 0);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / values.length;
}

/** Number of employees below their soft min-hours bound. */
export function minHoursShortfalls(ctx: ModelContext, state: SearchState): number {
    let n = 0;
    for (const e of ctx.employees) {
        if (e.minHoursForPeriod !== undefined && (state.minutesByEmployee.get(e.id) ?? 0) < e.minHoursForPeriod * 60) n++;
    }
    return n;
}

/**
 * Weighted breach total per level, over the currently assigned pairs.
 *
 * This is what gives `SchedulingConstraint.weight` teeth — a caller who softens
 * a built-in via `overrides`, or registers a custom rule, now moves the score
 * instead of being silently ignored.
 */
export function breachTotals(ctx: ModelContext, state: SearchState): LexScore {
    const totals: LexScore = { hard: 0, medium: 0, soft: 0 };
    // `min-staffing` and `fairness` have dedicated terms below; evaluating their
    // per-pair delta here would either double-count or contribute a constant 0.
    const scored = ctx.constraints.filter((c) => c.id !== 'min-staffing' && c.id !== 'fairness');
    if (scored.length === 0) return totals;

    // The search scores the whole roster after every move, and most people's
    // schedules did not move. Where every rule is a built-in and the state
    // counts mutations per person, a pair's person-scoped deltas are reused
    // until that person changes; crew-reading rules are always asked. The
    // sums below run over the same pairs and rules in the same order either
    // way, so the totals are the same numbers to the last bit.
    const memo = deltaMemoFor(ctx, state, scored);

    for (const [instanceId, employees] of state.assignments) {
        for (const employeeId of employees) {
            const pair = { employeeId, shiftInstanceId: instanceId };
            const cached = memo?.lookup(pair);
            for (let i = 0; i < scored.length; i++) {
                const c = scored[i];
                const d = cached && !memo!.crew[i] ? cached[i] : c.delta(state, pair);
                if (d > 0) totals[c.hardness] += d * (c.weight ?? DEFAULT_SOFT_WEIGHT);
            }
        }
    }
    return totals;
}

/** Backwards-compatible soft-breach total, for callers that want a single figure. */
interface DeltaMemo {
    /** Per scored rule: whether it reads the instance's crew, and so is never reused. */
    crew: boolean[];
    /** The pair's person-scoped deltas at the person's current counter, computing them on a miss. */
    lookup(pair: AssignmentPair): number[];
}

const memos = new WeakMap<SearchState, { scored: SchedulingConstraint[]; memo: DeltaMemo }>();

function deltaMemoFor(ctx: ModelContext, state: SearchState, scored: SchedulingConstraint[]): DeltaMemo | undefined {
    const versions = (state as Partial<InternalState>).personVersion;
    if (!versions || state.ctx !== ctx || !ctx.constraints.every((c) => builtInConstraints.has(c))) return undefined;
    const existing = memos.get(state);
    if (existing && existing.scored.length === scored.length && existing.scored.every((c, i) => c === scored[i])) {
        return existing.memo;
    }
    const crew = scored.map((c) => readsCrew(c));
    const byInstance = new Map<string, Map<string, { person: number; deltas: number[] }>>();
    const memo: DeltaMemo = {
        crew,
        lookup(pair) {
            const person = versions.get(ctx.personIdOf.get(pair.employeeId) ?? pair.employeeId) ?? 0;
            let byEmployee = byInstance.get(pair.shiftInstanceId);
            if (!byEmployee) {
                byEmployee = new Map();
                byInstance.set(pair.shiftInstanceId, byEmployee);
            }
            const hit = byEmployee.get(pair.employeeId);
            if (hit && hit.person === person) return hit.deltas;
            const deltas = scored.map((c, i) => (crew[i] ? 0 : c.delta(state, pair)));
            byEmployee.set(pair.employeeId, { person, deltas });
            return deltas;
        },
    };
    memos.set(state, { scored, memo });
    return memo;
}

export function softBreaches(ctx: ModelContext, state: SearchState): number {
    return breachTotals(ctx, state).soft;
}

/** The full three-level score. Lower is better at every level. */
export function scoreLex(
    ctx: ModelContext,
    state: SearchState,
    objective: 'standard' | 'balanced',
    minHoursWeight: number,
    fairnessRules?: FairnessRule[],
): LexScore {
    const totals = breachTotals(ctx, state);
    for (const constraint of ctx.aggregateConstraints ?? []) {
        for (const violation of constraint.evaluate?.(state) ?? []) {
            const magnitude =
                violation.actual !== undefined && violation.required !== undefined
                    ? Math.max(1, Math.abs(violation.actual - violation.required))
                    : 1;
            totals[violation.severity] += magnitude * (constraint.weight ?? DEFAULT_SOFT_WEIGHT);
        }
    }

    for (const inst of ctx.instances) {
        totals.medium += slotShortage(ctx, state, inst.id) * UNFILLED_WEIGHT;
        totals.medium += tagShortage(ctx, state, inst.id) * TAG_SHORTFALL_WEIGHT;
    }

    totals.soft += minHoursShortfalls(ctx, state) * (minHoursWeight || MIN_HOURS_WEIGHT);
    totals.soft += fairnessPenalty(state, fairnessRules ?? ctx.rules?.fairness);
    // Preferred/avoid availability windows are scored, not advisory: avoided
    // assignments cost, preferred ones credit, weighted per rule.
    totals.soft += preferencePenalty(state);
    // Contracted hours steer the plan: each person with a known contract is
    // pulled towards their pro-rated period total, so a half-timer is planned
    // half the hours rather than filled to the statutory ceiling.
    totals.soft += contractHoursPenalty(state);
    if (objective === 'balanced') totals.soft += hoursVariance(ctx, state) / 60; // hours-scale variance term

    return totals;
}

/**
 * Flattened score, lower is better.
 *
 * Retained for callers that need one number. The level separation is preserved
 * by scaling, but comparisons should prefer `compareScores` — a flattened score
 * can only approximate a lexicographic order, and at extreme magnitudes the
 * approximation leaks.
 */
export function score(
    ctx: ModelContext,
    state: SearchState,
    objective: 'standard' | 'balanced',
    minHoursWeight: number,
): number {
    const lex = scoreLex(ctx, state, objective, minHoursWeight);
    return lex.hard * 1e12 + lex.medium * 1e6 + lex.soft;
}
