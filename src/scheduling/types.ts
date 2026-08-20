/**
 * Shift-scheduling types — the public contract of the `scheduling` module.
 *
 * Everything in this module is pure logic: no Redis, no I/O, no timers owned
 * by the scheduler itself beyond a cooperative wall-clock budget. The caller
 * provides a `ScheduleInput`, receives a `ScheduleResult`, and persists or
 * ships it however they like.
 */

import type { PeriodClock } from './time';
import type { TimelineEntry, TimelineIndex } from './engine/timeline';

/**
 * A single employee that can be rostered. Durations are minutes unless the
 * field name says otherwise — the `*HoursForPeriod` bounds are in hours, every
 * `*Minutes` field is in minutes.
 */
export interface Employee {
    id: string;
    tags: string[];
    /** ISO dates (YYYY-MM-DD) or explicit shift instances the employee must not work. */
    timeOff: TimeOffEntry[];
    /** Hard upper bound of worked **hours** over the whole period. */
    maxHoursForPeriod?: number;
    /** Soft lower bound of worked **hours** over the whole period (warn, don't block). */
    minHoursForPeriod?: number;
    /** Hard upper bound of a single shift's duration for this employee. */
    maxShiftDurationMinutes?: number;

    /**
     * The natural person behind this record. Defaults to `id`.
     *
     * Set it when one human holds several contracts or roles: CJEU C-585/19
     * holds that daily rest applies to all contracts with the same employer
     * *taken as a whole*. Rest, rolling hour windows and sequence rules
     * aggregate on this key, so leaving it unset for a double-contracted worker
     * understates their hours and overstates their rest.
     */
    personId?: string;
    /** Qualifications with optional validity dates. Absent dates mean "always valid". */
    qualifications?: Qualification[];
    /** Recurring availability, preferences and hard blackouts. */
    availability?: AvailabilityRule[];
    /**
     * Commitments outside this employer that the roster may never override —
     * a second job, studies, agreed carer time. Directive (EU) 2019/1152 Art 9
     * forbids treating parallel employment as a schedulable gap.
     */
    externalCommitments?: Array<{ from: string; to: string }>;
    /** Contract shape; `kind: 'days'` models day-count contracts such as the French *forfait jours*. */
    contract?: EmployeeContract;
    /**
     * Per-person overrides of the global rule set. This is how age classes,
     * opt-outs, hazardous-night status and autonomous-worker derogations are
     * expressed — the rules themselves stay generic.
     */
    rules?: WorkingTimeRules;
    /** Statutory protections that select a stricter rule path for this person. */
    protections?: EmployeeProtection[];
    /** Cost inputs for the ranking and cost objective. */
    cost?: EmployeeCost;
    /**
     * Whether this person has agreed to work overtime, where
     * `OvertimeRule.requiresConsent` makes that agreement a precondition.
     * Consent is a fact the caller records, never something the engine assumes.
     */
    overtimeConsent?: boolean;
    /** Higher wins where a collective agreement orders offers by seniority. */
    seniority?: number;
    /** Realised counts carried in from previous periods, keyed by fairness dimension. */
    carriedFairness?: Record<string, number>;
}

/** A qualification, optionally valid only for part of the period. */
export interface Qualification {
    /** Matches `ShiftTemplate.tagRequirements` keys and `requiredTags`. */
    tag: string;
    /** Optional proficiency; group-composition rules can require a minimum. */
    level?: number;
    /** Inclusive ISO date the qualification becomes valid. */
    validFrom?: string;
    /** Inclusive ISO date the qualification expires. A shift after this is ineligible. */
    validUntil?: string;
}

/** A recurring availability or preference window. */
export interface AvailabilityRule {
    /** ISO weekdays 1 (Mon) .. 7 (Sun). Omit for every day. */
    daysOfWeek?: number[];
    /** Inclusive ISO date bounds. Omit for the whole period. */
    fromDate?: string;
    toDate?: string;
    /** Wall-clock window within the day. Omit for the whole day. */
    from?: string;
    to?: string;
    /**
     * `unavailable` is a hard blackout; `available` restricts to the listed
     * windows (any shift outside every `available` rule is ineligible);
     * `preferred` / `avoid` are soft and scale by `weight`.
     */
    kind: 'unavailable' | 'available' | 'preferred' | 'avoid';
    /** Soft-rule strength. Defaults to 1. */
    weight?: number;
}

/** Contract shape — hours-based or day-count. */
export interface EmployeeContract {
    kind: 'hours' | 'days';
    /** Target contractual minutes per week, used for pro-rata fairness. */
    weeklyMinutes?: number;
    /** Day-count contracts: maximum working days in the period (e.g. FR forfait jours). */
    maxDaysInPeriod?: number;
    /** Hard bounds over the period, in minutes. */
    minPeriodMinutes?: number;
    maxPeriodMinutes?: number;
    /** Last day the contract runs; shifts after it are ineligible. */
    endDate?: string;
}

