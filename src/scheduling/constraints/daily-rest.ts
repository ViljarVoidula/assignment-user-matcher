/**
 * Daily rest — Directive 2003/88/EC Art 3 and its national variants.
 *
 * The EU floor is 11 consecutive hours per 24-hour period; Spain and Romania
 * require 12, Finnish period work allows 9. Derogations under Art 17/18 may
 * reduce it further (8h in NL/DK/CZ, 9h in FR by collective agreement) but only
 * against equivalent compensatory rest — which Jaeger (C-151/02) requires
 * "immediately following" the period worked, and which never licenses breaching
 * the weekly hours cap.
 *
 * Three shapes national law takes that a naive "gap between consecutive shifts"
 * check cannot express, all handled here:
 *
 *   - the rest must fit in *every rolling 24h*, not merely between two shifts;
 *   - a reduction may be used only so many times per window (NL: once per 7×24h);
 *   - the rest may have to *contain* a clock band — Sweden requires the 11h to
 *     include 00:00–05:00, which is positional, not a duration at all.
 */

import type { DailyRestRule, RuleVerdict, SchedulingConstraint, SearchState, AssignmentPair } from '../types';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, timelineFor, MINUTES_PER_DAY } from './support';

export const DAILY_REST_CITATION = 'Directive 2003/88/EC Art 3';

export function dailyRest(rule: DailyRestRule): SchedulingConstraint {
    const windowMinutes = rule.perWindowMinutes ?? MINUTES_PER_DAY;
    // A permitted derogation moves the effective floor down; the allowance on
    // how often it may be used is enforced separately below.
    const floor = rule.reducibleToMinutes ?? rule.minMinutes;

    return fromVerdict({
        id: 'daily-rest',
        hardness: 'hard',
        weight: 1,
        citation: DAILY_REST_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('daily-rest', 'unknown shift');

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            const gap = timeline.minGapAround(range, entryIdOf(pair));

            if (gap === 0) {
                // Overlapping work is `no-overlap`'s business; reporting it here
                // too would double-count the same defect. A zero gap without an
                // overlap is back-to-back work, and that IS this rule's business
                // — fall through to the floor check.
                const own = entryIdOf(pair);
                const overlapping = timeline.entriesIn(range).some((e) => e.id !== own);
                if (overlapping) return pass('daily-rest', 'overlap is handled by no-overlap');
            }

            if (gap < floor) {
                return fail(
                    'daily-rest',
                    'hard',
                    `employee "${pair.employeeId}" would get ${h(gap)} rest around "${inst.id}", below the ${h(floor)} minimum`,
                    { actual: gap, required: floor, unit: 'minutes', citation: DAILY_REST_CITATION },
                );
            }

            // Art 3 is "per 24-hour period", not "between two shifts". The gap
            // check above misses the case where several duties in one day each
            // leave an acceptable gap but no single stretch of rest reaches the
            // minimum — a 14h duty inside a 24h window cannot yield 11h off,
            // however comfortable the gaps either side of it are.
            const rolling = timeline.withEntry(
                { ...range, id: entryIdOf(pair), workingMinutes: inst.workingMinutes },
                (t) =>
                    t.minLongestRestInAnyWindow(windowMinutes, {
                        start: range.start - windowMinutes,
                        end: range.end + windowMinutes,
                    }),
            );
            if (rolling < floor) {
                return fail(
                    'daily-rest',
                    'hard',
                    `employee "${pair.employeeId}" would have only ${h(rolling)} continuous rest in some ${h(windowMinutes)} window, below the ${h(floor)} minimum`,
                    { actual: rolling, required: floor, unit: 'minutes', citation: DAILY_REST_CITATION },
                );
            }

            // Between the reduced floor and the nominal minimum the assignment
            // is lawful only if a reduction allowance is left.
            if (gap < rule.minMinutes && rule.reductionsPer) {
                const used = countReductions(state, pair, rule);
                if (used > rule.reductionsPer.max) {
                    return fail(
                        'daily-rest',
                        'hard',
                        `employee "${pair.employeeId}" would use a ${h(gap)} reduced rest more than ${rule.reductionsPer.max} time(s) per ${rule.reductionsPer.windowDays} days`,
                        { actual: used, required: rule.reductionsPer.max, unit: 'count', citation: DAILY_REST_CITATION },
                    );
                }
            }

            if (rule.mustContainClockRange) {
                const intrusion = state.ctx.clock.minutesInClockRange(range, rule.mustContainClockRange);
                if (intrusion > 0) {
                    return fail(
                        'daily-rest',
                        'hard',
                        `employee "${pair.employeeId}"'s rest must cover ${rule.mustContainClockRange.from}-${rule.mustContainClockRange.to}, but "${inst.id}" works ${h(intrusion)} inside it`,
                        { actual: intrusion, required: 0, unit: 'minutes', citation: DAILY_REST_CITATION },
                    );
                }
            }

            return pass('daily-rest', `${h(gap)} rest, at or above the ${h(rule.minMinutes)} minimum`, {
                actual: gap,
                required: rule.minMinutes,
                unit: 'minutes',
                citation: DAILY_REST_CITATION,
            });
        },
    });
}

/**
 * How many reduced rest periods fall in the allowance window, counting the
 * candidate assignment.
 *
 * Counted over the *gaps between consecutive entries* rather than per entry:
 * one short rest sits between two shifts, so asking each shift about its
 * neighbours would count it twice.
 */
function countReductions(state: SearchState, pair: AssignmentPair, rule: DailyRestRule): number {
    const inst = state.ctx.instanceById.get(pair.shiftInstanceId)!;
    const timeline = timelineFor(state, pair.employeeId);
    const span = (rule.reductionsPer?.windowDays ?? 7) * MINUTES_PER_DAY;
    const window = { start: inst.startMinute - span, end: inst.endMinute + span };
    const floor = rule.reducibleToMinutes ?? rule.minMinutes;

    // The candidate is not on the timeline yet, so splice it into the ordered
    // list before measuring the gaps it creates.
    const entries = [...timeline.entriesIn(window).filter((e) => e.id !== entryIdOf(pair)), rangeOf(inst)].sort(
        (a, b) => a.start - b.start,
    );

    let reductions = 0;
    for (let i = 1; i < entries.length; i++) {
        const gap = entries[i].start - entries[i - 1].end;
        if (gap > 0 && gap < rule.minMinutes && gap >= floor) reductions++;
    }
    return reductions;
}

/*
 * The clock-band rule reduces to "do not work inside the protected band".
 *
 * An earlier version asked whether *some* nearby night still had an unbroken
 * band free, which passes a shift that eats one night as long as the night
 * before was quiet. Sweden's requirement is that each daily rest include
 * 00:00–05:00, so working through any occurrence of the band breaches it — the
 * check is the intrusion, measured directly on the candidate's own span.
 */
