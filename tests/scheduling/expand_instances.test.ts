import { expect } from 'chai';
import { expandShiftInstances, PeriodClock } from '../../src/scheduling';
import type { ScheduleInput } from '../../src/scheduling';

const H = 60;

/**
 * A host that draws a planning grid needs the same dated occurrences the engine
 * judges — ids included. Re-deriving `<templateId>@<date>` in the host is how a
 * grid ends up addressing cells the engine has never heard of, so the expansion
 * is public.
 */
describe('expandShiftInstances', () => {
    function input(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
        return {
            period: { startDate: '2026-09-01', endDate: '2026-09-07', timeZone: 'Europe/Tallinn' },
            employees: [{ id: 'anna', tags: ['support'], timeOff: [] }],
            shifts: [
                {
                    id: 'day',
                    name: 'Day',
                    startTime: '08:00',
                    endTime: '16:00',
                    daysOfWeek: [1, 2, 3, 4, 5],
                    minEmployees: 3,
                    tagRequirements: { support: 2 },
                    unpaidBreakMinutes: 30,
                },
                { id: 'night', name: 'Night', startTime: '22:00', endTime: '06:00', daysOfWeek: [1, 2, 3, 4, 5] },
            ],
            ...overrides,
        };
    }

    it('expands every template into dated instances with engine-identical ids', () => {
        const instances = expandShiftInstances(input());

        // Mon 2026-08-31 is outside the period; the week starts Tue 1 Sep.
        expect(instances.filter((i) => i.templateId === 'day').map((i) => i.id)).to.deep.equal([
            'day@2026-09-01',
            'day@2026-09-02',
            'day@2026-09-03',
            'day@2026-09-04',
            'day@2026-09-07',
        ]);
    });

    it('carries the staffing shape a grid renders empty slots from', () => {
        const day = expandShiftInstances(input()).find((i) => i.id === 'day@2026-09-01');

        expect(day).to.include({ minEmployees: 3, durationMinutes: 8 * H, workingMinutes: 7.5 * H });
        expect(day?.tagRequirements).to.deep.equal({ support: 2 });
    });

    it('resolves wall-clock through the period clock, so an overnight shift spans midnight', () => {
        const night = expandShiftInstances(input()).find((i) => i.id === 'night@2026-09-01');
        const clock = new PeriodClock('2026-09-01', 7, 'Europe/Tallinn');

        expect(night?.durationMinutes).to.equal(8 * H);
        expect(clock.toISOString(night!.endMinute)).to.contain('2026-09-02');
    });

    it('rejects a malformed template rather than expanding a wrong grid', () => {
        expect(() =>
            expandShiftInstances(input({ shifts: [{ id: 'bad', name: 'Bad', startTime: '08:00', endTime: '99:00' }] })),
        ).to.throw();
    });
});

/**
 * A peak fortnight, a closure, a week that needs a licence holder: temporary
 * demand is stated on the template, bounded by dates, and folded into the
 * occurrence before anything judges it. The solver and every operational API
 * read the folded `ShiftInstance`, so none of them has to know an override
 * exists — that is what keeps a lint and the solve reading the same headcount.
 */
