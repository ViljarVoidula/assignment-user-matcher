import { expect } from 'chai';
import { buildModel, mergeRules, availabilityApplies } from '../../src/scheduling/model';
import { assign, assignedPairs, createState, pairKey, timelineEntryId, unassign } from '../../src/scheduling/engine/state';
import { PersonTimeline, TimelineIndex, type TimelineEntry } from '../../src/scheduling/engine/timeline';
import {
    MIN_HOURS_WEIGHT,
    TAG_SHORTFALL_WEIGHT,
    UNFILLED_WEIGHT,
    breachTotals,
    compareScores,
    hoursVariance,
    isBetter,
    minHoursShortfalls,
    score,
    scoreLex,
    slotShortage,
    softBreaches,
    tagShortage,
    unfilledSlots,
} from '../../src/scheduling/engine/objective';
import { constructionOrder, greedyFill, hardCompliant } from '../../src/scheduling/engine/construction';
import { propagate } from '../../src/scheduling/engine/propagation';
import {
    DEFAULT_MIN_REST_MINUTES,
    ScheduleValidationError,
    checkCompliance,
    diagnoseInfeasibility,
    explainCandidate,
    rankCandidates,
    repairSchedule,
    solveSchedule,
} from '../../src/scheduling';
import type {
    ModelContext,
    ScheduleInput,
    ScheduledAssignment,
    SchedulingConstraint,
    ShiftTemplate,
} from '../../src/scheduling';

const H = 60;
const DAY = 1440;
const WEEK = { startDate: '2026-01-05', endDate: '2026-01-11' }; // Mon 5 Jan .. Sun 11 Jan 2026

function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

