/**
 * Model normalization — pure logic.
 *
 * Turns the caller-facing `ScheduleInput` into the fully-indexed `ModelContext`
 * the engine and constraints operate on: shift templates are expanded into
 * dated shift instances (unique `(templateId, date)` ids, so same-named shifts
 * on different days never collide), wall-clock times are resolved through a
 * DST-correct `PeriodClock`, employee time-off becomes blocked minute
 * intervals, per-person rule overrides are merged, and pre-period history is
 * seeded onto person timelines. Everything is side-effect free; the scheduler
 * facade owns sequencing.
 *
 * Two normalizations here carry legal weight and are easy to miss:
 *
 *   - **Working minutes ≠ elapsed minutes.** Unpaid breaks come off, and a duty
 *     classification can scale the rest. Hour budgets and rolling averages must
 *     use working minutes; rest gaps must use the elapsed span.
 *   - **Person, not contract.** Rest and window rules aggregate on `personId`
 *     (CJEU C-585/19), which defaults to the employee id but must be shared by
 *     records belonging to one human.
 *
 * Differences from legacy: the Python solver parsed `"YYYY-MM-DDTHH:MM:SS"`
 * strings, wrapped overnight durations in `abs()`, deduped shift *names* across
 * days, and read only the first key of each time-off entry. All of those are
 * modeled properly here.
 */

import type {
    ShiftDemandOverride,
    ConstraintOptions,
    Employee,
    HistoricalAssignment,
    ModelContext,
    ObjectiveWeights,
    ScheduleInput,
    SchedulingConstraint,
    ShiftInstance,
    ShiftTemplate,
    Site,
    TagRequirement,
    WorkingTimeRules,
} from './types';
import { ScheduleValidationError } from './types';
export { availabilityApplies } from './preferences';
import { resolvePreferenceRules, validatePreferenceObjectives } from './preferences';
import { createDefaultConstraints } from './constraints/constraint';
import { scopeEmployeeConstraints } from './constraints/employee-scope';
import { DEFAULT_MIN_REST_MINUTES } from './constraints/min-rest';
import { assertValidOvertimeRule } from './constraints/overtime';
import { holds } from './constraints/qualification';
import { DEFAULT_CONTRACT_HOURS_WEIGHT, contractedPeriodMinutes, resolveContractedWeeklyMinutes } from './contract-hours';
import type { TimelineEntry } from './engine/timeline';
import { buildSiteIndex } from './sites';
import { PeriodClock, MINUTES_PER_DAY, addDays, assertIsoDate, daysBetween, isoWeekday, parseTimeOfDay } from './time';

export { daysBetween, addDays } from './time';

/**
 * Expand a whole input's templates into the dated occurrences the engine will
 * judge — the grid a host draws before anything is assigned.
 *
 * It takes the `ScheduleInput` rather than a clock so the caller cannot hand in
 * a period clock built on a different timezone or length than the solve will
 * use: the ids and wall-clock minutes here are the ones every later call
 * (`explainCandidate`, `checkCompliance`, a returned `ScheduledAssignment`)
 * refers to.
 */
export function expandShiftInstances(input: ScheduleInput): ShiftInstance[] {
    assertIsoDate(input.period.startDate, 'period.startDate');
    assertIsoDate(input.period.endDate, 'period.endDate');
    const periodDays = daysBetween(input.period.startDate, input.period.endDate) + 1;
    if (periodDays <= 0) throw new ScheduleValidationError('period.endDate must not precede period.startDate');

    const clock = new PeriodClock(input.period.startDate, periodDays, input.period.timeZone ?? 'UTC');
    const publicHolidays = new Set(input.calendar?.publicHolidays ?? []);
    for (const date of publicHolidays) assertIsoDate(date, 'calendar.publicHolidays');

    // The same site reading the solve does. Without it this path answered a
    // different `isPublicHoliday` from `buildModel` for the very same input —
    // the second reading path the module's own rules forbid — and skipped the
    // site validation that refuses a mixed-zone roster.
    const siteIndex = buildSiteIndex(input.sites, input.travelSpeedKmh, input.period.timeZone);
    void siteIndex;
    const holidaysBySite = siteHolidayCalendars(input.sites);

    const context = { nightRule: input.rules?.nightWork, publicHolidays, holidaysBySite };
    const instances: ShiftInstance[] = [];
    const seen = new Set<string>();
    for (const template of input.shifts) {
        for (const inst of expandTemplate(template, clock, periodDays, context)) {
            if (seen.has(inst.id)) throw new ScheduleValidationError(`Duplicate shift instance id "${inst.id}"`);
            seen.add(inst.id);
            instances.push(inst);
        }
    }
    return instances;
}

/** Expand one template into its dated instances inside the period. */
/**
 * Per-site holiday calendars, keyed by site.
 *
 * A site that declares its own list replaces the roster's for its shifts; one
 * that declares none inherits it, and a present-but-empty list means the site
 * observes none. One builder because `expandShiftInstances` and `buildModel`
 * both need it and answering differently is the failure the module's own rules
 * name.
 */
