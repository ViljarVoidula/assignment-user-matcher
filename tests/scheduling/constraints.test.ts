import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { propagate } from '../../src/scheduling/engine/propagation';
import { assign, createState } from '../../src/scheduling/engine/state';
import { staffingViolations } from '../../src/scheduling/constraints/min-staffing';
import { minHourViolations } from '../../src/scheduling/constraints/hour-budget';
import { score, softBreaches } from '../../src/scheduling/engine/objective';
import type { ModelContext, ScheduleInput } from '../../src/scheduling';

function ctxFor(input: Partial<ScheduleInput>): ModelContext {
    return buildModel({
        period: input.period ?? { startDate: '2026-01-05', endDate: '2026-01-07' },
        employees: input.employees ?? [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: input.shifts ?? [],
        constraints: input.constraints,
    });
}

function constraint(ctx: ModelContext, id: string) {
    const c = ctx.constraints.find((x) => x.id === id);
    expect(c, `constraint ${id} registered`).to.exist;
    return c!;
}

describe('Scheduling constraints', function () {
    describe('model normalization', function () {
        it('unrolls overnight shifts into next-day minutes (legacy abs() bug regression)', function () {
            const ctx = ctxFor({
                period: { startDate: '2026-01-05', endDate: '2026-01-05' },
                shifts: [{ id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', dates: ['2026-01-05'] }],
            });
            const inst = ctx.instances[0];
            expect(inst.durationMinutes).to.equal(480); // 8h forward, never |22-6|=16h
            expect(inst.endMinute - inst.startMinute).to.equal(480);
            expect(inst.endMinute).to.be.greaterThan(1440); // ends on the next day
        });

        it('expands templates per date with unique (templateId, date) ids', function () {
            const ctx = ctxFor({
                shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00' }],
            });
            const ids = ctx.instances.map((i) => i.id);
            expect(ids).to.deep.equal(['day@2026-01-05', 'day@2026-01-06', 'day@2026-01-07']);
        });

        it('filters template dates outside the period', function () {
            const ctx = ctxFor({
                shifts: [{ id: 'x', name: 'X', startTime: '08:00', endTime: '12:00', dates: ['2026-01-04', '2026-01-06'] }],
            });
            expect(ctx.instances.map((i) => i.id)).to.deep.equal(['x@2026-01-06']);
        });

        it('honours daysOfWeek within the period', function () {
            const ctx = ctxFor({
                shifts: [{ id: 'we', name: 'Weekend', startTime: '10:00', endTime: '14:00', daysOfWeek: [6, 7] }],
                period: { startDate: '2026-01-05', endDate: '2026-01-11' },
            });
            expect(ctx.instances.map((i) => i.date)).to.deep.equal(['2026-01-10', '2026-01-11']);
        });
    });

    describe('one-shift-per-day', function () {
        const splitShiftDay = {
            shifts: [
                { id: 'am', name: 'AM', startTime: '06:00', endTime: '12:00', dates: ['2026-01-05'] },
                { id: 'pm', name: 'PM', startTime: '14:00', endTime: '20:00', dates: ['2026-01-05'] },
            ],
        };

        it('blocks a second shift on the same calendar day when enabled', function () {
            const ctx = ctxFor({ ...splitShiftDay, constraints: { oneShiftPerDay: true } });
            const state = createState(ctx);
            assign(state, 'e1', 'am@2026-01-05', []);
            const c = constraint(ctx, 'one-shift-per-day');
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: 'pm@2026-01-05' })).to.be.greaterThan(0);
            expect(c.explain(state, { employeeId: 'e1', shiftInstanceId: 'pm@2026-01-05' })).to.be.a('string');
        });

        it('is not registered by default, so lawful split shifts are allowed', function () {
            const ctx = ctxFor(splitShiftDay);
            expect(ctx.constraints.find((c) => c.id === 'one-shift-per-day')).to.equal(undefined);
        });
    });

    describe('no-overlap', function () {
        it('catches overlap across midnight', function () {
            const ctx = ctxFor({
                shifts: [
                    { id: 'night', name: 'Night', startTime: '20:00', endTime: '04:00', dates: ['2026-01-05'] },
                    { id: 'early', name: 'Early', startTime: '03:00', endTime: '09:00', dates: ['2026-01-06'] },
                ],
            });
            const state = createState(ctx);
            assign(state, 'e1', 'night@2026-01-05', []);
            const c = constraint(ctx, 'no-overlap');
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: 'early@2026-01-06' })).to.be.greaterThan(0);
        });

        it('allows adjacent shifts on different days once the rest window is relaxed', function () {
            const ctx = ctxFor({
                shifts: [
                    { id: 'd1', name: 'D1', startTime: '08:00', endTime: '16:00', dates: ['2026-01-05'] },
                    { id: 'd2', name: 'D2', startTime: '08:00', endTime: '16:00', dates: ['2026-01-06'] },
                ],
                constraints: { minRestMinutes: 0 },
            });
            const state = createState(ctx);
            assign(state, 'e1', 'd1@2026-01-05', []);
            expect(
                constraint(ctx, 'no-overlap').delta(state, { employeeId: 'e1', shiftInstanceId: 'd2@2026-01-06' }),
            ).to.equal(0);
        });
    });

    describe('min-rest (legacy wrong-day bug regression)', function () {
        const build = (minRestMinutes?: number) =>
            ctxFor({
                shifts: [
                    { id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', dates: ['2026-01-05'] },
                    { id: 'morning', name: 'Morning', startTime: '08:00', endTime: '16:00', dates: ['2026-01-06'] },
                    { id: 'evening', name: 'Evening', startTime: '19:00', endTime: '23:00', dates: ['2026-01-06'] },
                ],
                constraints: minRestMinutes === undefined ? undefined : { minRestMinutes },
            });

        it('blocks a next-morning shift inside the 11h rest window', function () {
            const ctx = build();
            const state = createState(ctx);
            assign(state, 'e1', 'night@2026-01-05', []);
            const c = constraint(ctx, 'min-rest');
            // Night ends 06:00 on the 6th; morning starts 08:00 — 2h rest, blocked.
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: 'morning@2026-01-06' })).to.be.greaterThan(0);
        });

        it('allows a next-evening shift past the rest window', function () {
            const ctx = build();
            const state = createState(ctx);
            assign(state, 'e1', 'night@2026-01-05', []);
            const c = constraint(ctx, 'min-rest');
            // Evening starts 19:00 — 13h rest, allowed.
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: 'evening@2026-01-06' })).to.equal(0);
        });

        it('is configurable via minRestMinutes', function () {
            const ctx = build(120);
            const state = createState(ctx);
            assign(state, 'e1', 'night@2026-01-05', []);
            expect(
                constraint(ctx, 'min-rest').delta(state, {
                    employeeId: 'e1',
                    shiftInstanceId: 'morning@2026-01-06',
                }),
            ).to.equal(0);
        });

        it('is not tied to a hardcoded shift name', function () {
            const ctx = ctxFor({
                shifts: [
                    { id: 'late', name: 'Late', startTime: '20:00', endTime: '23:00', dates: ['2026-01-05'] },
                    { id: 'crack', name: 'Crack', startTime: '05:00', endTime: '09:00', dates: ['2026-01-06'] },
                ],
            });
            const state = createState(ctx);
            assign(state, 'e1', 'late@2026-01-05', []);
            expect(
                constraint(ctx, 'min-rest').delta(state, { employeeId: 'e1', shiftInstanceId: 'crack@2026-01-06' }),
            ).to.be.greaterThan(0); // 6h gap < 11h, any shift name
        });
    });

    describe('hour-budget', function () {
        it('counts overnight durations forward when enforcing max hours', function () {
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [], maxHoursForPeriod: 10 }],
                shifts: [
                    { id: 'n1', name: 'N1', startTime: '22:00', endTime: '06:00', dates: ['2026-01-05'] },
                    { id: 'n2', name: 'N2', startTime: '22:00', endTime: '06:00', dates: ['2026-01-07'] },
                ],
            });
            const state = createState(ctx);
            assign(state, 'e1', 'n1@2026-01-05', []);
            // 8h worked; a second 8h night would exceed the 10h cap.
            expect(
                constraint(ctx, 'hour-budget').delta(state, { employeeId: 'e1', shiftInstanceId: 'n2@2026-01-07' }),
            ).to.be.greaterThan(0);
        });

        it('reports soft min-hours shortfalls without blocking', function () {
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [], minHoursForPeriod: 20 }],
                shifts: [{ id: 'd', name: 'D', startTime: '08:00', endTime: '12:00', dates: ['2026-01-05'] }],
            });
            const state = createState(ctx);
            assign(state, 'e1', 'd@2026-01-05', []);
            const violations = minHourViolations(ctx, state, 100);
            expect(violations).to.have.length(1);
            expect(violations[0].severity).to.equal('soft');
            expect(violations[0].employeeId).to.equal('e1');
        });
    });

    describe('max-shift-duration', function () {
        it('prunes shifts longer than the employee cap', function () {
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [], maxShiftDurationMinutes: 360 }],
                shifts: [{ id: 'long', name: 'Long', startTime: '08:00', endTime: '20:00', dates: ['2026-01-05'] }],
            });
            const { eligibility } = propagate(ctx);
            expect(eligibility.get('e1')!.size).to.equal(0);
        });
    });

    describe('time-off', function () {
        it('prunes whole-day time off', function () {
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [{ date: '2026-01-06' }] }],
                shifts: [{ id: 'd', name: 'D', startTime: '08:00', endTime: '16:00' }],
            });
            const { eligibility } = propagate(ctx);
            const remaining = [...eligibility.get('e1')!];
            expect(remaining).to.deep.equal(['d@2026-01-05', 'd@2026-01-07']);
        });

        it('supports shift-scoped time off entries', function () {
            const ctx = ctxFor({
                employees: [{ id: 'e1', tags: [], timeOff: [{ date: '2026-01-06', shiftInstanceId: 'am@2026-01-06' }] }],
                shifts: [
                    { id: 'am', name: 'AM', startTime: '06:00', endTime: '12:00', dates: ['2026-01-06'] },
                    { id: 'pm', name: 'PM', startTime: '14:00', endTime: '20:00', dates: ['2026-01-06'] },
                ],
            });
            const { eligibility } = propagate(ctx);
            expect([...eligibility.get('e1')!]).to.deep.equal(['pm@2026-01-06']);
        });
    });

    describe('min-staffing', function () {
        it('reports head-count and tag shortfalls', function () {
            const ctx = ctxFor({
                employees: [
                    { id: 'e1', tags: ['nurse'], timeOff: [] },
                    { id: 'e2', tags: [], timeOff: [] },
                ],
                shifts: [
                    {
                        id: 'd',
                        name: 'D',
                        startTime: '08:00',
                        endTime: '16:00',
                        dates: ['2026-01-05'],
                        minEmployees: 2,
                        tagRequirements: { nurse: 1 },
                    },
                ],
            });
            const state = createState(ctx);
            assign(state, 'e2', 'd@2026-01-05', []); // only one, and not a nurse
            const violations = staffingViolations(ctx, state, 'hard');
            expect(violations).to.have.length(2);
            expect(violations.some((v) => v.message.includes('needs 2 employees'))).to.be.true;
            expect(violations.some((v) => v.message.includes('tag "nurse"'))).to.be.true;
        });
    });

    describe('registry overrides', function () {
        it('lets callers soften built-ins and add customs', function () {
            const ctx = ctxFor({
                constraints: {
                    overrides: { 'min-rest': { hardness: 'soft', weight: 5 } },
                    custom: [
                        {
                            id: 'no-fridays',
                            hardness: 'soft',
                            weight: 1,
                            delta: () => 0,
                            explain: () => null,
                        },
                    ],
                },
            });
            expect(constraint(ctx, 'min-rest').hardness).to.equal('soft');
            expect(constraint(ctx, 'min-rest').weight).to.equal(5);
            expect(ctx.constraints.map((c) => c.id)).to.include('no-fridays');
        });

        it('gives soft-constraint weights teeth in the objective', function () {
            // A custom soft rule that always breaches, so its weight is the only
            // moving part of the score.
            const breaching = (weight: number) => ({
                id: 'always-breaches',
                hardness: 'soft' as const,
                weight,
                delta: () => 1,
                explain: () => 'breached',
            });
            const build = (weight: number) =>
                ctxFor({
                    shifts: [{ id: 'd', name: 'D', startTime: '08:00', endTime: '12:00', dates: ['2026-01-05'] }],
                    constraints: { custom: [breaching(weight)] },
                });

            const cheap = build(1);
            const cheapState = createState(cheap);
            assign(cheapState, 'e1', 'd@2026-01-05', []);

            const costly = build(50);
            const costlyState = createState(costly);
            assign(costlyState, 'e1', 'd@2026-01-05', []);

            expect(softBreaches(cheap, cheapState)).to.equal(1);
            expect(softBreaches(costly, costlyState)).to.equal(50);
            expect(score(costly, costlyState, 'standard', 100)).to.be.greaterThan(
                score(cheap, cheapState, 'standard', 100),
            );
        });

        it('ignores hard constraints in the soft term', function () {
            const ctx = ctxFor({
                shifts: [{ id: 'd', name: 'D', startTime: '08:00', endTime: '12:00', dates: ['2026-01-05'] }],
            });
            const state = createState(ctx);
            assign(state, 'e1', 'd@2026-01-05', []);
            // Every built-in is hard here, and a hard-compliant roster breaches none.
            expect(softBreaches(ctx, state)).to.equal(0);
        });
    });
});
