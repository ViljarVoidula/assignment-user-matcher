import { expect } from 'chai';
import { calculateMatchScore, explainMatchScore, calculateDefaultPriority } from '../src/scoring/match-score';
import type { User } from '../src/types/matcher';

/**
 * calculateMatchScore is the hot-path scorer; explainMatchScore must stay
 * numerically identical (guarded elsewhere by a parity test) while adding
 * reasons. These edge cases (empty tag strings, thresholds partially met,
 * empty user tag sets) are the ones the parity/integration tests happen not
 * to exercise directly.
 */
describe('calculateMatchScore edge cases', function () {
    it('treats an empty assignment tag string as no tags, for a weighted user', function () {
        const user: User = { id: 'u1', tags: [], routingWeights: { support: 10 } };
        const [score, combined] = calculateMatchScore(user, '', 5, false);
        expect(score).to.equal(0);
        expect(combined).to.equal(5);
    });

    it('falls back to 0 priority when assignmentPriority is not numeric, on a veto match', function () {
        const user: User = { id: 'u1', tags: [], routingWeights: { billing: 0 } };
        const [score, combined] = calculateMatchScore(user, 'billing', 'not-a-number', false);
        expect(score).to.equal(0);
        expect(combined).to.equal(0);
    });

    it('scores 0 for tag-overlap matching when the user has no tags at all', function () {
        const user: User = { id: 'u1', tags: [] };
        const [score] = calculateMatchScore(user, 'support', 10, false);
        expect(score).to.equal(0);
    });
});

describe('explainMatchScore edge cases', function () {
    it('treats an empty assignment tag string as no tags, for a weighted user', function () {
        const user: User = { id: 'u1', tags: [], routingWeights: { support: 10 } };
        const result = explainMatchScore(user, '', 5, false);
        expect(result.score).to.equal(0);
        expect(result.combinedPriority).to.equal(5);
    });

    it('only reports skillThreshold reasons for the skills that were actually unmet', function () {
        const user: User = { id: 'u1', tags: [], routingWeights: { a: 10 } };
        const result = explainMatchScore(user, 'x', 0, false, { a: 5, b: 20 });
        expect(result.reasons).to.deep.equal([{ kind: 'skillThreshold', skill: 'b', required: 20, actual: 0 }]);
    });

    it('reports a skillThreshold reason per skill when the user has no routingWeights at all', function () {
        const user: User = { id: 'u1', tags: [] };
        const result = explainMatchScore(user, 'x', 0, false, { a: 1 });
        expect(result.reasons).to.deep.equal([{ kind: 'skillThreshold', skill: 'a', required: 1, actual: 0 }]);
    });

    it('scores 0 with no reasons for tag-overlap matching when the user has no tags at all', function () {
        const user: User = { id: 'u1', tags: [] };
        const result = explainMatchScore(user, 'support', 10, false);
        expect(result.score).to.equal(0);
        expect(result.reasons).to.deep.equal([]);
    });
});

describe('calculateDefaultPriority', function () {
    it('returns 0 when createdAt is undefined', function () {
        expect(calculateDefaultPriority(undefined)).to.equal(0);
    });

    it('returns the elapsed time since createdAt', function () {
        const past = Date.now() - 1000;
        expect(calculateDefaultPriority(past)).to.be.greaterThan(0);
    });
});
