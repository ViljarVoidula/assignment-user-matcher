import { expect } from 'chai';
import AssignmentMatcher from '../src/matcher.class';
import sinon from 'sinon';
import { createTestClient } from './helpers/redis';
import type { AssignmentLifecycleEvent } from '../src/types/matcher';

/**
 * Editing a task after it has been created — and, more to the point, after it
 * has been handed to somebody.
 *
 * The rule under test throughout: a retag is a change to who *should* have the
 * work, so the engine re-checks the current holder against the new tags and
 * takes the task back when they no longer match. An edit that does not touch
 * the tags must never move anything — a typo fixed in a title is not a reason
 * to pull a job off the person doing it.
 */
describe('Task updates (updateAssignment)', function () {
    this.timeout(20000);
    let redisClient: any;
    let events: AssignmentLifecycleEvent[] = [];

    const PREFIX = 'test:update:';

    before(async function () {
        redisClient = createTestClient();
        await redisClient.connect();
    });

    after(async function () {
        await redisClient.flushDb();
        await redisClient.quit();
    });

    beforeEach(async function () {
        await redisClient.flushDb();
        events = [];
    });

    function createMatcher(options: Record<string, unknown> = {}) {
        return new AssignmentMatcher(redisClient, {
            redisPrefix: PREFIX,
            relevantBatchSize: 50,
            maxUserBacklogSize: 5,
            matchExpirationMs: 60000,
            // Off by default here so the tests can say something about tags.
            // With default matching on, every worker is eligible for every
            // task through the shared `default` tag, so no retag could ever
            // make somebody ineligible — a property pinned by its own test
            // below rather than accidentally assumed by all of them.
            enableDefaultMatching: false,
            onAssignmentLifecycle: (event) => events.push(event),
            ...options,
        });
    }

    const tagKey = (tag: string) => `${PREFIX}tag:${tag}:assignments`;
    const refKey = `${PREFIX}assignments:ref`;
    const pendingKey = `${PREFIX}assignments:pending:data`;
    const acceptedKey = `${PREFIX}assignments:accepted`;
    const ownerKey = `${PREFIX}assignments:pending:owner`;

    describe('a queued task', function () {
        it('moves between per-tag indexes when its tags change', async function () {
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });

            const result = await matcher.updateAssignment('a1', { tags: ['electrical', 'urgent'] });

            expect(result).to.not.equal(null);
            expect(result!.status).to.equal('queued');
            expect(result!.tags).to.deep.equal(['electrical', 'urgent']);
            expect(result!.requeued).to.equal(false);

            expect(await redisClient.zScore(tagKey('plumbing'), 'a1')).to.equal(null);
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(50);
            expect(await redisClient.zScore(tagKey('urgent'), 'a1')).to.equal(50);

            // The stored record and the tags hash the matching path reads
            expect(JSON.parse(await redisClient.hGet(refKey, 'a1')).tags).to.deep.equal(['electrical', 'urgent']);
            expect(await redisClient.hGet(`${PREFIX}assignment:a1:tags`, 'tags')).to.equal('electrical,urgent');
        });

        it('becomes matchable to a worker the old tags never reached', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'sparky', tags: ['electrical'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });

            await matcher.matchUsersAssignments('sparky');
            expect(await matcher.getCurrentAssignmentsForUser('sparky')).to.deep.equal([]);

            await matcher.updateAssignment('a1', { tags: ['electrical'] });

            await matcher.matchUsersAssignments('sparky');
            expect(await matcher.getCurrentAssignmentsForUser('sparky')).to.deep.equal(['a1']);
        });

        it('keeps the default tag index when default matching is on', async function () {
            const matcher = createMatcher({ enableDefaultMatching: true });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(await redisClient.zScore(tagKey('default'), 'a1')).to.equal(50);
            expect(await redisClient.hGet(`${PREFIX}assignment:a1:tags`, 'tags')).to.equal('electrical,default');
        });

        it('rescores every index when the patch also changes priority', async function () {
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });

            await matcher.updateAssignment('a1', { tags: ['electrical'], priority: 900 });

            expect(await redisClient.zScore(`${PREFIX}assignments`, 'a1')).to.equal(900);
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(900);
            expect(await redisClient.hGet(`${PREFIX}assignment:a1:priority`, 'priority')).to.equal('900');
        });

        it('edits the title and meta without touching any index', async function () {
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50, title: 'Leaky tap' });

            const result = await matcher.updateAssignment('a1', {
                title: 'Leaking kitchen tap',
                meta: { ref: 'JOB-12' },
            });

            expect(result!.tags).to.deep.equal(['plumbing']);
            const stored = JSON.parse(await redisClient.hGet(refKey, 'a1'));
            expect(stored.title).to.equal('Leaking kitchen tap');
            expect(stored.meta).to.deep.equal({ ref: 'JOB-12' });
            expect(await redisClient.zScore(tagKey('plumbing'), 'a1')).to.equal(50);
        });

        it('trims and de-duplicates tags, and leaves their case alone', async function () {
            // Creation indexes tags verbatim and matching compares them
            // exactly, so an edit that folded case would be inventing a second
            // tag universe that only edits enter.
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });

            const result = await matcher.updateAssignment('a1', { tags: ['  Electrical ', 'Electrical', 'urgent'] });

            expect(result!.tags).to.deep.equal(['Electrical', 'urgent']);
            expect(await redisClient.zScore(tagKey('Electrical'), 'a1')).to.equal(50);
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(null);
        });

        it('does not treat a re-stated tag as a change just because of its case', async function () {
            // The holder's tags are stored verbatim too, so lowercasing the
            // patch would score them against a tag they do not carry and take
            // the work off them for an edit that changed nothing.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['Plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['Plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['Plumbing'], title: 'Leaking tap' });

            expect(result!.requeued).to.equal(false);
            expect(result!.status).to.equal('pending');
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
        });

        it('keeps a priority the engine derived when the patch does not mention one', async function () {
            // `addAssignment` without a priority derives one (queue age by
            // default, or the caller's prioritizationFunction) and writes it to
            // the indexes but not into the stored JSON. An edit that reads the
            // priority back off the record therefore finds nothing, and must
            // not take that for zero.
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], createdAt: Date.now() - 60_000 });
            const before = await redisClient.zScore(`${PREFIX}assignments`, 'a1');
            expect(before).to.be.greaterThan(0);

            await matcher.updateAssignment('a1', { title: 'Leaking kitchen tap' });

            expect(await redisClient.zScore(`${PREFIX}assignments`, 'a1')).to.equal(before);
            expect(await redisClient.zScore(tagKey('plumbing'), 'a1')).to.equal(before);
            expect(await redisClient.hGet(`${PREFIX}assignment:a1:priority`, 'priority')).to.equal(String(before));
        });

        it('refuses to leave a task with no tags', async function () {
            const matcher = createMatcher();
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            let threw = false;
            try {
                await matcher.updateAssignment('a1', { tags: [] });
            } catch (error: any) {
                threw = true;
                expect(error.message).to.include('at least one tag');
            }
            expect(threw).to.equal(true);
        });

        it('returns null for a task that does not exist', async function () {
            const matcher = createMatcher();
            expect(await matcher.updateAssignment('nope', { title: 'x' })).to.equal(null);
        });
    });

    describe('a pending task', function () {
        it('keeps its owner when the new tags still match them', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing', 'electrical'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(result!.status).to.equal('pending');
            expect(result!.requeued).to.equal(false);
            expect(result!.previousOwnerId).to.equal('u1');
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
            expect(JSON.parse(await redisClient.hGet(pendingKey, 'a1')).tags).to.deep.equal(['electrical']);
        });

        it('goes back to the queue when the new tags no longer reach its owner', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(result!.status).to.equal('queued');
            expect(result!.requeued).to.equal(true);
            expect(result!.previousOwnerId).to.equal('u1');

            // Off the worker, back in the open pool under the new tag
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal(null);
            expect(await redisClient.hGet(pendingKey, 'a1')).to.equal(null);
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(50);
            expect(JSON.parse(await redisClient.hGet(refKey, 'a1')).tags).to.deep.equal(['electrical']);

            const released = events.filter((e) => e.kind === 'released');
            expect(released).to.have.length(1);
            expect((released[0] as any).reason).to.equal('retagged');
        });

        it('rematches to a worker the new tags do reach', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'plumber', tags: ['plumbing'] });
            await matcher.addUser({ id: 'sparky', tags: ['electrical'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'plumber');

            await matcher.updateAssignment('a1', { tags: ['electrical'] });
            await matcher.matchUsersAssignments();

            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('sparky');
        });

        it('never redistributes for an edit that leaves the tags alone', async function () {
            const matcher = createMatcher();
            // Owner holds the task through a direct assign, so the tag model
            // would not pick them — exactly the case a stray eligibility check
            // would confiscate.
            await matcher.addUser({ id: 'u1', tags: ['other'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { title: 'Renamed' });

            expect(result!.status).to.equal('pending');
            expect(result!.requeued).to.equal(false);
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
            expect(JSON.parse(await redisClient.hGet(pendingKey, 'a1')).title).to.equal('Renamed');
        });

        it('treats a re-stated identical tag set as no change at all', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['other'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['plumbing'], title: 'Renamed' });

            expect(result!.requeued).to.equal(false);
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
        });

        it('keeps its owner under default matching, where every tag reaches everyone', async function () {
            const matcher = createMatcher({ enableDefaultMatching: true });
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            // The shared `default` tag still matches them, so the engine would
            // still offer them this task — nothing to redistribute.
            expect(result!.requeued).to.equal(false);
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
        });

        it('takes the task off an owner the new tags hard-veto', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'], routingWeights: { plumbing: 10, electrical: 0 } });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['plumbing', 'electrical'] });

            expect(result!.requeued).to.equal(true);
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal(null);
        });
    });

    describe('an accepted task', function () {
        it('keeps its owner when the new tags still match them', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing', 'electrical'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(result!.status).to.equal('accepted');
            expect(result!.requeued).to.equal(false);
            expect(JSON.parse(await redisClient.hGet(acceptedKey, 'a1')).tags).to.deep.equal(['electrical']);
        });

        it('is pulled back off the worker when the new tags no longer reach them', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(result!.status).to.equal('queued');
            expect(result!.requeued).to.equal(true);
            expect(result!.previousOwnerId).to.equal('u1');

            expect(await redisClient.hGet(acceptedKey, 'a1')).to.equal(null);
            expect(await redisClient.zScore(`${PREFIX}user:u1:accepted`, 'a1')).to.equal(null);
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(50);

            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted).to.equal(0);
            expect(counts.queued).to.equal(1);
        });

        it('clears the completion deadline it was carrying', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['plumbing'],
                priority: 50,
                sla: { completeWithinMs: 3_600_000 },
            });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');
            expect(await redisClient.zScore(`${PREFIX}assignments:accepted:expiry`, 'a1')).to.not.equal(null);

            await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(await redisClient.zScore(`${PREFIX}assignments:accepted:expiry`, 'a1')).to.equal(null);
        });
    });

    describe('shelved tasks', function () {
        it('edits a scheduled task in place without enqueueing it', async function () {
            const matcher = createMatcher();
            await matcher.addAssignment({
                id: 'a1',
                tags: ['plumbing'],
                priority: 50,
                schedule: { notBefore: Date.now() + 3_600_000 },
            });

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'], title: 'Later' });

            expect(result!.status).to.equal('scheduled');
            expect(result!.requeued).to.equal(false);
            const held = JSON.parse(await redisClient.hGet(`${PREFIX}assignments:scheduled`, 'a1'));
            expect(held.tags).to.deep.equal(['electrical']);
            expect(held.title).to.equal('Later');
            // Still invisible to matching — no queue indexes were created
            expect(await redisClient.hGet(refKey, 'a1')).to.equal(null);
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(null);
        });

        it('edits a parked task in place and unparks with the new tags', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['plumbing'],
                priority: 50,
                escalation: { respondWithinMs: 1, onNoResponse: 'block', maxEscalations: 0, onExhausted: 'park' },
            });
            await matcher.matchUsersAssignments();
            await new Promise((resolve) => setTimeout(resolve, 20));
            expect((await matcher.processResponseDeadlines()).parked).to.equal(1);

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });
            expect(result!.status).to.equal('parked');
            expect(await redisClient.hGet(refKey, 'a1')).to.equal(null);

            await matcher.unparkAssignment('a1');
            expect(await redisClient.zScore(tagKey('electrical'), 'a1')).to.equal(50);
            expect(await redisClient.zScore(tagKey('plumbing'), 'a1')).to.equal(null);
        });
    });

    describe('reassigning accepted work (assignToUser)', function () {
        it('moves an accepted task to a new worker as a fresh offer', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const { previousOwnerId } = await matcher.assignToUser('a1', 'u2');

            expect(previousOwnerId).to.equal('u1');
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u2');
            expect(await matcher.getCurrentAssignmentsForUser('u2')).to.deep.equal(['a1']);

            // The first worker holds nothing any more, in either index
            expect(await matcher.getCurrentAssignmentsForUser('u1')).to.deep.equal([]);
            expect(await redisClient.zScore(`${PREFIX}user:u1:accepted`, 'a1')).to.equal(null);

            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted).to.equal(0);
            expect(counts.pending).to.equal(1);
        });

        it('restarts the response clock so the new worker has to answer', async function () {
            const matcher = createMatcher({ matchExpirationMs: 60000 });
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const before = Date.now();
            await matcher.assignToUser('a1', 'u2');

            const expiry = await redisClient.zScore(`${PREFIX}assignments:pending:expiry`, 'a1');
            expect(expiry).to.be.at.least(before + 59000);

            const pending = events.filter((e) => e.kind === 'pending' && e.workerId === 'u2');
            expect(pending).to.have.length(1);
        });

        it('drops the completion deadline the first worker was under', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['plumbing'],
                priority: 50,
                sla: { completeWithinMs: 3_600_000 },
            });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            await matcher.assignToUser('a1', 'u2');

            expect(await redisClient.zScore(`${PREFIX}assignments:accepted:expiry`, 'a1')).to.equal(null);
            const pendingJson = await redisClient.hGet(pendingKey, 'a1');
            expect(JSON.parse(pendingJson)._acceptedBy).to.equal(undefined);
        });

        it('tells the previous holder the work is no longer theirs', async function () {
            // Nothing else names them: the hand-over emits a `pending` event for
            // the new worker, so without this the person who was doing the job
            // is never told it moved, and anything mirroring their accepted
            // work keeps showing it.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');
            events = [];

            await matcher.assignToUser('a1', 'u2');

            const released = events.filter((e) => e.kind === 'released');
            expect(released).to.have.length(1);
            expect((released[0] as any).workerId).to.equal('u1');
            expect((released[0] as any).reason).to.equal('reassigned');
        });

        it('is a no-op when the accepted task is already that worker’s', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const { previousOwnerId } = await matcher.assignToUser('a1', 'u1');

            expect(previousOwnerId).to.equal('u1');
            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted).to.equal(1);
            expect(counts.pending).to.equal(0);
        });
    });

    describe('edits that race the lifecycle', function () {
        it('does not requeue a task the holder accepted while the edit was in flight', async function () {
            // The locate read found this task pending; by the time the reclaim
            // runs the worker has accepted it. The pending HDEL then removes
            // nothing, and requeueing anyway would leave one task in the open
            // pool and in the accepted store at the same time.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const original = redisClient.sIsMember.bind(redisClient);
            const stub = sinon.stub(redisClient, 'sIsMember').callsFake(async (...args: any[]) => {
                stub.restore();
                await matcher.acceptAssignment('u1', 'a1');
                return original(...args);
            });

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });
            stub.restore();

            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted + counts.queued).to.equal(1);
            expect(result!.requeued).to.equal(counts.queued === 1);
        });

        it('leaves no per-assignment tags hash behind for held work', async function () {
            // A claim deletes `assignment:<id>:tags`; nothing reads it for
            // pending or accepted work, and no terminal path deletes it again,
            // so re-creating it on an edit leaks one key per edited task.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing', 'electrical'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(await redisClient.exists(`${PREFIX}assignment:a1:tags`)).to.equal(0);
        });
    });

    describe('reassigning accepted work', function () {
        it('leaves a task with no SLA byte-identical in storage', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            const queuedJson = await redisClient.hGet(pendingKey, 'a1');
            await matcher.acceptAssignment('u1', 'a1');
            expect(await redisClient.hGet(acceptedKey, 'a1')).to.equal(queuedJson);

            await matcher.assignToUser('a1', 'u2');

            expect(await redisClient.hGet(pendingKey, 'a1')).to.equal(queuedJson);
        });

        it('finds the previous owner when the key prefix itself contains a user segment', async function () {
            // The owner is recovered from the per-user accepted index key, so a
            // prefix carrying its own `user` segment must not be mistaken for
            // the start of the worker id.
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: 'user:svc:',
                enableDefaultMatching: false,
                matchExpirationMs: 60000,
                onAssignmentLifecycle: (event) => events.push(event),
            });
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const { previousOwnerId } = await matcher.assignToUser('a1', 'u2');

            expect(previousOwnerId).to.equal('u1');
            expect(await redisClient.zScore('user:svc:user:u1:accepted', 'a1')).to.equal(null);
            expect(await redisClient.hGet('user:svc:assignments:pending:owner', 'a1')).to.equal('u2');
        });

        it('is still a no-op for the same worker when the key prefix contains a user segment', async function () {
            const matcher = new AssignmentMatcher(redisClient, {
                redisPrefix: 'user:svc:',
                enableDefaultMatching: false,
                matchExpirationMs: 60000,
            });
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const { previousOwnerId } = await matcher.assignToUser('a1', 'u1');

            expect(previousOwnerId).to.equal('u1');
            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted).to.equal(1);
            expect(counts.pending).to.equal(0);
        });
    });

    describe('who may lose work, and who may not', function () {
        it('leaves workflow-targeted work with its target, whatever the tags say', async function () {
            // A workflow names the person; tags do not route this task at all,
            // so a tag change cannot un-route it. Evicting the holder here
            // would be a round trip to nowhere — the targeted lookup grants it
            // straight back on the next pass, without ever reading a tag.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            const stored = JSON.parse(await redisClient.hGet(refKey, 'a1'));
            await redisClient.hSet(
                refKey,
                'a1',
                JSON.stringify({ ...stored, _workflowInstanceId: 'wf-1', _targetUserId: 'u1' }),
            );
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(result!.requeued).to.equal(false);
            expect(result!.status).to.equal('pending');
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
        });

        it('applies the same CIDR rule the matching pass applies', async function () {
            // The re-check has to be the judgement matching makes, not a subset
            // of it, or `explainMatch` and the retag disagree about the same
            // person on the same task.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing', 'electrical'], ip: '10.0.0.5' });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1', { force: true });

            await matcher.addAssignment({ id: 'probe', tags: ['electrical'], priority: 1 });
            const result = await matcher.updateAssignment('a1', {
                tags: ['electrical'],
            });
            expect(result!.requeued).to.equal(false);

            // Now the same edit on a task the holder's IP is shut out of
            await redisClient.hSet(
                pendingKey,
                'a1',
                JSON.stringify({
                    ...JSON.parse(await redisClient.hGet(pendingKey, 'a1')),
                    allowedCidrs: ['192.168.0.0/24'],
                }),
            );
            const shutOut = await matcher.updateAssignment('a1', { tags: ['plumbing'] });

            expect(shutOut!.requeued).to.equal(true);
        });

        it('asks the caller’s own matching function, not the built-in one', async function () {
            // With a custom scorer the built-in tag arithmetic is not what
            // decides anything, so it must not be what confiscates work.
            const matcher = createMatcher({
                enableDefaultMatching: false,
                matchingFunction: async (user: any, _tagsCsv: string, basePriority: number) => {
                    return [user.meta?.region === 'north' ? 1 : 0, basePriority] as [number, number];
                },
            });
            await matcher.addUser({ id: 'u1', tags: ['plumbing'], meta: { region: 'north' } } as any);
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });

            expect(result!.requeued).to.equal(false);
            expect(await redisClient.hGet(ownerKey, 'a1')).to.equal('u1');
        });
    });

    describe('clocks and counters after work changes hands', function () {
        it('does not resurrect an offer window the acceptance already closed', async function () {
            // `notAfter` says "somebody must take this by T". Somebody did. A
            // later retag puts the work back in the pool, and re-arming the
            // expired window would have the next sweep park or drop it as a
            // missed offer instead of rematching it.
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['plumbing'],
                priority: 50,
                schedule: { notAfter: Date.now() + 150, onMiss: 'drop' },
            });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            const result = await matcher.updateAssignment('a1', { tags: ['electrical'] });
            expect(result!.requeued).to.equal(true);

            await new Promise((resolve) => setTimeout(resolve, 250));
            await matcher.processScheduledAssignments();

            expect(await redisClient.hGet(refKey, 'a1')).to.not.equal(null);
            expect(events.filter((e) => e.kind === 'scheduleMissed')).to.have.length(0);
        });

        it('counts a re-offer of accepted SLA work as an offer, not a second free accept', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({
                id: 'a1',
                tags: ['plumbing'],
                priority: 50,
                sla: { completeWithinMs: 3_600_000 },
            });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');
            await matcher.assignToUser('a1', 'u2');
            await matcher.acceptAssignment('u2', 'a1');

            const stats = await matcher.getSlaStats();
            expect(stats.acceptedInTime).to.equal(2);
            expect(stats.offers).to.equal(2);
        });

        it('closes the previous holder’s learning attempt when a retag takes the work back', async function () {
            // A retag opens a second attempt on the same task. Feedback that
            // only names the assignment could mean either worker, so it must be
            // refused as ambiguous — which it can only be if the first attempt
            // was closed rather than left as the live one.
            const matcher = createMatcher({ enableLearning: true, learningExplorationRate: 0 });
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['electrical'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.matchUsersAssignments('u1');

            await matcher.updateAssignment('a1', { tags: ['electrical'] });
            await matcher.matchUsersAssignments('u2');

            const accepted = await matcher.recordLearningFeedback('a1', { quality: 1 });

            expect(accepted).to.equal(false);
            expect((await matcher.getLearningStats()).ambiguousFeedback).to.equal(1);
        });
    });

    describe('completing work that moved on', function () {
        it('refuses a completion from a worker who no longer holds the task', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addUser({ id: 'u2', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');
            await matcher.assignToUser('a1', 'u2');
            await matcher.acceptAssignment('u2', 'a1');

            let threw = false;
            try {
                await matcher.completeAssignment('u1', 'a1');
            } catch (error: any) {
                threw = true;
                expect(error.message).to.include('not held');
            }
            expect(threw).to.equal(true);
            expect(await redisClient.hGet(acceptedKey, 'a1')).to.not.equal(null);
            expect(await matcher.completeAssignment('u2', 'a1')).to.equal(true);
        });

        it('clears the accepted owner index when a task with no SLA is removed', async function () {
            const matcher = createMatcher();
            await matcher.addUser({ id: 'u1', tags: ['plumbing'] });
            await matcher.addAssignment({ id: 'a1', tags: ['plumbing'], priority: 50 });
            await matcher.assignToUser('a1', 'u1');
            await matcher.acceptAssignment('u1', 'a1');

            await matcher.removeAssignment('a1');

            expect(await redisClient.zScore(`${PREFIX}user:u1:accepted`, 'a1')).to.equal(null);
        });
    });
});
