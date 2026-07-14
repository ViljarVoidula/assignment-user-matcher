import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import { calculateMatchScore, explainMatchScore } from '../src/scoring/match-score';
import type { MatchDecisionTrace, MatchTraceReason } from '../src/types/matcher';

function reasonsOfKind(reasons: MatchTraceReason[], kind: MatchTraceReason['kind']): MatchTraceReason[] {
    return reasons.filter((r) => r.kind === kind);
}

describe('Matcher Decision Traces & Explainability', function () {
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

    describe('explainMatchScore parity', function () {
        it('returns the same score and combined priority as calculateMatchScore', function () {
            const cases: Array<[any, string, number, boolean, Record<string, number> | undefined]> = [
                [{ id: 'u', tags: [], routingWeights: { english: 100, german: 0 } }, 'english,german', 50, true, undefined],
                [{ id: 'u', tags: [], routingWeights: { 'lang:*': 40 } }, 'lang:de,default', 10, true, undefined],
                [{ id: 'u', tags: [], routingWeights: { english: 20 } }, 'english', 5, true, { english: 50 }],
                [{ id: 'u', tags: ['support', 'billing'] }, 'support,default', 7, true, undefined],
                [{ id: 'u', tags: [], routingWeights: { english: 30 } }, 'default', 3, true, undefined],
                [{ id: 'u', tags: ['support'] }, 'sales', 0, false, undefined],
            ];
            for (const [user, tags, priority, enableDefault, thresholds] of cases) {
                const [score, combined] = calculateMatchScore(user, tags, priority, enableDefault, thresholds);
                const explained = explainMatchScore(user, tags, priority, enableDefault, thresholds);
                expect(explained.score, `score for ${JSON.stringify(user.routingWeights ?? user.tags)}`).to.equal(score);
                expect(explained.combinedPriority).to.equal(combined);
            }
        });
    });

    describe('explainMatch()', function () {
        let matcher: Matcher;

        beforeEach(async function () {
            matcher = new Matcher(redisClient, { redisPrefix: 'explain_test:' });
            await matcher.waitUntilReady();
        });

        it('ranks weighted candidates and reports hard vetoes', async function () {
            await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
            await matcher.addUser({ id: 'bob', tags: [], routingWeights: { english: 80, german: 0 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english', 'german'], priority: 100 });

            const explanation = await matcher.explainMatch('a1');

            expect(explanation.status).to.equal('queued');
            expect(explanation.ownerId).to.equal(null);
            expect(explanation.candidates.map((c) => c.userId)).to.include.members(['alice', 'bob']);

            const alice = explanation.candidates.find((c) => c.userId === 'alice')!;
            expect(alice.eligible).to.equal(true);
            // english weight 100 + implicit 'default' tag weight 1 (enableDefaultMatching)
            expect(alice.score).to.equal(101);
            expect(reasonsOfKind(alice.reasons, 'tagWeight')).to.have.length.greaterThan(0);
            expect(reasonsOfKind(alice.reasons, 'defaultTag')).to.have.length(1);

            const bob = explanation.candidates.find((c) => c.userId === 'bob')!;
            expect(bob.eligible).to.equal(false);
            const vetoes = reasonsOfKind(bob.reasons, 'veto');
            expect(vetoes).to.have.length(1);
            expect((vetoes[0] as any).tag).to.equal('german');

            // Eligible candidates sort before ineligible ones
            expect(explanation.candidates[0].userId).to.equal('alice');
        });

        it('marks the actual owner as chosen after matching', async function () {
            await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
            await matcher.matchUsersAssignments();

            const explanation = await matcher.explainMatch('a1');
            expect(explanation.status).to.equal('pending');
            expect(explanation.ownerId).to.equal('alice');
            const alice = explanation.candidates.find((c) => c.userId === 'alice')!;
            expect(alice.chosen).to.equal(true);
        });

        it('reports skill threshold failures with required vs actual', async function () {
            await matcher.addUser({ id: 'junior', tags: [], routingWeights: { english: 20 } });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['english'],
                priority: 100,
                skillThresholds: { english: 50 },
            });

            const explanation = await matcher.explainMatch('a1');
            const junior = explanation.candidates.find((c) => c.userId === 'junior')!;
            expect(junior.eligible).to.equal(false);
            const thresholdReasons = reasonsOfKind(junior.reasons, 'skillThreshold');
            expect(thresholdReasons).to.have.length(1);
            expect((thresholdReasons[0] as any).required).to.equal(50);
            expect((thresholdReasons[0] as any).actual).to.equal(20);
        });

        it('reports previously rejected assignments', async function () {
            await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
            await matcher.matchUsersAssignments();
            await matcher.rejectAssignment('alice', 'a1');

            const explanation = await matcher.explainMatch('a1');
            const alice = explanation.candidates.find((c) => c.userId === 'alice')!;
            expect(alice.eligible).to.equal(false);
            expect(reasonsOfKind(alice.reasons, 'rejectedPreviously')).to.have.length(1);
        });

        it('reports assignment-level user vetoes', async function () {
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100, vetoedUsers: ['alice'] });

            const explanation = await matcher.explainMatch('a1');
            const alice = explanation.candidates.find((c) => c.userId === 'alice')!;
            expect(alice.eligible).to.equal(false);
            expect(reasonsOfKind(alice.reasons, 'assignmentVeto')).to.have.length(1);
        });

        it('reports full backlogs while still scoring the candidate', async function () {
            const smallMatcher = new Matcher(redisClient, {
                redisPrefix: 'explain_backlog_test:',
                maxUserBacklogSize: 1,
            });
            await smallMatcher.waitUntilReady();
            await smallMatcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
            await smallMatcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
            await smallMatcher.matchUsersAssignments();
            await smallMatcher.addAssignment({ id: 'a2', tags: ['english'], priority: 90 });

            const explanation = await smallMatcher.explainMatch('a2');
            const alice = explanation.candidates.find((c) => c.userId === 'alice')!;
            expect(alice.eligible).to.equal(false);
            const backlogReasons = reasonsOfKind(alice.reasons, 'backlogFull');
            expect(backlogReasons).to.have.length(1);
            expect((backlogReasons[0] as any).limit).to.equal(1);
            // Still scored despite being ineligible: english 100 + default tag 1
            expect(alice.score).to.equal(101);
        });

        it('reports CIDR mismatches', async function () {
            await matcher.addUser({ id: 'inside', tags: ['support'], ip: '10.0.0.5' });
            await matcher.addUser({ id: 'outside', tags: ['support'], ip: '192.168.1.5' });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['support'],
                priority: 100,
                allowedCidrs: ['10.0.0.0/8'],
            });

            const explanation = await matcher.explainMatch('a1');
            const outside = explanation.candidates.find((c) => c.userId === 'outside')!;
            expect(outside.eligible).to.equal(false);
            expect(reasonsOfKind(outside.reasons, 'cidrMismatch')).to.have.length(1);
            const inside = explanation.candidates.find((c) => c.userId === 'inside')!;
            expect(inside.eligible).to.equal(true);
        });

        it('reports geo distance exclusions when geo matching is enabled', async function () {
            const geoMatcher = new Matcher(redisClient, {
                redisPrefix: 'explain_geo_test:',
                enableGeoMatching: true,
            });
            await geoMatcher.waitUntilReady();
            // Tallinn agent, Lisbon assignment with a 100 km radius
            await geoMatcher.addUser({ id: 'far', tags: ['support'], latitude: 59.437, longitude: 24.7536 });
            await geoMatcher.addAssignment({
                id: 'a1',
                tags: ['support'],
                priority: 100,
                latitude: 38.7223,
                longitude: -9.1393,
                maxDistanceKm: 100,
            });

            const explanation = await geoMatcher.explainMatch('a1');
            const far = explanation.candidates.find((c) => c.userId === 'far')!;
            expect(far.eligible).to.equal(false);
            const geoReasons = reasonsOfKind(far.reasons, 'geoDistance');
            expect(geoReasons).to.have.length(1);
            expect((geoReasons[0] as any).withinRange).to.equal(false);
            expect((geoReasons[0] as any).distanceKm).to.be.greaterThan(100);
        });

        it('explains unweighted tag-overlap candidates', async function () {
            await matcher.addUser({ id: 'alice', tags: ['support', 'billing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });

            const explanation = await matcher.explainMatch('a1');
            const alice = explanation.candidates.find((c) => c.userId === 'alice')!;
            expect(alice.eligible).to.equal(true);
            expect(reasonsOfKind(alice.reasons, 'tagOverlap')).to.have.length(1);
        });

        it('returns not_found for unknown assignments', async function () {
            const explanation = await matcher.explainMatch('missing');
            expect(explanation.status).to.equal('not_found');
            expect(explanation.candidates).to.deep.equal([]);
        });

        it('restricts evaluation to the given userIds', async function () {
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addUser({ id: 'bob', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });

            const explanation = await matcher.explainMatch('a1', { userIds: ['bob'] });
            expect(explanation.candidates.map((c) => c.userId)).to.deep.equal(['bob']);
        });
    });

    describe('live decision traces', function () {
        it('records nothing when disabled (default)', async function () {
            const matcher = new Matcher(redisClient, { redisPrefix: 'trace_off_test:' });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.matchUsersAssignments();

            expect(matcher.isDecisionTracesEnabled()).to.equal(false);
            const traces = await matcher.getDecisionTraces();
            expect(traces).to.deep.equal([]);
        });

        it('records a trace per matched assignment in bulk first-come matching', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_fc_test:',
                enableDecisionTraces: true,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
            await matcher.addUser({ id: 'bob', tags: [], routingWeights: { english: 80 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces();
            expect(traces).to.have.length(1);
            const trace = traces[0];
            expect(trace.assignmentId).to.equal('a1');
            expect(trace.mode).to.equal('first-come');
            expect(['alice', 'bob']).to.include(trace.chosenUserId);
            // The winner is always a candidate; the loser appears too unless the
            // winner's claim landed before the loser's snapshot read (racy by design
            // in first-come mode — the fair path asserts full candidate lists).
            expect(trace.candidates[0].chosen).to.equal(true);
            expect(trace.candidates[0].userId).to.equal(trace.chosenUserId);
            expect(trace.candidates.map((c) => c.userId)).to.include(trace.chosenUserId);
        });

        it('includes hard-vetoed users struck out even though they were prefiltered', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_veto_test:',
                enableDecisionTraces: true,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: [], routingWeights: { english: 100 } });
            await matcher.addUser({ id: 'bob', tags: [], routingWeights: { english: 80, german: 0 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english', 'german'], priority: 100 });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces({ assignmentId: 'a1' });
            expect(traces).to.have.length(1);
            const trace = traces[0];
            expect(trace.chosenUserId).to.equal('alice');

            const bob = trace.candidates.find((c) => c.userId === 'bob');
            expect(bob, 'vetoed candidate should appear in the trace').to.not.equal(undefined);
            expect(bob!.eligible).to.equal(false);
            const vetoes = reasonsOfKind(bob!.reasons, 'veto');
            expect(vetoes).to.have.length(1);
            expect((vetoes[0] as any).tag).to.equal('german');
        });

        it('records best-match traces where the higher scorer wins deterministically', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_fair_test:',
                enableDecisionTraces: true,
                fairness: 'best-match',
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'strong', tags: [], routingWeights: { english: 100 } });
            await matcher.addUser({ id: 'weak', tags: [], routingWeights: { english: 10 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces({ assignmentId: 'a1' });
            expect(traces).to.have.length(1);
            expect(traces[0].mode).to.equal('best-match');
            expect(traces[0].chosenUserId).to.equal('strong');
            // Fair-path discovery is read-only before any claim, so both
            // evaluations are always captured.
            expect(traces[0].candidates.map((c) => c.userId).sort()).to.deep.equal(['strong', 'weak']);
            const weak = traces[0].candidates.find((c) => c.userId === 'weak')!;
            expect(weak.eligible).to.equal(true);
            expect(weak.chosen).to.equal(false);
        });

        it('records direct traces for single-user matching', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_direct_test:',
                enableDecisionTraces: true,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.matchUsersAssignments('alice');

            const traces = await matcher.getDecisionTraces();
            expect(traces).to.have.length(1);
            expect(traces[0].mode).to.equal('direct');
            expect(traces[0].chosenUserId).to.equal('alice');
        });

        it('invokes the onMatchDecision callback for each trace', async function () {
            const received: MatchDecisionTrace[] = [];
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_cb_test:',
                enableDecisionTraces: true,
                onMatchDecision: (trace) => received.push(trace),
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.addAssignment({ id: 'a2', tags: ['support'], priority: 90 });
            await matcher.matchUsersAssignments();

            expect(received).to.have.length(2);
            expect(received.map((t) => t.assignmentId).sort()).to.deep.equal(['a1', 'a2']);
        });

        it('streams to the callback without persisting when only onMatchDecision is set', async function () {
            const received: MatchDecisionTrace[] = [];
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_cb_only_test:',
                onMatchDecision: (trace) => received.push(trace),
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.matchUsersAssignments();

            expect(received).to.have.length(1);
            const traces = await matcher.getDecisionTraces();
            expect(traces).to.deep.equal([]);
        });

        it('filters traces by assignmentId and userId and respects limit', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_filter_test:',
                enableDecisionTraces: true,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.addAssignment({ id: 'a2', tags: ['support'], priority: 90 });
            await matcher.addAssignment({ id: 'a3', tags: ['support'], priority: 80 });
            await matcher.matchUsersAssignments();

            const all = await matcher.getDecisionTraces();
            expect(all).to.have.length(3);
            // Newest first
            expect(all[0].matchedAt).to.be.at.least(all[all.length - 1].matchedAt);

            const one = await matcher.getDecisionTraces({ assignmentId: 'a2' });
            expect(one).to.have.length(1);
            expect(one[0].assignmentId).to.equal('a2');

            const byUser = await matcher.getDecisionTraces({ userId: 'alice' });
            expect(byUser).to.have.length(3);

            const limited = await matcher.getDecisionTraces({ limit: 2 });
            expect(limited).to.have.length(2);
        });

        it('clearDecisionTraces removes stored traces', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_clear_test:',
                enableDecisionTraces: true,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.matchUsersAssignments();

            expect(await matcher.getDecisionTraces()).to.have.length(1);
            await matcher.clearDecisionTraces();
            expect(await matcher.getDecisionTraces()).to.deep.equal([]);
        });

        it('can be toggled at runtime', async function () {
            const matcher = new Matcher(redisClient, { redisPrefix: 'trace_toggle_test:' });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            await matcher.addAssignment({ id: 'a1', tags: ['support'], priority: 100 });
            await matcher.matchUsersAssignments();
            expect(await matcher.getDecisionTraces()).to.deep.equal([]);

            matcher.setDecisionTraces(true);
            expect(matcher.isDecisionTracesEnabled()).to.equal(true);
            await matcher.addAssignment({ id: 'a2', tags: ['support'], priority: 90 });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces();
            expect(traces).to.have.length(1);
            expect(traces[0].assignmentId).to.equal('a2');
        });

        it('caps stored candidates per trace at decisionTraceMaxCandidates', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_cap_test:',
                enableDecisionTraces: true,
                decisionTraceMaxCandidates: 2,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'u1', tags: [], routingWeights: { english: 100 } });
            await matcher.addUser({ id: 'u2', tags: [], routingWeights: { english: 90 } });
            await matcher.addUser({ id: 'u3', tags: [], routingWeights: { english: 80 } });
            await matcher.addUser({ id: 'u4', tags: [], routingWeights: { english: 70 } });
            await matcher.addAssignment({ id: 'a1', tags: ['english'], priority: 100 });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces({ assignmentId: 'a1' });
            expect(traces).to.have.length(1);
            expect(traces[0].candidates.length).to.be.at.most(2);
            expect(traces[0].candidates[0].chosen).to.equal(true);
        });

        it('records exactly one workflow trace per targeted grant, without re-tracing on later passes', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_wf_test:',
                enableWorkflows: true,
                enableDecisionTraces: true,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({ id: 'alice', tags: ['support'] });
            // Workflow-created assignments carry targeting metadata and are
            // also tag-indexed — the trace must not double-record the grant
            // through both the workflow and the tag-scored path.
            await matcher.addAssignment({
                id: 'wfa1',
                tags: ['support'],
                priority: 500,
                _targetUserId: 'alice',
                _workflowInstanceId: 'inst-1',
            } as any);

            await matcher.matchUsersAssignments();
            let traces = await matcher.getDecisionTraces();
            expect(traces).to.have.length(1);
            expect(traces[0].mode).to.equal('workflow');
            expect(traces[0].chosenUserId).to.equal('alice');
            expect(reasonsOfKind(traces[0].candidates[0].reasons, 'workflowTargeted')).to.have.length(1);

            // Workflow assignments are re-granted idempotently on every pass;
            // only the first grant is a decision worth recording.
            await matcher.matchUsersAssignments();
            traces = await matcher.getDecisionTraces();
            expect(traces).to.have.length(1);
        });

        it('records geo proximity boosts as reasons', async function () {
            const matcher = new Matcher(redisClient, {
                redisPrefix: 'trace_geo_test:',
                enableDecisionTraces: true,
                enableGeoMatching: true,
                geoScoreWeight: 50,
            });
            await matcher.waitUntilReady();
            await matcher.addUser({
                id: 'near',
                tags: ['support'],
                latitude: 59.44,
                longitude: 24.75,
            });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['support'],
                priority: 100,
                latitude: 59.43,
                longitude: 24.75,
                maxDistanceKm: 50,
            });
            await matcher.matchUsersAssignments();

            const traces = await matcher.getDecisionTraces({ assignmentId: 'a1' });
            expect(traces).to.have.length(1);
            const near = traces[0].candidates.find((c) => c.userId === 'near')!;
            expect(reasonsOfKind(near.reasons, 'geoBoost')).to.have.length(1);
            expect(reasonsOfKind(near.reasons, 'geoDistance')).to.have.length(1);
        });
    });
});
