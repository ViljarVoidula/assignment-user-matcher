import { expect } from 'chai';
import AssignmentMatcher from '../src/matcher.class';
import { createClient } from 'redis';

describe('Assignment pagination and querying tests', () => {
    let matcher: AssignmentMatcher;
    let matcherNoDefault: AssignmentMatcher; // For tests that need isolated tag matching
    const redisUrl = 'redis://localhost:6379';
    const client = createClient({ url: redisUrl });

    before(async () => {
        await client.connect();
        matcher = new AssignmentMatcher(client, {
            redisPrefix: 'test-pagination:',
        });
        matcherNoDefault = new AssignmentMatcher(client, {
            redisPrefix: 'test-pagination-nodefault:',
            enableDefaultMatching: false,
        });
    });

    after(async () => {
        await client.flushAll();
        await client.disconnect();
    });

    beforeEach(async () => {
        await client.flushAll();
    });

    describe('getAllAssignments', () => {
        it('should return queued assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.have.lengthOf(1);
            expect(assignments[0].id).to.equal('a1');
        });

        it('should return pending (matched) assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments(); // Moves a1 to pending
            
            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.have.lengthOf(1);
            expect(assignments[0].id).to.equal('a1');
        });

        it('should return accepted assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            await matcher.acceptAssignment('u1', 'a1'); // Moves a1 to accepted
            
            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.have.lengthOf(1);
            expect(assignments[0].id).to.equal('a1');
        });

        it('should return assignments from all statuses combined', async () => {
            await matcher.addAssignment({ id: 'queued', tags: ['t1'] });
            
            await matcher.addAssignment({ id: 'pending', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            
            await matcher.addAssignment({ id: 'accepted', tags: ['t1'] });
            await matcher.addUser({ id: 'u2', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            // Note: matchUsersAssignments() might pick up 'accepted' or 'pending' depending on timing, 
            // but we want to ensure one is accepted.
            await matcher.acceptAssignment('u2', 'accepted');

            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.have.lengthOf(3);
            const ids = assignments.map((a: any) => a.id);
            expect(ids).to.include('queued');
            expect(ids).to.include('pending');
            expect(ids).to.include('accepted');
        });
    });

    describe('getAssignmentCounts', () => {
        it('should return zero counts when no assignments exist', async () => {
            const counts = await matcher.getAssignmentCounts();
            expect(counts).to.deep.equal({ queued: 0, pending: 0, accepted: 0, total: 0 });
        });

        it('should return correct count for queued assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(1);
            expect(counts.total).to.equal(1);
        });

        it('should return correct count for pending assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            const counts = await matcher.getAssignmentCounts();
            expect(counts.pending).to.equal(1);
            expect(counts.total).to.equal(1);
        });

        it('should return correct count for accepted assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            await matcher.acceptAssignment('u1', 'a1');
            const counts = await matcher.getAssignmentCounts();
            expect(counts.accepted).to.equal(1);
            expect(counts.total).to.equal(1);
        });

        it('should return correct counts across all statuses', async () => {
            await matcherNoDefault.addAssignment({ id: 'q1', tags: ['queued-tag'] });
            await matcherNoDefault.addAssignment({ id: 'p1', tags: ['pending-tag'] });
            await matcherNoDefault.addAssignment({ id: 'a1', tags: ['accepted-tag'] });
            
            await matcherNoDefault.addUser({ id: 'u1', tags: ['pending-tag', 'accepted-tag'] });
            await matcherNoDefault.matchUsersAssignments('u1');
            
            await matcherNoDefault.acceptAssignment('u1', 'a1');

            const counts = await matcherNoDefault.getAssignmentCounts();
            expect(counts.queued).to.equal(1);
            expect(counts.pending).to.equal(1);
            expect(counts.accepted).to.equal(1);
            expect(counts.total).to.equal(3);
        });
    });

    describe('getAssignment', () => {
        it('should return null for non-existent assignment', async () => {
            const a = await matcher.getAssignment('none');
            expect(a).to.be.null;
        });

        it('should return queued assignment with status', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            const a = await matcher.getAssignment('a1');
            expect(a).to.not.be.null;
            expect(a?.id).to.equal('a1');
            expect((a as any)._status).to.equal('queued');
        });

        it('should return pending assignment with status', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments('u1');
            const a = await matcher.getAssignment('a1');
            expect(a).to.not.be.null;
            expect((a as any)._status).to.equal('pending');
        });

        it('should return accepted assignment with status', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');
            const a = await matcher.getAssignment('a1');
            expect(a).to.not.be.null;
            expect((a as any)._status).to.equal('accepted');
        });
    });

    describe('getAssignmentsByIds', () => {
        it('should return empty array for empty ids', async () => {
            const results = await matcher.getAssignmentsByIds([]);
            expect(results).to.have.lengthOf(0);
        });

        it('should return only found assignments', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            const results = await matcher.getAssignmentsByIds(['a1', 'none']);
            expect(results).to.have.lengthOf(1);
            expect(results[0].id).to.equal('a1');
        });

        it('should return assignments from different statuses', async () => {
            await matcherNoDefault.addAssignment({ id: 'q1', tags: ['q-tag'] });
            await matcherNoDefault.addAssignment({ id: 'p1', tags: ['p-tag'] });
            await matcherNoDefault.addUser({ id: 'u1', tags: ['p-tag'] });
            await matcherNoDefault.matchUsersAssignments('u1');
            
            const results = await matcherNoDefault.getAssignmentsByIds(['q1', 'p1']);
            expect(results).to.have.lengthOf(2);
            const statuses = results.map((r: any) => (r as any)._status);
            expect(statuses).to.include('queued');
            expect(statuses).to.include('pending');
        });
    });

    describe('getAssignmentsPaginated', () => {
        it('should return empty result when no assignments exist', async () => {
            const res = await matcher.getAssignmentsPaginated();
            expect(res.assignments).to.have.lengthOf(0);
            expect(res.nextCursor).to.be.null;
        });

        it('should return assignments with default limit', async () => {
            for (let i = 0; i < 5; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['t1'] });
            }
            const res = await matcher.getAssignmentsPaginated();
            expect(res.assignments).to.have.lengthOf(5);
        });

        it('should respect limit parameter', async () => {
            for (let i = 0; i < 10; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['t1'] });
            }
            const res = await matcher.getAssignmentsPaginated({ limit: 3 });
            expect(res.assignments).to.have.lengthOf(3);
            expect(res.nextCursor).to.not.be.null;
        });

        it('should paginate through all assignments', async () => {
            for (let i = 0; i < 10; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['t1'] });
            }
            
            let allFetched: any[] = [];
            let cursor: string | null = null;
            
            do {
                const res: { assignments: any[], nextCursor: string | null } = await matcher.getAssignmentsPaginated({ limit: 4, cursor: cursor || undefined });
                allFetched = allFetched.concat(res.assignments);
                cursor = res.nextCursor;
            } while (cursor);

            expect(allFetched).to.have.lengthOf(10);
        });

        it('should report hasMore when limit is 0', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });

            const res = await matcher.getAssignmentsPaginated({ limit: 0 });
            expect(res.assignments).to.have.lengthOf(0);
            expect(res.hasMore).to.equal(true);
            expect(res.nextCursor).to.equal('0:0');
        });

        it('should filter by queued status', async () => {
            await matcherNoDefault.addAssignment({ id: 'q1', tags: ['q-tag'] });
            await matcherNoDefault.addAssignment({ id: 'p1', tags: ['p-tag'] });
            await matcherNoDefault.addUser({ id: 'u1', tags: ['p-tag'] });
            await matcherNoDefault.matchUsersAssignments('u1');

            const res = await matcherNoDefault.getAssignmentsPaginated({ status: 'queued' });
            expect(res.assignments).to.have.lengthOf(1);
            expect(res.assignments[0].id).to.equal('q1');
        });

        it('should filter by pending status', async () => {
            await matcher.addAssignment({ id: 'p1', tags: ['p-tag'] });
            await matcher.addUser({ id: 'u1', tags: ['p-tag'] });
            await matcher.matchUsersAssignments('u1');

            const res = await matcher.getAssignmentsPaginated({ status: 'pending' });
            expect(res.assignments).to.have.lengthOf(1);
            expect(res.assignments[0].id).to.equal('p1');
        });

        it('should filter by accepted status', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['a-tag'] });
            await matcher.addUser({ id: 'u1', tags: ['a-tag'] });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            const res = await matcher.getAssignmentsPaginated({ status: 'accepted' });
            expect(res.assignments).to.have.lengthOf(1);
            expect(res.assignments[0].id).to.equal('a1');
        });

        it('should include total when requested', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            const res = await matcher.getAssignmentsPaginated({ includeTotal: true });
            expect(res.total).to.equal(1);
        });

        it('should include total for specific status', async () => {
            await matcherNoDefault.addAssignment({ id: 'q1', tags: ['q-tag'] });
            await matcherNoDefault.addAssignment({ id: 'p1', tags: ['p-tag'] });
            await matcherNoDefault.addUser({ id: 'u1', tags: ['p-tag'] });
            await matcherNoDefault.matchUsersAssignments('u1');

            const res = await matcherNoDefault.getAssignmentsPaginated({ status: 'queued', includeTotal: true });
            expect(res.total).to.equal(1);
        });

        it('should paginate across multiple statuses with status=all', async () => {
            await matcher.addAssignment({ id: 'q1', tags: ['t1'] });
            await matcher.addAssignment({ id: 'p1', tags: ['t1'] });
            await matcher.addUser({ id: 'u1', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            await matcher.addUser({ id: 'u2', tags: ['t1'] });
            await matcher.matchUsersAssignments();
            await matcher.acceptAssignment('u2', 'a1');

            // We have 1 in each state
            const res1 = await matcher.getAssignmentsPaginated({ status: 'all', limit: 2 });
            expect(res1.assignments).to.have.lengthOf(2);
            expect(res1.nextCursor).to.not.be.null;

            const res2 = await matcher.getAssignmentsPaginated({ status: 'all', limit: 2, cursor: res1.nextCursor! });
            expect(res2.assignments).to.have.lengthOf(1);
            expect(res2.nextCursor).to.be.null;
        });

        it('should add _status property to each assignment', async () => {
            await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
            const res = await matcher.getAssignmentsPaginated();
            expect((res.assignments[0] as any)._status).to.equal('queued');
        });
    });

    describe('Large dataset pagination performance', () => {
        it('should handle pagination with many assignments efficiently', async () => {
            const count = 1000; // Using 1000 for test speed, but logic is same for 100k
            const multi = client.multi();
            for (let i = 0; i < count; i++) {
                const id = `large_${i}`;
                multi.hSet(`test-pagination:assignments:ref`, id, JSON.stringify({ id, tags: ['large'] }));
            }
            await multi.exec();

            const start = Date.now();
            const res = await matcher.getAssignmentsPaginated({ limit: 100 });
            const end = Date.now();

            expect(res.assignments).to.have.lengthOf(100);
            expect(end - start).to.be.below(500); // Should be very fast
        });
    });
});
