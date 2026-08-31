import { expect } from 'chai';
import {
    checkCompliance,
    diagnoseInfeasibility,
    explainCandidate,
    rankCandidates,
    solveSchedule,
} from '../../src/scheduling';
import type { ScheduleInput, ScheduledAssignment } from '../../src/scheduling';
import { buildSiteIndex, distanceKmBetween, travelMinutesBetween } from '../../src/scheduling/sites';
import { ScheduleValidationError } from '../../src/scheduling/types';

const H = 60;

function cityInput(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-11' },
        employees: [
            {
                id: 'anna',
                tags: ['nurse'],
                timeOff: [],
                homeSiteId: 'north',
                siteIds: ['north', 'south'],
            },
            {
                id: 'bo',
                tags: ['nurse'],
                timeOff: [],
                homeSiteId: 'south',
                siteIds: ['south'],
            },
        ],
        shifts: [
            {
                id: 'day-north',
                name: 'Day North',
                startTime: '08:00',
                endTime: '12:00',
                dates: ['2026-01-05'],
                siteId: 'north',
            },
            {
                id: 'day-south',
                name: 'Day South',
                startTime: '13:00',
                endTime: '17:00',
                dates: ['2026-01-05'],
                siteId: 'south',
            },
        ],
        sites: [
            { id: 'north', lat: 0, lng: 0, travelMinutesTo: { south: 120 } },
            { id: 'south', lat: 0, lng: 1, travelMinutesTo: { north: 90 } },
        ],
        travelSpeedKmh: 60,
        constraints: { minRestMinutes: 0 },
        timeBudgetMs: 0,
        ...overrides,
    };
}

function noSiteInput(): ScheduleInput {
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-11' },
        employees: [
            { id: 'anna', tags: ['nurse'], timeOff: [] },
            { id: 'bo', tags: ['nurse'], timeOff: [] },
        ],
        shifts: [
            {
                id: 'day',
                name: 'Day',
                startTime: '08:00',
                endTime: '12:00',
                dates: ['2026-01-05'],
            },
        ],
        constraints: { minRestMinutes: 0 },
        timeBudgetMs: 0,
    };
}

