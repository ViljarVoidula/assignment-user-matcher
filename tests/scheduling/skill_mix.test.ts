import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { staffingViolations } from '../../src/scheduling/constraints/min-staffing';
import { solveSchedule, checkCompliance, rankCandidates, ScheduleValidationError } from '../../src/scheduling';
import type { Employee, ScheduleInput, ShiftTemplate } from '../../src/scheduling';

/**
 * Skill mix: how *good* the people on a shift are, and in what proportion.
 *
 * `tagRequirements` counts heads holding a tag, which answers "two nurses" and
 * cannot answer either of the two questions operational buyers actually ask
 * first. **Level** — "at least one senior on every shift" — was expressible in
 * the data and unreachable: `Qualification.level` has always been stored and
 * `holds(..., minLevel)` has always accepted a floor, and nothing ever passed
 * one. **Ratio** — German ward staffing is a proportion by ward and shift, and
 * the composition rule's own header names "no fewer than 60% registered
 * nurses" as its motivation — had no shape at all.
 *
 * Both are counted the same way every other tag requirement is: through
 * `holdsTagOn`, so a lapsed certificate does not satisfy a ratio any more than
 * it satisfies a headcount.
 */

const PERIOD = { startDate: '2026-03-02', endDate: '2026-03-08' };

function shift(id: string, extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: '09:00', endTime: '17:00', dates: ['2026-03-02'], ...extra };
}

function input(over: Partial<ScheduleInput> = {}): ScheduleInput {
    return { period: PERIOD, employees: [], shifts: [], timeBudgetMs: 50, ...over } as ScheduleInput;
}

/** A registered nurse at grade 3. */
const senior: Employee = {
    id: 'senior',
    tags: [],
    timeOff: [],
    qualifications: [{ tag: 'nurse', level: 3 }],
};
/** A registered nurse at grade 1. */
const junior: Employee = {
    id: 'junior',
    tags: [],
    timeOff: [],
    qualifications: [{ tag: 'nurse', level: 1 }],
};
/** A healthcare assistant: no nursing registration at all. */
const assistant: Employee = { id: 'assistant', tags: ['hca'], timeOff: [] };

