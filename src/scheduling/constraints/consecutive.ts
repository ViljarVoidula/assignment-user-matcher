/**
 * Sequence rules — limits on runs rather than on totals.
 *
 * These are the rules a per-assignment check structurally cannot see, because
 * the breach lives in the *pattern*, not in any one shift:
 *
 *   - **Consecutive working days.** Portugal caps a shift worker at six.
 *   - **Consecutive night shifts, and the rest owed when the run ends.** Finland
 *     allows five and then requires 24h off; the Netherlands allows seven (eight
 *     by collective agreement) and then requires 46h. Only NL and FI legislate a
 *     cap at all — elsewhere it is collective-agreement territory, which is
 *     exactly why it has to be configuration rather than a built-in number.
 *   - **Forbidden successions.** The "quick return" — a late shift followed by
 *     an early one — is the single most-requested constraint in nurse rostering
 *     and is invisible to a rest rule whenever the gap technically clears the
 *     minimum.
 */

import type { ConsecutiveRule, RuleVerdict, SchedulingConstraint, SearchState, ShiftInstance } from '../types';
import type { TimelineEntry } from '../engine/timeline';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor } from './support';

export const CONSECUTIVE_CITATION = 'National working-time law / collective agreement';

/** Every sequence constraint the rule configures. */
export function consecutiveConstraints(rule: ConsecutiveRule): SchedulingConstraint[] {
    const out: SchedulingConstraint[] = [];
    if (rule.maxWorkingDays !== undefined) out.push(consecutiveDays(rule.maxWorkingDays));
    if (rule.maxNightShifts !== undefined || rule.restAfterNightBlockMinutes !== undefined) {
        out.push(consecutiveNights(rule));
    }
    if (rule.forbiddenSuccessions?.length) out.push(shiftSuccession(rule.forbiddenSuccessions));
    return out;
}

export function consecutiveDays(maxDays: number): SchedulingConstraint {
    return fromVerdict({
        id: 'consecutive-days',
        hardness: 'hard',
        weight: 1,
        citation: CONSECUTIVE_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('consecutive-days', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const probe = { ...rangeOf(inst), id: entryIdOf(pair), workingMinutes: inst.workingMinutes };
            const clock = state.ctx.clock;

            return timeline.withEntry(probe, (t) => {
                const run = t.longestConsecutiveDays((minute) => clock.dayIndexOfMinute(minute));
                if (run > maxDays) {
                    return fail(
                        'consecutive-days',
                        'hard',
                        `employee "${pair.employeeId}" would work ${run} consecutive days, over the ${maxDays}-day maximum`,
                        { actual: run, required: maxDays, unit: 'days', citation: CONSECUTIVE_CITATION },
                    );
                }
                return pass('consecutive-days', `${run} consecutive days, within the ${maxDays}-day maximum`, {
                    actual: run,
                    required: maxDays,
                    unit: 'days',
                    citation: CONSECUTIVE_CITATION,
                });
            });
        },
    });
}

export function consecutiveNights(rule: ConsecutiveRule): SchedulingConstraint {
    return fromVerdict({
        id: 'consecutive-nights',
        hardness: 'hard',
        weight: 1,
        citation: CONSECUTIVE_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('consecutive-nights', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const probe: TimelineEntry = {
                ...rangeOf(inst),
                id: entryIdOf(pair),
                workingMinutes: inst.workingMinutes,
                tag: inst.shiftTypeTag,
            };

            return timeline.withEntry(probe, (t) => {
                const nights = nightRuns(state, t);

                if (rule.maxNightShifts !== undefined) {
                    const longest = Math.max(0, ...nights.map((run) => run.length));
                    if (longest > rule.maxNightShifts) {
                        return fail(
                            'consecutive-nights',
                            'hard',
                            `employee "${pair.employeeId}" would work ${longest} consecutive night shifts, over the ${rule.maxNightShifts} maximum`,
                            {
                                actual: longest,
                                required: rule.maxNightShifts,
                                unit: 'count',
                                citation: CONSECUTIVE_CITATION,
                            },
                        );
                    }
                }

                // The rest owed once a night block ends. Only completed runs can
                // breach it: a run still in progress has no "after" yet.
                if (rule.restAfterNightBlockMinutes !== undefined) {
                    for (const run of nights) {
                        if (rule.maxNightShifts !== undefined && run.length < rule.maxNightShifts) continue;
                        const endOfRun = run[run.length - 1].end;
                        const next = t.all().find((e) => e.start >= endOfRun && !run.includes(e));
                        if (!next) continue;
                        const gap = next.start - endOfRun;
                        if (gap < rule.restAfterNightBlockMinutes) {
                            return fail(
                                'consecutive-nights',
                                'hard',
                                `employee "${pair.employeeId}" would get ${h(gap)} after a block of ${run.length} night shifts, below the ${h(rule.restAfterNightBlockMinutes)} required`,
                                {
                                    actual: gap,
                                    required: rule.restAfterNightBlockMinutes,
                                    unit: 'minutes',
                                    citation: CONSECUTIVE_CITATION,
                                },
                            );
                        }
                    }
                }

                return pass('consecutive-nights', 'night-shift run and post-block rest within limits', {
                    citation: CONSECUTIVE_CITATION,
                });
            });
        },
    });
}

