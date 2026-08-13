/**
 * Large-neighborhood search with late acceptance — pure logic.
 *
 * Until the wall-clock budget runs out: destroy a neighborhood (biased toward
 * understaffed and tag-short instances), repair greedily, and accept against a
 * *late* comparison rather than against the best-so-far.
 *
 * Why late acceptance rather than the strict hill climb this replaced: comparing
 * every candidate against the incumbent best rejects any move that is even
 * marginally worse, so the search stalls on the first local optimum it reaches
 * and then spends its whole budget rediscovering it. Late Acceptance Hill
 * Climbing compares against the score from `historyLength` iterations ago, which
 * lets the search drift through slightly worse states and out of a basin, while
 * still refusing sustained deterioration. It has one tunable, which is its main
 * advantage over simulated annealing here — a temperature schedule would need
 * calibrating per problem size, and this does not.
 *
 * The other change is that iterations no longer clone the whole state. The old
 * loop rebuilt the working state from the best state on every pass, which is
 * O(assignments) per iteration before any evaluation happens; at 500 employees
 * × 31 days that dominated the budget. Now the working state is mutated in
 * place and only rolled back when a move is rejected.
 */

import type { ModelContext } from '../types';
import type { PropagationResult } from './propagation';
import { greedyFill } from './construction';
import { compareScores, isBetter, scoreLex, slotShortage, tagShortage, type LexScore } from './objective';
import { assign, assignedPairs, unassign, type InternalState } from './state';
import { shuffle } from './prng';

export interface SearchOptions {
    objective: 'standard' | 'balanced';
    minHoursWeight: number;
    timeBudgetMs: number;
    rand: () => number;
    now?: () => number;
    /** Late-acceptance history length. Larger accepts more drift. */
    historyLength?: number;
    /** Called whenever a new best is found, for anytime reporting. */
    onImprovement?: (state: InternalState, score: LexScore) => void;
}

export interface SearchOutcome {
    best: InternalState;
    evaluatedVariants: number;
}

const DEFAULT_HISTORY_LENGTH = 50;
const DESTROY_FRACTION = 0.15;
const MIN_DESTROY = 3;

/** Copy a state's assignments into a fresh state (indices and reasons preserved). */
function cloneInto(from: InternalState, into: InternalState): void {
    for (const { employeeId, instanceId } of assignedPairs(from)) {
        const reasons = from.reasons.get(`${employeeId}|${instanceId}`) ?? [];
        assign(into, employeeId, instanceId, [...reasons]);
    }
}

/** Pick a destroy neighborhood: understaffed/tag-short instances first, then random. */
function pickNeighborhood(
    ctx: ModelContext,
    state: InternalState,
    rand: () => number,
    size: number,
): Array<{ employeeId: string; instanceId: string }> {
    const hot = new Set<string>();
    for (const inst of ctx.instances) {
        if (slotShortage(ctx, state, inst.id) > 0 || tagShortage(ctx, state, inst.id) > 0) hot.add(inst.id);
    }
    const pairs = assignedPairs(state).filter(
        ({ employeeId, instanceId }) => !ctx.pinned.has(`${employeeId}|${instanceId}`),
    );
    shuffle(pairs, rand);
    pairs.sort((a, b) => Number(hot.has(b.instanceId)) - Number(hot.has(a.instanceId)));
    return pairs.slice(0, Math.min(size, pairs.length));
}

/**
 * Run the LNS loop on `state` in place, returning the best state found.
 *
 * `state` is consumed: it becomes the working state. The returned best is a
 * separate snapshot, so callers may keep using it after the search ends.
 */
export function improveWithLns(
    ctx: ModelContext,
    state: InternalState,
    propagation: PropagationResult,
    options: SearchOptions,
    createEmptyState: () => InternalState,
): SearchOutcome {
    const now = options.now ?? Date.now;
    const deadline = now() + Math.max(0, options.timeBudgetMs);
    const rand = options.rand;
    const evaluate = (s: InternalState) => scoreLex(ctx, s, options.objective, options.minHoursWeight);

    const working = state;
    let workingScore = evaluate(working);

    let best = createEmptyState();
    cloneInto(working, best);
    let bestScore = workingScore;
    let evaluatedVariants = 1;

    // Late-acceptance history, seeded with the starting score.
    const historyLength = Math.max(1, options.historyLength ?? DEFAULT_HISTORY_LENGTH);
    const history: LexScore[] = new Array(historyLength).fill(workingScore);
    let iteration = 0;

    while (now() < deadline) {
        const total = assignedPairs(working).length;
        if (total === 0) break;

        const size = Math.max(MIN_DESTROY, Math.floor(total * DESTROY_FRACTION));
        const neighborhood = pickNeighborhood(ctx, working, rand, size);
        if (neighborhood.length === 0) break;

        // Remember what was removed so a rejected move can be undone exactly,
        // including the reason strings, which the result reports.
        const removed = neighborhood.map(({ employeeId, instanceId }) => ({
            employeeId,
            instanceId,
            reasons: working.reasons.get(`${employeeId}|${instanceId}`) ?? [],
        }));
        const touchedInstances = new Set<string>();
        for (const { employeeId, instanceId } of removed) {
            unassign(working, employeeId, instanceId);
            touchedInstances.add(instanceId);
        }

        const addedBefore = new Set(assignedPairs(working).map((p) => `${p.employeeId}|${p.instanceId}`));
        greedyFill(ctx, working, propagation, options.objective, rand, [...touchedInstances]);
        // A destroy can free capacity that lets other understaffed slots fill.
        greedyFill(ctx, working, propagation, options.objective, rand);

        const candidateScore = evaluate(working);
        evaluatedVariants++;

        const compareAgainst = history[iteration % historyLength];
        const accepted =
            compareScores(candidateScore, compareAgainst) <= 0 || compareScores(candidateScore, workingScore) <= 0;

        if (accepted) {
            workingScore = candidateScore;
            if (isBetter(candidateScore, bestScore)) {
                bestScore = candidateScore;
                const next = createEmptyState();
                cloneInto(working, next);
                best = next;
                options.onImprovement?.(best, bestScore);
            }
        } else {
            // Roll back: drop whatever the repair added, restore what we removed.
            for (const { employeeId, instanceId } of assignedPairs(working)) {
                if (!addedBefore.has(`${employeeId}|${instanceId}`)) unassign(working, employeeId, instanceId);
            }
            for (const { employeeId, instanceId, reasons } of removed) {
                assign(working, employeeId, instanceId, [...reasons]);
            }
        }

        history[iteration % historyLength] = workingScore;
        iteration++;
    }

    return { best, evaluatedVariants };
}
