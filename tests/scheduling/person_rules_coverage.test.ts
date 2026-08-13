import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { fairnessPenalty } from '../../src/scheduling/constraints/fairness';
import { preferenceScore } from '../../src/scheduling/constraints/availability';
import { holds } from '../../src/scheduling/constraints/qualification';
import { protectionLedger } from '../../src/scheduling/constraints/protections';
import type { Employee, ModelContext, ScheduleInput, ShiftTemplate, WorkingTimeRules } from '../../src/scheduling';

/**
 * Person-level rule coverage: fairness, availability, qualification,
 * protections, group composition and contract limits. Every legal number is
 * caller-supplied — the library ships shapes, the tests ship values.
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

const emp = (id: string, extra: Partial<Employee> = {}): Employee => ({ id, tags: [], timeOff: [], ...extra });

describe('person-level rules coverage', function () {
    describe('fairness', function () {
        const two = [emp('e1'), emp('e2')];

        it('stays purely soft without hardMaxSpread, and never scores a single pair', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'shifts' }] },
                employees: two,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-07', '2026-01-09'])],
            });
            const c = constraint(ctx, 'fairness');
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-05'],
                ['e1', 'd@2026-01-07'],
                ['e1', 'd@2026-01-09'],
            ]);
            // Spread is 3-0 but no hard cap was configured.
            expect(c.evaluate!(state)).to.have.length(0);
            // Fairness is whole-roster only: pair hooks are silent by construction.
            expect(c.delta(state, { employeeId: 'e2', shiftInstanceId: 'd@2026-01-05' })).to.equal(0);
            expect(c.explain(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-05' })).to.equal(null);
        });

        it('flags a shifts spread beyond hardMaxSpread, naming the most-loaded person', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'shifts', hardMaxSpread: 2 }] },
                employees: two,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-07', '2026-01-09'])],
            });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-05'],
                ['e1', 'd@2026-01-07'],
                ['e1', 'd@2026-01-09'],
            ]);
            const violations = constraint(ctx, 'fairness').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].severity).to.equal('medium');
            expect(violations[0].employeeId).to.equal('e1');
            expect(violations[0].actual).to.equal(3);
            expect(violations[0].required).to.equal(2);
            expect(violations[0].unit).to.equal('count');
            expect(violations[0].message).to.contain('shifts spread across the team is 3');
            expect(violations[0].message).to.contain('(highest: "e1" at 3)');
        });

        it('accepts a spread at or under the cap', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'shifts', hardMaxSpread: 2 }] },
                employees: two,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-07'])],
            });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-05'],
                ['e1', 'd@2026-01-07'],
            ]);
            expect(constraint(ctx, 'fairness').evaluate!(state)).to.have.length(0);
        });

        it('balances nights as their own dimension, not folded into hours', function () {
            const ctx = ctxFor({
                rules: {
                    nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: 3 * H },
                    fairness: [{ dimension: 'nights', hardMaxSpread: 1 }],
                },
                employees: two,
                shifts: [
                    shift('n', '22:00', '06:00', ['2026-01-05', '2026-01-07']),
                    shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-08']),
                ],
            });
            // Identical shift counts; only e1 takes the nights.
            const state = stateWith(ctx, [
                ['e1', 'n@2026-01-05'],
                ['e1', 'n@2026-01-07'],
                ['e2', 'd@2026-01-06'],
                ['e2', 'd@2026-01-08'],
            ]);
            const violations = constraint(ctx, 'fairness').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].actual).to.equal(2);
            expect(violations[0].required).to.equal(1);
            expect(violations[0].message).to.contain('nights spread');
        });

        it('balances weekend shifts (Sat and Sun both count)', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'weekends', hardMaxSpread: 1 }] },
                employees: two,
                shifts: [
                    shift('w', '08:00', '16:00', ['2026-01-10', '2026-01-11']), // Sat, Sun
                    shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06']),
                ],
            });
            const state = stateWith(ctx, [
                ['e1', 'w@2026-01-10'],
                ['e1', 'w@2026-01-11'],
                ['e2', 'd@2026-01-05'],
                ['e2', 'd@2026-01-06'],
            ]);
            const violations = constraint(ctx, 'fairness').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].actual).to.equal(2);
            expect(violations[0].message).to.contain('weekends spread');
        });

        it('balances public-holiday shifts against the caller calendar', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'holidays', hardMaxSpread: 0 }] },
                calendar: { publicHolidays: ['2026-01-06'] },
                employees: two,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-07'])],
            });
            const state = stateWith(ctx, [
                ['e1', 'd@2026-01-06'],
                ['e2', 'd@2026-01-07'],
            ]);
            const violations = constraint(ctx, 'fairness').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].actual).to.equal(1);
            expect(violations[0].required).to.equal(0);
            expect(violations[0].message).to.contain('holidays spread');
        });

        it('balances a tag dimension and labels it with the tag', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'tag', tag: 'senior', hardMaxSpread: 1 }] },
                employees: [emp('a', { tags: ['senior'] }), emp('b')],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-07'])],
            });
            // b works too, but untagged shifts contribute nothing to this dimension.
            const state = stateWith(ctx, [
                ['a', 'd@2026-01-05'],
                ['a', 'd@2026-01-07'],
                ['b', 'd@2026-01-05'],
            ]);
            const violations = constraint(ctx, 'fairness').evaluate!(state);
            expect(violations).to.have.length(1);
            expect(violations[0].employeeId).to.equal('a');
            expect(violations[0].actual).to.equal(2);
            expect(violations[0].message).to.contain('"senior" shift spread');
        });

        it('lets carriedFairness from a previous period neutralise this period\'s imbalance', function () {
            const employees = [emp('e1'), emp('e2', { carriedFairness: { minutes: 480 } })];
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'minutes', hardMaxSpread: 0 }] },
                employees,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            // e1 works 480' now; e2 carried 480' in — the spread is zero.
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            expect(constraint(ctx, 'fairness').evaluate!(state)).to.have.length(0);
            expect(fairnessPenalty(state, [{ dimension: 'minutes' }])).to.equal(0);
        });

        it('reports minutes spread when there is no carried history', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'minutes', hardMaxSpread: 0 }] },
                employees: two,
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            const violations = constraint(ctx, 'fairness').evaluate!(stateWith(ctx, [['e1', 'd@2026-01-05']]));
            expect(violations).to.have.length(1);
            expect(violations[0].actual).to.equal(480);
        });

        it('returns no violations and zero penalty with no employees at all', function () {
            const ctx = ctxFor({
                rules: { fairness: [{ dimension: 'shifts', hardMaxSpread: 0 }] },
                employees: [],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])],
            });
            const state = createState(ctx);
            expect(constraint(ctx, 'fairness').evaluate!(state)).to.have.length(0);
            expect(fairnessPenalty(state, [{ dimension: 'shifts' }])).to.equal(0);
        });

        it('computes the L1 deviation from equal shares, scaled by rule weight', function () {
            const ctx = ctxFor({ employees: two, shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            // Total 480', fair share 240' each: |480-240| + |0-240| = 480.
            expect(fairnessPenalty(state, [{ dimension: 'minutes' }])).to.equal(480);
            expect(fairnessPenalty(state, [{ dimension: 'minutes', weight: 2 }])).to.equal(960);
            expect(fairnessPenalty(state, undefined)).to.equal(0);
            expect(fairnessPenalty(state, [])).to.equal(0);
        });

        it('weights fair shares pro rata temporis by contracted minutes', function () {
            const employees = [
                emp('full', { contract: { kind: 'hours', weeklyMinutes: 2400 } }),
                emp('half', { contract: { kind: 'hours', weeklyMinutes: 1200 } }),
            ];
            const ctx = ctxFor({
                employees,
                shifts: [shift('d8', '08:00', '16:00', ['2026-01-05']), shift('d4', '08:00', '12:00', ['2026-01-05'])],
            });
            const state = stateWith(ctx, [
                ['full', 'd8@2026-01-05'],
                ['half', 'd4@2026-01-05'],
            ]);
            // Headcount shares call a 480/240 split unfair (720 total, 360 each).
            expect(fairnessPenalty(state, [{ dimension: 'minutes' }])).to.equal(240);
            // Pro-rata shares (2400:1200) call the same split exactly fair.
            expect(fairnessPenalty(state, [{ dimension: 'minutes', proRataByContract: true }])).to.equal(0);
        });

        it('falls back to headcount weight when contracted minutes are missing or zero', function () {
            const employees = [emp('e1', { contract: { kind: 'hours', weeklyMinutes: 0 } }), emp('e2')];
            const ctx = ctxFor({ employees, shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            const state = stateWith(ctx, [['e1', 'd@2026-01-05']]);
            // Both weights degrade to 1, so this equals the equal-share penalty.
            expect(fairnessPenalty(state, [{ dimension: 'minutes', proRataByContract: true }])).to.equal(480);
        });
    });

    describe('availability', function () {
        const monday = shift('mon', '08:00', '16:00', ['2026-01-05']);

        it('passes when the employee declared no availability at all, or an empty list', function () {
            const ctx = ctxFor({
                employees: [emp('none'), emp('empty', { availability: [] })],
                shifts: [monday],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            for (const employeeId of ['none', 'empty']) {
                const v = c.verdict!(state, { employeeId, shiftInstanceId: 'mon@2026-01-05' });
                expect(v.pass).to.equal(true);
                expect(v.message).to.equal('no availability rules');
            }
        });

        it('treats unavailable as a hard blackout on matching days only', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { availability: [{ kind: 'unavailable', daysOfWeek: [1] }] })],
                shifts: [monday, shift('tue', '08:00', '16:00', ['2026-01-06'])],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            const mon = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'mon@2026-01-05' });
            expect(mon.pass).to.equal(false);
            expect(mon.severity).to.equal('hard');
            expect(mon.message).to.contain('is unavailable during "mon@2026-01-05"');
            expect(c.delta(state, { employeeId: 'e1', shiftInstanceId: 'mon@2026-01-05' })).to.be.greaterThan(0);
            // Tuesday is outside the rule's days, and there is no allow-list.
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'tue@2026-01-06' }).pass).to.equal(true);
        });

        it('ignores an unavailable window whose clock band never overlaps the shift', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { availability: [{ kind: 'unavailable', from: '18:00', to: '22:00' }] })],
                shifts: [monday],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            const pair = { employeeId: 'e1', shiftInstanceId: 'mon@2026-01-05' };
            expect(c.verdict!(state, pair).pass).to.equal(true);
            expect(c.delta(state, pair)).to.equal(0);
        });

        it('scopes a blackout by fromDate/toDate', function () {
            const ctx = ctxFor({
                employees: [
                    emp('e1', { availability: [{ kind: 'unavailable', fromDate: '2026-01-07', toDate: '2026-01-09' }] }),
                ],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-08', '2026-01-12'])],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-06' }).pass).to.equal(true);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-08' }).pass).to.equal(false);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-12' }).pass).to.equal(true);
        });

        it('fails a shift only partially inside the declared window, reporting covered minutes', function () {
            const ctx = ctxFor({
                employees: [
                    emp('e1', { availability: [{ kind: 'available', daysOfWeek: [1], from: '08:00', to: '12:00' }] }),
                ],
                shifts: [monday],
            });
            const v = constraint(ctx, 'availability').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'mon@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.severity).to.equal('hard');
            expect(v.actual).to.equal(4 * H);
            expect(v.required).to.equal(8 * H);
            expect(v.unit).to.equal('minutes');
            expect(v.message).to.contain('falls outside');
        });

        it('accepts a shift inside any one of several declared windows, rejects one outside all', function () {
            const ctx = ctxFor({
                employees: [
                    emp('e1', {
                        availability: [
                            { kind: 'available', daysOfWeek: [1] },
                            { kind: 'available', daysOfWeek: [3] },
                        ],
                    }),
                ],
                shifts: [
                    monday,
                    shift('wed', '08:00', '16:00', ['2026-01-07']),
                    shift('fri', '08:00', '16:00', ['2026-01-09']),
                ],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'mon@2026-01-05' }).pass).to.equal(true);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'wed@2026-01-07' }).pass).to.equal(true);
            const fri = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'fri@2026-01-09' });
            expect(fri.pass).to.equal(false);
            expect(fri.actual).to.equal(0);
            expect(fri.required).to.equal(8 * H);
        });

        it('keeps avoid soft, carrying the declared weight (default 1) as magnitude', function () {
            const ctx = ctxFor({
                employees: [
                    emp('weighted', { availability: [{ kind: 'avoid', weight: 3 }] }),
                    emp('plain', { availability: [{ kind: 'avoid' }] }),
                ],
                shifts: [monday],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            const weighted = c.verdict!(state, { employeeId: 'weighted', shiftInstanceId: 'mon@2026-01-05' });
            expect(weighted.pass).to.equal(false);
            expect(weighted.severity).to.equal('soft');
            expect(weighted.actual).to.equal(3);
            // Soft objections never make a pair ineligible.
            expect(c.delta(state, { employeeId: 'weighted', shiftInstanceId: 'mon@2026-01-05' })).to.equal(0);
            expect(c.verdict!(state, { employeeId: 'plain', shiftInstanceId: 'mon@2026-01-05' }).actual).to.equal(1);
        });

        it('does not object when an avoid window misses the shift entirely', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { availability: [{ kind: 'avoid', from: '18:00', to: '20:00' }] })],
                shifts: [monday],
            });
            const v = constraint(ctx, 'availability').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'mon@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.equal('no availability objection');
        });

        it('recognises a preferred window without changing eligibility', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { availability: [{ kind: 'preferred', daysOfWeek: [1] }] })],
                shifts: [monday, shift('tue', '08:00', '16:00', ['2026-01-06'])],
            });
            const c = constraint(ctx, 'availability');
            const state = createState(ctx);
            const mon = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'mon@2026-01-05' });
            expect(mon.pass).to.equal(true);
            expect(mon.message).to.contain('matches a preferred window');
            const tue = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'tue@2026-01-06' });
            expect(tue.pass).to.equal(true);
            expect(tue.message).to.equal('no availability objection');
        });

        it('surfaces only soft objections in evaluate — hard ones belong to the score', function () {
            const ctx = ctxFor({
                employees: [
                    emp('avoider', { availability: [{ kind: 'avoid', daysOfWeek: [6, 7], weight: 2 }] }),
                    emp('blocked', { availability: [{ kind: 'unavailable' }] }),
                ],
                shifts: [shift('sat', '08:00', '16:00', ['2026-01-10'])],
            });
            const c = constraint(ctx, 'availability');
            const soft = c.evaluate!(stateWith(ctx, [['avoider', 'sat@2026-01-10']]));
            expect(soft).to.have.length(1);
            expect(soft[0].severity).to.equal('soft');
            expect(soft[0].employeeId).to.equal('avoider');
            expect(soft[0].shiftInstanceId).to.equal('sat@2026-01-10');
            // A hard breach forced into the state is not re-reported here.
            expect(c.evaluate!(stateWith(ctx, [['blocked', 'sat@2026-01-10']]))).to.have.length(0);
        });

        it('scores preferences for ranking: preferred negative, avoid positive, others neutral', function () {
            const ctx = ctxFor({ shifts: [monday] });
            const inst = ctx.instanceById.get('mon@2026-01-05')!;
            expect(preferenceScore(ctx.clock, undefined, inst)).to.equal(0);
            expect(preferenceScore(ctx.clock, [], inst)).to.equal(0);
            expect(preferenceScore(ctx.clock, [{ kind: 'preferred' }], inst)).to.equal(-1);
            expect(preferenceScore(ctx.clock, [{ kind: 'avoid' }], inst)).to.equal(1);
            expect(
                preferenceScore(
                    ctx.clock,
                    [
                        { kind: 'preferred', daysOfWeek: [1], weight: 2 },
                        { kind: 'avoid', daysOfWeek: [1], weight: 3 },
                    ],
                    inst,
                ),
            ).to.equal(1);
            // Day mismatch and non-overlapping clock windows contribute nothing.
            expect(preferenceScore(ctx.clock, [{ kind: 'preferred', daysOfWeek: [2] }], inst)).to.equal(0);
            expect(preferenceScore(ctx.clock, [{ kind: 'avoid', from: '18:00', to: '20:00' }], inst)).to.equal(0);
            // Hard kinds are not preference signal.
            expect(preferenceScore(ctx.clock, [{ kind: 'available' }, { kind: 'unavailable' }], inst)).to.equal(0);
        });
    });

    describe('qualification', function () {
        it('passes any employee when the shift requires no tags', function () {
            const ctx = ctxFor({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            const v = constraint(ctx, 'qualification').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.equal('no qualification requirement');
        });

        it('accepts a plain tag as valid for the whole period', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { tags: ['forklift'] })],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-30'], { requiredTags: ['forklift'] })],
            });
            const v = constraint(ctx, 'qualification').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-30',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.contain('holds forklift on 2026-01-30');
        });

        it('distinguishes not-yet-valid from expired, with inclusive boundary days', function () {
            const ctx = ctxFor({
                employees: [
                    emp('e1', { qualifications: [{ tag: 'crane', validFrom: '2026-01-07', validUntil: '2026-01-09' }] }),
                ],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-07', '2026-01-09', '2026-01-12'], {
                    requiredTags: ['crane'],
                })],
            });
            const c = constraint(ctx, 'qualification');
            const state = createState(ctx);
            const early = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-06' });
            expect(early.pass).to.equal(false);
            expect(early.message).to.contain('crane (valid from 2026-01-07)');
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-07' }).pass).to.equal(true);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-09' }).pass).to.equal(true);
            const late = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-12' });
            expect(late.pass).to.equal(false);
            expect(late.message).to.contain('crane (expired 2026-01-09)');
        });

        it('counts held versus required tags when several are demanded', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { tags: ['forklift'] })],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { requiredTags: ['forklift', 'crane'] })],
            });
            const v = constraint(ctx, 'qualification').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(1);
            expect(v.required).to.equal(2);
            expect(v.unit).to.equal('count');
            // Never held: named bare, with no expiry annotation.
            expect(v.message).to.contain('lacks crane');
            expect(v.message).to.not.contain('expired');
        });

        it('holds(): a plain tag satisfies possession but never a level requirement', function () {
            const tagged = emp('t', { tags: ['crane'] });
            expect(holds(tagged, 'crane', '2026-01-05')).to.equal(true);
            expect(holds(tagged, 'crane', '2026-01-05', 1)).to.equal(false);

            const levelled = emp('l', {
                qualifications: [{ tag: 'crane', level: 2, validFrom: '2026-01-06', validUntil: '2026-01-08' }],
            });
            expect(holds(levelled, 'crane', '2026-01-07', 2)).to.equal(true);
            expect(holds(levelled, 'crane', '2026-01-07', 3)).to.equal(false);
            // Validity boundaries are inclusive on both ends.
            expect(holds(levelled, 'crane', '2026-01-06')).to.equal(true);
            expect(holds(levelled, 'crane', '2026-01-08')).to.equal(true);
            expect(holds(levelled, 'crane', '2026-01-05')).to.equal(false);
            expect(holds(levelled, 'crane', '2026-01-09')).to.equal(false);

            // A qualification without a level counts as level 0.
            const unlevelled = emp('u', { qualifications: [{ tag: 'crane' }] });
            expect(holds(unlevelled, 'crane', '2026-01-05')).to.equal(true);
            expect(holds(unlevelled, 'crane', '2026-01-05', 1)).to.equal(false);
        });

        it('prunes only dated-out instances, leaving unknown employees and tagless shifts alone', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { qualifications: [{ tag: 'forklift', validUntil: '2026-01-06' }] })],
                shifts: [
                    shift('q', '08:00', '16:00', ['2026-01-05', '2026-01-08'], { requiredTags: ['forklift'] }),
                    shift('free', '08:00', '16:00', ['2026-01-05']),
                ],
            });
            const eligibility = new Map<string, Set<string>>([
                ['e1', new Set(['q@2026-01-05', 'q@2026-01-08', 'free@2026-01-05', 'ghost-shift'])],
                ['ghost', new Set(['q@2026-01-05'])],
            ]);
            constraint(ctx, 'qualification').prune!(ctx, eligibility);
            expect([...eligibility.get('e1')!].sort()).to.deep.equal([
                'free@2026-01-05',
                'ghost-shift',
                'q@2026-01-05',
            ]);
            // An eligibility row for an unknown employee is left untouched.
            expect(eligibility.get('ghost')!.has('q@2026-01-05')).to.equal(true);
        });
    });

    describe('protections', function () {
        const nightRules: WorkingTimeRules = {
            nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: 3 * H },
        };
        const night = shift('n', '22:00', '06:00', ['2026-01-05']);
        const day = shift('d', '08:00', '16:00', ['2026-01-05']);

        it('passes with no protections registered', function () {
            const ctx = ctxFor({ rules: nightRules, shifts: [night] });
            const v = constraint(ctx, 'protections').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'n@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.equal('no protections registered');
        });

        it('does not bar night work for minor or hazardousNight — those select stricter rules instead', function () {
            const ctx = ctxFor({
                rules: nightRules,
                employees: [
                    emp('young', { protections: [{ kind: 'minor' }] }),
                    emp('hazard', { protections: [{ kind: 'hazardousNight' }] }),
                ],
                shifts: [night],
            });
            const c = constraint(ctx, 'protections');
            const state = createState(ctx);
            for (const employeeId of ['young', 'hazard']) {
                const v = c.verdict!(state, { employeeId, shiftInstanceId: 'n@2026-01-05' });
                expect(v.pass).to.equal(true);
                expect(v.message).to.equal('no protection bars this shift');
            }
        });

        it('bars night work on a pregnancy certificate but leaves day shifts open', function () {
            const ctx = ctxFor({
                rules: nightRules,
                employees: [emp('preg', { protections: [{ kind: 'pregnancyNightExclusion' }] })],
                shifts: [night, day],
            });
            const c = constraint(ctx, 'protections');
            const state = createState(ctx);
            const barred = c.verdict!(state, { employeeId: 'preg', shiftInstanceId: 'n@2026-01-05' });
            expect(barred.pass).to.equal(false);
            expect(barred.severity).to.equal('hard');
            expect(barred.citation).to.contain('92/85');
            expect(c.verdict!(state, { employeeId: 'preg', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
        });

        it('prunes night instances only for the protected worker', function () {
            const ctx = ctxFor({
                rules: nightRules,
                employees: [emp('preg', { protections: [{ kind: 'pregnancyNightExclusion' }] }), emp('plain')],
                shifts: [night, day],
            });
            const eligibility = new Map<string, Set<string>>([
                ['preg', new Set(['n@2026-01-05', 'd@2026-01-05'])],
                ['plain', new Set(['n@2026-01-05', 'd@2026-01-05'])],
            ]);
            constraint(ctx, 'protections').prune!(ctx, eligibility);
            expect([...eligibility.get('preg')!]).to.deep.equal(['d@2026-01-05']);
            expect(eligibility.get('plain')!.size).to.equal(2);
        });

        it('reports a dayShift fallback left unassigned, and nothing once day work is given', function () {
            const ctx = ctxFor({
                rules: nightRules,
                employees: [emp('preg', { protections: [{ kind: 'pregnancyNightExclusion', fallback: 'dayShift' }] })],
                shifts: [night, day],
            });
            const c = constraint(ctx, 'protections');
            const unaccommodated = c.evaluate!(createState(ctx));
            expect(unaccommodated).to.have.length(1);
            expect(unaccommodated[0].severity).to.equal('medium');
            expect(unaccommodated[0].employeeId).to.equal('preg');
            expect(unaccommodated[0].message).to.contain('no daytime alternative');
            expect(unaccommodated[0].citation).to.contain('92/85');
            expect(c.evaluate!(stateWith(ctx, [['preg', 'd@2026-01-05']]))).to.have.length(0);
        });

        it('does not report a leave fallback via evaluate — the ledger carries it', function () {
            const ctx = ctxFor({
                rules: nightRules,
                employees: [emp('preg', { protections: [{ kind: 'pregnancyNightExclusion', fallback: 'leave' }] })],
                shifts: [night],
            });
            expect(constraint(ctx, 'protections').evaluate!(createState(ctx))).to.have.length(0);
        });

        it('ledgers what is owed: leave when declared, otherwise a transfer to day work', function () {
            const ctx = ctxFor({
                rules: nightRules,
                employees: [
                    emp('leave', { protections: [{ kind: 'pregnancyNightExclusion', fallback: 'leave' }] }),
                    emp('transfer', { protections: [{ kind: 'pregnancyNightExclusion' }] }),
                    emp('working', { protections: [{ kind: 'pregnancyNightExclusion', fallback: 'dayShift' }] }),
                    emp('minor', { protections: [{ kind: 'minor' }] }),
                ],
                shifts: [night, day],
            });
            const entries = protectionLedger(stateWith(ctx, [['working', 'd@2026-01-05']]));
            expect(entries).to.have.length(2);
            const byId = new Map(entries.map((e) => [e.employeeId, e]));
            expect(byId.get('leave')!.kind).to.equal('compensatoryRest');
            expect(byId.get('leave')!.reason).to.contain('leave or extended maternity leave is owed');
            expect(byId.get('transfer')!.reason).to.contain('a transfer to day work is owed');
            expect(byId.get('transfer')!.citation).to.contain('92/85');
            // Accommodated and non-pregnancy-protected workers create no debt.
            expect(byId.has('working')).to.equal(false);
            expect(byId.has('minor')).to.equal(false);
        });
    });

    describe('group composition', function () {
        it('passes an unknown shift id', function () {
            const ctx = ctxFor({ shifts: [] });
            const v = constraint(ctx, 'group-composition').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'nope@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.equal('unknown shift');
        });

        it('rejects the assignee that would exceed maxEmployees, but re-passes existing ones', function () {
            const ctx = ctxFor({
                employees: [emp('a'), emp('b'), emp('c')],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { maxEmployees: 2 })],
            });
            const c = constraint(ctx, 'group-composition');
            const state = stateWith(ctx, [
                ['a', 'd@2026-01-05'],
                ['b', 'd@2026-01-05'],
            ]);
            const v = c.verdict!(state, { employeeId: 'c', shiftInstanceId: 'd@2026-01-05' });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(3);
            expect(v.required).to.equal(2);
            expect(v.unit).to.equal('count');
            expect(v.message).to.contain('maximum of 2 assignees');
            // Re-evaluating an already-assigned pair must not count the person twice.
            expect(c.verdict!(state, { employeeId: 'a', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
        });

        it('leaves headcount uncapped when maxEmployees is absent', function () {
            const ctx = ctxFor({
                employees: [emp('a'), emp('b'), emp('c'), emp('d')],
                shifts: [shift('s', '08:00', '16:00', ['2026-01-05'])],
            });
            const state = stateWith(ctx, [
                ['a', 's@2026-01-05'],
                ['b', 's@2026-01-05'],
                ['c', 's@2026-01-05'],
            ]);
            expect(
                constraint(ctx, 'group-composition').verdict!(state, { employeeId: 'd', shiftInstanceId: 's@2026-01-05' })
                    .pass,
            ).to.equal(true);
        });

        it('caps tagged assignees only — untagged colleagues pass the same gate', function () {
            const ctx = ctxFor({
                employees: [emp('t1', { tags: ['trainee'] }), emp('t2', { tags: ['trainee'] }), emp('s')],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { tagMaximums: { trainee: 1 } })],
            });
            const c = constraint(ctx, 'group-composition');
            const state = stateWith(ctx, [['t1', 'd@2026-01-05']]);
            const second = c.verdict!(state, { employeeId: 't2', shiftInstanceId: 'd@2026-01-05' });
            expect(second.pass).to.equal(false);
            expect(second.actual).to.equal(2);
            expect(second.required).to.equal(1);
            expect(second.message).to.contain('"trainee"');
            expect(c.verdict!(state, { employeeId: 's', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
            // The already-assigned trainee is excluded from their own count.
            expect(c.verdict!(state, { employeeId: 't1', shiftInstanceId: 'd@2026-01-05' }).pass).to.equal(true);
        });

        it('reports both tag and headcount overshoots forced into a state, skipping empty shifts', function () {
            const ctx = ctxFor({
                employees: [emp('t1', { tags: ['trainee'] }), emp('t2', { tags: ['trainee'] })],
                shifts: [
                    shift('d', '08:00', '16:00', ['2026-01-05'], { maxEmployees: 1, tagMaximums: { trainee: 1 } }),
                    shift('empty', '08:00', '16:00', ['2026-01-06'], { maxEmployees: 1 }),
                ],
            });
            // `assign` bypasses checks, modelling e.g. an imported roster.
            const violations = constraint(ctx, 'group-composition').evaluate!(
                stateWith(ctx, [
                    ['t1', 'd@2026-01-05'],
                    ['t2', 'd@2026-01-05'],
                ]),
            );
            expect(violations).to.have.length(2);
            const tag = violations.find((v) => v.message.includes('"trainee"'))!;
            expect(tag.actual).to.equal(2);
            expect(tag.required).to.equal(1);
            const head = violations.find((v) => v.message.includes('assignees, over the maximum'))!;
            expect(head.actual).to.equal(2);
            expect(head.required).to.equal(1);
            // The unstaffed instance produced no composition violation.
            expect(violations.every((v) => v.shiftInstanceId === 'd@2026-01-05')).to.equal(true);
        });

        it('reports nothing when the composition is within limits', function () {
            const ctx = ctxFor({
                employees: [emp('t1', { tags: ['trainee'] }), emp('s')],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05'], { maxEmployees: 2, tagMaximums: { trainee: 1 } })],
            });
            // One trainee plus one untagged colleague: both caps respected.
            const state = stateWith(ctx, [
                ['t1', 'd@2026-01-05'],
                ['s', 'd@2026-01-05'],
            ]);
            expect(constraint(ctx, 'group-composition').evaluate!(state)).to.have.length(0);
        });
    });

    describe('contract', function () {
        it('passes an employee with no contract at all', function () {
            const ctx = ctxFor({ shifts: [shift('d', '08:00', '16:00', ['2026-01-05'])] });
            const v = constraint(ctx, 'contract').verdict!(createState(ctx), {
                employeeId: 'e1',
                shiftInstanceId: 'd@2026-01-05',
            });
            expect(v.pass).to.equal(true);
            expect(v.message).to.equal('no contract limits');
        });

        it('allows work on the contract end date itself, refuses the day after', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { contract: { kind: 'hours', endDate: '2026-01-06' } })],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-06', '2026-01-07'])],
            });
            const c = constraint(ctx, 'contract');
            const state = createState(ctx);
            expect(c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-06' }).pass).to.equal(true);
            const after = c.verdict!(state, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-07' });
            expect(after.pass).to.equal(false);
            expect(after.message).to.contain('contract ends 2026-01-06');
        });

        it('prunes post-end-date instances for fixed-term workers only', function () {
            const ctx = ctxFor({
                employees: [emp('fixed', { contract: { kind: 'hours', endDate: '2026-01-06' } }), emp('open')],
                shifts: [shift('d', '08:00', '16:00', ['2026-01-05', '2026-01-06', '2026-01-07'])],
            });
            const all = ['d@2026-01-05', 'd@2026-01-06', 'd@2026-01-07'];
            const eligibility = new Map<string, Set<string>>([
                ['fixed', new Set(all)],
                ['open', new Set(all)],
            ]);
            constraint(ctx, 'contract').prune!(ctx, eligibility);
            expect([...eligibility.get('fixed')!].sort()).to.deep.equal(['d@2026-01-05', 'd@2026-01-06']);
            expect(eligibility.get('open')!.size).to.equal(3);
        });

        it('counts a split day once against a forfait-jours day budget', function () {
            const ctx = ctxFor({
                employees: [emp('e1', { contract: { kind: 'days', maxDaysInPeriod: 2 } })],
                shifts: [
                    shift('m', '08:00', '12:00', ['2026-01-05']),
                    shift('a', '13:00', '17:00', ['2026-01-05']),
                    shift('d', '08:00', '12:00', ['2026-01-06', '2026-01-07']),
                ],
            });
            const c = constraint(ctx, 'contract');
            // Two shifts on 5 Jan are one contract day; a second day still fits.
            const twoOnOneDay = stateWith(ctx, [
                ['e1', 'm@2026-01-05'],
                ['e1', 'a@2026-01-05'],
            ]);
            const second = c.verdict!(twoOnOneDay, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-06' });
            expect(second.pass).to.equal(true);
            expect(second.actual).to.equal(2);
            expect(second.required).to.equal(2);
            expect(second.unit).to.equal('days');
            expect(second.message).to.contain('2 of 2 contract days used');

            // A third distinct day breaks the budget.
            const full = stateWith(ctx, [
                ['e1', 'm@2026-01-05'],
                ['e1', 'a@2026-01-05'],
                ['e1', 'd@2026-01-06'],
            ]);
            const third = c.verdict!(full, { employeeId: 'e1', shiftInstanceId: 'd@2026-01-07' });
            expect(third.pass).to.equal(false);
            expect(third.actual).to.equal(3);
            expect(third.required).to.equal(2);
            expect(third.unit).to.equal('days');
            expect(third.message).to.contain('would work 3 days');
        });

        it('keeps a day-count contract without a day budget silent on hours', function () {
            const dates = ['2026-01-05', '2026-01-07', '2026-01-09'];
            const ctx = ctxFor({
                employees: [emp('e1', { contract: { kind: 'days' } })],
                shifts: [shift('long', '06:00', '20:00', dates)],
            });
            const state = stateWith(ctx, [
                ['e1', 'long@2026-01-05'],
                ['e1', 'long@2026-01-07'],
            ]);
            const v = constraint(ctx, 'contract').verdict!(state, { employeeId: 'e1', shiftInstanceId: 'long@2026-01-09' });
            expect(v.pass).to.equal(true);
            expect(v.message).to.equal('within contract limits');
        });

        it('enforces maxPeriodMinutes strictly above the bound, never at it', function () {
            const shifts = [shift('d8', '08:00', '16:00', ['2026-01-05', '2026-01-06'])];
            const atLimit = ctxFor({
                employees: [emp('e1', { contract: { kind: 'hours', maxPeriodMinutes: 16 * H } })],
                shifts,
            });
            const okState = stateWith(atLimit, [['e1', 'd8@2026-01-05']]);
            expect(
                constraint(atLimit, 'contract').verdict!(okState, { employeeId: 'e1', shiftInstanceId: 'd8@2026-01-06' })
                    .pass,
            ).to.equal(true);

            const tight = ctxFor({
                employees: [emp('e1', { contract: { kind: 'hours', maxPeriodMinutes: 15 * H } })],
                shifts,
            });
            const v = constraint(tight, 'contract').verdict!(stateWith(tight, [['e1', 'd8@2026-01-05']]), {
                employeeId: 'e1',
                shiftInstanceId: 'd8@2026-01-06',
            });
            expect(v.pass).to.equal(false);
            expect(v.actual).to.equal(16 * H);
            expect(v.required).to.equal(15 * H);
            expect(v.unit).to.equal('minutes');
            expect(v.message).to.contain('16.0h');
            expect(v.message).to.contain('15.0h contract maximum');
        });
    });
});
