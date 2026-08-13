import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { shiftCostCents } from '../../src/scheduling/cost';
import { checkCompliance, hours, solveSchedule, weeklyAverageOver } from '../../src/scheduling';
import type { Employee, EmployeeCost, ModelContext, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * Estonian Töölepingu seadus, expressed as plain caller configuration.
 *
 * This suite is the verification that the engine holds every *piece* the TLS
 * needs — the values live here in the test, exactly as an LLM or template
 * would supply them, and no jurisdiction pack is involved. If a section of the
 * statute cannot be written down in this file, the engine is missing a shape.
 */

const H = 60;

/** TLS as typed configuration: §43, §44, §46, §47, §48, §50, §51, §52. */
function tlsRules(): WorkingTimeRules {
    return {
        // §51: 11h consecutive rest per 24h; agreements below it are void.
        dailyRest: { minMinutes: hours(11), perWindowMinutes: hours(24) },
        // §52: 48h weekly rest; under summarised working time, 36h every week
        // with a 48h average over the accounting period.
        weeklyRest: { minMinutes: hours(48), windowDays: 7, absoluteFloorMinutes: hours(36), averageOverDays: 28 },
        workingTime: {
            // §43 full time 8h/day; §46 shift incl. overtime capped at 12h.
            maxPerShiftMinutes: hours(12),
            maxPerDayMinutes: hours(8),
            maxPerDayExtendedMinutes: hours(12),
            dayAverageWindowDays: 28,
            // §46: 48h per seven days on average over four months.
            rollingAverages: [weeklyAverageOver(48, 120, 'TLS §46 48h/week over 4 months')],
            neutraliseAbsenceKinds: ['annualLeave', 'sick'],
        },
        // §44: overtime only by agreement, compensated by default in time off;
        // the 12h shift ceiling implies at most 4h over the 8h ordinary day.
        overtime: {
            ordinaryPerDayMinutes: hours(8),
            ordinaryPerWeekMinutes: hours(40),
            maxOvertimePerDayMinutes: hours(4),
            requiresConsent: true,
            compensation: 'timeOff',
            citation: 'EE Töölepingu seadus §44',
        },
        // §48: a stand-by (valveaeg) volume ceiling — the number is the
        // caller's, the shape is the engine's.
        dutyQuotas: [
            {
                shiftTypeTag: 'valveaeg',
                maxMinutes: hours(30),
                windowDays: 28,
                label: 'valveaeg 30h / accounting month',
                citation: 'EE Töölepingu seadus §48',
            },
        ],
        // §50: night is 22:00-06:00, averaged 8h per 24h; absolute for special risks.
        nightWork: {
            window: { from: '22:00', to: '06:00' },
            qualifiesAfterMinutes: hours(3),
            maxShiftMinutes: hours(8),
            averageWindowDays: 7,
            absoluteWhenHazardous: true,
        },
        // §47: 30 minutes once the working day exceeds 6 hours.
        breaks: [{ afterMinutes: hours(6), minMinutes: 30, paid: false }],
    };
}

/** §45 premiums (night 1.25x, holiday 2x, largest wins) and §48 stand-by pay ≥ 1/10. */
function tlsCost(hourlyRateCents: number): EmployeeCost {
    return {
        hourlyRateCents,
        premiums: [
            { predicate: 'night', multiplier: 1.25 },
            { predicate: 'holiday', multiplier: 2 },
        ],
        stacking: 'max',
        overtimeMultiplier: 1.5,
        standbyRateFraction: 0.1,
    };
}

const WEEK = { startDate: '2026-01-05', endDate: '2026-01-11' }; // Mon-Sun
const FORTNIGHT = { startDate: '2026-01-05', endDate: '2026-01-18' };

function shift(id: string, start: string, end: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: start, endTime: end, dates, ...extra };
}

const valveaeg = (dates: string[]): ShiftTemplate =>
    shift('sb', '18:00', '06:00', dates, {
        shiftTypeTag: 'valveaeg',
        minEmployees: 0,
        duty: {
            countsAsWorkingTime: 0,
            countsTowardRestClock: false,
            classificationNote: 'off-premises valveaeg, TLS §48: rest possibility preserved',
        },
    });

function constraint(ctx: ModelContext, id: string) {
    const c = ctx.constraints.find((x) => x.id === id);
    expect(c, `constraint ${id} registered`).to.exist;
    return c!;
}

