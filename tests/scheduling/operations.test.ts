import { expect } from 'chai';
import {
    checkCompliance,
    explainCandidate,
    repairSchedule,
    rankCandidates,
    diagnoseInfeasibility,
    solveSchedule,
} from '../../src/scheduling';
import type { ScheduleInput, ScheduledAssignment } from '../../src/scheduling';

const H = 60;

/** A small ward: three nurses, a night and a day shift over one week. */
function wardInput(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    const week = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'];
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-11', timeZone: 'Europe/Berlin' },
        employees: [
            { id: 'anna', tags: ['nurse'], timeOff: [] },
            { id: 'bo', tags: ['nurse'], timeOff: [] },
            { id: 'cara', tags: ['nurse'], timeOff: [] },
        ],
        shifts: [
            { id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', dates: week, shiftTypeTag: 'day' },
            { id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', dates: week, shiftTypeTag: 'night' },
        ],
        rules: {
            dailyRest: { minMinutes: 11 * H },
            nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: 2 * H },
        },
        timeBudgetMs: 0,
        ...overrides,
    };
}

describe('Scheduling operations', function () {
    describe('checkCompliance', function () {
        it('accepts a roster the solver itself produced', function () {
            const input = wardInput();
            const solved = solveSchedule(input);
            const report = checkCompliance(input, solved.assignments);
            expect(report.compliant).to.equal(true);
            expect(report.violations.filter((v) => v.severity === 'hard')).to.have.length(0);
        });

        it('catches a hand-edited roster that breaks the 11h rest rule', function () {
            const input = wardInput();
            // A human puts Anna on a night and the following morning.
            const edited: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'night@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-06', date: '2026-01-06', reasons: [] },
            ];
            const report = checkCompliance(input, edited);
            expect(report.compliant).to.equal(false);
            const rest = report.violations.find((v) => v.constraintId === 'daily-rest');
            expect(rest, 'daily-rest violation reported').to.exist;
            expect(rest!.actual).to.equal(2 * H);
            expect(rest!.required).to.equal(11 * H);
            expect(rest!.citation).to.contain('Art 3');
        });

        it('reports unknown employees and shifts instead of silently ignoring them', function () {
            const report = checkCompliance(wardInput(), [
                { employeeId: 'ghost', shiftInstanceId: 'day@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'nope@2026-01-05', date: '2026-01-05', reasons: [] },
            ]);
            expect(report.violations.filter((v) => v.constraintId === 'input')).to.have.length(2);
            expect(report.compliant).to.equal(false);
        });

        it('is the same code path as the solver, so an accepted roster stays accepted', function () {
            const input = wardInput({ timeBudgetMs: 50 });
            const solved = solveSchedule(input);
            expect(solved.violations.filter((v) => v.severity === 'hard')).to.have.length(0);
            expect(checkCompliance(input, solved.assignments).compliant).to.equal(true);
        });

        it('agrees with the solver about the same roster, rule for rule', function () {
            // Regression: the solver once reported only aggregate violations
            // while compliance evaluated every pair, so a solve could announce
            // "no hard violations" on a roster compliance then rejected.
            const input = wardInput({ timeBudgetMs: 100 });
            const solved = solveSchedule(input);
            const report = checkCompliance(input, solved.assignments);

            const key = (v: { constraintId: string; employeeId?: string; shiftInstanceId?: string }) =>
                `${v.constraintId}|${v.employeeId ?? ''}|${v.shiftInstanceId ?? ''}`;
            const solveHard = new Set(solved.violations.filter((v) => v.severity === 'hard').map(key));
            const checkHard = new Set(report.violations.filter((v) => v.severity === 'hard').map(key));
            expect(
                [...checkHard].filter((k) => !solveHard.has(k)),
                'compliance found what the solve missed',
            ).to.deep.equal([]);
        });

        it("surfaces a pair-level breach in the solver's own violation list", function () {
            const input = wardInput();
            const edited: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'night@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-06', date: '2026-01-06', reasons: [] },
            ];
            const report = checkCompliance(input, edited);
            const rest = report.violations.find((v) => v.constraintId === 'daily-rest')!;
            // Machine-readable, not just a sentence: hosts render these.
            expect(rest.unit).to.equal('minutes');
            expect(rest.actual).to.be.a('number');
            expect(rest.required).to.be.a('number');
        });

        it('reports the same accrued obligations the solver would, ledger for ledger', function () {
            // Overtime compensated in time off makes every roster with hours
            // past the ordinary baseline accrue a debt the caller must see —
            // whether the solver or a human produced the roster.
            const input = wardInput({
                employees: [
                    { id: 'anna', tags: ['nurse'], timeOff: [], overtimeConsent: true },
                    { id: 'bo', tags: ['nurse'], timeOff: [], overtimeConsent: true },
                    { id: 'cara', tags: ['nurse'], timeOff: [], overtimeConsent: true },
                ],
                rules: {
                    dailyRest: { minMinutes: 11 * H },
                    nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: 2 * H },
                    overtime: { ordinaryPerWeekMinutes: 10 * H, compensation: 'timeOff', requiresConsent: true },
                },
                timeBudgetMs: 100,
            });
            const solved = solveSchedule(input);
            expect(solved.ledger!, 'fixture must accrue obligations').to.have.length.greaterThan(0);
            const report = checkCompliance(input, solved.assignments);
            expect(report.ledger).to.deep.equal(solved.ledger!);
        });

        it('charges overtime a hand-edited roster accrues, not only a solved one', function () {
            const input = wardInput({
                rules: {
                    dailyRest: { minMinutes: 11 * H },
                    nightWork: { window: { from: '23:00', to: '06:00' }, qualifiesAfterMinutes: 2 * H },
                    overtime: { ordinaryPerWeekMinutes: 10 * H, compensation: 'timeOff', requiresConsent: true },
                },
            });
            // A human puts Anna on two day shifts: 16h against a 10h weekly
            // baseline accrues 6h of time off in lieu the report must carry.
            const edited: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-06', date: '2026-01-06', reasons: [] },
            ];
            const report = checkCompliance(input, edited);
            const debt = report.ledger.find((l) => l.kind === 'timeOffInLieu' && l.employeeId === 'anna');
            expect(debt, 'time-off-in-lieu debt reported').to.exist;
            expect(debt!.minutes).to.equal(6 * H);
        });
    });

    describe('explainCandidate', function () {
        it('returns a verdict from every registered rule', function () {
            const input = wardInput();
            const verdicts = explainCandidate(input, 'anna', 'day@2026-01-05');
            const ids = verdicts.map((v) => v.ruleId);
            expect(ids).to.include('daily-rest');
            expect(ids).to.include('night-work');
            expect(verdicts.every((v) => typeof v.message === 'string')).to.equal(true);
        });

        it('explains a refusal with concrete numbers', function () {
            const input = wardInput();
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'night@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const verdicts = explainCandidate(input, 'anna', 'day@2026-01-06', roster);
            const rest = verdicts.find((v) => v.ruleId === 'daily-rest')!;
            expect(rest.pass).to.equal(false);
            expect(rest.actual).to.equal(2 * H);
            expect(rest.required).to.equal(11 * H);
            expect(rest.message).to.contain('2.0h');
        });

        it('ignores the candidate pair itself when it is already in the roster', function () {
            const input = wardInput();
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const verdicts = explainCandidate(input, 'anna', 'day@2026-01-05', roster);
            expect(verdicts.find((v) => v.ruleId === 'no-overlap')!.pass).to.equal(true);
        });
    });

    describe('rankCandidates', function () {
        it('puts eligible people above ineligible ones and still explains the blocked', function () {
            const input = wardInput();
            // Bo worked the night before, so a morning shift breaks his rest.
            const roster: ScheduledAssignment[] = [
                { employeeId: 'bo', shiftInstanceId: 'night@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const candidates = rankCandidates(input, 'day@2026-01-06', roster);

            const bo = candidates.find((c) => c.employeeId === 'bo')!;
            expect(bo.eligible).to.equal(false);
            expect(bo.blockers.map((b) => b.ruleId)).to.include('daily-rest');
            expect(bo.rationale).to.contain('rest');

            // Anna and Cara are free, so they outrank Bo.
            expect(candidates[0].eligible).to.equal(true);
            expect(candidates[candidates.length - 1].employeeId).to.equal('bo');
        });

        it('says which of the shift’s skills each candidate holds on its date', function () {
            const input = wardInput({
                employees: [
                    { id: 'anna', tags: ['nurse', 'first-aid'], timeOff: [] },
                    { id: 'bo', tags: ['nurse'], timeOff: [] },
                    // A certificate that lapsed the day before counts for nothing.
                    {
                        id: 'cara',
                        tags: ['nurse'],
                        timeOff: [],
                        qualifications: [{ tag: 'first-aid', validUntil: '2026-01-04' }],
                    },
                ],
                shifts: [
                    {
                        id: 'day',
                        name: 'Day',
                        startTime: '08:00',
                        endTime: '16:00',
                        dates: ['2026-01-05'],
                        minEmployees: 2,
                        tagRequirements: { 'first-aid': 1 },
                    },
                ],
            });
            const byId = new Map(rankCandidates(input, 'day@2026-01-05', []).map((c) => [c.employeeId, c]));
            expect(byId.get('anna')!.tagsHeld).to.deep.equal(['first-aid']);
            expect(byId.get('bo')!.tagsHeld).to.deep.equal([]);
            expect(byId.get('cara')!.tagsHeld).to.deep.equal([]);
        });

        it('prefers the cheaper person when both are eligible', function () {
            const input = wardInput({
                employees: [
                    { id: 'cheap', tags: ['nurse'], timeOff: [], cost: { hourlyRateCents: 2000 } },
                    { id: 'pricey', tags: ['nurse'], timeOff: [], cost: { hourlyRateCents: 6000 } },
                ],
            });
            const candidates = rankCandidates(input, 'day@2026-01-05', []);
            expect(candidates[0].employeeId).to.equal('cheap');
            expect(candidates[0].marginalCostCents).to.be.lessThan(candidates[1].marginalCostCents);
        });

        it('stacks premiums additively when the jurisdiction requires it (RO)', function () {
            const base = {
                id: 'ro',
                tags: ['nurse'],
                timeOff: [],
                cost: {
                    hourlyRateCents: 1000,
                    premiums: [
                        { predicate: 'night' as const, multiplier: 1.25 },
                        { predicate: 'holiday' as const, multiplier: 2 },
                    ],
                },
            };
            const makeInput = (stacking: 'add' | 'max'): ScheduleInput =>
                wardInput({
                    employees: [{ ...base, cost: { ...base.cost, stacking } }],
                    calendar: { publicHolidays: ['2026-01-05'] },
                });

            const addCost = rankCandidates(makeInput('add'), 'night@2026-01-05', [])[0].marginalCostCents;
            const maxCost = rankCandidates(makeInput('max'), 'night@2026-01-05', [])[0].marginalCostCents;
            // add: 1 + 0.25 + 1.0 = 2.25x  vs  max: 2.0x
            expect(addCost).to.be.greaterThan(maxCost);
        });

        it('favours the person with the greater fairness debt when cost is equal', function () {
            const input = wardInput();
            // Anna already has two shifts; Cara has none.
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'day@2026-01-06', date: '2026-01-06', reasons: [] },
            ];
            const candidates = rankCandidates(input, 'day@2026-01-08', roster).filter((c) => c.eligible);
            expect(candidates[0].employeeId).to.not.equal('anna');
            expect(candidates[0].fairnessDebt).to.be.greaterThan(0);
        });

        it('respects a stated preference to avoid a window', function () {
            const input = wardInput({
                employees: [
                    { id: 'willing', tags: ['nurse'], timeOff: [] },
                    {
                        id: 'reluctant',
                        tags: ['nurse'],
                        timeOff: [],
                        availability: [{ kind: 'avoid', daysOfWeek: [1], weight: 5 }],
                    },
                ],
            });
            const candidates = rankCandidates(input, 'day@2026-01-05', []);
            expect(candidates[0].employeeId).to.equal('willing');
        });

        it('carries no behavioural or predictive signal in the ranking', function () {
            // The ranking inputs are declared data and realised counts only.
            const input = wardInput();
            const candidate = rankCandidates(input, 'day@2026-01-05', [])[0];
            expect(Object.keys(candidate)).to.have.members([
                'employeeId',
                'shiftInstanceId',
                'eligible',
                'verdicts',
                'blockers',
                'marginalCostCents',
                'fairnessDebt',
                'rank',
                'rationale',
                'originSiteId',
                'travelMinutes',
                'distanceKm',
                'isHomeSite',
                // Declared qualifications on the shift's date — a fact, not a prediction.
                'tagsHeld',
            ]);
        });

        it('prefers a candidate closer to the shift site', function () {
            const input = wardInput({
                constraints: { minRestMinutes: 0 },
                employees: [
                    { id: 'near', tags: ['nurse'], timeOff: [], homeSiteId: 'alpha' },
                    { id: 'far', tags: ['nurse'], timeOff: [], homeSiteId: 'beta' },
                ],
                shifts: [
                    {
                        id: 'day',
                        name: 'Day',
                        startTime: '08:00',
                        endTime: '16:00',
                        dates: ['2026-01-05'],
                        siteId: 'alpha',
                    },
                ],
                sites: [
                    { id: 'alpha', lat: 0, lng: 0 },
                    { id: 'beta', lat: 0, lng: 1 },
                ],
                travelSpeedKmh: 60,
            });
            const candidates = rankCandidates(input, 'day@2026-01-05', []);
            expect(candidates[0].employeeId).to.equal('near');
            expect(candidates[0].isHomeSite).to.equal(true);
            expect(candidates[0].travelMinutes).to.equal(0);
            expect(candidates[1].travelMinutes).to.be.greaterThan(0);
        });
    });

    describe('repairSchedule', function () {
        it('fills a no-show and reports a bounded diff', function () {
            const input = wardInput({ timeBudgetMs: 0 });
            const published = solveSchedule(input).assignments;
            const victim = published.find((a) => a.shiftInstanceId === 'day@2026-01-07')!;

            const result = repairSchedule(
                input,
                { kind: 'noShow', employeeId: victim.employeeId, shiftInstanceId: victim.shiftInstanceId },
                published,
            );

            expect(result.candidates.length).to.be.greaterThan(0);
            expect(result.candidates[0].shiftInstanceId).to.equal('day@2026-01-07');
            // A repair must not rewrite the whole roster.
            expect(result.perturbation.changedAssignments).to.be.lessThan(published.length);
        });

        it('never proposes someone the rules block', function () {
            const input = wardInput();
            const published = solveSchedule(input).assignments;
            const victim = published.find((a) => a.shiftInstanceId === 'day@2026-01-07')!;
            const result = repairSchedule(
                input,
                { kind: 'noShow', employeeId: victim.employeeId, shiftInstanceId: victim.shiftInstanceId },
                published,
            );
            for (const candidate of result.candidates.filter((c) => c.eligible)) {
                expect(candidate.blockers).to.have.length(0);
            }
        });

        it('excludes the absent person from their own replacements', function () {
            const input = wardInput();
            const published = solveSchedule(input).assignments;
            const result = repairSchedule(input, { kind: 'absence', employeeId: 'anna', from: '2026-01-07' }, published);
            expect(result.candidates.every((c) => c.employeeId !== 'anna')).to.equal(true);
        });

        it('keeps untouched assignments pinned across the repair', function () {
            const input = wardInput({ timeBudgetMs: 0 });
            const published = solveSchedule(input).assignments;
            const victim = published.find((a) => a.shiftInstanceId === 'night@2026-01-08')!;
            const result = repairSchedule(
                input,
                { kind: 'noShow', employeeId: victim.employeeId, shiftInstanceId: victim.shiftInstanceId },
                published,
            );
            // Nothing outside the disrupted shift should be dropped.
            expect(result.diff.removed.every((p) => p.shiftInstanceId === 'night@2026-01-08')).to.equal(true);
        });
    });

    describe('diagnoseInfeasibility', function () {
        it('reports a shift nobody is eligible for', function () {
            const report = diagnoseInfeasibility(
                wardInput({
                    employees: [{ id: 'anna', tags: ['nurse'], timeOff: [{ date: '2026-01-05' }] }],
                    shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', dates: ['2026-01-05'] }],
                }),
            );
            expect(report.feasible).to.equal(false);
            expect(report.findings[0].kind).to.equal('noEligibleEmployee');
        });

        it('reports a tag nobody in the team holds', function () {
            const report = diagnoseInfeasibility(
                wardInput({
                    employees: [{ id: 'anna', tags: ['nurse'], timeOff: [] }],
                    shifts: [
                        {
                            id: 'icu',
                            name: 'ICU',
                            startTime: '08:00',
                            endTime: '16:00',
                            dates: ['2026-01-05'],
                            tagRequirements: { anaesthetist: 1 },
                        },
                    ],
                }),
            );
            const finding = report.findings.find((f) => f.kind === 'tagCapacity');
            expect(finding, 'tag capacity finding').to.exist;
            expect(finding!.message).to.contain('anaesthetist');
        });

        it('reports, per skill, the days fewer holders are free than the shifts ask for', function () {
            const week = ['2026-01-05', '2026-01-06', '2026-01-07'];
            const report = diagnoseInfeasibility(
                wardInput({
                    employees: [
                        { id: 'anna', tags: ['nurse', 'key-holder'], timeOff: [{ date: '2026-01-06' }] },
                        { id: 'bo', tags: ['nurse', 'key-holder'], timeOff: [] },
                        { id: 'cara', tags: ['nurse'], timeOff: [] },
                    ],
                    shifts: [
                        {
                            id: 'early',
                            name: 'Early',
                            startTime: '06:00',
                            endTime: '14:00',
                            dates: week,
                            tagRequirements: { 'key-holder': 1 },
                        },
                        {
                            id: 'late',
                            name: 'Late',
                            startTime: '14:00',
                            endTime: '22:00',
                            dates: week,
                            tagRequirements: { 'key-holder': 1 },
                        },
                    ],
                }),
            );
            const cover = report.tagCover.find((c) => c.tag === 'key-holder')!;
            expect(cover.kind).to.equal('mix');
            expect(cover.shifts).to.equal(6);
            expect(cover.seats).to.equal(6);
            expect(cover.holders).to.equal(2);
            // Two seats a day; on the 6th Anna is off, so one holder is free.
            expect(cover.shortDates).to.deep.equal([{ date: '2026-01-06', needed: 2, available: 1 }]);
            expect(cover.tightDates).to.deep.equal(['2026-01-05', '2026-01-07']);
        });

        it('counts a hard gate as every seat on the shift and reads dated certificates by day', function () {
            const report = diagnoseInfeasibility(
                wardInput({
                    employees: [
                        {
                            id: 'anna',
                            tags: [],
                            timeOff: [],
                            qualifications: [{ tag: 'sia', validUntil: '2026-01-05' }],
                        },
                        { id: 'bo', tags: ['sia'], timeOff: [] },
                    ],
                    shifts: [
                        {
                            id: 'door',
                            name: 'Door',
                            startTime: '18:00',
                            endTime: '23:00',
                            dates: ['2026-01-05', '2026-01-06'],
                            minEmployees: 2,
                            requiredTags: ['sia'],
                        },
                    ],
                }),
            );
            const cover = report.tagCover.find((c) => c.tag === 'sia')!;
            expect(cover.kind).to.equal('everyone');
            expect(cover.seats).to.equal(4);
            expect(cover.holders).to.equal(2);
            expect(cover.shortDates).to.deep.equal([{ date: '2026-01-06', needed: 2, available: 1 }]);
        });

        it('has no cover rows for a roster that asks for no skills', function () {
            expect(diagnoseInfeasibility(wardInput()).tagCover).to.deep.equal([]);
        });

        it('reports aggregate capacity shortfalls no single shift reveals', function () {
            const week = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09'];
            const report = diagnoseInfeasibility(
                wardInput({
                    // One nurse capped at 8h for the week, but 5 × 8h of demand.
                    employees: [{ id: 'anna', tags: ['nurse'], timeOff: [], maxHoursForPeriod: 8 }],
                    shifts: [{ id: 'day', name: 'Day', startTime: '08:00', endTime: '16:00', dates: week }],
                }),
            );
            const finding = report.findings.find((f) => f.kind === 'insufficientCapacity' && !f.shiftInstanceId);
            expect(finding, 'aggregate capacity finding').to.exist;
            expect(finding!.message).to.contain('hour budgets total');
        });

        it('reports a feasible problem as feasible', function () {
            expect(diagnoseInfeasibility(wardInput()).feasible).to.equal(true);
        });
    });

    describe('provenance', function () {
        it('stamps the solve so a roster can be reproduced and defended', function () {
            const input = wardInput({ seed: 7 });
            const result = solveSchedule(input);
            expect(result.provenance!.seed).to.equal(7);
            expect(result.provenance!.profilingFree).to.equal(true);
            expect(result.provenance!.rulesHash).to.match(/^[0-9a-f]{16}$/);
        });

        it('changes the rules hash when a rule changes, and not otherwise', function () {
            const a = solveSchedule(wardInput()).provenance!.rulesHash;
            const b = solveSchedule(wardInput()).provenance!.rulesHash;
            const c = solveSchedule(wardInput({ rules: { dailyRest: { minMinutes: 12 * H } } })).provenance!.rulesHash;
            expect(a).to.equal(b);
            expect(a).to.not.equal(c);
        });

        it("records the caller's duty classification note", function () {
            const result = solveSchedule(
                wardInput({
                    shifts: [
                        {
                            id: 'standby',
                            name: 'Standby',
                            startTime: '18:00',
                            endTime: '08:00',
                            dates: ['2026-01-05'],
                            duty: {
                                countsAsWorkingTime: 0.25,
                                classificationNote: 'off-premises, 60min response (C-344/19)',
                            },
                        },
                    ],
                }),
            );
            expect(result.provenance!.dutyClassificationNotes!.standby).to.contain('C-344/19');
        });
    });
});
