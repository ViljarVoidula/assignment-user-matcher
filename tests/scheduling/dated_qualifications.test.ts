import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { staffingViolations } from '../../src/scheduling/constraints/min-staffing';
import { solveSchedule, checkCompliance, rankCandidates, diagnoseInfeasibility } from '../../src/scheduling';
import type { Employee, ScheduleInput, ShiftTemplate } from '../../src/scheduling';

/**
 * Per-tag minimums and maximums must read a qualification the same way
 * `requiredTags` does — as a question about the shift's *date*, not a static
 * fact about the person.
 *
 * Before this suite, `ctx.employeeTags` was a plain `Set` built from
 * `employee.tags` alone, so a lapsed certificate still counted toward
 * `tagRequirements: { nurse: 2 }` while `requiredTags: ['nurse']` correctly
 * refused the same person on the same day. Solve and compliance agreed with
 * each other and both were wrong — the failure mode the qualification rule
 * exists to prevent, reintroduced one layer up.
 */

const PERIOD = { startDate: '2026-03-02', endDate: '2026-03-08' }; // Mon 2 Mar, one week

function shift(id: string, dates: string[], extra: Partial<ShiftTemplate> = {}): ShiftTemplate {
    return { id, name: id.toUpperCase(), startTime: '09:00', endTime: '17:00', dates, ...extra };
}

function input(over: Partial<ScheduleInput> = {}): ScheduleInput {
    return {
        period: PERIOD,
        employees: [],
        shifts: [],
        timeBudgetMs: 50,
        ...over,
    } as ScheduleInput;
}

/** Nurse whose registration lapses on the 4th — valid Mon–Wed, lapsed Thu on. */
const lapsing: Employee = {
    id: 'lapsing',
    tags: [],
    timeOff: [],
    qualifications: [{ tag: 'nurse', validUntil: '2026-03-04' }],
};

const current: Employee = {
    id: 'current',
    tags: [],
    timeOff: [],
    qualifications: [{ tag: 'nurse', validUntil: '2026-12-31' }],
};

