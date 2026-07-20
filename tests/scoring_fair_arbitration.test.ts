import { expect } from 'chai';
import { resolveFairnessKnobs, arbitrateFair } from '../src/scoring/fair-arbitration';

/**
 * Fair-mode arbitration decides who wins a contested assignment under
 * `'balanced'`/`'spread-work'` — a bug here silently breaks the load-fairness
 * pitch (busy users would keep winning, or ids would decide ties instead of
 * score). Pure logic, tested directly as a black box.
 */
describe('resolveFairnessKnobs', function () {
    it('leaves loadPenalty at 0 when the derived median candidate score is not positive', function () {
        const result = resolveFairnessKnobs('balanced', [0, 0, 0], { loadPenalty: 0, tieBand: 0 });
        expect(result.loadPenalty).to.equal(0);
    });

    it('derives a positive loadPenalty from the median score for a preset mode', function () {
        const result = resolveFairnessKnobs('balanced', [10, 20, 30], { loadPenalty: 0, tieBand: 0 });
        expect(result.loadPenalty).to.be.greaterThan(0);
    });
});

describe('arbitrateFair', function () {
    it('defaults loadPenalty/tieBand/maxByUser when omitted, and reads existing backlog counts', function () {
        const backlogUsed = new Map([['loaded-user', 2]]);
        const { winners } = arbitrateFair(
            [
                { userId: 'loaded-user', id: 'a1', priority: 10 },
                { userId: 'fresh-user', id: 'a2', priority: 5 },
            ],
            backlogUsed,
            new Set(),
            { maxUserBacklogSize: 5 },
        );

        expect(winners.map((w) => w.id).sort()).to.deep.equal(['a1', 'a2']);
    });

    it('respects a per-user maxByUser override tighter than the global cap', function () {
        const { winners, deferred } = arbitrateFair(
            [{ userId: 'capped-user', id: 'a1', priority: 10 }],
            new Map([['capped-user', 1]]),
            new Set(),
            { maxUserBacklogSize: 10, maxByUser: new Map([['capped-user', 1]]) },
        );

        expect(winners).to.have.length(0);
        expect(deferred.map((d) => d.id)).to.deep.equal(['a1']);
    });

    it('breaks a full tie (same rank, load, and priority) by assignment id under load-aware arbitration', function () {
        const { winners } = arbitrateFair(
            [
                { userId: 'user-b', id: 'a2', priority: 10 },
                { userId: 'user-a', id: 'a1', priority: 10 },
            ],
            new Map(),
            new Set(),
            { maxUserBacklogSize: 5, loadPenalty: 1 },
        );

        expect(winners.map((w) => w.id)).to.deep.equal(['a1', 'a2']);
    });
});
