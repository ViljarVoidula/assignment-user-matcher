import { expect } from 'chai';
import {
    assessShiftResilience,
    checkCompliance,
    rankCandidates,
    rankSwapPartners,
    type ScheduleInput,
    type ScheduledAssignment,
} from '../../src/scheduling';
import * as root from '../../src';

const DAY = '2026-01-06';
const at = (employeeId: string, shiftInstanceId: string): ScheduledAssignment => ({
    employeeId,
    shiftInstanceId,
    date: shiftInstanceId.split('@')[1],
    reasons: [],
});

function warehouse(overrides: Partial<ScheduleInput> = {}): ScheduleInput {
    const person = (id: string, tags: string[] = ['picker']) => ({
        id,
        tags,
        timeOff: [] as ScheduleInput['employees'][number]['timeOff'],
    });
    return {
        period: { startDate: '2026-01-05', endDate: '2026-01-11', timeZone: 'Europe/Tallinn' },
        employees: [
            person('ann', ['picker', 'forklift']),
            person('ben'),
            person('cat'),
            person('dan', ['picker', 'forklift']),
            person('eve'),
        ],
        shifts: [
            {
                id: 'early',
                name: 'Early',
                startTime: '06:00',
                endTime: '14:00',
                dates: [DAY],
                minEmployees: 2,
                tagRequirements: { forklift: 1 },
            },
            { id: 'late', name: 'Late', startTime: '14:00', endTime: '22:00', dates: [DAY], minEmployees: 2 },
        ],
        rules: { dailyRest: { minMinutes: 11 * 60 } },
        timeBudgetMs: 0,
        ...overrides,
    } as ScheduleInput;
}

const roster = [at('ann', `early@${DAY}`), at('ben', `early@${DAY}`), at('cat', `late@${DAY}`), at('eve', `late@${DAY}`)];

