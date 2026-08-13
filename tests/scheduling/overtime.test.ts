import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { overtimeLedger } from '../../src/scheduling/constraints/overtime';
import { ScheduleValidationError } from '../../src/scheduling/types';
import type { ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

const H = 60;
const PERIOD = { startDate: '2026-01-05', endDate: '2026-02-01' }; // Mon 5 Jan, 4 weeks

function ctxFor(input: Partial<ScheduleInput> & { rules?: WorkingTimeRules }): ModelContext {
    return buildModel({
        period: input.period ?? PERIOD,
        employees: input.employees ?? [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: input.shifts ?? [],
        rules: input.rules,
        history: input.history,
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

describe('overtime rule', function () {
    it('registers only when the rule family is present', function () {
        expect(ctxFor({}).constraints.some((c) => c.id === 'overtime')).to.equal(false);
        const ctx = ctxFor({ rules: { overtime: { ordinaryPerDayMinutes: 8 * H } } });
        expect(ctx.constraints.some((c) => c.id === 'overtime')).to.equal(true);
    });

    it('rejects a rule with no ordinary baseline, and caps without their baseline', function () {
        expect(() => ctxFor({ rules: { overtime: {} } })).to.throw(ScheduleValidationError, /ordinary baseline/);
        expect(() => ctxFor({ rules: { overtime: { ordinaryPerWeekMinutes: 40 * H, maxOvertimePerDayMinutes: 2 * H } } })).to.throw(
            ScheduleValidationError,
            /ordinaryPerDayMinutes/,
        );
        expect(() =>
            ctxFor({
                rules: {
                    overtime: { ordinaryPerDayMinutes: 8 * H, maxOvertimeInWindow: [{ maxMinutes: 8 * H, windowDays: 7 }] },
                },
            }),
        ).to.throw(ScheduleValidationError, /ordinaryPerWeekMinutes/);
    });

    describe('daily cap (German-style 8 ordinary + 2 overtime)', function () {
        const rules: WorkingTimeRules = {
            overtime: { ordinaryPerDayMinutes: 8 * H, maxOvertimePerDayMinutes: 2 * H },
        };

        it('caps overtime in a single shift', function () {
            const ctx = ctxFor({
                rules,
                shifts: [shift('long', '08:00', '20:00', ['2026-01-05']), shift('ok', '08:00', '18:00', ['2026-01-06'])],
            });
            const state = createState(ctx);

            const long = constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'long@2026-01-05' });
            expect(long.pass).to.equal(false);
            expect(long.actual).to.equal(4 * H); // 12h day = 4h overtime
            expect(long.required).to.equal(2 * H);

            const ok = constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'ok@2026-01-06' });
            expect(ok.pass).to.equal(true);
        });

        it('sees two shifts stacked into one rolling 24h', function () {
            // 08:00-16:00 plus 18:00-23:00 the same day: 13h in one 24h window.
            const ctx = ctxFor({
                rules,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05']), shift('ev', '18:00', '23:00', ['2026-01-05'])],
            });
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            const v = constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'ev@2026-01-05' });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(5 * H);
        });
    });

    describe('rolling-window cap', function () {
        const rules: WorkingTimeRules = {
            overtime: { ordinaryPerWeekMinutes: 40 * H, maxOvertimeInWindow: [{ maxMinutes: 8 * H, windowDays: 7 }] },
        };
        const week = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10'];

        it('allows overtime up to the window cap and refuses beyond', function () {
            const ctx = ctxFor({
                rules,
                shifts: [shift('d', '08:00', '16:00', week), shift('extra', '18:00', '22:00', ['2026-01-10'])],
            });
            // Six 8h days = 48h in 7 days: exactly 8h overtime, at the limit.
            const sixDays = stateWith(
                ctx,
                week.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const sixth = constraint(ctx, 'overtime').verdict!(sixDays, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-10' });
            expect(sixth.pass).to.equal(true);

            // A further 4h pushes the window to 52h: 12h overtime, over the cap.
            const full = stateWith(
                ctx,
                week.map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const v = constraint(ctx, 'overtime').verdict!(full, { employeeId: 'e1', shiftInstanceId: 'extra@2026-01-10' });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(12 * H);
            expect(v.required).to.equal(8 * H);
        });

        it("measures a part-timer's overtime against their contract, not full time", function () {
            const shifts = [shift('d', '08:00', '16:00', week.slice(0, 4))]; // 32h in a week
            const partTime = ctxFor({
                rules,
                employees: [{ id: 'e1', tags: [], timeOff: [], contract: { kind: 'hours', weeklyMinutes: 20 * H } }],
                shifts,
            });
            const fullTime = ctxFor({ rules, employees: [{ id: 'e1', tags: [], timeOff: [] }], shifts });

            const pair = { employeeId: 'e1', shiftInstanceId: 'd@2026-01-08' };
            const assigned: Array<[string, string]> = week.slice(0, 3).map((d) => ['e1', `d@${d}`]);

            // 32h against a 20h contract is 12h overtime — over the 8h cap.
            const pt = constraint(partTime, 'overtime').verdict!(stateWith(partTime, assigned), pair);
            expect(pt.pass).to.equal(false);
            expect(pt.actual).to.equal(12 * H);
            // The same roster against a 40h baseline has no overtime at all.
            expect(constraint(fullTime, 'overtime').verdict!(stateWith(fullTime, assigned), pair).pass).to.equal(true);
        });
    });

    describe('consent', function () {
        const rules: WorkingTimeRules = {
            overtime: { ordinaryPerDayMinutes: 8 * H, requiresConsent: true },
        };
        const nine = shift('nine', '08:00', '17:00', ['2026-01-05']);
        const eight = shift('eight', '08:00', '16:00', ['2026-01-06']);

        it('blocks any overtime for a worker who has not agreed to it', function () {
            const ctx = ctxFor({ rules, shifts: [nine, eight] });
            const state = createState(ctx);
            const v = constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'nine@2026-01-05' });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('has not agreed');
            expect(v.actual).to.equal(1 * H);
            // No overtime, no consent needed.
            expect(constraint(ctx, 'overtime').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'eight@2026-01-06' }).pass).to.equal(true);
        });

        it('permits the same shift once consent is recorded', function () {
            const ctx = ctxFor({
                rules,
                employees: [{ id: 'e1', tags: [], timeOff: [], overtimeConsent: true }],
                shifts: [nine],
            });
            const v = constraint(ctx, 'overtime').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'nine@2026-01-05',
            });
            expect(v.pass).to.equal(true);
        });
    });

    describe('time-off-in-lieu ledger', function () {
        const weekPeriod = { startDate: '2026-01-05', endDate: '2026-01-11' };
        const rules: WorkingTimeRules = {
            overtime: { ordinaryPerWeekMinutes: 40 * H, compensation: 'timeOff', citation: 'EE TLS §44' },
        };
        const sixDays = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10'];

        it('accrues the minutes past the pro-rated weekly baseline', function () {
            const ctx = ctxFor({ period: weekPeriod, rules, shifts: [shift('d', '08:00', '16:00', sixDays)] });
            const state = stateWith(
                ctx,
                sixDays.map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            const ledger = overtimeLedger(state);
            expect(ledger).to.have.length(1);
            expect(ledger[0].kind).to.equal('timeOffInLieu');
            expect(ledger[0].employeeId).to.equal('e1');
            expect(ledger[0].minutes).to.equal(8 * H); // 48h worked, 40h baseline
            expect(ledger[0].citation).to.equal('EE TLS §44');
        });

        it('accrues nothing when overtime is compensated in pay, or when there is none', function () {
            const paid = ctxFor({
                period: weekPeriod,
                rules: { overtime: { ordinaryPerWeekMinutes: 40 * H, compensation: 'pay' } },
                shifts: [shift('d', '08:00', '16:00', sixDays)],
            });
            const paidState = stateWith(
                paid,
                sixDays.map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            expect(overtimeLedger(paidState)).to.have.length(0);

            const light = ctxFor({ period: weekPeriod, rules, shifts: [shift('d', '08:00', '16:00', sixDays.slice(0, 5))] });
            const lightState = stateWith(
                light,
                sixDays.slice(0, 5).map((d) => ['e1', `d@${d}`] as [string, string]),
            );
            expect(overtimeLedger(lightState)).to.have.length(0);
        });
    });
});