function siteHolidayCalendars(sites: Site[] | undefined): Map<string, Set<string>> {
    const out = new Map<string, Set<string>>();
    for (const site of sites ?? []) {
        if (site.publicHolidays !== undefined) out.set(site.id, new Set(site.publicHolidays));
    }
    return out;
}

/**
 * Which holiday calendar applies to a shift: the hosting site's own list where
 * it declares one, otherwise the roster's. Holidays follow the place the work
 * happens, so a shift with no site can only mean the roster calendar.
 */
function holidaysFor(
    siteId: string | undefined,
    context: { publicHolidays: Set<string>; holidaysBySite?: Map<string, Set<string>> },
): Set<string> {
    if (siteId === undefined) return context.publicHolidays;
    return context.holidaysBySite?.get(siteId) ?? context.publicHolidays;
}

export function expandTemplate(
    template: ShiftTemplate,
    clock: PeriodClock,
    periodDays: number,
    context: {
        nightRule?: WorkingTimeRules['nightWork'];
        publicHolidays: Set<string>;
        /**
         * Per-site holiday calendars, replacing the roster calendar for shifts
         * at that site. Present but empty means the site observes none — the
         * distinction an `undefined` entry cannot carry.
         */
        holidaysBySite?: Map<string, Set<string>>;
    },
): ShiftInstance[] {
    if (!template.id) throw new ScheduleValidationError('Shift template is missing `id`');
    if (template.dates && template.daysOfWeek) {
        throw new ScheduleValidationError(`Shift template "${template.id}" sets both dates and daysOfWeek`);
    }
    if (template.minEmployees !== undefined && (!Number.isInteger(template.minEmployees) || template.minEmployees < 0)) {
        throw new ScheduleValidationError(`Shift template "${template.id}" has invalid minEmployees`);
    }
    if (
        template.maxEmployees !== undefined &&
        (!Number.isInteger(template.maxEmployees) || template.maxEmployees < (template.minEmployees ?? 1))
    ) {
        throw new ScheduleValidationError(`Shift template "${template.id}" has maxEmployees below minEmployees`);
    }

    const overrides = validateDemandOverrides(template);

    /*
     * Shape checks run once per template, here, rather than per date inside
     * `resolveDemand`.
     *
     * A template whose dates all fall outside the period produces no
     * occurrences at all, so validation that happened per date never ran for it
     * — bad configuration survived one solve and threw on the next, when the
     * period moved over it.
     */
    normalizeTagRequirements(template.tagRequirements, template.id);
    normalizeTagRatios(template.tagRatios, template.id);
    normalizeTagMaximums(template.tagMaximums, template.id);
    for (const override of overrides) {
        normalizeTagRequirements(override.tagRequirements, template.id);
        normalizeTagRatios(override.tagRatios, template.id);
        normalizeTagMaximums(override.tagMaximums, template.id);
    }

    const startTod = parseTimeOfDay(template.startTime, `shift "${template.id}".startTime`);
    const endTodRaw = parseTimeOfDay(template.endTime, `shift "${template.id}".endTime`);
    // Overnight shifts roll the end into the next day explicitly; a same-time
    // start/end is treated as a full 24h shift, never zero length.
    const overnight = endTodRaw <= startTod;

    // The template's own pattern, then the dates an override opens on top of it.
    // A weekday-only shift that has to open for one weekend is a temporary fact
    // like any other here, and the alternative — widening the template's
    // `daysOfWeek` — would open every weekend from then on.
    const onPattern = new Set<string>();
    if (template.dates) {
        for (const d of template.dates) {
            assertIsoDate(d, `shift "${template.id}".dates`);
            const offset = clock.dayIndexOf(d);
            if (offset >= 0 && offset < periodDays) onPattern.add(d);
        }
    } else {
        for (let i = 0; i < periodDays; i++) {
            const d = clock.dateAt(i);
            if (!template.daysOfWeek || template.daysOfWeek.includes(isoWeekday(d))) onPattern.add(d);
        }
    }
    const candidates = new Set(onPattern);
    for (const override of overrides) {
        if (override.runs !== true) continue;
        for (let i = 0; i < periodDays; i++) {
            const d = clock.dateAt(i);
            if (d < override.from || d > override.to) continue;
            if (override.daysOfWeek?.length && !override.daysOfWeek.includes(isoWeekday(d))) continue;
            candidates.add(d);
        }
    }
    const dates = [...candidates].sort();

    const instances: ShiftInstance[] = [];
    for (const date of dates) {
        const demand = resolveDemand(template, overrides, date, onPattern.has(date));
        if (!demand) continue;
        const startMinute = clock.toPeriodMinutes(date, template.startTime, `shift "${template.id}".startTime`);
        const endDate = overnight ? addDays(date, 1) : date;
        const endMinute = clock.toPeriodMinutes(endDate, template.endTime, `shift "${template.id}".endTime`);
        // Resolving both ends through the clock means a DST transition inside
        // the shift shortens or lengthens it, exactly as the payroll would.
        const durationMinutes = endMinute - startMinute;
        if (durationMinutes <= 0) {
            throw new ScheduleValidationError(
                `Shift template "${template.id}" resolves to a non-positive duration on ${date}`,
            );
        }

        const unpaidBreak = template.unpaidBreakMinutes ?? 0;
        if (!Number.isFinite(unpaidBreak) || unpaidBreak < 0 || unpaidBreak >= durationMinutes) {
            throw new ScheduleValidationError(`Shift template "${template.id}" has invalid unpaidBreakMinutes`);
        }
        const paidBreak = template.paidBreakMinutes ?? 0;
        if (!Number.isFinite(paidBreak) || paidBreak < 0 || unpaidBreak + paidBreak >= durationMinutes) {
            throw new ScheduleValidationError(`Shift template "${template.id}" has invalid paidBreakMinutes`);
        }
        // A paid break counts as working time, so only the unpaid one is deducted.
        const workingMinutes = workingMinutesFor(durationMinutes - unpaidBreak, template);

        const range = { start: startMinute, end: endMinute };
        const nightMinutes = context.nightRule ? clock.minutesInClockRange(range, context.nightRule.window) : 0;
        const nightThreshold = context.nightRule?.qualifiesAfterMinutes ?? 180;

        const instance: ShiftInstance = {
            id: `${template.id}@${date}`,
            templateId: template.id,
            name: template.name,
            date,
            startMinute,
            endMinute,
            durationMinutes,
            workingMinutes,
            paidBreakMinutes: paidBreak,
            unpaidBreakMinutes: unpaidBreak,
            minEmployees: demand.minEmployees,
            maxEmployees: demand.maxEmployees,
            tagRequirements: demand.tagRequirements,
            tagRatios: demand.tagRatios,
            tagMaximums: demand.tagMaximums,
            requiredTags: demand.requiredTags,
            shiftTypeTag: template.shiftTypeTag,
            siteId: template.siteId,
            duty: template.duty,
            nightMinutes,
            isNightShift: nightMinutes >= nightThreshold,
            weekday: isoWeekday(date),
            isSunday: isoWeekday(date) === 7,
            isPublicHoliday: holidaysFor(template.siteId, context).has(date),
        };
        if (demand.label !== undefined) instance.demandLabel = demand.label;
        instances.push(instance);
    }
    return instances;
}

