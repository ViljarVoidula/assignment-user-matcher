/**
 * Helpers for expressing working-time rules.
 *
 * These are arithmetic conveniences, not policy: they hold no jurisdiction's
 * numbers, they just remove the two conversions people reliably get wrong when
 * writing a `WorkingTimeRules` object by hand.
 */

import type { RollingAverage } from './types';

/**
 * "At most `hoursPerWeek` on average over `days`" as a rolling-window limit.
 *
 * The conversion is the trap. A rolling average is expressed as a *total* over
 * the window, so 48h/week over four months is not `{maxMinutes: 2880,
 * windowDays: 120}` — that would cap the whole four months at 48 hours. It is
 * 48h × (120 ÷ 7) ≈ 823h. Getting this wrong produces a rule that looks right
 * and is off by a factor of seventeen.
 */
export function weeklyAverageOver(hoursPerWeek: number, days: number, label?: string): RollingAverage {
    return {
        maxMinutes: Math.round((hoursPerWeek * 60 * days) / 7),
        windowDays: days,
        label: label ?? `${hoursPerWeek}h/week averaged over ${days} days`,
    };
}

/** Hours as minutes, for readability in rule objects. */
export function hours(count: number): number {
    return Math.round(count * 60);
}

/** Days as minutes. */
export function days(count: number): number {
    return count * 1440;
}
