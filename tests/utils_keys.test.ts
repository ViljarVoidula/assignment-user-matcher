import { expect } from 'chai';
import { createKeyBuilders } from '../src/utils/keys';

describe('Redis key builders (public naming contract)', function () {
    const keys = createKeyBuilders({ prefix: 'app:' });

    it('prefixes every key with the configured prefix', function () {
        // Walk the whole builder surface so a rename of any builder is a
        // deliberate, review-visible event. Parameterized builders are
        // called with a stable sample id.
        const samples: Record<string, string> = {};
        for (const [name, builder] of Object.entries(keys)) {
            samples[name] = (builder as (...args: string[]) => string)('id');
        }
        for (const [name, key] of Object.entries(samples)) {
            expect(key, `builder ${name}`).to.match(/^app:/);
        }
    });

    it('keeps the SLA and lifecycle key names stable', function () {
        expect(keys.acceptedAssignmentsExpiry()).to.equal('app:assignments:accepted:expiry');
        expect(keys.assignmentsSlaExpiry()).to.equal('app:assignments:sla:expiry');
        expect(keys.slaStats()).to.equal('app:sla:stats');
        expect(keys.slaTagStats('billing')).to.equal('app:sla:tag:billing:stats');
        expect(keys.assignmentsQueuedAt()).to.equal('app:assignments:queuedAt');
        expect(keys.parkedAssignments()).to.equal('app:assignments:parked');
        expect(keys.scheduledAssignments()).to.equal('app:assignments:scheduled');
        expect(keys.scheduledActivateAt()).to.equal('app:assignments:scheduled:activateAt');
        expect(keys.scheduleNotAfter()).to.equal('app:assignments:schedule:notAfter');
        expect(keys.eventStreamDeadLetter()).to.equal('app:events:deadletter');
        expect(keys.reliabilityMetrics()).to.equal('app:reliability:metrics');
    });

    it('embeds the user/assignment/tag id in scoped keys', function () {
        expect(keys.userAssignments('u1')).to.equal('app:user:u1:assignments');
        expect(keys.userRejected('u1')).to.equal('app:user:u1:rejected');
        expect(keys.tagAssignments('english')).to.equal('app:tag:english:assignments');
        expect(keys.assignmentPriority('a1')).to.equal('app:assignment:a1:priority');
    });

    it('supports an empty prefix for legacy deployments', function () {
        const bare = createKeyBuilders({ prefix: '' });
        expect(bare.users()).to.equal('users');
        expect(bare.assignments()).to.equal('assignments');
    });
});