describe('Scheduling sites', function () {
    describe('site index', function () {
        it('rejects duplicate site ids', function () {
            expect(() => buildSiteIndex([{ id: 'a' }, { id: 'a' }])).to.throw(ScheduleValidationError);
        });

        it('rejects invalid coordinates', function () {
            expect(() => buildSiteIndex([{ id: 'a', lat: 200, lng: 0 }])).to.throw(ScheduleValidationError);
            expect(() => buildSiteIndex([{ id: 'a', lat: 0, lng: -200 }])).to.throw(ScheduleValidationError);
            expect(() => buildSiteIndex([{ id: 'a', lat: 0 }])).to.throw(ScheduleValidationError);
        });

        it('rejects negative matrix entries', function () {
            expect(() => buildSiteIndex([{ id: 'a', travelMinutesTo: { b: -1 } }])).to.throw(ScheduleValidationError);
        });

        it('rejects a non-positive fallback speed', function () {
            expect(() => buildSiteIndex([], 0)).to.throw(ScheduleValidationError);
            expect(() => buildSiteIndex([], -10)).to.throw(ScheduleValidationError);
        });

        it('returns 0 travel/distance for same site', function () {
            const idx = buildSiteIndex([{ id: 'a', lat: 0, lng: 0 }]);
            expect(travelMinutesBetween(idx, 'a', 'a')).to.equal(0);
            expect(distanceKmBetween(idx, 'a', 'a')).to.equal(0);
        });

        it('uses the matrix before haversine/speed', function () {
            const idx = buildSiteIndex(
                [
                    { id: 'north', lat: 0, lng: 0, travelMinutesTo: { south: 5 } },
                    { id: 'south', lat: 0, lng: 1 },
                ],
                60,
            );
            // Matrix says 5 minutes even though haversine/speed would be ~111 km / 60 km/h ≈ 111 min.
            expect(travelMinutesBetween(idx, 'north', 'south')).to.equal(5);
        });

        it('honours asymmetric matrix entries', function () {
            const idx = buildSiteIndex([
                { id: 'north', lat: 0, lng: 0, travelMinutesTo: { south: 120 } },
                { id: 'south', lat: 0, lng: 1, travelMinutesTo: { north: 90 } },
            ]);
            expect(travelMinutesBetween(idx, 'north', 'south')).to.equal(120);
            expect(travelMinutesBetween(idx, 'south', 'north')).to.equal(90);
        });

        it('falls back to haversine divided by speed', function () {
            // 1 degree of longitude at the equator ≈ 111.19 km.
            const idx = buildSiteIndex(
                [
                    { id: 'a', lat: 0, lng: 0 },
                    { id: 'b', lat: 0, lng: 1 },
                ],
                60,
            );
            const minutes = travelMinutesBetween(idx, 'a', 'b')!;
            expect(minutes).to.be.greaterThan(100).and.lessThan(120);
        });

        it('returns undefined minutes when neither matrix nor speed is available', function () {
            const idx = buildSiteIndex([
                { id: 'a', lat: 0, lng: 0 },
                { id: 'b', lat: 0, lng: 1 },
            ]);
            expect(travelMinutesBetween(idx, 'a', 'b')).to.be.undefined;
            expect(distanceKmBetween(idx, 'a', 'b')).to.be.approximately(111, 2);
        });

        it('returns undefined for unknown sites', function () {
            const idx = buildSiteIndex([{ id: 'a', lat: 0, lng: 0 }]);
            expect(travelMinutesBetween(idx, 'a', 'missing')).to.be.undefined;
            expect(distanceKmBetween(idx, 'a', 'missing')).to.be.undefined;
        });
    });

    describe('site eligibility', function () {
        it('blocks an employee from shifts at unlisted sites', function () {
            const input = cityInput();
            const result = solveSchedule(input);

            // Bo is only eligible for south, so the north shift must be filled by Anna.
            const north = result.assignments.filter((a) => a.shiftInstanceId === 'day-north@2026-01-05');
            expect(north.every((a) => a.employeeId === 'anna')).to.equal(true);
        });

        it('prunes site-restricted employees during propagation', function () {
            // Bo is the only employee and he is not eligible for the north shift.
            const input = cityInput({
                employees: [{ id: 'bo', tags: ['nurse'], timeOff: [], siteIds: ['south'] }],
                shifts: [
                    {
                        id: 'day-north',
                        name: 'Day North',
                        startTime: '08:00',
                        endTime: '12:00',
                        dates: ['2026-01-05'],
                        siteId: 'north',
                    },
                ],
            });
            const report = diagnoseInfeasibility(input);
            expect(report.feasible).to.equal(false);
            expect(report.findings[0].kind).to.equal('noEligibleEmployee');
        });

        it('appears in explainCandidate and checkCompliance', function () {
            const input = cityInput();
            const verdicts = explainCandidate(input, 'bo', 'day-north@2026-01-05');
            const site = verdicts.find((v) => v.ruleId === 'site-eligibility')!;
            expect(site.pass).to.equal(false);
            expect(site.severity).to.equal('hard');

            const edited: ScheduledAssignment[] = [
                { employeeId: 'bo', shiftInstanceId: 'day-north@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const report = checkCompliance(input, edited);
            expect(report.compliant).to.equal(false);
            expect(report.violations.some((v) => v.constraintId === 'site-eligibility')).to.equal(true);
        });

        it('is silent when the employee has no site restriction or the shift has no site', function () {
            const input = cityInput({
                employees: [{ id: 'anna', tags: ['nurse'], timeOff: [] }],
                shifts: [
                    { id: 'day-north', name: 'Day North', startTime: '08:00', endTime: '12:00', dates: ['2026-01-05'] },
                ],
            });
            const verdicts = explainCandidate(input, 'anna', 'day-north@2026-01-05');
            expect(verdicts.find((v) => v.ruleId === 'site-eligibility')!.pass).to.equal(true);
        });
    });

    describe('site travel gap', function () {
        it('blocks a cross-site switch that leaves too little travel time', function () {
            const input = cityInput();
            // Anna works north 08:00–12:00, then is offered south 13:00–17:00.
            // Gap is 60 min; matrix says 120 min needed.
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day-north@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const verdicts = explainCandidate(input, 'anna', 'day-south@2026-01-05', roster);
            const travel = verdicts.find((v) => v.ruleId === 'site-travel-gap')!;
            expect(travel.pass).to.equal(false);
            expect(travel.severity).to.equal('hard');
            expect(travel.actual).to.equal(60);
            expect(travel.required).to.equal(120);
        });

        it('passes when there is enough travel time', function () {
            const input = cityInput({
                shifts: [
                    {
                        id: 'day-north',
                        name: 'Day North',
                        startTime: '08:00',
                        endTime: '12:00',
                        dates: ['2026-01-05'],
                        siteId: 'north',
                    },
                    {
                        id: 'day-south',
                        name: 'Day South',
                        startTime: '14:00',
                        endTime: '18:00',
                        dates: ['2026-01-05'],
                        siteId: 'south',
                    },
                ],
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day-north@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const verdicts = explainCandidate(input, 'anna', 'day-south@2026-01-05', roster);
            expect(verdicts.find((v) => v.ruleId === 'site-travel-gap')!.pass).to.equal(true);
        });

        it('ignores same-site switches', function () {
            const input = cityInput({
                shifts: [
                    {
                        id: 'morn-north',
                        name: 'Morning North',
                        startTime: '08:00',
                        endTime: '12:00',
                        dates: ['2026-01-05'],
                        siteId: 'north',
                    },
                    {
                        id: 'aft-north',
                        name: 'Afternoon North',
                        startTime: '13:00',
                        endTime: '17:00',
                        dates: ['2026-01-05'],
                        siteId: 'north',
                    },
                ],
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'morn-north@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const verdicts = explainCandidate(input, 'anna', 'aft-north@2026-01-05', roster);
            expect(verdicts.find((v) => v.ruleId === 'site-travel-gap')!.pass).to.equal(true);
        });

        it('judges only the immediate predecessor and successor, not every different-site entry', function () {
            const input = cityInput({
                employees: [{ id: 'anna', tags: ['nurse'], timeOff: [], siteIds: ['A', 'B', 'C'] }],
                sites: [
                    { id: 'A', travelMinutesTo: { B: 10, C: 300 } },
                    { id: 'B', travelMinutesTo: { C: 10 } },
                    { id: 'C' },
                ],
                shifts: [
                    { id: 'a', name: 'A', startTime: '08:00', endTime: '09:00', dates: ['2026-01-05'], siteId: 'A' },
                    { id: 'b', name: 'B', startTime: '09:15', endTime: '10:15', dates: ['2026-01-05'], siteId: 'B' },
                    { id: 'c', name: 'C', startTime: '10:30', endTime: '11:30', dates: ['2026-01-05'], siteId: 'C' },
                ],
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'a@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'b@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            // A→C directly would need 300 min, but the actual path is A→B→C and the
            // immediate predecessor of C is B, with a 15-minute gap against a 10-minute need.
            const verdicts = explainCandidate(input, 'anna', 'c@2026-01-05', roster);
            expect(verdicts.find((v) => v.ruleId === 'site-travel-gap')!.pass).to.equal(true);
        });

        it('is silent when travel data is unknown', function () {
            const input = cityInput({
                sites: [{ id: 'north' }, { id: 'south' }],
                travelSpeedKmh: undefined,
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day-north@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const verdicts = explainCandidate(input, 'anna', 'day-south@2026-01-05', roster);
            expect(verdicts.find((v) => v.ruleId === 'site-travel-gap')!.pass).to.equal(true);
        });

        it('sees history entries that carry a siteId', function () {
            const input = cityInput({
                history: [
                    {
                        employeeId: 'anna',
                        date: '2026-01-04',
                        startTime: '20:00',
                        endTime: '23:00',
                        siteId: 'south',
                    },
                ],
                shifts: [
                    {
                        id: 'early-north',
                        name: 'Early North',
                        startTime: '00:00',
                        endTime: '04:00',
                        dates: ['2026-01-05'],
                        siteId: 'north',
                    },
                ],
            });
            const verdicts = explainCandidate(input, 'anna', 'early-north@2026-01-05');
            const travel = verdicts.find((v) => v.ruleId === 'site-travel-gap')!;
            expect(travel.pass).to.equal(false);
        });
    });

    describe('home-site preference', function () {
        it('appears as a soft verdict when an employee works away from home', function () {
            const input = cityInput({ objectives: { homeSiteWeight: 1 } });
            const verdicts = explainCandidate(input, 'anna', 'day-south@2026-01-05');
            const home = verdicts.find((v) => v.ruleId === 'site-home')!;
            expect(home.pass).to.equal(false);
            expect(home.severity).to.equal('soft');
            expect(home.message).to.contain('south');
        });

        it('passes when the shift is at the employee home site', function () {
            const input = cityInput({ objectives: { homeSiteWeight: 1 } });
            const verdicts = explainCandidate(input, 'anna', 'day-north@2026-01-05');
            expect(verdicts.find((v) => v.ruleId === 'site-home')!.pass).to.equal(true);
        });

        it('is absent when no weight is configured', function () {
            const input = cityInput();
            const verdicts = explainCandidate(input, 'anna', 'day-south@2026-01-05');
            expect(verdicts.some((v) => v.ruleId === 'site-home')).to.equal(false);
        });
    });

    describe('rankCandidates', function () {
        it('ranks a nearer candidate above a farther one', function () {
            const input = cityInput({
                employees: [
                    { id: 'anna', tags: ['nurse'], timeOff: [], homeSiteId: 'north' },
                    { id: 'bo', tags: ['nurse'], timeOff: [], homeSiteId: 'south' },
                ],
            });
            const candidates = rankCandidates(input, 'day-north@2026-01-05', []);
            const anna = candidates.find((c) => c.employeeId === 'anna')!;
            const bo = candidates.find((c) => c.employeeId === 'bo')!;
            expect(anna.travelMinutes).to.equal(0);
            expect(bo.travelMinutes).to.equal(90);
            expect(anna.rank).to.be.lessThan(bo.rank);
        });

        it('infers origin from a same-day assignment before the home site', function () {
            const input = cityInput({
                employees: [{ id: 'anna', tags: ['nurse'], timeOff: [], homeSiteId: 'south' }],
            });
            // Anna is scheduled at north in the morning; the opening is south in the afternoon.
            // Her home site is south, but her actual origin for the day is north.
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'day-north@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const candidates = rankCandidates(input, 'day-south@2026-01-05', roster);
            const anna = candidates.find((c) => c.employeeId === 'anna')!;
            expect(anna.originSiteId).to.equal('north');
            expect(anna.travelMinutes).to.equal(120);
        });

        it('ignores later same-day assignments when inferring origin', function () {
            const input = cityInput({
                employees: [{ id: 'anna', tags: ['nurse'], timeOff: [], homeSiteId: 'east' }],
                sites: [
                    { id: 'north', travelMinutesTo: { south: 30 } },
                    { id: 'south' },
                    { id: 'east', travelMinutesTo: { south: 5 } },
                ],
                shifts: [
                    {
                        id: 'morn-north',
                        name: 'Morning North',
                        startTime: '08:00',
                        endTime: '10:00',
                        dates: ['2026-01-05'],
                        siteId: 'north',
                    },
                    {
                        id: 'mid-south',
                        name: 'Mid South',
                        startTime: '12:00',
                        endTime: '14:00',
                        dates: ['2026-01-05'],
                        siteId: 'south',
                    },
                    {
                        id: 'aft-east',
                        name: 'Afternoon East',
                        startTime: '16:00',
                        endTime: '18:00',
                        dates: ['2026-01-05'],
                        siteId: 'east',
                    },
                ],
            });
            const roster: ScheduledAssignment[] = [
                { employeeId: 'anna', shiftInstanceId: 'morn-north@2026-01-05', date: '2026-01-05', reasons: [] },
                { employeeId: 'anna', shiftInstanceId: 'aft-east@2026-01-05', date: '2026-01-05', reasons: [] },
            ];
            const candidates = rankCandidates(input, 'mid-south@2026-01-05', roster);
            const anna = candidates.find((c) => c.employeeId === 'anna')!;
            expect(anna.originSiteId).to.equal('north');
            expect(anna.travelMinutes).to.equal(30);
        });

        it('falls back to the home site when there is no same-day assignment', function () {
            const input = cityInput({
                employees: [{ id: 'anna', tags: ['nurse'], timeOff: [], homeSiteId: 'south' }],
            });
            const candidates = rankCandidates(input, 'day-south@2026-01-05', []);
            const anna = candidates.find((c) => c.employeeId === 'anna')!;
            expect(anna.originSiteId).to.equal('south');
            expect(anna.isHomeSite).to.equal(true);
            expect(anna.travelMinutes).to.equal(0);
        });

        it('surfaces site-eligibility blockers on ineligible candidates', function () {
            const input = cityInput();
            const candidates = rankCandidates(input, 'day-north@2026-01-05', []);
            const bo = candidates.find((c) => c.employeeId === 'bo')!;
            expect(bo.eligible).to.equal(false);
            expect(bo.blockers.some((b) => b.ruleId === 'site-eligibility')).to.equal(true);
        });
    });

    describe('provenance', function () {
        it('omits site keys from the hash when no site data is supplied', function () {
            const a = solveSchedule(noSiteInput()).provenance!.rulesHash;
            const b = solveSchedule({ ...noSiteInput(), sites: undefined, travelSpeedKmh: undefined }).provenance!
                .rulesHash;
            expect(a).to.equal(b);
        });

        it('changes the rules hash when sites or travel speed change', function () {
            const a = solveSchedule(cityInput()).provenance!.rulesHash;
            const b = solveSchedule(cityInput({ travelSpeedKmh: 90 })).provenance!.rulesHash;
            const c = solveSchedule(
                cityInput({
                    sites: [
                        { id: 'north', lat: 0, lng: 0 },
                        { id: 'south', lat: 0, lng: 1 },
                    ],
                }),
            ).provenance!.rulesHash;
            expect(a).to.not.equal(b);
            expect(a).to.not.equal(c);
        });
    });
});