/** The staffing shape one occurrence is judged against, after its overrides. */
interface ResolvedDemand {
    minEmployees: number;
    maxEmployees: number | undefined;
    /** Already normalized: both stated shapes resolve to the object form here. */
    tagRequirements: Record<string, TagRequirement>;
    tagRatios: Record<string, number>;
    tagMaximums: Record<string, number>;
    requiredTags: string[];
    label?: string;
}

function validateDemandOverrides(template: ShiftTemplate): ShiftDemandOverride[] {
    const overrides = template.demandOverrides ?? [];
    if (!Array.isArray(overrides)) {
        throw new ScheduleValidationError(`Shift template "${template.id}" has non-array demandOverrides`);
    }
    overrides.forEach((override, index) => {
        const field = `shift "${template.id}".demandOverrides[${index}]`;
        assertIsoDate(override.from, `${field}.from`);
        assertIsoDate(override.to, `${field}.to`);
        if (override.to < override.from) throw new ScheduleValidationError(`${field}: to precedes from`);
        if (override.daysOfWeek !== undefined) {
            const ok =
                Array.isArray(override.daysOfWeek) &&
                override.daysOfWeek.every((d) => Number.isInteger(d) && d >= 1 && d <= 7);
            if (!ok) throw new ScheduleValidationError(`${field}: daysOfWeek must be ISO weekdays 1..7`);
        }
        for (const key of ['minEmployees', 'extraEmployees'] as const) {
            const value = override[key];
            if (value !== undefined && (!Number.isInteger(value) || value < 0)) {
                throw new ScheduleValidationError(`${field}: invalid ${key}`);
            }
        }
        if (
            override.maxEmployees !== undefined &&
            override.maxEmployees !== null &&
            (!Number.isInteger(override.maxEmployees) || override.maxEmployees < 0)
        ) {
            throw new ScheduleValidationError(`${field}: invalid maxEmployees`);
        }
    });
    return overrides;
}

/**
 * Fold the overrides matching `date` onto the template's standing demand.
 *
 * Applied in order, later wins per field, `extraEmployees` accumulates. A
 * minimum raised above the template's standing maximum lifts that maximum with
 * it: "the most it can take" was said of the ordinary day, and "three at the
 * peak" plainly means three. Only a maximum the override itself states is held
 * against the resolved minimum — that combination is a shape nobody can staff.
 */
/**
 * Days of the period this contract is in force.
 *
 * Both bounds inclusive, clipped to the period, and zero when they do not
 * overlap it at all — somebody whose contract ended in February is owed nothing
 * in March rather than a full month they were not employed for.
 *
 * Arithmetic only: `validateContractDates` runs for every employee, including
 * the ones this is never called for.
 */
