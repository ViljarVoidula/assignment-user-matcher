import { expect } from 'chai';
import { normalizeSchedulePolicy, scheduleFromJson, isHeld } from '../src/schedule/policy';

describe('Schedule policy normalization', function () {
    describe('normalizeSchedulePolicy', function () {
        it('treats a missing or malformed policy as no schedule at all', function () {
            expect(normalizeSchedulePolicy(undefined)).to.be.null;
            expect(normalizeSchedulePolicy(null)).to.be.null;
            expect(normalizeSchedulePolicy('not-an-object' as any)).to.be.null;
        });

        it('treats a policy with no usable timestamps as no schedule at all', function () {
            expect(normalizeSchedulePolicy({})).to.be.null;
            expect(normalizeSchedulePolicy({ notBefore: -5 })).to.be.null;
            expect(normalizeSchedulePolicy({ notBefore: 0, notAfter: Number.NaN })).to.be.null;
            expect(normalizeSchedulePolicy({ onMiss: 'drop' })).to.be.null;
        });

        it('ignores the whole policy when the window is inverted or empty', function () {
            expect(normalizeSchedulePolicy({ notBefore: 2000, notAfter: 1000 })).to.be.null;
            expect(normalizeSchedulePolicy({ notBefore: 2000, notAfter: 2000 })).to.be.null;
        });

        it('accepts either timestamp alone', function () {
            const holdOnly = normalizeSchedulePolicy({ notBefore: 5000 })!;
            expect(holdOnly.notBefore).to.equal(5000);
            expect(holdOnly.notAfter).to.be.undefined;

            const deadlineOnly = normalizeSchedulePolicy({ notAfter: 5000 })!;
            expect(deadlineOnly.notBefore).to.be.undefined;
            expect(deadlineOnly.notAfter).to.equal(5000);
        });

        it('floors fractional timestamps', function () {
            const policy = normalizeSchedulePolicy({ notBefore: 1000.9, notAfter: 2000.9 })!;
            expect(policy.notBefore).to.equal(1000);
            expect(policy.notAfter).to.equal(2000);
        });

        it('defaults onMiss to park and ignores unknown actions', function () {
            expect(normalizeSchedulePolicy({ notAfter: 5000 })!.onMiss).to.equal('park');
            expect(normalizeSchedulePolicy({ notAfter: 5000, onMiss: 'drop' })!.onMiss).to.equal('drop');
            expect(normalizeSchedulePolicy({ notAfter: 5000, onMiss: 'explode' as any })!.onMiss).to.equal('park');
        });
    });

    describe('scheduleFromJson', function () {
        it('skips JSON that cannot contain a schedule without parsing it', function () {
            expect(scheduleFromJson(null)).to.be.null;
            expect(scheduleFromJson(undefined)).to.be.null;
            expect(scheduleFromJson('{"id":"a1","tags":["t"]}')).to.be.null;
        });

        it('parses the schedule out of stored assignment JSON', function () {
            const json = JSON.stringify({ id: 'a1', tags: ['t'], schedule: { notAfter: 9000 } });
            expect(scheduleFromJson(json)!.notAfter).to.equal(9000);
        });

        it('returns null for corrupt JSON that happens to mention "schedule"', function () {
            expect(scheduleFromJson('{"schedule": {')).to.be.null;
        });
    });

    describe('isHeld', function () {
        it('holds only while notBefore is strictly in the future', function () {
            const policy = normalizeSchedulePolicy({ notBefore: 5000 })!;
            expect(isHeld(policy, 4999)).to.be.true;
            expect(isHeld(policy, 5000)).to.be.false;
            expect(isHeld(policy, 5001)).to.be.false;
        });

        it('never holds a deadline-only policy', function () {
            const policy = normalizeSchedulePolicy({ notAfter: 5000 })!;
            expect(isHeld(policy, 0)).to.be.false;
        });
    });
});
