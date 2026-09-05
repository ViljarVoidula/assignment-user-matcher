import { expect } from 'chai';
import {
    checkCompliance,
    solveSchedule,
    repairSchedule,
    rankCandidates,
    PeriodClock,
    ScheduleValidationError,
} from '../../src/scheduling';
import type { ScheduleInput, ScheduledAssignment, SearchState } from '../../src/scheduling';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState, unassign } from '../../src/scheduling/engine/state';

function input(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-07' },
        employees: [
            { id: 'a', tags: [], timeOff: [] },
            { id: 'b', tags: [], timeOff: [] },
        ],
        shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00' }],
        timeBudgetMs: 0,
        ...overrides,
    };
}
function roster(employeeId = 'a'): ScheduledAssignment[] {
    return ['2026-01-05', '2026-01-06', '2026-01-07'].map((date) => ({
        employeeId,
        shiftInstanceId: `day@${date}`,
        date,
        reasons: [],
    }));
}

describe('Scheduling foundation regressions', () => {
    for (const rules of [undefined, { workingTime: { maxPerShiftMinutes: 600 } }]) {
        it(`enforces personal working-time limits with ${rules ? 'global rules' : 'no global family'}`, () => {
            const problem = input({
                rules,
                employees: [
                    { id: 'a', tags: [], timeOff: [], rules: { workingTime: { maxPerShiftMinutes: 240 } } },
                    { id: 'b', tags: [], timeOff: [] },
                ],
            });
            const result = solveSchedule(problem);
            expect(result.status).to.equal('optimal');
            expect(result.assignments.every((a) => a.employeeId === 'b')).to.equal(true);
            expect(checkCompliance(problem, roster()).compliant).to.equal(false);
            expect(rankCandidates(problem, 'day@2026-01-05', []).find((c) => c.employeeId === 'a')!.eligible).to.equal(
                false,
            );
        });
    }
    it('allows a personal relaxation without relaxing another employee', () => {
        const problem = input({
            rules: { workingTime: { maxPerShiftMinutes: 240 } },
            employees: [
                { id: 'a', tags: [], timeOff: [], rules: { workingTime: { maxPerShiftMinutes: 600 } } },
                { id: 'b', tags: [], timeOff: [] },
            ],
        });
        expect(solveSchedule(problem).assignments.every((a) => a.employeeId === 'a')).to.equal(true);
        expect(checkCompliance(problem, roster('b')).compliant).to.equal(false);
    });
    it('classifies night work using the employee night window', () => {
        const problem = input({
            employees: [
                {
                    id: 'a',
                    tags: [],
                    timeOff: [],
                    rules: {
                        nightWork: {
                            window: { from: '08:00', to: '16:00' },
                            maxShiftMinutes: 240,
                        },
                    },
                },
                { id: 'b', tags: [], timeOff: [] },
            ],
        });
        expect(solveSchedule(problem).assignments.every((a) => a.employeeId === 'b')).to.equal(true);
        expect(checkCompliance(problem, roster()).violations.some((v) => v.constraintId === 'night-work')).to.equal(true);
    });
    it('enforces a personal sequence rule without imposing it on the team', () => {
        const problem = input({
            employees: [
                { id: 'a', tags: [], timeOff: [], rules: { consecutive: { maxWorkingDays: 1 } } },
                { id: 'b', tags: [], timeOff: [] },
            ],
        });
        expect(checkCompliance(problem, roster()).compliant).to.equal(false);
        expect(checkCompliance(problem, roster('b')).compliant).to.equal(true);
    });
    it('does not split global fairness groups because of an unrelated employee override', () => {
        const problem = input({
            rules: { fairness: [{ dimension: 'shifts', hardMaxSpread: 0 }] },
            employees: [
                { id: 'a', tags: [], timeOff: [], rules: { workingTime: { maxPerShiftMinutes: 600 } } },
                { id: 'b', tags: [], timeOff: [] },
            ],
        });
        expect(checkCompliance(problem, roster()).violations.some((v) => v.constraintId === 'fairness')).to.equal(true);
    });
    it('blocks leave overlapping an overnight shift beyond the final planning date', () => {
        const problem = input({
            period: { startDate: '2026-01-05', endDate: '2026-01-05' },
            employees: [{ id: 'a', tags: [], timeOff: [{ date: '2026-01-06' }] }],
            shifts: [{ id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00' }],
        });
        expect(solveSchedule(problem).assignments).to.have.length(0);
        expect(
            checkCompliance(problem, [
                { employeeId: 'a', shiftInstanceId: 'night@2026-01-05', date: '2026-01-05', reasons: [] },
            ]).compliant,
        ).to.equal(false);
    });
    it('repairs only the shifts overlapping an absence', () => {
        const result = repairSchedule(
            input(),
            { kind: 'absence', employeeId: 'a', from: '2026-01-06', to: '2026-01-06' },
            roster(),
        );
        expect(result.diff.removed).to.deep.equal([{ employeeId: 'a', shiftInstanceId: 'day@2026-01-06' }]);
        expect(result.diff.added).to.deep.equal([{ employeeId: 'b', shiftInstanceId: 'day@2026-01-06' }]);
        expect(result.candidates.every((c) => c.shiftInstanceId === 'day@2026-01-06')).to.equal(true);
    });
    it('repairs a shift starting before a timed absence when they overlap', () => {
        const result = repairSchedule(
            input(),
            { kind: 'absence', employeeId: 'a', from: '2026-01-06T12:00', to: '2026-01-06T13:00' },
            roster(),
        );
        expect(result.diff.removed).to.deep.equal([{ employeeId: 'a', shiftInstanceId: 'day@2026-01-06' }]);
    });
    it('uses the configured severity in solve, compliance and candidate ranking', () => {
        const problem = input({
            rules: { workingTime: { maxPerShiftMinutes: 240 } },
            constraints: { overrides: { 'rolling-hours': { hardness: 'soft' } } },
        });
        const result = solveSchedule(problem);
        expect(result.status).to.equal('optimal');
        expect(
            result.violations.filter((v) => v.constraintId === 'rolling-hours').every((v) => v.severity === 'soft'),
        ).to.equal(true);
        expect(checkCompliance(problem, result.assignments).compliant).to.equal(true);
        expect(rankCandidates(problem, 'day@2026-01-05', []).every((c) => c.eligible)).to.equal(true);
    });
    it('does not prune a softened blackout before search', () => {
        const problem = input({
            employees: [{ id: 'a', tags: [], timeOff: [{ date: '2026-01-05' }] }],
            constraints: { overrides: { 'time-off': { hardness: 'soft' } } },
        });
        expect(solveSchedule(problem).assignments).to.have.length(3);
    });
    it('reports missing coverage separately from hard compliance', () => {
        const report = checkCompliance(input(), []);
        expect(report.compliant).to.equal(true);
        expect(report.coverageComplete).to.equal(false);
        expect(report.publishable).to.equal(false);
        expect(report.violations.filter((v) => v.constraintId === 'min-staffing')).to.have.length(3);
        expect(checkCompliance(input(), roster()).publishable).to.equal(true);
    });
    it('applies employee engagement rules to cost and cancellation obligations', () => {
        const problem = input({
            employees: [
                {
                    id: 'a',
                    tags: [],
                    timeOff: [],
                    cost: { hourlyRateCents: 1000 },
                    rules: {
                        engagement: { minPaidMinutesPerEngagement: 600 },
                        notice: { cancellationCompensationMinutes: 120 },
                    },
                },
            ],
            published: { roster: roster() },
        });
        expect(solveSchedule(problem).cost!.totalCents).to.equal(30000);
        expect(checkCompliance(problem, []).ledger.filter((l) => l.kind === 'lateCancellationPay')).to.have.length(3);
    });
    it('resolves UTC and offset timestamps to the same local instant', () => {
        const clock = new PeriodClock('2026-01-05', 3, 'Europe/Tallinn');
        expect(clock.parseDateTime('2026-01-05T06:00:00Z')).to.equal(480);
        expect(clock.parseDateTime('2026-01-05T08:00:00+02:00')).to.equal(480);
        expect(clock.parseDateTime('2026-01-05T08:00')).to.equal(480);
        const problem = input({
            period: { startDate: '2026-01-05', endDate: '2026-01-07', timeZone: 'Europe/Tallinn' },
            absences: [{ employeeId: 'a', from: '2026-01-05T06:00Z', to: '2026-01-05T07:00Z' }],
        });
        expect(checkCompliance(problem, roster()).compliant).to.equal(false);
    });
    it('rejects reversed absences, unknown employees and nonexistent calendar dates', () => {
        for (const absence of [
            { employeeId: 'a', from: '2026-01-06', to: '2026-01-04' },
            { employeeId: 'ghost', from: '2026-01-05', to: '2026-01-05' },
            { employeeId: 'a', from: '2026-02-30', to: '2026-03-01' },
        ])
            expect(() => solveSchedule(input({ absences: [absence] }))).to.throw(ScheduleValidationError);
    });
});

describe('Scheduling extension and replay guarantees', () => {
    it('uses aggregate custom constraints when selecting the best roster', () => {
        const problem = input({
            timeBudgetMs: undefined,
            maxIterations: 100,
            constraints: {
                custom: [
                    {
                        id: 'team-policy',
                        version: '1',
                        hardness: 'hard',
                        delta: () => 0,
                        explain: () => null,
                        evaluate: (state) =>
                            (state.byEmployee.get('b')?.size ?? 0) > 0
                                ? [
                                      {
                                          constraintId: 'team-policy',
                                          severity: 'hard',
                                          message: 'only a may staff this roster',
                                      },
                                  ]
                                : [],
                    },
                ],
            },
        });
        const result = solveSchedule(problem);
        expect(result.assignments).to.have.length(3);
        expect(result.assignments.every((a) => a.employeeId === 'a')).to.equal(true);
        expect(result.status).to.equal('optimal');
        expect(checkCompliance(problem, result.assignments).compliant).to.equal(true);
    });
    it('replays fixed-iteration runs and identifies effective rule changes', () => {
        const problem = input({ timeBudgetMs: undefined, maxIterations: 25 });
        const first = solveSchedule(problem);
        const second = solveSchedule(problem);
        expect(first.assignments).to.deep.equal(second.assignments);
        expect(first.violations).to.deep.equal(second.violations);
        expect(first.stats.evaluatedVariants).to.equal(second.stats.evaluatedVariants);
        expect(first.provenance!.maxIterations).to.equal(25);
        const changed = solveSchedule({
            ...problem,
            employees: [
                { ...problem.employees[0], rules: { workingTime: { maxPerShiftMinutes: 600 } } },
                problem.employees[1],
            ],
        });
        expect(changed.provenance!.rulesHash).not.to.equal(first.provenance!.rulesHash);
        const custom = { id: 'custom', hardness: 'hard' as const, delta: () => 0, explain: () => null };
        const hash = (version: string) =>
            solveSchedule({ ...problem, constraints: { custom: [{ ...custom, version }] } }).provenance!.rulesHash;
        expect(hash('1')).not.to.equal(hash('2'));
    });
    it('rejects invalid search budgets', () => {
        for (const timeBudgetMs of [NaN, Infinity, -1]) {
            expect(() => solveSchedule(input({ timeBudgetMs }))).to.throw(ScheduleValidationError);
        }
        for (const maxIterations of [NaN, Infinity, -1, 1.5]) {
            expect(() => solveSchedule(input({ maxIterations }))).to.throw(ScheduleValidationError);
        }
    });
    it('reports duplicate roster entries without doubling worked hours', () => {
        const problem = input({ employees: [{ id: 'a', tags: [], timeOff: [], maxHoursForPeriod: 24 }] });
        const report = checkCompliance(problem, [...roster(), roster()[0]]);
        expect(report.compliant).to.equal(false);
        expect(report.violations.filter((v) => v.constraintId === 'input')).to.have.length(1);
        expect(report.violations.some((v) => v.constraintId === 'hour-budget')).to.equal(false);
    });
});

describe('Individual obligation exemptions', () => {
    it('does not restore a global cancellation rule explicitly removed for an employee', () => {
        const problem = input({
            rules: { notice: { cancellationCompensationMinutes: 120 } },
            employees: [{ id: 'a', tags: [], timeOff: [], rules: { notice: undefined } }],
            published: { roster: roster() },
        });
        expect(checkCompliance(problem, []).ledger).to.have.length(0);
    });
    it('uses offset timestamps for cancellation deadline calculations', () => {
        const problem = input({
            period: { startDate: '2026-01-05', endDate: '2026-01-07', timeZone: 'Europe/Tallinn' },
            published: { roster: [roster()[0]] },
            asOf: '2026-01-05T05:30:00Z',
            rules: { notice: { cancellationCompensationMinutes: 120, cancellationDeadlineMinutes: 60 } },
        });
        const debt = checkCompliance(problem, []).ledger;
        expect(debt).to.have.length(1);
        expect(debt[0].kind).to.equal('lateCancellationPay');
    });
});

describe('Scoped rules across the rest of the engine', () => {
    it('takes compensatory rest days from the employee rule, not the global one', () => {
        const problem = input({
            period: { startDate: '2026-01-04', endDate: '2026-01-04' }, // a Sunday
            employees: [
                { id: 'a', tags: [], timeOff: [], rules: { restDays: { compensatoryRestWithinDays: { sunday: 7 } } } },
                { id: 'b', tags: [], timeOff: [] },
            ],
        });
        const ledger = checkCompliance(problem, [
            { employeeId: 'a', shiftInstanceId: 'day@2026-01-04', date: '2026-01-04', reasons: [] },
            { employeeId: 'b', shiftInstanceId: 'day@2026-01-04', date: '2026-01-04', reasons: [] },
        ]).ledger;
        expect(ledger.map((l) => [l.kind, l.employeeId, l.dueBy])).to.deep.equal([
            ['substituteRestDay', 'a', '2026-01-11'],
        ]);
    });
    it('does not restore a global compensatory-rest rule explicitly removed for an employee', () => {
        const problem = input({
            period: { startDate: '2026-01-04', endDate: '2026-01-04' },
            rules: { restDays: { compensatoryRestWithinDays: { sunday: 7 } } },
            employees: [{ id: 'a', tags: [], timeOff: [], rules: { restDays: undefined } }],
        });
        expect(
            checkCompliance(problem, [
                { employeeId: 'a', shiftInstanceId: 'day@2026-01-04', date: '2026-01-04', reasons: [] },
            ]).ledger,
        ).to.have.length(0);
    });
    it('prices each employee against their own engagement floor', () => {
        const problem = input({
            rules: { engagement: { minPaidMinutesPerEngagement: 60 } },
            employees: [
                {
                    id: 'a',
                    tags: [],
                    timeOff: [],
                    cost: { hourlyRateCents: 1000 },
                    rules: { engagement: { minPaidMinutesPerEngagement: 600 } },
                },
                { id: 'b', tags: [], timeOff: [], cost: { hourlyRateCents: 1000 } },
            ],
            pinned: [
                { employeeId: 'a', shiftInstanceId: 'day@2026-01-05' },
                { employeeId: 'b', shiftInstanceId: 'day@2026-01-06' },
            ],
        });
        const cost = solveSchedule(problem).cost!;
        // `a` is paid for the 600-minute floor, `b` for the 480 minutes worked.
        expect(cost.byEmployee.a).to.equal(10000);
        expect(cost.byEmployee.b % 8000).to.equal(0);
    });
    it('keeps two contracts of one person on a single timeline under personal rules', () => {
        const problem = input({
            rules: { workingTime: { maxPerPeriodMinutes: 600 } },
            employees: [
                {
                    id: 'c1',
                    personId: 'p',
                    tags: [],
                    timeOff: [],
                    rules: { workingTime: { maxPerPeriodMinutes: 600 } },
                },
                { id: 'c2', personId: 'p', tags: [], timeOff: [] },
            ],
        });
        const report = checkCompliance(problem, [
            { employeeId: 'c1', shiftInstanceId: 'day@2026-01-05', date: '2026-01-05', reasons: [] },
            { employeeId: 'c2', shiftInstanceId: 'day@2026-01-06', date: '2026-01-06', reasons: [] },
        ]);
        // 2 × 480 minutes on one person breaches a 600-minute period cap that
        // neither contract breaches on its own (C-585/19).
        expect(report.compliant).to.equal(false);
        expect(report.violations.filter((v) => v.constraintId === 'rolling-hours')).to.have.length(2);
    });
});

describe('Coverage, severity and roster hygiene', () => {
    it('counts an unmet tag requirement as missing coverage, not a hard breach', () => {
        const problem = input({
            employees: [{ id: 'a', tags: [], timeOff: [] }],
            shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', tagRequirements: { nurse: 1 } }],
        });
        const report = checkCompliance(problem, roster());
        expect(report.compliant).to.equal(true);
        expect(report.coverageComplete).to.equal(false);
        expect(report.publishable).to.equal(false);
        expect(report.violations.filter((v) => v.constraintId === 'min-staffing')).to.have.length(3);
    });
    it('reports a covered roster with a hard breach as unpublishable', () => {
        const problem = input({
            rules: { workingTime: { maxPerShiftMinutes: 240 } },
            employees: [{ id: 'a', tags: [], timeOff: [] }],
        });
        const report = checkCompliance(problem, roster());
        expect(report.coverageComplete).to.equal(true);
        expect(report.compliant).to.equal(false);
        expect(report.publishable).to.equal(false);
    });
    it('applies a hardness override to aggregate violations as well as pair verdicts', () => {
        const problem = input({
            rules: { fairness: [{ dimension: 'shifts', hardMaxSpread: 0 }] },
            constraints: { overrides: { fairness: { hardness: 'soft' } } },
        });
        const report = checkCompliance(problem, roster());
        const fairness = report.violations.filter((v) => v.constraintId === 'fairness');
        expect(fairness).to.have.length.greaterThan(0);
        expect(fairness.every((v) => v.severity === 'soft')).to.equal(true);
        expect(report.compliant).to.equal(true);
    });
    it('scores a soft custom aggregate without letting it buy a hard breach', () => {
        const preferB = {
            id: 'prefer-b',
            hardness: 'soft' as const,
            weight: 100,
            delta: () => 0,
            explain: () => null,
            evaluate: (state: SearchState) => {
                const wrong = state.byEmployee.get('a')?.size ?? 0;
                return wrong > 0
                    ? [
                          {
                              constraintId: 'prefer-b',
                              severity: 'soft' as const,
                              message: 'prefer b',
                              actual: wrong,
                              required: 0,
                          },
                      ]
                    : [];
            },
        };
        const steered = solveSchedule(
            input({ timeBudgetMs: undefined, maxIterations: 200, constraints: { custom: [preferB] } }),
        );
        expect(steered.assignments.every((a) => a.employeeId === 'b')).to.equal(true);
        // `b` is now barred by a hard rule, so the soft preference must lose.
        const blocked = solveSchedule(
            input({
                timeBudgetMs: undefined,
                maxIterations: 200,
                constraints: { custom: [preferB] },
                employees: [
                    { id: 'a', tags: [], timeOff: [] },
                    { id: 'b', tags: [], timeOff: [], rules: { workingTime: { maxPerShiftMinutes: 240 } } },
                ],
            }),
        );
        expect(blocked.assignments).to.have.length(3);
        expect(blocked.assignments.every((a) => a.employeeId === 'a')).to.equal(true);
        expect(blocked.violations.filter((v) => v.severity === 'hard')).to.have.length(0);
    });
    it('makes a repeated assignment a no-op rather than a double booking', () => {
        const ctx = buildModel(input({ employees: [{ id: 'a', tags: [], timeOff: [] }] }));
        const state = createState(ctx);
        assign(state, 'a', 'day@2026-01-05', []);
        assign(state, 'a', 'day@2026-01-05', []);
        expect(state.assignments.get('day@2026-01-05')!.size).to.equal(1);
        expect(state.minutesByEmployee.get('a')).to.equal(480);
        unassign(state, 'a', 'day@2026-01-05');
        unassign(state, 'a', 'day@2026-01-05');
        expect(state.minutesByEmployee.get('a')).to.equal(0);
    });
});

describe('Date-time parsing and disruption scope', () => {
    it('rejects malformed date-times and impossible UTC offsets', () => {
        const clock = new PeriodClock('2026-01-05', 3, 'Europe/Tallinn');
        for (const value of [
            '2026-01-05T08',
            'not-a-date',
            '2026-01-05 08:00',
            '2026-01-05T08:00+99:00',
            '2026-01-05T25:00',
        ])
            expect(() => clock.parseDateTime(value), value).to.throw(ScheduleValidationError);
        // Sub-minute precision is accepted and rounded to the nearest minute,
        // the same way with a `Z`, an explicit offset, or none — one instant
        // must never parse two ways.
        expect(clock.parseDateTime('2026-01-05T08:00:29Z')).to.equal(600);
        expect(clock.parseDateTime('2026-01-05T10:00:29')).to.equal(600);
        expect(clock.parseDateTime('2026-01-05T08:00:59.123Z')).to.equal(601);
        expect(clock.parseDateTime('2026-01-05T10:00:59.123+02:00')).to.equal(601);
        expect(clock.parseDateTime('2026-01-05T10:00:59')).to.equal(601);
    });
    it('rejects a non-finite break length on a shift template', () => {
        for (const unpaidBreakMinutes of [NaN, Infinity])
            expect(() =>
                solveSchedule(
                    input({
                        shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', unpaidBreakMinutes }],
                    }),
                ),
            ).to.throw(ScheduleValidationError);
    });
    it('ignores leave that falls outside the period and touches no shift', () => {
        const problem = input({ employees: [{ id: 'a', tags: [], timeOff: [{ date: '2026-03-01' }] }] });
        expect(buildModel(problem).employeeBlockedIntervals.get('a')).to.deep.equal([]);
        expect(solveSchedule(problem).assignments).to.have.length(3);
    });
    it('opens every remaining shift when an absence has no end date', () => {
        const result = repairSchedule(input(), { kind: 'absence', employeeId: 'a', from: '2026-01-06' }, roster());
        expect(result.diff.removed).to.deep.equal([
            { employeeId: 'a', shiftInstanceId: 'day@2026-01-06' },
            { employeeId: 'a', shiftInstanceId: 'day@2026-01-07' },
        ]);
    });
    it('opens nothing for a no-show the published roster never contained', () => {
        const result = repairSchedule(
            input(),
            { kind: 'noShow', employeeId: 'b', shiftInstanceId: 'day@2026-01-06' },
            roster(),
        );
        expect(result.diff).to.deep.equal({ added: [], removed: [] });
    });
});

describe('rulesHash is a configuration fingerprint', () => {
    const hashOf = (overrides: Partial<ScheduleInput> = {}) => solveSchedule(input(overrides)).provenance!.rulesHash;

    it('does not move when the roster changes but the rules do not', () => {
        const base = hashOf();
        expect(hashOf({ employees: [{ id: 'a', tags: [], timeOff: [] }] })).to.equal(base);
        expect(
            hashOf({
                employees: [
                    { id: 'z', tags: [], timeOff: [] },
                    { id: 'b', tags: [], timeOff: [] },
                ],
            }),
        ).to.equal(base);
    });
    it('moves when an employee carries rules of their own', () => {
        expect(
            hashOf({
                employees: [
                    { id: 'a', tags: [], timeOff: [], rules: { workingTime: { maxPerShiftMinutes: 240 } } },
                    { id: 'b', tags: [], timeOff: [] },
                ],
            }),
        ).not.to.equal(hashOf());
    });
    it('moves when a personal override removes a global rule family', () => {
        const global = { rules: { workingTime: { maxPerShiftMinutes: 240 } } };
        expect(
            hashOf({
                ...global,
                employees: [
                    { id: 'a', tags: [], timeOff: [], rules: { workingTime: undefined } },
                    { id: 'b', tags: [], timeOff: [] },
                ],
            }),
        ).not.to.equal(hashOf(global));
    });
});
