import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import type { ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * Each rule is exercised with at least two member states' parameters. That is
 * the point of the design: the engine ships shapes, the caller ships numbers,
 * so a rule that only works for one country's values has leaked country logic.
 */

const H = 60;
const PERIOD = { startDate: '2026-01-05', endDate: '2026-02-01' }; // Mon 5 Jan, 4 weeks

function ctxFor(input: Partial<ScheduleInput> & { rules?: WorkingTimeRules }): ModelContext {
    return buildModel({
        period: input.period ?? PERIOD,
        employees: input.employees ?? [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: input.shifts ?? [],
        rules: input.rules,
        history: input.history,
        calendar: input.calendar,
        absences: input.absences,
        constraints: input.constraints,
        published: input.published,
    });
}

function constraint(ctx: ModelContext, id: string) {
    const c = ctx.constraints.find((x) => x.id === id);
    expect(c, `constraint ${id} registered`).to.exist;
    return c!;
}

/** A daily shift template on explicit dates. */
function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

/** Assign a set of (employee, instance) pairs onto a fresh state. */
function stateWith(ctx: ModelContext, pairs: Array<[string, string]>) {
    const state = createState(ctx);
    for (const [employeeId, instanceId] of pairs) assign(state, employeeId, instanceId, []);
    return state;
}

describe('EU working-time rules', function () {
    describe('daily-rest', function () {
        const nights = (dates: string[]) => shift('n', '22:00', '06:00', dates);
        const morning = (dates: string[]) => shift('m', '08:00', '16:00', dates);

        it('applies the EU 11h floor', function () {
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                shifts: [nights(['2026-01-05']), morning(['2026-01-06'])],
            });
            const state = stateWith(ctx, [['e1', 'n@2026-01-05']]);
            // Night ends 06:00, morning starts 08:00 — 2h rest.
            const v = constraint(ctx, 'daily-rest').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'm@2026-01-06' });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(2 * H);
            expect(v.required).to.equal(11 * H);
            expect(v.citation).to.contain('Art 3');
        });

        it('applies the Spanish/Romanian 12h floor to the same roster', function () {
            const evening = shift('e', '18:00', '22:00', ['2026-01-06']);
            const day = shift('d', '08:00', '16:00', ['2026-01-05']);
            const ctx11 = ctxFor({ rules: { dailyRest: { minMinutes: 11 * H } }, shifts: [day, evening] });
            const ctx12 = ctxFor({ rules: { dailyRest: { minMinutes: 12 * H } }, shifts: [day, evening] });

            // 16:00 to 18:00 next day is 26h — fine either way. Use a tighter pair.
            const tight = [shift('d', '08:00', '16:00', ['2026-01-05']), shift('early', '03:30', '11:00', ['2026-01-06'])];
            const c11 = ctxFor({ rules: { dailyRest: { minMinutes: 11 * H } }, shifts: tight });
            const c12 = ctxFor({ rules: { dailyRest: { minMinutes: 12 * H } }, shifts: tight });

            // 16:00 -> 03:30 is 11.5h: legal at 11h, illegal at 12h.
            const pair = { employeeId: 'e1', shiftInstanceId: 'early@2026-01-06' };
            expect(constraint(c11, 'daily-rest').verdict!(stateWith(c11, [['e1', 'd@2026-01-05']]), pair).pass).to.equal(
                true,
            );
            expect(constraint(c12, 'daily-rest').verdict!(stateWith(c12, [['e1', 'd@2026-01-05']]), pair).pass).to.equal(
                false,
            );
            expect(ctx11.constraints.length).to.equal(ctx12.constraints.length);
        });

        it('permits a reduced rest within the allowance and refuses beyond it', function () {
            const rules: WorkingTimeRules = {
                dailyRest: {
                    minMinutes: 11 * H,
                    reducibleToMinutes: 8 * H,
                    reductionsPer: { max: 1, windowDays: 7 },
                },
            };
            // Two short turnarounds in the same week.
            const shifts = [
                shift('a', '08:00', '16:00', ['2026-01-05', '2026-01-07']),
                shift('b', '01:00', '07:00', ['2026-01-06', '2026-01-08']),
            ];
            const ctx = ctxFor({ rules, shifts });
            const c = constraint(ctx, 'daily-rest');

            // First reduction: 16:00 -> 01:00 is 9h, inside the 8h floor, allowance 1.
            const first = stateWith(ctx, [['e1', 'a@2026-01-05']]);
            expect(c.verdict!(first, { employeeId: 'e1', shiftInstanceId: 'b@2026-01-06' }).pass).to.equal(true);

            // Second reduction in the same window exceeds the allowance.
            const second = stateWith(ctx, [
                ['e1', 'a@2026-01-05'],
                ['e1', 'b@2026-01-06'],
                ['e1', 'a@2026-01-07'],
            ]);
            const v = c.verdict!(second, { employeeId: 'e1', shiftInstanceId: 'b@2026-01-08' });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('more than 1 time');
        });

        it('enforces the Swedish rule that the rest must contain 00:00-05:00', function () {
            const rules: WorkingTimeRules = {
                dailyRest: { minMinutes: 11 * H, mustContainClockRange: { from: '00:00', to: '05:00' } },
            };
            // A 20:00-02:00 shift leaves 11h of rest but eats into the protected band.
            const ctx = ctxFor({ rules, shifts: [shift('late', '20:00', '02:00', ['2026-01-06'])] });
            const state = createState(ctx);
            const v = constraint(ctx, 'daily-rest').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'late@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('00:00-05:00');
        });

        it('requires the rest to fit in every rolling 24h, not merely between shifts', function () {
            // A 14h duty leaves comfortable gaps either side, but no 24h window
            // containing it can yield 11h of continuous rest.
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                shifts: [shift('long', '06:00', '20:00', ['2026-01-06'])],
            });
            const v = constraint(ctx, 'daily-rest').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'long@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(10 * H);
        });

        it('accepts an ordinary shift under the same rolling check', function () {
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
            });
            expect(
                constraint(ctx, 'daily-rest').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'd@2026-01-06',
                }).pass,
            ).to.equal(true);
        });

        it('sees across the period boundary via history', function () {
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                shifts: [shift('m', '08:00', '16:00', ['2026-01-05'])],
                history: [{ employeeId: 'e1', date: '2026-01-04', startTime: '22:00', endTime: '06:00' }],
            });
            const v = constraint(ctx, 'daily-rest').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'm@2026-01-05',
            });
            // Without history this looks like a free day; with it, 2h of rest.
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(2 * H);
        });
    });

    describe('weekly-rest', function () {
        // Six 8h days leaves a 7th day free — 35h+ of continuous rest.
        const week = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10'];

        it('accepts a roster leaving a clear 35h break (FR/PL/PT)', function () {
            const ctx = ctxFor({
                rules: { weeklyRest: { minMinutes: 35 * H, windowDays: 7 } },
                shifts: [shift('d', '08:00', '16:00', week)],
            });
            const state = stateWith(
                ctx,
                week.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'weekly-rest').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-10' });
            expect(v.pass).to.equal(true);
        });

        it('rejects the same roster under the Romanian/Estonian 48h floor', function () {
            const dense = [
                '2026-01-05',
                '2026-01-06',
                '2026-01-07',
                '2026-01-08',
                '2026-01-09',
                '2026-01-10',
                '2026-01-11',
            ];
            const ctx = ctxFor({
                rules: { weeklyRest: { minMinutes: 48 * H, windowDays: 7 } },
                shifts: [shift('d', '08:00', '16:00', dense)],
            });
            const state = stateWith(
                ctx,
                dense.slice(0, 6).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'weekly-rest').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-11' });
            expect(v.pass).to.equal(false);
            expect(v.required).to.equal(48 * H);
        });

        it('enforces an Estonian two-level floor plus average', function () {
            const rules: WorkingTimeRules = {
                weeklyRest: { minMinutes: 48 * H, windowDays: 7, absoluteFloorMinutes: 36 * H, averageOverDays: 28 },
            };
            const ctx = ctxFor({ rules, shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            const c = constraint(ctx, 'weekly-rest');
            // A near-empty roster satisfies both levels.
            expect(c.verdict!(createState(ctx), { employeeId: 'e1', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
        });
    });

    describe('rolling-hours', function () {
        const everyDay = Array.from({ length: 14 }, (_, i) => `2026-01-${String(5 + i).padStart(2, '0')}`);

        it('catches a 48h/7-day breach that no calendar week would show', function () {
            // 7 consecutive 10h days = 70h in a rolling week.
            const ctx = ctxFor({
                rules: { workingTime: { rollingAverages: [{ maxMinutes: 48 * H, windowDays: 7, label: '48h/week' }] } },
                shifts: [shift('long', '08:00', '18:00', everyDay)],
            });
            const assigned = everyDay.slice(0, 6).map((d) => ['e1', `long@${d}`] as [string, string]);
            const v = constraint(ctx, 'rolling-hours').verdict!(stateWith(ctx, assigned), {
                employeeId: 'e1',
                shiftInstanceId: `long@${everyDay[6]}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('48h/week');
        });

        it('applies the Dutch stacked averages (55h/4wk with 48h/16wk)', function () {
            const rules: WorkingTimeRules = {
                workingTime: {
                    rollingAverages: [
                        { maxMinutes: 55 * H * 4, windowDays: 28, label: 'NL 55h/4wk' },
                        { maxMinutes: 48 * H * 16, windowDays: 112, label: 'NL 48h/16wk' },
                    ],
                },
            };
            const ctx = ctxFor({ rules, shifts: [shift('d', '08:00', '16:00', everyDay)] });
            const v = constraint(ctx, 'rolling-hours').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(true);
        });

        it('enforces the German 10h daily cap', function () {
            const ctx = ctxFor({
                rules: { workingTime: { maxPerDayMinutes: 10 * H } },
                shifts: [shift('vlong', '06:00', '20:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'rolling-hours').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'vlong@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(14 * H);
        });

        it('counts working time net of unpaid breaks', function () {
            // 9h span with a 45-minute unpaid break is 8h15 of working time.
            const ctx = ctxFor({
                rules: { workingTime: { maxPerShiftMinutes: 8 * H + 30 } },
                shifts: [shift('d', '08:00', '17:00', ['2026-01-05'], { unpaidBreakMinutes: 45 })],
            });
            const inst = ctx.instanceById.get('d@2026-01-05')!;
            expect(inst.durationMinutes).to.equal(9 * H);
            expect(inst.workingMinutes).to.equal(8 * H + 15);
            const v = constraint(ctx, 'rolling-hours').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(true);
        });

        it('neutralises sick leave in the rolling average (Art 16(b))', function () {
            const rules: WorkingTimeRules = {
                workingTime: {
                    rollingAverages: [{ maxMinutes: 48 * H, windowDays: 7 }],
                    neutraliseAbsenceKinds: ['sick'],
                },
            };
            const withAbsence = ctxFor({
                rules,
                shifts: [shift('d', '08:00', '16:00', everyDay)],
                absences: [{ employeeId: 'e1', from: '2026-01-05', to: '2026-01-07', kind: 'sick' }],
            });
            // The allowance shrinks with the neutralised days rather than the
            // absence buying extra hours later in the window.
            const v = constraint(withAbsence, 'rolling-hours').verdict!(createState(withAbsence), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-08',
            });
            expect(v.pass).to.equal(true);
        });
    });

    describe('night-work', function () {
        const nightBand = { from: '23:00', to: '06:00' }; // DE/FI
        const beBand = { from: '20:00', to: '06:00' }; // BE

        it('classifies a night shift under the German band', function () {
            const ctx = ctxFor({
                rules: { nightWork: { window: nightBand, qualifiesAfterMinutes: 2 * H } },
                shifts: [shift('n', '22:00', '06:00', ['2026-01-05'])],
            });
            const inst = ctx.instanceById.get('n@2026-01-05')!;
            expect(inst.nightMinutes).to.equal(7 * H);
            expect(inst.isNightShift).to.equal(true);
        });

        it('classifies differently under the Belgian band, same shift', function () {
            const ctx = ctxFor({
                rules: { nightWork: { window: beBand, qualifiesAfterMinutes: 3 * H } },
                shifts: [shift('e', '18:00', '22:00', ['2026-01-05'])],
            });
            // 20:00-22:00 is 2h of night under BE, below the 3h threshold.
            const inst = ctx.instanceById.get('e@2026-01-05')!;
            expect(inst.nightMinutes).to.equal(2 * H);
            expect(inst.isNightShift).to.equal(false);
        });

        it('caps a night shift at 8h', function () {
            const ctx = ctxFor({
                rules: { nightWork: { window: nightBand, maxShiftMinutes: 8 * H } },
                shifts: [shift('n', '21:00', '07:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'night-work').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'n@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(10 * H);
        });

        it('bars the adolescent 00:00-04:00 window outright (94/33/EC)', function () {
            const ctx = ctxFor({
                rules: {
                    nightWork: { window: nightBand, prohibitedRanges: [{ from: '00:00', to: '04:00' }] },
                },
                shifts: [shift('n', '22:00', '02:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'night-work').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'n@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('00:00-04:00');
        });

        it('applies the Dutch volume quota only to shifts ending after 02:00', function () {
            const dates = Array.from({ length: 6 }, (_, i) => `2026-01-${String(5 + i * 2).padStart(2, '0')}`);
            const ctx = ctxFor({
                rules: {
                    nightWork: {
                        window: { from: '00:00', to: '06:00' },
                        qualifiesAfterMinutes: H,
                        volumeQuotas: [{ max: 2, windowDays: 28, endingAfter: '02:00', label: 'NL quota' }],
                    },
                },
                shifts: [shift('n', '22:00', '05:00', dates)],
            });
            const assigned = dates.slice(0, 3).map((d) => ['e1', `n@${d}`] as [string, string]);
            const v = constraint(ctx, 'night-work').verdict!(stateWith(ctx, assigned), {
                employeeId: 'e1',
                shiftInstanceId: `n@${dates[3]}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('NL quota');
        });

        it('turns the 8h average into an absolute cap for hazardous night work (Art 8(b))', function () {
            const rules: WorkingTimeRules = {
                nightWork: { window: nightBand, maxShiftMinutes: 8 * H, averageWindowDays: 28 },
            };
            const shifts = [shift('n', '22:00', '06:00', ['2026-01-05']), shift('n2', '10:00', '14:00', ['2026-01-06'])];
            const hazardous = ctxFor({
                rules,
                shifts,
                employees: [{ id: 'e1', tags: [], timeOff: [], protections: [{ kind: 'hazardousNight' }] }],
            });
            // 8h night plus 4h the same rolling 24h breaches the absolute cap,
            // while the 28-day average would still be comfortable.
            const state = stateWith(hazardous, [['e1', 'n@2026-01-05']]);
            const v = constraint(hazardous, 'night-work').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'n2@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.citation).to.contain('Art 8(b)');
        });
    });

    describe('consecutive rules', function () {
        const days = Array.from({ length: 10 }, (_, i) => `2026-01-${String(5 + i).padStart(2, '0')}`);

        it('caps consecutive working days at the Portuguese 6', function () {
            const ctx = ctxFor({
                rules: { consecutive: { maxWorkingDays: 6 } },
                shifts: [shift('d', '08:00', '16:00', days)],
            });
            const state = stateWith(
                ctx,
                days.slice(0, 6).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'consecutive-days').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `d@${days[6]}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(7);
        });

        it('caps consecutive nights at the Finnish 5 and the Dutch 7', function () {
            const build = (max: number) =>
                ctxFor({
                    rules: {
                        nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: H },
                        consecutive: { maxNightShifts: max },
                    },
                    shifts: [shift('n', '22:00', '06:00', days)],
                });
            const fi = build(5);
            const nl = build(7);
            const sixNights = days.slice(0, 5).map((d) => ['e1', `n@${d}`] as [string, string]);

            const pair = { employeeId: 'e1', shiftInstanceId: `n@${days[5]}` };
            expect(constraint(fi, 'consecutive-nights').verdict!(stateWith(fi, sixNights), pair).pass).to.equal(false);
            expect(constraint(nl, 'consecutive-nights').verdict!(stateWith(nl, sixNights), pair).pass).to.equal(true);
        });

        it('blocks a forbidden Night-to-Early quick return', function () {
            const ctx = ctxFor({
                rules: {
                    consecutive: { forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early', minGapMinutes: 24 * H }] },
                },
                shifts: [
                    shift('n', '22:00', '06:00', ['2026-01-05'], { shiftTypeTag: 'night' }),
                    shift('e', '14:00', '22:00', ['2026-01-06'], { shiftTypeTag: 'early' }),
                ],
            });
            const state = stateWith(ctx, [['e1', 'n@2026-01-05']]);
            const v = constraint(ctx, 'shift-succession').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'e@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('night');
        });

        it('only treats adjacent days as a succession', function () {
            // Regression: taking the nearest preceding shift regardless of
            // distance made a night four days earlier forbid every later early.
            const ctx = ctxFor({
                rules: { consecutive: { forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early' }] } },
                shifts: [
                    shift('n', '22:00', '06:00', ['2026-01-05'], { shiftTypeTag: 'night' }),
                    shift('e', '06:00', '14:00', ['2026-01-09'], { shiftTypeTag: 'early' }),
                ],
            });
            const state = stateWith(ctx, [['e1', 'n@2026-01-05']]);
            const v = constraint(ctx, 'shift-succession').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'e@2026-01-09',
            });
            expect(v.pass).to.equal(true);
        });
    });

    describe('start-interval (PL doba pracownicza)', function () {
        it('blocks a restart inside 24h of the previous start even with ample rest', function () {
            const ctx = ctxFor({
                rules: { minimumStartInterval: { minMinutes: 24 * H } },
                shifts: [shift('a', '14:00', '22:00', ['2026-01-05']), shift('b', '06:00', '14:00', ['2026-01-06'])],
            });
            const state = stateWith(ctx, [['e1', 'a@2026-01-05']]);
            const v = constraint(ctx, 'start-interval').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'b@2026-01-06',
            });
            // 22:00 to 06:00 is 8h of rest, but the starts are only 16h apart.
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(16 * H);
        });
    });

    describe('breaks', function () {
        it('flags a shift that owes a German 45-minute break but provides none', function () {
            const ctx = ctxFor({
                rules: { breaks: [{ afterMinutes: 9 * H, minMinutes: 45 }] },
                shifts: [shift('long', '08:00', '18:00', ['2026-01-05'])],
            });
            const state = stateWith(ctx, [['e1', 'long@2026-01-05']]);
            const violations = constraint(ctx, 'in-shift-breaks').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].required).to.equal(45);
        });

        it('accepts the same shift once it carries the unpaid break', function () {
            const ctx = ctxFor({
                rules: { breaks: [{ afterMinutes: 9 * H, minMinutes: 45 }] },
                shifts: [shift('long', '08:00', '18:00', ['2026-01-05'], { unpaidBreakMinutes: 45 })],
            });
            const state = stateWith(ctx, [['e1', 'long@2026-01-05']]);
            expect(constraint(ctx, 'in-shift-breaks').evaluate!(state)).to.have.length(0);
        });

        it('refuses to let an interruptible break discharge the entitlement (C-107/19)', function () {
            const ctx = ctxFor({
                rules: { breaks: [{ afterMinutes: 6 * H, minMinutes: 30, interruptible: true }] },
                shifts: [shift('d', '08:00', '17:00', ['2026-01-05'], { unpaidBreakMinutes: 30 })],
            });
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            const violations = constraint(ctx, 'in-shift-breaks').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].message).to.contain('C-107/19');
        });
    });

    describe('rest days', function () {
        it('bars Sunday work where the jurisdiction does not permit it', function () {
            const ctx = ctxFor({
                rules: { restDays: { sundayAllowed: false } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-11'])], // a Sunday
            });
            const v = constraint(ctx, 'rest-days').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-11',
            });
            expect(v.pass).to.equal(false);
        });

        it('bars public-holiday work and recognises the calendar', function () {
            const ctx = ctxFor({
                rules: { restDays: { holidayAllowed: false } },
                calendar: { publicHolidays: ['2026-01-06'] },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
            });
            expect(ctx.instanceById.get('d@2026-01-06')!.isPublicHoliday).to.equal(true);
            const v = constraint(ctx, 'rest-days').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-06',
            });
            expect(v.pass).to.equal(false);
        });
    });

    describe('engagement floor', function () {
        it('rejects a shift below the Belgian 3-hour session minimum', function () {
            const ctx = ctxFor({
                rules: { engagement: { minShiftMinutes: 3 * H } },
                shifts: [shift('short', '09:00', '11:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'engagement-floor').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'short@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(2 * H);
        });
    });

    describe('qualifications', function () {
        it('treats an expired certificate as disqualifying on the shift date', function () {
            const ctx = ctxFor({
                employees: [
                    {
                        id: 'e1',
                        tags: [],
                        timeOff: [],
                        qualifications: [{ tag: 'forklift', validUntil: '2026-01-06' }],
                    },
                ],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-08'], { requiredTags: ['forklift'] })],
            });
            const c = constraint(ctx, 'qualification');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
            const expired = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-08' });
            expect(expired.pass).to.equal(false);
            expect(expired.message).to.contain('expired 2026-01-06');
        });
    });

    describe('group composition', function () {
        it('caps the number of assignees carrying a tag', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'a', tags: ['trainee'], timeOff: [] },
                    { id: 'b', tags: ['trainee'], timeOff: [] },
                    { id: 'c', tags: ['trainee'], timeOff: [] },
                ],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { minEmployees: 3, tagMaximums: { trainee: 2 } })],
            });
            const state = stateWith(ctx, [
                ['a', 'd@2026-01-05'],
                ['b', 'd@2026-01-05'],
            ]);
            const v = constraint(ctx, 'group-composition').verdict!(state, {
                employeeId: 'c',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('trainee');
        });
    });

    describe('protections', function () {
        it('bars night work on a pregnancy certificate and records the owed alternative', function () {
            const ctx = ctxFor({
                rules: { nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: H } },
                employees: [
                    {
                        id: 'e1',
                        tags: [],
                        timeOff: [],
                        protections: [{ kind: 'pregnancyNightExclusion', fallback: 'dayShift' }],
                    },
                ],
                shifts: [shift('n', '22:00', '06:00', ['2026-01-05'])],
            });
            const c = constraint(ctx, 'protections');
            const v = c.verdict!(createState(ctx), { employeeId: 'e1', shiftInstanceId: 'n@2026-01-05' });
            expect(v.pass).to.equal(false);
            expect(v.citation).to.contain('92/85');

            // Art 7 owes a daytime transfer, not merely an absence.
            const owed = c.evaluate!(createState(ctx));
            expect(owed).to.have.length(1);
            expect(owed[0].message).to.contain('transfer to day work');
        });
    });

    describe('availability', function () {
        it('treats a declared availability list as an allow-list', function () {
            const ctx = ctxFor({
                employees: [
                    {
                        id: 'e1',
                        tags: [],
                        timeOff: [],
                        availability: [{ kind: 'available', daysOfWeek: [1], from: '08:00', to: '16:00' }],
                    },
                ],
                shifts: [
                    shift('mon', '08:00', '16:00', ['2026-01-05']), // Monday
                    shift('tue', '08:00', '16:00', ['2026-01-06']), // Tuesday
                ],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'mon@2026-01-05' }).pass).to.equal(true);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'tue@2026-01-06' }).pass).to.equal(false);
        });

        it('keeps an avoid preference soft, so it never blocks assignment', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'e1', tags: [], timeOff: [], availability: [{ kind: 'avoid', daysOfWeek: [6, 7], weight: 3 }] },
                ],
                shifts: [shift('sat', '08:00', '16:00', ['2026-01-10'])],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            const pair = { employeeId: 'e1', shiftInstanceId: 'sat@2026-01-10' };
            expect(c.verdict!(state, pair).pass).to.equal(false);
            expect(c.verdict!(state, pair).severity).to.equal('soft');
            // Soft objections must not make the pair ineligible.
            expect(c.delta(state, pair)).to.equal(0);
        });

        it('never overrides an external commitment (2019/1152 Art 9)', function () {
            const ctx = ctxFor({
                employees: [
                    {
                        id: 'e1',
                        tags: [],
                        timeOff: [],
                        externalCommitments: [{ from: '2026-01-05', to: '2026-01-05' }],
                    },
                ],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            const state = createState(ctx);
            expect(
                constraint(ctx, 'time-off').delta(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-05' }),
            ).to.be.greaterThan(0);
        });
    });

    describe('contract', function () {
        it('bars assignment past a fixed-term contract end date', function () {
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [], contract: { kind: 'hours', endDate: '2026-01-06' } }],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-08'])],
            });
            const c = constraint(ctx, 'contract');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-08' }).pass).to.equal(false);
        });

        it('counts days rather than hours for a forfait-jours contract', function () {
            const days = ['2026-01-05', '2026-01-06', '2026-01-07'];
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [], contract: { kind: 'days', maxDaysInPeriod: 2 } }],
                shifts: [shift('d', '08:00', '20:00', days)],
            });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-05'],
                ['e1', 'd@2026-01-06'],
            ]);
            const v = constraint(ctx, 'contract').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-07' });
            expect(v.pass).to.equal(false);
            expect(v.unit).to.equal('days');
        });
    });

    describe('duty classification', function () {
        it('counts on-premises standby in full (SIMAP/Jaeger)', function () {
            const ctx = ctxFor({
                shifts: [
                    shift('oncall', '18:00', '08:00', ['2026-01-05'], {
                        duty: { countsAsWorkingTime: 'full', standby: { atWorkplace: true } },
                    }),
                ],
            });
            const inst = ctx.instanceById.get('oncall@2026-01-05')!;
            expect(inst.durationMinutes).to.equal(14 * H);
            expect(inst.workingMinutes).to.equal(14 * H);
        });

        it('counts off-premises standby at the caller-declared fraction', function () {
            const ctx = ctxFor({
                shifts: [
                    shift('standby', '18:00', '08:00', ['2026-01-05'], {
                        duty: {
                            countsAsWorkingTime: 0.25,
                            standby: { atWorkplace: false, responseMinutes: 60 },
                            classificationNote: 'RTV Slovenija C-344/19: 1h response, low call frequency',
                        },
                    }),
                ],
            });
            const inst = ctx.instanceById.get('standby@2026-01-05')!;
            expect(inst.durationMinutes).to.equal(14 * H);
            expect(inst.workingMinutes).to.equal(Math.round(14 * H * 0.25));
        });

        it('counts only actual active minutes when classified actualOnly', function () {
            const ctx = ctxFor({
                shifts: [
                    shift('standby', '18:00', '08:00', ['2026-01-05'], {
                        duty: { countsAsWorkingTime: 'actualOnly', expectedActiveMinutes: 90 },
                    }),
                ],
            });
            expect(ctx.instanceById.get('standby@2026-01-05')!.workingMinutes).to.equal(90);
        });
    });

    describe('person-level aggregation (C-585/19)', function () {
        it('aggregates two contracts of one person for rest purposes', function () {
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                employees: [
                    { id: 'contract-a', personId: 'anna', tags: [], timeOff: [] },
                    { id: 'contract-b', personId: 'anna', tags: [], timeOff: [] },
                ],
                shifts: [shift('n', '22:00', '06:00', ['2026-01-05']), shift('m', '08:00', '16:00', ['2026-01-06'])],
            });
            // Worked as contract-a; the second contract must still see the rest gap.
            const state = stateWith(ctx, [['contract-a', 'n@2026-01-05']]);
            const v = constraint(ctx, 'daily-rest').verdict!(state, {
                employeeId: 'contract-b',
                shiftInstanceId: 'm@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(2 * H);
        });

        it('keeps unrelated employees independent', function () {
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                employees: [
                    { id: 'a', tags: [], timeOff: [] },
                    { id: 'b', tags: [], timeOff: [] },
                ],
                shifts: [shift('n', '22:00', '06:00', ['2026-01-05']), shift('m', '08:00', '16:00', ['2026-01-06'])],
            });
            const state = stateWith(ctx, [['a', 'n@2026-01-05']]);
            expect(
                constraint(ctx, 'daily-rest').verdict!(state, { employeeId: 'b', shiftInstanceId: 'm@2026-01-06' }).pass,
            ).to.equal(true);
        });
    });
});