/**
 * The contract fields that change a roster whether or not a contracted week
 * resolves.
 *
 * Separate from `daysInForce` because that runs only for employees whose
 * weekly minutes resolve — and `contractLimits` string-compares these dates for
 * *everybody*. An unpadded `2026-3-2` sorts after `2026-03-02`, so it pruned
 * every instance and produced an empty roster with no error; a negative
 * opening balance silently lifted a rolling cap. Both were validated for a
 * full-timer and waved through for anybody else.
 */
function validateContractDates(employee: Employee): void {
    const contract = employee.contract;
    if (!contract) return;
    if (contract.startDate) assertIsoDate(contract.startDate, `employee "${employee.id}".contract.startDate`);
    if (contract.endDate) assertIsoDate(contract.endDate, `employee "${employee.id}".contract.endDate`);
    if (contract.startDate && contract.endDate && contract.startDate > contract.endDate) {
        throw new ScheduleValidationError(
            `Employee "${employee.id}" has a contract starting ${contract.startDate}, after it ends ${contract.endDate}`,
        );
    }
    if (contract.openingBalanceMinutes !== undefined) {
        if (!Number.isFinite(contract.openingBalanceMinutes) || contract.openingBalanceMinutes < 0) {
            throw new ScheduleValidationError(
                `Employee "${employee.id}".contract.openingBalanceMinutes must be a non-negative number of minutes`,
            );
        }
    }
}

function daysInForce(employee: Employee, periodStart: string, periodDays: number): number {
    const contract = employee.contract;
    const periodEnd = addDays(periodStart, periodDays - 1);

    const from = contract?.startDate && contract.startDate > periodStart ? contract.startDate : periodStart;
    const to = contract?.endDate && contract.endDate < periodEnd ? contract.endDate : periodEnd;
    if (from > to) return 0;
    return daysBetween(from, to) + 1;
}

/**
 * Both shapes of `tagRequirements`, resolved to one.
 *
 * A plain number is a count with no grade floor; the object form carries one.
 * Normalising here means no rule downstream sees a union — the alternative,
 * every counting site widening a `typeof` check, is how one of them ends up
 * reading `{ min: 2 }` as `NaN` and quietly requiring nobody.
 */
function normalizeTagRequirements(
    stated: Record<string, number | TagRequirement> | undefined,
    templateId: string,
): Record<string, TagRequirement> {
    const out: Record<string, TagRequirement> = {};
    for (const [tag, value] of Object.entries(stated ?? {})) {
        const requirement = typeof value === 'number' ? { min: value } : value;
        if (!Number.isInteger(requirement?.min) || requirement.min < 0) {
            throw new ScheduleValidationError(
                `Shift template "${templateId}".tagRequirements["${tag}"] needs a non-negative whole minimum`,
            );
        }
        if (requirement.level !== undefined) {
            if (!Number.isFinite(requirement.level) || requirement.level <= 0) {
                // Zero is refused rather than accepted, because it reads as "no
                // floor" and means the opposite: `holds` skips the plain-tag
                // branch the moment a level is present, so `{ min: 1, level: 0 }`
                // silently excludes everybody whose tag carries no grade. Omit
                // the level to count anybody holding the tag.
                throw new ScheduleValidationError(
                    `Shift template "${templateId}".tagRequirements["${tag}"].level must be a positive number; ` +
                        `omit it to count anybody holding the tag`,
                );
            }
        }
        out[tag] = requirement.level === undefined ? { min: requirement.min } : { min: requirement.min, level: requirement.level };
    }
    return out;
}

/** Ceilings, checked like the minimums beside them. A negative maximum can never be met. */
function normalizeTagMaximums(
    stated: Record<string, number> | undefined,
    templateId: string,
): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [tag, max] of Object.entries(stated ?? {})) {
        if (!Number.isInteger(max) || max < 0) {
            throw new ScheduleValidationError(
                `Shift template "${templateId}".tagMaximums["${tag}"] needs a non-negative whole maximum`,
            );
        }
        out[tag] = max;
    }
    return out;
}

/** Proportions, checked as fractions. A ratio outside 0..1 is not a proportion of anything. */
function normalizeTagRatios(
    stated: Record<string, number> | undefined,
    templateId: string,
): Record<string, number> {
    const out: Record<string, number> = {};
    for (const [tag, ratio] of Object.entries(stated ?? {})) {
        if (typeof ratio !== 'number' || !Number.isFinite(ratio) || ratio < 0 || ratio > 1) {
            throw new ScheduleValidationError(
                `Shift template "${templateId}".tagRatios["${tag}"] must be a fraction between 0 and 1`,
            );
        }
        out[tag] = ratio;
    }
    return out;
}

