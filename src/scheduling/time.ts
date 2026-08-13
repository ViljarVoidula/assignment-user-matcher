/**
 * Time model — pure logic, zero dependencies.
 *
 * The engine works in "period minutes": integer minutes elapsed since local
 * midnight on `period.startDate` in the roster's time zone. That keeps the hot
 * path integer-only while staying correct across DST transitions.
 *
 * Why this matters legally: on the EU changeover nights (last Sunday of March
 * and October) a 22:00–06:00 shift is 7h or 9h, not 8h. Naive UTC-epoch
 * arithmetic — what `model.ts` does today — reports 8h, which then feeds hour
 * budgets, rolling-window averages and rest gaps. Every one of those is a
 * number an inspector can check, so the error is material, not cosmetic.
 *
 * Zone offsets come from `Intl.DateTimeFormat`, which ships with Node and the
 * browser; the library stays dependency-free.
 */

import { ScheduleValidationError } from './types';

export const MINUTES_PER_DAY = 1440;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_OF_DAY = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

/** A half-open range of period minutes, `[start, end)`. */
export interface MinuteRange {
    start: number;
    end: number;
}

/** A wall-clock time-of-day range; `to <= from` means it wraps past midnight (e.g. 22:00–06:00). */
export interface ClockRange {
    from: string;
    to: string;
}

/**
 * Resolves wall-clock times in one IANA zone to period minutes and back.
 *
 * Construct once per solve and share it: each instance memoizes the per-day UTC
 * offset, so repeated conversions cost a map lookup rather than an `Intl` call.
 */
export class PeriodClock {
    readonly startDate: string;
    readonly timeZone: string;
    readonly days: number;

    private readonly formatter: Intl.DateTimeFormat;
    /** UTC epoch ms of local midnight, keyed by day index from the period start. */
    private readonly midnightByDay = new Map<number, number>();
    /** UTC epoch ms of local midnight on the period start — the origin of period minutes. */
    private originMs!: number;

    constructor(startDate: string, days: number, timeZone = 'UTC') {
        assertIsoDate(startDate, 'period.startDate');
        if (!Number.isInteger(days) || days <= 0) {
            throw new ScheduleValidationError(`period must span at least one day, got ${days}`);
        }
        this.startDate = startDate;
        this.days = days;
        this.timeZone = timeZone;
        try {
            this.formatter = new Intl.DateTimeFormat('en-US', {
                timeZone,
                hourCycle: 'h23',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            throw new ScheduleValidationError(`Unknown time zone: "${timeZone}"`);
        }
        this.originMs = this.utcInstantMs(startDate, 0);
    }

    /** Day index of an ISO date relative to the period start; negative before it. */
    dayIndexOf(date: string): number {
        assertIsoDate(date, 'date');
        return daysBetween(this.startDate, date);
    }

    /** ISO date `offset` days after the period start. */
    dateAt(offset: number): string {
        return addDays(this.startDate, offset);
    }

    /**
     * Period minutes for a wall-clock `(date, HH:MM)` in this zone.
     *
     * Each wall-clock time is resolved to its own UTC instant before being
     * measured, so a transition earlier the same day is already priced in:
     * 06:00 on a spring-forward morning is 5 real hours after that day's local
     * midnight, not 6.
     */
    toPeriodMinutes(date: string, timeOfDay: string, field = 'time'): number {
        return this.periodMinuteAt(this.dayIndexOf(date), parseTimeOfDay(timeOfDay, field));
    }

    /**
     * True elapsed minutes from local midnight on the period start to local
     * midnight on `dayIndex` — 1440 per day except across a DST transition.
     */
    dayStartMinutes(dayIndex: number): number {
        return this.periodMinuteAt(dayIndex, 0);
    }

    /** Period minutes for `minutesIntoDay` wall-clock minutes past local midnight on `dayIndex`. */
    private periodMinuteAt(dayIndex: number, minutesIntoDay: number): number {
        if (minutesIntoDay === 0) {
            return Math.round((this.utcMidnightMs(dayIndex) - this.originMs) / 60_000);
        }
        return Math.round((this.utcInstantMs(this.dateAt(dayIndex), minutesIntoDay) - this.originMs) / 60_000);
    }

    /** The ISO date a period minute falls on. */
    dateOfMinute(minute: number): string {
        return this.dateAt(this.dayIndexOfMinute(minute));
    }

    /** ISO weekday of a period minute: 1 (Mon) .. 7 (Sun). */
    weekdayOfMinute(minute: number): number {
        return isoWeekday(this.dateOfMinute(minute));
    }

    /**
     * Absolute UTC epoch milliseconds for a period minute.
     *
     * The bridge out of the engine's integer-minute world. Anything that leaves
     * the solver — a matcher assignment, an API payload, a calendar entry —
     * needs a real instant, and deriving one by adding minutes to the period
     * start would reintroduce exactly the DST error the clock exists to avoid.
     */
    toEpochMs(periodMinute: number): number {
        return this.originMs + periodMinute * 60_000;
    }

    /** Period minutes for an absolute UTC epoch instant. */
    fromEpochMs(epochMs: number): number {
        return Math.round((epochMs - this.originMs) / 60_000);
    }

    /** ISO 8601 instant for a period minute, in UTC. */
    toISOString(periodMinute: number): string {
        return new Date(this.toEpochMs(periodMinute)).toISOString();
    }

    /**
     * Minutes of `range` that fall inside a recurring wall-clock window, summed
     * across every day the range touches. Windows that wrap midnight (a night
     * band such as 22:00–06:00) are handled.
     *
     * This is the primitive behind night-work accounting and premium bands —
     * both need "how much of this shift was inside that clock window", not
     * "did it start at night".
     */
    minutesInClockRange(range: MinuteRange, clock: ClockRange): number {
        const from = parseTimeOfDay(clock.from, 'clockRange.from');
        const to = parseTimeOfDay(clock.to, 'clockRange.to');
        if (range.end <= range.start) return 0;

        let total = 0;
        const firstDay = this.dayIndexOfMinute(range.start);
        const lastDay = this.dayIndexOfMinute(range.end - 1);
        // A wrapping window spills into the following day, so start one day early.
        for (let day = firstDay - 1; day <= lastDay + 1; day++) {
            if (from < to) {
                total += overlapMinutes(range, {
                    start: this.periodMinuteAt(day, from),
                    end: this.periodMinuteAt(day, to),
                });
            } else {
                // Wraps midnight: [from, 24:00) on this day plus [00:00, to) on the next.
                const nextMidnight = this.dayStartMinutes(day + 1);
                total += overlapMinutes(range, { start: this.periodMinuteAt(day, from), end: nextMidnight });
                total += overlapMinutes(range, { start: nextMidnight, end: this.periodMinuteAt(day + 1, to) });
            }
        }
        return total;
    }

    /**
     * Day index containing a period minute. May fall outside `[0, days)` —
     * history from the previous period lives at negative indices.
     *
     * `dayStartMinutes` is monotonic and never drifts from the nominal
     * 1440-per-day grid by more than a DST offset, so the floor estimate is
     * correct or off by one; the two guards settle it.
     */
    dayIndexOfMinute(minute: number): number {
        let day = Math.floor(minute / MINUTES_PER_DAY);
        while (this.dayStartMinutes(day) > minute) day--;
        while (this.dayStartMinutes(day + 1) <= minute) day++;
        return day;
    }

    /** UTC epoch ms of local midnight on the given day index, memoized. */
    private utcMidnightMs(dayIndex: number): number {
        const cached = this.midnightByDay.get(dayIndex);
        if (cached !== undefined) return cached;
        const ms = this.utcInstantMs(this.dateAt(dayIndex), 0);
        this.midnightByDay.set(dayIndex, ms);
        return ms;
    }

    /**
     * UTC epoch ms for a local wall-clock time in this zone.
     *
     * The zone offset depends on the instant we are solving for, so this is a
     * fixed-point: guess with the offset at the nominal instant, then re-check
     * with the offset at the guess. One refinement settles every real-world
     * transition; where a wall-clock time does not exist (the skipped hour on a
     * spring-forward night) the two probes disagree and the second wins,
     * yielding the instant the clock jumps to.
     */
    private utcInstantMs(date: string, minutesIntoDay: number): number {
        const nominal = Date.parse(`${date}T00:00:00Z`) + minutesIntoDay * 60_000;
        const guess = nominal - this.offsetAtMs(nominal) * 60_000;
        return nominal - this.offsetAtMs(guess) * 60_000;
    }

    /** Offset in minutes east of UTC at a given instant. */
    private offsetAtMs(instantMs: number): number {
        const parts = this.formatter.formatToParts(new Date(instantMs));
        const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0');
        const localAsUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
        return Math.round((localAsUtc - instantMs) / 60_000);
    }
}

/** Overlap of two half-open minute ranges, in minutes (0 when disjoint). */
export function overlapMinutes(a: MinuteRange, b: MinuteRange): number {
    return Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));
}

