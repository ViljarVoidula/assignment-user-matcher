import Matcher from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';
import sinon from 'sinon';
import type { AssignmentLintIssue } from '../src/types/matcher';

describe('Assignment readiness checks (checkAssignmentReadiness)', function () {
    this.timeout(20000);
    let matcher: Matcher;
    let redisClient: any;
    const prefix = 'readiness_test:';

    before(async function () {
        redisClient = createClient({});
        await redisClient.connect();
        matcher = new Matcher(redisClient, {
            redisPrefix: prefix,
            maxUserBacklogSize: 10,
            relevantBatchSize: 50,
            matchExpirationMs: 60000,
            // Default matching (on by default) routes anything to anyone via
            // the injected 'default' tag — with it on, nothing is ever stuck.
            enableDefaultMatching: false,
        });
        await matcher.waitUntilReady();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
    });

    after(async function () {
        matcher.stopMaintenance();
        await redisClient.quit();
    });

    const codes = (issues: AssignmentLintIssue[]) => issues.map((issue) => issue.code);

    it('reports a healthy assignment as clean and eligible', async function () {
        await matcher.addUser({ id: 'u1', tags: ['support'] });

        const report = await matcher.checkAssignmentReadiness({ id: 'a1', tags: ['support'] });
        expect(report.issues).to.deep.equal([]);
        expect(report.eligibleUserCount).to.equal(1);
        expect(report.uncoveredTags).to.deep.equal([]);
    });

    it('detects tags no active user can serve', async function () {
        await matcher.addUser({ id: 'u1', tags: ['support'] });

        const report = await matcher.checkAssignmentReadiness({ id: 'a1', tags: ['support', 'billing'] });
        expect(report.uncoveredTags).to.deep.equal(['billing']);
        const uncovered = report.issues.filter((issue) => issue.code === 'tag-uncovered');
        expect(uncovered).to.have.length(1);
        expect(uncovered[0].tag).to.equal('billing');
        // One tag is still covered, so the assignment is winnable overall
        expect(report.eligibleUserCount).to.equal(1);
    });

    it('honors routing-weight coverage: wildcards cover, zero-weight vetoes do not', async function () {
        await matcher.addUser({ id: 'wild', tags: [], routingWeights: { 'lang:*': 5 } });
        await matcher.addUser({ id: 'vetoed', tags: [], routingWeights: { billing: 0, other: 1 } });

        const report = await matcher.checkAssignmentReadiness({ id: 'a1', tags: ['lang:en', 'billing'] });
        expect(report.uncoveredTags).to.deep.equal(['billing']);
    });

    it('does not count paused users as coverage', async function () {
        await matcher.addUser({ id: 'u1', tags: ['support'] });
        await matcher.pauseUser('u1');

        const report = await matcher.checkAssignmentReadiness({ id: 'a1', tags: ['support'] });
        expect(report.uncoveredTags).to.deep.equal(['support']);
        expect(report.eligibleUserCount).to.equal(0);
        expect(codes(report.issues)).to.include('no-eligible-users');
    });

    it('flags an id that already exists (re-adding keeps the original clocks)', async function () {
        await matcher.addUser({ id: 'u1', tags: ['t'] });
        await matcher.addAssignment({ id: 'a1', tags: ['t'] });

        const report = await matcher.checkAssignmentReadiness({ id: 'a1', tags: ['t'] });
        const duplicate = report.issues.find((issue) => issue.code === 'duplicate-id');
        expect(duplicate).to.exist;
        expect(duplicate!.message).to.match(/queued/);
    });

    it('folds schedule conflicts from the pure lint into the report', async function () {
        await matcher.addUser({ id: 'u1', tags: ['t'] });

        const report = await matcher.checkAssignmentReadiness({
            id: 'a1',
            tags: ['t'],
            schedule: { notBefore: Date.now() + 10000, notAfter: Date.now() + 5000 },
        });
        expect(codes(report.issues)).to.include('schedule-window-inverted');
    });

    it('respects hard constraints in the eligibility count', async function () {
        await matcher.addUser({ id: 'strong', tags: [], routingWeights: { billing: 60 } });
        await matcher.addUser({ id: 'weak', tags: [], routingWeights: { billing: 10 } });

        const report = await matcher.checkAssignmentReadiness({
            id: 'a1',
            tags: ['billing'],
            skillThresholds: { billing: 50 },
        });
        expect(report.eligibleUserCount).to.equal(1);
        // Coverage is about the tag itself, not the thresholds
        expect(report.uncoveredTags).to.deep.equal([]);
    });

    describe('auditQueue (queue-wide stuck analysis)', function () {
        let clock: sinon.SinonFakeTimers;

        beforeEach(function () {
            clock = sinon.useFakeTimers({ now: Date.now(), toFake: ['Date'] });
        });

        afterEach(function () {
            clock.restore();
        });

        it('surfaces queued work nobody can take, with the why', async function () {
            await matcher.addUser({ id: 'u1', tags: ['support'] });
            await matcher.addAssignment({ id: 'stuck', tags: ['billing'] });
            await matcher.addAssignment({ id: 'fine', tags: ['support'] });

            clock.tick(5000);
            const report = await matcher.auditQueue();

            expect(report.scanned).to.equal(2);
            expect(report.entries).to.have.length(1);
            const entry = report.entries[0];
            expect(entry.assignmentId).to.equal('stuck');
            expect(entry.eligibleUserCount).to.equal(0);
            expect(entry.uncoveredTags).to.deep.equal(['billing']);
            expect(entry.blockers.noTagMatch).to.equal(1);
            expect(entry.waitingMs).to.be.at.least(5000);
        });

        it('includes healthy entries only on request', async function () {
            await matcher.addUser({ id: 'u1', tags: ['support'] });
            await matcher.addAssignment({ id: 'fine', tags: ['support'] });

            expect((await matcher.auditQueue()).entries).to.have.length(0);

            const verbose = await matcher.auditQueue({ includeHealthy: true });
            expect(verbose.entries).to.have.length(1);
            expect(verbose.entries[0].eligibleUserCount).to.equal(1);
        });

        it('tallies paused users and prior rejections as blockers', async function () {
            await matcher.addUser({ id: 'quitter', tags: ['t'] });
            await matcher.addAssignment({ id: 'a1', tags: ['t'] });
            await matcher.matchUsersAssignments();
            await matcher.rejectAssignment('quitter', 'a1');

            await matcher.addUser({ id: 'resting', tags: ['t'] });
            await matcher.pauseUser('resting');

            const report = await matcher.auditQueue();
            const entry = report.entries.find((e) => e.assignmentId === 'a1');
            expect(entry).to.exist;
            expect(entry!.blockers.rejectedPreviously).to.equal(1);
            expect(entry!.blockers.paused).to.equal(1);
        });

        it('skips young assignments when minWaitingMs is set', async function () {
            await matcher.addAssignment({ id: 'young', tags: ['nobody'] });

            const report = await matcher.auditQueue({ minWaitingMs: 60000 });
            expect(report.scanned).to.equal(0);

            clock.tick(60001);
            const later = await matcher.auditQueue({ minWaitingMs: 60000 });
            expect(later.scanned).to.equal(1);
        });

        it('reports past-due clocks nothing has swept', async function () {
            await matcher.addUser({ id: 'u1', tags: ['t'] });
            // A held assignment whose activation is overdue
            await matcher.addAssignment({ id: 'held', tags: ['t'], schedule: { notBefore: Date.now() + 1000 } });
            // A pending assignment whose response deadline is overdue
            await matcher.addAssignment({ id: 'offered', tags: ['t'] });
            await matcher.matchUsersAssignments();

            clock.tick(70000); // past notBefore (1s) and matchExpirationMs (60s)
            const report = await matcher.auditQueue();
            expect(report.sweepBacklog.scheduleActivations).to.equal(1);
            expect(report.sweepBacklog.responseDeadlines).to.equal(1);

            // After a maintenance pass the backlog drains
            await matcher.runMaintenanceOnce();
            const after = await matcher.auditQueue();
            expect(after.sweepBacklog.scheduleActivations).to.equal(0);
            expect(after.sweepBacklog.responseDeadlines).to.equal(0);
        });
    });
});