function resolveDemand(
    template: ShiftTemplate,
    overrides: ShiftDemandOverride[],
    date: string,
    onPattern: boolean,
): ResolvedDemand | null {
    let min = template.minEmployees ?? 1;
    let max: number | undefined = template.maxEmployees;
    let extra = 0;
    let maxStated = false;
    let runs = true;
    const demand: ResolvedDemand = {
        minEmployees: min,
        maxEmployees: max,
        tagRequirements: normalizeTagRequirements(template.tagRequirements, template.id),
        tagRatios: normalizeTagRatios(template.tagRatios, template.id),
        tagMaximums: normalizeTagMaximums(template.tagMaximums, template.id),
        requiredTags: template.requiredTags ?? [],
    };
    const weekday = isoWeekday(date);
    // A date the template's own pattern does not cover is only here because an
    // override opened it, so it starts closed: a later override setting
    // `runs: false` over the same stretch has to be able to shut it again.
    if (!onPattern) runs = false;
    let matched = false;
    for (const override of overrides) {
        if (date < override.from || date > override.to) continue;
        if (override.daysOfWeek && !override.daysOfWeek.includes(weekday)) continue;
        matched = true;
        if (override.minEmployees !== undefined) min = override.minEmployees;
        if (override.maxEmployees !== undefined) {
            max = override.maxEmployees ?? undefined;
            maxStated = true;
        }
        if (override.extraEmployees !== undefined) extra += override.extraEmployees;
        if (override.tagRequirements !== undefined) {
            demand.tagRequirements = normalizeTagRequirements(override.tagRequirements, template.id);
        }
        if (override.tagRatios !== undefined) demand.tagRatios = normalizeTagRatios(override.tagRatios, template.id);
        if (override.tagMaximums !== undefined) {
            demand.tagMaximums = normalizeTagMaximums(override.tagMaximums, template.id);
        }
        if (override.requiredTags !== undefined) demand.requiredTags = override.requiredTags;
        if (override.runs !== undefined) runs = override.runs;
        if (override.label !== undefined) demand.label = override.label;
    }
    if (!matched) return demand;
    if (!runs) return null;
    demand.minEmployees = min + extra;
    demand.maxEmployees = max === undefined ? undefined : max + extra;
    if (demand.maxEmployees !== undefined && demand.maxEmployees < demand.minEmployees) {
        if (!maxStated) {
            demand.maxEmployees = demand.minEmployees;
            return demand;
        }
        throw new ScheduleValidationError(
            `Shift template "${template.id}" resolves to maxEmployees below minEmployees on ${date}` +
                (demand.label ? ` (${demand.label})` : ''),
        );
    }
    return demand;
}

/**
 * Working minutes for a duty of `paidSpan` elapsed minutes.
 *
 * A plain shift counts in full. Stand-by may count at a fraction or only for
 * the time actually worked — which of those applies is a legal classification
 * the caller makes and the engine never infers.
 */
function workingMinutesFor(paidSpan: number, template: ShiftTemplate): number {
    const duty = template.duty;
    if (!duty || duty.countsAsWorkingTime === 'full') return paidSpan;
    if (duty.countsAsWorkingTime === 'actualOnly') {
        return Math.min(paidSpan, Math.max(0, duty.expectedActiveMinutes ?? 0));
    }
    const fraction = duty.countsAsWorkingTime;
    if (!Number.isFinite(fraction) || fraction < 0 || fraction > 1) {
        throw new ScheduleValidationError(
            `Shift template "${template.id}" has invalid duty.countsAsWorkingTime: ${String(fraction)}`,
        );
    }
    return Math.round(paidSpan * fraction);
}

function blockedIntervalsFor(
    employee: Employee,
    clock: PeriodClock,
    periodDays: number,
    instanceById: Map<string, ShiftInstance>,
): Array<{ start: number; end: number }> {
    const out: Array<{ start: number; end: number }> = [];
    for (const entry of employee.timeOff ?? []) {
        assertIsoDate(entry.date, `employee "${employee.id}" timeOff`);
        if (entry.shiftInstanceId !== undefined) {
            const inst = instanceById.get(entry.shiftInstanceId);
            if (!inst) {
                throw new ScheduleValidationError(
                    `Employee "${employee.id}" timeOff references unknown shiftInstanceId "${entry.shiftInstanceId}"`,
                );
            }
            out.push({ start: inst.startMinute, end: inst.endMinute });
            continue;
        }
        const offset = clock.dayIndexOf(entry.date);
        const blocked = { start: clock.dayStartMinutes(offset), end: clock.dayStartMinutes(offset + 1) };
        if (offset < 0 || offset >= periodDays) {
            if (
                ![...instanceById.values()].some((inst) => inst.startMinute < blocked.end && blocked.start < inst.endMinute)
            )
                continue;
        }
        out.push(blocked);
    }

    // External commitments are blackouts the roster may never override
    // (Directive (EU) 2019/1152 Art 9 bars treating parallel employment as
    // schedulable), so they join the same blocked set as time off.
    for (const commitment of employee.externalCommitments ?? []) {
        out.push(spanToMinutes(commitment.from, commitment.to, clock, `employee "${employee.id}" externalCommitments`));
    }
    return out;
}

/** Resolve an ISO date or date-time span to period minutes. */
function spanToMinutes(from: string, to: string, clock: PeriodClock, field: string): { start: number; end: number } {
    const start = clock.parseDateTime(from, `${field}.from`);
    const end = clock.parseDateTime(to, `${field}.to`, true);
    if (end <= start) throw new ScheduleValidationError(`${field}: to must follow from`);
    return { start, end };
}