describe('dated qualifications in tag counts', () => {
    it('does not count a lapsed qualification toward a per-tag minimum', () => {
        const ctx = buildModel(
            input({
                employees: [lapsing],
                shifts: [shift('ward', ['2026-03-05'], { minEmployees: 1, tagRequirements: { nurse: 1 } })],
            }),
        );
        const state = createState(ctx);
        assign(state, 'lapsing', 'ward@2026-03-05', []);

        const violations = staffingViolations(ctx, state, 'hard');
        expect(violations.map((v) => v.message)).to.deep.equal([
            'shift "ward@2026-03-05" needs 1 employees with tag "nurse", has 0',
        ]);
    });

    it('counts the same qualification while it is still valid', () => {
        const ctx = buildModel(
            input({
                employees: [lapsing],
                shifts: [shift('ward', ['2026-03-03'], { minEmployees: 1, tagRequirements: { nurse: 1 } })],
            }),
        );
        const state = createState(ctx);
        assign(state, 'lapsing', 'ward@2026-03-03', []);

        expect(staffingViolations(ctx, state, 'hard')).to.deep.equal([]);
    });

    it('does not count a lapsed qualification toward a per-tag maximum', () => {
        const ctx = buildModel(
            input({
                employees: [lapsing, current],
                shifts: [shift('ward', ['2026-03-05'], { minEmployees: 2, tagMaximums: { nurse: 1 } })],
            }),
        );
        const state = createState(ctx);
        assign(state, 'current', 'ward@2026-03-05', []);

        // The lapsed nurse is not a nurse that day, so adding them cannot breach
        // a maximum of one nurse.
        const rule = ctx.constraints.find((c) => c.id === 'group-composition')!;
        const verdict = rule.verdict!(state, { employeeId: 'lapsing', shiftInstanceId: 'ward@2026-03-05' });
        expect(verdict.pass, verdict.message).to.equal(true);
    });

    it('still enforces a per-tag maximum against a valid qualification', () => {
        const ctx = buildModel(
            input({
                employees: [lapsing, current],
                shifts: [shift('ward', ['2026-03-03'], { minEmployees: 2, tagMaximums: { nurse: 1 } })],
            }),
        );
        const state = createState(ctx);
        assign(state, 'current', 'ward@2026-03-03', []);

        const rule = ctx.constraints.find((c) => c.id === 'group-composition')!;
        const verdict = rule.verdict!(state, { employeeId: 'lapsing', shiftInstanceId: 'ward@2026-03-03' });
        expect(verdict.pass).to.equal(false);
    });

    it('keeps a plain tag valid for the whole period', () => {
        const plain: Employee = { id: 'plain', tags: ['nurse'], timeOff: [] };
        const ctx = buildModel(
            input({
                employees: [plain],
                shifts: [shift('ward', ['2026-03-05'], { minEmployees: 1, tagRequirements: { nurse: 1 } })],
            }),
        );
        const state = createState(ctx);
        assign(state, 'plain', 'ward@2026-03-05', []);

        expect(staffingViolations(ctx, state, 'hard')).to.deep.equal([]);
    });

    it('will not solve a lapsed nurse into a nurse-requiring shift', () => {
        const result = solveSchedule(
            input({
                employees: [lapsing],
                shifts: [shift('ward', ['2026-03-05'], { minEmployees: 1, tagRequirements: { nurse: 1 } })],
            }),
        );
        // The person may still be assigned as a body, but the tag shortfall must
        // be reported rather than silently satisfied.
        const tagShortfall = result.violations.filter((v) => v.message.includes('tag "nurse"'));
        expect(tagShortfall).to.have.lengthOf(1);
    });

    it('agrees between solve and checkCompliance', () => {
        const problem = input({
            employees: [lapsing],
            shifts: [shift('ward', ['2026-03-05'], { minEmployees: 1, tagRequirements: { nurse: 1 } })],
        });
        const solved = solveSchedule(problem);
        const checked = checkCompliance(problem, solved.assignments);

        const solveTag = solved.violations.filter((v) => v.message.includes('tag "nurse"')).length;
        const checkTag = checked.violations.filter((v) => v.message.includes('tag "nurse"')).length;
        expect(checkTag).to.equal(solveTag);
    });

    /**
     * The memo must answer for the triple it was asked about.
     *
     * The cache key joins employee, tag and date, and neither an id nor a tag
     * forbids a separator character — so a key built by plain concatenation is
     * ambiguous, and one lookup poisons the other. These two cases collide
     * under any separator that can appear in the data, and they are asked in
     * the order that would poison the answer.
     */
    it('does not confuse two employee-and-tag pairs that share a joined key', () => {
        const spaced: Employee = {
            id: 'a b',
            tags: [],
            timeOff: [],
            qualifications: [{ tag: 'c', validUntil: '2020-01-01' }],
        };
        const plain: Employee = { id: 'a', tags: [], timeOff: [], qualifications: [{ tag: 'b c' }] };
        const ctx = buildModel(input({ employees: [spaced, plain], shifts: [shift('ward', ['2026-03-05'])] }));

        // Lapsed in 2020, so not held now — asked first, so it is the answer
        // that would be reused for the second.
        expect(ctx.holdsTagOn('a b', 'c', '2026-03-05')).to.equal(false);
        // A different person and a different tag, held with no expiry.
        expect(ctx.holdsTagOn('a', 'b c', '2026-03-05')).to.equal(true);
    });

    it('does not let greedy fill count a lapsed nurse as covering the requirement', () => {
        const result = solveSchedule(
            input({
                employees: [lapsing, current],
                shifts: [shift('ward', ['2026-03-05'], { minEmployees: 1, tagRequirements: { nurse: 1 } })],
            }),
        );
        expect(result.assignments.map((a) => a.employeeId)).to.deep.equal(['current']);
    });
});

/**
 * A caller that sends a skill both as a plain tag and as a dated qualification
 * (the hosted platform does, for every skill) must get the date honoured. The
 * plain tag used to answer first, so an expired certificate never blocked
 * anyone.
 */
