import { expect } from 'chai';
import AssignmentMatcher from '../src/matcher.class';
import { createClient } from 'redis';

describe('Assignment removal tests', () => {
    let matcher: AssignmentMatcher;
    const redisUrl = 'redis://localhost:6379';
    const client = createClient({ url: redisUrl });

    before(async () => {
        await client.connect();
        matcher = new AssignmentMatcher(client, {
            redisPrefix: 'test-removal:',
        });
    });

    after(async () => {
        await client.flushAll();
        await client.disconnect();
    });

    beforeEach(async () => {
        await client.flushAll();
    });

    it('should remove queued assignment completely', async () => {
        await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
        
        // Verify it exists
        let a = await matcher.getAssignment('a1');
        expect(a).to.not.be.null;

        // Remove it
        await matcher.removeAssignment('a1');

        // Verify it's gone
        a = await matcher.getAssignment('a1');
        expect(a).to.be.null;

        const counts = await matcher.getAssignmentCounts();
        expect(counts.total).to.equal(0);
    });

    it('should remove pending assignment and from user backlog', async () => {
        await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        
        // Match it to u1
        await matcher.matchUsersAssignments();
        
        // Verify it's pending and in u1's backlog
        let a = await matcher.getAssignment('a1');
        expect((a as any)._status).to.equal('pending');
        
        let userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.have.lengthOf(1);
        expect(userAssignments[0]).to.equal('a1');

        // Remove it
        await matcher.removeAssignment('a1');

        // Verify it's gone from everywhere
        a = await matcher.getAssignment('a1');
        expect(a).to.be.null;

        userAssignments = await matcher.getCurrentAssignmentsForUser('u1');
        expect(userAssignments).to.have.lengthOf(0);

        const counts = await matcher.getAssignmentCounts();
        expect(counts.pending).to.equal(0);
    });

    it('should remove accepted assignment', async () => {
        await matcher.addAssignment({ id: 'a1', tags: ['t1'] });
        await matcher.addUser({ id: 'u1', tags: ['t1'] });
        await matcher.matchUsersAssignments();
        await matcher.acceptAssignment('u1', 'a1');

        // Verify it's accepted
        let a = await matcher.getAssignment('a1');
        expect((a as any)._status).to.equal('accepted');

        // Remove it
        await matcher.removeAssignment('a1');

        // Verify it's gone
        a = await matcher.getAssignment('a1');
        expect(a).to.be.null;

        const counts = await matcher.getAssignmentCounts();
        expect(counts.accepted).to.equal(0);
    });
});