/** Whether two half-open minute ranges intersect. */
export function overlaps(a: MinuteRange, b: MinuteRange): boolean {
    return a.start < b.end && b.start < a.end;
}

/** Gap between two non-overlapping ranges in minutes; 0 when they overlap. */
export function gapBetween(a: MinuteRange, b: MinuteRange): number {
    if (a.end <= b.start) return b.start - a.end;
    if (b.end <= a.start) return a.start - b.end;
    return 0;
}

/** Days between two ISO dates (`to - from`); negative when `to` precedes `from`. */
export function daysBetween(from: string, to: string): number {
    return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** ISO date `days` after `date`. */
export function addDays(date: string, days: number): string {
    return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

/** ISO weekday 1 (Mon) .. 7 (Sun). */
export function isoWeekday(date: string): number {
    const d = new Date(`${date}T00:00:00Z`).getUTCDay();
    return d === 0 ? 7 : d;
}

/** Minutes since local midnight for an `HH:MM` / `HH:MM:SS` string. */
export function parseTimeOfDay(value: string, field: string): number {
    const m = TIME_OF_DAY.exec(value);
    if (!m) throw new ScheduleValidationError(`Invalid time-of-day for ${field}: "${value}" (expected HH:MM)`);
    const h = Number(m[1]);
    const min = Number(m[2]);
    const s = m[3] === undefined ? 0 : Number(m[3]);
    if (h > 24 || min > 59 || s > 59 || (h === 24 && (min > 0 || s > 0))) {
        throw new ScheduleValidationError(`Invalid time-of-day for ${field}: "${value}"`);
    }
    return h * 60 + min + Math.round(s / 60);
}

/** Throws `ScheduleValidationError` unless `value` is a real `YYYY-MM-DD` date. */
export function assertIsoDate(value: string, field: string): void {
    if (!ISO_DATE.test(value) || Number.isNaN(Date.parse(`${value}T00:00:00Z`))) {
        throw new ScheduleValidationError(`Invalid ISO date for ${field}: "${value}" (expected YYYY-MM-DD)`);
    }
}
