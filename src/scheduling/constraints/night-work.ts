/**
 * Night work — Directive 2003/88/EC Art 2(3), 2(4) and 8.
 *
 * Art 8 has two limbs that behave differently and are routinely conflated:
 *
 *   - **8(a)** caps a night worker's normal hours at an *average* of eight per
 *     24h, over a reference period national law sets (the Directive fixes no
 *     ceiling on it);
 *   - **8(b)** caps night work involving *special hazards or heavy physical or
 *     mental strain* at eight hours in any 24h — **absolute, no averaging**.
 *
 * So the same eight-hour figure is a soft average for most workers and a hard
 * per-day ceiling for some, selected per person by a `hazardousNight`
 * protection. Getting that backwards under-protects exactly the people the
 * provision exists for.
 *
 * The night band itself is national and, in Poland, employer-chosen: it ranges
 * from 20:00–06:00 (BE) to 00:00–07:00 (IE), subject to the Art 2(3) floor of
 * at least seven hours including 00:00–05:00.
 */

import type { NightWorkRule, RuleVerdict, SchedulingConstraint, SearchState } from '../types';
import type { TimelineEntry } from '../engine/timeline';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor, MINUTES_PER_DAY } from './support';

export const NIGHT_WORK_CITATION = 'Directive 2003/88/EC Art 8';

export function nightWork(rule: NightWorkRule): SchedulingConstraint {
    return fromVerdict({
        id: 'night-work',
        hardness: 'hard',
        weight: 1,
        citation: NIGHT_WORK_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('night-work', 'unknown shift');

            const clock = state.ctx.clock;
            const range = rangeOf(inst);

            // Outright bans first: 94/33/EC bars adolescents from 00:00-04:00
            // regardless of how the rest of the rule is configured.
            for (const banned of rule.prohibitedRanges ?? []) {
                const inside = clock.minutesInClockRange(range, banned);
                if (inside > 0) {
                    return fail(
                        'night-work',
                        'hard',
                        `employee "${pair.employeeId}" may not work ${banned.from}-${banned.to}; "${inst.id}" overlaps it by ${h(inside)}`,
                        { actual: inside, required: 0, unit: 'minutes', citation: NIGHT_WORK_CITATION },
                    );
                }
            }

            const timelineForHazard = timelineFor(state, pair.employeeId);
            const hazardProbe: TimelineEntry = {
                ...range,
                id: entryIdOf(pair),
                workingMinutes: inst.workingMinutes,
                tag: inst.shiftTypeTag,
            };

            // Art 8(b) is checked before the night-shift gate on purpose. The cap
            // is on a hazardous night worker's total work in any 24 hours, so a
            // day shift stacked onto the same rolling day breaches it just as a
            // second night would — gating on "is this shift itself a night shift"
            // would let exactly that combination through.
            if (isHazardous(state, pair.employeeId, rule) && rule.maxShiftMinutes !== undefined) {
                const breach = timelineForHazard.withEntry(hazardProbe, (t) => {
                    const worstDay = t.maxWorkingMinutesInAnyWindow(MINUTES_PER_DAY, {
                        start: range.start - MINUTES_PER_DAY,
                        end: range.end + MINUTES_PER_DAY,
                    });
                    return worstDay > rule.maxShiftMinutes! ? worstDay : null;
                });
                if (breach !== null) {
                    return fail(
                        'night-work',
                        'hard',
                        `employee "${pair.employeeId}" does hazardous night work and would reach ${h(breach)} in a 24h window, over the absolute ${h(rule.maxShiftMinutes)} cap`,
                        {
                            actual: breach,
                            required: rule.maxShiftMinutes,
                            unit: 'minutes',
                            citation: 'Directive 2003/88/EC Art 8(b)',
                        },
                    );
                }
            }

            if (!inst.isNightShift) {
                return pass('night-work', `"${inst.id}" is not a night shift`, { citation: NIGHT_WORK_CITATION });
            }

            if (rule.maxShiftMinutes !== undefined && inst.workingMinutes > rule.maxShiftMinutes) {
                return fail(
                    'night-work',
                    'hard',
                    `night shift "${inst.id}" is ${h(inst.workingMinutes)}, over the ${h(rule.maxShiftMinutes)} night limit`,
                    {
                        actual: inst.workingMinutes,
                        required: rule.maxShiftMinutes,
                        unit: 'minutes',
                        citation: NIGHT_WORK_CITATION,
                    },
                );
            }

            const timeline = timelineFor(state, pair.employeeId);
            const probe: TimelineEntry = {
                ...range,
                id: entryIdOf(pair),
                workingMinutes: inst.workingMinutes,
                tag: inst.shiftTypeTag,
            };

            return timeline.withEntry(probe, (t) => {
                // Art 8(a): the averaged limit, for night workers generally.
                if (rule.averageWindowDays !== undefined && rule.maxShiftMinutes !== undefined) {
                    const span = rule.averageWindowDays * MINUTES_PER_DAY;
                    const worst = t.maxWorkingMinutesInAnyWindow(span, {
                        start: range.start - span,
                        end: range.end + span,
                    });
                    const allowance = rule.maxShiftMinutes * rule.averageWindowDays;
                    if (worst > allowance) {
                        return fail(
                            'night-work',
                            'hard',
                            `employee "${pair.employeeId}" would average over ${h(rule.maxShiftMinutes)} of night work per 24h across ${rule.averageWindowDays} days`,
                            {
                                actual: worst,
                                required: allowance,
                                unit: 'minutes',
                                citation: 'Directive 2003/88/EC Art 8(a)',
                            },
                        );
                    }
                }

                for (const quota of rule.volumeQuotas ?? []) {
                    const span = quota.windowDays * MINUTES_PER_DAY;
                    const count = worstNightCount(state, t, quota, span, range);
                    if (count > quota.max) {
                        const label = quota.label ?? `${quota.max} night shifts / ${quota.windowDays}d`;
                        return fail(
                            'night-work',
                            'hard',
                            `employee "${pair.employeeId}" would reach ${count} qualifying night shifts in a ${quota.windowDays}-day window, over the ${label} quota`,
                            { actual: count, required: quota.max, unit: 'count', citation: NIGHT_WORK_CITATION },
                        );
                    }
                }

                return pass('night-work', 'within every configured night-work limit', { citation: NIGHT_WORK_CITATION });
            });
        },
    });
}