function inputWith(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    return {
        period: WEEK,
        employees: [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
        ...overrides,
    };
}

function rosterEntry(employeeId: string, shiftInstanceId: string): ScheduledAssignment {
    return { employeeId, shiftInstanceId, date: shiftInstanceId.split('@')[1], reasons: [] };
}

function stateWith(ctx: ModelContext, pairs: Array<[string, string]>) {
    const state = createState(ctx);
    for (const [employeeId, instanceId] of pairs) assign(state, employeeId, instanceId, []);
    return state;
}

function entry(id: string, start: number, end: number, workingMinutes = end - start, tag?: string): TimelineEntry {
    return { id, start, end, workingMinutes, tag };
}

describe('Scheduling engine coverage', function () {
    describe('model normalization', function () {
        it('rejects a template without an id', function () {
            expect(() => buildModel(inputWith({ shifts: [shift('', '08:00', '16:00', ['2026-01-05'])] }))).to.throw(
                ScheduleValidationError,
                /missing `id`/,
            );
        });

        it('rejects a template that sets both dates and daysOfWeek', function () {
            const both = { ...shift('d', '08:00', '16:00', ['2026-01-05']), daysOfWeek: [1] };
            expect(() => buildModel(inputWith({ shifts: [both] }))).to.throw(
                ScheduleValidationError,
                /both dates and daysOfWeek/,
            );
        });

        it('rejects invalid minEmployees and maxEmployees below minEmployees', function () {
            expect(() =>
                buildModel(inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { minEmployees: -1 })] })),
            ).to.throw(ScheduleValidationError, /invalid minEmployees/);
            expect(() =>
                buildModel(inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { minEmployees: 1.5 })] })),
            ).to.throw(ScheduleValidationError, /invalid minEmployees/);
            expect(() =>
                buildModel(inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { maxEmployees: 0 })] })),
            ).to.throw(ScheduleValidationError, /maxEmployees below minEmployees/);
        });

        it('accepts maxEmployees 0 when minEmployees is explicitly 0', function () {
            const ctx = buildModel(
                inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { minEmployees: 0, maxEmployees: 0 })] }),
            );
            const inst = ctx.instanceById.get('d@2026-01-05')!;
            expect(inst.minEmployees).to.equal(0);
            expect(inst.maxEmployees).to.equal(0);
        });

        it('rejects a malformed template date', function () {
            expect(() => buildModel(inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-13-40'])] }))).to.throw(
                ScheduleValidationError,
                /Invalid ISO date/,
            );
        });

        it('rejects a shift that resolves to a non-positive duration across spring-forward', function () {
            // Berlin skips 02:00-03:00 on 2026-03-29; both endpoints resolve to the same instant.
            expect(() =>
                buildModel({
                    period: { startDate: '2026-03-29', endDate: '2026-03-29', timeZone: 'Europe/Berlin' },
                    employees: [{ id: 'e1', tags: [], timeOff: [] }],
                    shifts: [shift('gap', '02:00', '03:00', ['2026-03-29'])],
                }),
            ).to.throw(ScheduleValidationError, /non-positive duration/);
        });

        it('rejects invalid unpaidBreakMinutes', function () {
            expect(() =>
                buildModel(
                    inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { unpaidBreakMinutes: -5 })] }),
                ),
            ).to.throw(ScheduleValidationError, /invalid unpaidBreakMinutes/);
            expect(() =>
                buildModel(
                    inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { unpaidBreakMinutes: 8 * H })] }),
                ),
            ).to.throw(ScheduleValidationError, /invalid unpaidBreakMinutes/);
        });

        it('rejects duplicate shift instance ids', function () {
            expect(() =>
                buildModel(
                    inputWith({
                        shifts: [
                            shift('d', '08:00', '16:00', ['2026-01-05']),
                            shift('d', '09:00', '17:00', ['2026-01-05']),
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /Duplicate shift instance id "d@2026-01-05"/);
        });

        it('rejects duplicate employee ids', function () {
            expect(() =>
                buildModel(
                    inputWith({
                        employees: [
                            { id: 'e1', tags: [], timeOff: [] },
                            { id: 'e1', tags: [], timeOff: [] },
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /Duplicate employee id "e1"/);
        });

        it('rejects timeOff referencing an unknown shift instance', function () {
            expect(() =>
                buildModel(
                    inputWith({
                        employees: [
                            { id: 'e1', tags: [], timeOff: [{ date: '2026-01-05', shiftInstanceId: 'nope@2026-01-05' }] },
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /unknown shiftInstanceId "nope@2026-01-05"/);
        });

        it('rejects invalid employee numeric bounds', function () {
            expect(() =>
                buildModel(inputWith({ employees: [{ id: 'e1', tags: [], timeOff: [], maxHoursForPeriod: -1 }] })),
            ).to.throw(ScheduleValidationError, /invalid maxHoursForPeriod/);
            expect(() =>
                buildModel(inputWith({ employees: [{ id: 'e1', tags: [], timeOff: [], minHoursForPeriod: Number.NaN }] })),
            ).to.throw(ScheduleValidationError, /invalid minHoursForPeriod/);
        });

        it('rejects malformed availability fields', function () {
            expect(() =>
                buildModel(
                    inputWith({
                        employees: [{ id: 'e1', tags: [], timeOff: [], availability: [{ kind: 'avoid', from: 'noon' }] }],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /Invalid time-of-day/);
            expect(() =>
                buildModel(
                    inputWith({
                        employees: [
                            { id: 'e1', tags: [], timeOff: [], availability: [{ kind: 'avoid', fromDate: '05-01-2026' }] },
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /Invalid ISO date/);
        });

        it('rejects malformed qualification validity dates', function () {
            expect(() =>
                buildModel(
                    inputWith({
                        employees: [
                            { id: 'e1', tags: [], timeOff: [], qualifications: [{ tag: 'x', validUntil: 'never' }] },
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /Invalid ISO date/);
        });

        it('rejects an out-of-range duty fraction', function () {
            expect(() =>
                buildModel(
                    inputWith({
                        shifts: [shift('s', '08:00', '16:00', ['2026-01-05'], { duty: { countsAsWorkingTime: 1.5 } })],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /invalid duty.countsAsWorkingTime/);
        });

        it('rejects an unknown time zone', function () {
            expect(() => buildModel(inputWith({ period: { ...WEEK, timeZone: 'Mars/Olympus' } }))).to.throw(
                ScheduleValidationError,
                /Unknown time zone/,
            );
        });

        it('rejects a period whose end precedes its start', function () {
            expect(() => buildModel(inputWith({ period: { startDate: '2026-01-05', endDate: '2026-01-04' } }))).to.throw(
                ScheduleValidationError,
                /must not precede/,
            );
        });

        it('rejects a malformed public holiday', function () {
            expect(() => buildModel(inputWith({ calendar: { publicHolidays: ['soon'] } }))).to.throw(
                ScheduleValidationError,
                /Invalid ISO date for calendar.publicHolidays/,
            );
        });

        it('rejects a malformed history date', function () {
            expect(() =>
                buildModel(
                    inputWith({ history: [{ employeeId: 'e1', date: 'yesterday', startTime: '08:00', endTime: '16:00' }] }),
                ),
            ).to.throw(ScheduleValidationError, /Invalid ISO date for history.date/);
        });

        it('expands daysOfWeek templates onto matching weekdays only', function () {
            const ctx = buildModel(
                inputWith({
                    shifts: [
                        { id: 'w', name: 'W', startTime: '08:00', endTime: '16:00', daysOfWeek: [6, 7] },
                        { id: 'all', name: 'A', startTime: '18:00', endTime: '20:00' },
                    ],
                }),
            );
            const weekend = ctx.instances.filter((i) => i.templateId === 'w').map((i) => i.id);
            expect(weekend).to.deep.equal(['w@2026-01-10', 'w@2026-01-11']);
            // No dates and no daysOfWeek means every day of the period.
            expect(ctx.instances.filter((i) => i.templateId === 'all')).to.have.length(7);
        });

        it('drops template dates outside the period', function () {
            const ctx = buildModel(inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-04', '2026-01-05'])] }));
            expect(ctx.instances.map((i) => i.id)).to.deep.equal(['d@2026-01-05']);
        });

        it('rolls an overnight template into the next day and treats equal start/end as 24h', function () {
            const ctx = buildModel(
                inputWith({
                    shifts: [shift('n', '22:00', '06:00', ['2026-01-05']), shift('f', '08:00', '08:00', ['2026-01-05'])],
                }),
            );
            const night = ctx.instanceById.get('n@2026-01-05')!;
            expect(night.startMinute).to.equal(22 * H);
            expect(night.endMinute).to.equal(DAY + 6 * H);
            expect(night.durationMinutes).to.equal(8 * H);
            expect(ctx.instanceById.get('f@2026-01-05')!.durationMinutes).to.equal(DAY);
        });

        it('derives working minutes from each duty classification', function () {
            const ctx = buildModel(
                inputWith({
                    shifts: [
                        shift('full', '18:00', '08:00', ['2026-01-05'], { duty: { countsAsWorkingTime: 'full' } }),
                        shift('ao0', '18:00', '08:00', ['2026-01-05'], { duty: { countsAsWorkingTime: 'actualOnly' } }),
                        shift('aocap', '18:00', '08:00', ['2026-01-05'], {
                            duty: { countsAsWorkingTime: 'actualOnly', expectedActiveMinutes: 5000 },
                        }),
                        shift('zero', '18:00', '08:00', ['2026-01-05'], { duty: { countsAsWorkingTime: 0 } }),
                    ],
                }),
            );
            expect(ctx.instanceById.get('full@2026-01-05')!.workingMinutes).to.equal(14 * H);
            // actualOnly without expectedActiveMinutes counts nothing.
            expect(ctx.instanceById.get('ao0@2026-01-05')!.workingMinutes).to.equal(0);
            // actualOnly can never exceed the elapsed span.
            expect(ctx.instanceById.get('aocap@2026-01-05')!.workingMinutes).to.equal(14 * H);
            expect(ctx.instanceById.get('zero@2026-01-05')!.workingMinutes).to.equal(0);
        });

        it('classifies night shifts with the default 180-minute threshold', function () {
            const ctx = buildModel(
                inputWith({
                    rules: { nightWork: { window: { from: '23:00', to: '06:00' } } },
                    shifts: [
                        shift('long', '22:00', '06:00', ['2026-01-05']),
                        shift('short', '22:00', '01:00', ['2026-01-05']),
                    ],
                }),
            );
            const long = ctx.instanceById.get('long@2026-01-05')!;
            expect(long.nightMinutes).to.equal(7 * H);
            expect(long.isNightShift).to.equal(true);
            const short = ctx.instanceById.get('short@2026-01-05')!;
            expect(short.nightMinutes).to.equal(2 * H);
            expect(short.isNightShift).to.equal(false);
        });

        it('blocks whole days, scoped instances, and skips out-of-period time off', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        {
                            id: 'e1',
                            tags: [],
                            timeOff: [
                                { date: '2026-01-06' },
                                { date: '2026-01-05', shiftInstanceId: 'd@2026-01-05' },
                                { date: '2026-01-01' },
                            ],
                        },
                    ],
                }),
            );
            expect(ctx.employeeBlockedIntervals.get('e1')).to.deep.equal([
                { start: DAY, end: 2 * DAY },
                { start: 8 * H, end: 16 * H },
            ]);
        });

        it('resolves external commitments with and without a time part', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        {
                            id: 'e1',
                            tags: [],
                            timeOff: [],
                            externalCommitments: [
                                { from: '2026-01-06T09:00', to: '2026-01-06T17:30' },
                                { from: '2026-01-07', to: '2026-01-07' },
                            ],
                        },
                    ],
                }),
            );
            expect(ctx.employeeBlockedIntervals.get('e1')).to.deep.equal([
                { start: DAY + 9 * H, end: DAY + 17 * H + 30 },
                // A bare-date span blocks from midnight to end of day.
                { start: 2 * DAY, end: 3 * DAY },
            ]);
        });

        it('merges absences into blocked intervals and tolerates unknown employees', function () {
            const ctx = buildModel(
                inputWith({
                    absences: [
                        { employeeId: 'e1', from: '2026-01-06', to: '2026-01-06', kind: 'sick' },
                        { employeeId: 'ghost', from: '2026-01-05', to: '2026-01-05' },
                    ],
                }),
            );
            expect(ctx.absences.get('e1')).to.deep.equal([{ start: DAY, end: 2 * DAY, kind: 'sick' }]);
            expect(ctx.absences.get('ghost')).to.have.length(1);
            expect(ctx.employeeBlockedIntervals.get('e1')).to.deep.equal([{ start: DAY, end: 2 * DAY }]);
        });

        it('parses publishedAt with and without a time part', function () {
            const roster = [rosterEntry('e1', 'd@2026-01-05')];
            const timed = buildModel(inputWith({ published: { roster, publishedAt: '2026-01-04T12:30' } }));
            expect(timed.publishedAtMinute).to.equal(-DAY + 12 * H + 30);
            expect(timed.publishedPairs.has('e1|d@2026-01-05')).to.equal(true);

            const bare = buildModel(inputWith({ published: { roster, publishedAt: '2026-01-05' } }));
            expect(bare.publishedAtMinute).to.equal(0);

            const none = buildModel(inputWith({}));
            expect(none.publishedAtMinute).to.equal(undefined);
            expect(none.publishedPairs.size).to.equal(0);
        });

        it('records pinned pairs', function () {
            const ctx = buildModel(inputWith({ pinned: [{ employeeId: 'e1', shiftInstanceId: 'd@2026-01-05' }] }));
            expect(ctx.pinned.has('e1|d@2026-01-05')).to.equal(true);
        });

        it('merges rules per family, override replacing the base family outright', function () {
            const base = { dailyRest: { minMinutes: 11 * H }, weeklyRest: { minMinutes: 35 * H, windowDays: 7 } };
            const override = { dailyRest: { minMinutes: 12 * H } };
            expect(mergeRules(undefined, undefined)).to.deep.equal({});
            expect(mergeRules(undefined, override)).to.deep.equal(override);
            expect(mergeRules(base, undefined)).to.equal(base);
            const merged = mergeRules(base, override);
            expect(merged.dailyRest!.minMinutes).to.equal(12 * H);
            expect(merged.weeklyRest!.minMinutes).to.equal(35 * H);
        });

        it('gives per-employee rules the merged view', function () {
            const ctx = buildModel(
                inputWith({
                    rules: { dailyRest: { minMinutes: 11 * H }, weeklyRest: { minMinutes: 35 * H, windowDays: 7 } },
                    employees: [{ id: 'e1', tags: [], timeOff: [], rules: { dailyRest: { minMinutes: 12 * H } } }],
                }),
            );
            const merged = ctx.rulesByEmployee.get('e1')!;
            expect(merged.dailyRest!.minMinutes).to.equal(12 * H);
            expect(merged.weeklyRest!.minMinutes).to.equal(35 * H);
        });

        it('resolves minRestMinutes precedence: options, then rules, then the EU default', function () {
            expect(
                buildModel(inputWith({ constraints: { minRestMinutes: 600 }, rules: { dailyRest: { minMinutes: 700 } } }))
                    .minRestMinutes,
            ).to.equal(600);
            expect(buildModel(inputWith({ rules: { dailyRest: { minMinutes: 700 } } })).minRestMinutes).to.equal(700);
            expect(buildModel(inputWith({})).minRestMinutes).to.equal(DEFAULT_MIN_REST_MINUTES);
        });

        it('applies constraint overrides and appends custom constraints', function () {
            const custom: SchedulingConstraint = { id: 'my-rule', hardness: 'soft', delta: () => 0, explain: () => null };
            const ctx = buildModel(
                inputWith({
                    constraints: {
                        overrides: {
                            'min-rest': { hardness: 'soft', weight: 9 },
                            'time-off': { hardness: 'soft' },
                            'not-a-rule': { weight: 1 },
                        },
                        custom: [custom],
                    },
                }),
            );
            const minRest = ctx.constraints.find((c) => c.id === 'min-rest')!;
            expect(minRest.hardness).to.equal('soft');
            expect(minRest.weight).to.equal(9);
            const timeOffRule = ctx.constraints.find((c) => c.id === 'time-off')!;
            expect(timeOffRule.hardness).to.equal('soft');
            expect(ctx.constraints[ctx.constraints.length - 1].id).to.equal('my-rule');
        });

        it('seeds history with overnight spans, working-minute overrides and person mapping', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [{ id: 'contract-a', personId: 'anna', tags: [], timeOff: [] }],
                    history: [
                        { employeeId: 'contract-a', date: '2026-01-04', startTime: '22:00', endTime: '06:00' },
                        {
                            employeeId: 'contract-a',
                            date: '2026-01-03',
                            startTime: '08:00',
                            endTime: '16:00',
                            workingMinutes: 100,
                            id: 'h2',
                            shiftTypeTag: 'day',
                        },
                        { employeeId: 'former', date: '2026-01-04', startTime: '08:00', endTime: '10:00' },
                    ],
                }),
            );
            const anna = ctx.history.get('anna')!;
            expect(anna).to.have.length(2);
            // Overnight history rolls its end into the next day: 04 Jan 22:00 .. 05 Jan 06:00.
            expect(anna[0]).to.deep.include({ id: 'history:0', start: -2 * H, end: 6 * H, workingMinutes: 8 * H });
            expect(anna[1]).to.deep.include({ id: 'h2', workingMinutes: 100, tag: 'day' });
            // History for someone not on the roster keys by the raw employee id.
            expect(ctx.history.get('former')).to.have.length(1);
        });

        it('availabilityApplies respects weekday and date bounds', function () {
            const ctx = buildModel(inputWith({}));
            const monday = ctx.instanceById.get('d@2026-01-05')!;
            expect(availabilityApplies({ kind: 'avoid', daysOfWeek: [2] }, monday)).to.equal(false);
            expect(availabilityApplies({ kind: 'avoid', daysOfWeek: [1] }, monday)).to.equal(true);
            expect(availabilityApplies({ kind: 'avoid', fromDate: '2026-01-06' }, monday)).to.equal(false);
            expect(availabilityApplies({ kind: 'avoid', toDate: '2026-01-04' }, monday)).to.equal(false);
            expect(availabilityApplies({ kind: 'avoid' }, monday)).to.equal(true);
        });
    });

    describe('engine state', function () {
        function twoDayCtx() {
            return buildModel(
                inputWith({
                    employees: [
                        { id: 'a', tags: [], timeOff: [] },
                        { id: 'b', tags: [], timeOff: [], personId: 'anna' },
                    ],
                    shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06'])],
                }),
            );
        }

        it('ignores assigns and unassigns for unknown instances', function () {
            const ctx = twoDayCtx();
            const state = createState(ctx);
            assign(state, 'a', 'nope@2026-01-05', []);
            expect(state.byEmployee.get('a')!.size).to.equal(0);
            expect(state.minutesByEmployee.get('a')).to.equal(0);
            unassign(state, 'a', 'nope@2026-01-05');
            expect(state.minutesByEmployee.get('a')).to.equal(0);
            expect(state.isAssigned('a', 'nope@2026-01-05')).to.equal(false);
        });

        it('keeps minutes, sets, reasons and timeline entries in step across assign/unassign', function () {
            const ctx = twoDayCtx();
            const state = createState(ctx);
            assign(state, 'a', 'd@2026-01-05', ['picked']);
            assign(state, 'a', 'd@2026-01-06', []);
            expect(state.minutesByEmployee.get('a')).to.equal(16 * H);
            expect(state.reasons.get(pairKey('a', 'd@2026-01-05'))).to.deep.equal(['picked']);
            expect(timelineEntryId('a', 'd@2026-01-05')).to.equal('a@@d@2026-01-05');
            expect(state.timelines.for('a').has('a@@d@2026-01-05')).to.equal(true);

            unassign(state, 'a', 'd@2026-01-05');
            expect(state.minutesByEmployee.get('a')).to.equal(8 * H);
            expect(state.assignments.get('d@2026-01-05')!.size).to.equal(0);
            expect(state.byEmployee.get('a')!.has('d@2026-01-05')).to.equal(false);
            expect(state.reasons.get(pairKey('a', 'd@2026-01-05'))).to.equal(undefined);
            expect(state.timelines.for('a').has('a@@d@2026-01-05')).to.equal(false);
            expect(state.timelines.for('a').has('a@@d@2026-01-06')).to.equal(true);
        });

        it('aggregates timeline entries on personId, not the employee record', function () {
            const ctx = twoDayCtx();
            const state = createState(ctx);
            assign(state, 'b', 'd@2026-01-05', []);
            expect(state.timelines.for('anna').has('b@@d@2026-01-05')).to.equal(true);
            expect(state.timelines.for('b').all()).to.have.length(0);
            unassign(state, 'b', 'd@2026-01-05');
            expect(state.timelines.for('anna').has('b@@d@2026-01-05')).to.equal(false);
        });

        it('treats employees unknown to the model as a no-op, never a partial write', function () {
            const ctx = twoDayCtx();
            const state = createState(ctx);
            assign(state, 'ghost', 'd@2026-01-05', []);
            // Nothing is booked anywhere: minutes for an unknown employee would
            // corrupt the fairness and cost sums.
            expect(state.assignments.get('d@2026-01-05')!.size).to.equal(0);
            expect(state.minutesByEmployee.has('ghost')).to.equal(false);
            expect(state.timelines.for('ghost').all()).to.have.length(0);
            // Unassigning an unknown employee is equally inert.
            unassign(state, 'ghost', 'd@2026-01-05');
            expect(state.minutesByEmployee.has('ghost')).to.equal(false);
            expect(state.minutesByEmployee.get('a')).to.equal(0);
        });

        it('snapshots assigned pairs in instance order with employees sorted', function () {
            const ctx = twoDayCtx();
            const state = createState(ctx);
            assign(state, 'b', 'd@2026-01-05', []);
            assign(state, 'a', 'd@2026-01-05', []);
            assign(state, 'a', 'd@2026-01-06', []);
            expect(assignedPairs(state)).to.deep.equal([
                { employeeId: 'a', instanceId: 'd@2026-01-05' },
                { employeeId: 'b', instanceId: 'd@2026-01-05' },
                { employeeId: 'a', instanceId: 'd@2026-01-06' },
            ]);
        });
    });

    describe('person timeline', function () {
        it('prorates partial overlaps of standby entries by working-minute fraction', function () {
            const t = new PersonTimeline();
            t.add(entry('s', 0, 100, 50));
            expect(t.workingMinutesIn({ start: 0, end: 50 })).to.equal(25);
            expect(t.workingMinutesIn({ start: 0, end: 100 })).to.equal(50);
            expect(t.workingMinutesIn({ start: 100, end: 200 })).to.equal(0);
            expect(t.workingMinutesIn({ start: 50, end: 50 })).to.equal(0);
            expect(new PersonTimeline().workingMinutesIn({ start: 0, end: 100 })).to.equal(0);
        });

        it('finds the worst window for working minutes on entry boundaries', function () {
            const t = new PersonTimeline();
            t.add(entry('a', 0, 120));
            t.add(entry('b', 180, 300));
            expect(t.maxWorkingMinutesInAnyWindow(300, { start: 0, end: 300 })).to.equal(240);
            expect(t.maxWorkingMinutesInAnyWindow(120, { start: 0, end: 300 })).to.equal(120);
            expect(t.maxWorkingMinutesInAnyWindow(0, { start: 0, end: 300 })).to.equal(0);
            expect(new PersonTimeline().maxWorkingMinutesInAnyWindow(300, { start: 0, end: 300 })).to.equal(0);
        });

        it('finds the worst window for longest rest', function () {
            const t = new PersonTimeline();
            t.add(entry('a', 0, 8 * H));
            expect(t.minLongestRestInAnyWindow(DAY, { start: 0, end: DAY })).to.equal(16 * H);
            // A zero-length window never reads as a breach.
            expect(t.minLongestRestInAnyWindow(0, { start: 0, end: DAY })).to.equal(Infinity);
            // An empty timeline rests for the whole window.
            expect(new PersonTimeline().minLongestRestInAnyWindow(DAY, { start: 0, end: DAY })).to.equal(DAY);
        });

        it('walks back over overlapping entries when scanning a window', function () {
            const t = new PersonTimeline();
            t.add(entry('a', 0, 300));
            t.add(entry('b', 200, 400));
            // The window starts after both entries start; both still overlap it.
            expect(t.workingMinutesIn({ start: 250, end: 350 })).to.equal(150);
        });

        it('counts and filters entries in a window', function () {
            const t = new PersonTimeline();
            t.add(entry('n1', 0, H, H, 'night'));
            t.add(entry('n2', DAY, DAY + H, H, 'night'));
            t.add(entry('d1', 2 * DAY, 2 * DAY + H, H, 'day'));
            expect(t.countIn({ start: 0, end: 3 * DAY })).to.equal(3);
            expect(t.countIn({ start: 0, end: 3 * DAY }, (e) => e.tag === 'night')).to.equal(2);
            expect(t.countIn({ start: 0, end: 100 })).to.equal(1);
            expect(t.entriesIn({ start: DAY, end: 2 * DAY }).map((e) => e.id)).to.deep.equal(['n2']);
        });

        it('measures runs and consecutive days', function () {
            const t = new PersonTimeline();
            t.add(entry('1', 0, 60, 60, 'n'));
            t.add(entry('2', 100, 160, 60, 'n'));
            t.add(entry('3', 200, 260, 60, 'd'));
            t.add(entry('4', 300, 360, 60, 'n'));
            expect(t.longestRun((e) => e.tag === 'n')).to.equal(2);

            const days = new PersonTimeline();
            for (const d of [0, 1, 2, 4]) days.add(entry(`d${d}`, d * DAY, d * DAY + 60));
            expect(days.longestConsecutiveDays((m) => Math.floor(m / DAY))).to.equal(3);
            expect(new PersonTimeline().longestConsecutiveDays((m) => Math.floor(m / DAY))).to.equal(0);
        });

        it('refuses to remove historical entries but counts them', function () {
            const t = new PersonTimeline([entry('h1', -10 * H, -2 * H)]);
            expect(t.remove('h1')).to.equal(false);
            expect(t.has('h1')).to.equal(true);
            t.add(entry('x', 0, H));
            expect(t.totalWorkingMinutes()).to.equal(9 * H);
            expect(t.remove('x')).to.equal(true);
            expect(t.remove('x')).to.equal(false);
        });

        it('withEntry is idempotent and restores the timeline', function () {
            const t = new PersonTimeline();
            const probe = entry('p', 0, H);
            const seen = t.withEntry(probe, (tl) => tl.has('p'));
            expect(seen).to.equal(true);
            expect(t.has('p')).to.equal(false);

            t.add(probe);
            expect(t.withEntry(probe, (tl) => tl.countIn({ start: 0, end: DAY }))).to.equal(1);
            // Already-present entries survive the call untouched.
            expect(t.has('p')).to.equal(true);
        });

        it('measures the smallest gap around a range', function () {
            const t = new PersonTimeline();
            t.add(entry('a', 0, 8 * H));
            t.add(entry('b', 16 * H, DAY));
            expect(t.minGapAround({ start: 8 * H + 20, end: 10 * H })).to.equal(20);
            expect(t.minGapAround({ start: 7 * H, end: 9 * H })).to.equal(0);
            expect(t.minGapAround({ start: 9 * H, end: 10 * H }, 'a')).to.equal(6 * H);
            expect(new PersonTimeline().minGapAround({ start: 0, end: 10 })).to.equal(Infinity);
        });

        it('lists rest gaps including window edges', function () {
            const t = new PersonTimeline();
            t.add(entry('a', 100, 200));
            t.add(entry('b', 300, 400));
            expect(t.restGapsIn({ start: 0, end: 500 })).to.deep.equal([100, 100, 100]);
            expect(t.restGapsIn({ start: 500, end: 500 })).to.deep.equal([]);
            expect(t.restGapsIn({ start: 450, end: 500 })).to.deep.equal([50]);
            expect(t.longestRestIn({ start: 500, end: 500 })).to.equal(0);
        });

        it('orders same-start entries by end and skips far entries when probing windows', function () {
            const t = new PersonTimeline([entry('h-long', 0, 100), entry('h-short', 0, 50)]);
            expect(t.all().map((e) => e.id)).to.deep.equal(['h-short', 'h-long']);

            // Entries far outside the bounds never contribute candidate windows.
            const probe = new PersonTimeline();
            probe.add(entry('far-past', -100_000, -99_000));
            probe.add(entry('near', 0, 120));
            probe.add(entry('far-future', 100_000, 101_000));
            expect(probe.maxWorkingMinutesInAnyWindow(300, { start: 0, end: 300 })).to.equal(120);
        });

        it('TimelineIndex creates timelines lazily and seeds history as immutable', function () {
            const idx = new TimelineIndex();
            expect(idx.remove('p', 'x')).to.equal(false);
            expect(idx.personIds()).to.deep.equal(['p']);
            expect(idx.for('p')).to.equal(idx.for('p'));

            const seeded = new TimelineIndex(new Map([['anna', [entry('h', -100, -40)]]]));
            expect(seeded.personIds()).to.deep.equal(['anna']);
            expect(seeded.for('anna').all()[0].historical).to.equal(true);
            expect(seeded.remove('anna', 'h')).to.equal(false);
        });
    });

    describe('objective scoring', function () {
        it('compares scores lexicographically', function () {
            expect(compareScores({ hard: 2, medium: 0, soft: 0 }, { hard: 1, medium: 99, soft: 99 })).to.be.greaterThan(0);
            expect(compareScores({ hard: 1, medium: 0, soft: 99 }, { hard: 1, medium: 1, soft: 0 })).to.be.lessThan(0);
            expect(compareScores({ hard: 1, medium: 1, soft: 2 }, { hard: 1, medium: 1, soft: 3 })).to.be.lessThan(0);
            expect(compareScores({ hard: 1, medium: 1, soft: 1 }, { hard: 1, medium: 1, soft: 1 })).to.equal(0);
            expect(isBetter({ hard: 0, medium: 0, soft: 1 }, { hard: 0, medium: 0, soft: 2 })).to.equal(true);
            expect(isBetter({ hard: 0, medium: 0, soft: 2 }, { hard: 0, medium: 0, soft: 2 })).to.equal(false);
        });

        it('returns zero shortage for unknown instances', function () {
            const ctx = buildModel(inputWith({}));
            const state = createState(ctx);
            expect(slotShortage(ctx, state, 'nope@2026-01-05')).to.equal(0);
            expect(tagShortage(ctx, state, 'nope@2026-01-05')).to.equal(0);
        });

        it('counts slot and tag shortages against assignments', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'nia', tags: ['nurse'], timeOff: [] },
                        { id: 'adam', tags: [], timeOff: [] },
                    ],
                    shifts: [
                        shift('c', '08:00', '16:00', ['2026-01-05'], { minEmployees: 2, tagRequirements: { nurse: 2 } }),
                    ],
                }),
            );
            const empty = createState(ctx);
            expect(slotShortage(ctx, empty, 'c@2026-01-05')).to.equal(2);
            expect(tagShortage(ctx, empty, 'c@2026-01-05')).to.equal(2);
            expect(unfilledSlots(ctx, empty)).to.equal(2);

            const staffed = stateWith(ctx, [
                ['nia', 'c@2026-01-05'],
                ['adam', 'c@2026-01-05'],
            ]);
            expect(slotShortage(ctx, staffed, 'c@2026-01-05')).to.equal(0);
            // Headcount met, but only one assignee carries the tag.
            expect(tagShortage(ctx, staffed, 'c@2026-01-05')).to.equal(1);
        });

        it('weighs custom constraints into breach totals per lexicographic level', function () {
            const customs: SchedulingConstraint[] = [
                { id: 'soft-w3', hardness: 'soft', weight: 3, delta: () => 2, explain: () => null },
                { id: 'soft-default', hardness: 'soft', delta: () => 4, explain: () => null },
                { id: 'medium-w2', hardness: 'medium', weight: 2, delta: () => 3, explain: () => null },
                { id: 'hard-w2', hardness: 'hard', weight: 2, delta: () => 5, explain: () => null },
            ];
            const ctx = buildModel(inputWith({ constraints: { custom: customs } }));
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            const totals = breachTotals(ctx, state);
            expect(totals).to.deep.equal({ hard: 10, medium: 6, soft: 10 });
            expect(softBreaches(ctx, state)).to.equal(10);
            // With no scorable constraints the totals stay zero.
            expect(breachTotals({ ...ctx, constraints: [] }, state)).to.deep.equal({ hard: 0, medium: 0, soft: 0 });
        });

        it('adds an hours-variance term only under the balanced objective', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'a', tags: [], timeOff: [] },
                        { id: 'b', tags: [], timeOff: [] },
                    ],
                }),
            );
            const state = stateWith(ctx, [['a', 'd@2026-01-05']]);
            expect(hoursVariance(ctx, state)).to.equal(57600); // mean 240, deviations ±240
            const standard = scoreLex(ctx, state, 'standard', 1);
            const balanced = scoreLex(ctx, state, 'balanced', 1);
            expect(balanced.hard).to.equal(standard.hard);
            expect(balanced.medium).to.equal(standard.medium);
            expect(balanced.soft - standard.soft).to.equal(960);
        });

        it('applies the min-hours weight with a default fallback', function () {
            const ctx = buildModel(
                inputWith({ employees: [{ id: 'a', tags: [], timeOff: [], minHoursForPeriod: 8 }], shifts: [] }),
            );
            const state = createState(ctx);
            expect(minHoursShortfalls(ctx, state)).to.equal(1);
            expect(scoreLex(ctx, state, 'standard', 7).soft).to.equal(7);
            // A zero weight falls back to the default, so the shortfall is never free.
            expect(scoreLex(ctx, state, 'standard', 0).soft).to.equal(MIN_HOURS_WEIGHT);
        });

        it('clears the min-hours shortfall once the bound is met', function () {
            const ctx = buildModel(inputWith({ employees: [{ id: 'e1', tags: [], timeOff: [], minHoursForPeriod: 8 }] }));
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            expect(minHoursShortfalls(ctx, state)).to.equal(0);
        });

        it('adds fairness penalty from explicit rules or the model rules', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'a', tags: [], timeOff: [] },
                        { id: 'b', tags: [], timeOff: [] },
                    ],
                }),
            );
            const state = stateWith(ctx, [['a', 'd@2026-01-05']]);
            // One shift split over two people: each deviates 0.5 from the fair share.
            expect(scoreLex(ctx, state, 'standard', 1, [{ dimension: 'shifts', weight: 2 }]).soft).to.equal(2);
            expect(scoreLex(ctx, state, 'standard', 1).soft).to.equal(0);

            const withRules = buildModel(
                inputWith({
                    employees: [
                        { id: 'a', tags: [], timeOff: [] },
                        { id: 'b', tags: [], timeOff: [] },
                    ],
                    rules: { fairness: [{ dimension: 'shifts' }] },
                }),
            );
            const state2 = stateWith(withRules, [['a', 'd@2026-01-05']]);
            expect(scoreLex(withRules, state2, 'standard', 1).soft).to.equal(1);
        });

        it('scores coverage shortfalls at the medium level', function () {
            const ctx = buildModel(
                inputWith({ shifts: [shift('c', '08:00', '16:00', ['2026-01-05'], { tagRequirements: { nurse: 1 } })] }),
            );
            const lex = scoreLex(ctx, createState(ctx), 'standard', 1);
            expect(lex.medium).to.equal(UNFILLED_WEIGHT + TAG_SHORTFALL_WEIGHT);
            expect(lex.hard).to.equal(0);
        });

        it('flattens the lexicographic score with level scaling', function () {
            const ctx = buildModel(inputWith({ employees: [{ id: 'a', tags: [], timeOff: [], minHoursForPeriod: 1 }] }));
            const state = createState(ctx);
            // medium: one unfilled slot (10000 × 1e6); soft: one min-hours shortfall × 3.
            expect(score(ctx, state, 'standard', 3)).to.equal(UNFILLED_WEIGHT * 1e6 + 3);
        });

        it('reports zero variance for an empty team', function () {
            const ctx = buildModel(inputWith({ employees: [], shifts: [] }));
            expect(hoursVariance(ctx, createState(ctx))).to.equal(0);
        });
    });

    describe('greedy construction', function () {
        it('orders instances most-constrained-first with a start-time tiebreak', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'a', tags: [], timeOff: [] },
                        { id: 'b', tags: [], timeOff: [{ date: '2026-01-05' }] },
                    ],
                    shifts: [
                        shift('s1', '08:00', '16:00', ['2026-01-05']),
                        shift('s2', '10:00', '11:00', ['2026-01-06']),
                        shift('s3', '08:00', '09:00', ['2026-01-06']),
                    ],
                }),
            );
            const order = constructionOrder(ctx, propagate(ctx));
            expect(order).to.deep.equal(['s1@2026-01-05', 's3@2026-01-06', 's2@2026-01-06']);
        });

        it('prefers candidates that close tag requirements and records reasons', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'adam', tags: [], timeOff: [] },
                        { id: 'nia', tags: ['nurse'], timeOff: [] },
                    ],
                    shifts: [shift('c', '08:00', '16:00', ['2026-01-05'], { tagRequirements: { nurse: 1 } })],
                }),
            );
            const state = createState(ctx);
            greedyFill(ctx, state, propagate(ctx), 'standard', () => 0);
            expect([...state.assignments.get('c@2026-01-05')!]).to.deep.equal(['nia']);
            expect(state.reasons.get(pairKey('nia', 'c@2026-01-05'))).to.deep.equal([
                'fills tag requirement "nurse"',
                'eligible under all constraints',
            ]);
        });

        it('spreads shifts to less-loaded employees under the balanced objective', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'a', tags: [], timeOff: [] },
                        { id: 'b', tags: [], timeOff: [] },
                    ],
                    shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06'])],
                }),
            );
            const state = createState(ctx);
            greedyFill(ctx, state, propagate(ctx), 'balanced', () => 0);
            expect([...state.assignments.get('d@2026-01-05')!]).to.deep.equal(['a']);
            expect([...state.assignments.get('d@2026-01-06')!]).to.deep.equal(['b']);
            expect(state.reasons.get(pairKey('b', 'd@2026-01-06'))).to.deep.equal(['selected to balance hours']);
        });

        it('skips filled, zero-minimum and hard-blocked instances', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [{ id: 'a', tags: [], timeOff: [] }],
                    shifts: [
                        shift('p', '08:00', '16:00', ['2026-01-05']),
                        shift('z', '09:00', '10:00', ['2026-01-06'], { minEmployees: 0 }),
                        shift('o1', '08:00', '16:00', ['2026-01-07']),
                        shift('o2', '12:00', '20:00', ['2026-01-07']),
                    ],
                }),
            );
            const state = createState(ctx);
            assign(state, 'a', 'p@2026-01-05', ['pre-placed']);
            greedyFill(ctx, state, propagate(ctx), 'standard', () => 0);
            // Pre-placed demand stays as it was; zero-minimum shifts get nobody.
            expect(state.assignments.get('p@2026-01-05')!.size).to.equal(1);
            expect(state.assignments.get('z@2026-01-06')!.size).to.equal(0);
            // The overlapping pair yields exactly one assignment.
            expect([...state.assignments.get('o1@2026-01-07')!]).to.deep.equal(['a']);
            expect(state.assignments.get('o2@2026-01-07')!.size).to.equal(0);
            expect(hardCompliant(ctx, state, 'a', 'o2@2026-01-07')).to.equal(false);
        });

        it('breaks rank ties by employee id regardless of declaration order', function () {
            const ctx = buildModel(
                inputWith({
                    employees: [
                        { id: 'zoe', tags: [], timeOff: [] },
                        { id: 'amy', tags: [], timeOff: [] },
                    ],
                }),
            );
            const state = createState(ctx);
            greedyFill(ctx, state, propagate(ctx), 'standard', () => 0);
            expect([...state.assignments.get('d@2026-01-05')!]).to.deep.equal(['amy']);
        });

        it('fills only the requested instances and ignores unknown ids', function () {
            const ctx = buildModel(inputWith({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06'])] }));
            const state = createState(ctx);
            greedyFill(ctx, state, propagate(ctx), 'standard', () => 0, ['nope@2026-01-05', 'd@2026-01-06']);
            expect(state.assignments.get('d@2026-01-05')!.size).to.equal(0);
            expect([...state.assignments.get('d@2026-01-06')!]).to.deep.equal(['e1']);
        });

        it('keeps pinned pairs and skips unknown pinned references in a solve', function () {
            const base = inputWith({
                employees: [
                    { id: 'a', tags: [], timeOff: [] },
                    { id: 'b', tags: [], timeOff: [] },
                ],
                timeBudgetMs: 0,
            });
            const pinnedResult = solveSchedule({ ...base, pinned: [{ employeeId: 'a', shiftInstanceId: 'd@2026-01-05' }] });
            expect(pinnedResult.assignments).to.have.length(1);
            expect(pinnedResult.assignments[0].employeeId).to.equal('a');
            expect(pinnedResult.assignments[0].reasons[0]).to.equal('pinned by the caller');

            const ghostResult = solveSchedule({
                ...base,
                pinned: [{ employeeId: 'ghost', shiftInstanceId: 'd@2026-01-05' }],
            });
            expect(ghostResult.assignments).to.have.length(1);
            expect(ghostResult.assignments[0].employeeId).to.not.equal('ghost');
        });
    });

    describe('operational APIs', function () {
        function opsInput(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
            return {
                period: WEEK,
                employees: [
                    { id: 'anna', tags: [], timeOff: [] },
                    { id: 'bo', tags: [], timeOff: [] },
                ],
                shifts: [shift('day', '08:00', '16:00', ['2026-01-05', '2026-01-06'])],
                timeBudgetMs: 0,
                ...overrides,
            };
        }

        it('explainCandidate skips roster entries with unknown ids', function () {
            const verdicts = explainCandidate(opsInput(), 'anna', 'day@2026-01-05', [
                rosterEntry('ghost', 'day@2026-01-05'),
                rosterEntry('anna', 'nope@2026-01-05'),
            ]);
            expect(verdicts.length).to.be.greaterThan(0);
            expect(verdicts.find((v) => v.ruleId === 'no-overlap')!.pass).to.equal(true);
        });

        it('rankCandidates returns empty for an unknown shift instance', function () {
            expect(rankCandidates(opsInput(), 'nope@2026-01-05', [])).to.deep.equal([]);
        });

        it('rankCandidates skips ghost roster entries and already-assigned employees', function () {
            const candidates = rankCandidates(opsInput(), 'day@2026-01-05', [
                rosterEntry('ghost', 'day@2026-01-05'),
                rosterEntry('anna', 'nope@2026-01-05'),
                rosterEntry('bo', 'day@2026-01-05'),
            ]);
            expect(candidates.map((c) => c.employeeId)).to.deep.equal(['anna']);
        });

        it('rankCandidates excludes the disrupted employee', function () {
            const candidates = rankCandidates(opsInput(), 'day@2026-01-05', [], {
                kind: 'noShow',
                employeeId: 'anna',
                shiftInstanceId: 'day@2026-01-05',
            });
            expect(candidates.map((c) => c.employeeId)).to.deep.equal(['bo']);
        });

        it('returns no candidates for an empty team', function () {
            expect(rankCandidates(opsInput({ employees: [] }), 'day@2026-01-05', [])).to.deep.equal([]);
        });

        it('rankCandidates breaks ties by employee id regardless of declaration order', function () {
            const candidates = rankCandidates(
                opsInput({
                    employees: [
                        { id: 'zoe', tags: [], timeOff: [] },
                        { id: 'amy', tags: [], timeOff: [] },
                    ],
                }),
                'day@2026-01-05',
                [],
            );
            expect(candidates.map((c) => c.employeeId)).to.deep.equal(['amy', 'zoe']);
        });

        it('falls back to a plain "not eligible" when no verdict names the blocker', function () {
            // A constraint whose verdict always passes but whose delta hard-blocks:
            // the candidate is ineligible with an empty blocker list.
            const gate: SchedulingConstraint = {
                id: 'silent-gate',
                hardness: 'hard',
                delta: () => 1,
                explain: () => null,
                verdict: () => ({ ruleId: 'silent-gate', pass: true, severity: 'soft', message: 'ok' }),
            };
            const candidates = rankCandidates(opsInput({ constraints: { custom: [gate] } }), 'day@2026-01-05', []);
            expect(candidates[0].eligible).to.equal(false);
            expect(candidates[0].blockers).to.deep.equal([]);
            expect(candidates[0].rationale).to.equal('not eligible');
            expect(candidates[0].rank).to.equal(Number.MAX_SAFE_INTEGER);
        });

        it('checkCompliance accepts roster entries missing the reasons field', function () {
            const bare = {
                employeeId: 'anna',
                shiftInstanceId: 'day@2026-01-05',
                date: '2026-01-05',
            } as ScheduledAssignment;
            const report = checkCompliance(opsInput(), [bare]);
            expect(report.compliant).to.equal(true);
            expect(report.verdicts).to.have.length(1);
        });

        it('reflects stated preferences in rank and rationale', function () {
            const preferring = rankCandidates(
                opsInput({
                    employees: [
                        { id: 'keen', tags: [], timeOff: [], availability: [{ kind: 'preferred', daysOfWeek: [1] }] },
                        { id: 'plain', tags: [], timeOff: [] },
                    ],
                }),
                'day@2026-01-05',
                [],
            );
            expect(preferring[0].employeeId).to.equal('keen');
            expect(preferring[0].rationale).to.contain('prefers this window');
            expect(preferring[1].rationale).to.equal('€0.00 marginal cost');

            const avoiding = rankCandidates(
                opsInput({
                    employees: [
                        { id: 'plain', tags: [], timeOff: [] },
                        { id: 'reluctant', tags: [], timeOff: [], availability: [{ kind: 'avoid', daysOfWeek: [1] }] },
                    ],
                }),
                'day@2026-01-05',
                [],
            );
            expect(avoiding[0].employeeId).to.equal('plain');
            expect(avoiding[1].rationale).to.contain('would rather avoid this window');
        });

        it('reports fairness debt for the person owed extra work', function () {
            const input = opsInput({
                shifts: [shift('day', '08:00', '16:00', ['2026-01-05', '2026-01-06', '2026-01-08'])],
            });
            const roster = [rosterEntry('anna', 'day@2026-01-05'), rosterEntry('anna', 'day@2026-01-06')];
            const candidates = rankCandidates(input, 'day@2026-01-08', roster);
            expect(candidates[0].employeeId).to.equal('bo');
            expect(candidates[0].fairnessDebt).to.equal(1);
            expect(candidates[0].rationale).to.contain('fewer extra shifts than average');
            expect(candidates.find((c) => c.employeeId === 'anna')!.fairnessDebt).to.equal(-1);
        });

        it('repairs an absence bounded by its end date', function () {
            const input = opsInput({ employees: [{ id: 'anna', tags: [], timeOff: [] }] });
            const published = [rosterEntry('anna', 'day@2026-01-05'), rosterEntry('anna', 'day@2026-01-06')];
            const result = repairSchedule(
                input,
                { kind: 'absence', employeeId: 'anna', from: '2026-01-05', to: '2026-01-05' },
                published,
            );
            // The bounded absence frees day two, so the re-solve hands it back.
            expect(result.diff.removed).to.deep.equal([{ employeeId: 'anna', shiftInstanceId: 'day@2026-01-05' }]);
            expect(result.diff.added).to.deep.equal([]);
            // The absent person never appears among their own replacements.
            expect(result.candidates).to.deep.equal([]);
            expect(
                result.violationsIntroduced.some(
                    (v) => v.constraintId === 'min-staffing' && v.shiftInstanceId === 'day@2026-01-05',
                ),
            ).to.equal(true);
            expect(result.perturbation).to.deep.equal({ changedAssignments: 1, affectedEmployees: 1 });
        });

        it('repairs an open-ended absence through the period end', function () {
            const input = opsInput({ employees: [{ id: 'anna', tags: [], timeOff: [] }] });
            const published = [rosterEntry('anna', 'day@2026-01-05'), rosterEntry('anna', 'day@2026-01-06')];
            const result = repairSchedule(input, { kind: 'absence', employeeId: 'anna', from: '2026-01-05' }, published);
            expect(result.diff.removed.map((p) => p.shiftInstanceId).sort()).to.deep.equal([
                'day@2026-01-05',
                'day@2026-01-06',
            ]);
            expect(result.perturbation.changedAssignments).to.equal(2);
        });

        it('cancels one occurrence of a daysOfWeek template without touching the rest', function () {
            const input = opsInput({
                employees: [{ id: 'anna', tags: [], timeOff: [] }],
                shifts: [{ id: 'w', name: 'W', startTime: '08:00', endTime: '16:00', daysOfWeek: [1, 2] }],
            });
            const published = [rosterEntry('anna', 'w@2026-01-05'), rosterEntry('anna', 'w@2026-01-06')];
            const result = repairSchedule(input, { kind: 'cancelShift', shiftInstanceId: 'w@2026-01-05' }, published);
            expect(result.diff.removed).to.deep.equal([{ employeeId: 'anna', shiftInstanceId: 'w@2026-01-05' }]);
            expect(result.diff.added).to.deep.equal([]);
            // Cancelling removes demand, so there is nothing to call anyone for.
            expect(result.candidates).to.deep.equal([]);
        });

        it('cancelling the only occurrence removes the template entirely', function () {
            const input = opsInput({
                employees: [{ id: 'anna', tags: [], timeOff: [] }],
                shifts: [shift('solo', '08:00', '16:00', ['2026-01-05']), shift('other', '08:00', '16:00', ['2026-01-06'])],
            });
            const published = [rosterEntry('anna', 'solo@2026-01-05'), rosterEntry('anna', 'other@2026-01-06')];
            const result = repairSchedule(input, { kind: 'cancelShift', shiftInstanceId: 'solo@2026-01-05' }, published);
            expect(result.diff.removed).to.deep.equal([{ employeeId: 'anna', shiftInstanceId: 'solo@2026-01-05' }]);
            expect(result.diff.added).to.deep.equal([]);
            expect(result.violationsIntroduced).to.deep.equal([]);
        });

        it('cancelling an unknown instance leaves the roster untouched', function () {
            const input = opsInput({ employees: [{ id: 'anna', tags: [], timeOff: [] }] });
            const published = [rosterEntry('anna', 'day@2026-01-05'), rosterEntry('anna', 'day@2026-01-06')];
            const result = repairSchedule(input, { kind: 'cancelShift', shiftInstanceId: 'nope@2026-01-05' }, published);
            expect(result.diff).to.deep.equal({ added: [], removed: [] });
            expect(result.perturbation).to.deep.equal({ changedAssignments: 0, affectedEmployees: 0 });
        });

        it('diagnoses per-shift capacity shortfalls', function () {
            const report = diagnoseInfeasibility(
                opsInput({ shifts: [shift('big', '08:00', '16:00', ['2026-01-05'], { minEmployees: 3 })] }),
            );
            expect(report.feasible).to.equal(false);
            expect(report.findings).to.deep.equal([
                {
                    kind: 'insufficientCapacity',
                    shiftInstanceId: 'big@2026-01-05',
                    shortfall: 1,
                    message: '"big@2026-01-05" needs 3 employees but only 2 are eligible',
                },
            ]);
        });

        it('ignores unstaffable shifts whose minimum is zero', function () {
            const report = diagnoseInfeasibility(
                opsInput({
                    employees: [{ id: 'anna', tags: [], timeOff: [{ date: '2026-01-05' }] }],
                    shifts: [shift('z', '08:00', '16:00', ['2026-01-05'], { minEmployees: 0 })],
                }),
            );
            expect(report.feasible).to.equal(true);
            expect(report.findings).to.deep.equal([]);
        });

        it('diagnoses tag demand from requiredTags and accepts supplied tags', function () {
            const missing = diagnoseInfeasibility(
                opsInput({
                    employees: [{ id: 'anna', tags: [], timeOff: [] }],
                    shifts: [shift('icu', '08:00', '16:00', ['2026-01-05'], { requiredTags: ['icu'] })],
                }),
            );
            expect(missing.findings.some((f) => f.kind === 'tagCapacity' && f.tag === 'icu' && f.shortfall === 1)).to.equal(
                true,
            );

            const supplied = diagnoseInfeasibility(
                opsInput({
                    employees: [{ id: 'anna', tags: ['icu'], timeOff: [] }],
                    shifts: [shift('icu', '08:00', '16:00', ['2026-01-05'], { requiredTags: ['icu'] })],
                }),
            );
            expect(supplied.findings.every((f) => f.kind !== 'tagCapacity')).to.equal(true);
        });
    });
});
