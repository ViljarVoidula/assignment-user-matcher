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
        // Held but zero backups for that skill is at-risk, same as the shift-level
        // zero-backup case — with no `assigned` given, the skill's dropout share
        // is the unscaled shift-wide expectedDropouts (0.1), and 0 backups < 0.1.
        expect(
            resilienceTier({ shortBy: 0, backups: 5, expectedDropouts: 0.1, skills: [skill('forklift', 0, 0)] }),
        ).to.deep.equal({
            tier: 'at-risk',
            reasons: ['thin-skill:forklift'],
        });
    });
    it('scales a skill dropout share by its share of assigned holders', () => {
        // skillDropouts = expectedDropouts * held / assigned = 0.4 * 1 / 4 = 0.1
        // backups 1 >= 0.1 (not at-risk) but < 0.1 + 1 = 1.1, so watch.
        expect(
            resilienceTier({
                shortBy: 0,
                backups: 5,
                expectedDropouts: 0.4,
                assigned: 4,
                skills: [{ tag: 'forklift', required: 1, held: 1, shortBy: 0, backups: 1 }],
            }),
        ).to.deep.equal({ tier: 'watch', reasons: ['thin-skill:forklift'] });
    });
    it('is ok for a scaled skill dropout share once backups clear it', () => {
        // Same skillDropouts (0.1); backups 2 >= 0.1 + 1 = 1.1, so no reason fires.
        expect(
            resilienceTier({
                shortBy: 0,
                backups: 5,
                expectedDropouts: 0.4,
                assigned: 4,
                skills: [{ tag: 'forklift', required: 1, held: 1, shortBy: 0, backups: 2 }],
            }),
        ).to.deep.equal({ tier: 'ok', reasons: [] });
    });
    it('is at-risk when a scaled skill dropout share exceeds its backups', () => {
        // skillDropouts = expectedDropouts * held / assigned = 3 * 2 / 4 = 1.5
        // backups 1 < 1.5, so at-risk.
        expect(
            resilienceTier({
                shortBy: 0,
                backups: 5,
                expectedDropouts: 3,
                assigned: 4,
                skills: [{ tag: 'forklift', required: 2, held: 2, shortBy: 0, backups: 1 }],
            }),
        ).to.deep.equal({ tier: 'at-risk', reasons: ['thin-skill:forklift'] });
    });
});