describe('skill mix', () => {
    describe('level-graded requirements', () => {
        const ward = shift('ward', { minEmployees: 2, tagRequirements: { nurse: { min: 1, level: 3 } } });

        it('counts somebody at or above the level', () => {
            const ctx = buildModel(input({ employees: [senior], shifts: [ward] }));
            const state = createState(ctx);
            assign(state, 'senior', 'ward@2026-03-02', []);

            const tagIssues = staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('nurse'));
            expect(tagIssues).to.deep.equal([]);
        });

        it('does not count somebody below it', () => {
            // A registered nurse, but not a senior one. The distinction is the
            // whole point of a graded requirement.
            const ctx = buildModel(input({ employees: [junior], shifts: [ward] }));
            const state = createState(ctx);
            assign(state, 'junior', 'ward@2026-03-02', []);

            const tagIssues = staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('nurse'));
            expect(tagIssues).to.have.lengthOf(1);
            expect(tagIssues[0]!.message).to.contain('level 3');
        });

        it('does not count a plain tag against a level', () => {
            // A plain tag carries no grade, so it cannot satisfy a graded
            // requirement — reading it as "any level" would let an unstated
            // fact answer a question about seniority.
            const plain: Employee = { id: 'plain', tags: ['nurse'], timeOff: [] };
            const ctx = buildModel(input({ employees: [plain], shifts: [ward] }));
            const state = createState(ctx);
            assign(state, 'plain', 'ward@2026-03-02', []);

            expect(staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('nurse'))).to.have.lengthOf(
                1,
            );
        });

        it('still accepts the plain number form', () => {
            // `{ nurse: 2 }` has to keep meaning exactly what it meant.
            const ctx = buildModel(
                input({
                    employees: [{ id: 'a', tags: ['nurse'], timeOff: [] }],
                    shifts: [shift('ward', { minEmployees: 1, tagRequirements: { nurse: 1 } })],
                }),
            );
            const state = createState(ctx);
            assign(state, 'a', 'ward@2026-03-02', []);
            expect(staffingViolations(ctx, state, 'hard')).to.deep.equal([]);
        });

        it('refuses a level that is not a number', () => {
            expect(() =>
                buildModel(
                    input({
                        shifts: [shift('ward', { tagRequirements: { nurse: { min: 1, level: 'senior' } } as never })],
                    }),
                ),
            ).to.throw(ScheduleValidationError);
        });

        it('refuses a negative minimum', () => {
            expect(() =>
                buildModel(input({ shifts: [shift('ward', { tagRequirements: { nurse: { min: -1 } } })] })),
            ).to.throw(ScheduleValidationError);
        });

        it('refuses a level of zero, which reads as "no floor" and means the opposite', () => {
            // `holds` skips the plain-tag branch the moment a level is present,
            // so `{ min: 1, level: 0 }` silently excluded everybody whose tag
            // carries no grade — the opposite of what a zero floor suggests.
            expect(() =>
                buildModel(input({ shifts: [shift('ward', { tagRequirements: { nurse: { min: 1, level: 0 } } })] })),
            ).to.throw(ScheduleValidationError, /omit it/);
        });

        it('validates a template whose dates fall outside the period', () => {
            // No occurrences means the per-date path never ran, so bad
            // configuration survived one solve and threw on the next when the
            // period moved over it.
            expect(() =>
                buildModel(
                    input({
                        shifts: [
                            {
                                id: 'later',
                                name: 'LATER',
                                startTime: '09:00',
                                endTime: '17:00',
                                dates: ['2027-01-01'],
                                tagRequirements: { nurse: { min: -3 } },
                            },
                        ],
                    }),
                ),
            ).to.throw(ScheduleValidationError);
        });

        it('validates a maximum, like the minimum beside it', () => {
            // The one member of the trio passed through unchecked: a negative
            // ceiling made every assignment breach with nothing naming why.
            expect(() =>
                buildModel(input({ shifts: [shift('ward', { tagMaximums: { nurse: -1 } })] })),
            ).to.throw(ScheduleValidationError, /tagMaximums/);
        });

        it('ignores an expired qualification, like every other tag count', () => {
            const lapsed: Employee = {
                id: 'lapsed',
                tags: [],
                timeOff: [],
                qualifications: [{ tag: 'nurse', level: 3, validUntil: '2026-01-01' }],
            };
            const ctx = buildModel(input({ employees: [lapsed], shifts: [ward] }));
            const state = createState(ctx);
            assign(state, 'lapsed', 'ward@2026-03-02', []);

            expect(staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('nurse'))).to.have.lengthOf(
                1,
            );
        });
    });

    describe('ratio requirements', () => {
        const ward = shift('ward', { minEmployees: 3, tagRatios: { nurse: 0.6 } });

        it('is satisfied when the proportion holds', () => {
            const ctx = buildModel(input({ employees: [senior, junior, assistant], shifts: [ward] }));
            const state = createState(ctx);
            for (const id of ['senior', 'junior', 'assistant']) assign(state, id, 'ward@2026-03-02', []);

            // Two of three is 67%, over the 60% floor.
            expect(staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('60'))).to.deep.equal([]);
        });

        it('is breached when it does not', () => {
            const other: Employee = { id: 'other', tags: ['hca'], timeOff: [] };
            const ctx = buildModel(input({ employees: [senior, assistant, other], shifts: [ward] }));
            const state = createState(ctx);
            for (const id of ['senior', 'assistant', 'other']) assign(state, id, 'ward@2026-03-02', []);

            const issues = staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('%'));
            expect(issues).to.have.lengthOf(1);
            expect(issues[0]!.message).to.contain('1 of 3');
        });

        it('says nothing about an empty shift', () => {
            // A proportion of nobody is not 0%, it is undefined — and reporting
            // it as a breach would bury the real finding, which is that the
            // shift is unstaffed.
            const ctx = buildModel(input({ employees: [senior], shifts: [ward] }));
            const state = createState(ctx);
            expect(staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('%'))).to.deep.equal([]);
        });

        it('rounds up, so a ratio is a floor rather than an average', () => {
            // 60% of 4 is 2.4 people, which means 3 — you cannot staff 2.4.
            const ctx = buildModel(
                input({
                    employees: [senior, junior, assistant, { id: 'd', tags: ['hca'], timeOff: [] }],
                    shifts: [shift('ward', { minEmployees: 4, tagRatios: { nurse: 0.6 } })],
                }),
            );
            const state = createState(ctx);
            for (const id of ['senior', 'junior', 'assistant', 'd']) assign(state, id, 'ward@2026-03-02', []);

            expect(staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('%'))).to.have.lengthOf(1);
        });

        it('accepts a ratio of 1, meaning everybody', () => {
            const ctx = buildModel(
                input({
                    employees: [senior, junior],
                    shifts: [shift('ward', { minEmployees: 2, tagRatios: { nurse: 1 } })],
                }),
            );
            const state = createState(ctx);
            for (const id of ['senior', 'junior']) assign(state, id, 'ward@2026-03-02', []);
            expect(staffingViolations(ctx, state, 'hard').filter((v) => v.message.includes('%'))).to.deep.equal([]);
        });

        it('refuses a ratio outside 0 to 1', () => {
            expect(() => buildModel(input({ shifts: [shift('ward', { tagRatios: { nurse: 1.5 } })] }))).to.throw(
                ScheduleValidationError,
            );
            expect(() => buildModel(input({ shifts: [shift('ward', { tagRatios: { nurse: -0.1 } })] }))).to.throw(
                ScheduleValidationError,
            );
        });

        it('agrees between solve and checkCompliance', () => {
            const problem = input({ employees: [senior, assistant], shifts: [ward] });
            const solved = solveSchedule(problem);
            const checked = checkCompliance(problem, solved.assignments);

            const count = (violations: { message: string }[]) => violations.filter((v) => v.message.includes('%')).length;
            expect(count(checked.violations)).to.equal(count(solved.violations));
        });
    });
});

