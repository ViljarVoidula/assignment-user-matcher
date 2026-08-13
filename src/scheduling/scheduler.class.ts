/**
 * ShiftScheduler — the facade.
 *
 * Orchestration only: normalize input → propagate → construct → improve →
 * interpret. Pure logic lives in `model.ts`, `constraints/`, and `engine/`;
 * this class owns sequencing and result shaping. No Redis, no I/O — consumers
 * wrap `solveSchedule` in their own queue.
 *
 * Status semantics: `'partial'` when slots are unfilled or a hard rule is
 * breached, `'feasible'` when every slot is staffed but softer obligations are
 * unmet, `'optimal'` when nothing is outstanding — "no known improvement", never
 * a proof of optimality.
 */

import type { ConstraintViolation, LedgerEntry, ScheduleInput, ScheduleResult, ScheduledAssignment } from './types';
import { buildModel } from './model';
import { propagate } from './engine/propagation';
import { assign, createState, assignedPairs, type InternalState } from './engine/state';
import { greedyFill } from './engine/construction';
import { improveWithLns } from './engine/search';
import { unfilledSlots, MIN_HOURS_WEIGHT } from './engine/objective';
import { reasonsFor } from './engine/explain';
import { staffingViolations } from './constraints/min-staffing';
import { minHourViolations } from './constraints/hour-budget';
import { compensatoryRestLedger } from './constraints/rest-days';
import { cancellationLedger } from './constraints/notice';
import { protectionLedger } from './constraints/protections';
import { overtimeLedger } from './constraints/overtime';
import { rosterCost } from './cost';
import { createPrng } from './engine/prng';
import { collectAggregateViolations, collectPairViolations } from './engine/verdicts';
import { hashRules } from './provenance';

const DEFAULT_TIME_BUDGET_MS = 10_000;
const DEFAULT_SEED = 42;
export const ENGINE_VERSION = '2';

export class ShiftScheduler {
    /** Solve a scheduling problem synchronously. Throws `ScheduleValidationError` on malformed input. */
    solve(input: ScheduleInput): ScheduleResult {
        const startedAt = Date.now();
        const objective = input.objective ?? 'standard';
        const timeBudgetMs = input.timeBudgetMs ?? DEFAULT_TIME_BUDGET_MS;
        const seed = input.seed ?? DEFAULT_SEED;
        const rand = createPrng(seed);

        const ctx = buildModel(input);
        const propagation = propagate(ctx);

        const state = createState(ctx);
        // Pinned pairs are placed first and never removed, so a re-solve keeps
        // the parts of a published roster the caller committed to.
        for (const key of ctx.pinned) {
            const [employeeId, instanceId] = key.split('|');
            if (!ctx.employeeById.has(employeeId) || !ctx.instanceById.has(instanceId)) continue;
            assign(state, employeeId, instanceId, ['pinned by the caller']);
        }
        greedyFill(ctx, state, propagation, objective, rand);

        const minHoursWeight = ctx.constraints.find((c) => c.id === 'hour-budget')?.weight ?? MIN_HOURS_WEIGHT;
        let finalState: InternalState = state;
        let evaluatedVariants = 1;

        if (timeBudgetMs > 0) {
            const outcome = improveWithLns(
                ctx,
                state,
                propagation,
                {
                    objective,
                    minHoursWeight,
                    timeBudgetMs,
                    rand,
                    onImprovement: input.onProgress
                        ? (best) => input.onProgress!(this.assemble(best, propagation, startedAt, seed, input, 0))
                        : undefined,
                },
                () => createState(ctx),
            );
            finalState = outcome.best;
            evaluatedVariants += outcome.evaluatedVariants;
        }

        return this.assemble(finalState, propagation, startedAt, seed, input, evaluatedVariants);
    }

    /** Shape a search state into the public result, running the aggregate rules once. */
    private assemble(
        state: InternalState,
        propagation: { violations: ConstraintViolation[] },
        startedAt: number,
        seed: number,
        input: ScheduleInput,
        evaluatedVariants: number,
    ): ScheduleResult {
        const ctx = state.ctx;
        const minHoursWeight = ctx.constraints.find((c) => c.id === 'hour-budget')?.weight ?? MIN_HOURS_WEIGHT;

        const assignments: ScheduledAssignment[] = assignedPairs(state).map(({ employeeId, instanceId }) => {
            const inst = ctx.instanceById.get(instanceId)!;
            return {
                shiftInstanceId: instanceId,
                employeeId,
                date: inst.date,
                reasons: reasonsFor(state, employeeId, instanceId),
            };
        });

        const staffing = staffingViolations(ctx, state, 'medium');
        const softHours = minHourViolations(ctx, state, minHoursWeight);

        // Pair-level and aggregate rules both run once here, not per move: they
        // are O(roster) and the search calls the objective in its innermost
        // loop. Sharing these two passes with `checkCompliance` is what stops
        // the solver and the validator from reaching different conclusions
        // about the same roster.
        const pairLevel = collectPairViolations(state);
        const aggregate = collectAggregateViolations(state);

        const violations = [...propagation.violations, ...staffing, ...softHours, ...pairLevel, ...aggregate];
        const unfilled = unfilledSlots(ctx, state);
        const hardBreaches = violations.filter((v) => v.severity === 'hard');

        // Coverage is judged on staffing shortfalls rather than on `unfilled`
        // alone: a shift can have its headcount and still be missing a required
        // tag, which is a roster that does not meet the stated requirement.
        const coverageShort = unfilled > 0 || staffing.length > 0;
        const outstanding = violations.some((v) => v.severity === 'medium') || softHours.length > 0;

        const status: ScheduleResult['status'] =
            coverageShort || hardBreaches.length > 0 ? 'partial' : outstanding ? 'feasible' : 'optimal';

        const ledger: LedgerEntry[] = [
            ...compensatoryRestLedger(state, ctx.rules.restDays),
            ...cancellationLedger(state, ctx.rules.notice),
            ...protectionLedger(state),
            ...overtimeLedger(state),
        ];
        const cost = rosterCost(state);

        return {
            status,
            assignments,
            violations,
            stats: {
                evaluatedVariants,
                durationMs: Date.now() - startedAt,
                unfilledSlots: unfilled,
            },
            provenance: {
                engineVersion: ENGINE_VERSION,
                seed,
                rulesHash: hashRules(input.rules, input.constraints, input.objectives),
                dutyClassificationNotes: dutyNotes(ctx),
                // Nothing in this module consumes a behavioural or predictive
                // per-worker signal, so the claim is structural rather than a
                // promise about configuration.
                profilingFree: true,
            },
            ...(ledger.length ? { ledger } : {}),
            ...(cost ? { cost } : {}),
        };
    }
}

function dutyNotes(ctx: ReturnType<typeof buildModel>): Record<string, string> | undefined {
    const notes: Record<string, string> = {};
    for (const inst of ctx.instances) {
        if (inst.duty?.classificationNote) notes[inst.templateId] = inst.duty.classificationNote;
    }
    return Object.keys(notes).length ? notes : undefined;
}

/** One-shot convenience wrapper around `new ShiftScheduler().solve(input)`. */
export function solveSchedule(input: ScheduleInput): ScheduleResult {
    return new ShiftScheduler().solve(input);
}
