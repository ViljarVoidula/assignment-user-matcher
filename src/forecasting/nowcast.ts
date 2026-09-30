/**
 * Nowcast (spec §7.1 step 6): the next 72 hours rescaled by how today has gone
 * so far — completed hours only, ignored under five expected, shrunk towards 1
 * by `NOWCAST_PRIOR` tasks on each side, held to [0.5, 3] — fading linearly to
 * nothing over 72 hours, because a busy morning says a lot about this
 * afternoon and little about Thursday.
 */
import { HOUR_MS } from './calendar';
import type { HourForecast, HourlyPoint } from './types';
import { clamp, round } from './stats';

export const NOWCAST_HOURS = 72;
/**
 * Pseudo-tasks added to both sides of the ratio: twelve seen over six expected at 7am is Poisson noise, not
 * a doubling, and must not double the afternoon. Near-neutral early in a quiet day, full strength once
 * hundreds of tasks back it.
 */
export const NOWCAST_PRIOR = 25;

export function nowcastRatio(actualSoFar: number, expectedSoFar: number): number {
    if (expectedSoFar < 5) return 1;
    return clamp((actualSoFar + NOWCAST_PRIOR) / (expectedSoFar + NOWCAST_PRIOR), 0.5, 3);
}

/**
 * Re-applies the nowcast to a stored forecast. `hours` must start at local
 * midnight today (as `forecastWorkspace` writes them); any nowcast already on
 * them is taken off first, so calling this every few minutes with fresh
 * actuals is safe.
 *
 * `actual` is read as complete: an hour missing from it is an hour in which
 * nothing arrived, so `[]` means zero seen so far today (and pulls the
 * forecast down). A caller with no hourly feed for the series must not call
 * this — `forecastWorkspace` skips it for a series with no hourly history today.
 */
export function applyNowcast(hours: readonly HourForecast[], actual: readonly HourlyPoint[], now: number): HourForecast[] {
    const current = Math.floor(now / HOUR_MS) * HOUR_MS;
    const plain = hours.map((h) => {
        const n = h.components.nowcast || 1;
        return {
            ...h,
            likely: h.likely / n,
            low: h.low / n,
            high: h.high / n,
            components: { ...h.components, nowcast: 1 },
        };
    });
    const start = plain.length > 0 ? plain[0].at : current;
    let expected = 0;
    for (const h of plain) if (h.at >= start && h.at < current) expected += h.likely;
    let seen = 0;
    for (const p of actual) if (p.at >= start && p.at < current) seen += p.value;
    const ratio = nowcastRatio(seen, expected);
    if (ratio === 1) return plain;
    return plain.map((h) => {
        if (h.at < current) return h;
        const lead = (h.at - current) / HOUR_MS;
        const factor = 1 + (ratio - 1) * Math.max(0, 1 - lead / NOWCAST_HOURS);
        if (factor === 1) return h;
        return {
            ...h,
            likely: round(h.likely * factor),
            low: round(h.low * factor),
            high: round(h.high * factor),
            components: { ...h.components, nowcast: round(factor, 4) },
        };
    });
}