function validateEmployee(employee: Employee): void {
    if (!employee.id) throw new ScheduleValidationError('Employee is missing `id`');
    validateContractDates(employee);
    for (const [field, value] of [
        ['maxHoursForPeriod', employee.maxHoursForPeriod],
        ['minHoursForPeriod', employee.minHoursForPeriod],
        ['maxShiftDurationMinutes', employee.maxShiftDurationMinutes],
    ] as const) {
        if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
            throw new ScheduleValidationError(`Employee "${employee.id}" has invalid ${field}: ${value}`);
        }
    }
    for (const rule of employee.availability ?? []) {
        if (rule.from !== undefined) parseTimeOfDay(rule.from, `employee "${employee.id}" availability.from`);
        if (rule.to !== undefined) parseTimeOfDay(rule.to, `employee "${employee.id}" availability.to`);
        if (rule.fromDate !== undefined) assertIsoDate(rule.fromDate, `employee "${employee.id}" availability.fromDate`);
        if (rule.toDate !== undefined) assertIsoDate(rule.toDate, `employee "${employee.id}" availability.toDate`);
        if (
            rule.shiftTypeTags !== undefined &&
            (!Array.isArray(rule.shiftTypeTags) || rule.shiftTypeTags.some((t) => typeof t !== 'string' || !t))
        ) {
            throw new ScheduleValidationError(
                `employee "${employee.id}" availability.shiftTypeTags must be non-empty strings`,
            );
        }
        if (rule.priority !== undefined) {
            if (rule.priority !== 'normal' && rule.priority !== 'important') {
                throw new ScheduleValidationError(
                    `employee "${employee.id}" availability.priority must be normal or important`,
                );
            }
            if (rule.kind !== 'preferred' && rule.kind !== 'avoid') {
                throw new ScheduleValidationError(
                    `employee "${employee.id}" availability.priority applies only to preferred and avoid rules`,
                );
            }
        }
    }
    for (const q of employee.qualifications ?? []) {
        if (q.validFrom !== undefined) assertIsoDate(q.validFrom, `employee "${employee.id}" qualifications.validFrom`);
        if (q.validUntil !== undefined) assertIsoDate(q.validUntil, `employee "${employee.id}" qualifications.validUntil`);
    }
}

function assertValidContractRule(rule: WorkingTimeRules['contract'], owner: string): void {
    if (!rule) return;
    for (const [field, value] of [
        ['fullTimeWeeklyMinutes', rule.fullTimeWeeklyMinutes],
        ['maxOverMinutes', rule.maxOverMinutes],
        ['maxUnderMinutes', rule.maxUnderMinutes],
    ] as const) {
        if (value !== undefined && (!Number.isFinite(value) || value < 0)) {
            throw new ScheduleValidationError(`${owner}: contract.${field} must be a non-negative number`);
        }
    }
    if (rule.fullTimeWeeklyMinutes !== undefined && rule.fullTimeWeeklyMinutes === 0) {
        throw new ScheduleValidationError(`${owner}: contract.fullTimeWeeklyMinutes must be positive`);
    }
}

/**
 * Merge the global rule set with one person's overrides.
 *
 * A shallow per-family merge, not a deep one: a person's `dailyRest` replaces
 * the global `dailyRest` outright. Half-overriding a rule family is how you get
 * a minor who inherits an adult's night window, so the boundary is the family.
 */
export function mergeRules(base: WorkingTimeRules | undefined, override: WorkingTimeRules | undefined): WorkingTimeRules {
    if (!base) return override ?? {};
    if (!override) return base;
    return { ...base, ...override };
}

/** Resolve built-in constraints with caller hardness/weight overrides, then append customs. */
export function resolveConstraints(
    options: ConstraintOptions | undefined,
    rules?: WorkingTimeRules,
    objectives?: ObjectiveWeights,
    employeeRules?: Map<string, WorkingTimeRules>,
): SchedulingConstraint[] {
    const defaults = {
        minRestMinutes: options?.minRestMinutes ?? rules?.dailyRest?.minMinutes ?? DEFAULT_MIN_REST_MINUTES,
        oneShiftPerDay: options?.oneShiftPerDay ?? false,
        rules,
        objectives,
    };
    const constraints = employeeRules
        ? scopeEmployeeConstraints(defaults, employeeRules)
        : createDefaultConstraints(defaults);
    const overrides = options?.overrides ?? {};
    for (const c of constraints) {
        const o = overrides[c.id];
        if (!o) continue;
        if (o.hardness !== undefined) {
            c.hardness = o.hardness;
            const verdict = c.verdict?.bind(c);
            if (verdict) c.verdict = (state, pair) => ({ ...verdict(state, pair), severity: o.hardness! });
            const evaluate = c.evaluate?.bind(c);
            if (evaluate) c.evaluate = (state) => evaluate(state).map((v) => ({ ...v, severity: o.hardness! }));
        }
        if (o.weight !== undefined) c.weight = o.weight;
    }
    return [...constraints, ...(options?.custom ?? [])];
}

