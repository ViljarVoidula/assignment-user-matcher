/**
 * Nowcast (spec §7.1 step 6): the next 72 hours rescaled by how today has gone
 * so far. The ratio is the one the Today lane has always used — completed
 * hours only, ignored under five expected, held to [0.5, 3] — and it fades
 * linearly to nothing over 72 hours, because a busy morning says a lot about
 * this afternoon and little about Thursday.
 */
import { HOUR_MS } from './calendar';
import type { HourForecast, HourlyPoint } from './types';
import { clamp, round } from './stats';

export const NOWCAST_HOURS = 72;

export function nowcastRatio(actualSoFar: number, expectedSoFar: number): number {
    if (expectedSoFar < 5) return 1;
    return clamp(actualSoFar / expectedSoFar, 0.5, 3);
}

/**
 * Re-applies the nowcast to a stored forecast. `hours` must start at local
 * midnight today (as `forecastWorkspace` writes them); any nowcast already on
 * them is taken off first, so calling this every few minutes with fresh
 * actuals is safe.
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
