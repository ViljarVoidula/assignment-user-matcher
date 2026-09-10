import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { solveSchedule, expandShiftInstances, ScheduleValidationError } from '../../src/scheduling';
import type { ScheduleInput, ShiftTemplate } from '../../src/scheduling';

/**
 * Sites carry the facts that vary by *where the shift happens*: which public
 * holidays apply there, and which wall clock its hours are read against.
 *
 * The timezone half is deliberately a refusal rather than a feature. Instances
 * are already placed in absolute period minutes, so rest gaps and overlaps are
 * correct across zones today — but the night band, break windows and day
 * boundaries are resolved once, at expansion, against a single `PeriodClock`.
 * A roster spanning two zones would therefore compute one country's night
 * band an hour out and report itself compliant. Until the clock is per site,
 * the engine refuses the input instead of answering it wrongly.
 */

const PERIOD = { startDate: '2026-06-01', endDate: '2026-06-07', timeZone: 'Europe/Tallinn' };

function shift(id: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: '09:00', endTime: '17:00', dates, ...extra };
}

function input(over: Partial<ScheduleInput> = {}): ScheduleInput {
    return {
        period: PERIOD,
        employees: [{ id: 'e1', tags: [], timeOff: [] }],
        shifts: [],
        timeBudgetMs: 50,
        ...over,
    } as ScheduleInput;
}

