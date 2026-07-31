import { expect } from 'chai';
import {
    normalizeSlaPolicy,
    slaFromJson,
    rejectionCountOf,
    completionDeadlineScore,
    slaExpiryScore,
    rejectionBudgetExhausted,
    SLA_REJECTION_COUNT_FIELD,
} from '../src/sla/policy';

describe('SLA policy normalization', function () {
    describe('normalizeSlaPolicy', function () {
        it('treats a missing or malformed policy as no SLA at all', function () {
            expect(normalizeSlaPolicy(undefined)).to.be.null;
            expect(normalizeSlaPolicy(null)).to.be.null;
            expect(normalizeSlaPolicy('not-an-object' as any)).to.be.null;
        });

        it('treats a policy with no usable numbers as no SLA at all', function () {
            expect(normalizeSlaPolicy({})).to.be.null;
            expect(normalizeSlaPolicy({ completeWithinMs: -5 })).to.be.null;
            expect(normalizeSlaPolicy({ expireAfterMs: 0, maxRejections: Number.NaN })).to.be.null;
        });

        it('defaults every action knob when only a number is given', function () {
            const policy = normalizeSlaPolicy({ completeWithinMs: 1000 })!;
            expect(policy.completeWithinMs).to.equal(1000);
            expect(policy.onCompletionBreach).to.equal('notify');
            expect(policy.onMaxRejections).to.equal('park');
            expect(policy.onExpire).to.equal('drop');
        });

        it('keeps explicitly chosen actions and ignores unknown ones', function () {
            const policy = normalizeSlaPolicy({
                maxRejections: 3,
                onCompletionBreach: 'requeue',
                onMaxRejections: 'fail',
                onExpire: 'park',
            })!;
            expect(policy.onCompletionBreach).to.equal('requeue');
            expect(policy.onMaxRejections).to.equal('fail');
            expect(policy.onExpire).to.equal('park');

            const fallback = normalizeSlaPolicy({
                maxRejections: 3,
                onCompletionBreach: 'explode' as any,
                onMaxRejections: 'explode' as any,
                onExpire: 'explode' as any,
            })!;
            expect(fallback.onCompletionBreach).to.equal('notify');
            expect(fallback.onMaxRejections).to.equal('park');
            expect(fallback.onExpire).to.equal('drop');
        });

        it('floors the rejection budget and ignores negative ones', function () {
            expect(normalizeSlaPolicy({ maxRejections: 2.9 })!.maxRejections).to.equal(2);
            expect(normalizeSlaPolicy({ maxRejections: -1 })).to.be.null;
        });
    });

    describe('slaFromJson', function () {
        it('skips JSON that cannot contain an SLA without parsing it', function () {
            expect(slaFromJson(null)).to.be.null;
            expect(slaFromJson(undefined)).to.be.null;
            expect(slaFromJson('{"id":"a1","tags":["t"]}')).to.be.null;
        });

        it('parses the SLA out of stored assignment JSON', function () {
            const json = JSON.stringify({ id: 'a1', tags: ['t'], sla: { maxRejections: 2 } });
            expect(slaFromJson(json)!.maxRejections).to.equal(2);
        });

        it('returns null for corrupt JSON that happens to mention "sla"', function () {
            expect(slaFromJson('{"sla": {')).to.be.null;
        });
    });

    describe('rejection budget bookkeeping', function () {
        it('reads a missing or bogus rejection count as zero', function () {
            expect(rejectionCountOf({ id: 'a', tags: [] })).to.equal(0);
            expect(rejectionCountOf({ id: 'a', tags: [], [SLA_REJECTION_COUNT_FIELD]: 'junk' })).to.equal(0);
            expect(rejectionCountOf({ id: 'a', tags: [], [SLA_REJECTION_COUNT_FIELD]: -3 })).to.equal(0);
        });

        it('exhausts the budget exactly at maxRejections', function () {
            const policy = normalizeSlaPolicy({ maxRejections: 2 })!;
            expect(rejectionBudgetExhausted({ id: 'a', tags: [], [SLA_REJECTION_COUNT_FIELD]: 1 }, policy)).to.be.false;
            expect(rejectionBudgetExhausted({ id: 'a', tags: [], [SLA_REJECTION_COUNT_FIELD]: 2 }, policy)).to.be.true;
            // No budget configured => never exhausted
            const noBudget = normalizeSlaPolicy({ completeWithinMs: 1000 })!;
            expect(rejectionBudgetExhausted({ id: 'a', tags: [], [SLA_REJECTION_COUNT_FIELD]: 99 }, noBudget)).to.be.false;
        });
    });

    describe('deadline scores', function () {
        it('computes zset scores only when the corresponding clock is configured', function () {
            const both = normalizeSlaPolicy({ completeWithinMs: 100, expireAfterMs: 200 })!;
            expect(completionDeadlineScore(1000, both)).to.equal(1100);
            expect(slaExpiryScore(1000, both)).to.equal(1200);

            const completionOnly = normalizeSlaPolicy({ completeWithinMs: 100 })!;
            expect(completionDeadlineScore(1000, completionOnly)).to.equal(1100);
            expect(slaExpiryScore(1000, completionOnly)).to.be.null;

            const ttlOnly = normalizeSlaPolicy({ expireAfterMs: 200 })!;
            expect(completionDeadlineScore(1000, ttlOnly)).to.be.null;
            expect(slaExpiryScore(1000, ttlOnly)).to.equal(1200);
        });
    });
});