/** Convert caller history into per-person timeline entries at (usually negative) period minutes. */
function buildHistory(
    history: HistoricalAssignment[] | undefined,
    clock: PeriodClock,
    personIdOf: Map<string, string>,
): Map<string, TimelineEntry[]> {
    const out = new Map<string, TimelineEntry[]>();
    for (const [index, entry] of (history ?? []).entries()) {
        assertIsoDate(entry.date, 'history.date');
        const start = clock.toPeriodMinutes(entry.date, entry.startTime, 'history.startTime');
        const endTod = parseTimeOfDay(entry.endTime, 'history.endTime');
        const startTod = parseTimeOfDay(entry.startTime, 'history.startTime');
        const endDate = endTod <= startTod ? addDays(entry.date, 1) : entry.date;
        const end = clock.toPeriodMinutes(endDate, entry.endTime, 'history.endTime');

        const personId = personIdOf.get(entry.employeeId) ?? entry.employeeId;
        const entries = out.get(personId) ?? [];
        entries.push({
            id: entry.id ?? `history:${index}`,
            start,
            end,
            workingMinutes: entry.workingMinutes ?? end - start,
            tag: entry.shiftTypeTag,
            siteId: entry.siteId,
            historical: true,
        });
        out.set(personId, entries);
    }
    return out;
}

/**
 * Normalize and validate the scheduling problem. Throws
 * `ScheduleValidationError` on malformed input — never a silent wrong schedule.
 */
