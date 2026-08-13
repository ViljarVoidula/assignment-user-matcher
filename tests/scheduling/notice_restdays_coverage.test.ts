import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState, unassign } from '../../src/scheduling/engine/state';
import { cancellationLedger } from '../../src/scheduling/constraints/notice';
import { compensatoryRestLedger } from '../../src/scheduling/constraints/rest-days';
import { paidMinutesFor } from '../../src/scheduling/constraints/engagement-floor';
import type { ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * Branch coverage for the notice, rest-days, engagement-floor and
 * in-shift-breaks rules. Every number here is caller-supplied configuration —
 * the engine ships shapes, the tests ship a member state's values.
 */

const H = 60;
const PERIOD = { startDate: '2026-01-05', endDate: '2026-02-01' }; // Mon 5 Jan, 4 weeks, Sundays 11/18/25 Jan + 1 Feb

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

/** A published-roster entry, in the shape `ScheduleInput.published.roster` requires. */
function publishedEntry(employeeId: string, shiftInstanceId: string, date: string) {
    return { employeeId, shiftInstanceId, date, reasons: [] };
}

describe('notice, rest-days, engagement and break rule branches', function () {
    describe('notice — verdict', function () {
        it('passes an unknown shift id through', function () {
            const ctx = ctxFor({ rules: { notice: { minNoticeMinutes: 24 * H } }, shifts: [] });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'ghost@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('unknown shift');
        });

        it('passes work inside a matching reference window on the right weekday', function () {
            const ctx = ctxFor({
                rules: { notice: { referenceHours: [{ daysOfWeek: [1], from: '08:00', to: '16:00' }] } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])], // Monday
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('within reference hours');
            expect(v.citation).to.contain('2019/1152');
        });

        it('marks work on a day outside the reference days refusable', function () {
            const ctx = ctxFor({
                rules: { notice: { referenceHours: [{ daysOfWeek: [1], from: '08:00', to: '16:00' }] } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])], // Tuesday, weekday 2
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.severity).to.equal('medium');
            expect(v.message).to.contain('refused without detriment');
            expect(v.citation).to.contain('Art 10');
        });

        it('marks a shift only partly covered by the window refusable', function () {
            // Window opens 09:00; the shift starts 08:00, so one hour falls outside.
            const ctx = ctxFor({
                rules: { notice: { referenceHours: [{ daysOfWeek: [1], from: '09:00', to: '17:00' }] } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('reference hours');
        });

        it('treats an empty daysOfWeek list as every day', function () {
            const ctx = ctxFor({
                rules: { notice: { referenceHours: [{ daysOfWeek: [], from: '06:00', to: '22:00' }] } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-07'])],
            });
            expect(
                constraint(ctx, 'notice').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'd@2026-01-07',
                }).pass,
            ).to.equal(true);
        });

        it('accepts a shift covered by the second of two windows', function () {
            const ctx = ctxFor({
                rules: {
                    notice: {
                        referenceHours: [
                            { daysOfWeek: [6, 7], from: '08:00', to: '16:00' },
                            { daysOfWeek: [1, 2, 3, 4, 5], from: '08:00', to: '16:00' },
                        ],
                    },
                },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            expect(
                constraint(ctx, 'notice').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'd@2026-01-05',
                }).pass,
            ).to.equal(true);
        });

        it('handles a reference window wrapping midnight', function () {
            const ctx = ctxFor({
                rules: { notice: { referenceHours: [{ daysOfWeek: [], from: '20:00', to: '06:00' }] } },
                shifts: [shift('n', '22:00', '06:00', ['2026-01-06'])],
            });
            expect(
                constraint(ctx, 'notice').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'n@2026-01-06',
                }).pass,
            ).to.equal(true);
        });

        it('skips the reference-hours check entirely when the list is empty', function () {
            const ctx = ctxFor({
                rules: { notice: { referenceHours: [] } },
                shifts: [shift('n', '02:00', '05:00', ['2026-01-05'])],
            });
            expect(
                constraint(ctx, 'notice').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'n@2026-01-05',
                }).pass,
            ).to.equal(true);
        });

        it('fails a shift notified inside the notice window, with the shortfall quantified', function () {
            // Published 06:00 on day one; the shift starts 08:00 the next day — 26h given.
            const ctx = ctxFor({
                rules: { notice: { minNoticeMinutes: 48 * H } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
                published: { roster: [], publishedAt: '2026-01-05T06:00' },
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(26 * H);
            expect(v.required).to.equal(48 * H);
            expect(v.unit).to.equal('minutes');
            expect(v.message).to.contain('26.0h');
            expect(v.message).to.contain('refusable without detriment');
        });

        it('passes when the notice given exactly equals the minimum', function () {
            const ctx = ctxFor({
                rules: { notice: { minNoticeMinutes: 26 * H } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
                published: { roster: [], publishedAt: '2026-01-05T06:00' },
            });
            expect(
                constraint(ctx, 'notice').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'd@2026-01-06',
                }).pass,
            ).to.equal(true);
        });

        it('floors the reported notice at zero when publication postdates the start', function () {
            const ctx = ctxFor({
                rules: { notice: { minNoticeMinutes: 24 * H } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
                published: { roster: [], publishedAt: '2026-01-07T12:00' },
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(0);
            expect(v.required).to.equal(24 * H);
        });

        it('anchors a date-only publishedAt at midnight', function () {
            const ctx = ctxFor({
                rules: { notice: { minNoticeMinutes: 32 * H } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
                published: { roster: [], publishedAt: '2026-01-05' },
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-06',
            });
            // Midnight day one to 08:00 day two is 32h — exactly adequate.
            expect(v.pass).to.equal(true);
        });

        it('cannot measure notice without a publication instant, so it passes', function () {
            const ctx = ctxFor({
                rules: { notice: { minNoticeMinutes: 168 * H } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
            });
            expect(
                constraint(ctx, 'notice').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'd@2026-01-06',
                }).pass,
            ).to.equal(true);
        });

        it('reports the reference-hours breach before the notice shortfall', function () {
            const ctx = ctxFor({
                rules: {
                    notice: {
                        referenceHours: [{ daysOfWeek: [5], from: '08:00', to: '16:00' }],
                        minNoticeMinutes: 168 * H,
                    },
                },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06'])],
                published: { roster: [], publishedAt: '2026-01-06T00:00' },
            });
            const v = constraint(ctx, 'notice').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.message).to.contain('reference hours');
            expect(v.actual, 'the reference-hours branch carries no shortfall numbers').to.equal(undefined);
        });
    });

    describe('notice — change after publication', function () {
        const published = {
            roster: [publishedEntry('e1', 'd@2026-01-06', '2026-01-06')],
            publishedAt: '2026-01-05T00:00',
        };
        const shifts = [shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-07'])];

        it('reports nothing when changes are free', function () {
            const ctx = ctxFor({ rules: { notice: { changeAfterPublication: 'free' } }, shifts, published });
            const state = stateWith(ctx, [['e1', 'd@2026-01-07']]);
            expect(constraint(ctx, 'notice').evaluate!(state)).to.have.length(0);
        });

        it('reports nothing when the rule does not constrain publication changes', function () {
            const ctx = ctxFor({ rules: { notice: { minNoticeMinutes: H } }, shifts, published });
            const state = stateWith(ctx, [['e1', 'd@2026-01-07']]);
            expect(constraint(ctx, 'notice').evaluate!(state)).to.have.length(0);
        });

        it('reports nothing when no roster was published', function () {
            const ctx = ctxFor({ rules: { notice: { changeAfterPublication: 'consent' } }, shifts });
            const state = stateWith(ctx, [['e1', 'd@2026-01-07']]);
            expect(constraint(ctx, 'notice').evaluate!(state)).to.have.length(0);
        });

        it('flags only the post-publication addition, and asks for consent (FI)', function () {
            const ctx = ctxFor({ rules: { notice: { changeAfterPublication: 'consent' } }, shifts, published });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-06'], // published — no violation
                ['e1', 'd@2026-01-07'], // added after publication
            ]);
            const violations = constraint(ctx, 'notice').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].shiftInstanceId).to.equal('d@2026-01-07');
            expect(violations[0].employeeId).to.equal('e1');
            expect(violations[0].severity).to.equal('medium');
            expect(violations[0].message).to.contain("employee's consent");
        });

        it('asks for a compelling reason under the cause regime', function () {
            const ctx = ctxFor({ rules: { notice: { changeAfterPublication: 'cause' } }, shifts, published });
            const state = stateWith(ctx, [['e1', 'd@2026-01-07']]);
            const violations = constraint(ctx, 'notice').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].message).to.contain('compelling reason');
        });
    });

    describe('notice — cancellation ledger', function () {
        const shifts = [shift('d', '08:00', '16:00', ['2026-01-06']), shift('short', '09:00', '11:00', ['2026-01-07'])];
        const roster = [
            publishedEntry('e1', 'd@2026-01-06', '2026-01-06'),
            publishedEntry('e1', 'short@2026-01-07', '2026-01-07'),
        ];

        it('returns nothing without a rule or without a compensation amount', function () {
            const ctx = ctxFor({ shifts, published: { roster, publishedAt: '2026-01-05T00:00' } });
            const state = createState(ctx);
            expect(cancellationLedger(state, undefined)).to.have.length(0);
            expect(cancellationLedger(state, { minNoticeMinutes: 24 * H })).to.have.length(0);
        });

        it('pays the greater of the compensation floor and the called hours (NL)', function () {
            const ctx = ctxFor({ shifts, published: { roster, publishedAt: '2026-01-05T00:00' } });
            // Nothing assigned: both published shifts were cancelled.
            const entries = cancellationLedger(createState(ctx), { cancellationCompensationMinutes: 3 * H });
            expect(entries).to.have.length(2);
            const byInstance = new Map(entries.map((e) => [e.reason, e]));
            const full = entries.find((e) => e.reason.includes('d@2026-01-06'))!;
            const stub = entries.find((e) => e.reason.includes('short@2026-01-07'))!;
            expect(byInstance.size).to.equal(2);
            expect(full.kind).to.equal('lateCancellationPay');
            expect(full.employeeId).to.equal('e1');
            // 8h of called work outranks the 3h floor…
            expect(full.minutes).to.equal(8 * H);
            // …while a 2h call is topped up to the 3h floor.
            expect(stub.minutes).to.equal(3 * H);
            expect(full.citation).to.contain('2019/1152');
        });

        it('owes nothing for published assignments the roster kept', function () {
            const ctx = ctxFor({ shifts, published: { roster, publishedAt: '2026-01-05T00:00' } });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-06'],
                ['e1', 'short@2026-01-07'],
            ]);
            expect(cancellationLedger(state, { cancellationCompensationMinutes: 3 * H })).to.have.length(0);
        });

        it('falls back to the compensation floor when the published instance no longer exists', function () {
            const ctx = ctxFor({
                shifts,
                published: {
                    roster: [publishedEntry('e1', 'ghost@2026-01-08', '2026-01-08')],
                    publishedAt: '2026-01-05T00:00',
                },
            });
            const entries = cancellationLedger(createState(ctx), { cancellationCompensationMinutes: 3 * H });
            expect(entries).to.have.length(1);
            expect(entries[0].minutes).to.equal(3 * H);
        });
    });

    describe('rest-days — Sunday and holiday bars', function () {
        it('passes an unknown shift id through', function () {
            const ctx = ctxFor({ rules: { restDays: { sundayAllowed: false } }, shifts: [] });
            const v = constraint(ctx, 'rest-days').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'ghost@2026-01-11',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('unknown shift');
        });

        it('bars only Sundays under a Sunday bar', function () {
            const ctx = ctxFor({
                rules: { restDays: { sundayAllowed: false } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-10', '2026-01-11'])], // Sat + Sun
            });
            const c = constraint(ctx, 'rest-days');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-10' }).pass).to.equal(true);
            const sunday = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-11' });
            expect(sunday.pass).to.equal(false);
            expect(sunday.severity).to.equal('hard');
            expect(sunday.message).to.contain('Sunday');
        });

        it('leaves Sundays open when the caller grants an exception', function () {
            const ctx = ctxFor({
                rules: { restDays: { holidayAllowed: false } }, // sundayAllowed left unset
                shifts: [shift('d', '08:00', '16:00', ['2026-01-11'])],
            });
            expect(
                constraint(ctx, 'rest-days').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'd@2026-01-11',
                }).pass,
            ).to.equal(true);
        });

        it('bars only the declared public holidays under a holiday bar', function () {
            const ctx = ctxFor({
                rules: { restDays: { holidayAllowed: false } },
                calendar: { publicHolidays: ['2026-01-06'] },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-07'])],
            });
            const c = constraint(ctx, 'rest-days');
            const state = createState(ctx);
            const holiday = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-06' });
            expect(holiday.pass).to.equal(false);
            expect(holiday.message).to.contain('2026-01-06');
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-07' }).pass).to.equal(true);
        });
    });

    describe('rest-days — free-Sunday quotas', function () {
        const SUNDAYS = ['2026-01-11', '2026-01-18', '2026-01-25', '2026-02-01'];
        const sundayShifts = [shift('sun', '10:00', '14:00', SUNDAYS)];
        const workAll = (id: string) => SUNDAYS.map((d) => [id, `sun@${d}`] as [string, string]);

        it('reports nothing when no quota is configured', function () {
            const ctx = ctxFor({ rules: { restDays: { sundayAllowed: true } }, shifts: sundayShifts });
            expect(constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, workAll('e1')))).to.have.length(0);
        });

        it('reports nothing when the period contains no Sundays', function () {
            const ctx = ctxFor({
                period: { startDate: '2026-01-05', endDate: '2026-01-09' }, // Mon–Fri
                rules: { restDays: { minFreeSundaysPer: { count: 1, weeks: 4 } } },
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            expect(constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, [['e1', 'd@2026-01-05']]))).to.have.length(0);
        });

        it('pro-rates the Polish one-in-four rolling quota and flags the breach', function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPer: { count: 1, weeks: 4 } } },
                employees: [
                    { id: 'e1', tags: [], timeOff: [] },
                    { id: 'e2', tags: [], timeOff: [] },
                ],
                shifts: sundayShifts,
            });
            // Four Sundays in the period; e1 works all of them, e2 none.
            const violations = constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, workAll('e1')));
            expect(violations).to.have.length(1);
            expect(violations[0].employeeId).to.equal('e1');
            expect(violations[0].actual).to.equal(0);
            expect(violations[0].required).to.equal(1);
            expect(violations[0].unit).to.equal('count');
            expect(violations[0].severity).to.equal('medium');
            expect(violations[0].message).to.contain('rolling');
        });

        it('accepts a roster that leaves the pro-rated share free', function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPer: { count: 1, weeks: 4 } } },
                shifts: sundayShifts,
            });
            // Three of four Sundays worked leaves one free — exactly the share.
            const state = stateWith(
                ctx,
                SUNDAYS.slice(0, 3).map((d) => ['e1', `sun@${d}`] as [string, string]),
            );
            expect(constraint(ctx, 'rest-days').evaluate!(state)).to.have.length(0);
        });

        it('never demands a fraction: a quota window longer than the period rounds to zero', function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPer: { count: 1, weeks: 8 } } },
                shifts: sundayShifts,
            });
            expect(constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, workAll('e1')))).to.have.length(0);
        });

        it("pro-rates Germany's 15 free Sundays a year and flags the breach", function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPerYear: 15 } },
                shifts: sundayShifts,
            });
            // floor(15 × 4 / 52) = 1 free Sunday owed in a 4-week roster.
            const violations = constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, workAll('e1')));
            expect(violations).to.have.length(1);
            expect(violations[0].actual).to.equal(0);
            expect(violations[0].required).to.equal(1);
            expect(violations[0].message).to.contain('annual');
        });

        it('lets a small annual quota round to zero over a short period', function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPerYear: 12 } }, // floor(12 × 4 / 52) = 0
                shifts: sundayShifts,
            });
            expect(constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, workAll('e1')))).to.have.length(0);
        });

        it('applies both quota forms independently when both are set', function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPerYear: 15, minFreeSundaysPer: { count: 1, weeks: 4 } } },
                shifts: sundayShifts,
            });
            const violations = constraint(ctx, 'rest-days').evaluate!(stateWith(ctx, workAll('e1')));
            expect(violations).to.have.length(2);
            const kinds = violations.map((v) => v.message);
            expect(kinds.some((m) => m.includes('rolling'))).to.equal(true);
            expect(kinds.some((m) => m.includes('annual'))).to.equal(true);
        });

        it('only counts Sunday shifts against the quota, not weekday work', function () {
            const ctx = ctxFor({
                rules: { restDays: { minFreeSundaysPer: { count: 1, weeks: 4 } } },
                shifts: [...sundayShifts, shift('mon', '08:00', '16:00', ['2026-01-05'])],
            });
            // Heavy weekday work plus three Sundays keeps the fourth free.
            const state = stateWith(ctx, [
                ['e1', 'mon@2026-01-05'],
                ...SUNDAYS.slice(0, 3).map((d) => ['e1', `sun@${d}`] as [string, string]),
            ]);
            expect(constraint(ctx, 'rest-days').evaluate!(state)).to.have.length(0);
        });
    });

    describe('rest-days — compensatory rest ledger', function () {
        const shifts = [
            shift('sun', '10:00', '14:00', ['2026-01-11']),
            shift('hol', '10:00', '14:00', ['2026-01-06']),
            shift('mon', '08:00', '16:00', ['2026-01-05']),
        ];

        it('returns nothing without a rule or a deadline table', function () {
            const ctx = ctxFor({ shifts });
            const state = stateWith(ctx, [['e1', 'sun@2026-01-11']]);
            expect(compensatoryRestLedger(state, undefined)).to.have.length(0);
            expect(compensatoryRestLedger(state, { sundayAllowed: true })).to.have.length(0);
        });

        it('dates the German substitute rest day: two weeks for a Sunday, eight for a holiday', function () {
            const ctx = ctxFor({ shifts, calendar: { publicHolidays: ['2026-01-06'] } });
            const state = stateWith(ctx, [
                ['e1', 'sun@2026-01-11'],
                ['e1', 'hol@2026-01-06'],
                ['e1', 'mon@2026-01-05'], // plain weekday — creates no debt
            ]);
            const entries = compensatoryRestLedger(state, { compensatoryRestWithinDays: { sunday: 14, holiday: 56 } });
            expect(entries).to.have.length(2);
            const sunday = entries.find((e) => e.reason.includes('a Sunday'))!;
            const holiday = entries.find((e) => e.reason.includes('a public holiday'))!;
            expect(sunday.kind).to.equal('substituteRestDay');
            expect(sunday.employeeId).to.equal('e1');
            expect(sunday.dueBy).to.equal('2026-01-25');
            expect(sunday.reason).to.contain('2026-01-11');
            expect(holiday.dueBy).to.equal('2026-03-03');
            expect(holiday.citation).to.contain('Sunday/holiday');
        });

        it('treats a holiday that falls on a Sunday as holiday work', function () {
            const ctx = ctxFor({
                shifts: [shift('sun', '10:00', '14:00', ['2026-01-11'])],
                calendar: { publicHolidays: ['2026-01-11'] },
            });
            const state = stateWith(ctx, [['e1', 'sun@2026-01-11']]);
            const entries = compensatoryRestLedger(state, { compensatoryRestWithinDays: { sunday: 3, holiday: 8 } });
            expect(entries).to.have.length(1);
            expect(entries[0].dueBy).to.equal('2026-01-19'); // holiday deadline, not the Sunday one
            expect(entries[0].reason).to.contain('a public holiday');
        });

        it('creates no debt for a day the deadline table does not cover', function () {
            const ctx = ctxFor({ shifts, calendar: { publicHolidays: ['2026-01-06'] } });
            const state = stateWith(ctx, [
                ['e1', 'sun@2026-01-11'],
                ['e1', 'hol@2026-01-06'],
            ]);
            // Only Sundays create a debt here; the holiday column is absent.
            const entries = compensatoryRestLedger(state, { compensatoryRestWithinDays: { sunday: 6 } });
            expect(entries).to.have.length(1);
            expect(entries[0].dueBy).to.equal('2026-01-17');
            expect(entries[0].reason).to.contain('a Sunday');
        });

        it('ignores instances whose assignees were all removed again', function () {
            const ctx = ctxFor({ shifts });
            const state = stateWith(ctx, [['e1', 'sun@2026-01-11']]);
            unassign(state, 'e1', 'sun@2026-01-11');
            expect(compensatoryRestLedger(state, { compensatoryRestWithinDays: { sunday: 14 } })).to.have.length(0);
        });
    });

    describe('engagement floor', function () {
        it('passes an unknown shift id through', function () {
            const ctx = ctxFor({ rules: { engagement: { minShiftMinutes: 3 * H } }, shifts: [] });
            const v = constraint(ctx, 'engagement-floor').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'ghost@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('unknown shift');
        });

        it('accepts any duration when no minimum is configured', function () {
            const ctx = ctxFor({
                rules: { engagement: { minPaidMinutesPerEngagement: 3 * H } }, // pay floor only
                shifts: [shift('stub', '09:00', '09:30', ['2026-01-05'])],
            });
            expect(
                constraint(ctx, 'engagement-floor').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'stub@2026-01-05',
                }).pass,
            ).to.equal(true);
        });

        it('rejects a session below the Belgian 3-hour minimum, quantified', function () {
            const ctx = ctxFor({
                rules: { engagement: { minShiftMinutes: 3 * H } },
                shifts: [shift('short', '09:00', '11:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'engagement-floor').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'short@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.severity).to.equal('hard');
            expect(v.actual).to.equal(2 * H);
            expect(v.required).to.equal(3 * H);
            expect(v.unit).to.equal('minutes');
            expect(v.message).to.contain('minimum engagement');
        });

        it('accepts a session exactly at the minimum', function () {
            const ctx = ctxFor({
                rules: { engagement: { minShiftMinutes: 3 * H } },
                shifts: [shift('exact', '09:00', '12:00', ['2026-01-05'])],
            });
            expect(
                constraint(ctx, 'engagement-floor').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'exact@2026-01-05',
                }).pass,
            ).to.equal(true);
        });

        it('reports a defective template once per staffed instance, not per assignee', function () {
            const ctx = ctxFor({
                rules: { engagement: { minShiftMinutes: 3 * H } },
                employees: [
                    { id: 'a', tags: [], timeOff: [] },
                    { id: 'b', tags: [], timeOff: [] },
                ],
                shifts: [
                    shift('short', '09:00', '11:00', ['2026-01-05', '2026-01-06']),
                    shift('ok', '09:00', '13:00', ['2026-01-05']),
                ],
            });
            const state = stateWith(ctx, [
                ['a', 'short@2026-01-05'],
                ['b', 'short@2026-01-05'], // second assignee, same defect
                ['a', 'ok@2026-01-05'], // long enough
                // short@2026-01-06 stays unstaffed and must not be reported
            ]);
            const violations = constraint(ctx, 'engagement-floor').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].shiftInstanceId).to.equal('short@2026-01-05');
            expect(violations[0].actual).to.equal(2 * H);
            expect(violations[0].required).to.equal(3 * H);
        });

        it('pays the greater of worked and the engagement floor, and only that', function () {
            const ctx = ctxFor({
                shifts: [shift('call', '09:00', '10:00', ['2026-01-05']), shift('full', '08:00', '16:00', ['2026-01-05'])],
            });
            const call = ctx.instanceById.get('call@2026-01-05')!;
            const full = ctx.instanceById.get('full@2026-01-05')!;
            // No rule, or a rule without a pay floor: pay the worked minutes.
            expect(paidMinutesFor(call, undefined)).to.equal(H);
            expect(paidMinutesFor(call, { minShiftMinutes: 3 * H })).to.equal(H);
            // The NL 3h call-out floor tops up a short call…
            expect(paidMinutesFor(call, { minPaidMinutesPerEngagement: 3 * H })).to.equal(3 * H);
            // …but never trims a longer one.
            expect(paidMinutesFor(full, { minPaidMinutesPerEngagement: 3 * H })).to.equal(8 * H);
        });
    });

    describe('in-shift breaks', function () {
        const deRules = [
            { afterMinutes: 6 * H, minMinutes: 30 },
            { afterMinutes: 9 * H, minMinutes: 45 },
        ];

        it('passes an unknown shift id through', function () {
            const ctx = ctxFor({ rules: { breaks: deRules }, shifts: [] });
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'ghost@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('unknown shift');
        });

        it('owes nothing at or below the trigger', function () {
            const ctx = ctxFor({
                rules: { breaks: deRules },
                shifts: [shift('six', '08:00', '14:00', ['2026-01-05'])], // exactly 6h working
            });
            expect(
                constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                    employeeId: 'e1',
                    shiftInstanceId: 'six@2026-01-05',
                }).pass,
            ).to.equal(true);
        });

        it('escalates to the strictest applicable tier (DE 45 min past nine hours)', function () {
            // 10h span, 30 min unpaid: 9.5h working — the 45-minute tier applies
            // and the 30-minute break no longer suffices.
            const ctx = ctxFor({
                rules: { breaks: deRules },
                shifts: [shift('long', '08:00', '18:00', ['2026-01-05'], { unpaidBreakMinutes: 30 })],
            });
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'long@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.severity).to.equal('medium');
            expect(v.actual).to.equal(30);
            expect(v.required).to.equal(45);
            expect(v.unit).to.equal('minutes');
            expect(v.message).to.contain('provides only 0.5h');
        });

        it('accepts the mid-tier shift whose break matches its own tier', function () {
            // 7.5h span, 30 min unpaid: 7h working — the 30-minute tier is met.
            const ctx = ctxFor({
                rules: { breaks: deRules },
                shifts: [shift('mid', '08:00', '15:30', ['2026-01-05'], { unpaidBreakMinutes: 30 })],
            });
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'mid@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('break entitlement satisfied');
        });

        it('quantifies a wholly missing break', function () {
            const ctx = ctxFor({
                rules: { breaks: [{ afterMinutes: 6 * H, minMinutes: 30 }] },
                shifts: [shift('d', '08:00', '15:00', ['2026-01-05'])],
            });
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(0);
            expect(v.required).to.equal(30);
        });

        it('refuses an interruptible break in the per-pair verdict too (C-107/19)', function () {
            const ctx = ctxFor({
                rules: { breaks: [{ afterMinutes: 6 * H, minMinutes: 30, interruptible: true }] },
                shifts: [shift('d', '08:00', '17:00', ['2026-01-05'], { unpaidBreakMinutes: 60 })],
            });
            const v = constraint(ctx, 'in-shift-breaks').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            // A 60-minute break provides nothing when it is interruptible.
            expect(v.actual).to.equal(0);
            expect(v.required).to.equal(30);
            expect(v.message).to.contain('C-107/19');
        });

        it('reports the defect once per staffed instance and names the trigger', function () {
            const ctx = ctxFor({
                rules: { breaks: deRules },
                employees: [
                    { id: 'a', tags: [], timeOff: [] },
                    { id: 'b', tags: [], timeOff: [] },
                ],
                shifts: [shift('long', '08:00', '18:00', ['2026-01-05', '2026-01-06'])],
            });
            const state = stateWith(ctx, [
                ['a', 'long@2026-01-05'],
                ['b', 'long@2026-01-05'],
                // long@2026-01-06 unstaffed — not reported
            ]);
            const violations = constraint(ctx, 'in-shift-breaks').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].shiftInstanceId).to.equal('long@2026-01-05');
            expect(violations[0].required).to.equal(45);
            expect(violations[0].message).to.contain('after 9.0h');
        });

        it('names C-107/19 in the roster-level report for an interruptible break', function () {
            const ctx = ctxFor({
                rules: { breaks: [{ afterMinutes: 6 * H, minMinutes: 30, interruptible: true }] },
                shifts: [shift('d', '08:00', '17:00', ['2026-01-05'], { unpaidBreakMinutes: 45 })],
            });
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            const violations = constraint(ctx, 'in-shift-breaks').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].actual).to.equal(0);
            expect(violations[0].message).to.contain('C-107/19');
        });

        it('skips satisfied instances in the roster-level report', function () {
            const ctx = ctxFor({
                rules: { breaks: deRules },
                shifts: [shift('mid', '08:00', '15:30', ['2026-01-05'], { unpaidBreakMinutes: 30 })],
            });
            const state = stateWith(ctx, [['e1', 'mid@2026-01-05']]);
            expect(constraint(ctx, 'in-shift-breaks').evaluate!(state)).to.have.length(0);
        });
    });
});
