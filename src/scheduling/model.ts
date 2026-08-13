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
    AvailabilityRule,
    ConstraintOptions,
    Employee,
    HistoricalAssignment,
    ModelContext,
    ObjectiveWeights,
    ScheduleInput,
    SchedulingConstraint,
    ShiftInstance,
    ShiftTemplate,
    WorkingTimeRules,
} from './types';
import { ScheduleValidationError } from './types';
import { createDefaultConstraints } from './constraints/constraint';
import { DEFAULT_MIN_REST_MINUTES } from './constraints/min-rest';
import { assertValidOvertimeRule } from './constraints/overtime';
import type { TimelineEntry } from './engine/timeline';
import { PeriodClock, MINUTES_PER_DAY, addDays, assertIsoDate, daysBetween, isoWeekday, parseTimeOfDay } from './time';

export { daysBetween, addDays } from './time';

/** Expand one template into its dated instances inside the period. */
export function expandTemplate(
    template: ShiftTemplate,
    clock: PeriodClock,
    periodDays: number,
    context: { nightRule?: WorkingTimeRules['nightWork']; publicHolidays: Set<string> },
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

    const startTod = parseTimeOfDay(template.startTime, `shift "${template.id}".startTime`);
    const endTodRaw = parseTimeOfDay(template.endTime, `shift "${template.id}".endTime`);
    // Overnight shifts roll the end into the next day explicitly; a same-time
    // start/end is treated as a full 24h shift, never zero length.
    const overnight = endTodRaw <= startTod;

    const dates: string[] = [];
    if (template.dates) {
        for (const d of template.dates) {
            assertIsoDate(d, `shift "${template.id}".dates`);
            const offset = clock.dayIndexOf(d);
            if (offset >= 0 && offset < periodDays) dates.push(d);
        }
    } else {
        for (let i = 0; i < periodDays; i++) {
            const d = clock.dateAt(i);
            if (!template.daysOfWeek || template.daysOfWeek.includes(isoWeekday(d))) dates.push(d);
        }
    }

    return dates.map((date) => {
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
        if (unpaidBreak < 0 || unpaidBreak >= durationMinutes) {
            throw new ScheduleValidationError(`Shift template "${template.id}" has invalid unpaidBreakMinutes`);
        }
        const paidBreak = template.paidBreakMinutes ?? 0;
        if (paidBreak < 0 || unpaidBreak + paidBreak >= durationMinutes) {
            throw new ScheduleValidationError(`Shift template "${template.id}" has invalid paidBreakMinutes`);
        }
        // A paid break counts as working time, so only the unpaid one is deducted.
        const workingMinutes = workingMinutesFor(durationMinutes - unpaidBreak, template);

        const range = { start: startMinute, end: endMinute };
        const nightMinutes = context.nightRule ? clock.minutesInClockRange(range, context.nightRule.window) : 0;
        const nightThreshold = context.nightRule?.qualifiesAfterMinutes ?? 180;

        return {
            id: `${template.id}@${date}`,
            templateId: template.id,
            name: template.name,
            date,
            startMinute,
            endMinute,
            durationMinutes,
            workingMinutes,
            paidBreakMinutes: paidBreak,
            minEmployees: template.minEmployees ?? 1,
            maxEmployees: template.maxEmployees,
            tagRequirements: template.tagRequirements ?? {},
            tagMaximums: template.tagMaximums ?? {},
            requiredTags: template.requiredTags ?? [],
            shiftTypeTag: template.shiftTypeTag,
            siteId: template.siteId,
            duty: template.duty,
            nightMinutes,
            isNightShift: nightMinutes >= nightThreshold,
            weekday: isoWeekday(date),
            isSunday: isoWeekday(date) === 7,
            isPublicHoliday: context.publicHolidays.has(date),
        };
    });
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
        if (offset < 0 || offset >= periodDays) continue; // outside the period: irrelevant, not an error
        out.push({ start: clock.dayStartMinutes(offset), end: clock.dayStartMinutes(offset + 1) });
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
    const parse = (value: string, endOfDayWhenBare: boolean) => {
        const [datePart, timePart] = value.split('T');
        assertIsoDate(datePart, field);
        if (timePart) return clock.toPeriodMinutes(datePart, timePart.slice(0, 5), field);
        const dayIndex = clock.dayIndexOf(datePart);
        return endOfDayWhenBare ? clock.dayStartMinutes(dayIndex + 1) : clock.dayStartMinutes(dayIndex);
    };
    return { start: parse(from, false), end: parse(to, true) };
}