/** A statutory protection that changes which rules apply to a person. */
export interface EmployeeProtection {
    /**
     * `minor` and `hazardousNight` select stricter limits; `pregnancyNightExclusion`
     * is a certificate-triggered bar on night work (Directive 92/85/EEC Art 7),
     * which mandates a day-work alternative rather than mere unavailability.
     */
    kind: 'minor' | 'hazardousNight' | 'pregnancyNightExclusion';
    /** What the employer owes instead. Recorded in the result, not solved for. */
    fallback?: 'dayShift' | 'leave';
}

/** Cost inputs. All money is in minor units (cents) to keep arithmetic integral. */
export interface EmployeeCost {
    hourlyRateCents?: number;
    /** Minutes in the period after which overtime rates apply. */
    overtimeAfterMinutes?: number;
    overtimeMultiplier?: number;
    /**
     * Fraction of the hourly rate paid for the non-working remainder of a
     * duty-classified span — stand-by hours that occupy the clock without
     * counting as work. Estonia's *valveaeg* owes at least 1/10 of the agreed
     * wage (`0.1`); unset means the remainder is unpaid.
     */
    standbyRateFraction?: number;
    /** Premium multipliers by predicate, applied to the minutes actually inside each band. */
    premiums?: Array<{ predicate: 'night' | 'sunday' | 'holiday'; multiplier: number }>;
    /**
     * How multiple applicable premiums combine. Romania requires `'add'`
     * (overtime 75% + night 25% + holiday 100% stack); most others take the max.
     * Defaults to `'max'`.
     */
    stacking?: 'add' | 'max';
}

/** Time-off as an explicit entry — date alone blocks the whole day; `shiftInstanceId` scopes it. */
export interface TimeOffEntry {
    /** ISO date, YYYY-MM-DD. */
    date: string;
    /** Optional shift-instance id (`<templateId>@<date>`); when set only that instance is blocked. */
    shiftInstanceId?: string;
}

/* ------------------------------------------------------------------------- */
/* Working-time rules                                                         */
/* ------------------------------------------------------------------------- */

/**
 * The labour-law layer, as plain typed configuration.
 *
 * Every field is optional and every value is caller-supplied: the library ships
 * the *shapes* that EU working-time law takes, never a jurisdiction's numbers.
 * That split matters twice over — legal values differ per member state, per
 * sector and per collective agreement and change without notice; and for the
 * sectoral regimes that *replace* the Working Time Directive rather than relax
 * it (Art 14/20/21 — mobile workers, seafarers), the correct encoding is to
 * omit the displaced rule entirely rather than to widen its bounds.
 *
 * `Employee.rules` overrides this per person, which is how age classes,
 * individual opt-outs and hazardous-work status are expressed.
 */
export interface WorkingTimeRules {
    dailyRest?: DailyRestRule;
    weeklyRest?: WeeklyRestRule;
    workingTime?: WorkingTimeLimits;
    /** The ordinary-vs-overtime split and its caps. */
    overtime?: OvertimeRule;
    /** Rolling volume caps on particular duty types, matched on `shiftTypeTag`. */
    dutyQuotas?: DutyQuota[];
    consecutive?: ConsecutiveRule;
    /**
     * Minimum minutes between the *starts* of two assignments. Poland's
     * *doba pracownicza* makes restarting inside 24h of the previous start
     * overtime regardless of how much rest was taken, so it is keyed on starts,
     * not gaps — a distinct shape from `dailyRest`.
     */
    minimumStartInterval?: { minMinutes: number };
    nightWork?: NightWorkRule;
    breaks?: BreakRule[];
    restDays?: RestDayRule;
    engagement?: EngagementRule;
    notice?: NoticeRule;
    /** Fairness dimensions to equalise. Soft by nature. */
    fairness?: FairnessRule[];
    /** How to aggregate a person's assignments across records. */
    aggregation?: { acrossContracts?: boolean };
}

/** Daily rest — Directive 2003/88/EC Art 3 and its national variants. */
export interface DailyRestRule {
    /** e.g. 660 (EU floor), 720 (ES, RO), 540 (FI period work). */
    minMinutes: number;
    /** Window the rest must fit in. Defaults to 1440 — "in every rolling 24h". */
    perWindowMinutes?: number;
    /** Floor a permitted derogation may reduce rest to (NL/DK/CZ 480, FR 540). */
    reducibleToMinutes?: number;
    /** How often the reduction may be used, e.g. NL's "once per 7×24h". */
    reductionsPer?: { max: number; windowDays: number };
    /**
     * Deadline for the compensatory rest a derogation creates. Jaeger (C-151/02)
     * requires it "immediately following" the period worked; national rules give
     * a window instead (DE 28 days, AT 10).
     */
    compensateWithinDays?: number;
    /**
     * A clock band the rest must contain. Sweden requires the 11h to include
     * 00:00–05:00 — a *positional* rule, not a duration one.
     */
    mustContainClockRange?: ClockRangeConfig;
}