describe('site jurisdiction', () => {
    describe('timezone', () => {
        it('accepts sites that agree with the period zone', () => {
            const ctx = buildModel(
                input({
                    sites: [
                        { id: 'tallinn', timeZone: 'Europe/Tallinn' },
                        { id: 'tartu', timeZone: 'Europe/Tallinn' },
                    ],
                }),
            );
            expect(ctx.siteIndex.byId.size).to.equal(2);
        });

        it('accepts sites that declare no zone at all', () => {
            const ctx = buildModel(input({ sites: [{ id: 'tallinn' }, { id: 'tartu' }] }));
            expect(ctx.siteIndex.byId.size).to.equal(2);
        });

        it('refuses a site whose zone differs from the period zone', () => {
            expect(() =>
                buildModel(
                    input({
                        sites: [
                            { id: 'tallinn', timeZone: 'Europe/Tallinn' },
                            { id: 'stockholm', timeZone: 'Europe/Stockholm' },
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError, /Europe\/Stockholm/);
        });

        it('names both the site and the period zone so the fix is obvious', () => {
            let message = '';
            try {
                buildModel(input({ sites: [{ id: 'stockholm', timeZone: 'Europe/Stockholm' }] }));
            } catch (error) {
                message = (error as Error).message;
            }
            expect(message).to.contain('stockholm');
            expect(message).to.contain('Europe/Stockholm');
            expect(message).to.contain('Europe/Tallinn');
        });

        it('refuses an unknown zone rather than silently falling back to UTC', () => {
            expect(() => buildModel(input({ sites: [{ id: 's', timeZone: 'Mars/Olympus' }] }))).to.throw(
                ScheduleValidationError,
            );
        });
    });

    describe('per-site public holidays', () => {
        it('marks an instance a holiday from its own site calendar', () => {
            const ctx = buildModel(
                input({
                    sites: [
                        { id: 'ee', publicHolidays: ['2026-06-03'] },
                        { id: 'se', publicHolidays: ['2026-06-04'] },
                    ],
                    shifts: [
                        shift('ee-day', ['2026-06-03', '2026-06-04'], { siteId: 'ee' }),
                        shift('se-day', ['2026-06-03', '2026-06-04'], { siteId: 'se' }),
                    ],
                }),
            );
            const holidays = ctx.instances.filter((i) => i.isPublicHoliday).map((i) => i.id);
            expect(holidays.sort()).to.deep.equal(['ee-day@2026-06-03', 'se-day@2026-06-04']);
        });

        it('falls back to the roster calendar for a site with no list of its own', () => {
            const ctx = buildModel(
                input({
                    calendar: { publicHolidays: ['2026-06-05'] },
                    sites: [{ id: 'ee', publicHolidays: ['2026-06-03'] }, { id: 'se' }],
                    shifts: [
                        shift('ee-day', ['2026-06-03', '2026-06-05'], { siteId: 'ee' }),
                        shift('se-day', ['2026-06-03', '2026-06-05'], { siteId: 'se' }),
                    ],
                }),
            );
            const holidays = ctx.instances.filter((i) => i.isPublicHoliday).map((i) => i.id);
            // The EE site overrides the roster list; SE has none, so it inherits it.
            expect(holidays.sort()).to.deep.equal(['ee-day@2026-06-03', 'se-day@2026-06-05']);
        });

        it('keeps the roster calendar for shifts with no site', () => {
            const ctx = buildModel(
                input({
                    calendar: { publicHolidays: ['2026-06-05'] },
                    sites: [{ id: 'ee', publicHolidays: ['2026-06-03'] }],
                    shifts: [shift('floating', ['2026-06-03', '2026-06-05'])],
                }),
            );
            const holidays = ctx.instances.filter((i) => i.isPublicHoliday).map((i) => i.id);
            expect(holidays).to.deep.equal(['floating@2026-06-05']);
        });

        it('an empty site holiday list means "no holidays here", not "inherit"', () => {
            const ctx = buildModel(
                input({
                    calendar: { publicHolidays: ['2026-06-05'] },
                    sites: [{ id: 'always-open', publicHolidays: [] }],
                    shifts: [shift('shop', ['2026-06-05'], { siteId: 'always-open' })],
                }),
            );
            expect(ctx.instances.filter((i) => i.isPublicHoliday)).to.deep.equal([]);
        });

        it('reads the same calendar from expandShiftInstances as from a solve', () => {
            /*
             * `expandShiftInstances` is public and its own header calls its
             * occurrences "the ones every later call refers to". It built its
             * context without the per-site calendars, so a preview grid priced
             * a holiday the solve did not — the second reading path this
             * module's rules exist to forbid.
             */
            const problem = input({
                calendar: { publicHolidays: ['2026-06-03'] },
                sites: [{ id: 'always-open', publicHolidays: [] }],
                shifts: [shift('shop', ['2026-06-03'], { siteId: 'always-open' })],
            });

            const previewed = expandShiftInstances(problem);
            const solved = buildModel(problem).instances;

            expect(previewed[0]!.isPublicHoliday).to.equal(false);
            expect(previewed[0]!.isPublicHoliday).to.equal(solved[0]!.isPublicHoliday);
        });

        it('refuses a mixed-zone roster from expandShiftInstances too', () => {
            // The preview path skipped site validation entirely, so a roster
            // the solve would refuse rendered a grid first.
            expect(() =>
                expandShiftInstances(input({ sites: [{ id: 'se', timeZone: 'Europe/Stockholm' }] })),
            ).to.throw(ScheduleValidationError);
        });

        it('refuses a malformed date in a site calendar', () => {
            expect(() => buildModel(input({ sites: [{ id: 's', publicHolidays: ['3 June'] }] }))).to.throw(
                ScheduleValidationError,
            );
        });

        it('drives the holiday premium off the site that hosts the shift', () => {
            const result = solveSchedule(
                input({
                    employees: [
                        {
                            id: 'e1',
                            tags: [],
                            timeOff: [],
                            cost: { hourlyRateCents: 1000, premiums: [{ predicate: 'holiday', multiplier: 2 }] },
                        },
                    ],
                    sites: [{ id: 'ee', publicHolidays: ['2026-06-03'] }],
                    shifts: [shift('ee-day', ['2026-06-03'], { siteId: 'ee' })],
                    objectives: { costWeightPerEuro: 0 },
                }),
            );
            // 8h at 10.00/h doubled for the site's own public holiday.
            expect(result.cost?.totalCents).to.equal(16_000);
        });
    });
});
