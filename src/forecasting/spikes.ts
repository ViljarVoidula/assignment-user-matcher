/**
 * "What was this?" (spec §7.1): recent days far outside what the model
 * expected and that no known event or holiday explains, grouped into spans
 * and broken down by which series moved. Naming one (on the platform) turns it
 * into a past occurrence, which divides it out and teaches its effect.
 *
 * Spans are UTC days: each day's actual is the daily table's, and its
 * expectation is `explainedDay` on the same UTC day — never a local-day sum.
 */
import { dateOf } from './days';
import { specialDays } from './effects';
import { actualOn, explainedDay, isOutlier, type FittedSeries } from './model';
import type { SpikeSpan } from './types';

/** How far back spikes are looked for: the hourly table's 16 weeks. */
export const SPIKE_LOOKBACK_DAYS = 112;
/** A series moved with a span when it carries at least this share of the span's excess. */
const MIN_SHARE = 0.05;

interface SpikeDay {
    day: number;
    actual: number;
    expected: number;
    direction: 'up' | 'down';
}

export function detectSpikes(total: FittedSeries, others: readonly FittedSeries[]): SpikeSpan[] {
    if (!total.span || total.level <= 0) return [];
    const explained = specialDays(total.occurrences);
    const days: SpikeDay[] = [];
    // The first day of history is partial, never a spike.
    const from = Math.max(total.span.to - (SPIKE_LOOKBACK_DAYS - 1), total.span.from + 1);
    for (let day = from; day <= total.span.to; day++) {
        if (explained.has(day)) continue;
        const expected = explainedDay(total, day);
        const actual = actualOn(total, day) ?? 0;
        if (!isOutlier(actual, expected)) continue;
        days.push({ day, actual, expected, direction: actual > expected ? 'up' : 'down' });
    }

    const spans: SpikeDay[][] = [];
    for (const day of days) {
        const last = spans[spans.length - 1];
        const prev = last?.[last.length - 1];
        // One quiet day in between does not split a span.
        if (prev && prev.direction === day.direction && day.day - prev.day <= 2) last.push(day);
        else spans.push([day]);
    }

    return spans.map((span) => {
        const excess = span.reduce((s, d) => s + d.actual - d.expected, 0);
        const ratios = span.map((d) => d.actual / d.expected);
        const direction = span[0].direction;
        const bySeries = others
            .map((model) => ({
                series: model.series,
                excess: span.reduce((s, d) => s + (actualOn(model, d.day) ?? 0) - explainedDay(model, d.day), 0),
            }))
            .filter((s) => excess !== 0 && s.excess / excess >= MIN_SHARE)
            .sort((a, b) => Math.abs(b.excess) - Math.abs(a.excess))
            .slice(0, 5)
            .map((s) => ({
                series: s.series,
                excess: Math.round(s.excess * 10) / 10,
                share: Math.round((s.excess / excess) * 100) / 100,
            }));
        return {
            from: dateOf(span[0].day),
            to: dateOf(span[span.length - 1].day),
            direction,
            excess: Math.round(excess * 10) / 10,
            peakRatio: Math.round((direction === 'up' ? Math.max(...ratios) : Math.min(...ratios)) * 100) / 100,
            bySeries,
        };
    });
}