/** Weekly rest — Art 5, with the Art 16(a) averaging option. */
export interface WeeklyRestRule {
    /** Continuous rest required per window: 2100 (35h), 2160 (36h), 2880 (48h). */
    minMinutes: number;
    /** Length of the window in days. Normally 7. */
    windowDays: number;
    /**
     * A lower per-window floor that always holds when `minMinutes` is only met
     * on average. Estonia requires 36h every week *and* 48h on average.
     */
    absoluteFloorMinutes?: number;
    /** Averaging window in days; Art 16(a) caps this at 14. */
    averageOverDays?: number;
}

/** Volume limits, including the rolling reference periods that define EU working time. */
export interface WorkingTimeLimits {
    maxPerShiftMinutes?: number;
    /** Ordinary daily cap, e.g. Germany's 8h. */
    maxPerDayMinutes?: number;
    /** Extended daily cap permitted when the average over `dayAverageWindowDays` holds. */
    maxPerDayExtendedMinutes?: number;
    dayAverageWindowDays?: number;
    /** Cap no single week may exceed regardless of averaging. */
    maxPerWeekAbsoluteMinutes?: number;
    /**
     * Rolling averages, each "at most `maxMinutes` of working time in any
     * window of `windowDays` days". The EU 48h/4-month rule is
     * `{ maxMinutes: 2880, windowDays: 120 }`; the Netherlands stacks
     * `{3300, 28}` with `{2880, 112}`; Spain averages over a year.
     */
    rollingAverages?: RollingAverage[];
    /** Hard cap over the whole period, in minutes. */
    maxPerPeriodMinutes?: number;
    /**
     * Absence kinds excluded from rolling averages. Art 16(b) requires paid
     * annual leave and sick leave to be neutral in the 48h calculation, so
     * counting them would wrongly depress a worker's average.
     */
    neutraliseAbsenceKinds?: string[];
}

/** One rolling-average limit. */
export interface RollingAverage {
    maxMinutes: number;
    windowDays: number;
    /** Optional label used in violation messages, e.g. "48h/4 months". */
    label?: string;
}

/**
 * The ordinary-vs-overtime split.
 *
 * `WorkingTimeLimits` caps *total* working time; several member states also
 * regulate the overtime portion by itself — Estonia makes overtime conditional
 * on agreement and compensates it primarily in time off, Germany's ArbZG builds
 * the 10h day out of 8 ordinary + 2 averaged, Austria caps overtime separately
 * from normal hours. That needs a defined ordinary baseline, which is what the
 * `ordinary*` fields (or a person's `contract.weeklyMinutes`) supply; everything
 * worked beyond the baseline in a window is that window's overtime.
 */
export interface OvertimeRule {
    /** Working minutes per rolling 24h beyond which time is overtime. */
    ordinaryPerDayMinutes?: number;
    /**
     * Working minutes per rolling 7 days beyond which time is overtime.
     * A person's `contract.weeklyMinutes` overrides this — a part-timer's
     * overtime starts at their agreed hours, not at full time.
     */
    ordinaryPerWeekMinutes?: number;
    /** Cap on overtime minutes in any rolling 24h. Requires `ordinaryPerDayMinutes`. */
    maxOvertimePerDayMinutes?: number;
    /**
     * Caps on overtime minutes over rolling windows, each measured against the
     * weekly ordinary baseline pro-rated to the window. Requires a weekly
     * baseline (`ordinaryPerWeekMinutes` or per-person contract minutes).
     */
    maxOvertimeInWindow?: Array<{ maxMinutes: number; windowDays: number; label?: string }>;
    /**
     * Overtime needs the employee's agreement (`Employee.overtimeConsent`).
     * Without recorded consent, any overtime at all is a hard breach.
     */
    requiresConsent?: boolean;
    /**
     * How overtime is compensated. `'timeOff'` accrues a `timeOffInLieu` ledger
     * entry per employee; `'pay'` leaves compensation to the cost model.
     */
    compensation?: 'timeOff' | 'pay';
    /** Legal source echoed into verdicts and violations. */
    citation?: string;
}

/**
 * A rolling volume cap on one duty type — "at most N hours (or N occurrences)
 * of stand-by in any 28 days". Matched on `ShiftTemplate.shiftTypeTag`.
 *
 * `maxMinutes` counts *elapsed* duty minutes, not working minutes: a cap on
 * stand-by limits how long the duty may occupy the person's clock, which is
 * precisely the time a duty classification keeps out of the working-time
 * budget. Working-time volume belongs to `workingTime`, not here.
 */
