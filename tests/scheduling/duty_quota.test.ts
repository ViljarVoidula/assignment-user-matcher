import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import type { DutyClassification, ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

const H = 60;
const PERIOD = { startDate: '2026-01-05', endDate: '2026-02-01' }; // Mon 5 Jan, 4 weeks

/** Off-premises stand-by that never counts as working time — the pure quota case. */
const STANDBY: DutyClassification = {
    countsAsWorkingTime: 0,
    countsTowardRestClock: true,
    classificationNote: 'off-premises stand-by, 30-minute response',
};

function ctxFor(input: Partial<ScheduleInput> & { rules?: WorkingTimeRules }): ModelContext {
    return buildModel({
        period: input.period ?? PERIOD,
        employees: input.employees ?? [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: input.shifts ?? [],
        rules: input.rules,
    });
}

function constraint(ctx: ModelContext, id: string) {
    const c = ctx.constraints.find((x) => x.id === id);
    expect(c, `constraint ${id} registered`).to.exist;
    return c!;
}

/** A 12h stand-by duty tagged for the quota. */
function standby(dates: string[]): ShiftTemplate {
    return {
        id: 'sb',
        name: 'STANDBY',
        startTime: '18:00',
        endTime: '06:00',
        dates,
        shiftTypeTag: 'standby',
        duty: STANDBY,
    };
}

function stateWith(ctx: ModelContext, pairs: Array<[string, string]>) {
    const state = createState(ctx);
    for (const [employeeId, instanceId] of pairs) assign(state, employeeId, instanceId, []);
    return state;
}

describe('duty-quota rule', function () {
    it('registers only when quotas are configured', function () {
        expect(ctxFor({}).constraints.some((c) => c.id === 'duty-quota')).to.equal(false);
        const ctx = ctxFor({ rules: { dutyQuotas: [{ shiftTypeTag: 'standby', maxMinutes: 30 * H, windowDays: 28 }] } });
        expect(ctx.constraints.some((c) => c.id === 'duty-quota')).to.equal(true);
    });

    it('caps elapsed duty minutes over a rolling window', function () {
        const rules: WorkingTimeRules = {
            dutyQuotas: [{ shiftTypeTag: 'standby', maxMinutes: 24 * H, windowDays: 7, label: 'standby 24h/week' }],
        };
        const ctx = ctxFor({ rules, shifts: [standby(['2026-01-05', '2026-01-07', '2026-01-09'])] });

        // Two 12h duties in the window: exactly at the 24h quota.
        const second = constraint(ctx, 'duty-quota').verdict!(stateWith(ctx, [['e1', 'sb@2026-01-05']]), {
            employeeId: 'e1',
            shiftInstanceId: 'sb@2026-01-07',
        });
        expect(second.pass).to.equal(true);

        // A third within the same 7 days: 36h of stand-by, over the quota.
        const third = constraint(ctx, 'duty-quota').verdict!(
            stateWith(ctx, [
                ['e1', 'sb@2026-01-05'],
                ['e1', 'sb@2026-01-07'],
            ]),
            { employeeId: 'e1', shiftInstanceId: 'sb@2026-01-09' },
        );
        expect(third.pass).to.equal(false);
        expect(third.actual).to.equal(36 * H);
        expect(third.required).to.equal(24 * H);
        expect(third.message).to.contain('standby 24h/week');
    });

    it('probes rolling windows, not calendar weeks', function () {
        // Duties on Thu 8th, Sat 10th and Mon 12th: no calendar week (Mon-Sun)
        // holds all three, but the rolling 7 days from the 8th does.
        const rules: WorkingTimeRules = { dutyQuotas: [{ shiftTypeTag: 'standby', maxMinutes: 30 * H, windowDays: 7 }] };
        const ctx = ctxFor({ rules, shifts: [standby(['2026-01-08', '2026-01-10', '2026-01-12'])] });
        const v = constraint(ctx, 'duty-quota').verdict!(
            stateWith(ctx, [
                ['e1', 'sb@2026-01-08'],
                ['e1', 'sb@2026-01-10'],
            ]),
            { employeeId: 'e1', shiftInstanceId: 'sb@2026-01-12' },
        );
        expect(v.pass).to.equal(false);
        expect(v.actual).to.equal(36 * H);
    });

    it('caps occurrence counts independently of minutes', function () {
        const rules: WorkingTimeRules = { dutyQuotas: [{ shiftTypeTag: 'standby', maxCount: 2, windowDays: 7 }] };
        const ctx = ctxFor({ rules, shifts: [standby(['2026-01-05', '2026-01-07', '2026-01-09', '2026-01-14'])] });

        const third = constraint(ctx, 'duty-quota').verdict!(
            stateWith(ctx, [
                ['e1', 'sb@2026-01-05'],
                ['e1', 'sb@2026-01-07'],
            ]),
            { employeeId: 'e1', shiftInstanceId: 'sb@2026-01-09' },
        );
        expect(third.pass).to.equal(false);
        expect(third.actual).to.equal(3);
        expect(third.required).to.equal(2);
        expect(third.unit).to.equal('count');

        // The same third duty a week later sits outside every crowded window.
        const spread = constraint(ctx, 'duty-quota').verdict!(
            stateWith(ctx, [
                ['e1', 'sb@2026-01-05'],
                ['e1', 'sb@2026-01-07'],
            ]),
            { employeeId: 'e1', shiftInstanceId: 'sb@2026-01-14' },
        );
        expect(spread.pass).to.equal(true);
    });

    it('ignores duties of other types and untagged shifts', function () {
        const rules: WorkingTimeRules = { dutyQuotas: [{ shiftTypeTag: 'standby', maxMinutes: 1 * H, windowDays: 7 }] };
        const night: ShiftTemplate = {
            id: 'n',
            name: 'NIGHT',
            startTime: '22:00',
            endTime: '06:00',
            dates: ['2026-01-06'],
            shiftTypeTag: 'night',
        };
        const plain: ShiftTemplate = { id: 'p', name: 'PLAIN', startTime: '08:00', endTime: '16:00', dates: ['2026-01-08'] };
        const ctx = ctxFor({ rules, shifts: [standby(['2026-01-05']), night, plain] });
        const state = stateWith(ctx, [['e1', 'sb@2026-01-05']]); // quota already exhausted

        expect(
            constraint(ctx, 'duty-quota').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'n@2026-01-06' }).pass,
        ).to.equal(true);
        expect(
            constraint(ctx, 'duty-quota').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'p@2026-01-08' }).pass,
        ).to.equal(true);
    });
});
