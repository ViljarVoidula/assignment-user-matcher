/**
 * Shared helpers for the rule-driven constraints.
 *
 * Every constraint in this directory needs the same four things: the person
 * behind an employee record, that person's timeline, the rules that apply to
 * them, and a structured verdict. Centralizing them keeps each rule file about
 * its rule.
 */

import type {
    AssignmentPair,
    ModelContext,
    RuleVerdict,
    SchedulingConstraint,
    SearchState,
    Severity,
    ShiftInstance,
    WorkingTimeRules,
} from '../types';
import type { MinuteRange } from '../time';
import type { PersonTimeline } from '../engine/timeline';
import { timelineEntryId } from '../engine/state';

export const MINUTES_PER_DAY = 1440;

/** The natural person behind an employee record. */
export function personIdFor(ctx: ModelContext, employeeId: string): string {
    return ctx.personIdOf.get(employeeId) ?? employeeId;
}

/** The person's timeline, including history and every contract they hold. */
export function timelineFor(state: SearchState, employeeId: string): PersonTimeline {
    return state.timelines.for(personIdFor(state.ctx, employeeId));
}

/** Rules applying to this employee, after merging their overrides over the global set. */
export function rulesFor(ctx: ModelContext, employeeId: string): WorkingTimeRules {
    return ctx.rulesByEmployee.get(employeeId) ?? ctx.rules;
}

/** The elapsed span of a shift instance. */
export function rangeOf(inst: ShiftInstance): MinuteRange {
    return { start: inst.startMinute, end: inst.endMinute };
}

/** The timeline entry id a pair would occupy, so rules can exclude it from their own lookups. */
export function entryIdOf(pair: AssignmentPair): string {
    return timelineEntryId(pair.employeeId, pair.shiftInstanceId);
}

/** Resolve a pair to its instance, or `undefined` when the id is unknown. */
export function instanceOf(state: SearchState, pair: AssignmentPair): ShiftInstance | undefined {
    return state.ctx.instanceById.get(pair.shiftInstanceId);
}

/**
 * A window of `days` centred on `range`, clamped to nothing — history lives at
 * negative minutes, so windows deliberately extend before the period start.
 */
export function windowAround(range: MinuteRange, days: number): MinuteRange {
    const span = days * MINUTES_PER_DAY;
    return { start: range.start - span, end: range.end + span };
}

/** Build a passing verdict. */
export function pass(ruleId: string, message: string, extra: Partial<RuleVerdict> = {}): RuleVerdict {
    return { ruleId, pass: true, severity: 'soft', message, ...extra };
}

/** Build a failing verdict. */
export function fail(ruleId: string, severity: Severity, message: string, extra: Partial<RuleVerdict> = {}): RuleVerdict {
    return { ruleId, pass: false, severity, message, ...extra };
}

/** Hours, to one decimal, for human-readable messages. */
export function h(minutes: number): string {
    return `${(minutes / 60).toFixed(1)}h`;
}

/**
 * Wire a rule's `verdict` into the `delta`/`explain` members the engine and the
 * legacy reason strings still use, so each rule file states its logic once.
 *
 * `magnitude` converts a failing verdict into a breach size: local search needs
 * to know a rest gap is 10 minutes short rather than merely "short", or it sits
 * on a plateau with no gradient to follow.
 */
export function fromVerdict(
    spec: Omit<SchedulingConstraint, 'delta' | 'explain' | 'verdict'> & {
        verdict(state: SearchState, pair: AssignmentPair): RuleVerdict;
        magnitude?(v: RuleVerdict): number;
    },
): SchedulingConstraint {
    const magnitude = spec.magnitude ?? defaultMagnitude;
    return {
        ...spec,
        verdict: spec.verdict,
        delta(state, pair) {
            const v = spec.verdict(state, pair);
            return v.pass ? 0 : Math.max(1, magnitude(v));
        },
        explain(state, pair) {
            const v = spec.verdict(state, pair);
            return v.pass ? null : v.message;
        },
    };
}

/** Shortfall or excess against the bound, when both are known; 1 otherwise. */
function defaultMagnitude(v: RuleVerdict): number {
    if (v.actual === undefined || v.required === undefined) return 1;
    return Math.max(1, Math.abs(v.required - v.actual));
}