export interface DutyQuota {
    /** Which duties count: exact match on the instance's `shiftTypeTag`. */
    shiftTypeTag: string;
    /** Cap on elapsed minutes of matching duties in any window. */
    maxMinutes?: number;
    /** Cap on the number of matching duties in any window. */
    maxCount?: number;
    windowDays: number;
    label?: string;
    citation?: string;
}

/** Sequence rules over one person's ordered assignments. */
export interface ConsecutiveRule {
    /** e.g. Portugal's 6. */
    maxWorkingDays?: number;
    /** e.g. Finland 5, Netherlands 7. */
    maxNightShifts?: number;
    /** Rest owed once the night run ends: NL 2760 (46h), FI 1440 (24h). */
    restAfterNightBlockMinutes?: number;
    /**
     * Disallowed shift-type transitions, matched on `ShiftTemplate.shiftTypeTag`.
     * The classic is Night → Early ("quick return").
     */
    forbiddenSuccessions?: Array<{ fromTag: string; toTag: string; minGapMinutes?: number }>;
}

/** Night work — Art 2(3), 2(4), 8 and their national variants. */
export interface NightWorkRule {
    /**
     * The night band. Art 2(3) requires at least 7 hours including 00:00–05:00,
     * but the exact window is national: 20:00–06:00 (BE) through 00:00–07:00 (IE),
     * and Poland lets the employer choose any 8h band within 21:00–07:00.
     */
    window: ClockRangeConfig;
    /** Night minutes in a shift that make it a night shift. Art 2(4)(a) uses 180. */
    qualifiesAfterMinutes?: number;
    /** Cap on a night worker's shift, normally 480. */
    maxShiftMinutes?: number;
    /** Days over which the 8h night limit is averaged. Art 8(a) sets no EU ceiling. */
    averageWindowDays?: number;
    /**
     * Art 8(b): for work involving special hazards or heavy strain the 8h is an
     * absolute per-24h cap with no averaging. Set by `Employee.protections`
     * carrying `hazardousNight`, or globally here.
     */
    absoluteWhenHazardous?: boolean;
    /** Caps on how many night shifts may fall in a window, optionally filtered by end time. */
    volumeQuotas?: NightVolumeQuota[];
    /** Clock bands where work is barred outright (94/33/EC bars adolescents 00:00–04:00). */
    prohibitedRanges?: ClockRangeConfig[];
}

/** A cap on night-shift count over a rolling window. */
export interface NightVolumeQuota {
    max: number;
    windowDays: number;
    /** Only count shifts ending after this wall-clock time (NL counts those past 02:00). */
    endingAfter?: string;
    label?: string;
}

/**
 * In-shift break entitlement. Art 4 fixes the >6h trigger but leaves the
 * duration to member states — 10 min (IT floor) to 60–120 min (PT).
 */
export interface BreakRule {
    /** Working minutes after which the break is owed. */
    afterMinutes: number;
    minMinutes: number;
    /**
     * The entitlement is to a *paid* break, so only `ShiftTemplate.paidBreakMinutes`
     * discharges it — an unpaid break costs the worker wages and does not.
     * Unset, any declared break (paid or unpaid) counts.
     */
    paid?: boolean;
    /**
     * A break the worker must stay reachable through. C-107/19 holds such a
     * break is working time *and* does not discharge the Art 4 entitlement, so
     * an interruptible break never satisfies this rule.
     */
    interruptible?: boolean;
}

/** Rest days, Sunday and public-holiday rules. */
export interface RestDayRule {
    /** e.g. Germany's 15, the Netherlands' 13. */
    minFreeSundaysPerYear?: number;
    /** Rolling form, e.g. Poland's one free Sunday per 4 weeks. */
    minFreeSundaysPer?: { count: number; weeks: number };
    /** Deadline for the substitute rest day Sunday or holiday work creates. */
    compensatoryRestWithinDays?: { sunday?: number; holiday?: number };
    /** Bar Sunday or holiday work outright. */
    sundayAllowed?: boolean;
    holidayAllowed?: boolean;
}

/**
 * Minimum engagement. Belgium requires 3h per work session; the Netherlands
 * pays a minimum of 3h per call and credits 30 min per call-out; Ireland owes
 * the lesser of 25% of contracted hours or 15h. These decouple *paid* from
 * *worked*, so they constrain shift design rather than assignment.
 */
export interface EngagementRule {
    minShiftMinutes?: number;
    minPaidMinutesPerEngagement?: number;
}

/**
 * Publication and change notice — Directive (EU) 2019/1152 Art 10.
 *
 * Work outside the reference hours, or notified inside the notice window, may
 * be refused without detriment; cancelling late can create a pay liability.
 * These are facts about a *published* roster, so they need `published` on the
 * input to mean anything.
 */