export function shiftSuccession(forbidden: NonNullable<ConsecutiveRule['forbiddenSuccessions']>): SchedulingConstraint {
    return fromVerdict({
        id: 'shift-succession',
        hardness: 'hard',
        weight: 1,
        citation: CONSECUTIVE_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('shift-succession', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            const ownId = entryIdOf(pair);
            const clock = state.ctx.clock;
            const entries = timeline.all().filter((e) => e.id !== ownId);

            // Nearest neighbour on each side, and only when it is close enough
            // to be a *succession*. "Night followed by early" means the next
            // day, not the next shift whenever it happens to fall: without a
            // bound, a night four days earlier is still the nearest preceding
            // shift and every later early would breach.
            const ownDay = clock.dayIndexOfMinute(range.start);
            const adjacent = (entry: { start: number }) => Math.abs(clock.dayIndexOfMinute(entry.start) - ownDay) <= 1;

            const before = [...entries].reverse().find((e) => e.end <= range.start && adjacent(e));
            const after = entries.find((e) => e.start >= range.end && adjacent(e));

            for (const succession of forbidden) {
                const check = (fromTag: string | undefined, toTag: string | undefined, gap: number) => {
                    if (fromTag !== succession.fromTag || toTag !== succession.toTag) return null;
                    if (succession.minGapMinutes !== undefined && gap >= succession.minGapMinutes) return null;
                    const detail =
                        succession.minGapMinutes === undefined
                            ? 'is not allowed'
                            : `needs at least ${h(succession.minGapMinutes)}, got ${h(gap)}`;
                    return fail(
                        'shift-succession',
                        'hard',
                        `employee "${pair.employeeId}": a "${succession.fromTag}" shift followed by a "${succession.toTag}" shift ${detail}`,
                        {
                            actual: gap,
                            required: succession.minGapMinutes,
                            unit: 'minutes',
                            citation: CONSECUTIVE_CITATION,
                        },
                    );
                };

                if (before) {
                    const breach = check(before.tag, inst.shiftTypeTag, range.start - before.end);
                    if (breach) return breach;
                }
                if (after) {
                    const breach = check(inst.shiftTypeTag, after.tag, after.start - range.end);
                    if (breach) return breach;
                }
            }

            return pass('shift-succession', 'shift-type succession allowed', { citation: CONSECUTIVE_CITATION });
        },
    });
}

/**
 * Runs of night shifts on consecutive days.
 *
 * "Consecutive" is by calendar day, not by adjacency in the entry list: a night
 * shift, a day off, then another night shift is two runs of one, even though
 * they are neighbours on the timeline.
 */
function nightRuns(state: SearchState, timeline: ReturnType<typeof timelineFor>): TimelineEntry[][] {
    const clock = state.ctx.clock;
    const nights = timeline.all().filter((e) => isNight(state, e));

    const runs: TimelineEntry[][] = [];
    let current: TimelineEntry[] = [];
    let previousDay: number | undefined;
    for (const entry of nights) {
        const day = clock.dayIndexOfMinute(entry.start);
        if (previousDay !== undefined && day === previousDay + 1) current.push(entry);
        else {
            if (current.length) runs.push(current);
            current = [entry];
        }
        previousDay = day;
    }
    if (current.length) runs.push(current);
    return runs;
}

function isNight(state: SearchState, entry: TimelineEntry): boolean {
    const instanceId = entry.id.includes('@@') ? entry.id.slice(entry.id.indexOf('@@') + 2) : entry.id;
    const inst: ShiftInstance | undefined = state.ctx.instanceById.get(instanceId);
    if (inst) return inst.isNightShift;
    // Historical entries carry only their tag.
    return entry.tag === 'night';
}
