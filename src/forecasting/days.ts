/**
 * Day numbers: whole days since 1970-01-01, the integer the forecasting hot
 * path works in. ISO strings stay at the edges (inputs, outputs); a fit over
 * three years of history must not parse and format dates in its inner loops.
 */
export const DAY_MS = 86_400_000;

export const dayOf = (date: string): number => Math.round(Date.parse(`${date}T00:00:00Z`) / DAY_MS);

export const dateOf = (day: number): string => new Date(day * DAY_MS).toISOString().slice(0, 10);

/** ISO weekday of a day number: 1 (Mon) – 7 (Sun). 1970-01-01 was a Thursday. */
export const weekdayOf = (day: number): number => ((((day + 3) % 7) + 7) % 7) + 1;

/** Monday on or before a day. */
export const mondayOfDay = (day: number): number => day - (weekdayOf(day) - 1);

/** UTC day number of an epoch ms. */
export const utcDay = (ms: number): number => Math.floor(ms / DAY_MS);

const weekOfYearCache = new Map<number, number>();

/** Week of the year (0–52) of a Monday, by days since 1 January. */
export function weekOfYear(monday: number): number {
    let week = weekOfYearCache.get(monday);
    if (week === undefined) {
        const year = new Date(monday * DAY_MS).getUTCFullYear();
        const jan1 = Math.round(Date.UTC(year, 0, 1) / DAY_MS);
        week = Math.min(52, Math.floor((monday - jan1) / 7));
        weekOfYearCache.set(monday, week);
    }
    return week;
}