export interface NoticeRule {
    /** The reference hours and days within which work may be required at all. */
    referenceHours?: Array<{ daysOfWeek: number[]; from: string; to: string }>;
    /** "Reasonable" notice of an assignment. No EU number exists; member states differ. */
    minNoticeMinutes?: number;
    /** After this deadline, cancelling owes compensation. */
    cancellationDeadlineMinutes?: number;
    /** Minutes payable when an assignment is cancelled late (NL pays the called hours). */
    cancellationCompensationMinutes?: number;
    /** Whether a published roster may be changed at all. Finland requires consent or cause. */
    changeAfterPublication?: 'consent' | 'cause' | 'free';
}

/** A dimension to equalise across the team. */
export interface FairnessRule {
    dimension: 'minutes' | 'shifts' | 'nights' | 'weekends' | 'holidays' | 'tag';
    /**
     * Required when `dimension` is `'tag'`: shifts whose `shiftTypeTag` equals
     * this are the load being equalised (e.g. spread the `'oncall'` shifts).
     */
    tag?: string;
    weight?: number;
    /**
     * Hard cap on the spread between the most- and least-loaded person on this
     * dimension. Leave unset to keep fairness purely soft.
     */
    hardMaxSpread?: number;
    /** Weight each person's fair share by contracted hours rather than headcount. */
    proRataByContract?: boolean;
}

/** A wall-clock band; `to <= from` wraps past midnight. */
export interface ClockRangeConfig {
    from: string;
    to: string;
}

/** A recurring or dated shift definition. Times are local time-of-day `HH:MM` or `HH:MM:SS`. */
export interface ShiftTemplate {
    id: string;
    name: string;
    /** Time of day the shift starts. */
    startTime: string;
    /** Time of day the shift ends; `endTime <= startTime` means it runs into the next day. */
    endTime: string;
    /** Inclusive ISO dates this template occurs on. Mutually exclusive with `daysOfWeek`. */
    dates?: string[];
    /** ISO weekdays 1 (Mon) .. 7 (Sun) within the scheduling period. Mutually exclusive with `dates`. */
    daysOfWeek?: number[];
    /** Minimum employees that must be assigned to each occurrence. Defaults to 1. */
    minEmployees?: number;
    /** Per-tag minimums: at least `count` assigned employees must carry the tag. */
    tagRequirements?: Record<string, number>;

    /** Cap on assignees. Useful for supervision limits and to stop over-staffing. */
    maxEmployees?: number;
    /** Per-tag maximums, e.g. at most 2 trainees on a shift. */
    tagMaximums?: Record<string, number>;
    /** Tags every assignee must hold, checked against date-valid qualifications. */
    requiredTags?: string[];
    /**
     * Classification tag for sequence rules — `'night'`, `'early'`, `'late'`.
     * `ConsecutiveRule.forbiddenSuccessions` matches on this.
     */
    shiftTypeTag?: string;
    /**
     * Unpaid break minutes inside the span. Working time is the span minus this,
     * which is why a 9h shift with a 45-minute unpaid break is 8h15 against an
     * hours budget — not 9h.
     */
    unpaidBreakMinutes?: number;
    /**
     * Paid break minutes inside the span. They count as working time (no
     * deduction), and they are what discharges a `BreakRule` with `paid: true`.
     */
    paidBreakMinutes?: number;
    /**
     * How this duty counts as working time.
     *
     * The engine never infers this. Whether stand-by counts is a fact-specific
     * legal test — on-premises stand-by counts in full even while asleep
     * (SIMAP, Jaeger), while off-premises stand-by turns on response time and
     * call-out frequency under an all-circumstances test the CJEU has
     * deliberately declined to reduce to a threshold (Matzak, C-344/19,
     * C-580/19). The caller classifies; the engine does the arithmetic.
     */
    duty?: DutyClassification;
    /** Site this shift is at, for multi-site rosters. */
    siteId?: string;
}

/** How a duty's elapsed time converts into working time. */
export interface DutyClassification {
    /**
     * `'full'` counts the whole span (a normal shift, or on-premises stand-by).
     * `'actualOnly'` counts only `expectedActiveMinutes`.
     * A number between 0 and 1 counts that fraction — the usual encoding for
     * stand-by that accrues at a percentage.
     */
    countsAsWorkingTime: 'full' | 'actualOnly' | number;
    /** Expected active minutes when `countsAsWorkingTime` is `'actualOnly'`. */
    expectedActiveMinutes?: number;
    /** Whether the duty still blocks the rest clock even if it barely counts as work. */
    countsTowardRestClock?: boolean;
    standby?: {
        atWorkplace: boolean;
        responseMinutes?: number;
        avgCalloutsPerPeriod?: number;
    };
    /**
     * Why it was classified this way. Echoed into the result's provenance so a
     * roster can be defended without re-litigating the classification.
     */
    classificationNote?: string;
}

