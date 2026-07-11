import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Fair Tiebreaker load balancing (fairnessLoadPenalty / fairnessTieBand)', function () {
    this.timeout(10000);
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
    });

    after(async function () {
        await redisClient.quit();
    });

    it('fairnessLoadPenalty spreads contested work instead of saturating the top scorer', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_load_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
            // strong scores 300 (100 base + 200 weight), weak scores 200.
            // Each win costs 150, so after one win strong's next candidate
            // scores 150 < weak's 200 and the work alternates.
            fairnessLoadPenalty: 150,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'strong', tags: ['plumbing'], routingWeights: { plumbing: 200 } });
        await matcher.addUser({ id: 'weak', tags: ['plumbing'], routingWeights: { plumbing: 100 } });
        for (let i = 1; i <= 4; i++) {
            await matcher.addAssignment({ id: `job-${i}`, tags: ['plumbing'], priority: 100 });
        }

        await matcher.matchUsersAssignments();

        const strongAssignments = await matcher.getCurrentAssignmentsForUser('strong');
        const weakAssignments = await matcher.getCurrentAssignmentsForUser('weak');
        expect(strongAssignments.length, 'strong gets half, not everything').to.equal(2);
        expect(weakAssignments.length, 'weak gets the other half').to.equal(2);
    });

    it('without the penalty the top scorer still takes everything (default unchanged)', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_load_off_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'strong', tags: ['plumbing'], routingWeights: { plumbing: 200 } });
        await matcher.addUser({ id: 'weak', tags: ['plumbing'], routingWeights: { plumbing: 100 } });
        for (let i = 1; i <= 4; i++) {
            await matcher.addAssignment({ id: `job-${i}`, tags: ['plumbing'], priority: 100 });
        }

        await matcher.matchUsersAssignments();

        expect((await matcher.getCurrentAssignmentsForUser('strong')).length).to.equal(4);
        expect((await matcher.getCurrentAssignmentsForUser('weak')).length).to.equal(0);
    });

    it('fairnessLoadPenalty counts pre-existing backlog, not just wins from this tick', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_load_pre_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
            // strong scores 300 on the contested job but already carries two
            // assignments: 300 - 2 * 60 = 180 < weak's 200.
            fairnessLoadPenalty: 60,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({
            id: 'strong',
            tags: ['plumbing', 'solo'],
            routingWeights: { plumbing: 200, solo: 50 },
        });
        await matcher.addUser({ id: 'weak', tags: ['plumbing'], routingWeights: { plumbing: 100 } });

        // Two warmup jobs only strong can take, to build up their backlog.
        await matcher.addAssignment({ id: 'warmup-1', tags: ['solo'], priority: 100 });
        await matcher.addAssignment({ id: 'warmup-2', tags: ['solo'], priority: 100 });
        await matcher.matchUsersAssignments();
        expect((await matcher.getCurrentAssignmentsForUser('strong')).length).to.equal(2);

        await matcher.addAssignment({ id: 'contested', tags: ['plumbing'], priority: 100 });
        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('weak')).to.include('contested');
        expect(await matcher.getCurrentAssignmentsForUser('strong')).to.not.include('contested');
    });

    it('fairnessTieBand routes near-tied scores to the less-loaded user', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_band_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
            // Scores 205 vs 201 land in the same 10-wide band, so the tie
            // goes to whoever carries less work.
            fairnessTieBand: 10,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({
            id: 'busy',
            tags: ['support', 'solo'],
            routingWeights: { support: 105, solo: 50 },
        });
        await matcher.addUser({ id: 'idle', tags: ['support'], routingWeights: { support: 101 } });

        await matcher.addAssignment({ id: 'warmup', tags: ['solo'], priority: 100 });
        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('busy')).to.include('warmup');

        await matcher.addAssignment({ id: 'contested', tags: ['support'], priority: 100 });
        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('idle')).to.include('contested');
        expect(await matcher.getCurrentAssignmentsForUser('busy')).to.not.include('contested');
    });

    it('scores outside the band still win on score regardless of load', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_band_out_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
            // 205 vs 201 fall in different 3-wide bands (68 vs 67), so the
            // higher score wins even though that user is busier.
            fairnessTieBand: 3,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({
            id: 'busy',
            tags: ['support', 'solo'],
            routingWeights: { support: 105, solo: 50 },
        });
        await matcher.addUser({ id: 'idle', tags: ['support'], routingWeights: { support: 101 } });

        await matcher.addAssignment({ id: 'warmup', tags: ['solo'], priority: 100 });
        await matcher.matchUsersAssignments();

        await matcher.addAssignment({ id: 'contested', tags: ['support'], priority: 100 });
        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('busy')).to.include('contested');
        expect(await matcher.getCurrentAssignmentsForUser('idle')).to.not.include('contested');
    });

    it("fairness: 'spread-work' spreads contested work with zero manual tuning", async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_preset_spread_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            fairness: 'spread-work',
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'strong', tags: ['plumbing'], routingWeights: { plumbing: 200 } });
        await matcher.addUser({ id: 'weak', tags: ['plumbing'], routingWeights: { plumbing: 100 } });
        for (let i = 1; i <= 4; i++) {
            await matcher.addAssignment({ id: `job-${i}`, tags: ['plumbing'], priority: 100 });
        }

        await matcher.matchUsersAssignments();

        expect((await matcher.getCurrentAssignmentsForUser('strong')).length).to.equal(2);
        expect((await matcher.getCurrentAssignmentsForUser('weak')).length).to.equal(2);
    });

    it("fairness: 'balanced' gives near-ties to the less-loaded user but lets clear skill gaps win", async function () {
        // Near-tie: 205 vs 201 is within the auto-derived ~5% band, so the
        // idle user wins even though the busy one scores slightly higher.
        const nearTie = new Matcher(redisClient, {
            redisPrefix: 'fair_preset_bal_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            fairness: 'balanced',
        });
        await nearTie.redisClient.flushAll();

        await nearTie.addUser({
            id: 'busy',
            tags: ['support', 'solo'],
            routingWeights: { support: 105, solo: 50 },
        });
        await nearTie.addUser({ id: 'idle', tags: ['support'], routingWeights: { support: 101 } });
        await nearTie.addAssignment({ id: 'warmup', tags: ['solo'], priority: 100 });
        await nearTie.matchUsersAssignments();
        await nearTie.addAssignment({ id: 'contested', tags: ['support'], priority: 100 });
        await nearTie.matchUsersAssignments();

        expect(await nearTie.getCurrentAssignmentsForUser('idle')).to.include('contested');

        // Clear gap: 250 vs 201 is far outside the band, so the busy
        // specialist still wins on skill.
        const clearGap = new Matcher(redisClient, {
            redisPrefix: 'fair_preset_gap_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            fairness: 'balanced',
        });
        await clearGap.redisClient.flushAll();

        await clearGap.addUser({
            id: 'busy',
            tags: ['support', 'solo'],
            routingWeights: { support: 150, solo: 50 },
        });
        await clearGap.addUser({ id: 'idle', tags: ['support'], routingWeights: { support: 101 } });
        await clearGap.addAssignment({ id: 'warmup', tags: ['solo'], priority: 100 });
        await clearGap.matchUsersAssignments();
        await clearGap.addAssignment({ id: 'contested', tags: ['support'], priority: 100 });
        await clearGap.matchUsersAssignments();

        expect(await clearGap.getCurrentAssignmentsForUser('busy')).to.include('contested');
    });

    it("fairness: 'best-match' and 'first-come' map to the expected tiebreaker behavior", async function () {
        const bestMatch = new Matcher(redisClient, { redisPrefix: 'fair_preset_bm_test:', fairness: 'best-match' });
        expect(bestMatch.isFairTiebreakerEnabled()).to.equal(true);

        const firstCome = new Matcher(redisClient, { redisPrefix: 'fair_preset_fc_test:', fairness: 'first-come' });
        expect(firstCome.isFairTiebreakerEnabled()).to.equal(false);

        firstCome.setFairness('spread-work');
        expect(firstCome.isFairTiebreakerEnabled()).to.equal(true);
        expect(firstCome.getFairness()).to.equal('spread-work');
        firstCome.setFairness('first-come');
        expect(firstCome.isFairTiebreakerEnabled()).to.equal(false);
        expect(firstCome.getFairness()).to.equal('first-come');
    });

    it('fairnessMaxPerWindow caps how much work one user can receive, spilling the rest to others', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_window_test:',
            maxUserBacklogSize: 10,
            relevantBatchSize: 20,
            fairness: 'best-match',
            fairnessMaxPerWindow: 2,
            fairnessWindowMs: 60_000,
        });
        await matcher.redisClient.flushAll();

        // strong outscores weak on every job, but may only receive 2 per window.
        await matcher.addUser({ id: 'strong', tags: ['plumbing'], routingWeights: { plumbing: 200 } });
        await matcher.addUser({ id: 'weak', tags: ['plumbing'], routingWeights: { plumbing: 100 } });
        for (let i = 1; i <= 4; i++) {
            await matcher.addAssignment({ id: `job-${i}`, tags: ['plumbing'], priority: 100 });
        }

        await matcher.matchUsersAssignments();

        expect((await matcher.getCurrentAssignmentsForUser('strong')).length).to.equal(2);
        expect((await matcher.getCurrentAssignmentsForUser('weak')).length).to.equal(2);
    });

    it('fairnessMaxPerWindow accumulates across matching passes and releases as the window rolls', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_window_roll_test:',
            maxUserBacklogSize: 10,
            relevantBatchSize: 20,
            fairness: 'best-match',
            fairnessMaxPerWindow: 2,
            fairnessWindowMs: 400,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'solo', tags: ['plumbing'], routingWeights: { plumbing: 100 } });

        await matcher.addAssignment({ id: 'job-1', tags: ['plumbing'], priority: 100 });
        await matcher.addAssignment({ id: 'job-2', tags: ['plumbing'], priority: 100 });
        await matcher.matchUsersAssignments();
        expect((await matcher.getCurrentAssignmentsForUser('solo')).length).to.equal(2);

        // Window exhausted: a third job must stay queued even across passes.
        await matcher.addAssignment({ id: 'job-3', tags: ['plumbing'], priority: 100 });
        await matcher.matchUsersAssignments();
        expect((await matcher.getCurrentAssignmentsForUser('solo')).length).to.equal(2);

        // Once the window rolls past the first grants, capacity frees up.
        await new Promise((resolve) => setTimeout(resolve, 450));
        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('solo')).to.include('job-3');
    });

    it('workflow-targeted assignments bypass fairnessMaxPerWindow (direct handoffs must not stall)', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_window_wf_test:',
            maxUserBacklogSize: 10,
            relevantBatchSize: 20,
            enableWorkflows: true,
            fairness: 'best-match',
            fairnessMaxPerWindow: 1,
            fairnessWindowMs: 60_000,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'user1', tags: ['support'], routingWeights: { support: 100 } });

        // Exhaust the window with a normal grant.
        await matcher.addAssignment({ id: 'normal-job', tags: ['support'], priority: 100 });
        await matcher.matchUsersAssignments();
        expect(await matcher.getCurrentAssignmentsForUser('user1')).to.include('normal-job');

        await matcher.addAssignment({
            id: 'wf-assignment',
            tags: ['workflow-only'],
            priority: 100,
            _targetUserId: 'user1',
            _workflowInstanceId: 'wf-instance-1',
        });
        await matcher.matchUsersAssignments();

        expect(await matcher.getCurrentAssignmentsForUser('user1')).to.include('wf-assignment');
        await matcher.stopOrchestrator();
    });

    it('presets default a team-relative window guardrail: a hoarder at 2x the team average stops receiving', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_auto_cap_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            fairness: 'balanced',
            // No fairnessMaxPerWindow: the preset must supply the guardrail.
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'hoarder', tags: ['plumbing'], routingWeights: { plumbing: 200 } });
        await matcher.addUser({ id: 'idle', tags: ['plumbing'], routingWeights: { plumbing: 100 } });

        // Seed the hoarder's rolling window with 40 recent grants (idle has 0):
        // team average is 20, so the auto cap (2x average = 40) is exhausted
        // for the hoarder while idle has full headroom.
        const now = Date.now();
        await matcher.redisClient.zAdd(
            'fair_auto_cap_test:user:hoarder:window-grants',
            Array.from({ length: 40 }, (_, i) => ({ score: now, value: `${now}:${i}` })),
        );

        for (let i = 1; i <= 4; i++) {
            await matcher.addAssignment({ id: `job-${i}`, tags: ['plumbing'], priority: 100 });
        }
        await matcher.matchUsersAssignments();

        // 300 vs 200 is far outside balanced's tie band, so without the
        // guardrail the hoarder would win everything.
        expect((await matcher.getCurrentAssignmentsForUser('idle')).length).to.equal(4);
        expect((await matcher.getCurrentAssignmentsForUser('hoarder')).length).to.equal(0);
    });

    it('fairnessMaxPerWindow: Infinity opts out of the preset guardrail', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_auto_opt_out_test:',
            maxUserBacklogSize: 5,
            relevantBatchSize: 20,
            fairness: 'balanced',
            fairnessMaxPerWindow: Infinity,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'hoarder', tags: ['plumbing'], routingWeights: { plumbing: 200 } });
        await matcher.addUser({ id: 'idle', tags: ['plumbing'], routingWeights: { plumbing: 100 } });

        const now = Date.now();
        await matcher.redisClient.zAdd(
            'fair_auto_opt_out_test:user:hoarder:window-grants',
            Array.from({ length: 40 }, (_, i) => ({ score: now, value: `${now}:${i}` })),
        );

        for (let i = 1; i <= 4; i++) {
            await matcher.addAssignment({ id: `job-${i}`, tags: ['plumbing'], priority: 100 });
        }
        await matcher.matchUsersAssignments();

        // With the guardrail disabled the seeded window is ignored and the
        // higher scorer wins everything again.
        expect((await matcher.getCurrentAssignmentsForUser('hoarder')).length).to.equal(4);
    });

    it('load-aware arbitration still respects maxUserBacklogSize', async function () {
        const matcher = new Matcher(redisClient, {
            redisPrefix: 'fair_load_cap_test:',
            maxUserBacklogSize: 2,
            relevantBatchSize: 20,
            enableFairTiebreaker: true,
            fairnessLoadPenalty: 10,
        });
        await matcher.redisClient.flushAll();

        await matcher.addUser({ id: 'a', tags: ['support'], routingWeights: { support: 100 } });
        await matcher.addUser({ id: 'b', tags: ['support'], routingWeights: { support: 90 } });
        for (let i = 1; i <= 6; i++) {
            await matcher.addAssignment({ id: `t${i}`, tags: ['support'], priority: 100 });
        }

        await matcher.matchUsersAssignments();

        expect((await matcher.getCurrentAssignmentsForUser('a')).length).to.equal(2);
        expect((await matcher.getCurrentAssignmentsForUser('b')).length).to.equal(2);
    });
});