describe('demand overrides', () => {
    const H = 60;
    function input(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
        return {
            period: { startDate: '2026-12-14', endDate: '2026-12-27', timeZone: 'Europe/Tallinn' },
            employees: [{ id: 'anna', tags: ['support'], timeOff: [] }],
            shifts: [
                {
                    id: 'day',
                    name: 'Day',
                    startTime: '08:00',
                    endTime: '16:00',
                    daysOfWeek: [1, 2, 3, 4, 5],
                    minEmployees: 1,
                    maxEmployees: 2,
                    demandOverrides: [
                        { from: '2026-12-21', to: '2026-12-24', label: 'Christmas peak', minEmployees: 3 },
                        { from: '2026-12-25', to: '2026-12-25', label: 'Closed', runs: false },
                    ],
                },
            ],
            ...overrides,
        };
    }
    const byId = (instances: ReturnType<typeof expandShiftInstances>) =>
        new Map(instances.map((instance) => [instance.id, instance]));

    it('raises the headcount only inside the dates and names why', () => {
        const instances = byId(expandShiftInstances(input()));

        expect(instances.get('day@2026-12-18')).to.include({ minEmployees: 1 });
        expect(instances.get('day@2026-12-18')?.demandLabel).to.equal(undefined);
        expect(instances.get('day@2026-12-21')).to.include({ minEmployees: 3, demandLabel: 'Christmas peak' });
        expect(instances.get('day@2026-12-24')).to.include({ minEmployees: 3 });
    });

    it('drops a closed occurrence entirely', () => {
        const ids = expandShiftInstances(input()).map((instance) => instance.id);
        expect(ids).to.not.include('day@2026-12-25');
        expect(ids).to.include('day@2026-12-24');
    });

    it('adds extra people on top of the standing shape, minimum and maximum alike', () => {
        const instances = byId(
            expandShiftInstances(
                input({
                    shifts: [
                        {
                            ...input().shifts[0],
                            demandOverrides: [{ from: '2026-12-21', to: '2026-12-27', extraEmployees: 2 }],
                        },
                    ],
                }),
            ),
        );
        expect(instances.get('day@2026-12-22')).to.include({ minEmployees: 3, maxEmployees: 4 });
        expect(instances.get('day@2026-12-18')).to.include({ minEmployees: 1, maxEmployees: 2 });
    });

    it('restricts to weekdays inside the range and lets a later override win', () => {
        const instances = byId(
            expandShiftInstances(
                input({
                    shifts: [
                        {
                            ...input().shifts[0],
                            daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
                            demandOverrides: [
                                {
                                    from: '2026-12-14',
                                    to: '2026-12-27',
                                    daysOfWeek: [6, 7],
                                    minEmployees: 2,
                                    label: 'Weekend',
                                },
                                { from: '2026-12-26', to: '2026-12-26', minEmployees: 4, label: 'Sale day' },
                            ],
                        },
                    ],
                }),
            ),
        );
        expect(instances.get('day@2026-12-19')).to.include({ minEmployees: 2, demandLabel: 'Weekend' });
        expect(instances.get('day@2026-12-18')).to.include({ minEmployees: 1 });
        expect(instances.get('day@2026-12-26')).to.include({ minEmployees: 4, demandLabel: 'Sale day' });
    });

    it('swaps the qualification gate for a stretch of dates', () => {
        const instances = byId(
            expandShiftInstances(
                input({
                    shifts: [
                        {
                            ...input().shifts[0],
                            demandOverrides: [{ from: '2026-12-21', to: '2026-12-22', requiredTags: ['licence'] }],
                        },
                    ],
                }),
            ),
        );
        expect(instances.get('day@2026-12-21')?.requiredTags).to.deep.equal(['licence']);
        expect(instances.get('day@2026-12-23')?.requiredTags).to.deep.equal([]);
    });

    it('opens a weekday-only shift for one weekend without touching the template', () => {
        // The whole point of the two-way `runs`: a shift that runs Mon–Fri and
        // has to open for one weekend is a temporary fact, and widening the
        // template's daysOfWeek would open every weekend from then on.
        const instances = byId(
            expandShiftInstances(
                input({
                    shifts: [
                        {
                            ...input().shifts[0],
                            demandOverrides: [
                                {
                                    from: '2026-12-19',
                                    to: '2026-12-20',
                                    runs: true,
                                    minEmployees: 2,
                                    label: 'Christmas weekend',
                                },
                            ],
                        },
                    ],
                }),
            ),
        );

        expect(instances.get('day@2026-12-19')).to.include({ minEmployees: 2, demandLabel: 'Christmas weekend' });
        expect(instances.get('day@2026-12-20')?.minEmployees).to.equal(2);
        // Every other weekend in the period stays shut.
        expect(instances.has('day@2026-12-26')).to.equal(false);
        expect(instances.has('day@2026-12-27')).to.equal(false);
    });

    it("takes the template's own shape on a day it opens, and can be shut again", () => {
        const instances = byId(
            expandShiftInstances(
                input({
                    shifts: [
                        {
                            ...input().shifts[0],
                            demandOverrides: [
                                { from: '2026-12-14', to: '2026-12-27', daysOfWeek: [6, 7], runs: true },
                                { from: '2026-12-26', to: '2026-12-27', runs: false, label: 'Boxing day' },
                            ],
                        },
                    ],
                }),
            ),
        );

        // Opened weekends inherit the template's own minimum, unstated.
        expect(instances.get('day@2026-12-19')?.minEmployees).to.equal(1);
        expect(instances.get('day@2026-12-20')?.minEmployees).to.equal(1);
        // A later override shuts the second weekend it had just opened.
        expect(instances.has('day@2026-12-26')).to.equal(false);
        expect(instances.has('day@2026-12-27')).to.equal(false);
        // And a weekday it never touched is unchanged.
        expect(instances.get('day@2026-12-18')?.minEmployees).to.equal(1);
    });

    it('rejects a combination nobody can staff, and malformed dates', () => {
        const bad = (demandOverrides: unknown) =>
            expandShiftInstances(input({ shifts: [{ ...input().shifts[0], demandOverrides: demandOverrides as never }] }));
        // A raised minimum lifts a standing maximum with it — "three at the
        // peak" means three — but a maximum the override states itself is held.
        const lifted = byId(bad([{ from: '2026-12-21', to: '2026-12-21', minEmployees: 5 }]));
        expect(lifted.get('day@2026-12-21')).to.include({ minEmployees: 5, maxEmployees: 5 });
        expect(() => bad([{ from: '2026-12-21', to: '2026-12-21', minEmployees: 5, maxEmployees: 3 }])).to.throw(
            /maxEmployees below/,
        );
        expect(() => bad([{ from: '2026-12-22', to: '2026-12-21' }])).to.throw(/precedes/);
        expect(() => bad([{ from: 'next week', to: '2026-12-21' }])).to.throw();
        expect(() => bad([{ from: '2026-12-21', to: '2026-12-21', extraEmployees: -1 }])).to.throw(/extraEmployees/);
        // Removing the maximum is allowed; the shift then has cover only.
        const noRoom = byId(bad([{ from: '2026-12-21', to: '2026-12-21', maxEmployees: null }]));
        expect(noRoom.get('day@2026-12-21')?.maxEmployees).to.equal(undefined);
    });

    it('is staffed by the solver at the peak headcount, and only there', async () => {
        const { solveSchedule } = await import('../../src/scheduling');
        const employees = ['anna', 'bruno', 'carla', 'dita'].map((id) => ({ id, tags: ['support'], timeOff: [] }));
        const plan = solveSchedule({
            ...input({ employees }),
            rules: { dailyRest: { minMinutes: 11 * H } },
            objectives: { fillToContract: false },
            timeBudgetMs: 0,
        });
        const count = (id: string) => plan.assignments.filter((pair) => pair.shiftInstanceId === id).length;
        expect(plan.stats.unfilledSlots).to.equal(0);
        expect(count('day@2026-12-21')).to.equal(3);
        expect(count('day@2026-12-18')).to.equal(1);
        expect(count('day@2026-12-25')).to.equal(0);
    });
});