/** Tunables for built-in constraints plus caller-supplied customs. */
export interface ConstraintOptions {
    /**
     * Minimum rest minutes between the end of one assignment and the start of
     * the next. Defaults to 660 (11h), the Directive 2003/88/EC Art 3 floor.
     */
    minRestMinutes?: number;
    /**
     * Enforce at most one shift per calendar day. Defaults to `false` — split
     * shifts are lawful, and `no-overlap` + `min-rest` already exclude the
     * impossible cases.
     */
    oneShiftPerDay?: boolean;
    /** Override built-in hardness/weight by constraint id. */
    overrides?: Record<string, { hardness?: 'hard' | 'soft'; weight?: number }>;
    /** Additional caller-supplied constraints, evaluated alongside the built-ins. */
    custom?: SchedulingConstraint[];
}

/** The full scheduling problem. */
export interface ScheduleInput {
    /** Inclusive ISO date range, plus the zone its wall-clock times are read in. */
    period: { startDate: string; endDate: string; timeZone?: string };
    employees: Employee[];
    shifts: ShiftTemplate[];
    objective?: 'standard' | 'balanced';
    /** Weights of optional soft-objective terms. Omitted terms stay out of the solve. */
    objectives?: ObjectiveWeights;
    constraints?: ConstraintOptions;
    /** Seed for reproducible runs. */
    seed?: number;
    /** Wall-clock budget for the improvement loop. Default 10_000. */
    timeBudgetMs?: number;

    /** The labour-law layer. Omit for a plain feasibility solve. */
    rules?: WorkingTimeRules;
    /** Public holidays and closures, as ISO dates. */
    calendar?: { publicHolidays?: string[]; closedDates?: string[] };
    /**
     * Assignments from before the period, used to seed rest and rolling
     * windows. Without them the first days of every period are non-compliant by
     * construction, because an 11h rest rule cannot see the shift that ended at
     * 06:00 on day one.
     */
    history?: HistoricalAssignment[];
    /** A published roster, which anchors the notice clock and the perturbation objective. */
    published?: { roster: ScheduledAssignment[]; publishedAt?: string };
    /**
     * The instant this solve or compliance run represents, as an ISO date or
     * date-time. It anchors deadline arithmetic that needs a "now" — notably
     * whether cancelling a published assignment fell inside
     * `notice.cancellationDeadlineMinutes` of the shift's start. Omitted, every
     * cancellation is treated as late (the conservative reading). Caller-supplied
     * so runs stay deterministic and replayable.
     */
    asOf?: string;
    /** Pairs the solver may not move. */
    pinned?: AssignmentPair[];
    /** Absences that block assignment and may be neutral in rolling averages. */
    absences?: Array<{ employeeId: string; from: string; to: string; kind?: string }>;
    /** Called with the best roster so far as the search improves it. */
    onProgress?: (best: ScheduleResult) => void;
}

/** An assignment from before the period start, treated as immutable context. */
export interface HistoricalAssignment {
    employeeId: string;
    /** ISO date the duty started on; may precede `period.startDate`. */
    date: string;
    startTime: string;
    endTime: string;
    /** Working minutes, if they differ from the elapsed span. */
    workingMinutes?: number;
    shiftTypeTag?: string;
    id?: string;
}

/** One rostered (employee, shift occurrence) pair. */
export interface ScheduledAssignment {
    shiftInstanceId: string;
    employeeId: string;
    /** ISO date of the shift occurrence (its start day). */
    date: string;
    /** Human-readable reasons produced by the constraint layer. */
    reasons: string[];
}

/**
 * Lexicographic severity levels.
 *
 * They are compared in order, not summed: no quantity of `soft` improvement can
 * buy a single `hard` breach. A weighted sum would let a large enough cost
 * saving purchase a rest violation, which is not a trade the law permits.
 *
 * `hard` = legally or physically impossible. `medium` = coverage shortfalls.
 * `soft` = cost, fairness, preferences.
 */
export type Severity = 'hard' | 'medium' | 'soft';

/** A constraint breach that survived into the returned schedule. */
export interface ConstraintViolation {
    constraintId: string;
    severity: Severity;
    message: string;
    shiftInstanceId?: string;
    employeeId?: string;
    /** Legal source, echoed from the rule that produced it. */
    citation?: string;
    /** The measured value and the bound it broke, for machine-readable reports. */
    actual?: number;
    required?: number;
    unit?: string;
}

/**
 * A single rule's structured judgement on one candidate assignment.
 *
 * The same type answers "why can't Anna work this shift?", validates a proposed
 * swap, and populates the violation report — so the score and the explanation
 * can never drift apart, which they do as soon as they have separate code paths.
 */
