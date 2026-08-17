import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { PersonTimeline } from '../../src/scheduling/engine/timeline';
import { cancellationLedger } from '../../src/scheduling/constraints/notice';
import type { ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * Regressions for defects surfaced by the coverage sweep. Each test asserts the
 * *corrected* contract — the behaviour the documentation always promised.
 */

const H = 60;
const PERIOD = { startDate: '2026-01-05', endDate: '2026-02-01' }; // Mon 5 Jan, 4 weeks

function ctxFor(input: Partial<ScheduleInput> & { rules?: WorkingTimeRules }): ModelContext {
    return buildModel({
        period: input.period ?? PERIOD,
        employees: input.employees ?? [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: input.shifts ?? [],
        rules: input.rules,
        absences: input.absences,
        published: input.published,
        asOf: input.asOf,
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

describe('coverage-sweep regressions', function () {
    it('hour-budget measures the candidate in working minutes, like the budget itself', function () {
        // 9h span with a 1h unpaid break is 8h of work: five of them fit a 40h
        // budget exactly. Counting elapsed spans would call the fifth a breach.
        const dates = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'];
        const ctx = ctxFor({
            employees: [{ id: 'e1', tags: [], timeOff: [], maxHoursForPeriod: 40 }],
            shifts: [shift('d', '08:00', '17:00', dates, { unpaidBreakMinutes: 60 })],
        });
        const state = stateWith(
            ctx,
            dates.slice(0, 4).map((d) => ['e1', `d@${d}`] as [string, string]),
        );
        const budget = ctx.constraints.find((c) => c.id === 'hour-budget')!;
        expect(budget.delta(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-09' })).to.equal(0);
    });

    it('timeline window queries see an outer span that nests a later entry', function () {
        const t = new PersonTimeline();
        t.add({ id: 'standby', start: 0, end: 1000, workingMinutes: 1000 });
        t.add({ id: 'inner', start: 100, end: 200, workingMinutes: 100 });
        // A window past the inner entry's end still overlaps the outer span.
        expect(t.workingMinutesIn({ start: 500, end: 600 })).to.equal(100);
        expect(t.entriesIn({ start: 500, end: 600 }).map((e) => e.id)).to.deep.equal(['standby']);
        expect(t.longestRestIn({ start: 400, end: 1200 })).to.equal(200); // only 1000-1200 is free
    });

    it('enforces a contract minimum on the finished roster', function () {
        const ctx = ctxFor({
            employees: [
                { id: 'e1', tags: [], timeOff: [], contract: { kind: 'hours', minPeriodMinutes: 20 * H } },
                { id: 'e2', tags: [], timeOff: [] },
            ],
            shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
        });
        const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
        const violations = constraint(ctx, 'contract').evaluate!(state);
        expect(violations).to.have.length(1);
        expect(violations[0].employeeId).to.equal('e1');
        expect(violations[0].severity).to.equal('hard');
        expect(violations[0].actual).to.equal(8 * H);
        expect(violations[0].required).to.equal(20 * H);
        // e2 has no contract minimum and stays clean at zero hours.
    });

    describe('cancellation deadline (2019/1152 Art 10(3))', function () {
        const published = {
            roster: [{ shiftInstanceId: 'd@2026-01-09', employeeId: 'e1', date: '2026-01-09', reasons: [] }],
        };
        const rules: WorkingTimeRules = {
            notice: { cancellationCompensationMinutes: 3 * H, cancellationDeadlineMinutes: 4 * 24 * H },
        };
        const shifts = [shift('d', '08:00', '16:00', ['2026-01-09'])];

        it('owes nothing when the cancellation lands before the deadline', function () {
            // Cancelled on the 2nd, seven days ahead of a 4-day deadline.
            const ctx = ctxFor({ rules, shifts, published, asOf: '2026-01-05T08:00' });
            expect(cancellationLedger(createState(ctx), ctx.rules.notice)).to.have.length(0);
        });

        it('owes compensation when cancelled inside the protected window', function () {
            const ctx = ctxFor({ rules, shifts, published, asOf: '2026-01-08T08:00' });
            const owed = cancellationLedger(createState(ctx), ctx.rules.notice);
            expect(owed).to.have.length(1);
            expect(owed[0].minutes).to.equal(8 * H); // the called hours outrank the floor
        });

        it('treats every cancellation as late when no asOf anchors the clock', function () {
            const ctx = ctxFor({ rules, shifts, published });
            expect(cancellationLedger(createState(ctx), ctx.rules.notice)).to.have.length(1);
        });
    });

    describe('paid break entitlement', function () {
        const rules: WorkingTimeRules = { breaks: [{ afterMinutes: 6 * H, minMinutes: 30, paid: true }] };

        it('is not discharged by an unpaid break', function () {
            const ctx = ctxFor({
                rules,
                shifts: [shift('d', '08:00', '17:00', ['2026-01-05'], { unpaidBreakMinutes: 45 })],
            });
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(0);
            expect(v.required).to.equal(30);
        });

        it('is discharged by declared paid break minutes, which stay working time', function () {
            const ctx = ctxFor({ rules, shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { paidBreakMinutes: 30 })] });
            const inst = ctx.instanceById.get('d@2026-01-05')!;
            expect(inst.workingMinutes).to.equal(8 * H); // no deduction for a paid break
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(true);
        });
    });

    describe('window-aware absence neutralisation (Art 16(b))', function () {
        // 44h in a week against a 45h/7d rolling limit, with two days of sick
        // leave somewhere in the period.
        const rules: WorkingTimeRules = {
            workingTime: {
                rollingAverages: [{ maxMinutes: 45 * H, windowDays: 7 }],
                neutraliseAbsenceKinds: ['sick'],
            },
        };
        const week = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08'];
        const shifts = [shift('d', '08:00', '19:00', week)]; // 11h days

        it('leaves a window alone when the absence falls outside it', function () {
            const ctx = ctxFor({
                rules,
                shifts,
                absences: [{ employeeId: 'e1', from: '2026-01-26', to: '2026-01-28', kind: 'sick' }],
            });
            const state = stateWith(
                ctx,
                week.slice(0, 3).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'rolling-hours').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-08',
            });
            expect(v.pass).to.equal(true); // 44h < 45h; late-January sick leave is irrelevant here
        });

        it('shrinks the allowance of the window the absence actually falls in', function () {
            const ctx = ctxFor({
                rules,
                shifts,
                absences: [{ employeeId: 'e1', from: '2026-01-10', to: '2026-01-12', kind: 'sick' }],
            });
            const state = stateWith(
                ctx,
                week.slice(0, 3).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            // The worst 7-day window holds all four shifts (44h) plus 2⅓ days of
            // the sick span (a bare `to` date runs to end of day), cutting the
            // 45h allowance by a third to 30h.
            const v = constraint(ctx, 'rolling-hours').verdict!(state, {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-08',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(44 * H);
            expect(v.required).to.be.closeTo(30 * H, 1);
        });
    });

    it('scores avoid and preferred windows in the soft objective', function () {
        const shifts = [shift('d', '08:00', '16:00', ['2026-01-05'], { maxEmployees: 1 })];
        const employees = [
            { id: 'reluctant', tags: [], timeOff: [], availability: [{ kind: 'avoid' as const, weight: 5 }] },
            { id: 'keen', tags: [], timeOff: [], availability: [{ kind: 'preferred' as const, weight: 2 }] },
        ];
        const ctx = ctxFor({ employees, shifts });
        const avoided = stateWith(ctx, [['reluctant', 'd@2026-01-05']]);
        const preferred = stateWith(ctx, [['keen', 'd@2026-01-05']]);

        // Import lazily to keep the objective's signature out of the test surface.
        const { scoreLex, compareScores } = require('../../src/scheduling/engine/objective');
        const a = scoreLex(ctx, avoided, 'standard', 100);
        const b = scoreLex(ctx, preferred, 'standard', 100);
        expect(a.hard).to.equal(b.hard);
        expect(a.medium).to.equal(b.medium);
        expect(compareScores(b, a)).to.be.lessThan(0); // the willing worker wins
    });
});
