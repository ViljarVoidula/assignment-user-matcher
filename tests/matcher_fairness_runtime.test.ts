import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Runtime fairness reconfiguration (setFairnessConfig)', function () {
    this.timeout(10000);
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        await redisClient.quit();
    });

    it('setFairness is shorthand for setFairnessConfig({ fairness })', function () {
        const m = new Matcher(redisClient, { redisPrefix: 'fair_rt_a:' });
        expect(m.getFairness()).to.equal('first-come');
        expect(m.isFairTiebreakerEnabled()).to.equal(false);

        m.setFairness('best-match');
        expect(m.getFairness()).to.equal('best-match');
        expect(m.isFairTiebreakerEnabled()).to.equal(true);

        m.setFairness('first-come');
        expect(m.getFairness()).to.equal('first-come');
        expect(m.isFairTiebreakerEnabled()).to.equal(false);
    });

    it('setFairnessConfig updates every knob and getFairnessConfig reflects it', function () {
        const m = new Matcher(redisClient, { redisPrefix: 'fair_rt_b:' });

        m.setFairnessConfig({
            fairness: 'spread-work',
            fairnessLoadPenalty: 7,
            fairnessTieBand: 3,
            fairnessMaxPerWindow: 4,
            fairnessWindowMs: 12345,
        });

        const cfg = m.getFairnessConfig();
        expect(cfg.fairness).to.equal('spread-work');
        expect(cfg.enableFairTiebreaker).to.equal(true);
        expect(cfg.fairnessLoadPenalty).to.equal(7);
        expect(cfg.fairnessTieBand).to.equal(3);
        expect(cfg.fairnessMaxPerWindow).to.equal(4);
        expect(cfg.fairnessWindowMs).to.equal(12345);
    });

    it('clears knobs to their defaults when keys are present but explicitly undefined', function () {
        const m = new Matcher(redisClient, {
            redisPrefix: 'fair_rt_clear:',
            fairness: 'balanced',
            fairnessLoadPenalty: 9,
            fairnessTieBand: 2,
            fairnessMaxPerWindow: 5,
            fairnessWindowMs: 111,
        });

        // Every key present but undefined: exercises each `?? default` fallback
        // and the falsy-fairness path (no enableFairTiebreaker derivation).
        m.setFairnessConfig({
            fairness: undefined,
            fairnessLoadPenalty: undefined,
            fairnessTieBand: undefined,
            fairnessMaxPerWindow: undefined,
            fairnessWindowMs: undefined,
        });

        const cfg = m.getFairnessConfig();
        // fairnessMode was cleared, but enableFairTiebreaker stays true (clearing
        // the mode alone doesn't derive it), so getFairness() reports 'best-match'.
        expect(cfg.fairness).to.equal('best-match');
        expect(cfg.enableFairTiebreaker).to.equal(true);
        expect(cfg.fairnessLoadPenalty).to.equal(0);
        expect(cfg.fairnessTieBand).to.equal(0);
        expect(cfg.fairnessMaxPerWindow).to.be.undefined;
        expect(cfg.fairnessWindowMs).to.equal(3600000);
    });

    it('a partial config leaves unmentioned knobs untouched', function () {
        const m = new Matcher(redisClient, {
            redisPrefix: 'fair_rt_c:',
            fairness: 'balanced',
            fairnessLoadPenalty: 9,
            fairnessTieBand: 2,
        });

        m.setFairnessConfig({ fairnessTieBand: 5 });

        const cfg = m.getFairnessConfig();
        expect(cfg.fairness).to.equal('balanced');
        expect(cfg.fairnessLoadPenalty).to.equal(9);
        expect(cfg.fairnessTieBand).to.equal(5);
    });

    it('mirrors the constructor: an explicit fairness overrides enableFairTiebreaker', function () {
        const m = new Matcher(redisClient, { redisPrefix: 'fair_rt_d:' });

        // Both passed together: fairness wins, exactly as in the constructor.
        m.setFairnessConfig({ enableFairTiebreaker: false, fairness: 'best-match' });
        expect(m.isFairTiebreakerEnabled()).to.equal(true);
        expect(m.getFairness()).to.equal('best-match');

        // enableFairTiebreaker alone still toggles the raw fair path.
        m.setFairnessConfig({ enableFairTiebreaker: false });
        expect(m.isFairTiebreakerEnabled()).to.equal(false);
    });

    it('takes effect on the next bulk match with no reconnect: first-come -> spread-work redistributes load', async function () {
        // Start in first-come: the two users independently claim in parallel,
        // so with a big backlog the strong user can grab everything.
        const m = new Matcher(redisClient, {
            redisPrefix: 'fair_rt_e:',
            maxUserBacklogSize: 10,
            relevantBatchSize: 20,
        });

        await m.addUser({ id: 'strong', tags: ['support'], routingWeights: { support: 200 } });
        await m.addUser({ id: 'weak', tags: ['support'], routingWeights: { support: 20 } });
        for (let i = 1; i <= 6; i++) {
            await m.addAssignment({ id: `job-${i}`, tags: ['support'], priority: 100 });
        }

        // Retune at runtime to spread work with a heavy load penalty, then match.
        m.setFairnessConfig({ fairness: 'spread-work', fairnessLoadPenalty: 80 });

        await m.matchUsersAssignments();

        const strong = await m.getCurrentAssignmentsForUser('strong');
        const weak = await m.getCurrentAssignmentsForUser('weak');

        // With load-penalized spread-work arbitration both eligible users share
        // the backlog rather than the strongest taking all six.
        expect(strong.length + weak.length).to.equal(6);
        expect(weak.length).to.be.greaterThan(0);
        expect(strong.length).to.be.lessThan(6);
    });
});