export interface RuleVerdict {
    ruleId: string;
    pass: boolean;
    severity: Severity;
    /** Measured value, e.g. rest actually available. */
    actual?: number;
    /** Bound it was measured against. */
    required?: number;
    unit?: 'minutes' | 'hours' | 'count' | 'days';
    message: string;
    citation?: string;
}

/** The outcome of a solve. `'optimal'` means "no known improvement", never a proof. */
export interface ScheduleResult {
    status: 'optimal' | 'feasible' | 'partial';
    assignments: ScheduledAssignment[];
    violations: ConstraintViolation[];
    stats: { evaluatedVariants: number; durationMs: number; unfilledSlots: number };
    /**
     * What produced this roster. Reproducibility is an audit requirement:
     * "the roster was lawful under the rules as they stood" is the defence, and
     * it needs the rules and weights to be identifiable after the fact. In
     * Germany the objective weights are themselves co-determination subject
     * matter (BetrVG §87(1)), not internal tuning.
     */
    provenance?: ScheduleProvenance;
    /** Deferred obligations the roster created, such as compensatory rest owed. */
    ledger?: LedgerEntry[];
    /** Per-person cost breakdown when a cost model was supplied. */
    cost?: { totalCents: number; byEmployee: Record<string, number> };
}

/** Identifying stamp for a solve. */
export interface ScheduleProvenance {
    engineVersion: string;
    seed: number;
    rulesHash: string;
    /** Duty classifications the caller supplied, recorded verbatim. */
    dutyClassificationNotes?: Record<string, string>;
    /**
     * True when no behavioural or predictive per-worker signal fed the
     * allocation. Allocating on declared qualifications, availability, legal
     * limits, cost and realised counts is a constraint solve; adding
     * reliability or no-show prediction makes it profiling, which is
     * unconditionally high-risk under AI Act Annex III point 4(b).
     */
    profilingFree: boolean;
}

/**
 * Weights of optional soft-objective terms.
 *
 * These are co-determination subject matter in some member states (BetrVG
 * §87(1)), so they live on the input — versioned and hashed with the rules —
 * rather than being internal tuning.
 */
export interface ObjectiveWeights {
    /**
     * Soft-score points per euro of projected labour cost. Any positive value
     * makes the solver prefer cheaper rosters *within* the soft level — it can
     * never buy a hard or coverage breach, because levels are lexicographic.
     * Unset or 0 leaves cost out of the solve; ranking and the result's cost
     * summary still use the cost model either way.
     */
    costWeightPerEuro?: number;
}

/** A dated obligation created by an assignment. */
export interface LedgerEntry {
    kind: 'compensatoryRest' | 'substituteRestDay' | 'lateCancellationPay' | 'timeOffInLieu';
    employeeId: string;
    minutes?: number;
    /** ISO date by which the obligation must be discharged. */
    dueBy?: string;
    reason: string;
    citation?: string;
}

/** Thrown synchronously by the facade for malformed input (bad dates, negative budgets, …). */
export class ScheduleValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ScheduleValidationError';
    }
}

/* ------------------------------------------------------------------------- */
/* Constraint SPI                                                             */
/* ------------------------------------------------------------------------- */

/** One expanded, dated occurrence of a shift template. */
export interface ShiftInstance {
    /** Unique id: `<templateId>@<date>`. */
    id: string;
    templateId: string;
    name: string;
    /** ISO date the shift starts on. */
    date: string;
    /** Minutes since period epoch (midnight of `period.startDate`) when the shift starts. */
    startMinute: number;
    /** Minutes since period epoch when the shift ends; may exceed 24h for overnight shifts. */
    endMinute: number;
    /** Elapsed duration in minutes, always positive. */
    durationMinutes: number;
    minEmployees: number;
    tagRequirements: Record<string, number>;

    /**
     * Minutes that count as working time — the span less unpaid breaks, scaled
     * by the duty classification. Hour budgets and rolling averages use this;
     * rest gaps use `startMinute`/`endMinute`, because a duty can occupy the
     * clock without counting as work.
     */
    workingMinutes: number;
    /** Paid break minutes declared by the template. Count as working time. */
    paidBreakMinutes: number;
    /**
     * Unpaid break minutes declared by the template. Break entitlements read
     * this rather than span − working: for a duty-scaled shift the difference
     * is duty occupation, not rest.
     */
    unpaidBreakMinutes: number;
    maxEmployees?: number;
    tagMaximums: Record<string, number>;
    requiredTags: string[];
    shiftTypeTag?: string;
    siteId?: string;
    duty?: DutyClassification;
    /** Minutes of this occurrence falling inside the configured night band. */
    nightMinutes: number;
    /** Whether it counts as a night shift under `NightWorkRule.qualifiesAfterMinutes`. */
    isNightShift: boolean;
    /** ISO weekday 1..7 of the start day. */
    weekday: number;
    isSunday: boolean;
    isPublicHoliday: boolean;
}