describe('Estonian TLS as plain configuration', function () {
    it('solves a compliant week under the full rule set, with TOIL and the bill', function () {
        const employees: Employee[] = [
            { id: 'mari', tags: [], timeOff: [], overtimeConsent: true, cost: tlsCost(1500) },
            { id: 'jaan', tags: [], timeOff: [], cost: tlsCost(1500) },
        ];
        // Mon-Fri 08:00-17:00 with the §47 half-hour break: 8.5h working days.
        const days = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'];
        const result = solveSchedule({
            period: WEEK,
            employees: [employees[0]],
            shifts: [shift('d', '08:00', '17:00', days, { unpaidBreakMinutes: 30 })],
            rules: tlsRules(),
            objectives: { costWeightPerEuro: 1 },
            seed: 3,
            timeBudgetMs: 300,
        });

        expect(result.violations.filter((v) => v.severity === 'hard')).to.deep.equal([]);
        expect(result.stats.unfilledSlots).to.equal(0);
        expect(result.provenance?.profilingFree).to.equal(true);

        // 5 x 8.5h = 42.5h against the 40h baseline: 2.5h owed as time off (§44).
        const toil = (result.ledger ?? []).filter((e) => e.kind === 'timeOffInLieu');
        expect(toil).to.have.length(1);
        expect(toil[0].minutes).to.equal(150);
        expect(toil[0].citation).to.contain('§44');

        // 42.5 working hours at 15.00 €/h, no premium bands touched.
        expect(result.cost?.totalCents).to.equal(42.5 * 1500);
    });

    it('refuses overtime without the §44 agreement and accepts it with one', function () {
        const nine = shift('nine', '08:00', '17:30', ['2026-01-05'], { unpaidBreakMinutes: 30 }); // 9h working
        const build = (employee: Employee) =>
            buildModel({ period: WEEK, employees: [employee], shifts: [nine], rules: tlsRules() });

        const withoutConsent = build({ id: 'mari', tags: [], timeOff: [] });
        const refused = constraint(withoutConsent, 'overtime').verdict!(createState(withoutConsent), {
            employeeId: 'mari',
            shiftInstanceId: 'nine@2026-01-05',
        });
        expect(refused.pass).to.equal(false);
        expect(refused.message).to.contain('has not agreed');
        expect(refused.citation).to.equal('EE Töölepingu seadus §44');

        const withConsent = build({ id: 'mari', tags: [], timeOff: [], overtimeConsent: true });
        expect(
            constraint(withConsent, 'overtime').verdict!(createState(withConsent), {
                employeeId: 'mari',
                shiftInstanceId: 'nine@2026-01-05',
            }).pass,
        ).to.equal(true);
    });

    it('keeps a shift including overtime inside 12h: at most 4h over the ordinary day', function () {
        const thirteen = shift('x', '08:00', '21:00', ['2026-01-05']); // 13h working
        const ctx = buildModel({
            period: WEEK,
            employees: [{ id: 'mari', tags: [], timeOff: [], overtimeConsent: true }],
            shifts: [thirteen],
            rules: tlsRules(),
        });
        const v = constraint(ctx, 'overtime').verdict!(createState(ctx), {
            employeeId: 'mari',
            shiftInstanceId: 'x@2026-01-05',
        });
        expect(v.pass).to.equal(false);
        expect(v.actual).to.equal(5 * H);
        expect(v.required).to.equal(4 * H);
    });

    it('caps valveaeg at the configured monthly volume without consuming working time', function () {
        const dates = ['2026-01-05', '2026-01-07', '2026-01-09'];
        const ctx = buildModel({
            period: FORTNIGHT,
            employees: [{ id: 'mari', tags: [], timeOff: [] }],
            shifts: [valveaeg(dates)],
            rules: tlsRules(),
        });
        const state = createState(ctx);
        assign(state, 'mari', 'sb@2026-01-05', []);
        assign(state, 'mari', 'sb@2026-01-07', []);

        // 24h of stand-by held, none of it working time.
        expect(state.minutesByEmployee.get('mari')).to.equal(0);

        const v = constraint(ctx, 'duty-quota').verdict!(state, { employeeId: 'mari', shiftInstanceId: 'sb@2026-01-09' });
        expect(v.pass).to.equal(false);
        expect(v.actual).to.equal(36 * H);
        expect(v.required).to.equal(30 * H);
        expect(v.citation).to.equal('EE Töölepingu seadus §48');
    });

    it('pays valveaeg at a tenth of the wage and holidays at double (§45, §48)', function () {
        const ctx = buildModel({
            period: WEEK,
            employees: [{ id: 'mari', tags: [], timeOff: [], cost: tlsCost(1500) }],
            shifts: [valveaeg(['2026-01-05']), shift('hol', '08:00', '16:00', ['2026-01-06'])],
            rules: tlsRules(),
            calendar: { publicHolidays: ['2026-01-06'] },
        });
        // 12h of pure stand-by: 12 x 1.50 € = 18.00 €.
        expect(shiftCostCents(ctx.instanceById.get('sb@2026-01-05')!, tlsCost(1500))).to.equal(12 * 150);
        // 8h on a public holiday at 2x.
        expect(shiftCostCents(ctx.instanceById.get('hol@2026-01-06')!, tlsCost(1500))).to.equal(8 * 1500 * 2);
    });

    it('flags a hand-edited roster that breaks the §51/§52 rest rules', function () {
        const days = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-10', '2026-01-11'];
        const roster = days.map((date) => ({ shiftInstanceId: `d@${date}`, employeeId: 'mari', date, reasons: [] }));
        const report = checkCompliance(
            {
                period: WEEK,
                employees: [{ id: 'mari', tags: [], timeOff: [], overtimeConsent: true }],
                shifts: [shift('d', '08:00', '16:00', days)],
                rules: tlsRules(),
            },
            roster,
        );
        // Seven straight 8h days leave no 36h rest in the week.
        expect(report.compliant).to.equal(false);
        expect(report.violations.some((v) => v.constraintId === 'weekly-rest')).to.equal(true);
    });
});
