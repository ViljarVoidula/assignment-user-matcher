/**
 * Events and holidays: which days they touch, and what they do to volume.
 *
 * An effect is learned per `label` from past occurrences — its size (mean
 * factor), its shape (day 2 is the peak of a three-day sale) and its knock-on
 * (returns a week after the sale). Without history for the label the planner's
 * own estimate is used, then what other events of the same kind did, then a
 * wide first-time default. Pure: the baseline it is judged against is passed in.
 */
import { dayOf } from './days';
import type { KnownOccurrence, LearnedEffect } from './types';
import { clamp, mean } from './stats';

/** How many days after an event ends are read for a knock-on wave. */
export const KNOCK_ON_DAYS = 14;
/** A knock-on day closer to 1 than this is noise, not a wave. */
const KNOCK_ON_MIN = 0.1;
/** The longest shape remembered, in days. */
const MAX_SHAPE_DAYS = 60;

/** First-time defaults by kind: a wide guess, always reported as low confidence. */
export const DEFAULT_EFFECTS: Record<string, { size: number; low: number; high: number }> = {
    sale: { size: 1.3, low: 1.0, high: 1.8 },
    campaign: { size: 1.25, low: 1.0, high: 1.7 },
    launch: { size: 1.3, low: 1.0, high: 2.0 },
    season: { size: 1.2, low: 0.9, high: 1.5 },
    holiday: { size: 0.7, low: 0.3, high: 1.2 },
};
const FALLBACK = { size: 1.2, low: 0.9, high: 1.6 };

/** An occurrence with its dates as day numbers, converted once per run. */
export interface Occ {
    o: KnownOccurrence;
    from: number;
    to: number;
    holiday: boolean;
}

export function prepareOccurrences(occurrences: readonly KnownOccurrence[]): Occ[] {
    return occurrences.map((o) => ({ o, from: dayOf(o.from), to: dayOf(o.to), holiday: o.kind === 'holiday' }));
}

/**
 * Days whose volume is not ordinary: inside an occurrence, or inside the
 * knock-on window after an event. They are left out of every baseline estimate.
 */
export function specialDays(occurrences: readonly Occ[]): Set<number> {
    const out = new Set<number>();
    for (const occ of occurrences) {
        for (let d = occ.from; d <= occ.to; d++) out.add(d);
        if (!occ.holiday) for (let j = 1; j <= KNOCK_ON_DAYS; j++) out.add(occ.to + j);
    }
    return out;
}

/**
 * Learns one effect per label from past occurrences, judged day by day
 * against `expected` (the baseline with no effects) and `actual`. Days the
 * baseline expects under half a unit are skipped: a ratio of nothing is noise.
 */
export function learnEffects(
    past: readonly Occ[],
    actual: (day: number) => number | null,
    expected: (day: number) => number,
): Map<string, LearnedEffect> {
    const byLabel = new Map<string, { kind: string; sizes: number[]; shape: number[][]; knock: number[][] }>();
    for (const occ of past) {
        if (occ.o.closed) continue;
        const ratios: number[] = [];
        for (let d = occ.from; d <= occ.to; d++) {
            const a = actual(d);
            const e = expected(d);
            if (a !== null && e >= 0.5) ratios.push(a / e);
        }
        if (ratios.length === 0) continue;
        const size = mean(ratios);
        const entry = byLabel.get(occ.o.label) ?? { kind: occ.o.kind, sizes: [], shape: [], knock: [] };
        entry.sizes.push(size);
        ratios.slice(0, MAX_SHAPE_DAYS).forEach((r, i) => {
            (entry.shape[i] ??= []).push(size > 0 ? r / size : 1);
        });
        if (!occ.holiday) {
            for (let j = 1; j <= KNOCK_ON_DAYS; j++) {
                const a = actual(occ.to + j);
                const e = expected(occ.to + j);
                if (a === null || e < 0.5) continue;
                (entry.knock[j - 1] ??= []).push(a / e);
            }
        }
        byLabel.set(occ.o.label, entry);
    }
    const out = new Map<string, LearnedEffect>();
    for (const [label, entry] of byLabel) {
        const size = clamp(mean(entry.sizes), 0.05, 20);
        const low = entry.sizes.length > 1 ? Math.min(...entry.sizes) : size * 0.8;
        const high = entry.sizes.length > 1 ? Math.max(...entry.sizes) : size * 1.25;
        const knockOn = Array.from(entry.knock, (values) => {
            const k = values && values.length > 0 ? mean(values) : 1;
            return Math.abs(k - 1) < KNOCK_ON_MIN ? 1 : clamp(k, 0.2, 5);
        });
        while (knockOn.length > 0 && knockOn[knockOn.length - 1] === 1) knockOn.pop();
        out.set(label, {
            label,
            kind: entry.kind,
            source: 'label',
            occurrences: entry.sizes.length,
            size,
            low: Math.min(low, size),
            high: Math.max(high, size),
            shape: entry.shape.map((values) => clamp(mean(values), 0.05, 20)),
            knockOn,
        });
    }
    return out;
}