/** The normalized, fully-indexed problem the engine and constraints operate on. */
export interface ModelContext {
    periodStartDate: string;
    periodDays: number;
    employees: Employee[];
    employeeById: Map<string, Employee>;
    employeeTags: Map<string, Set<string>>;
    instances: ShiftInstance[];
    instanceById: Map<string, ShiftInstance>;
    /** Minutes in [0, periodDays*1440) the employee is blocked by time-off. */
    employeeBlockedIntervals: Map<string, Array<{ start: number; end: number }>>;
    minRestMinutes: number;
    /** Constraint registry snapshot, resolved with caller overrides. */
    constraints: SchedulingConstraint[];

    /** DST-correct wall-clock resolver for the roster's zone. */
    clock: PeriodClock;
    /** Rules after merging the global set with each person's overrides. */
    rules: WorkingTimeRules;
    rulesByEmployee: Map<string, WorkingTimeRules>;
    /** Employee id → the natural person it belongs to (CJEU C-585/19). */
    personIdOf: Map<string, string>;
    /** Person id → the employee records that share it. */
    employeesOfPerson: Map<string, string[]>;
    /** Pre-period assignments, keyed by person, at negative period minutes. */
    history: Map<string, TimelineEntry[]>;
    publicHolidays: Set<string>;
    /** Absence spans per employee, with the kind that drives averaging neutrality. */
    absences: Map<string, Array<{ start: number; end: number; kind?: string }>>;
    pinned: Set<string>;
    /** Period minutes the roster was published, when a published roster was supplied. */
    publishedAtMinute?: number;
    publishedPairs: Set<string>;
    /** Period minutes of `ScheduleInput.asOf`, when supplied. */
    asOfMinute?: number;
}

/** A candidate (employee, shiftInstance) pair under evaluation. */
export interface AssignmentPair {
    employeeId: string;
    shiftInstanceId: string;
}

/**
 * Mutable search state shared with constraints for delta/explain evaluation.
 * The engine keeps these structures consistent on every assign/unassign.
 */
export interface SearchState {
    ctx: ModelContext;
    /** instanceId -> set of assigned employee ids. */
    assignments: Map<string, Set<string>>;
    /** employeeId -> assigned instance ids. */
    byEmployee: Map<string, Set<string>>;
    /** employeeId -> total assigned minutes in the period. */
    minutesByEmployee: Map<string, number>;
    /** Whether `(employeeId, instanceId)` is currently assigned. */
    isAssigned(employeeId: string, instanceId: string): boolean;
    /**
     * Per-person timelines, history included, kept in step with every
     * assign/unassign. Window rules read them instead of rebuilding a person's
     * schedule from `byEmployee` on each evaluation.
     */
    timelines: TimelineIndex;
}

/**
 * A self-contained scheduling rule. Built-ins ship in `constraints/`; callers
 * may register customs via `ConstraintOptions.custom`. A constraint must be
 * pure with respect to the passed-in state — the engine owns all mutation.
 */
export interface SchedulingConstraint {
    id: string;
    /**
     * Lexicographic level. `'hard'` breaches are never accepted by construction;
     * `'medium'` and `'soft'` are traded off within their own level by `weight`.
     */
    hardness: Severity;
    /** Drives soft/medium score contribution, violation severity and repair priority. */
    weight?: number;
    /** Legal source, echoed into every violation and verdict this rule produces. */
    citation?: string;
    /** Prune ineligible (employee, shiftInstance) pairs before search, in place on `eligibility`. */
    prune?(ctx: ModelContext, eligibility: Map<string, Set<string>>): void;
    /**
     * Breach magnitude of assigning `pair` in `state`: 0 when compliant,
     * positive otherwise.
     *
     * Return *how far* over the line the assignment is, not a 0/1 flag, where
     * that is meaningful — a rest gap 10 minutes short and one 6 hours short are
     * both breaches, but only a graded signal lets local search climb out of an
     * infeasible region instead of sitting on a plateau.
     */
    delta(state: SearchState, pair: AssignmentPair): number;
    /**
     * Breach magnitude *removed* by unassigning `pair`. Defaults to `delta` when
     * absent, which is right for symmetric rules; rules whose breach depends on
     * the surrounding sequence should implement it.
     */
    deltaRemove?(state: SearchState, pair: AssignmentPair): number;
    /**
     * Breaches visible only across the whole roster — staffing shortfalls,
     * per-person window totals, team fairness spread. Pair-scoped `delta`
     * cannot see these.
     */
    evaluate?(state: SearchState): ConstraintViolation[];
    /** Structured judgement for explanations and swap validation. */
    verdict?(state: SearchState, pair: AssignmentPair): RuleVerdict;
    /** Human-readable breach description for the violation report, or null when compliant. */
    explain(state: SearchState, pair: AssignmentPair): string | null;
}