function validateEmployee(employee: Employee): void {
    if (!employee.id) throw new ScheduleValidationError('Employee is missing `id`');
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
    }
    for (const q of employee.qualifications ?? []) {
        if (q.validFrom !== undefined) assertIsoDate(q.validFrom, `employee "${employee.id}" qualifications.validFrom`);
        if (q.validUntil !== undefined) assertIsoDate(q.validUntil, `employee "${employee.id}" qualifications.validUntil`);
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
): SchedulingConstraint[] {
    const constraints = createDefaultConstraints({
        minRestMinutes: options?.minRestMinutes ?? rules?.dailyRest?.minMinutes ?? DEFAULT_MIN_REST_MINUTES,
        oneShiftPerDay: options?.oneShiftPerDay ?? false,
        rules,
        objectives,
    });
    const overrides = options?.overrides ?? {};
    for (const c of constraints) {
        const o = overrides[c.id];
        if (!o) continue;
        if (o.hardness !== undefined) c.hardness = o.hardness;
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
    const periodDays = daysBetween(input.period.startDate, input.period.endDate) + 1;
    if (periodDays <= 0) throw new ScheduleValidationError('period.endDate must not precede period.startDate');

    const clock = new PeriodClock(input.period.startDate, periodDays, input.period.timeZone ?? 'UTC');
    const rules = input.rules ?? {};
    const publicHolidays = new Set(input.calendar?.publicHolidays ?? []);
    for (const date of publicHolidays) assertIsoDate(date, 'calendar.publicHolidays');

    const instances: ShiftInstance[] = [];
    const instanceById = new Map<string, ShiftInstance>();
    for (const template of input.shifts) {
        for (const inst of expandTemplate(template, clock, periodDays, { nightRule: rules.nightWork, publicHolidays })) {
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

    const absences = new Map<string, Array<{ start: number; end: number; kind?: string }>>();
    for (const absence of input.absences ?? []) {
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

    let publishedAtMinute: number | undefined;
    if (input.published?.publishedAt) {
        const [datePart, timePart] = input.published.publishedAt.split('T');
        assertIsoDate(datePart, 'published.publishedAt');
        publishedAtMinute = clock.toPeriodMinutes(datePart, (timePart ?? '00:00').slice(0, 5), 'published.publishedAt');
    }

    let asOfMinute: number | undefined;
    if (input.asOf) {
        const [datePart, timePart] = input.asOf.split('T');
        assertIsoDate(datePart, 'asOf');
        asOfMinute = clock.toPeriodMinutes(datePart, (timePart ?? '00:00').slice(0, 5), 'asOf');
    }

    return {
        periodStartDate: input.period.startDate,
        periodDays,
        employees: input.employees,
        employeeById,
        employeeTags,
        instances,
        instanceById,
        employeeBlockedIntervals,
        minRestMinutes: input.constraints?.minRestMinutes ?? rules.dailyRest?.minMinutes ?? DEFAULT_MIN_REST_MINUTES,
        constraints: resolveConstraints(input.constraints, rules, input.objectives),
        clock,
        rules,
        rulesByEmployee,
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

/** Whether an availability rule applies to a shift instance. */
export function availabilityApplies(rule: AvailabilityRule, inst: ShiftInstance): boolean {
    if (rule.daysOfWeek && !rule.daysOfWeek.includes(inst.weekday)) return false;
    if (rule.fromDate && inst.date < rule.fromDate) return false;
    if (rule.toDate && inst.date > rule.toDate) return false;
    return true;
}

export { MINUTES_PER_DAY };
