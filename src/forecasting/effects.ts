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

/** Days the baseline expects fewer tasks than this are too noisy to read a ratio from. */
export const MIN_EXPECTED = 5;
/**
 * Evidence, in expected tasks, at which a learned size is trusted halfway: the
 * size is shrunk towards 1 as `1 + (k̂ − 1) · n / (n + EFFECT_SHRINK)`, n the
 * expected volume over the occurrences' days. One quiet occurrence cannot
 * teach a large effect from noise.
 */
export const EFFECT_SHRINK = 50;
/** A knock-on day counts only when it is this many Poisson sigmas off the baseline (as `isOutlier`)… */
const KNOCK_ON_SIGMAS = 2.5;
/** …and only inside a run of at least this many such days: one odd day is not a wave. */
const KNOCK_ON_RUN = 2;
/** Sigmas either side of a single occurrence's size for its range. */
const RANGE_SIGMAS = 2;

const shrink = (ratio: number, evidence: number) => 1 + ((ratio - 1) * evidence) / (evidence + EFFECT_SHRINK);

/**
 * Learns one effect per label from past occurrences, judged day by day
 * against `expected` (the baseline with no effects) and `actual`. Days the
 * baseline expects under `MIN_EXPECTED` tasks are skipped: a ratio of almost
 * nothing is noise.
 *
 * Size is Σ actual ÷ Σ expected over the label's days, shrunk towards 1 by the
 * evidence (`EFFECT_SHRINK`). A single occurrence's range is its Poisson
 * uncertainty (± 2 · √actual ÷ expected, widened to cover the unshrunk
 * estimate); several occurrences range over their own sizes. A knock-on day
 * is kept only when the pooled actual is `2.5 · √expected` off the baseline
 * and it sits in a run of at least two such days; its factor is shrunk the
 * same way as the size.
 */
export function learnEffects(
    past: readonly Occ[],
    actual: (day: number) => number | null,
    expected: (day: number) => number,
): Map<string, LearnedEffect> {
    interface Entry {
        kind: string;
        sizes: number[];
        a: number;
        e: number;
        shape: number[][];
        knockA: number[];
        knockE: number[];
    }
    const byLabel = new Map<string, Entry>();
    for (const occ of past) {
        if (occ.o.closed) continue;
        const ratios: number[] = [];
        let sa = 0;
        let se = 0;
        for (let d = occ.from; d <= occ.to; d++) {
            const a = actual(d);
            const e = expected(d);
            if (a === null || e < MIN_EXPECTED) continue;
            ratios.push(a / e);
            sa += a;
            se += e;
        }
        if (ratios.length === 0) continue;
        const size = sa / se;
        const entry: Entry = byLabel.get(occ.o.label) ?? {
            kind: occ.o.kind,
            sizes: [],
            a: 0,
            e: 0,
            shape: [],
            knockA: [],
            knockE: [],
        };
        entry.sizes.push(size);
        entry.a += sa;
        entry.e += se;
        ratios.slice(0, MAX_SHAPE_DAYS).forEach((r, i) => {
            (entry.shape[i] ??= []).push(size > 0 ? r / size : 1);
        });
        if (!occ.holiday) {
            for (let j = 0; j < KNOCK_ON_DAYS; j++) {
                const a = actual(occ.to + j + 1);
                const e = expected(occ.to + j + 1);
                if (a === null || e < MIN_EXPECTED) continue;
                entry.knockA[j] = (entry.knockA[j] ?? 0) + a;
                entry.knockE[j] = (entry.knockE[j] ?? 0) + e;
            }
        }
        byLabel.set(occ.o.label, entry);
    }
    const out = new Map<string, LearnedEffect>();
    for (const [label, entry] of byLabel) {
        const raw = entry.a / entry.e;
        const size = clamp(shrink(raw, entry.e), 0.05, 20);
        let low: number;
        let high: number;
        if (entry.sizes.length > 1) {
            low = Math.min(...entry.sizes.map((k) => shrink(k, entry.e)));
            high = Math.max(...entry.sizes.map((k) => shrink(k, entry.e)));
        } else {
            const sigma = (RANGE_SIGMAS * Math.sqrt(Math.max(entry.a, 1))) / entry.e;
            low = Math.max(0, Math.min(size, raw) - sigma);
            high = Math.max(size, raw) + sigma;
        }
        out.set(label, {
            label,
            kind: entry.kind,
            source: 'label',
            occurrences: entry.sizes.length,
            size,
            low: Math.min(low, size),
            high: Math.max(high, size),
            shape: entry.shape.map((values) => clamp(mean(values), 0.05, 20)),
            knockOn: knockOnOf(entry.knockA, entry.knockE),
        });
    }
    return out;
}

/** Knock-on factors per day after an event: significant days in runs of `KNOCK_ON_RUN`, trailing 1s trimmed. */
function knockOnOf(actuals: readonly number[], expecteds: readonly number[]): number[] {
    const factors: number[] = [];
    const significant: boolean[] = [];
    for (let j = 0; j < KNOCK_ON_DAYS; j++) {
        const a = actuals[j];
        const e = expecteds[j];
        const known = a !== undefined && e !== undefined;
        const k = known ? clamp(shrink(a / e, e), 0.2, 5) : 1;
        factors.push(k);
        significant.push(known && Math.abs(a - e) > KNOCK_ON_SIGMAS * Math.sqrt(e) && Math.abs(k - 1) >= KNOCK_ON_MIN);
    }
    const knockOn = factors.map((k, j) => {
        let from = j;
        while (from > 0 && significant[from - 1]) from--;
        let to = j;
        while (to < KNOCK_ON_DAYS - 1 && significant[to + 1]) to++;
        return significant[j] && to - from + 1 >= KNOCK_ON_RUN ? k : 1;
    });
    while (knockOn.length > 0 && knockOn[knockOn.length - 1] === 1) knockOn.pop();
    return knockOn;
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
