/**
 * Operational APIs — the things a roster needs *after* it is built.
 *
 * Rosters are re-solved far more often than they are built, and the questions
 * that arrive at 06:00 are not "give me a month" but "who can cover this, and
 * why not her?". These four entry points answer them against the same
 * constraint set the solver uses, so an answer here can never disagree with the
 * roster the solver would produce.
 *
 *   - `checkCompliance` — validate a roster the engine did not build. Human
 *     overrides are a legal requirement (GDPR Art 22 gives a right to human
 *     intervention), so a hand-edited roster must be re-checkable rather than
 *     trusted.
 *   - `explainCandidate` — every rule's verdict on one candidate, with numbers.
 *   - `repairSchedule` — minimal-perturbation re-plan around a disruption, with
 *     a ranked list of who can lawfully be called.
 *   - `diagnoseInfeasibility` — why the problem cannot be solved, before it is
 *     attempted.
 */

import type {
    AssignmentPair,
    ConstraintViolation,
    LedgerEntry,
    RuleVerdict,
    ScheduleInput,
    ScheduledAssignment,
    SearchState,
} from './types';
import { buildModel } from './model';
import { propagate } from './engine/propagation';
import { assign, createState } from './engine/state';
import { hardCompliant } from './engine/construction';
import { collectAggregateViolations, collectPairViolations, verdictsFor } from './engine/verdicts';
import { solveSchedule } from './scheduler.class';
import { preferenceScore } from './constraints/availability';
import { marginalCostCents } from './cost';
import { MINUTES_PER_DAY } from './time';

/* ------------------------------------------------------------------------- */
/* Compliance                                                                 */
/* ------------------------------------------------------------------------- */

export interface ComplianceReport {
    compliant: boolean;
    violations: ConstraintViolation[];
    /** Per-assignment verdicts for every rule that had something to say. */
    verdicts: Array<{ pair: AssignmentPair; verdicts: RuleVerdict[] }>;
    ledger: LedgerEntry[];
}

/**
 * Validate an externally-produced or hand-edited roster.
 *
 * Runs the same constraints as the solver — there is deliberately no second
 * validation path, because two paths drift and the one that drifts is always
 * the one nobody reads.
 */
export function checkCompliance(input: ScheduleInput, roster: ScheduledAssignment[]): ComplianceReport {
    const ctx = buildModel(input);
    const state = createState(ctx);

    const violations: ConstraintViolation[] = [];
    for (const entry of roster) {
        if (!ctx.instanceById.has(entry.shiftInstanceId)) {
            violations.push({
                constraintId: 'input',
                severity: 'hard',
                shiftInstanceId: entry.shiftInstanceId,
                message: `roster references unknown shift instance "${entry.shiftInstanceId}"`,
            });
            continue;
        }
        if (!ctx.employeeById.has(entry.employeeId)) {
            violations.push({
                constraintId: 'input',
                severity: 'hard',
                employeeId: entry.employeeId,
                message: `roster references unknown employee "${entry.employeeId}"`,
            });
            continue;
        }
        assign(state, entry.employeeId, entry.shiftInstanceId, entry.reasons ?? []);
    }

    // The same two passes the solver runs when it assembles its result.
    const verdicts: ComplianceReport['verdicts'] = [];
    for (const [instanceId, employees] of state.assignments) {
        for (const employeeId of employees) {
            const pair = { employeeId, shiftInstanceId: instanceId };
            verdicts.push({ pair, verdicts: verdictsFor(state, pair) });
        }
    }
    violations.push(...collectPairViolations(state), ...collectAggregateViolations(state));

    return {
        compliant: violations.every((v) => v.severity !== 'hard'),
        violations,
        verdicts,
        ledger: [],
    };
}

/* ------------------------------------------------------------------------- */
/* Explanation                                                                */
/* ------------------------------------------------------------------------- */

/**
 * Why can — or can't — this person work this shift?
 *
 * A rule-by-rule scan against live state, not a solve. This is the question
 * managers actually ask, and answering it with concrete numbers ("clock-out
 * 22:00, shift starts 06:00, that is 8h against an 11h minimum") is what makes
 * the roster arguable rather than oracular.
 */
export function explainCandidate(
    input: ScheduleInput,
    employeeId: string,
    shiftInstanceId: string,
    roster: ScheduledAssignment[] = [],
): RuleVerdict[] {
    const ctx = buildModel(input);
    const state = createState(ctx);
    for (const entry of roster) {
        if (entry.employeeId === employeeId && entry.shiftInstanceId === shiftInstanceId) continue;
        if (ctx.instanceById.has(entry.shiftInstanceId) && ctx.employeeById.has(entry.employeeId)) {
            assign(state, entry.employeeId, entry.shiftInstanceId, []);
        }
    }
    return verdictsFor(state, { employeeId, shiftInstanceId });
}