/** Whether this person is subject to the Art 8(b) absolute cap. */
function isHazardous(state: SearchState, employeeId: string, rule: NightWorkRule): boolean {
    if (rule.absoluteWhenHazardous === false) return false;
    const employee = state.ctx.employeeById.get(employeeId);
    return (employee?.protections ?? []).some((p) => p.kind === 'hazardousNight');
}

/**
 * Worst count of qualifying night shifts over any window of `span`.
 *
 * `endingAfter` narrows the count to shifts finishing past a wall-clock time —
 * the Netherlands counts only those ending after 02:00 towards its 36-per-16-week
 * quota, so a 22:00–01:00 shift does not consume the allowance.
 */
function worstNightCount(
    state: SearchState,
    timeline: ReturnType<typeof timelineFor>,
    quota: { endingAfter?: string },
    span: number,
    around: { start: number; end: number },
): number {
    const clock = state.ctx.clock;
    const qualifies = (entry: TimelineEntry) => {
        const inst = findInstance(state, entry);
        if (!inst?.isNightShift) return false;
        if (!quota.endingAfter) return true;
        const day = clock.dayIndexOfMinute(entry.end);
        const threshold = clock.toPeriodMinutes(clock.dateAt(day), quota.endingAfter, 'nightWork.volumeQuotas.endingAfter');
        return entry.end > threshold;
    };

    let worst = 0;
    for (let start = around.start - span; start <= around.end; start += MINUTES_PER_DAY) {
        const count = timeline.countIn({ start, end: start + span }, qualifies);
        if (count > worst) worst = count;
    }
    return worst;
}

/** Recover the shift instance behind a timeline entry, if it is one. */
function findInstance(state: SearchState, entry: TimelineEntry) {
    const instanceId = entry.id.includes('@@') ? entry.id.slice(entry.id.indexOf('@@') + 2) : entry.id;
    return state.ctx.instanceById.get(instanceId);
}
