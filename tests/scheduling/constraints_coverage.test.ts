import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { minHourViolations } from '../../src/scheduling/constraints/hour-budget';
import { staffingViolations } from '../../src/scheduling/constraints/min-staffing';
import type { Employee, ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * Behavioural tests for the branch paths the headline suites do not reach:
 * boundary passes, guard clauses, per-person rule overrides, default labels,
 * and the less-travelled directions of each sequence rule.
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
        objectives: input.objectives,
    });
}

function constraint(ctx: ModelContext, id: string) {
    const c = ctx.constraints.find((x) => x.id === id);
    expect(c, `constraint ${id} registered`).to.exist;
    return c!;
}

function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

function stateWith(ctx: ModelContext, pairs: Array<[string, string]>) {
    const state = createState(ctx);
    for (const [employeeId, instanceId] of pairs) assign(state, employeeId, instanceId, []);
    return state;
}

/** ISO date i days after Mon 5 Jan 2026 (valid through 30 Jan for i <= 25). */
function day(i: number): string {
    return `2026-01-${String(5 + i).padStart(2, '0')}`;
}

describe('scheduling constraint branch coverage', function () {
    describe('unknown-instance guards', function () {
        const ctx = ctxFor({
            rules: {
                dailyRest: { minMinutes: 11 * H },
                weeklyRest: { minMinutes: 35 * H, windowDays: 7 },
                workingTime: { maxPerDayMinutes: 10 * H },
                overtime: { ordinaryPerDayMinutes: 8 * H },
                dutyQuotas: [{ shiftTypeTag: 'standby', maxMinutes: 10 * H, windowDays: 7 }],
                consecutive: {
                    maxWorkingDays: 6,
                    maxNightShifts: 5,
                    forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early' }],
                },
                minimumStartInterval: { minMinutes: 24 * H },
                nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: H },
            },
            constraints: { oneShiftPerDay: true },
            shifts: [shift('d', '08:00', '16:00', [day(0)])],
        });
        const ghost = { employeeId: 'e1', shiftInstanceId: 'ghost@2026-01-05' };

        it('verdict-based rules pass an unknown shift instance', function () {
            const state = createState(ctx);
            for (const id of [
                'daily-rest',
                'weekly-rest',
                'rolling-hours',
                'overtime',
                'duty-quota',
                'night-work',
                'consecutive-days',
                'consecutive-nights',
                'shift-succession',
                'start-interval',
            ]) {
                const v = constraint(ctx, id).verdict!(state, ghost);
                expect(v.pass, id).to.equal(true);
                expect(v.message, id).to.equal('unknown shift');
            }
        });

        it('delta-based rules treat an unknown shift instance as free', function () {
            const state = createState(ctx);
            for (const id of ['one-shift-per-day', 'no-overlap', 'time-off', 'hour-budget', 'max-shift-duration']) {
                expect(constraint(ctx, id).delta(state, ghost), id).to.equal(0);
            }
        });
    });

    describe('consecutive rules', function () {
        const nightRules = { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: H };

        it('registers one constraint per configured sequence rule', function () {
            const all = ctxFor({
                rules: {
                    consecutive: {
                        maxWorkingDays: 6,
                        maxNightShifts: 5,
                        restAfterNightBlockMinutes: 24 * H,
                        forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early' }],
                    },
                },
            });
            for (const id of ['consecutive-days', 'consecutive-nights', 'shift-succession']) {
                expect(
                    all.constraints.some((c) => c.id === id),
                    id,
                ).to.equal(true);
            }

            const daysOnly = ctxFor({ rules: { consecutive: { maxWorkingDays: 6 } } });
            expect(daysOnly.constraints.some((c) => c.id === 'consecutive-days')).to.equal(true);
            expect(daysOnly.constraints.some((c) => c.id === 'consecutive-nights')).to.equal(false);
            expect(daysOnly.constraints.some((c) => c.id === 'shift-succession')).to.equal(false);

            // The rest-after-block rule alone still needs the nights constraint.
            const restOnly = ctxFor({ rules: { consecutive: { restAfterNightBlockMinutes: 24 * H } } });
            expect(restOnly.constraints.some((c) => c.id === 'consecutive-nights')).to.equal(true);
            expect(restOnly.constraints.some((c) => c.id === 'consecutive-days')).to.equal(false);

            // An empty succession list registers nothing.
            const emptyList = ctxFor({ rules: { consecutive: { forbiddenSuccessions: [] } } });
            expect(emptyList.constraints.some((c) => c.id === 'shift-succession')).to.equal(false);
        });

        it('accepts a run exactly at the consecutive-days maximum', function () {
            const dates = [0, 1, 2, 3, 4, 5].map(day);
            const ctx = ctxFor({
                rules: { consecutive: { maxWorkingDays: 6 } },
                shifts: [shift('d', '08:00', '16:00', dates)],
            });
            const state = stateWith(
                ctx,
                dates.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'consecutive-days').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `d@${day(5)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.actual).to.equal(6);
            expect(v.required).to.equal(6);
            expect(v.unit).to.equal('days');
        });

        it('counts a gap-filling night as merging two runs into one', function () {
            const ctx = ctxFor({
                rules: { nightWork: nightRules, consecutive: { maxNightShifts: 2 } },
                shifts: [shift('n', '22:00', '06:00', [day(0), day(1), day(2), day(3)])],
            });
            const state = stateWith(ctx, [
                ['e1', `n@${day(0)}`],
                ['e1', `n@${day(2)}`],
            ]);
            // Nights on days 0 and 2 are two runs of one; adding day 1 merges them.
            const v = constraint(ctx, 'consecutive-nights').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `n@${day(1)}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(3);
            expect(v.required).to.equal(2);
            expect(v.unit).to.equal('count');
        });

        it('keeps runs split by a day off separate', function () {
            const ctx = ctxFor({
                rules: { nightWork: nightRules, consecutive: { maxNightShifts: 2 } },
                shifts: [shift('n', '22:00', '06:00', [day(0), day(1), day(2), day(3)])],
            });
            const state = stateWith(ctx, [
                ['e1', `n@${day(0)}`],
                ['e1', `n@${day(2)}`],
            ]);
            // Day 1 stays free: [n0] and [n2, n3] are runs of 1 and 2 — within the cap.
            const v = constraint(ctx, 'consecutive-nights').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `n@${day(3)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('within limits');
        });

        describe('rest owed after a night block', function () {
            const rules: WorkingTimeRules = {
                nightWork: nightRules,
                consecutive: { maxNightShifts: 3, restAfterNightBlockMinutes: 46 * H },
            };
            const shifts = [shift('n', '22:00', '06:00', [day(0), day(1), day(2)]), shift('m', '08:00', '16:00', [day(3)])];

            it('refuses a morning shift 2h after a completed maximum-length night block', function () {
                const ctx = ctxFor({ rules, shifts });
                const state = stateWith(ctx, [
                    ['e1', `n@${day(0)}`],
                    ['e1', `n@${day(1)}`],
                    ['e1', `n@${day(2)}`],
                ]);
                // Block ends 06:00 on day 3; the morning starts 08:00 the same day.
                const v = constraint(ctx, 'consecutive-nights').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `m@${day(3)}`,
                });
                expect(v.pass).to.equal(false);
                expect(v.actual).to.equal(2 * H);
                expect(v.required).to.equal(46 * H);
                expect(v.message).to.contain('block of 3 night shifts');
            });

            it('owes nothing after a run shorter than the maximum', function () {
                const ctx = ctxFor({ rules, shifts });
                const state = stateWith(ctx, [
                    ['e1', `n@${day(0)}`],
                    ['e1', `n@${day(1)}`],
                ]);
                // Two nights, cap three: the reduced-rest branch is skipped entirely.
                const v = constraint(ctx, 'consecutive-nights').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `m@${day(3)}`,
                });
                expect(v.pass).to.equal(true);
            });

            it('does not judge a run still in progress', function () {
                const ctx = ctxFor({ rules, shifts });
                const state = stateWith(ctx, [
                    ['e1', `n@${day(0)}`],
                    ['e1', `n@${day(1)}`],
                ]);
                // The candidate is the third night itself: nothing follows it yet.
                const v = constraint(ctx, 'consecutive-nights').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `n@${day(2)}`,
                });
                expect(v.pass).to.equal(true);
            });

            it('applies to every completed run when no maxNightShifts is set', function () {
                const ctx = ctxFor({
                    rules: { nightWork: nightRules, consecutive: { restAfterNightBlockMinutes: 24 * H } },
                    shifts: [shift('n', '22:00', '06:00', [day(0)]), shift('m', '10:00', '18:00', [day(1)])],
                });
                const state = stateWith(ctx, [['e1', `n@${day(0)}`]]);
                // A single night is a completed block once the morning follows it.
                const v = constraint(ctx, 'consecutive-nights').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `m@${day(1)}`,
                });
                expect(v.pass).to.equal(false);
                expect(v.actual).to.equal(4 * H);
                expect(v.required).to.equal(24 * H);
            });
        });

        describe('forbidden successions', function () {
            it('checks the forward direction and reports a plain ban without a gap figure', function () {
                const ctx = ctxFor({
                    rules: { consecutive: { forbiddenSuccessions: [{ fromTag: 'night', toTag: 'early' }] } },
                    shifts: [
                        shift('n', '22:00', '06:00', [day(0)], { shiftTypeTag: 'night' }),
                        shift('e', '06:30', '14:30', [day(1)], { shiftTypeTag: 'early' }),
                    ],
                });
                // The assigned shift is the *early*; the candidate night precedes it.
                const state = stateWith(ctx, [['e1', `e@${day(1)}`]]);
                const v = constraint(ctx, 'shift-succession').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `n@${day(0)}`,
                });
                expect(v.pass).to.equal(false);
                expect(v.message).to.contain('is not allowed');
                expect(v.actual).to.equal(30);
                expect(v.required).to.equal(undefined);
            });

            it('permits the succession once the gap clears minGapMinutes, and ignores other tags', function () {
                const ctx = ctxFor({
                    rules: {
                        consecutive: {
                            forbiddenSuccessions: [
                                { fromTag: 'late', toTag: 'early', minGapMinutes: 10 * H },
                                { fromTag: 'night', toTag: 'early' },
                            ],
                        },
                    },
                    shifts: [
                        shift('l', '14:00', '22:00', [day(0)], { shiftTypeTag: 'late' }),
                        shift('e', '09:00', '17:00', [day(1)], { shiftTypeTag: 'early' }),
                    ],
                });
                const state = stateWith(ctx, [['e1', `l@${day(0)}`]]);
                // 22:00 to 09:00 is 11h >= the 10h gap; 'late' never matches the night ban.
                const v = constraint(ctx, 'shift-succession').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `e@${day(1)}`,
                });
                expect(v.pass).to.equal(true);
                expect(v.message).to.contain('succession allowed');
            });
        });
    });

    describe('night-work', function () {
        const band = { from: '23:00', to: '06:00' };

        it('lets a day shift through a prohibited range it never touches', function () {
            const ctx = ctxFor({
                rules: {
                    nightWork: {
                        window: band,
                        qualifiesAfterMinutes: 3 * H,
                        prohibitedRanges: [{ from: '00:00', to: '04:00' }],
                    },
                },
                shifts: [shift('d', '08:00', '16:00', [day(0)])],
            });
            const v = constraint(ctx, 'night-work').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: `d@${day(0)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('is not a night shift');
        });

        it('disables the Art 8(b) absolute cap when absoluteWhenHazardous is false', function () {
            const rules: WorkingTimeRules = {
                nightWork: { window: band, qualifiesAfterMinutes: H, maxShiftMinutes: 8 * H, absoluteWhenHazardous: false },
            };
            const ctx = ctxFor({
                rules,
                employees: [{ id: 'e1', tags: [], timeOff: [], protections: [{ kind: 'hazardousNight' }] }],
                shifts: [shift('n', '22:00', '06:00', [day(0)]), shift('n2', '10:00', '14:00', [day(1)])],
            });
            // The same stacking fails under the default absolute cap; the opt-out lets it pass.
            const state = stateWith(ctx, [['e1', `n@${day(0)}`]]);
            const v = constraint(ctx, 'night-work').verdict!(state, { employeeId: 'e1', shiftInstanceId: `n2@${day(1)}` });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('is not a night shift');
        });

        it('passes a hazardous night worker sitting exactly on the absolute cap', function () {
            const ctx = ctxFor({
                rules: { nightWork: { window: band, qualifiesAfterMinutes: H, maxShiftMinutes: 8 * H } },
                employees: [{ id: 'e1', tags: [], timeOff: [], protections: [{ kind: 'hazardousNight' }] }],
                shifts: [shift('n', '22:00', '06:00', [day(0)])],
            });
            const v = constraint(ctx, 'night-work').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: `n@${day(0)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('within every configured night-work limit');
        });

        it('applies the Art 8(a) average to all work in the window, not only night shifts', function () {
            const ctx = ctxFor({
                rules: {
                    nightWork: { window: band, qualifiesAfterMinutes: H, maxShiftMinutes: 8 * H, averageWindowDays: 1 },
                },
                shifts: [shift('n', '22:00', '06:00', [day(0), day(1)]), shift('d', '12:00', '16:00', [day(1)])],
            });
            // An 8h night plus a 4h afternoon in the same rolling 24h: 12h against the 8h/24h average.
            const state = stateWith(ctx, [
                ['e1', `n@${day(0)}`],
                ['e1', `d@${day(1)}`],
            ]);
            const v = constraint(ctx, 'night-work').verdict!(state, { employeeId: 'e1', shiftInstanceId: `n@${day(1)}` });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(12 * H);
            expect(v.required).to.equal(8 * H);
            expect(v.citation).to.contain('Art 8(a)');
        });

        it('counts every night shift against a quota with no endingAfter filter, using the default label', function () {
            const ctx = ctxFor({
                rules: { nightWork: { window: band, qualifiesAfterMinutes: H, volumeQuotas: [{ max: 2, windowDays: 7 }] } },
                shifts: [shift('n', '22:00', '06:00', [day(0), day(1), day(2)])],
            });
            const state = stateWith(ctx, [
                ['e1', `n@${day(0)}`],
                ['e1', `n@${day(1)}`],
            ]);
            const v = constraint(ctx, 'night-work').verdict!(state, { employeeId: 'e1', shiftInstanceId: `n@${day(2)}` });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(3);
            expect(v.required).to.equal(2);
            expect(v.message).to.contain('2 night shifts / 7d');
        });

        it('leaves a quota untouched by nights ending before the endingAfter time', function () {
            const ctx = ctxFor({
                rules: {
                    nightWork: {
                        window: { from: '22:00', to: '06:00' },
                        qualifiesAfterMinutes: 2 * H,
                        volumeQuotas: [{ max: 1, windowDays: 7, endingAfter: '02:00' }],
                    },
                },
                shifts: [shift('n', '22:00', '01:00', [day(0), day(1), day(2)])],
            });
            // Three qualifying night shifts, all ending 01:00 — none consumes the 02:00-gated quota.
            const state = stateWith(ctx, [
                ['e1', `n@${day(0)}`],
                ['e1', `n@${day(1)}`],
            ]);
            const v = constraint(ctx, 'night-work').verdict!(state, { employeeId: 'e1', shiftInstanceId: `n@${day(2)}` });
            expect(v.pass).to.equal(true);
        });
    });

    describe('rolling-hours', function () {
        it('caps a single shift with maxPerShiftMinutes', function () {
            const ctx = ctxFor({
                rules: { workingTime: { maxPerShiftMinutes: 8 * H } },
                shifts: [shift('long', '08:00', '18:00', [day(0)])],
            });
            const v = constraint(ctx, 'rolling-hours').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: `long@${day(0)}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(10 * H);
            expect(v.required).to.equal(8 * H);
            expect(v.message).to.contain('per shift');
        });

        it('enforces the absolute weekly cap that no averaging can excuse', function () {
            const dates = [0, 1, 2, 3, 4, 5].map(day);
            const ctx = ctxFor({
                rules: { workingTime: { maxPerWeekAbsoluteMinutes: 60 * H } },
                shifts: [shift('d', '08:00', '20:00', dates)],
            });
            const state = stateWith(
                ctx,
                dates.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            // Six 12h days = 72h in one rolling week.
            const v = constraint(ctx, 'rolling-hours').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `d@${day(5)}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(72 * H);
            expect(v.required).to.equal(60 * H);
            expect(v.message).to.contain('per week');
        });

        it('enforces the whole-period cap', function () {
            const dates = [0, 1, 2, 3, 4, 5].map(day);
            const ctx = ctxFor({
                rules: { workingTime: { maxPerPeriodMinutes: 40 * H } },
                shifts: [shift('d', '08:00', '16:00', dates)],
            });
            const state = stateWith(
                ctx,
                dates.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'rolling-hours').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `d@${day(5)}`,
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(48 * H);
            expect(v.required).to.equal(40 * H);
            expect(v.message).to.contain('per period');
        });

        describe('extended daily cap', function () {
            const rules: WorkingTimeRules = {
                workingTime: { maxPerDayMinutes: 8 * H, maxPerDayExtendedMinutes: 10 * H, dayAverageWindowDays: 7 },
            };

            it('grants the extended cap while the averaging window still holds', function () {
                const ctx = ctxFor({ rules, shifts: [shift('ten', '08:00', '18:00', [day(0)])] });
                const v = constraint(ctx, 'rolling-hours').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: `ten@${day(0)}`,
                });
                expect(v.pass).to.equal(true);
            });

            it('falls back to the ordinary cap once the average is exhausted', function () {
                const dates = [0, 1, 2, 3, 4, 5, 6].map(day);
                const ctx = ctxFor({ rules, shifts: [shift('ten', '08:00', '18:00', dates)] });
                const state = stateWith(
                    ctx,
                    dates.slice(0, 6).map((d) => ['e1', `ten@${d}`] as [string, string]),
                );
                // A seventh 10h day makes 70h in the 7-day window, past the 8h x 7 average.
                const v = constraint(ctx, 'rolling-hours').verdict!(state, {
                    employeeId: 'e1',
                    shiftInstanceId: `ten@${day(6)}`,
                });
                expect(v.pass).to.equal(false);
                expect(v.actual).to.equal(10 * H);
                expect(v.required).to.equal(8 * H);
            });
        });

        describe('neutralised absence', function () {
            const rules: WorkingTimeRules = {
                workingTime: { rollingAverages: [{ maxMinutes: 48 * H, windowDays: 7 }], neutraliseAbsenceKinds: ['sick'] },
            };
            const dates = [3, 4, 5, 6].map(day);
            const shifts = [shift('d', '08:00', '16:00', dates)];
            const assigned = dates.slice(0, 3).map((d) => ['e1', `d@${d}`] as [string, string]);
            const pair = { employeeId: 'e1', shiftInstanceId: `d@${day(6)}` };

            it('shrinks the window allowance by the neutralised fraction', function () {
                const ctx = ctxFor({
                    rules,
                    shifts,
                    // 3.5 days of sick leave halve the 7-day window's allowance.
                    absences: [{ employeeId: 'e1', from: day(0), to: `${day(3)}T12:00`, kind: 'sick' }],
                });
                const v = constraint(ctx, 'rolling-hours').verdict!(stateWith(ctx, assigned), pair);
                expect(v.pass).to.equal(false);
                expect(v.actual).to.equal(32 * H);
                expect(v.required).to.equal(24 * H);
                expect(v.message).to.contain('48.0h/7d');
                expect(v.message).to.contain('limit of 24.0h');
            });

            it('ignores absences whose kind is not neutralised', function () {
                const ctx = ctxFor({
                    rules,
                    shifts,
                    absences: [{ employeeId: 'e1', from: day(0), to: `${day(3)}T12:00`, kind: 'vacation' }],
                });
                // 32h in the window against the full 48h allowance.
                expect(constraint(ctx, 'rolling-hours').verdict!(stateWith(ctx, assigned), pair).pass).to.equal(true);
            });
        });
    });

    describe('start-interval', function () {
        const rules: WorkingTimeRules = { minimumStartInterval: { minMinutes: 24 * H } };

        it('passes a restart outside the window and reports the closest distance', function () {
            const ctx = ctxFor({
                rules,
                shifts: [shift('a', '14:00', '22:00', [day(0)]), shift('b', '06:00', '14:00', [day(2)])],
            });
            const state = stateWith(ctx, [['e1', `a@${day(0)}`]]);
            const v = constraint(ctx, 'start-interval').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: `b@${day(2)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.actual).to.equal(40 * H); // 14:00 day 0 to 06:00 day 2
            expect(v.required).to.equal(24 * H);
        });

        it('passes an empty timeline with no distance at all', function () {
            const ctx = ctxFor({ rules, shifts: [shift('a', '14:00', '22:00', [day(0)])] });
            const v = constraint(ctx, 'start-interval').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: `a@${day(0)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.actual).to.equal(undefined);
        });

        it('excludes the pair itself and keeps the nearest of several neighbours', function () {
            const ctx = ctxFor({
                rules,
                shifts: [
                    shift('a', '14:00', '22:00', [day(0)]),
                    shift('b', '15:00', '23:00', [day(1)]),
                    shift('c', '14:00', '22:00', [day(4)]),
                ],
            });
            const c = constraint(ctx, 'start-interval');

            // Re-explaining a committed pair must not measure it against itself.
            const own = stateWith(ctx, [['e1', `a@${day(0)}`]]);
            const self = c.verdict!(own, { employeeId: 'e1', shiftInstanceId: `a@${day(0)}` });
            expect(self.pass).to.equal(true);
            expect(self.actual).to.equal(undefined);

            // Two neighbours either side: the 25h one wins over the 71h one.
            const both = stateWith(ctx, [
                ['e1', `a@${day(0)}`],
                ['e1', `c@${day(4)}`],
            ]);
            const v = c.verdict!(both, { employeeId: 'e1', shiftInstanceId: `b@${day(1)}` });
            expect(v.pass).to.equal(true);
            expect(v.actual).to.equal(25 * H);
        });
    });

    describe('hour-budget', function () {
        const employees: Employee[] = [
            { id: 'cap', tags: [], timeOff: [], maxHoursForPeriod: 16 },
            { id: 'free', tags: [], timeOff: [] },
        ];
        const shifts = [shift('d8', '08:00', '16:00', [day(0), day(1)]), shift('d12', '08:00', '20:00', [day(2)])];

        it('permits landing exactly on the cap and blocks going past it', function () {
            const ctx = ctxFor({ employees, shifts });
            const c = constraint(ctx, 'hour-budget');
            const state = stateWith(ctx, [['cap', `d8@${day(0)}`]]);

            // 8h worked + 8h candidate = exactly 16h: allowed.
            expect(c.delta(state, { employeeId: 'cap', shiftInstanceId: `d8@${day(1)}` })).to.equal(0);
            expect(c.explain(state, { employeeId: 'cap', shiftInstanceId: `d8@${day(1)}` })).to.equal(null);

            // 8h + 12h = 20h: over.
            const over = { employeeId: 'cap', shiftInstanceId: `d12@${day(2)}` };
            expect(c.delta(state, over)).to.equal(1);
            expect(c.explain(state, over)).to.contain('past 16h');
        });

        it('leaves unbounded and unknown employees alone', function () {
            const ctx = ctxFor({ employees, shifts });
            const c = constraint(ctx, 'hour-budget');
            const state = stateWith(ctx, [
                ['free', `d8@${day(0)}`],
                ['free', `d8@${day(1)}`],
            ]);
            expect(c.delta(state, { employeeId: 'free', shiftInstanceId: `d12@${day(2)}` })).to.equal(0);
            expect(c.delta(state, { employeeId: 'ghost', shiftInstanceId: `d12@${day(2)}` })).to.equal(0);
        });

        it('reports soft min-hours shortfalls only for bounded employees still short', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'short', tags: [], timeOff: [], minHoursForPeriod: 10 },
                    { id: 'met', tags: [], timeOff: [], minHoursForPeriod: 4 },
                    { id: 'unbounded', tags: [], timeOff: [] },
                ],
                shifts: [shift('d', '08:00', '16:00', [day(0)], { maxEmployees: 3 })],
            });
            const state = stateWith(ctx, [
                ['short', `d@${day(0)}`],
                ['met', `d@${day(0)}`],
            ]);
            const violations = minHourViolations(ctx, state, 2);
            expect(violations).to.have.length(1);
            expect(violations[0].employeeId).to.equal('short');
            expect(violations[0].severity).to.equal('soft');
            expect(violations[0].message).to.contain('8.0h, below the 10h minimum (weight 2)');
        });
    });

    describe('overtime', function () {
        it('applies a per-person override, including its citation', function () {
            const ctx = ctxFor({
                rules: { overtime: { ordinaryPerDayMinutes: 8 * H } },
                employees: [
                    {
                        id: 'junior',
                        tags: [],
                        timeOff: [],
                        rules: {
                            overtime: { ordinaryPerDayMinutes: 6 * H, maxOvertimePerDayMinutes: H, citation: 'youth code' },
                        },
                    },
                    { id: 'adult', tags: [], timeOff: [] },
                ],
                shifts: [shift('d', '08:00', '16:00', [day(0)], { maxEmployees: 2 })],
            });
            const c = constraint(ctx, 'overtime');
            const state = createState(ctx);

            const junior = c.verdict!(state, { employeeId: 'junior', shiftInstanceId: `d@${day(0)}` });
            expect(junior.pass).to.equal(false);
            expect(junior.actual).to.equal(2 * H); // 8h against a 6h ordinary day
            expect(junior.required).to.equal(1 * H);
            expect(junior.citation).to.equal('youth code');

            expect(c.verdict!(state, { employeeId: 'adult', shiftInstanceId: `d@${day(0)}` }).pass).to.equal(true);
        });

        it('names a labelled rolling-window cap in the breach message', function () {
            const dates = [0, 1, 2, 3, 4, 5].map(day);
            const ctx = ctxFor({
                rules: {
                    overtime: {
                        ordinaryPerWeekMinutes: 40 * H,
                        maxOvertimeInWindow: [{ maxMinutes: 4 * H, windowDays: 7, label: 'AT cap' }],
                    },
                },
                shifts: [shift('d', '08:00', '16:00', dates)],
            });
            const state = stateWith(
                ctx,
                dates.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            // Six 8h days = 48h: 8h of overtime against the 4h window cap.
            const v = constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: `d@${day(5)}` });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(8 * H);
            expect(v.required).to.equal(4 * H);
            expect(v.message).to.contain('AT cap');
        });

        it('makes window caps inert when the applied override has no weekly baseline', function () {
            const dates = [0, 1, 2, 3, 4, 5].map(day);
            const ctx = ctxFor({
                rules: { overtime: { ordinaryPerDayMinutes: 8 * H } },
                employees: [
                    {
                        id: 'e1',
                        tags: [],
                        timeOff: [],
                        // A per-person override is not re-validated, so a window cap
                        // without any weekly baseline simply cannot bite.
                        rules: {
                            overtime: {
                                ordinaryPerDayMinutes: 8 * H,
                                maxOvertimeInWindow: [{ maxMinutes: 0, windowDays: 7 }],
                            },
                        },
                    },
                ],
                shifts: [shift('d', '08:00', '16:00', dates)],
            });
            const state = stateWith(
                ctx,
                dates.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            expect(
                constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: `d@${day(5)}` }).pass,
            ).to.equal(true);
        });

        it('exempts a person whose override removes the overtime family', function () {
            const ctx = ctxFor({
                rules: { overtime: { ordinaryPerDayMinutes: 6 * H } },
                employees: [{ id: 'exempt', tags: [], timeOff: [], rules: { overtime: undefined } }],
                shifts: [shift('d', '08:00', '18:00', [day(0)])],
            });
            const v = constraint(ctx, 'overtime').verdict!(createState(ctx), {
                employeeId: 'exempt',
                shiftInstanceId: `d@${day(0)}`,
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('no overtime rule applies');
        });
    });

    describe('min-rest', function () {
        const shifts = [
            shift('a', '08:00', '16:00', [day(0)]),
            shift('b', '10:00', '18:00', [day(0)]),
            shift('late', '18:00', '23:00', [day(0)]),
            shift('c', '08:00', '16:00', [day(1)]),
        ];

        it('treats overlapping work as zero rest', function () {
            const ctx = ctxFor({ shifts });
            const c = constraint(ctx, 'min-rest');
            const state = stateWith(ctx, [['e1', `a@${day(0)}`]]);
            const pair = { employeeId: 'e1', shiftInstanceId: `b@${day(0)}` };
            expect(c.delta(state, pair)).to.equal(1);
            expect(c.explain(state, pair)).to.contain('less than 11.0h rest');
        });

        it('measures the gap in both directions around the candidate', function () {
            const ctx = ctxFor({ shifts });
            const c = constraint(ctx, 'min-rest');

            // Later shift already assigned, candidate before it: 23:00 to 08:00 is 9h.
            const state = stateWith(ctx, [['e1', `c@${day(1)}`]]);
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `late@${day(0)}` })).to.equal(1);

            // 16:00 to 08:00 next day is 16h: fine either way round.
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `a@${day(0)}` })).to.equal(0);
            expect(c.explain(state, { employeeId: 'e1', shiftInstanceId: `a@${day(0)}` })).to.equal(null);
        });

        it('skips the pair itself and unknown employees', function () {
            const ctx = ctxFor({ shifts });
            const c = constraint(ctx, 'min-rest');
            const state = stateWith(ctx, [['e1', `a@${day(0)}`]]);
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `a@${day(0)}` })).to.equal(0);
            expect(c.delta(state, { employeeId: 'ghost', shiftInstanceId: `a@${day(0)}` })).to.equal(0);
        });

        it('ignores unknown instance ids on either side of the comparison', function () {
            const ctx = ctxFor({ shifts });
            const c = constraint(ctx, 'min-rest');
            const state = stateWith(ctx, [['e1', `a@${day(0)}`]]);
            // A candidate that resolves to nothing can never breach.
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: 'ghost@x' })).to.equal(0);
            // A stale assignment id (its instance removed from the model) is skipped.
            state.byEmployee.get('e1')!.add('phantom@x');
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `b@${day(0)}` })).to.equal(1);
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `c@${day(1)}` })).to.equal(0);
        });
    });

    describe('one-shift-per-day', function () {
        const shifts = [
            shift('m', '08:00', '12:00', [day(0)]),
            shift('ev', '14:00', '18:00', [day(0)]),
            shift('next', '08:00', '12:00', [day(1)]),
        ];
        const options = { oneShiftPerDay: true, minRestMinutes: 0 };

        it('blocks a second shift on the same day and allows the next day', function () {
            const ctx = ctxFor({ shifts, constraints: options });
            const c = constraint(ctx, 'one-shift-per-day');
            const state = stateWith(ctx, [['e1', `m@${day(0)}`]]);

            const sameDay = { employeeId: 'e1', shiftInstanceId: `ev@${day(0)}` };
            expect(c.delta(state, sameDay)).to.equal(1);
            expect(c.explain(state, sameDay)).to.contain(day(0));

            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `next@${day(1)}` })).to.equal(0);
        });

        it('ignores the pair itself and unknown employees', function () {
            const ctx = ctxFor({ shifts, constraints: options });
            const c = constraint(ctx, 'one-shift-per-day');
            const state = stateWith(ctx, [['e1', `m@${day(0)}`]]);
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `m@${day(0)}` })).to.equal(0);
            expect(c.delta(state, { employeeId: 'ghost', shiftInstanceId: `ev@${day(0)}` })).to.equal(0);
        });
    });

    describe('time-off pruning', function () {
        it('prunes date-scoped and instance-scoped blocks, and only those', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'dayoff', tags: [], timeOff: [{ date: day(0) }] },
                    { id: 'scoped', tags: [], timeOff: [{ date: day(0), shiftInstanceId: `a@${day(0)}` }] },
                    { id: 'clear', tags: [], timeOff: [] },
                ],
                shifts: [shift('a', '08:00', '12:00', [day(0)]), shift('b', '14:00', '18:00', [day(0)])],
            });
            const eligibility = new Map<string, Set<string>>([
                ['dayoff', new Set([`a@${day(0)}`, `b@${day(0)}`, 'ghost@x'])],
                ['scoped', new Set([`a@${day(0)}`, `b@${day(0)}`])],
                ['clear', new Set([`a@${day(0)}`, `b@${day(0)}`])],
            ]);
            constraint(ctx, 'time-off').prune!(ctx, eligibility);

            // A whole-day block removes both real shifts; the unknown id survives.
            expect([...eligibility.get('dayoff')!]).to.deep.equal(['ghost@x']);
            // An instance-scoped block removes only the named shift.
            expect([...eligibility.get('scoped')!]).to.deep.equal([`b@${day(0)}`]);
            expect(eligibility.get('clear')!.size).to.equal(2);
        });

        it('blocks by delta with a message, and treats unlisted employees as unblocked', function () {
            const ctx = ctxFor({
                employees: [{ id: 'dayoff', tags: [], timeOff: [{ date: day(0) }] }],
                shifts: [shift('a', '08:00', '12:00', [day(0)])],
            });
            const c = constraint(ctx, 'time-off');
            const state = createState(ctx);

            const blocked = { employeeId: 'dayoff', shiftInstanceId: `a@${day(0)}` };
            expect(c.delta(state, blocked)).to.equal(1);
            expect(c.explain(state, blocked)).to.contain('has time off during');

            // An employee id with no blocked-interval entry falls back to an empty list.
            expect(c.delta(state, { employeeId: 'ghost', shiftInstanceId: `a@${day(0)}` })).to.equal(0);
            const eligibility = new Map<string, Set<string>>([['ghost', new Set([`a@${day(0)}`])]]);
            c.prune!(ctx, eligibility);
            expect(eligibility.get('ghost')!.size).to.equal(1);
        });
    });

    describe('weekly-rest averaging', function () {
        // Day shifts on every date except day(12), leaving only 16h nightly gaps.
        const dates = Array.from({ length: 26 }, (_, i) => day(i)).filter((d) => d !== day(12));
        const shifts = [shift('d', '08:00', '16:00', dates)];
        const pair = { employeeId: 'e1', shiftInstanceId: `d@${day(13)}` };
        const roster = dates.filter((d) => d !== day(13)).map((d) => ['e1', `d@${d}`] as [string, string]);

        it('holds the absolute floor in every window even while averaging', function () {
            const ctx = ctxFor({
                rules: {
                    weeklyRest: { minMinutes: 48 * H, windowDays: 7, absoluteFloorMinutes: 36 * H, averageOverDays: 14 },
                },
                shifts,
            });
            const v = constraint(ctx, 'weekly-rest').verdict!(stateWith(ctx, roster), pair);
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(16 * H); // the longest rest any 7-day window offers
            expect(v.required).to.equal(36 * H);
        });

        it('fails the averaged requirement when no rest stretch ever qualifies', function () {
            const ctx = ctxFor({
                rules: { weeklyRest: { minMinutes: 48 * H, windowDays: 7, averageOverDays: 14 } },
                shifts,
            });
            // No absolute floor: the per-window check is skipped, the average still bites.
            const v = constraint(ctx, 'weekly-rest').verdict!(stateWith(ctx, roster), pair);
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(0); // 16h gaps never reach the 48h qualifying length
            expect(v.required).to.equal(2 * 48 * H);
            expect(v.message).to.contain('would average 0.0h weekly rest over 14 days');
        });
    });

    describe('cost objective', function () {
        const cost = { hourlyRateCents: 1000, overtimeAfterMinutes: 8 * H, overtimeMultiplier: 1.5 };
        const employees: Employee[] = [
            { id: 'rich', tags: [], timeOff: [], cost },
            { id: 'bare', tags: [], timeOff: [] },
        ];
        const shifts = [shift('d', '08:00', '16:00', [day(0), day(1)], { maxEmployees: 2 })];

        it('scores zero with an honest message when there is no cost model', function () {
            const ctx = ctxFor({ employees, shifts, objectives: { costWeightPerEuro: 1 } });
            const c = constraint(ctx, 'cost');
            const state = createState(ctx);
            const pair = { employeeId: 'bare', shiftInstanceId: `d@${day(0)}` };
            const v = c.verdict!(state, pair);
            expect(v.pass).to.equal(true);
            expect(v.actual).to.equal(0);
            expect(v.message).to.contain('(no cost model)');
            expect(c.delta(state, pair)).to.equal(0);
        });

        it('prices an unassigned candidate at its true marginal cost, surcharge included', function () {
            const ctx = ctxFor({ employees, shifts, objectives: { costWeightPerEuro: 1 } });
            const c = constraint(ctx, 'cost');
            const state = stateWith(ctx, [['rich', `d@${day(0)}`]]);
            // The second 8h shift is 8h base plus 8h tipped into the 1.5x band.
            const pair = { employeeId: 'rich', shiftInstanceId: `d@${day(1)}` };
            expect(c.verdict!(state, pair).actual).to.equal(8 * 1000 + 8 * 500);
            expect(c.delta(state, pair)).to.equal(120);
        });

        it('allocates the surcharge pro rata across assigned shifts so shares sum to payroll', function () {
            const ctx = ctxFor({ employees, shifts, objectives: { costWeightPerEuro: 1 } });
            const c = constraint(ctx, 'cost');
            const state = stateWith(ctx, [
                ['rich', `d@${day(0)}`],
                ['rich', `d@${day(1)}`],
            ]);
            const shares = [day(0), day(1)].map(
                (d) => c.verdict!(state, { employeeId: 'rich', shiftInstanceId: `d@${d}` }).actual!,
            );
            // Each shift carries 8h base plus half the 4000c surcharge.
            expect(shares).to.deep.equal([10000, 10000]);
            expect(shares[0] + shares[1]).to.equal(16 * 1000 + 8 * 500);
        });

        it('shares nothing over a duty that contributes no working minutes', function () {
            const ctx = ctxFor({
                employees,
                shifts: [
                    shift('sb', '18:00', '22:00', [day(0)], {
                        shiftTypeTag: 'standby',
                        duty: { countsAsWorkingTime: 'actualOnly', expectedActiveMinutes: 0 },
                    }),
                ],
                objectives: { costWeightPerEuro: 1 },
            });
            expect(ctx.instanceById.get(`sb@${day(0)}`)!.workingMinutes).to.equal(0);
            const c = constraint(ctx, 'cost');
            // Assigned, but zero worked minutes: no base pay and no surcharge share.
            const state = stateWith(ctx, [['rich', `sb@${day(0)}`]]);
            const v = c.verdict!(state, { employeeId: 'rich', shiftInstanceId: `sb@${day(0)}` });
            expect(v.pass).to.equal(true);
            expect(v.actual).to.equal(0);
            expect(c.delta(state, { employeeId: 'rich', shiftInstanceId: `sb@${day(0)}` })).to.equal(0);
        });
    });

    describe('remaining guard branches', function () {
        it('daily-rest defers overlapping work to no-overlap', function () {
            const ctx = ctxFor({
                rules: { dailyRest: { minMinutes: 11 * H } },
                shifts: [shift('a', '08:00', '16:00', [day(0)]), shift('b', '10:00', '18:00', [day(0)])],
            });
            const state = stateWith(ctx, [['e1', `a@${day(0)}`]]);
            const v = constraint(ctx, 'daily-rest').verdict!(state, { employeeId: 'e1', shiftInstanceId: `b@${day(0)}` });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('overlap is handled by no-overlap');
        });

        it('duty-quota applies a per-person quota override with its label', function () {
            const ctx = ctxFor({
                rules: { dutyQuotas: [{ shiftTypeTag: 'standby', maxCount: 5, windowDays: 28 }] },
                employees: [
                    {
                        id: 'guarded',
                        tags: [],
                        timeOff: [],
                        rules: {
                            dutyQuotas: [{ shiftTypeTag: 'standby', maxCount: 1, windowDays: 28, label: 'personal cap' }],
                        },
                    },
                    { id: 'plain', tags: [], timeOff: [] },
                ],
                shifts: [shift('sb', '18:00', '22:00', [day(0), day(2)], { shiftTypeTag: 'standby', maxEmployees: 2 })],
            });
            const c = constraint(ctx, 'duty-quota');
            const state = stateWith(ctx, [
                ['guarded', `sb@${day(0)}`],
                ['plain', `sb@${day(0)}`],
            ]);

            const v = c.verdict!(state, { employeeId: 'guarded', shiftInstanceId: `sb@${day(2)}` });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(2);
            expect(v.required).to.equal(1);
            expect(v.unit).to.equal('count');
            expect(v.message).to.contain('personal cap');

            // The same second duty is fine under the global quota of 5.
            expect(c.verdict!(state, { employeeId: 'plain', shiftInstanceId: `sb@${day(2)}` }).pass).to.equal(true);
        });

        it('max-shift-duration rejects by delta and prunes only capped employees', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'capped', tags: [], timeOff: [], maxShiftDurationMinutes: 8 * H },
                    { id: 'free', tags: [], timeOff: [] },
                ],
                shifts: [shift('long', '08:00', '18:00', [day(0)]), shift('ok', '08:00', '16:00', [day(1)])],
            });
            const c = constraint(ctx, 'max-shift-duration');
            const state = createState(ctx);

            const over = { employeeId: 'capped', shiftInstanceId: `long@${day(0)}` };
            expect(c.delta(state, over)).to.equal(1);
            expect(c.explain(state, over)).to.contain('480 minutes');
            expect(c.delta(state, { employeeId: 'capped', shiftInstanceId: `ok@${day(1)}` })).to.equal(0);
            expect(c.delta(state, { employeeId: 'free', shiftInstanceId: `long@${day(0)}` })).to.equal(0);
            expect(c.explain(state, { employeeId: 'free', shiftInstanceId: `long@${day(0)}` })).to.equal(null);

            const eligibility = new Map<string, Set<string>>([
                ['capped', new Set([`long@${day(0)}`, `ok@${day(1)}`])],
                ['free', new Set([`long@${day(0)}`, `ok@${day(1)}`])],
            ]);
            c.prune!(ctx, eligibility);
            expect([...eligibility.get('capped')!]).to.deep.equal([`ok@${day(1)}`]);
            expect(eligibility.get('free')!.size).to.equal(2);
        });

        it('min-staffing reports shortfalls for an unassigned shift and never blocks a pair', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'plain', tags: [], timeOff: [] },
                    { id: 'nurse', tags: ['nurse'], timeOff: [] },
                ],
                shifts: [shift('team', '08:00', '16:00', [day(0)], { minEmployees: 2, tagRequirements: { nurse: 1 } })],
            });
            const c = constraint(ctx, 'min-staffing');
            const empty = createState(ctx);
            expect(c.delta(empty, { employeeId: 'plain', shiftInstanceId: `team@${day(0)}` })).to.equal(0);
            expect(c.explain(empty, { employeeId: 'plain', shiftInstanceId: `team@${day(0)}` })).to.equal(null);

            const unstaffed = staffingViolations(ctx, empty, 'medium');
            expect(unstaffed).to.have.length(2);
            expect(unstaffed[0].message).to.contain('needs 2 employees, has 0');
            expect(unstaffed[0].actual).to.equal(0);
            expect(unstaffed[0].required).to.equal(2);
            expect(unstaffed[1].message).to.contain('needs 1 employees with tag "nurse", has 0');

            // One nurse assigned: the tag minimum clears, the head count does not.
            const partial = stateWith(ctx, [['nurse', `team@${day(0)}`]]);
            const remaining = staffingViolations(ctx, partial, 'medium');
            expect(remaining).to.have.length(1);
            expect(remaining[0].message).to.contain('needs 2 employees, has 1');

            // Fully staffed — the untagged assignee counts for heads, not for the tag.
            const full = stateWith(ctx, [
                ['nurse', `team@${day(0)}`],
                ['plain', `team@${day(0)}`],
            ]);
            expect(staffingViolations(ctx, full, 'medium')).to.have.length(0);

            // A state not seeded for the instance reads as zero assignees.
            const unseeded = createState(ctx);
            unseeded.assignments.delete(`team@${day(0)}`);
            const fromScratch = staffingViolations(ctx, unseeded, 'medium');
            expect(fromScratch).to.have.length(2);
            expect(fromScratch[0].actual).to.equal(0);
        });

        it('no-overlap accepts disjoint shifts and unknown employees', function () {
            const ctx = ctxFor({
                shifts: [shift('x', '08:00', '12:00', [day(0)]), shift('y', '14:00', '18:00', [day(0)])],
                constraints: { minRestMinutes: 0 },
            });
            const c = constraint(ctx, 'no-overlap');
            const state = stateWith(ctx, [['e1', `x@${day(0)}`]]);
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: `y@${day(0)}` })).to.equal(0);
            expect(c.explain(state, { employeeId: 'e1', shiftInstanceId: `y@${day(0)}` })).to.equal(null);
            expect(c.delta(state, { employeeId: 'ghost', shiftInstanceId: `y@${day(0)}` })).to.equal(0);
        });
    });
});