/* ------------------------------------------------------------------------- */
/* Repair                                                                     */
/* ------------------------------------------------------------------------- */

export type Disruption =
    | { kind: 'absence'; employeeId: string; from: string; to?: string }
    | { kind: 'noShow'; employeeId: string; shiftInstanceId: string }
    | { kind: 'cancelShift'; shiftInstanceId: string };

export interface RepairCandidate {
    employeeId: string;
    shiftInstanceId: string;
    eligible: boolean;
    verdicts: RuleVerdict[];
    /** Failing rules only, for a compact "why not" list. */
    blockers: RuleVerdict[];
    marginalCostCents: number;
    /** How far below their fair share of extra work this person is. Higher means more owed. */
    fairnessDebt: number;
    /** Lower is a better call. */
    rank: number;
    rationale: string;
}

export interface RepairResult {
    diff: { added: AssignmentPair[]; removed: AssignmentPair[] };
    candidates: RepairCandidate[];
    violationsIntroduced: ConstraintViolation[];
    perturbation: { changedAssignments: number; affectedEmployees: number };
}

/**
 * Re-plan around a disruption, changing as little as possible.
 *
 * Everything not touched by the disruption is pinned, so the answer is a *diff*
 * a manager can act on rather than a fresh roster nobody recognises. A full
 * re-solve at 06:00 returns a different schedule for the whole team, which is
 * not an answer anyone will accept.
 *
 * The candidate list is a ranked scan, not a solve — that is what keeps it
 * interactive, and it is also the more useful output: the gap is filled by
 * phoning someone, so the operator needs an ordered list with reasons, not a
 * single name.
 */
export function repairSchedule(
    input: ScheduleInput,
    disruption: Disruption,
    published: ScheduledAssignment[],
): RepairResult {
    const openings = openingsFor(disruption, published);
    const surviving = published.filter((entry) => !isDropped(entry, disruption));

    // Re-solve with the untouched roster pinned. Only the openings are free.
    const repaired = solveSchedule({
        ...applyDisruption(input, disruption),
        pinned: surviving.map((e) => ({ employeeId: e.employeeId, shiftInstanceId: e.shiftInstanceId })),
        published: { roster: published, publishedAt: input.published?.publishedAt },
    });

    const before = new Set(published.map((e) => `${e.employeeId}|${e.shiftInstanceId}`));
    const after = new Set(repaired.assignments.map((e) => `${e.employeeId}|${e.shiftInstanceId}`));

    const added = [...after].filter((k) => !before.has(k)).map(toPair);
    const removed = [...before].filter((k) => !after.has(k)).map(toPair);
    const affected = new Set([...added, ...removed].map((p) => p.employeeId));

    const candidates = openings.flatMap((instanceId) => rankCandidates(input, instanceId, surviving, disruption));

    return {
        diff: { added, removed },
        candidates,
        violationsIntroduced: repaired.violations.filter((v) => v.severity === 'hard'),
        perturbation: { changedAssignments: added.length + removed.length, affectedEmployees: affected.size },
    };
}

/**
 * Rank everyone who could take an open shift.
 *
 * The hard gate and the soft ordering are kept separate on purpose: an
 * ineligible person is *never* promoted by being cheap, and the reason they are
 * ineligible is still reported, because "Anna would be ideal but is 2h short on
 * rest" is more useful than Anna's silent absence from the list.
 *
 * Ordering uses cost, fairness debt and stated preference — all facts about
 * declared data and realised assignments. No reliability score, no acceptance
 * history, no no-show prediction: those would make this profiling under AI Act
 * Annex III point 4(b), which is high-risk with no narrow-task exemption.
 */
