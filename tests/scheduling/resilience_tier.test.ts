import { expect } from 'chai';
import { resilienceTier } from '../../src/scheduling/resilience';

const skill = (tag: string, shortBy: number, backups: number) => ({
    tag,
    required: 1,
    held: 1 - shortBy,
    shortBy,
    backups,
});

describe('resilienceTier', () => {
    it('is critical when short and nobody can step in', () => {
        expect(resilienceTier({ shortBy: 1, backups: 0, expectedDropouts: 0.2, skills: [] })).to.deep.equal({
            tier: 'critical',
            reasons: ['short', 'no-backups'],
        });
    });
    it('is at-risk when short but fillable', () => {
        expect(resilienceTier({ shortBy: 1, backups: 3, expectedDropouts: 0.2, skills: [] }).tier).to.equal('at-risk');
    });
    it('is at-risk when fully staffed but backups do not cover expected dropouts', () => {
        expect(resilienceTier({ shortBy: 0, backups: 0, expectedDropouts: 0.4, skills: [] }).tier).to.equal('at-risk');
    });
    it('is watch when one more dropout than expected would hurt', () => {
        expect(resilienceTier({ shortBy: 0, backups: 1, expectedDropouts: 0.4, skills: [] })).to.deep.equal({
            tier: 'watch',
            reasons: ['thin-backups'],
        });
    });
    it('is ok with enough backups', () => {
        expect(resilienceTier({ shortBy: 0, backups: 3, expectedDropouts: 0.4, skills: [] }).tier).to.equal('ok');
    });
    it('judges each required skill the same way', () => {
        expect(
            resilienceTier({ shortBy: 0, backups: 5, expectedDropouts: 0.1, skills: [skill('forklift', 1, 0)] }),
        ).to.deep.equal({
            tier: 'critical',
            reasons: ['short-skill:forklift', 'no-backups'],
        });
        expect(
            resilienceTier({ shortBy: 0, backups: 5, expectedDropouts: 0.1, skills: [skill('forklift', 0, 0)] }),
        ).to.deep.equal({
            tier: 'watch',
            reasons: ['thin-skill:forklift'],
        });
    });
});