describe('a dated qualification overrides the same plain tag', () => {
    const both: Employee = {
        id: 'both',
        tags: ['flt'],
        timeOff: [],
        qualifications: [{ tag: 'flt', validUntil: '2026-03-04' }],
    };

    it('refuses the shift after the date, and allows it before', () => {
        const result = solveSchedule(
            input({
                employees: [both],
                shifts: [shift('truck', ['2026-03-03', '2026-03-05'], { minEmployees: 1, requiredTags: ['flt'] })],
            }),
        );
        const dates = result.assignments.map((a) => a.date);
        expect(dates).to.include('2026-03-03');
        expect(dates).not.to.include('2026-03-05');
    });

    it('reports a hand-placed shift after the date as an expired hard breach', () => {
        const scheduleInput = input({
            employees: [both],
            shifts: [shift('truck', ['2026-03-05'], { minEmployees: 1, requiredTags: ['flt'] })],
        });
        const ctx = buildModel(scheduleInput);
        const shiftInstanceId = ctx.instances[0].id;
        const report = checkCompliance(scheduleInput, [
            { employeeId: 'both', shiftInstanceId, date: '2026-03-05', reasons: [] },
        ]);
        const breach = report.violations.find((v) => v.constraintId === 'qualification');
        expect(breach?.severity).to.equal('hard');
        expect(breach?.message).to.contain('expired 2026-03-04');
    });

    it('does not count the expired skill toward a per-tag minimum', () => {
        const scheduleInput = input({
            employees: [both],
            shifts: [shift('truck', ['2026-03-05'], { minEmployees: 1, tagRequirements: { flt: 1 } })],
        });
        const ctx = buildModel(scheduleInput);
        expect(ctx.holdsTagOn('both', 'flt', '2026-03-05')).to.equal(false);
        expect(ctx.holdsTagOn('both', 'flt', '2026-03-03')).to.equal(true);
        const state = createState(ctx);
        assign(state, 'both', ctx.instances[0].id, []);
        expect(staffingViolations(ctx, state, 'hard').some((v) => v.message.includes('flt'))).to.equal(true);
    });

    it('does not count the expired skill against a per-tag maximum', () => {
        const fresh: Employee = { id: 'fresh', tags: ['flt'], timeOff: [] };
        const scheduleInput = input({
            employees: [both, fresh],
            shifts: [shift('truck', ['2026-03-05'], { minEmployees: 2, maxEmployees: 2, tagMaximums: { flt: 1 } })],
        });
        const ctx = buildModel(scheduleInput);
        const shiftInstanceId = ctx.instances[0].id;
        const report = checkCompliance(scheduleInput, [
            { employeeId: 'both', shiftInstanceId, date: '2026-03-05', reasons: [] },
            { employeeId: 'fresh', shiftInstanceId, date: '2026-03-05', reasons: [] },
        ]);
        expect(report.violations.filter((v) => v.severity === 'hard')).to.deep.equal([]);
    });

    it('leaves the expired skill out of candidate tagsHeld and skill cover', () => {
        const scheduleInput = input({
            employees: [both],
            shifts: [shift('truck', ['2026-03-05'], { minEmployees: 1, tagRequirements: { flt: 1 } })],
        });
        const ctx = buildModel(scheduleInput);
        const [candidate] = rankCandidates(scheduleInput, ctx.instances[0].id, []);
        expect(candidate).to.exist;
        expect(candidate.tagsHeld).not.to.include('flt');
        const cover = diagnoseInfeasibility(scheduleInput).tagCover.find((c) => c.tag === 'flt');
        expect(cover?.holders).to.equal(0);
    });

    it('still accepts a plain tag with no dated entry for it', () => {
        const plain: Employee = { id: 'plain', tags: ['flt'], timeOff: [] };
        const result = solveSchedule(
            input({
                employees: [plain],
                shifts: [shift('truck', ['2026-03-05'], { minEmployees: 1, requiredTags: ['flt'] })],
            }),
        );
        expect(result.assignments).to.have.length(1);
    });
});