describe('assessShiftResilience', () => {
    it('counts backups: free, eligible, not already on an overlapping shift', () => {
        const [early] = assessShiftResilience(warehouse(), roster, { shiftInstanceIds: [`early@${DAY}`] });
        expect(early.assigned).to.equal(2);
        expect(early.shortBy).to.equal(0);
        // cat and eve work 14–22: back-to-back with 06–14 is an overlap-free but 0h-rest pair → blocked by daily rest.
        expect(early.topBackups.map((c) => c.employeeId)).to.deep.equal(['dan']);
        expect(early.backups).to.equal(1);
        expect(early.skills).to.deep.equal([{ tag: 'forklift', required: 1, held: 1, shortBy: 0, backups: 1 }]);
    });

    it('treats a rostered person on time off as absent, not assigned', () => {
        const input = warehouse();
        input.employees[0].timeOff = [{ date: DAY }];
        const [early] = assessShiftResilience(input, roster, { shiftInstanceIds: [`early@${DAY}`] });
        expect(early.absent).to.deep.equal(['ann']);
        expect(early.assigned).to.equal(1);
        expect(early.shortBy).to.equal(1);
        expect(early.skills[0]).to.include({ held: 0, shortBy: 1, backups: 1 });
        expect(early.tier).to.equal('at-risk');
        expect(early.topBackups.map((c) => c.employeeId)).to.not.include('ann');
    });

    it('treats time off scoped to the shift instance as absent, and other-shift time off as not', () => {
        const input = warehouse();
        input.employees[1].timeOff = [{ date: DAY, shiftInstanceId: `early@${DAY}` }];
        input.employees[2].timeOff = [{ date: '2026-01-07' }];
        const [early, late] = assessShiftResilience(input, roster);
        expect(early.absent).to.deep.equal(['ben']);
        expect(early.assigned).to.equal(1);
        expect(late.absent).to.deep.equal([]);
        expect(late.assigned).to.equal(2);
    });

    it('reports an absentee on their own shift only, and leaks nothing between calls', () => {
        const input = warehouse();
        input.employees[4].timeOff = [{ date: DAY }];
        const [early, late] = assessShiftResilience(input, roster);
        expect(late.absent).to.deep.equal(['eve']);
        expect(late.shortBy).to.equal(1);
        expect(early.topBackups.map((c) => c.employeeId)).to.not.include('eve');
        // A second call on the same inputs sees the same answer: nothing leaks between calls.
        const again = assessShiftResilience(input, roster);
        expect(again).to.deep.equal([early, late]);
    });

    it('takes an absentee off the working state, so they hold no seat on a full shift', () => {
        // Late is capped at 2. Cat is rostered but off: judged with her still
        // on it, dan would read "already has its maximum" and not be a backup.
        const input = warehouse();
        (input.shifts[1] as any).maxEmployees = 2;
        input.employees[2].timeOff = [{ date: DAY }];
        const [, late] = assessShiftResilience(input, roster);
        expect(late.assigned).to.equal(1);
        expect(late.topBackups.map((c) => c.employeeId)).to.deep.equal(['dan']);
        expect(late.tier).to.equal('at-risk');
    });

    it('uses expected dropouts to tier a fully staffed shift', () => {
        const [late] = assessShiftResilience(warehouse(), roster, {
            shiftInstanceIds: [`late@${DAY}`],
            expectedDropouts: { [`late@${DAY}`]: 0.3 },
        });
        expect(late.shortBy).to.equal(0);
        // One backup (dan) against 0.3 expected dropouts covers today's
        // expectation but not one more than that.
        expect(late.tier).to.equal('watch');
        expect(late.expectedDropouts).to.equal(0.3);
    });

    describe('absence is decided by the time-off rule itself', () => {
        const NEXT = '2026-01-07';
        const nightInput = (): ScheduleInput => {
            const input = warehouse();
            input.shifts.push({
                id: 'night',
                name: 'Night',
                startTime: '22:00',
                endTime: '06:00',
                dates: [DAY],
                minEmployees: 2,
            } as ScheduleInput['shifts'][number]);
            return input;
        };
        const nightRoster = [at('ann', `night@${DAY}`), at('dan', `night@${DAY}`)];

        it('counts an overnight shift spilling into next-day whole-day time off as absent', () => {
            const input = nightInput();
            input.employees[0].timeOff = [{ date: NEXT }];
            const [night] = assessShiftResilience(input, nightRoster, { shiftInstanceIds: [`night@${DAY}`] });
            expect(night.absent).to.deep.equal(['ann']);
            expect(night.assigned).to.equal(1);
            expect(night.shortBy).to.equal(1);
        });

        it('counts an input.absences span covering the shift as absent', () => {
            const input = nightInput();
            input.absences = [{ employeeId: 'dan', from: `${DAY}T20:00`, to: `${NEXT}T08:00`, kind: 'sick' }];
            const [night] = assessShiftResilience(input, nightRoster, { shiftInstanceIds: [`night@${DAY}`] });
            expect(night.absent).to.deep.equal(['dan']);
            expect(night.assigned).to.equal(1);
        });

        it('counts an overlapping external commitment as absent', () => {
            const input = warehouse();
            (input.employees[1] as any).externalCommitments = [{ from: `${DAY}T10:00`, to: `${DAY}T12:00` }];
            const [early] = assessShiftResilience(input, roster, { shiftInstanceIds: [`early@${DAY}`] });
            expect(early.absent).to.deep.equal(['ben']);
            expect(early.assigned).to.equal(1);
        });

        it('agrees with checkCompliance: every pair it reports absent is a time-off violation there', () => {
            const input = nightInput();
            input.employees[0].timeOff = [{ date: NEXT }];
            input.absences = [{ employeeId: 'dan', from: `${DAY}T20:00`, to: `${NEXT}T08:00` }];
            const [night] = assessShiftResilience(input, nightRoster, { shiftInstanceIds: [`night@${DAY}`] });
            const flagged = checkCompliance(input, nightRoster)
                .violations.filter((v) => v.constraintId === 'time-off')
                .map((v) => v.employeeId);
            expect(night.absent).to.have.members([...new Set(flagged)]);
        });
    });

    describe('backups are judged with one seat vacated', () => {
        // A backup is someone who could step in if a rostered person dropped
        // out. Asked with every rostered person still on it, a shift at its
        // maxEmployees reads "already has its maximum" for everybody.
        const capped = (early: number, late: number) => {
            const input = warehouse();
            (input.shifts[0] as any).maxEmployees = early;
            (input.shifts[1] as any).maxEmployees = late;
            return input;
        };
        const partners = (input: ScheduleInput, id: string, from: string, r: ScheduledAssignment[]) =>
            rankSwapPartners(input, id, from, r)
                .filter((c) => c.eligible)
                .map((c) => c.employeeId)
                .sort();

        it('a full one-seat shift with a free eligible colleague has that colleague as its backup', () => {
            const input = warehouse();
            input.shifts[0] = { ...input.shifts[0], minEmployees: 1, maxEmployees: 1 } as any;
            const oneSeat = [at('ann', `early@${DAY}`), at('cat', `late@${DAY}`), at('eve', `late@${DAY}`)];
            const [early] = assessShiftResilience(input, oneSeat, {
                shiftInstanceIds: [`early@${DAY}`],
                expectedDropouts: { [`early@${DAY}`]: 0.2 },
            });
            expect(early.assigned).to.equal(1);
            expect(early.shortBy).to.equal(0);
            expect(early.topBackups.map((c) => c.employeeId)).to.deep.equal(['ben', 'dan']);
            expect(early.backups).to.equal(2);
            expect(['ok', 'watch']).to.include(early.tier);
            expect(early.reasons).to.not.include('no-backups');
            expect(early.backups).to.equal(partners(input, `early@${DAY}`, 'ann', oneSeat).length);
        });

        it('a full two-seat shift counts backups as if one person dropped out', () => {
            const input = capped(2, 2);
            const [early, late] = assessShiftResilience(input, roster);
            expect(early.assigned).to.equal(2);
            expect(early.shortBy).to.equal(0);
            expect(early.topBackups.map((c) => c.employeeId)).to.deep.equal(['dan']);
            expect(early.skills[0]).to.include({ held: 1, backups: 1 });
            expect(late.topBackups.map((c) => c.employeeId).sort()).to.deep.equal(['dan']);
            expect(late.tier).to.not.equal('critical');
            // Parity: the counted backups are rankSwapPartners' eligible
            // partners for the shift and any one person on it.
            for (const [shift, id, people] of [
                [early, `early@${DAY}`, ['ann', 'ben']],
                [late, `late@${DAY}`, ['cat', 'eve']],
            ] as const) {
                for (const from of people) {
                    expect(shift.topBackups.map((c) => c.employeeId).sort()).to.deep.equal(
                        partners(input, id, from, roster),
                    );
                }
            }
        });

        it('a shift below its maximum gives the same backups as uncapped', () => {
            const uncapped = assessShiftResilience(warehouse(), roster);
            const roomy = assessShiftResilience(capped(3, 3), roster);
            expect(roomy).to.deep.equal(uncapped);
        });

        it('a skill capped at its maximum counts only holders who could replace a holder', () => {
            // Early holds one forklift driver (ann) and caps forklift at one.
            // dan drives a forklift: he can replace ann, not ben. With the
            // shift also full, vacating ben alone would call dan ineligible.
            const input = capped(2, 2);
            (input.shifts[0] as any).tagMaximums = { forklift: 1 };
            const [early] = assessShiftResilience(input, roster, { shiftInstanceIds: [`early@${DAY}`] });
            expect(early.topBackups.map((c) => c.employeeId)).to.deep.equal(['dan']);
            expect(early.skills[0]).to.include({ tag: 'forklift', held: 1, backups: 1 });
            expect(partners(input, `early@${DAY}`, 'ann', roster)).to.deep.equal(['dan']);
            expect(partners(input, `early@${DAY}`, 'ben', roster)).to.deep.equal([]);
        });

        it('leaves the roster exactly as it found it', () => {
            const input = capped(2, 2);
            const once = assessShiftResilience(input, roster);
            expect(assessShiftResilience(input, roster)).to.deep.equal(once);
        });
    });

    it('reads need through demandOverrides, never a side channel', () => {
        const input = warehouse();
        (input.shifts[1] as any).demandOverrides = [{ from: DAY, to: DAY, minEmployees: 4, label: 'Event: Winter Sale' }];
        const [late] = assessShiftResilience(input, roster, { shiftInstanceIds: [`late@${DAY}`] });
        expect(late.need).to.equal(4);
        expect(late.shortBy).to.equal(2);
    });

    it('agrees with rankCandidates about who is eligible', () => {
        for (const id of [`early@${DAY}`, `late@${DAY}`]) {
            const [shift] = assessShiftResilience(warehouse(), roster, { shiftInstanceIds: [id], topBackups: 99 });
            const ranked = rankCandidates(warehouse(), id, roster).filter((c) => c.eligible);
            expect(shift.topBackups.map((c) => c.employeeId)).to.have.members(ranked.map((c) => c.employeeId));
            expect(shift.backups).to.equal(ranked.length);
            // Same order and same rows: one judgement, not a copy of it.
            expect(shift.topBackups).to.deep.equal(ranked);
        }
    });

    it('orders by date, start, id and honours topBackups', () => {
        const input = warehouse({
            employees: [
                ...warehouse().employees,
                { id: 'fay', tags: ['picker'], timeOff: [] },
                { id: 'gus', tags: ['picker'], timeOff: [] },
            ],
        });
        const out = assessShiftResilience(input, roster, { topBackups: 2 });
        expect(out.map((s) => s.shiftInstanceId)).to.deep.equal([`early@${DAY}`, `late@${DAY}`]);
        expect(out[0].backups).to.equal(3);
        expect(out[0].topBackups).to.have.length(2);
    });

    it('carries no behavioural or predictive signal', () => {
        const [early] = assessShiftResilience(warehouse(), roster, { shiftInstanceIds: [`early@${DAY}`] });
        expect(Object.keys(early)).to.have.members([
            'shiftInstanceId',
            'date',
            'startMinute',
            'endMinute',
            'siteId',
            'need',
            'assigned',
            'absent',
            'shortBy',
            'expectedDropouts',
            'backups',
            'skills',
            'topBackups',
            'tier',
            'reasons',
        ]);
    });

    it('is exported from the package root', () => {
        expect(root.assessShiftResilience).to.equal(assessShiftResilience);
        expect(root.resilienceTier).to.be.a('function');
    });
});
