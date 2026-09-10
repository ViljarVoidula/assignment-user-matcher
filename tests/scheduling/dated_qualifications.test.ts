import { expect } from 'chai';
import { buildModel } from '../../src/scheduling/model';
import { assign, createState } from '../../src/scheduling/engine/state';
import { staffingViolations } from '../../src/scheduling/constraints/min-staffing';
import { solveSchedule, checkCompliance } from '../../src/scheduling';
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
