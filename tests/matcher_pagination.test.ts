import Matcher, { Assignment } from '../src/matcher.class';
import { createClient } from 'redis';
import { expect } from 'chai';

describe('Assignment pagination and querying tests', function () {
    this.timeout(10000);
    let matcher: Matcher;
    let redisClient: any;

    before(async function () {
        redisClient = await createClient({});
        await redisClient.connect();
    });

    beforeEach(async function () {
        await redisClient.flushAll();
        matcher = new Matcher(redisClient, {
            maxUserBacklogSize: 10,
            relevantBatchSize: 50,
        });
    });

    after(async function () {
        await redisClient.flushAll();
        await redisClient.disconnect();
    });

    describe('getAllAssignments', function () {
        it('should return queued assignments', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });

            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.be.an('array');
            expect(assignments).to.have.lengthOf(2);
            expect(assignments.map(a => a.id)).to.include.members(['a1', 'a2']);
        });

        it('should return pending (matched) assignments', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });

            await matcher.matchUsersAssignments('u1');

            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.be.an('array');
            expect(assignments).to.have.lengthOf(1);
            expect(assignments[0].id).to.equal('a1');
        });

        it('should return accepted assignments', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.be.an('array');
            expect(assignments).to.have.lengthOf(1);
            expect(assignments[0].id).to.equal('a1');
        });

        it('should return assignments from all statuses combined', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1', 'tag2', 'tag3'] });
            
            // Add 3 assignments
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });
            await matcher.addAssignment({ id: 'a3', tags: ['tag3'], priority: 30 });

            // Match one, accept another
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            // Add one more to queue
            await matcher.addAssignment({ id: 'a4', tags: ['tag1'], priority: 40 });

            const assignments = await matcher.getAllAssignments();
            expect(assignments).to.be.an('array');
            expect(assignments).to.have.lengthOf(4);
            expect(assignments.map(a => a.id)).to.include.members(['a1', 'a2', 'a3', 'a4']);
        });
    });

    describe('getAssignmentCounts', function () {
        it('should return zero counts when no assignments exist', async function () {
            const counts = await matcher.getAssignmentCounts();
            expect(counts).to.deep.equal({
                queued: 0,
                pending: 0,
                accepted: 0,
                total: 0,
            });
        });

        it('should return correct count for queued assignments', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });

            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(2);
            expect(counts.pending).to.equal(0);
            expect(counts.accepted).to.equal(0);
            expect(counts.total).to.equal(2);
        });

        it('should return correct count for pending assignments', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1', 'tag2'] });
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });

            await matcher.matchUsersAssignments('u1');

            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(0);
            expect(counts.pending).to.equal(2);
            expect(counts.accepted).to.equal(0);
            expect(counts.total).to.equal(2);
        });

        it('should return correct count for accepted assignments', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(0);
            expect(counts.pending).to.equal(0);
            expect(counts.accepted).to.equal(1);
            expect(counts.total).to.equal(1);
        });

        it('should return correct counts across all statuses', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1', 'tag2', 'tag3'] });
            
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });
            await matcher.addAssignment({ id: 'a3', tags: ['tag3'], priority: 30 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            // Add more to queue
            await matcher.addAssignment({ id: 'a4', tags: ['tag1'], priority: 40 });
            await matcher.addAssignment({ id: 'a5', tags: ['tag1'], priority: 50 });

            const counts = await matcher.getAssignmentCounts();
            expect(counts.queued).to.equal(2);  // a4, a5
            expect(counts.pending).to.equal(2); // a2, a3
            expect(counts.accepted).to.equal(1); // a1
            expect(counts.total).to.equal(5);
        });
    });

    describe('getAssignment', function () {
        it('should return null for non-existent assignment', async function () {
            const assignment = await matcher.getAssignment('nonexistent');
            expect(assignment).to.be.null;
        });

        it('should return queued assignment with status', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });

            const assignment = await matcher.getAssignment('a1');
            expect(assignment).to.not.be.null;
            expect(assignment!.id).to.equal('a1');
            expect(assignment!._status).to.equal('queued');
        });

        it('should return pending assignment with status', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });

            await matcher.matchUsersAssignments('u1');

            const assignment = await matcher.getAssignment('a1');
            expect(assignment).to.not.be.null;
            expect(assignment!.id).to.equal('a1');
            expect(assignment!._status).to.equal('pending');
        });

        it('should return accepted assignment with status', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            const assignment = await matcher.getAssignment('a1');
            expect(assignment).to.not.be.null;
            expect(assignment!.id).to.equal('a1');
            expect(assignment!._status).to.equal('accepted');
        });
    });

    describe('getAssignmentsByIds', function () {
        it('should return empty array for empty ids', async function () {
            const assignments = await matcher.getAssignmentsByIds([]);
            expect(assignments).to.be.an('array');
            expect(assignments).to.have.lengthOf(0);
        });

        it('should return only found assignments', async function () {
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });

            const assignments = await matcher.getAssignmentsByIds(['a1', 'nonexistent', 'a2']);
            expect(assignments).to.be.an('array');
            expect(assignments).to.have.lengthOf(2);
            expect(assignments.map(a => a.id)).to.include.members(['a1', 'a2']);
        });

        it('should return assignments from different statuses', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1', 'tag2'] });
            
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag2'], priority: 20 });
            await matcher.addAssignment({ id: 'a3', tags: ['tag1'], priority: 30 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            // a1 = accepted, a2 = pending, add a4 as queued
            await matcher.addAssignment({ id: 'a4', tags: ['tag1'], priority: 40 });

            const assignments = await matcher.getAssignmentsByIds(['a1', 'a2', 'a4']);
            expect(assignments).to.have.lengthOf(3);
            
            const statusMap = Object.fromEntries(assignments.map(a => [a.id, (a as any)._status]));
            expect(statusMap['a1']).to.equal('accepted');
            expect(statusMap['a2']).to.equal('pending');
            expect(statusMap['a4']).to.equal('queued');
        });
    });

    describe('getAssignmentsPaginated', function () {
        it('should return empty result when no assignments exist', async function () {
            const result = await matcher.getAssignmentsPaginated();
            expect(result.assignments).to.be.an('array');
            expect(result.assignments).to.have.lengthOf(0);
            expect(result.nextCursor).to.be.null;
            expect(result.hasMore).to.be.false;
        });

        it('should return assignments with default limit', async function () {
            for (let i = 0; i < 5; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['tag1'], priority: i });
            }

            const result = await matcher.getAssignmentsPaginated();
            expect(result.assignments).to.have.lengthOf(5);
            expect(result.hasMore).to.be.false;
        });

        it('should respect limit parameter', async function () {
            for (let i = 0; i < 10; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['tag1'], priority: i });
            }

            const result = await matcher.getAssignmentsPaginated({ limit: 3 });
            expect(result.assignments).to.have.lengthOf(3);
            expect(result.hasMore).to.be.true;
            expect(result.nextCursor).to.not.be.null;
        });

        it('should paginate through all assignments', async function () {
            for (let i = 0; i < 10; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['tag1'], priority: i });
            }

            const allIds: string[] = [];
            let cursor: string | null | undefined = undefined;
            let iterations = 0;
            const maxIterations = 10;

            while (iterations < maxIterations) {
                const result: { assignments: Assignment[]; nextCursor: string | null; hasMore: boolean } = 
                    await matcher.getAssignmentsPaginated({ 
                        cursor: cursor ?? undefined, 
                        limit: 3 
                    });
                allIds.push(...result.assignments.map((a) => a.id));
                cursor = result.nextCursor;
                iterations++;
                if (!cursor) break;
            }

            expect(allIds).to.have.lengthOf(10);
            for (let i = 0; i < 10; i++) {
                expect(allIds).to.include(`a${i}`);
            }
        });

        it('should filter by queued status', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag1'], priority: 20 });

            await matcher.matchUsersAssignments('u1');
            
            // a1 and a2 are now pending, add more to queue
            await matcher.addAssignment({ id: 'a3', tags: ['tag1'], priority: 30 });

            const result = await matcher.getAssignmentsPaginated({ status: 'queued' });
            expect(result.assignments).to.have.lengthOf(1);
            expect(result.assignments[0].id).to.equal('a3');
            expect(result.assignments[0]._status).to.equal('queued');
        });

        it('should filter by pending status', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag1'], priority: 20 });

            await matcher.matchUsersAssignments('u1');
            
            await matcher.addAssignment({ id: 'a3', tags: ['tag1'], priority: 30 });

            const result = await matcher.getAssignmentsPaginated({ status: 'pending' });
            expect(result.assignments).to.have.lengthOf(2);
            expect(result.assignments.map(a => a.id)).to.include.members(['a1', 'a2']);
            result.assignments.forEach(a => {
                expect((a as any)._status).to.equal('pending');
            });
        });

        it('should filter by accepted status', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag1'], priority: 20 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');
            
            await matcher.addAssignment({ id: 'a3', tags: ['tag1'], priority: 30 });

            const result = await matcher.getAssignmentsPaginated({ status: 'accepted' });
            expect(result.assignments).to.have.lengthOf(1);
            expect(result.assignments[0].id).to.equal('a1');
            expect(result.assignments[0]._status).to.equal('accepted');
        });

        it('should include total when requested', async function () {
            for (let i = 0; i < 10; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['tag1'], priority: i });
            }

            const result = await matcher.getAssignmentsPaginated({ 
                limit: 3, 
                includeTotal: true 
            });
            expect(result.total).to.equal(10);
        });

        it('should include total for specific status', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            
            for (let i = 0; i < 5; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['tag1'], priority: i });
            }

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a0');
            await matcher.acceptAssignment('u1', 'a1');

            // Add more to queue
            for (let i = 5; i < 8; i++) {
                await matcher.addAssignment({ id: `a${i}`, tags: ['tag1'], priority: i });
            }

            const queuedResult = await matcher.getAssignmentsPaginated({ 
                status: 'queued', 
                includeTotal: true 
            });
            expect(queuedResult.total).to.equal(3);

            const pendingResult = await matcher.getAssignmentsPaginated({ 
                status: 'pending', 
                includeTotal: true 
            });
            expect(pendingResult.total).to.equal(3); // a2, a3, a4

            const acceptedResult = await matcher.getAssignmentsPaginated({ 
                status: 'accepted', 
                includeTotal: true 
            });
            expect(acceptedResult.total).to.equal(2); // a0, a1
        });

        it('should paginate across multiple statuses with status=all', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            
            // Add assignments that will end up in different statuses
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.addAssignment({ id: 'a2', tags: ['tag1'], priority: 20 });

            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            // a1 = accepted, a2 = pending
            // Add more to queue
            await matcher.addAssignment({ id: 'a3', tags: ['tag1'], priority: 30 });
            await matcher.addAssignment({ id: 'a4', tags: ['tag1'], priority: 40 });

            const allIds: string[] = [];
            let cursor: string | null | undefined = undefined;
            let iterations = 0;

            while (iterations < 10) {
                const result: { assignments: Assignment[]; nextCursor: string | null; hasMore: boolean } = 
                    await matcher.getAssignmentsPaginated({ 
                        cursor: cursor ?? undefined, 
                        limit: 1,
                        status: 'all'
                    });
                allIds.push(...result.assignments.map((a) => a.id));
                cursor = result.nextCursor;
                iterations++;
                if (!cursor) break;
            }

            expect(allIds).to.have.lengthOf(4);
            expect(allIds).to.include.members(['a1', 'a2', 'a3', 'a4']);
        });

        it('should add _status property to each assignment', async function () {
            await matcher.addUser({ id: 'u1', tags: ['tag1'] });
            
            await matcher.addAssignment({ id: 'a1', tags: ['tag1'], priority: 10 });
            await matcher.matchUsersAssignments('u1');
            await matcher.acceptAssignment('u1', 'a1');

            await matcher.addAssignment({ id: 'a2', tags: ['tag1'], priority: 20 });
            await matcher.matchUsersAssignments('u1');

            await matcher.addAssignment({ id: 'a3', tags: ['tag1'], priority: 30 });

            const result = await matcher.getAssignmentsPaginated({ status: 'all' });
            
            const statusMap = Object.fromEntries(
                result.assignments.map(a => [a.id, (a as any)._status])
            );
            
            expect(statusMap['a1']).to.equal('accepted');
            expect(statusMap['a2']).to.equal('pending');
            expect(statusMap['a3']).to.equal('queued');
        });
    });

    describe('Large dataset pagination performance', function () {
        it('should handle pagination with many assignments efficiently', async function () {
            const count = 500;
            
            // Add many assignments
            for (let i = 0; i < count; i++) {
                await matcher.addAssignment({ 
                    id: `a${i}`, 
                    tags: ['tag1'], 
                    priority: i 
                });
            }

            const startTime = Date.now();
            
            // Paginate through all
            const allIds: string[] = [];
            let cursor: string | null | undefined = undefined;
            let pages = 0;

            while (pages < 20) {
                const result: { assignments: Assignment[]; nextCursor: string | null; hasMore: boolean } = 
                    await matcher.getAssignmentsPaginated({ 
                        cursor: cursor ?? undefined, 
                        limit: 100 
                    });
                allIds.push(...result.assignments.map((a) => a.id));
                cursor = result.nextCursor;
                pages++;
                if (!cursor) break;
            }

            const elapsed = Date.now() - startTime;
            
            expect(allIds).to.have.lengthOf(count);
            expect(pages).to.be.lessThanOrEqual(10); // Should complete in reasonable pages
            // This is just a sanity check - actual performance depends on Redis
            expect(elapsed).to.be.lessThan(5000); // Should complete in under 5 seconds
        });
    });
});