/**
 * Seniority as a tiebreak.
 *
 * The field was declared from the start and read nowhere, so it asserted a
 * capability the engine did not have. Collective agreements very commonly order
 * offers by it, and a tiebreak is the honest place for that: it decides between
 * candidates who are otherwise indistinguishable and never outranks cost,
 * travel or contract debt.
 *
 * It stays inside the profiling-free boundary. Seniority is a declared
 * contractual fact of the same class as a qualification — not reliability, not
 * acceptance history, not anything learned.
 */
describe('seniority', () => {
    const shifts = [shift('cover', { minEmployees: 1 })];

    const ranked = (employees: Employee[]) =>
        rankCandidates(input({ employees, shifts }), 'cover@2026-03-02', []).map((c) => c.employeeId);

    it('orders equal candidates by seniority, highest first', () => {
        const junior: Employee = { id: 'a-junior', tags: [], timeOff: [], seniority: 1 };
        const veteran: Employee = { id: 'z-veteran', tags: [], timeOff: [], seniority: 9 };

        // Alphabetically the junior sorts first; seniority is what decides.
        expect(ranked([junior, veteran])[0]).to.equal('z-veteran');
    });

    it('falls back to the id when nobody has a seniority', () => {
        const a: Employee = { id: 'anna', tags: [], timeOff: [] };
        const b: Employee = { id: 'bo', tags: [], timeOff: [] };
        expect(ranked([a, b])).to.deep.equal(['anna', 'bo']);
    });

    it('treats an unstated seniority as the lowest', () => {
        const stated: Employee = { id: 'z-stated', tags: [], timeOff: [], seniority: 1 };
        const unstated: Employee = { id: 'a-unstated', tags: [], timeOff: [] };
        expect(ranked([unstated, stated])[0]).to.equal('z-stated');
    });

    it('never outranks a real difference', () => {
        // A senior candidate who costs twice as much still sorts second: an
        // agreement that says "offer by seniority" does not say "offer the
        // senior person whatever it costs".
        const cheap: Employee = { id: 'cheap', tags: [], timeOff: [], cost: { hourlyRateCents: 1000 } };
        const dear: Employee = {
            id: 'dear',
            tags: [],
            timeOff: [],
            seniority: 99,
            cost: { hourlyRateCents: 9000 },
        };
        expect(ranked([dear, cheap])[0]).to.equal('cheap');
    });
});