export function buildModel(input: ScheduleInput): ModelContext {
    assertIsoDate(input.period.startDate, 'period.startDate');
    assertIsoDate(input.period.endDate, 'period.endDate');
    for (const [name, value] of [
        ['timeBudgetMs', input.timeBudgetMs],
        ['maxIterations', input.maxIterations],
    ] as const) {
        if (
            value !== undefined &&
            (!Number.isFinite(value) || value < 0 || (name === 'maxIterations' && !Number.isInteger(value)))
        ) {
            throw new ScheduleValidationError(
                `${name} must be a finite non-negative ${name === 'maxIterations' ? 'integer' : 'number'}`,
            );
        }
    }
    const periodDays = daysBetween(input.period.startDate, input.period.endDate) + 1;
    if (periodDays <= 0) throw new ScheduleValidationError('period.endDate must not precede period.startDate');

    const clock = new PeriodClock(input.period.startDate, periodDays, input.period.timeZone ?? 'UTC');
    const rules = input.rules ?? {};
    const siteIndex = buildSiteIndex(input.sites, input.travelSpeedKmh, input.period.timeZone);
    const publicHolidays = new Set(input.calendar?.publicHolidays ?? []);
    for (const date of publicHolidays) assertIsoDate(date, 'calendar.publicHolidays');

    const holidaysBySite = siteHolidayCalendars(input.sites);

    const instances: ShiftInstance[] = [];
    const instanceById = new Map<string, ShiftInstance>();
    for (const template of input.shifts) {
        for (const inst of expandTemplate(template, clock, periodDays, {
            nightRule: rules.nightWork,
            publicHolidays,
            holidaysBySite,
        })) {
            if (instanceById.has(inst.id)) throw new ScheduleValidationError(`Duplicate shift instance id "${inst.id}"`);
            instanceById.set(inst.id, inst);
            instances.push(inst);
        }
    }

    const employeeById = new Map<string, Employee>();
    const employeeTags = new Map<string, Set<string>>();
    const employeeBlockedIntervals = new Map<string, Array<{ start: number; end: number }>>();
    const rulesByEmployee = new Map<string, WorkingTimeRules>();
    const personIdOf = new Map<string, string>();
    const employeesOfPerson = new Map<string, string[]>();

    for (const employee of input.employees) {
        validateEmployee(employee);
        if (employeeById.has(employee.id)) throw new ScheduleValidationError(`Duplicate employee id "${employee.id}"`);
        employeeById.set(employee.id, employee);
        employeeTags.set(employee.id, new Set(employee.tags ?? []));
        employeeBlockedIntervals.set(employee.id, blockedIntervalsFor(employee, clock, periodDays, instanceById));
        // Per-person rule overrides replace whole families, so an override must
        // satisfy the same invariants the global rule was validated against.
        if (employee.rules?.overtime) assertValidOvertimeRule(employee.rules.overtime, `employee "${employee.id}"`);
        rulesByEmployee.set(employee.id, mergeRules(rules, employee.rules));

        const personId = employee.personId ?? employee.id;
        personIdOf.set(employee.id, personId);
        employeesOfPerson.set(personId, [...(employeesOfPerson.get(personId) ?? []), employee.id]);
    }

    // Tag possession is a question about the shift's date, so per-tag minimums
    // and maximums must resolve it the same way `requiredTags` does. Plain tags
    // short-circuit; only a dated qualification needs the scan. The cache keeps
    // the search loop's repeated lookups off that scan — the model is immutable
    // once built, so a memo can never go stale.
    const tagOnCache = new Map<string, boolean>();
    /**
     * The graded question. Deliberately not cached: a level floor makes the key
     * space four-dimensional, and graded requirements are rare enough that the
     * scan costs less than the memo would.
     */
    const holdsTagAt = (employeeId: string, tag: string, date: string, minLevel: number): boolean => {
        const employee = employeeById.get(employeeId);
        return employee ? holds(employee, tag, date, minLevel) : false;
    };
    const holdsTagOn = (employeeId: string, tag: string, date: string): boolean => {
        if (employeeTags.get(employeeId)?.has(tag)) return true;
        const employee = employeeById.get(employeeId);
        if (!employee?.qualifications?.length) return false;
        const key = `${employeeId}\0${tag}\0${date}`;
        const cached = tagOnCache.get(key);
        if (cached !== undefined) return cached;
        const result = holds(employee, tag, date);
        tagOnCache.set(key, result);
        return result;
    };

    // The contracted week resolves exactly once, against the rules that apply
    // to the person (a per-person override may carry its own full-time week),
    // and every rule reads the resolved figure from the context.
    const contractedWeeklyMinutes = new Map<string, number>();
    const contractedPeriod = new Map<string, number>();
    for (const employee of input.employees) {
        const weekly = resolveContractedWeeklyMinutes(employee, rulesByEmployee.get(employee.id) ?? rules);
        if (weekly === undefined) continue;
        contractedWeeklyMinutes.set(employee.id, weekly);
        // Days the contract is actually in force inside the period, not the
        // period's own length: somebody who joins on day fifteen is owed a
        // fortnight, and planning them a full month is what made the
        // contract-hours objective load a new starter past everybody else.
        contractedPeriod.set(
            employee.id,
            contractedPeriodMinutes(weekly, daysInForce(employee, input.period.startDate, periodDays)),
        );
    }
    const contractHoursWeight = input.objectives?.contractHoursWeight ?? DEFAULT_CONTRACT_HOURS_WEIGHT;
    if (!Number.isFinite(contractHoursWeight) || contractHoursWeight < 0) {
        throw new ScheduleValidationError(`objectives.contractHoursWeight must be a non-negative number`);
    }
    const fillToContract = input.objectives?.fillToContract ?? true;
    if (typeof fillToContract !== 'boolean') {
        throw new ScheduleValidationError(`objectives.fillToContract must be a boolean`);
    }
    if (rules.contract) assertValidContractRule(rules.contract, 'rules');
    for (const employee of input.employees) {
        if (employee.rules?.contract) assertValidContractRule(employee.rules.contract, `employee "${employee.id}"`);
    }

    const absences = new Map<string, Array<{ start: number; end: number; kind?: string }>>();
    for (const absence of input.absences ?? []) {
        if (!employeeById.has(absence.employeeId))
            throw new ScheduleValidationError(`Unknown absence employee "${absence.employeeId}"`);
        const span = spanToMinutes(absence.from, absence.to, clock, 'absences');
        absences.set(absence.employeeId, [...(absences.get(absence.employeeId) ?? []), { ...span, kind: absence.kind }]);
        // An absence blocks assignment as firmly as time off does.
        const blocked = employeeBlockedIntervals.get(absence.employeeId);
        if (blocked) blocked.push(span);
    }

    const publishedPairs = new Set<string>();
    for (const assignment of input.published?.roster ?? []) {
        publishedPairs.add(`${assignment.employeeId}|${assignment.shiftInstanceId}`);
    }
    const pinned = new Set((input.pinned ?? []).map((p) => `${p.employeeId}|${p.shiftInstanceId}`));

    const publishedAtMinute =
        input.published?.publishedAt === undefined
            ? undefined
            : clock.parseDateTime(input.published.publishedAt, 'published.publishedAt');
    const asOfMinute = input.asOf === undefined ? undefined : clock.parseDateTime(input.asOf, 'asOf');

    validatePreferenceObjectives(input.objectives?.preferences);
    const preferenceRules = resolvePreferenceRules(input.employees, instances, clock, input.objectives?.preferences);

    return {
        periodStartDate: input.period.startDate,
        periodDays,
        employees: input.employees,
        employeeById,
        employeeTags,
        holdsTagOn,
        holdsTagAt,
        instances,
        instanceById,
        siteIndex,
        employeeBlockedIntervals,
        minRestMinutes: input.constraints?.minRestMinutes ?? rules.dailyRest?.minMinutes ?? DEFAULT_MIN_REST_MINUTES,
        aggregateConstraints: input.constraints?.custom?.filter((c) => c.evaluate) ?? [],
        constraints: resolveConstraints(input.constraints, rules, input.objectives, rulesByEmployee),
        clock,
        rules,
        rulesByEmployee,
        contractedWeeklyMinutes,
        contractedPeriodMinutes: contractedPeriod,
        contractHoursWeight,
        fillToContract,
        preferenceRules,
        personIdOf,
        employeesOfPerson,
        history: buildHistory(input.history, clock, personIdOf),
        publicHolidays,
        absences,
        pinned,
        publishedAtMinute,
        publishedPairs,
        asOfMinute,
    };
}

export { MINUTES_PER_DAY };
