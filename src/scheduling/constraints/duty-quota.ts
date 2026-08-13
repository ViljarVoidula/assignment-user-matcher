/**
 * Duty-type volume quotas — rolling caps on how much of one duty type a person
 * may hold, matched on `shiftTypeTag`.
 *
 * The canonical case is a stand-by ceiling: "at most 30 hours of *valveaeg* in
 * any month". Working-time limits cannot express it, because a stand-by duty's
 * point is precisely that most of its span does *not* count as working time —
 * so the quota measures **elapsed** duty minutes (how long the duty occupies
 * the person's clock), or a plain occurrence count. Night work has its own
 * quota shape (`NightWorkRule.volumeQuotas`) because "night shift" is a
 * predicate over the clock band, not a tag; everything tag-shaped lands here.
 *
 * Windows are rolling, anchored on the person's own matching duties — a
 * calendar-month grid would miss a run of stand-by straddling the month
 * boundary, which is exactly where such runs cluster.
 */

import type { DutyQuota, RuleVerdict, SchedulingConstraint } from '../types';
import type { MinuteRange } from '../time';
import { overlapMinutes } from '../time';
import type { PersonTimeline, TimelineEntry } from '../engine/timeline';
import { entryIdOf, fail, fromVerdict, h, instanceOf, pass, rangeOf, rulesFor, timelineFor, MINUTES_PER_DAY } from './support';

export const DUTY_QUOTA_CITATION = 'National duty-volume law (e.g. EE Töölepingu seadus §48)';

export function dutyQuotas(quotas: DutyQuota[]): SchedulingConstraint {
    return fromVerdict({
        id: 'duty-quota',
        hardness: 'hard',
        weight: 1,
        citation: DUTY_QUOTA_CITATION,
        verdict(state, pair): RuleVerdict {
            const inst = instanceOf(state, pair);
            if (!inst) return pass('duty-quota', 'unknown shift');
            if (!inst.shiftTypeTag) return pass('duty-quota', 'shift has no duty type');

            const applied = rulesFor(state.ctx, pair.employeeId).dutyQuotas ?? quotas;
            const applicable = applied.filter((q) => q.shiftTypeTag === inst.shiftTypeTag);
            if (applicable.length === 0) return pass('duty-quota', `no quota covers "${inst.shiftTypeTag}"`);

            const timeline = timelineFor(state, pair.employeeId);
            const range = rangeOf(inst);
            const probe = { ...range, id: entryIdOf(pair), workingMinutes: inst.workingMinutes, tag: inst.shiftTypeTag };

            return timeline.withEntry(probe, (t) => {
                for (const quota of applicable) {
                    const span = quota.windowDays * MINUTES_PER_DAY;
                    const citation = quota.citation ?? DUTY_QUOTA_CITATION;
                    const label = quota.label ?? `${quota.shiftTypeTag} / ${quota.windowDays}d`;

                    if (quota.maxMinutes !== undefined) {
                        const worst = worstTagged(t, quota.shiftTypeTag, span, range, sumElapsed);
                        if (worst > quota.maxMinutes) {
                            return fail(
                                'duty-quota',
                                'hard',
                                `employee "${pair.employeeId}" would hold ${h(worst)} of "${quota.shiftTypeTag}" duty in some ${quota.windowDays}-day window, over the ${h(quota.maxMinutes)} quota (${label})`,
                                { actual: worst, required: quota.maxMinutes, unit: 'minutes', citation },
                            );
                        }
                    }

                    if (quota.maxCount !== undefined) {
                        const worst = worstTagged(t, quota.shiftTypeTag, span, range, (hits) => hits.length);
                        if (worst > quota.maxCount) {
                            return fail(
                                'duty-quota',
                                'hard',
                                `employee "${pair.employeeId}" would hold ${worst} "${quota.shiftTypeTag}" duties in some ${quota.windowDays}-day window, over the ${quota.maxCount} quota (${label})`,
                                { actual: worst, required: quota.maxCount, unit: 'count', citation },
                            );
                        }
                    }
                }
                return pass('duty-quota', 'within every configured duty quota', { citation: DUTY_QUOTA_CITATION });
            });
        },
    });
}

/**
 * Worst value of `measure` over matching entries intersected with any window of
 * `span` minutes near `range`. Candidate left edges sit on matching-entry
 * boundaries — sliding a window until an edge meets a boundary never reduces
 * the extreme being sought, so this finite set contains the answer.
 */
function worstTagged(
    timeline: PersonTimeline,
    tag: string,
    span: number,
    range: MinuteRange,
    measure: (hits: TimelineEntry[], window: MinuteRange) => number,
): number {
    const bounds = { start: range.start - 2 * span, end: range.end + 2 * span };
    const matching = timeline.entriesIn(bounds).filter((e) => e.tag === tag);
    if (matching.length === 0) return 0;

    const starts = new Set<number>();
    for (const entry of matching) {
        starts.add(entry.start);
        starts.add(entry.end - span);
    }
    let worst = 0;
    for (const start of starts) {
        const window = { start, end: start + span };
        const hits = matching.filter((e) => e.start < window.end && e.end > window.start);
        const value = measure(hits, window);
        if (value > worst) worst = value;
    }
    return worst;
}

/** Elapsed duty minutes inside the window, counting partial overlaps. */
function sumElapsed(hits: TimelineEntry[], window: MinuteRange): number {
    return hits.reduce((sum, entry) => sum + overlapMinutes(entry, window), 0);
}
