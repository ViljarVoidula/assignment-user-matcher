/**
 * Wall-clock reading of UTC hours for forecasting, through the scheduling
 * module's `PeriodClock` — the one place the engine turns instants into local
 * dates and times, so a DST week is read the same way here as in a roster.
 *
 * Hour-of-week (`how`) is `(isoWeekday − 1) × 24 + localHour`: 0 = Monday
 * 00:00–01:00 local. On a fall-back night two UTC hours read as the same local
 * hour; on a spring-forward night one local hour never happens. Both are
 * honest readings of the wall clock people work to.
 */
import { PeriodClock } from '../scheduling/time';
import { DAY_MS, dateOf, dayOf, weekdayOf } from './days';

export { DAY_MS };
export const HOUR_MS = 3_600_000;

export interface LocalSlot {
    /** Local date, `YYYY-MM-DD`. */
    date: string;
    /** Local date as a day number (days since 1970-01-01). */
    day: number;
    /** Local hour of the day, 0–23. */
    hour: number;
    /** ISO weekday of the local date, 1 (Mon) – 7 (Sun). */
    weekday: number;
    /** Hour of the week, 0–167. */
    how: number;
}

/**
 * Local slots for UTC hours, memoised. Construct one per run over the whole
 * span it will be asked about and share it across every series of a
 * workspace: they are all read in the same zone.
 */
export class ForecastCalendar {
    readonly timeZone: string;
    private readonly clock: PeriodClock;
    private readonly originDay: number;
    private readonly slots = new Map<number, LocalSlot>();
    private readonly dayStarts = new Map<number, number>();

    constructor(timeZone: string, fromMs: number, toMs: number) {
        this.timeZone = timeZone;
        // A day either side: a local date can sit a day off the UTC one.
        this.originDay = Math.floor(fromMs / DAY_MS) - 1;
        const days = Math.max(1, Math.ceil((toMs - fromMs) / DAY_MS) + 3);
        this.clock = new PeriodClock(dateOf(this.originDay), days, timeZone);
    }

    slot(atMs: number): LocalSlot {
        const cached = this.slots.get(atMs);
        if (cached) return cached;
        const minute = this.clock.fromEpochMs(atMs);
        const index = this.clock.dayIndexOfMinute(minute);
        const day = this.originDay + index;
        const hour = this.hourOf(index, minute);
        const weekday = weekdayOf(day);
        const slot = { date: dateOf(day), day, hour, weekday, how: (weekday - 1) * 24 + hour };
        this.slots.set(atMs, slot);
        return slot;
    }

    /** Epoch ms of local midnight on a date. */
    midnight(date: string): number {
        return this.clock.toEpochMs(this.dayStart(dayOf(date) - this.originDay));
    }

    private dayStart(index: number): number {
        let start = this.dayStarts.get(index);
        if (start === undefined) {
            start = this.clock.dayStartMinutes(index);
            this.dayStarts.set(index, start);
        }
        return start;
    }

    /**
     * Local hour of a period minute. On an ordinary 24-hour day it is plain
     * arithmetic; only a transition day asks the clock what the wall shows.
     */
    private hourOf(index: number, minute: number): number {
        const start = this.dayStart(index);
        if (this.dayStart(index + 1) - start === 1440) return Math.floor((minute - start) / 60);
        return Math.floor(this.clock.localTimeOf(this.clock.toEpochMs(minute)).minuteOfDay / 60);
    }
}