export function rankCandidates(
    input: ScheduleInput,
    shiftInstanceId: string,
    roster: ScheduledAssignment[],
    disruption?: Disruption,
): RepairCandidate[] {
    const ctx = buildModel(input);
    const inst = ctx.instanceById.get(shiftInstanceId);
    if (!inst) return [];

    const state = createState(ctx);
    for (const entry of roster) {
        if (ctx.instanceById.has(entry.shiftInstanceId) && ctx.employeeById.has(entry.employeeId)) {
            assign(state, entry.employeeId, entry.shiftInstanceId, []);
        }
    }

    const excluded = disruption && 'employeeId' in disruption ? disruption.employeeId : undefined;
    const extraLoad = extraShiftCounts(state);
    const meanExtra = average([...extraLoad.values()]);

    const candidates: RepairCandidate[] = [];
    for (const employee of ctx.employees) {
        if (employee.id === excluded) continue;
        if (state.isAssigned(employee.id, shiftInstanceId)) continue;

        const pair = { employeeId: employee.id, shiftInstanceId };
        const verdicts = verdictsFor(state, pair);
        const blockers = verdicts.filter((v) => !v.pass && v.severity === 'hard');
        const eligible = blockers.length === 0 && hardCompliant(ctx, state, employee.id, shiftInstanceId);

        // Marginal against what this person already holds: the same shift is
        // dearer in the hands of someone past their overtime threshold.
        const costCents = marginalCostCents(
            inst,
            employee,
            state.minutesByEmployee.get(employee.id) ?? 0,
            ctx.rules.engagement,
        );
        const fairnessDebt = meanExtra - (extraLoad.get(employee.id) ?? 0);
        const preference = preferenceScore(ctx.clock, employee.availability, inst);

        candidates.push({
            employeeId: employee.id,
            shiftInstanceId,
            eligible,
            verdicts,
            blockers,
            marginalCostCents: costCents,
            fairnessDebt,
            // Ineligible candidates sort to the bottom but stay visible.
            rank: eligible ? costCents / 100 - fairnessDebt * 10 + preference * 5 : Number.MAX_SAFE_INTEGER,
            rationale: rationaleFor(eligible, blockers, costCents, fairnessDebt, preference),
        });
    }

    return candidates.sort((a, b) => a.rank - b.rank || (a.employeeId < b.employeeId ? -1 : 1));
}

function rationaleFor(
    eligible: boolean,
    blockers: RuleVerdict[],
    costCents: number,
    fairnessDebt: number,
    preference: number,
): string {
    if (!eligible) return blockers.map((b) => b.message).join('; ') || 'not eligible';
    const parts = [`€${(costCents / 100).toFixed(2)} marginal cost`];
    if (fairnessDebt > 0) parts.push(`${fairnessDebt.toFixed(1)} fewer extra shifts than average`);
    if (preference < 0) parts.push('prefers this window');
    if (preference > 0) parts.push('would rather avoid this window');
    return parts.join(' · ');
}

/** Shifts each person already holds, as the basis for fairness debt. */
function extraShiftCounts(state: SearchState): Map<string, number> {
    const counts = new Map<string, number>();
    for (const employee of state.ctx.employees) {
        counts.set(employee.id, state.byEmployee.get(employee.id)?.size ?? 0);
    }
    return counts;
}