/**
 * The effect a (usually future) occurrence gets: its own label's history,
 * else the planner's estimate, else what its kind did, else the default.
 */
export function effectFor(o: KnownOccurrence, learned: ReadonlyMap<string, LearnedEffect>): LearnedEffect {
    const base = { label: o.label, kind: o.kind, shape: [1], knockOn: [] as number[] };
    if (o.closed) return { ...base, source: 'planned', occurrences: 0, size: 0, low: 0, high: 0 };
    const own = learned.get(o.label);
    if (own) return own;
    if (o.planned) {
        const size = Math.max(0, 1 + o.planned.likely / 100);
        const a = Math.max(0, 1 + (o.planned.low ?? o.planned.likely * 0.5) / 100);
        const b = Math.max(0, 1 + (o.planned.high ?? o.planned.likely * 1.5) / 100);
        return { ...base, source: 'planned', occurrences: 0, size, low: Math.min(a, b, size), high: Math.max(a, b, size) };
    }
    const sameKind = [...learned.values()].filter((e) => e.kind === o.kind && e.source === 'label');
    if (sameKind.length > 0) {
        const size = mean(sameKind.map((e) => e.size));
        return {
            ...base,
            source: 'kind',
            occurrences: sameKind.reduce((n, e) => n + e.occurrences, 0),
            size,
            low: Math.min(size, ...sameKind.map((e) => e.low)),
            high: Math.max(size, ...sameKind.map((e) => e.high)),
        };
    }
    const d = DEFAULT_EFFECTS[o.kind] ?? FALLBACK;
    return { ...base, source: 'default', occurrences: 0, ...d };
}

/**
 * What the forecast would assume for an occurrence, given the effects a
 * forecast learned (`SeriesForecast.effects`): the platform's "size, shape,
 * knock-on" suggestion for an event a planner is typing in (spec §7.2).
 */
export function suggestEffect(o: KnownOccurrence, learned: readonly LearnedEffect[]): LearnedEffect {
    return effectFor(o, new Map(learned.filter((e) => e.source === 'label').map((e) => [e.label, e])));
}

export interface DayEffect {
    /** Product of every holiday factor touching the day. */
    holiday: number;
    /** Every non-holiday effect touching the day (inside the event, or its knock-on). */
    events: Array<{ label: string; factor: number; low: number; high: number }>;
}

const NONE: DayEffect = { holiday: 1, events: [] };

/**
 * What every occurrence does to one day. Inside an occurrence the factor is
 * `size × shape[day]`; after it, the knock-on day's factor.
 */
export function dayEffect(day: number, occurrences: readonly Occ[], effects: ReadonlyMap<Occ, LearnedEffect>): DayEffect {
    let holiday = 1;
    let events: DayEffect['events'] | null = null;
    for (const occ of occurrences) {
        if (day < occ.from || day > occ.to + KNOCK_ON_DAYS) continue;
        const effect = effects.get(occ);
        if (!effect) continue;
        if (day <= occ.to) {
            const shape = effect.shape[Math.min(day - occ.from, effect.shape.length - 1)] ?? 1;
            const factor = effect.size * shape;
            if (occ.holiday) holiday *= factor;
            else (events ??= []).push({ label: occ.o.label, factor, low: effect.low * shape, high: effect.high * shape });
            continue;
        }
        if (occ.holiday) continue;
        const j = day - occ.to;
        if (j <= effect.knockOn.length) {
            const factor = effect.knockOn[j - 1];
            if (factor !== 1) (events ??= []).push({ label: occ.o.label, factor, low: factor, high: factor });
        }
    }
    return holiday === 1 && events === null ? NONE : { holiday, events: events ?? [] };
}
