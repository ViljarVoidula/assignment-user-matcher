import { expect } from 'chai';
import { cosineSimilarity, extractMatchFeatures } from '../src/learning/features';
import type { User } from '../src/types/matcher';

/**
 * The default learning feature extractor feeds the contextual bandit — a
 * silently-wrong feature vector (e.g. treating a missing tags array as a
 * crash instead of "no tags") would corrupt every learned weight downstream.
 */
describe('cosineSimilarity', function () {
    it('returns 0 for mismatched-length or empty vectors', function () {
        expect(cosineSimilarity([1, 2], [1, 2, 3])).to.equal(0);
        expect(cosineSimilarity([], [])).to.equal(0);
        expect(cosineSimilarity(null as any, [1])).to.equal(0);
    });

    it('returns 0 for a zero-magnitude vector', function () {
        expect(cosineSimilarity([0, 0], [1, 2])).to.equal(0);
    });

    it('computes similarity for valid same-length vectors', function () {
        expect(cosineSimilarity([1, 0], [1, 0])).to.equal(1);
    });
});

describe('extractMatchFeatures', function () {
    it('treats missing user/assignment tags as empty rather than throwing', function () {
        const user = { id: 'u1' } as unknown as User;
        const features = extractMatchFeatures(user, { id: 'a1', tags: undefined as any });
        expect(features).to.deep.equal({ bias: 1 });
    });

    it('skips a skill feature for a routing weight that does not exceed 0', function () {
        const user: User = { id: 'u1', tags: ['support'], routingWeights: { support: 0 } };
        const features = extractMatchFeatures(user, { id: 'a1', tags: ['support'] });
        expect(features).to.not.have.property('skill:support');
        expect(features['tag:support']).to.equal(1);
    });
});