function average(values: number[]): number {
    return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

function openingsFor(disruption: Disruption, published: ScheduledAssignment[]): string[] {
    switch (disruption.kind) {
        case 'noShow':
            return [disruption.shiftInstanceId];
        case 'absence':
            return published.filter((e) => e.employeeId === disruption.employeeId).map((e) => e.shiftInstanceId);
        case 'cancelShift':
            return [];
    }
}

function isDropped(entry: ScheduledAssignment, disruption: Disruption): boolean {
    switch (disruption.kind) {
        case 'noShow':
            return entry.employeeId === disruption.employeeId && entry.shiftInstanceId === disruption.shiftInstanceId;
        case 'absence':
            return entry.employeeId === disruption.employeeId;
        case 'cancelShift':
            return entry.shiftInstanceId === disruption.shiftInstanceId;
    }
}

/**
 * Fold the disruption into the problem itself, so every rule sees it.
 *
 * This has to change the *input*, not just the roster. Simply dropping the
 * assignment and re-solving lets the solver hand the shift straight back to the
 * person who called in sick — the removal is not a fact about the world, only
 * about the plan.
 */
function applyDisruption(input: ScheduleInput, disruption: Disruption): ScheduleInput {
    switch (disruption.kind) {
        case 'absence':
            return {
                ...input,
                absences: [
                    ...(input.absences ?? []),
                    {
                        employeeId: disruption.employeeId,
                        from: disruption.from,
                        to: disruption.to ?? input.period.endDate,
                        kind: 'sick',
                    },
                ],
            };

        case 'noShow': {
            // Scoped time off: this person, this occurrence. They remain
            // available for everything else, which is what a no-show means.
            const date = disruption.shiftInstanceId.split('@')[1];
            return {
                ...input,
                employees: input.employees.map((e) =>
                    e.id === disruption.employeeId
                        ? { ...e, timeOff: [...e.timeOff, { date, shiftInstanceId: disruption.shiftInstanceId }] }
                        : e,
                ),
            };
        }

        case 'cancelShift':
            return withoutInstance(input, disruption.shiftInstanceId);
    }
}

/**
 * Remove one occurrence from the problem.
 *
 * Templates are materialized to explicit dates first, because a template driven
 * by `daysOfWeek` has no single date to strike out. Cancelling has to remove the
 * *demand*, not merely the assignment, or the solver dutifully refills a shift
 * that is no longer running.
 */
function withoutInstance(input: ScheduleInput, instanceId: string): ScheduleInput {
    const ctx = buildModel(input);
    const target = ctx.instanceById.get(instanceId);
    if (!target) return input;

    const shifts = input.shifts.flatMap((template) => {
        if (template.id !== target.templateId) return [template];
        const dates = ctx.instances.filter((i) => i.templateId === template.id).map((i) => i.date);
        const remaining = dates.filter((d) => d !== target.date);
        if (remaining.length === 0) return [];
        return [{ ...template, dates: remaining, daysOfWeek: undefined }];
    });

    return { ...input, shifts };
}

function toPair(key: string): AssignmentPair {
    const [employeeId, shiftInstanceId] = key.split('|');
    return { employeeId, shiftInstanceId };
}

/* ------------------------------------------------------------------------- */
/* Infeasibility                                                              */
/* ------------------------------------------------------------------------- */

export interface InfeasibilityReport {
    feasible: boolean;
    findings: Array<{
        kind: 'noEligibleEmployee' | 'insufficientCapacity' | 'tagCapacity';
        message: string;
        shiftInstanceId?: string;
        tag?: string;
        shortfall?: number;
    }>;
}

/**
 * Why the problem cannot be solved, before spending a search budget on it.
 *
 * Cheap arithmetic catches most real infeasibility: total demand against total
 * available capacity, per tag. "You are 24 registered-nurse-hours short on
 * Tuesday to Thursday nights" starts a conversation; "no solution found" ends
 * one.
 */
export function diagnoseInfeasibility(input: ScheduleInput): InfeasibilityReport {
    const ctx = buildModel(input);
    const propagation = propagate(ctx);
    const findings: InfeasibilityReport['findings'] = [];

    for (const inst of ctx.instances) {
        const eligible = propagation.eligibleByInstance.get(inst.id) ?? [];
        if (inst.minEmployees > 0 && eligible.length === 0) {
            findings.push({
                kind: 'noEligibleEmployee',
                shiftInstanceId: inst.id,
                message: `no employee is eligible for "${inst.id}"`,
            });
        } else if (eligible.length < inst.minEmployees) {
            findings.push({
                kind: 'insufficientCapacity',
                shiftInstanceId: inst.id,
                shortfall: inst.minEmployees - eligible.length,
                message: `"${inst.id}" needs ${inst.minEmployees} employees but only ${eligible.length} are eligible`,
            });
        }
    }

    // Demand against capacity in aggregate, which catches the shortfalls no
    // single shift reveals: every shift individually fillable, not all at once.
    const demandMinutes = ctx.instances.reduce((sum, i) => sum + i.minEmployees * i.workingMinutes, 0);
    const capacityMinutes = ctx.employees.reduce((sum, e) => {
        const cap = e.maxHoursForPeriod !== undefined ? e.maxHoursForPeriod * 60 : ctx.periodDays * MINUTES_PER_DAY;
        return sum + cap;
    }, 0);
    if (demandMinutes > capacityMinutes) {
        findings.push({
            kind: 'insufficientCapacity',
            shortfall: demandMinutes - capacityMinutes,
            message: `the roster needs ${(demandMinutes / 60).toFixed(1)}h of work but the team's hour budgets total ${(capacityMinutes / 60).toFixed(1)}h`,
        });
    }

    for (const [tag, needed] of tagDemand(ctx).entries()) {
        const supply = ctx.employees.filter((e) => ctx.employeeTags.get(e.id)?.has(tag)).length;
        if (supply === 0 && needed > 0) {
            findings.push({
                kind: 'tagCapacity',
                tag,
                shortfall: needed,
                message: `${needed} assignment(s) require the tag "${tag}" but nobody in the team holds it`,
            });
        }
    }

    return { feasible: findings.length === 0, findings };
}

function tagDemand(ctx: ReturnType<typeof buildModel>): Map<string, number> {
    const demand = new Map<string, number>();
    for (const inst of ctx.instances) {
        for (const [tag, count] of Object.entries(inst.tagRequirements)) {
            demand.set(tag, (demand.get(tag) ?? 0) + count);
        }
        for (const tag of inst.requiredTags) demand.set(tag, (demand.get(tag) ?? 0) + inst.minEmployees);
    }
    return demand;
}
